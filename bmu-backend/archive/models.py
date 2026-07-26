from django.db import models
from django.conf import settings


class PastEvent(models.Model):
    """Archive of past events"""
    
    EVENT_TYPE_CHOICES = [
        ('conference', 'Conference'),
        ('ceremony', 'Ceremony'),
        ('symposium', 'Symposium'),
        ('workshop', 'Workshop'),
        ('outreach', 'Outreach'),
        ('social', 'Social'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
    ]
    
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('research', 'Research'),
        ('community', 'Community'),
        ('professional', 'Professional'),
        ('alumni', 'Alumni'),
        ('student', 'Student'),
    ]
    
    title = models.CharField(max_length=300)
    description = models.TextField()
    
    # Event Details
    event_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=300)
    
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Archive Media
    featured_image = models.ImageField(upload_to='archive/events/', blank=True, null=True)
    gallery_images = models.TextField(blank=True, help_text="Comma-separated image paths")
    video_url = models.URLField(blank=True, null=True)
    
    # Archive Content
    summary = models.TextField(blank=True, help_text="Event summary/recap")
    key_highlights = models.TextField(blank=True, help_text="Key highlights from the event")
    attendees_count = models.PositiveIntegerField(null=True, blank=True)
    
    # Documents
    proceedings_document = models.FileField(upload_to='archive/proceedings/', blank=True, null=True)
    presentations_zip = models.FileField(upload_to='archive/presentations/', blank=True, null=True)
    
    # Related
    speakers = models.TextField(blank=True, help_text="List of speakers")
    
    created_at = models.DateTimeField(auto_now_add=True)
    archived_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True)

    class Meta:
        verbose_name = "Past Event"
        verbose_name_plural = "Past Events"
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.title} ({self.event_date.year})"


class ArchivedNews(models.Model):
    """Archive of old news items"""
    
    CATEGORY_CHOICES = [
        ('research', 'Research'),
        ('community', 'Community'),
        ('academic', 'Academic'),
        ('announcement', 'Announcement'),
        ('event', 'Event'),
        ('achievement', 'Achievement'),
    ]
    
    title = models.CharField(max_length=300)
    excerpt = models.TextField()
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Media
    featured_image = models.ImageField(upload_to='archive/news/', blank=True, null=True)
    
    # Original Publishing
    author = models.CharField(max_length=200)
    original_published_at = models.DateTimeField()
    
    # Archive
    archived_at = models.DateTimeField(auto_now_add=True)
    archived_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True)
    
    # Reference to original (if exists)
    original_id = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Archived News"
        verbose_name_plural = "Archived News Items"
        ordering = ['-original_published_at']

    def __str__(self):
        return f"[ARCHIVED] {self.title}"


class HistoricalDocument(models.Model):
    """University historical documents and records"""
    
    DOCUMENT_TYPE_CHOICES = [
        ('charter', 'University Charter'),
        ('statute', 'Statute'),
        ('regulation', 'Regulation'),
        ('circular', 'Circular'),
        ('report', 'Annual Report'),
        ('minutes', 'Minutes'),
        ('correspondence', 'Correspondence'),
        ('photograph', 'Historical Photograph'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    
    # Date
    document_date = models.DateField(null=True, blank=True)
    document_year = models.PositiveIntegerField(null=True, blank=True)
    
    # File
    document_file = models.FileField(upload_to='archive/documents/')
    
    # Metadata
    tags = models.CharField(max_length=500, blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    
    # Access
    is_public = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True)

    class Meta:
        verbose_name = "Historical Document"
        verbose_name_plural = "Historical Documents"
        ordering = ['-document_year', 'title']

    def __str__(self):
        return f"{self.title} ({self.document_year or 'Unknown Year'})"


class UniversityTimeline(models.Model):
    """Key events in university history"""
    
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField(null=True, blank=True)
    day = models.PositiveIntegerField(null=True, blank=True)
    
    title = models.CharField(max_length=300)
    description = models.TextField()
    
    # Media
    image = models.ImageField(upload_to='archive/timeline/', blank=True, null=True)
    
    # Category
    category = models.CharField(max_length=50, blank=True, 
                                 help_text="e.g., 'founding', 'milestone', 'expansion'")
    
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "University Timeline Event"
        verbose_name_plural = "University Timeline"
        ordering = ['year', 'month', 'day', 'display_order']

    def __str__(self):
        return f"{self.year} - {self.title[:50]}"


class PastLeader(models.Model):
    """Past university leadership (VCs, Deans, etc.)"""
    
    POSITION_CHOICES = [
        ('vc', 'Vice Chancellor'),
        ('deputy_vc', 'Deputy Vice Chancellor'),
        ('registrar', 'Registrar'),
        ('bursar', 'Bursar'),
        ('librarian', 'University Librarian'),
        ('dean', 'Dean'),
        ('head_of_dept', 'Head of Department'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=50, default='Prof.')
    position = models.CharField(max_length=20, choices=POSITION_CHOICES)
    specific_role = models.CharField(max_length=200, blank=True, 
                                      help_text="e.g., 'Dean, College of Medicine'")
    
    # Tenure
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(null=True, blank=True)
    
    # Profile
    photo = models.ImageField(upload_to='archive/leaders/', blank=True, null=True)
    biography = models.TextField(blank=True)
    achievements = models.TextField(blank=True)
    
    # Contact (if applicable)
    current_email = models.EmailField(blank=True, null=True)
    
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Past Leader"
        verbose_name_plural = "Past Leaders"
        ordering = ['-start_year', 'display_order']

    def __str__(self):
        return f"{self.title} {self.name} - {self.get_position_display()}"

    @property
    def tenure_display(self):
        if self.end_year:
            return f"{self.start_year} - {self.end_year}"
        return f"{self.start_year} - Present"
