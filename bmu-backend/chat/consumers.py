import json
import logging
import time
import html
from collections import defaultdict
from datetime import timedelta
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import Conversation, Message, AgentSession
from .auto_responder import get_bot_response

logger = logging.getLogger(__name__)

MAX_MESSAGE_LENGTH = 2000
RATE_LIMIT_MESSAGES = 20
RATE_LIMIT_WINDOW = 60  # seconds
MAX_CONVERSATIONS_PER_SESSION = 1


def sanitize_content(text: str) -> str:
    text = html.unescape(text)
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    return text.strip()[:MAX_MESSAGE_LENGTH]


class ChatConsumer(AsyncWebsocketConsumer):
    _rate_tracker: dict = defaultdict(list)

    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'chat_{self.session_id}'
        self._connected_at = time.monotonic()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        conversation = await self.get_or_create_conversation()
        agent_online = await self.is_any_agent_online()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'session_id': str(self.session_id),
            'agent_online': agent_online,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def _is_rate_limited(self) -> bool:
        now = time.monotonic()
        key = self.session_id
        self._rate_tracker[key] = [
            t for t in self._rate_tracker[key] if now - t < RATE_LIMIT_WINDOW
        ]
        if len(self._rate_tracker[key]) >= RATE_LIMIT_MESSAGES:
            return True
        self._rate_tracker[key].append(now)
        return False

    async def receive(self, text_data):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except (json.JSONDecodeError, TypeError):
            await self.send(text_data=json.dumps({
                'type': 'error',
                'content': 'Invalid message format.',
            }))
            return

        if not isinstance(data, dict):
            return

        msg_type = data.get('type')

        if msg_type == 'start_conversation':
            conversation = await self.get_or_create_conversation()
            is_new = await self.is_new_conversation(conversation)
            if is_new:
                greeting = ("Hello! Welcome to Bayelsa Medical University. "
                             "I'm BMU Support Bot, your virtual assistant. "
                             "I can help you with information about our programs, admissions, "
                             "campus life, and more. How can I assist you today?")
                bot_message = await self.save_message(conversation, 'bot', greeting)
                await self.send(text_data=json.dumps({
                    'type': 'new_message',
                    'id': bot_message.id,
                    'role': 'bot',
                    'sender_name': 'BMU Support Bot',
                    'content': greeting,
                    'created_at': bot_message.created_at.isoformat(),
                }))

        elif msg_type == 'message':
            if self._is_rate_limited():
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'content': 'You are sending messages too quickly. Please wait a moment.',
                }))
                return

            content = sanitize_content(str(data.get('content', '')))
            if not content:
                return

            conversation = await self.get_or_create_conversation()

            if conversation.status == 'ended':
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'system_message',
                        'content': 'This conversation has ended. Please start a new conversation.',
                    }
                )
                return

            message = await self.save_message(conversation, 'visitor', content)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': message.id,
                    'role': 'visitor',
                    'content': content,
                    'created_at': message.created_at.isoformat(),
                }
            )

            agent_assigned = conversation.agent_assigned
            should_bot_respond = True

            if agent_assigned:
                if conversation.agent_last_response_at:
                    time_since_response = timezone.now() - conversation.agent_last_response_at
                    if time_since_response < timedelta(minutes=10):
                        should_bot_respond = False
                    else:
                        await self.notify_agent_timeout(conversation)
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                'type': 'system_message',
                                'content': 'Our agents are currently busy. The bot will assist you for now.',
                            }
                        )

            if should_bot_respond:
                try:
                    bot_reply = await database_sync_to_async(get_bot_response)(content)
                except Exception:
                    logger.exception("Bot response error for session %s", self.session_id)
                    bot_reply = None

                if bot_reply:
                    bot_message = await self.save_message(conversation, 'bot', bot_reply)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'id': bot_message.id,
                            'role': 'bot',
                            'sender_name': 'BMU Support Bot',
                            'content': bot_reply,
                            'created_at': bot_message.created_at.isoformat(),
                        }
                    )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'agent_notified',
                        'content': content,
                    }
                )

        elif msg_type == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_indicator',
                    'role': data.get('role', 'visitor'),
                    'is_typing': bool(data.get('is_typing', False)),
                }
            )

        elif msg_type == 'agent_message':
            content = sanitize_content(str(data.get('content', '')))
            if not content:
                return
            conversation = await self.get_or_create_conversation()

            user = self.scope.get('user')
            if user and user.is_authenticated:
                await self.assign_agent_to_conversation(conversation, user)

            message = await self.save_message(conversation, 'agent', content)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': message.id,
                    'role': 'agent',
                    'content': content,
                    'created_at': message.created_at.isoformat(),
                }
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'agent_joined',
                    'agent_name': user.get_full_name() or user.email if user else 'Agent',
                }
            )

        elif msg_type == 'agent_join':
            user = self.scope.get('user')
            if user and user.is_authenticated:
                conversation = await self.get_or_create_conversation()
                await self.assign_agent_to_conversation(conversation, user)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'agent_joined',
                        'agent_name': user.get_full_name() or user.email,
                    }
                )

        elif msg_type == 'end_conversation':
            conversation = await self.get_or_create_conversation()
            goodbye = ("Thank you for chatting with Bayelsa Medical University! "
                       "We hope we were able to assist you. Have a wonderful day! "
                       "Feel free to start a new conversation anytime if you have more questions.")
            goodbye_msg = await self.save_message(conversation, 'bot', goodbye)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': goodbye_msg.id,
                    'role': 'bot',
                    'sender_name': 'BMU Support Bot',
                    'content': goodbye,
                    'created_at': goodbye_msg.created_at.isoformat(),
                }
            )
            await self.end_conversation(conversation)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'conversation_ended',
                }
            )

    async def chat_message(self, event):
        msg = {
            'type': 'new_message',
            'id': event['id'],
            'role': event['role'],
            'content': event['content'],
            'created_at': event['created_at'],
        }
        if 'sender_name' in event:
            msg['sender_name'] = event['sender_name']
        await self.send(text_data=json.dumps(msg))

    async def typing_indicator(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'role': event['role'],
            'is_typing': event['is_typing'],
        }))

    async def agent_notified(self, event):
        user = self.scope.get('user')
        if user and user.is_authenticated and hasattr(user, 'agent_session'):
            await self.send(text_data=json.dumps({
                'type': 'new_visitor_message',
                'content': event['content'],
            }))

    async def agent_online_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'agent_status',
            'is_online': event['is_online'],
        }))

    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'content': event['content'],
        }))

    async def agent_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'agent_joined',
            'agent_name': event['agent_name'],
        }))

    async def conversation_ended(self, event):
        await self.send(text_data=json.dumps({
            'type': 'conversation_ended',
        }))

    @database_sync_to_async
    def is_new_conversation(self, conversation):
        return not Message.objects.filter(conversation=conversation).exists()

    @database_sync_to_async
    def get_or_create_conversation(self):
        conversation, _ = Conversation.objects.get_or_create(
            session_id=self.session_id
        )
        return conversation

    @database_sync_to_async
    def save_message(self, conversation, role, content):
        return Message.objects.create(
            conversation=conversation,
            role=role,
            content=content
        )

    @database_sync_to_async
    def is_any_agent_online(self):
        return AgentSession.objects.filter(is_online=True).exists()

    @database_sync_to_async
    def assign_agent_to_conversation(self, conversation, user):
        conversation.agent_assigned = user
        conversation.agent_assigned_at = timezone.now()
        conversation.agent_last_response_at = timezone.now()
        conversation.status = 'agent_handling'
        conversation.save()

    @database_sync_to_async
    def end_conversation(self, conversation):
        conversation.status = 'ended'
        conversation.is_active = False
        conversation.save()

    @database_sync_to_async
    def notify_agent_timeout(self, conversation):
        conversation.agent_assigned = None
        conversation.agent_assigned_at = None
        conversation.agent_last_response_at = None
        conversation.status = 'active'
        conversation.save()
