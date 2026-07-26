from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from .models import Conversation, Message


@login_required
def agent_dashboard(request):
    """Dashboard for agents to view and manage conversations"""
    active_conversations = Conversation.objects.filter(
        is_active=True,
        status__in=['active', 'agent_handling']
    ).order_by('-updated_at')
    
    return render(request, 'chat/agent_dashboard.html', {
        'conversations': active_conversations,
    })


@login_required
@require_http_methods(['POST'])
def join_conversation(request, conversation_id):
    """Agent joins a conversation"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Check if conversation is already handled by another agent
        if conversation.agent_assigned and conversation.agent_assigned != request.user:
            return JsonResponse({
                'success': False,
                'error': 'Conversation is already being handled by another agent'
            }, status=400)
        
        conversation.agent_assigned = request.user
        conversation.agent_assigned_at = timezone.now()
        conversation.agent_last_response_at = timezone.now()
        conversation.status = 'agent_handling'
        conversation.save()
        
        return JsonResponse({'success': True})
    except Conversation.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Conversation not found'}, status=404)


@login_required
@require_http_methods(['POST'])
def leave_conversation(request, conversation_id):
    """Agent leaves a conversation"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        
        if conversation.agent_assigned != request.user:
            return JsonResponse({
                'success': False,
                'error': 'You are not handling this conversation'
            }, status=400)
        
        conversation.agent_assigned = None
        conversation.agent_assigned_at = None
        conversation.agent_last_response_at = None
        conversation.status = 'active'
        conversation.save()
        
        return JsonResponse({'success': True})
    except Conversation.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Conversation not found'}, status=404)


@login_required
def conversation_messages(request, conversation_id):
    """Get messages for a conversation"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        messages = Message.objects.filter(
            conversation=conversation
        ).order_by('created_at')
        
        messages_data = [{
            'id': msg.id,
            'role': msg.role,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
        } for msg in messages]
        
        return JsonResponse({'messages': messages_data})
    except Conversation.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Conversation not found'}, status=404)


@login_required
def agent_chat(request, conversation_id):
    """Chat interface for agents to converse with visitors"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Auto-assign the agent if not already assigned
        if not conversation.agent_assigned:
            conversation.agent_assigned = request.user
            conversation.agent_assigned_at = timezone.now()
            conversation.agent_last_response_at = timezone.now()
            conversation.status = 'agent_handling'
            conversation.save()
        
        return render(request, 'chat/agent_chat.html', {
            'conversation': conversation,
        })
    except Conversation.DoesNotExist:
        return render(request, 'chat/agent_chat.html', {
            'error': 'Conversation not found'
        })
