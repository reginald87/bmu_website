from django.contrib import admin
from .models import Conversation, Message, AgentSession, ChatAutoResponse


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'visitor_name', 'created_at', 'updated_at', 'is_active', 'status', 'agent_assigned']
    search_fields = ['session_id', 'visitor_name', 'visitor_email']
    list_filter = ['status', 'is_active', 'created_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'role', 'short_content', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['content']

    def short_content(self, obj):
        return obj.content[:60]


@admin.register(AgentSession)
class AgentSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_online', 'last_seen']
    list_filter = ['is_online']


@admin.register(ChatAutoResponse)
class ChatAutoResponseAdmin(admin.ModelAdmin):
    list_display = ['trigger_keywords', 'category', 'priority', 'is_active', 'use_count', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['trigger_keywords', 'response_text']
    list_editable = ['priority', 'is_active']
