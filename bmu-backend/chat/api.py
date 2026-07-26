from ninja import Router, Schema, Field
from ninja.pagination import paginate
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Conversation, Message, AgentSession, ChatAutoResponse


# Schemas

class ChatAutoResponseSchema(Schema):
    id: int
    trigger_keywords: str
    question_pattern: str
    response_text: str
    category: str
    category_display: str = Field(..., alias="get_category_display")
    priority: int
    is_active: bool
    use_count: int
    created_at: str
    updated_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


class ChatAutoResponseCreateSchema(Schema):
    trigger_keywords: str
    question_pattern: str = ''
    response_text: str
    category: str = 'general'
    priority: int = 0
    is_active: bool = True


class ConversationMessageSchema(Schema):
    id: int
    role: str
    content: str
    created_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()


class ConversationListSchema(Schema):
    id: int
    session_id: str
    visitor_name: str
    visitor_email: str
    status: str
    is_active: bool
    agent_assigned_id: Optional[int] = None
    agent_assigned_name: str = ''
    created_at: str
    updated_at: str
    last_message: str = ''
    message_count: int = 0

    @staticmethod
    def resolve_session_id(obj):
        return str(obj.session_id)

    @staticmethod
    def resolve_agent_assigned_id(obj):
        return obj.agent_assigned_id

    @staticmethod
    def resolve_agent_assigned_name(obj):
        if obj.agent_assigned:
            return obj.agent_assigned.full_name
        return ''

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


class ConversationDetailSchema(Schema):
    id: int
    session_id: str
    visitor_name: str
    visitor_email: str
    status: str
    is_active: bool
    agent_assigned_id: Optional[int] = None
    agent_assigned_name: str = ''
    agent_assigned_at: Optional[str] = None
    created_at: str
    updated_at: str
    messages: List[ConversationMessageSchema] = []

    @staticmethod
    def resolve_session_id(obj):
        return str(obj.session_id)

    @staticmethod
    def resolve_agent_assigned_id(obj):
        return obj.agent_assigned_id

    @staticmethod
    def resolve_agent_assigned_name(obj):
        if obj.agent_assigned:
            return obj.agent_assigned.full_name
        return ''

    @staticmethod
    def resolve_agent_assigned_at(obj):
        return obj.agent_assigned_at.isoformat() if obj.agent_assigned_at else None

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


class ConversationStatsSchema(Schema):
    total: int = 0
    active: int = 0
    agent_handling: int = 0
    ended: int = 0
    unassigned: int = 0


class AgentStatusToggleSchema(Schema):
    is_online: bool


class SendMessageSchema(Schema):
    content: str


# Chat Admin Router (JWT auth)
chat_router = Router(auth=None)


@chat_router.get("/conversations", response=List[ConversationListSchema])
def list_conversations(request, status: Optional[str] = None, limit: int = 50):
    """List conversations for the agent dashboard"""
    if not request.user or not request.user.is_authenticated:
        return []
    qs = Conversation.objects.select_related('agent_assigned').all()
    if status:
        qs = qs.filter(status=status)
    qs = qs.order_by('-updated_at')[:limit]
    result = []
    for conv in qs:
        last_msg = conv.messages.order_by('-created_at').first()
        msg_count = conv.messages.count()
        result.append({
            'id': conv.id,
            'session_id': str(conv.session_id),
            'visitor_name': conv.visitor_name,
            'visitor_email': conv.visitor_email,
            'status': conv.status,
            'is_active': conv.is_active,
            'agent_assigned_id': conv.agent_assigned_id,
            'agent_assigned_name': conv.agent_assigned.full_name if conv.agent_assigned else '',
            'created_at': conv.created_at.isoformat(),
            'updated_at': conv.updated_at.isoformat(),
            'last_message': last_msg.content[:100] if last_msg else '',
            'message_count': msg_count,
        })
    return result


@chat_router.get("/conversations/stats")
def conversation_stats(request):
    """Get conversation statistics"""
    if not request.user or not request.user.is_authenticated:
        return {'total': 0, 'active': 0, 'agent_handling': 0, 'ended': 0, 'unassigned': 0}
    total = Conversation.objects.count()
    active = Conversation.objects.filter(status='active').count()
    agent_handling = Conversation.objects.filter(status='agent_handling').count()
    ended = Conversation.objects.filter(status='ended').count()
    unassigned = Conversation.objects.filter(status='active', agent_assigned__isnull=True).count()
    return {
        'total': total,
        'active': active,
        'agent_handling': agent_handling,
        'ended': ended,
        'unassigned': unassigned,
    }


@chat_router.get("/conversations/{conversation_id}", response=ConversationDetailSchema)
def get_conversation(request, conversation_id: int):
    """Get conversation with full message history"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    conv = get_object_or_404(
        Conversation.objects.select_related('agent_assigned'),
        id=conversation_id
    )
    messages = conv.messages.order_by('created_at')
    return {
        'id': conv.id,
        'session_id': str(conv.session_id),
        'visitor_name': conv.visitor_name,
        'visitor_email': conv.visitor_email,
        'status': conv.status,
        'is_active': conv.is_active,
        'agent_assigned_id': conv.agent_assigned_id,
        'agent_assigned_name': conv.agent_assigned.full_name if conv.agent_assigned else '',
        'agent_assigned_at': conv.agent_assigned_at.isoformat() if conv.agent_assigned_at else None,
        'created_at': conv.created_at.isoformat(),
        'updated_at': conv.updated_at.isoformat(),
        'messages': [
            {'id': m.id, 'role': m.role, 'content': m.content, 'created_at': m.created_at.isoformat()}
            for m in messages
        ],
    }


@chat_router.post("/conversations/{conversation_id}/join")
def join_conversation(request, conversation_id: int):
    """Agent joins a conversation"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    conv = get_object_or_404(Conversation, id=conversation_id)
    if conv.agent_assigned and conv.agent_assigned != request.user:
        return {'error': 'Already handled by another agent'}
    conv.agent_assigned = request.user
    conv.agent_assigned_at = timezone.now()
    conv.agent_last_response_at = timezone.now()
    conv.status = 'agent_handling'
    conv.save()

    # Update agent session
    AgentSession.objects.update_or_create(
        user=request.user,
        defaults={'is_online': True, 'current_conversation': conv}
    )
    return {'ok': True, 'message': 'Joined conversation'}


@chat_router.post("/conversations/{conversation_id}/leave")
def leave_conversation(request, conversation_id: int):
    """Agent leaves a conversation"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    conv = get_object_or_404(Conversation, id=conversation_id)
    if conv.agent_assigned != request.user:
        return {'error': 'You are not handling this conversation'}
    conv.agent_assigned = None
    conv.agent_assigned_at = None
    conv.agent_last_response_at = None
    conv.status = 'active'
    conv.save()

    AgentSession.objects.filter(user=request.user).update(
        is_online=True, current_conversation=None
    )
    return {'ok': True, 'message': 'Left conversation'}


@chat_router.post("/conversations/{conversation_id}/end")
def end_conversation(request, conversation_id: int):
    """End a conversation"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    conv = get_object_or_404(Conversation, id=conversation_id)
    conv.status = 'ended'
    conv.is_active = False
    conv.save()
    return {'ok': True, 'message': 'Conversation ended'}


@chat_router.post("/conversations/{conversation_id}/send")
def send_agent_message(request, conversation_id: int, data: SendMessageSchema):
    """Send a message as agent (REST fallback for agents not using WebSocket)"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    content = data.content.strip()
    if not content:
        return {'error': 'Empty message'}
    conv = get_object_or_404(Conversation, id=conversation_id)

    # Auto-join if not assigned
    if not conv.agent_assigned:
        conv.agent_assigned = request.user
        conv.agent_assigned_at = timezone.now()
        conv.status = 'agent_handling'
        conv.save()

    conv.agent_last_response_at = timezone.now()
    conv.save(update_fields=['agent_last_response_at'])

    msg = Message.objects.create(conversation=conv, role='agent', content=content)
    return {
        'ok': True,
        'message': {
            'id': msg.id,
            'role': msg.role,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
        }
    }


@chat_router.post("/agent-status")
def toggle_agent_status(request, data: AgentStatusToggleSchema):
    """Toggle agent online status"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    session, _ = AgentSession.objects.update_or_create(
        user=request.user,
        defaults={'is_online': data.is_online}
    )
    return {'ok': True, 'is_online': session.is_online}


@chat_router.get("/auto-responses", response=List[ChatAutoResponseSchema])
def list_auto_responses(request, category: Optional[str] = None):
    """List all auto-response entries"""
    if not request.user or not request.user.is_authenticated:
        return []
    qs = ChatAutoResponse.objects.all()
    if category:
        qs = qs.filter(category=category)
    return qs


@chat_router.post("/auto-responses", response=ChatAutoResponseSchema)
def create_auto_response(request, data: ChatAutoResponseCreateSchema):
    """Create a new auto-response entry"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    ar = ChatAutoResponse.objects.create(
        trigger_keywords=data.trigger_keywords,
        question_pattern=data.question_pattern,
        response_text=data.response_text,
        category=data.category,
        priority=data.priority,
        is_active=data.is_active,
        created_by=request.user,
    )
    return ar


@chat_router.put("/auto-responses/{ar_id}", response=ChatAutoResponseSchema)
def update_auto_response(request, ar_id: int, data: ChatAutoResponseCreateSchema):
    """Update an auto-response entry"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    ar = get_object_or_404(ChatAutoResponse, id=ar_id)
    ar.trigger_keywords = data.trigger_keywords
    ar.question_pattern = data.question_pattern
    ar.response_text = data.response_text
    ar.category = data.category
    ar.priority = data.priority
    ar.is_active = data.is_active
    ar.save()
    return ar


@chat_router.delete("/auto-responses/{ar_id}")
def delete_auto_response(request, ar_id: int):
    """Delete an auto-response entry"""
    if not request.user or not request.user.is_authenticated:
        return {'error': 'Unauthorized'}
    ar = get_object_or_404(ChatAutoResponse, id=ar_id)
    ar.delete()
    return {'ok': True}
