from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('agent/dashboard/', views.agent_dashboard, name='agent_dashboard'),
    path('agent/chat/<int:conversation_id>/', views.agent_chat, name='agent_chat'),
    path('agent/join/<int:conversation_id>/', views.join_conversation, name='join_conversation'),
    path('agent/leave/<int:conversation_id>/', views.leave_conversation, name='leave_conversation'),
    path('conversation/<int:conversation_id>/messages/', views.conversation_messages, name='conversation_messages'),
]
