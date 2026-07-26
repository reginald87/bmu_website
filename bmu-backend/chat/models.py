import uuid
from django.db import models
from django.conf import settings


class Conversation(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    visitor_name = models.CharField(max_length=100, blank=True, default='')
    visitor_email = models.EmailField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Agent takeover
    agent_assigned = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='assigned_conversations',
        help_text="Agent currently handling this conversation"
    )
    agent_assigned_at = models.DateTimeField(null=True, blank=True, help_text="When agent took over")
    agent_last_response_at = models.DateTimeField(null=True, blank=True, help_text="Last agent response time")
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('agent_handling', 'Agent Handling'),
            ('ended', 'Ended'),
            ('bot_only', 'Bot Only'),
        ],
        default='active'
    )

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Conversation {self.session_id}"


class Message(models.Model):
    ROLE_CHOICES = [
        ('visitor', 'Visitor'),
        ('bot', 'Bot'),
        ('agent', 'Agent'),
    ]

    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.content[:50]}"


class AgentSession(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='agent_session'
    )
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)
    current_conversation = models.ForeignKey(
        Conversation, on_delete=models.SET_NULL,
        null=True, blank=True
    )

    def __str__(self):
        return f"Agent {self.user.email} {'online' if self.is_online else 'offline'}"


class ChatAutoResponse(models.Model):
    CATEGORY_CHOICES = [
        ('greeting', 'Greeting'),
        ('admissions', 'Admissions'),
        ('programs', 'Programs'),
        ('fees', 'Fees & Payments'),
        ('campus', 'Campus Life'),
        ('research', 'Research'),
        ('careers', 'Careers & Jobs'),
        ('contact', 'Contact Info'),
        ('general', 'General'),
        ('other', 'Other'),
    ]

    trigger_keywords = models.CharField(
        max_length=255,
        help_text="Comma-separated keywords/phrases that trigger this response"
    )
    question_pattern = models.CharField(
        max_length=255,
        blank=True, default='',
        help_text="Optional regex pattern for advanced matching"
    )
    response_text = models.TextField(
        help_text="The bot response to send"
    )
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='general'
    )
    priority = models.IntegerField(
        default=0,
        help_text="Higher priority responses are checked first"
    )
    is_active = models.BooleanField(default=True)
    use_count = models.IntegerField(
        default=0,
        help_text="Number of times this response has been used"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='created_auto_responses'
    )

    class Meta:
        ordering = ['-priority', '-use_count']

    def __str__(self):
        return f"[{self.category}] {self.trigger_keywords[:50]}"
