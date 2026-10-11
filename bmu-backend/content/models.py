import io
import os
import posixpath

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.db import models
from django.conf import settings
from django.utils import timezone
from PIL import Image, ImageOps

# Gallery image processing limits
GALLERY_THUMBNAIL_MAX = 600
GALLERY_IMAGE_MAX = 2000


def _reencode_image(file_obj, max_dim, force=False):
    """Return a re-encoded JPEG ContentFile with the longest edge capped at
    ``max_dim`` (aspect ratio preserved). Fixes EXIF orientation, flattens
    transparency onto white, and returns ``None`` when nothing changed."""
    img = Image.open(file_obj)
    img.load()
    img = ImageOps.exif_transpose(img)
    has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
    needs_work = force or has_alpha or max(img.size) > max_dim
    if not needs_work:
        return None
    if has_alpha:
        img = img.convert('RGBA')
    if has_alpha:
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    if max(img.size) > max_dim:
        img.thumbnail((max_dim, max_dim), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=88, optimize=True)
    return ContentFile(buf.getvalue())


class NewsItem(models.Model):
    """News and announcements"""
    
    CATEGORY_CHOICES = [
        ('research', 'Research'),
        ('community', 'Community'),
        ('academic', 'Academic'),
        ('announcement', 'Announcement'),
        ('event', 'Event'),
        ('achievement', 'Achievement'),
    ]
    
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(help_text="Short summary for listings")
    content = models.TextField(help_text="Full article content")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Media
    featured_image = models.ImageField(upload_to='news/', blank=True, null=True)
    
    # Publishing
    author = models.CharField(max_length=200)
    author_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True)
    published_at = models.DateTimeField()
    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # SEO
    meta_description = models.CharField(max_length=300, blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    # Analytics
    views_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "News Item"
        verbose_name_plural = "News Items"
        ordering = ['-published_at']

    def __str__(self):
        return self.title


class Event(models.Model):
    """University events, conferences, workshops"""
    
    TYPE_CHOICES = [
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
    slug = models.SlugField(unique=True)
    description = models.TextField()
    
    # Event Details
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=300)
    
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    # Media
    featured_image = models.ImageField(upload_to='events/', blank=True, null=True)
    
    # Registration
    registration_open = models.BooleanField(default=False)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    registered_count = models.PositiveIntegerField(default=0)
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Registration fee (leave blank for free)")
    currency = models.CharField(max_length=3, default='NGN', choices=[('NGN', 'NGN'), ('USD', 'USD'), ('GBP', 'GBP'), ('EUR', 'EUR')])
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    
    # Additional Info
    speakers = models.TextField(blank=True, help_text="One speaker per line")
    agenda = models.TextField(blank=True)
    registration_link = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        ordering = ['-event_date', '-start_time']

    def __str__(self):
        return self.title

    @property
    def time_display(self):
        if self.end_time:
            return f"{self.start_time.strftime('%I:%M %p')} - {self.end_time.strftime('%I:%M %p')}"
        return self.start_time.strftime('%I:%M %p')


class PageContentSimple(models.Model):
    """CMS for static pages (About, Contact, etc.) - simpler key-based model"""
    
    PAGE_CHOICES = [
        ('about', 'About Us'),
        ('contact', 'Contact'),
        ('history', 'History'),
        ('mission', 'Mission & Vision'),
        ('leadership', 'Leadership'),
        ('campus', 'Campus Life'),
        ('facilities', 'Facilities'),
    ]
    
    page_key = models.CharField(max_length=50, choices=PAGE_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # SEO
    meta_description = models.CharField(max_length=300, blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True)

    class Meta:
        verbose_name = "Page Content (Simple)"
        verbose_name_plural = "Page Contents (Simple)"

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """Student/alumni testimonials"""
    
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=100, help_text="e.g., 'Student, MBBS 2024'")
    quote = models.TextField()
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.role}"


class Partner(models.Model):
    """University partners and collaborators"""
    
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='partners/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Partner"
        verbose_name_plural = "Partners"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class FAQ(models.Model):
    """Frequently Asked Questions"""
    
    CATEGORY_CHOICES = [
        ('admissions', 'Admissions'),
        ('academics', 'Academics'),
        ('campus', 'Campus Life'),
        ('financial', 'Financial Aid'),
        ('international', 'International Students'),
        ('general', 'General'),
    ]
    
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ['category', 'display_order']

    def __str__(self):
        return self.question[:80]


class ContactEnquiry(models.Model):
    """Contact form submissions from the website"""
    
    SUBJECT_CHOICES = [
        ('admissions', 'Admissions Inquiry'),
        ('general', 'General Inquiry'),
        ('partnership', 'Partnership Opportunity'),
        ('research', 'Research Collaboration'),
        ('feedback', 'Feedback'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('responded', 'Responded'),
        ('closed', 'Closed'),
    ]
    
    # Contact info
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='assigned_enquiries')
    notes = models.TextField(blank=True, help_text="Internal notes")
    
    # Response tracking
    responded_at = models.DateTimeField(null=True, blank=True)
    response_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Enquiry"
        verbose_name_plural = "Contact Enquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.get_subject_display()}"


class PublicDocument(models.Model):
    """Public downloadable documents (prospectus, reports, handbooks, etc.)"""

    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('financial', 'Financial'),
        ('research', 'Research'),
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('strategic', 'Strategic'),
        ('governance', 'Governance'),
        ('admissions', 'Admissions'),
        ('general', 'General'),
    ]

    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'Word Document'),
        ('docx', 'Word Document (DOCX)'),
        ('xls', 'Excel Spreadsheet'),
        ('xlsx', 'Excel Spreadsheet (XLSX)'),
        ('ppt', 'PowerPoint'),
        ('pptx', 'PowerPoint (PPTX)'),
    ]

    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='documents/public/')

    # Metadata
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES, default='pdf')
    file_size = models.CharField(max_length=20, blank=True, help_text="e.g., '8.5 MB'")
    version = models.CharField(max_length=50, blank=True, help_text="e.g., '2024-2025'")
    date_label = models.CharField(max_length=50, blank=True, help_text="e.g., 'January 2024' or 'Updated 2024'")

    # Download tracking
    download_count = models.PositiveIntegerField(default=0)

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Public Document"
        verbose_name_plural = "Public Documents"
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def download_url(self):
        return self.file.url if self.file else None


class PageContent(models.Model):
    """Dynamic content for static pages (About, Mission/Vision, etc.)"""

    PAGE_CHOICES = [
        ('about', 'About Page'),
        ('mission_vision', 'Mission & Vision'),
        ('history', 'History'),
        ('campus_life', 'Campus Life'),
        ('governance', 'Governance'),
        ('core_values', 'Core Values'),
        ('strategic_pillars', 'Strategic Pillars'),
        ('contact_info', 'Contact Information'),
        ('academics_overview', 'Academics Overview'),
    ]

    CONTENT_TYPE_CHOICES = [
        ('text', 'Text Block'),
        ('hero', 'Hero Section'),
        ('stats', 'Statistics'),
        ('list', 'List Items'),
        ('timeline', 'Timeline'),
        ('gallery', 'Image Gallery'),
        ('feature', 'Feature Cards'),
    ]

    # Identification
    page = models.CharField(max_length=30, choices=PAGE_CHOICES)
    section_key = models.CharField(max_length=100, help_text="Unique identifier for this content block")
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, default='text')

    # Content
    title = models.CharField(max_length=300, blank=True)
    subtitle = models.CharField(max_length=500, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='page_content/', blank=True, null=True)

    # JSON field for structured data (lists, stats, etc.)
    extra_data = models.JSONField(
        blank=True,
        null=True,
        help_text="JSON data for structured content (stats, lists, etc.)"
    )

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page Content"
        verbose_name_plural = "Page Contents"
        ordering = ['page', 'display_order', 'section_key']
        unique_together = ['page', 'section_key']

    def __str__(self):
        return f"{self.get_page_display()} - {self.section_key}"


class GalleryImage(models.Model):
    """Photo gallery images"""
    
    CATEGORY_CHOICES = [
        ('campus', 'Campus Life'),
        ('events', 'Events'),
        ('academic', 'Academic'),
        ('research', 'Research'),
        ('students', 'Students'),
        ('facilities', 'Facilities'),
        ('ceremonies', 'Ceremonies'),
        ('sports', 'Sports'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Image
    image = models.ImageField(upload_to='gallery/')
    thumbnail = models.ImageField(upload_to='gallery/thumbnails/', blank=True, null=True)
    
    # Categorization
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, blank=True)
    
    # Metadata
    event_date = models.DateField(blank=True, null=True, help_text="Date the photo was taken")
    photographer = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    
    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
        ordering = ['-is_featured', 'display_order', '-created_at']

    def __str__(self):
        return self.title

    @staticmethod
    def _thumb_name(original_name):
        base = os.path.splitext(os.path.basename(original_name))[0]
        return f"{base}_thumb.jpg"

    def _reprocess_images(self, force=False):
        """Regenerate the thumbnail and downscale oversized originals.

        Uses deterministic file names so re-running never accumulates
        duplicate files. The thumbnail is stored under ``<original>_thumb.jpg``
        in the thumbnail upload directory; oversized originals are rewritten
        in place at their existing storage path.
        """
        if not self.image:
            return
        with self.image.open('rb') as f:
            thumb = _reencode_image(f, GALLERY_THUMBNAIL_MAX, force=True)
        thumb_path = posixpath.join('gallery', 'thumbnails', self._thumb_name(self.image.name))
        if self.thumbnail.name != thumb_path:
            self.thumbnail.delete(save=False)
        if default_storage.exists(thumb_path):
            default_storage.delete(thumb_path)
        self.thumbnail.save(posixpath.basename(thumb_path), thumb, save=False)

        with self.image.open('rb') as f:
            original = _reencode_image(f, GALLERY_IMAGE_MAX, force)
        if original is not None and self.image.name:
            original.seek(0)
            with default_storage.open(self.image.name, 'wb') as out:
                while True:
                    chunk = original.read(65536)
                    if not chunk:
                        break
                    out.write(chunk)

    def save(self, *args, **kwargs):
        force = kwargs.pop('force', False)
        super().save(*args, **kwargs)
        if self.image:
            # Process after the file has been committed to storage so each
            # open() gets an independent handle (closing one must not
            # invalidate the original upload).
            self._reprocess_images(force=force)
            super().save(update_fields=['image', 'thumbnail'])


class HeroSlide(models.Model):
    """Homepage carousel slides"""

    POSITION_CHOICES = [
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ]

    title = models.CharField(max_length=200)
    subtitle = models.TextField(blank=True)
    description = models.TextField(blank=True, help_text="Additional description text")

    # Background
    background_image = models.ImageField(upload_to='hero/')
    background_video = models.FileField(upload_to='hero/videos/', blank=True, null=True)
    overlay_color = models.CharField(max_length=20, default='rgba(11, 39, 172, 0.7)', help_text="CSS rgba color for overlay")

    # Content positioning
    content_position = models.CharField(max_length=10, choices=POSITION_CHOICES, default='left')
    text_color = models.CharField(max_length=20, default='#ffffff', help_text="CSS color for text")

    # CTA Buttons (up to 2)
    primary_cta_text = models.CharField(max_length=50, blank=True)
    primary_cta_url = models.CharField(max_length=200, blank=True)
    primary_cta_color = models.CharField(max_length=20, default='#80fc08')

    secondary_cta_text = models.CharField(max_length=50, blank=True)
    secondary_cta_url = models.CharField(max_length=200, blank=True)
    secondary_cta_color = models.CharField(max_length=20, default='#ffffff')

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Featured slides appear first")
    start_date = models.DateTimeField(blank=True, null=True, help_text="When to start showing this slide")
    end_date = models.DateTimeField(blank=True, null=True, help_text="When to stop showing this slide")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hero Slide"
        verbose_name_plural = "Hero Slides"
        ordering = ['-is_featured', 'display_order', '-created_at']

    def __str__(self):
        return self.title

    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return self.is_published


class SDG(models.Model):
    """Sustainable Development Goals"""

    number = models.PositiveIntegerField(unique=True, help_text="SDG number (1-17)")
    title = models.CharField(max_length=200)
    short_title = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=20, help_text="Hex color code (e.g., #4c9f38)")
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")
    description = models.TextField(blank=True)

    # Contributions (stored as JSON array)
    contributions = models.JSONField(default=list, blank=True, help_text="List of contribution statements")

    # Metrics
    metric_1_label = models.CharField(max_length=100, blank=True)
    metric_1_value = models.CharField(max_length=50, blank=True)
    metric_1_target = models.CharField(max_length=50, blank=True)

    metric_2_label = models.CharField(max_length=100, blank=True)
    metric_2_value = models.CharField(max_length=50, blank=True)
    metric_2_target = models.CharField(max_length=50, blank=True)

    metric_3_label = models.CharField(max_length=100, blank=True)
    metric_3_value = models.CharField(max_length=50, blank=True)
    metric_3_target = models.CharField(max_length=50, blank=True)

    # Progress chart data (stored as JSON for recharts)
    progress_data = models.JSONField(default=list, blank=True, help_text="Chart data for progress visualization")

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SDG"
        verbose_name_plural = "SDGs"
        ordering = ['number']

    def __str__(self):
        return f"SDG {self.number}: {self.title}"

    def get_metrics(self):
        metrics = []
        for i in range(1, 4):
            label = getattr(self, f'metric_{i}_label')
            value = getattr(self, f'metric_{i}_value')
            target = getattr(self, f'metric_{i}_target')
            if label and value:
                metrics.append({'label': label, 'value': value, 'target': target})
        return metrics


class ImpactProgram(models.Model):
    """Community impact programs and initiatives"""

    PROGRAM_TYPE_CHOICES = [
        ('community_health', 'Community Health'),
        ('education', 'Education & Training'),
        ('environment', 'Environmental Sustainability'),
        ('research', 'Research Impact'),
        ('partnership', 'Strategic Partnership'),
        ('outreach', 'Community Outreach'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField()

    program_type = models.CharField(max_length=20, choices=PROGRAM_TYPE_CHOICES)
    related_sdgs = models.ManyToManyField(SDG, blank=True, related_name='programs')

    # Images
    banner_image = models.ImageField(upload_to='impact/banners/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='impact/thumbnails/', blank=True, null=True)

    # Key statistics
    stat_1_label = models.CharField(max_length=100, blank=True)
    stat_1_value = models.CharField(max_length=50, blank=True)
    stat_2_label = models.CharField(max_length=100, blank=True)
    stat_2_value = models.CharField(max_length=50, blank=True)
    stat_3_label = models.CharField(max_length=100, blank=True)
    stat_3_value = models.CharField(max_length=50, blank=True)
    stat_4_label = models.CharField(max_length=100, blank=True)
    stat_4_value = models.CharField(max_length=50, blank=True)

    # Content sections (stored as JSON)
    objectives = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    partners = models.JSONField(default=list, blank=True)
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of gallery image URLs")

    # Location/Contact
    location = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Impact Program"
        verbose_name_plural = "Impact Programs"
        ordering = ['-is_featured', 'display_order', '-created_at']

    def __str__(self):
        return self.title

    def get_stats(self):
        stats = []
        for i in range(1, 5):
            label = getattr(self, f'stat_{i}_label')
            value = getattr(self, f'stat_{i}_value')
            if label and value:
                stats.append({'label': label, 'value': value})
        return stats


class InternationalPartner(models.Model):
    """International partner universities and institutions"""

    PARTNER_TYPE_CHOICES = [
        ('university', 'University'),
        ('research_institute', 'Research Institute'),
        ('hospital', 'Hospital/Medical Center'),
        ('ngo', 'NGO/Non-profit'),
        ('government', 'Government Agency'),
        ('corporate', 'Corporate Partner'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPE_CHOICES, default='university')

    # Details
    description = models.TextField()
    website = models.URLField(blank=True)
    established_year = models.PositiveIntegerField(blank=True, null=True, help_text="Year partnership was established")

    # Logo/Image
    logo = models.ImageField(upload_to='partners/logos/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='partners/banners/', blank=True, null=True)

    # Partnership focus areas
    focus_areas = models.JSONField(default=list, blank=True, help_text="List of focus areas (e.g., ['Research', 'Student Exchange'])")

    # Contact
    contact_person = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)

    # Key metrics
    students_exchanged = models.PositiveIntegerField(default=0)
    joint_publications = models.PositiveIntegerField(default=0)
    joint_projects = models.PositiveIntegerField(default=0)

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "International Partner"
        verbose_name_plural = "International Partners"
        ordering = ['-is_featured', 'country', 'name']

    def __str__(self):
        return f"{self.name} ({self.country})"


class MOUAgreement(models.Model):
    """Memorandum of Understanding agreements"""

    MOU_TYPE_CHOICES = [
        ('academic', 'Academic Collaboration'),
        ('research', 'Research Partnership'),
        ('student_exchange', 'Student Exchange'),
        ('faculty_exchange', 'Faculty Exchange'),
        ('joint_program', 'Joint Academic Program'),
        ('dual_degree', 'Dual Degree'),
        ('clinical', 'Clinical Training'),
        ('capacity_building', 'Capacity Building'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Approval'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('renewed', 'Renewed'),
        ('terminated', 'Terminated'),
    ]

    title = models.CharField(max_length=300)
    mou_type = models.CharField(max_length=20, choices=MOU_TYPE_CHOICES)
    partner = models.ForeignKey(InternationalPartner, on_delete=models.CASCADE, related_name='mou_agreements')

    # Duration
    signed_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    duration_years = models.PositiveIntegerField(default=3, help_text="Duration in years")

    # Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='active')

    # Document
    document_file = models.FileField(upload_to='mou/documents/', blank=True, null=True)

    # Scope
    scope_description = models.TextField(help_text="Detailed description of the MOU scope")
    key_activities = models.JSONField(default=list, blank=True, help_text="List of key activities")
    benefits = models.JSONField(default=list, blank=True, help_text="List of mutual benefits")

    # BMU coordinator
    bmu_coordinator = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='coordinated_mous')

    # Display
    is_public = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "MOU Agreement"
        verbose_name_plural = "MOU Agreements"
        ordering = ['-signed_date', 'partner']

    def __str__(self):
        return f"{self.title} - {self.partner.name}"


class ExchangeProgram(models.Model):
    """Student and faculty exchange programs"""

    PROGRAM_TYPE_CHOICES = [
        ('student_semester', 'Student Semester Exchange'),
        ('student_summer', 'Student Summer School'),
        ('student_internship', 'Student Internship Abroad'),
        ('faculty_research', 'Faculty Research Visit'),
        ('faculty_teaching', 'Faculty Teaching Exchange'),
        ('staff_training', 'Staff Training'),
    ]

    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('open', 'Open for Applications'),
        ('closed', 'Application Closed'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    program_type = models.CharField(max_length=20, choices=PROGRAM_TYPE_CHOICES)

    partner = models.ForeignKey(InternationalPartner, on_delete=models.CASCADE, related_name='exchange_programs')
    mou_agreement = models.ForeignKey(MOUAgreement, on_delete=models.SET_NULL, null=True, blank=True, related_name='exchange_programs')

    # Duration
    duration_weeks = models.PositiveIntegerField(default=12, help_text="Duration in weeks")
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    application_deadline = models.DateField(blank=True, null=True)

    # Description
    description = models.TextField()
    eligibility_criteria = models.JSONField(default=list, blank=True, help_text="List of eligibility requirements")
    benefits = models.JSONField(default=list, blank=True, help_text="List of program benefits")
    costs = models.JSONField(default=dict, blank=True, help_text="Cost breakdown (tuition, accommodation, etc.)")

    # Capacity
    total_slots = models.PositiveIntegerField(default=10)
    available_slots = models.PositiveIntegerField(default=10)

    # Images
    banner_image = models.ImageField(upload_to='exchange/banners/', blank=True, null=True)

    # Status
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='upcoming')

    # Contact
    coordinator = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='coordinated_exchanges')
    contact_email = models.EmailField(blank=True)

    # Display
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Exchange Program"
        verbose_name_plural = "Exchange Programs"
        ordering = ['-is_featured', '-application_deadline', 'title']

    def __str__(self):
        return f"{self.title} - {self.partner.name}"


class StudentSupportService(models.Model):
    """Services for international students"""

    SERVICE_TYPE_CHOICES = [
        ('visa', 'Visa & Immigration'),
        ('housing', 'Housing & Accommodation'),
        ('orientation', 'Orientation Program'),
        ('academic', 'Academic Advising'),
        ('health', 'Health & Insurance'),
        ('career', 'Career Services'),
        ('social', 'Social & Cultural'),
        ('emergency', 'Emergency Support'),
        ('language', 'Language Support'),
        ('financial', 'Financial Aid'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    service_type = models.CharField(max_length=15, choices=SERVICE_TYPE_CHOICES)

    # Content
    short_description = models.CharField(max_length=300)
    full_description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    # Details
    features = models.JSONField(default=list, blank=True, help_text="List of service features")
    requirements = models.JSONField(default=list, blank=True, help_text="List of requirements/documents needed")
    process_steps = models.JSONField(default=list, blank=True, help_text="Step-by-step process")
    faqs = models.JSONField(default=list, blank=True, help_text="List of FAQs")

    # Contact
    contact_person = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    office_location = models.CharField(max_length=200, blank=True)
    office_hours = models.CharField(max_length=200, blank=True)

    # Related resources
    related_documents = models.JSONField(default=list, blank=True, help_text="List of downloadable document titles")
    useful_links = models.JSONField(default=list, blank=True, help_text="List of {title, url} objects")

    # Display
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Student Support Service"
        verbose_name_plural = "Student Support Services"
        ordering = ['service_type', 'display_order', 'title']

    def __str__(self):
        return self.title


class UniversityRanking(models.Model):
    """University rankings, accreditations, and achievements"""

    TYPE_CHOICES = [
        ('ranking', 'Ranking'),
        ('accreditation', 'Accreditation'),
        ('achievement', 'Achievement'),
    ]

    entry_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    # For rankings
    rank = models.CharField(max_length=100, blank=True, help_text="e.g. 'Top 5', '#1', '4.5/5'")
    year = models.CharField(max_length=20, blank=True)
    source = models.CharField(max_length=200, blank=True, help_text="Issuing body or source name")

    # For accreditations
    accrediting_body = models.CharField(max_length=100, blank=True)
    body_full_name = models.CharField(max_length=300, blank=True)
    status = models.CharField(max_length=100, blank=True, help_text="e.g. 'Full Accreditation'")
    validity = models.CharField(max_length=100, blank=True, help_text="e.g. '2019 - Present'")
    accredited_programs = models.TextField(blank=True, help_text="Comma-separated program names")
    logo = models.ImageField(upload_to='accreditations/', blank=True, help_text="Accreditation body logo")

    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "University Ranking"
        verbose_name_plural = "University Rankings"
        ordering = ['entry_type', 'display_order', '-year']

    def __str__(self):
        if self.entry_type == 'ranking':
            return f"{self.title} - {self.rank} ({self.year})"
        if self.entry_type == 'accreditation':
            return f"{self.accrediting_body} - {self.status}"
        return self.title


class KeyMetric(models.Model):
    """Key performance metrics displayed on rankings/achievements page"""
    
    CATEGORY_CHOICES = [
        ('research', 'Research & Publications'),
        ('academic', 'Academic'),
        ('impact', 'Impact'),
        ('partnership', 'Partnerships'),
        ('quality', 'Quality Assurance'),
        ('other', 'Other'),
    ]
    
    label = models.CharField(max_length=200)
    value = models.CharField(max_length=100, help_text="e.g. '1,247+', '94%'")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    icon_name = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Key Metric"
        verbose_name_plural = "Key Metrics"
        ordering = ['category', 'display_order']
    
    def __str__(self):
        return f"{self.label}: {self.value}"


class EventRegistration(models.Model):
    """Registrations for university events"""

    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('attended', 'Attended'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    institution = models.CharField(max_length=200, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_reference = models.CharField(max_length=100, blank=True, default='')
    paid_at = models.DateTimeField(null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Event Registration"
        verbose_name_plural = "Event Registrations"
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.name} - {self.event.title} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self._send_confirmation()

    def _send_confirmation(self):
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            from datetime import datetime

            event_date = self.event.event_date
            time_str = ''
            if self.event.start_time:
                time_str = self.event.start_time.strftime('%I:%M %p').lstrip('0')

            subject = f"Registration Confirmed - {self.event.title}"
            message_lines = [
                f"Dear {self.name},",
                "",
                f"Thank you for registering for \"{self.event.title}\".",
                "",
                f"Date: {event_date.strftime('%B %d, %Y')}",
                f"Time: {time_str}",
                f"Location: {self.event.location}",
            ]

            if self.event.fee and self.amount_paid:
                message_lines += [
                    "",
                    "Payment Details:",
                    f"Amount Paid: {self.event.currency} {self.amount_paid}",
                    f"Payment Status: {self.get_payment_status_display()}",
                    f"Payment Reference: {self.payment_reference}",
                ]

            message_lines += [
                "",
                "Please arrive 15 minutes early for check-in.",
                "",
                "Best regards,",
                "Bayelsa Medical University Events Team",
            ]

            message = "\n".join(message_lines)
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.email],
                fail_silently=True,
            )
        except Exception:
            pass


class CampusFeature(models.Model):
    """Structured feature cards for Campus Life sections (housing, dining, wellness, etc.)"""

    SECTION_CHOICES = [
        ('housing', 'Residential Life'),
        ('dining', 'Dining & Nutrition'),
        ('wellness', 'Health & Wellness'),
        ('organizations', 'Student Organizations'),
        ('diversity', 'Diversity & Inclusion'),
        ('safety', 'Safety & Security'),
        ('virtual_tour', 'Virtual Tour'),
    ]

    section_key = models.CharField(max_length=30, choices=SECTION_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, default='',
                            help_text="Lucide icon name (e.g. Building2, UtensilsCrossed)")
    image = models.ImageField(upload_to='campus_features/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Campus Feature"
        verbose_name_plural = "Campus Features"
        ordering = ['section_key', 'display_order']

    def __str__(self):
        return f"[{self.get_section_key_display()}] {self.title}"


class CampusStat(models.Model):
    """Statistics displayed on the Campus Life page"""

    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campus Statistic"
        verbose_name_plural = "Campus Statistics"
        ordering = ['display_order']

    def __str__(self):
        return f"{self.label}: {self.value}"


class CampusTestimonial(models.Model):
    """Student testimonials for the Campus Life page"""

    name = models.CharField(max_length=200)
    program = models.CharField(max_length=200, blank=True,
                               help_text="e.g. 'MBBS, Final Year'")
    quote = models.TextField()
    image = models.ImageField(upload_to='campus_testimonials/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campus Testimonial"
        verbose_name_plural = "Campus Testimonials"
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.name


class CampusContactInfo(models.Model):
    """Contact information for Campus Life support (singleton)"""

    address = models.CharField(max_length=300, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    office_hours = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Campus Contact Info"
        verbose_name_plural = "Campus Contact Info"

    def __str__(self):
        return "Campus Life Contact Information"


class CampusVideo(models.Model):
    """Campus life video for the VideoShowcase section on the homepage"""

    VIDEO_TYPE_CHOICES = [
        ('url', 'External URL (YouTube/Vimeo)'),
        ('upload', 'Uploaded Video File'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_type = models.CharField(max_length=10, choices=VIDEO_TYPE_CHOICES, default='url')
    video_url = models.URLField(
        blank=True,
        help_text="YouTube or Vimeo URL (e.g., https://www.youtube.com/watch?v=...)"
    )
    video_file = models.FileField(
        upload_to='campus_videos/',
        blank=True,
        null=True,
        help_text="Upload a video file directly (MP4 recommended)"
    )
    thumbnail = models.ImageField(
        upload_to='campus_videos/thumbnails/',
        blank=True,
        null=True,
        help_text="Poster image shown before the video plays"
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campus Video"
        verbose_name_plural = "Campus Videos"
        ordering = ['display_order']

    def __str__(self):
        return self.title

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.video_type == 'url' and not self.video_url:
            raise ValidationError({"video_url": "An external URL is required when video type is 'External URL'."})
        if self.video_type == 'upload' and not self.video_file:
            raise ValidationError({"video_file": "A video file is required when video type is 'Uploaded Video File'."})

    def get_embed_url(self):
        """Return a YouTube/Vimeo embed URL from a standard watch URL"""
        if not self.video_url:
            return ''
        url = self.video_url
        # YouTube
        if 'youtube.com/watch' in url:
            video_id = url.split('v=')[-1].split('&')[0]
            return f'https://www.youtube.com/embed/{video_id}'
        if 'youtu.be/' in url:
            video_id = url.split('youtu.be/')[-1].split('?')[0]
            return f'https://www.youtube.com/embed/{video_id}'
        # Vimeo
        if 'vimeo.com/' in url:
            video_id = url.split('vimeo.com/')[-1].split('?')[0]
            return f'https://player.vimeo.com/video/{video_id}'
        return url


class CampusImage(models.Model):
    """Images of campus places shown in the Experience BMU carousel"""

    title = models.CharField(max_length=200)
    caption = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='campus_images/')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campus Image"
        verbose_name_plural = "Campus Images"
        ordering = ['display_order']

    def __str__(self):
        return self.title


class CampusGalleryImage(models.Model):
    """Gallery images for the Campus Life page"""

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, blank=True,
                               help_text="e.g. 'Architecture', 'Academic Life'")
    image = models.ImageField(upload_to='campus_gallery/')
    thumbnail = models.ImageField(upload_to='campus_gallery/thumbnails/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Campus Gallery Image"
        verbose_name_plural = "Campus Gallery Images"
        ordering = ['display_order']

    def __str__(self):
        return f"{self.title} ({self.category})"


class FundingOrganization(models.Model):
    """Organizations that provide funding to the university"""

    name = models.CharField(max_length=200)
    acronym = models.CharField(max_length=50, blank=True, help_text="e.g., TETFUND, NCDMB")
    logo = models.ImageField(upload_to='funding/logos/', blank=True, null=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Funding Organization"
        verbose_name_plural = "Funding Organizations"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.acronym or self.name


class FundedProject(models.Model):
    """Projects funded by external organizations"""

    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('suspended', 'Suspended'),
    ]

    title = models.CharField(max_length=300)
    organization = models.ForeignKey(
        FundingOrganization, on_delete=models.CASCADE,
        related_name='projects'
    )
    amount = models.DecimalField(max_digits=15, decimal_places=2, help_text="Funding amount in NGN")
    principal_investigator = models.CharField(max_length=255, blank=True, help_text="Lead researcher name")
    impact = models.TextField(blank=True, help_text="Key impact or outcomes")
    year = models.PositiveIntegerField(help_text="Year the project was funded")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    description = models.TextField()
    image = models.ImageField(upload_to='funding/projects/', blank=True, null=True)
    completion_date = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Funded Project"
        verbose_name_plural = "Funded Projects"
        ordering = ['-year', 'display_order']

    def __str__(self):
        return f"{self.title} ({self.organization.acronym or self.organization.name}, {self.year})"


class FundedProjectImage(models.Model):
    """Gallery images for a funded project"""

    project = models.ForeignKey(FundedProject, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='funding/projects/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Project Image'
        verbose_name_plural = 'Project Images'
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Image {self.order}'


# ============================================================================
# Technology & Innovation
# ============================================================================

class InnovationProgram(models.Model):
    """Technological innovation programs showcased on the Technology & Innovation page"""

    PROGRAM_TYPE_CHOICES = [
        ('digital_health', 'Digital Health'),
        ('medical_devices', 'Medical Devices'),
        ('biotech', 'Biotech & Genomics'),
        ('ai_ml', 'AI & Machine Learning'),
        ('telemedicine', 'Telemedicine'),
        ('health_entrepreneurship', 'Health Entrepreneurship'),
    ]

    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('proposed', 'Proposed'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField()

    program_type = models.CharField(max_length=40, choices=PROGRAM_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    year = models.PositiveIntegerField(blank=True, null=True, help_text="Year the program started")
    lead_unit = models.CharField(max_length=200, blank=True, help_text="e.g. Innovation & Technology Centre")

    # Media
    cover_image = models.ImageField(upload_to='innovation/covers/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='innovation/thumbnails/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube/Vimeo embed URL for a program video")

    # Content sections (stored as JSON)
    objectives = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    partners = models.JSONField(default=list, blank=True)

    # Key statistics
    stat_1_label = models.CharField(max_length=100, blank=True)
    stat_1_value = models.CharField(max_length=50, blank=True)
    stat_2_label = models.CharField(max_length=100, blank=True)
    stat_2_value = models.CharField(max_length=50, blank=True)
    stat_3_label = models.CharField(max_length=100, blank=True)
    stat_3_value = models.CharField(max_length=50, blank=True)

    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Innovation Program"
        verbose_name_plural = "Innovation Programs"
        ordering = ['display_order']

    def __str__(self):
        return self.title


class InnovationProgramImage(models.Model):
    """Gallery images for an innovation program"""

    program = models.ForeignKey(InnovationProgram, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='innovation/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Innovation Program Image"
        verbose_name_plural = "Innovation Program Images"
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Image {self.order}'


# ============================================================================
# University Projects
# ============================================================================

class UniversityProject(models.Model):
    """Projects undertaken by the University, showcased on the University Projects page"""

    CATEGORY_CHOICES = [
        ('infrastructure', 'Infrastructure'),
        ('research', 'Research'),
        ('community', 'Community & Outreach'),
        ('technology', 'Technology & Digital'),
        ('academic', 'Academic & Student'),
    ]

    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('proposed', 'Proposed'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    subtitle = models.CharField(max_length=300, blank=True)
    description = models.TextField()

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    year = models.PositiveIntegerField(blank=True, null=True, help_text="Year the project started")
    completion_date = models.DateField(blank=True, null=True)
    lead_unit = models.CharField(max_length=200, blank=True, help_text="Unit/office leading the project")
    budget = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True, help_text="Budget in NGN")

    # Media
    image = models.ImageField(upload_to='projects/covers/', blank=True, null=True)
    video_url = models.URLField(blank=True, help_text="YouTube/Vimeo embed URL for a project video")

    highlights = models.JSONField(default=list, blank=True)

    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "University Project"
        verbose_name_plural = "University Projects"
        ordering = ['-year', 'display_order']

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class UniversityProjectImage(models.Model):
    """Gallery images for a university project"""

    project = models.ForeignKey(UniversityProject, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to='projects/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "University Project Image"
        verbose_name_plural = "University Project Images"
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Image {self.order}'


# ============================================================================
# About Page
# ============================================================================

class AboutPage(models.Model):
    """Content for the main About Us page"""

    hero_title = models.CharField(max_length=200, default='About Bayelsa Medical University')
    hero_content = models.TextField(blank=True)
    about_main_title = models.CharField(max_length=200, blank=True, default='Our Mission & Vision')
    about_main_content = models.TextField(blank=True)
    mission_content = models.TextField(blank=True, help_text="University mission statement")
    vision_content = models.TextField(blank=True, help_text="University vision statement")
    why_choose = models.JSONField(
        blank=True,
        default=list,
        help_text="Why Choose BMU feature cards: [{icon_name, title, description}]",
    )
    meta_description = models.CharField(max_length=300, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'About Page'
        verbose_name_plural = 'About Page'

    def __str__(self):
        return 'About Page'


class AboutStat(models.Model):
    """Statistics displayed on the About page"""

    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='stats')
    value = models.CharField(max_length=50, help_text='e.g., 2018, 3,500+')
    label = models.CharField(max_length=100, help_text='e.g., Founded, Students')
    suffix = models.CharField(max_length=20, blank=True, help_text='e.g., +')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'About Statistic'
        verbose_name_plural = 'About Statistics'
        ordering = ['order']

    def __str__(self):
        return f'{self.value} {self.label}'


class AboutCoreValue(models.Model):
    """Core values displayed on the About page"""

    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name='core_values')
    icon_name = models.CharField(max_length=50, blank=True, help_text='Lucide icon name (e.g., Award, Heart, Globe)')
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Core Value'
        verbose_name_plural = 'Core Values'
        ordering = ['order']

    def __str__(self):
        return self.title


# ============================================================================
# History Page
# ============================================================================

class HistoryPage(models.Model):
    """Content for the History page"""

    hero_content = models.TextField(blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    # Intro section: "A Vision for Healthcare Excellence"
    intro_title = models.CharField(max_length=200, blank=True, default='A Vision for Healthcare Excellence')
    intro_content = models.TextField(blank=True)
    intro_image = models.ImageField(upload_to='page_content/', blank=True, null=True)
    intro_image_caption = models.CharField(max_length=200, blank=True, default='Campus Development Gallery')

    # Present Day stats
    stat_1_value = models.CharField(max_length=50, blank=True, default='7+')
    stat_1_label = models.CharField(max_length=100, blank=True, default='Years of Excellence')
    stat_2_value = models.CharField(max_length=50, blank=True, default='3,500+')
    stat_2_label = models.CharField(max_length=100, blank=True, default='Students Trained')
    stat_3_value = models.CharField(max_length=50, blank=True, default='50+')
    stat_3_label = models.CharField(max_length=100, blank=True, default='Degree Programs')

    # Future Vision section
    future_title = models.CharField(max_length=200, blank=True, default='Looking Ahead')
    future_content = models.TextField(blank=True)
    future_quote = models.CharField(max_length=300, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'History Page'
        verbose_name_plural = 'History Page'

    def __str__(self):
        return 'History Page'


class TimelineEvent(models.Model):
    """Timeline events for the History page"""

    page = models.ForeignKey(HistoryPage, on_delete=models.CASCADE, related_name='timeline_events')
    year = models.CharField(max_length=10, help_text='e.g., 2018')
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, blank=True, help_text='Lucide icon name (e.g., Building2, Award)')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Timeline Event'
        verbose_name_plural = 'Timeline Events'
        ordering = ['order']

    def __str__(self):
        return f'{self.year} - {self.title}'


class HistoryIntroImage(models.Model):
    """Gallery images for the History page intro section"""

    page = models.ForeignKey(HistoryPage, on_delete=models.CASCADE, related_name='intro_images')
    image = models.ImageField(upload_to='page_content/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Intro Gallery Image'
        verbose_name_plural = 'Intro Gallery Images'
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Image {self.order}'


# ============================================================================
# Announcements (Site-wide Alerts / Advertisements)
# ============================================================================

class Announcement(models.Model):
    TYPE_CHOICES = [
        ('alert', 'Alert'),
        ('admission', 'Admission / Recruitment'),
        ('event', 'Event'),
        ('general', 'General'),
    ]

    title = models.CharField(max_length=300)
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='announcements/', blank=True, null=True)
    announcement_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


# ============================================================================
# Vision & Mission Page
# ============================================================================

class VisionMissionPage(models.Model):
    """Content for the Vision & Mission page"""

    hero_content = models.TextField(blank=True)
    mission_content = models.TextField(blank=True)
    vision_content = models.TextField(blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Vision & Mission Page'
        verbose_name_plural = 'Vision & Mission Page'

    def __str__(self):
        return 'Vision & Mission Page'


class VisionMissionPillar(models.Model):
    """Strategic pillars for the Vision & Mission page"""

    page = models.ForeignKey(VisionMissionPage, on_delete=models.CASCADE, related_name='strategic_pillars')
    icon_name = models.CharField(max_length=50, blank=True, help_text='Lucide icon name (e.g., Lightbulb, Heart)')
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Strategic Pillar'
        verbose_name_plural = 'Strategic Pillars'
        ordering = ['order']

    def __str__(self):
        return self.title


class VisionMissionValue(models.Model):
    """Core values for the Vision & Mission page"""

    page = models.ForeignKey(VisionMissionPage, on_delete=models.CASCADE, related_name='core_values')
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Core Value'
        verbose_name_plural = 'Core Values'
        ordering = ['order']

    def __str__(self):
        return self.title


# ============================================================================
# Governance Page
# ============================================================================

class GovernancePage(models.Model):
    """Content for the Governance page"""

    hero_content = models.TextField(blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Governance Page'
        verbose_name_plural = 'Governance Page'

    def __str__(self):
        return 'Governance Page'


class GovernanceBody(models.Model):
    """Governing bodies for the Governance page"""

    page = models.ForeignKey(GovernancePage, on_delete=models.CASCADE, related_name='governing_bodies')
    title = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True, help_text='e.g., Supreme Governing Body')
    description = models.TextField(blank=True)
    responsibilities = models.JSONField(blank=True, default=list, help_text='Array of responsibility strings')
    icon_name = models.CharField(max_length=50, blank=True, help_text='Lucide icon name (e.g., Building2, Users)')
    color = models.CharField(max_length=7, blank=True, help_text='Hex color (e.g., #1E1E1E)')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Governing Body'
        verbose_name_plural = 'Governing Bodies'
        ordering = ['order']

    def __str__(self):
        return self.title


class GovernanceCommittee(models.Model):
    """Committees for the Governance page"""

    page = models.ForeignKey(GovernancePage, on_delete=models.CASCADE, related_name='committees')
    name = models.CharField(max_length=200)
    focus = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Governance Committee'
        verbose_name_plural = 'Governance Committees'
        ordering = ['order']

    def __str__(self):
        return self.name


class GovernancePolicy(models.Model):
    """Policies for the Governance page"""

    page = models.ForeignKey(GovernancePage, on_delete=models.CASCADE, related_name='policies')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Governance Policy'
        verbose_name_plural = 'Governance Policies'
        ordering = ['order']

    def __str__(self):
        return self.title


class MenuItem(models.Model):
    """Dynamic navigation menu items for navbar and utility bar"""

    LOCATION_CHOICES = [
        ('navbar', 'Main Navbar'),
        ('utility', 'Utility Bar'),
        ('mobile_quick', 'Mobile Quick Links'),
    ]

    label = models.CharField(max_length=100)
    url = models.CharField(max_length=500, help_text="Internal route (e.g. /about) or external URL (https://...)")
    is_external = models.BooleanField(default=False, help_text="Open in new tab")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,
                               related_name='children', help_text="Parent menu item (null for top-level)")
    location = models.CharField(max_length=20, choices=LOCATION_CHOICES, default='navbar')
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name (e.g. GraduationCap)")
    description = models.TextField(blank=True, help_text="Description for featured box in mega menu")
    column = models.PositiveIntegerField(default=1, help_text="Column number in dropdown (1 or 2)")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"
        ordering = ['display_order', 'label']

    def __str__(self):
        return f"{self.label} ({self.get_location_display()})"


class UtilityLink(models.Model):
    """External portal links in the utility bar (Student Portal, Staff Portal, etc.)"""

    label = models.CharField(max_length=100)
    url = models.URLField(help_text="Full external URL")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Utility Link"
        verbose_name_plural = "Utility Links"
        ordering = ['display_order', 'label']

    def __str__(self):
        return self.label


class PageSection(models.Model):
    """Flexible CMS model for storing any page section content.
    
    Each row represents one content block on a page. The `data` JSONField
    holds the section-specific content (stats, steps, cards, lists, etc.).
    
    Examples:
      - page_key='home', section_key='featured_story_highlights' -> data: [{stat:'15,000+', label:'Students'}]
      - page_key='apply', section_key='application_steps' -> data: [{step:1, title:'Choose Program', description:'...'}]
      - page_key='contact', section_key='contact_info' -> data: [{title:'Main Campus', details:['...']}]
      - page_key='centres/career', section_key='services' -> data: [{title:'Career Counseling', desc:'...'}]
    """

    CONTENT_TYPE_CHOICES = [
        ('stats', 'Statistics'),
        ('steps', 'Process Steps'),
        ('cards', 'Link Cards'),
        ('list', 'String List'),
        ('contact', 'Contact Information'),
        ('kv', 'Key-Value Pairs'),
        ('hero', 'Hero Content'),
        ('custom', 'Custom Structured Data'),
    ]

    page_key = models.CharField(
        max_length=100,
        help_text="Page identifier, e.g. 'home', 'apply', 'centres/career', 'impact'"
    )
    section_key = models.CharField(
        max_length=100,
        help_text="Unique section identifier within the page, e.g. 'stats', 'steps', 'contact_info'"
    )
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, default='custom')
    title = models.CharField(max_length=300, blank=True, help_text="Optional section title/heading")
    subtitle = models.CharField(max_length=500, blank=True, help_text="Optional section subtitle/description")
    data = models.JSONField(
        default=list,
        blank=True,
        help_text="Section content as JSON array. Structure depends on content_type."
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page Section"
        verbose_name_plural = "Page Sections"
        ordering = ['page_key', 'display_order', 'section_key']
        unique_together = ['page_key', 'section_key']

    def __str__(self):
        return f"{self.page_key} / {self.section_key}"


class PortalDefinition(models.Model):
    """Portal cards displayed on the /portals page"""

    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.CharField(max_length=500, help_text="Route or external URL")
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")
    color = models.CharField(max_length=20, default='#1E1E1E', help_text="Hex color code")
    audience = models.CharField(max_length=200, help_text="e.g. 'Prospective Students'")
    features = models.JSONField(default=list, blank=True, help_text="List of feature strings")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Portal Definition"
        verbose_name_plural = "Portal Definitions"
        ordering = ['display_order', 'title']

    def __str__(self):
        return self.title


class CentrePage(models.Model):
    """CMS model for Centres and Institutes pages (Career Centre, CPD, Innovation, etc.)"""

    SLUG_CHOICES = [
        ('career', 'Career Centre'),
        ('cpd', 'CPD Centre'),
        ('foundation-studies', 'Centre for Foundation Studies'),
        ('innovation', 'Innovation & Technology Centre'),
        ('foreign-languages', 'Institute of Foreign Languages'),
        ('research-institutes', 'Research Institutes'),
    ]

    slug = models.SlugField(unique=True, choices=SLUG_CHOICES)
    hero_title = models.CharField(max_length=200)
    hero_subtitle = models.CharField(max_length=500)
    about_text = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    contact_location = models.CharField(max_length=300, blank=True)
    extra_data = models.JSONField(default=dict, blank=True, help_text="Page-specific structured data")
    is_active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Centre Page"
        verbose_name_plural = "Centre Pages"

    def __str__(self):
        return self.get_slug_display()


class ArchivedContent(models.Model):
    """Archived content items for the University Archive page"""

    TYPE_CHOICES = [
        ('news', 'News'),
        ('event', 'Event'),
        ('announcement', 'Announcement'),
        ('document', 'Document'),
        ('job', 'Job'),
        ('publication', 'Publication'),
    ]

    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    original_date = models.DateField(help_text="Original publication/event date")
    category = models.CharField(max_length=200, blank=True)
    original_url = models.CharField(max_length=500, blank=True, help_text="Link to original content")
    file_url = models.URLField(blank=True, help_text="Link to archived file")
    file_size = models.CharField(max_length=20, blank=True, help_text="e.g. '5.2 MB'")
    archived_by = models.CharField(max_length=200, default='Admin')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Archived Content"
        verbose_name_plural = "Archived Content"
        ordering = ['-original_date', 'display_order']

    def __str__(self):
        return f"[{self.get_content_type_display()}] {self.title}"


class InstitutePage(models.Model):
    """CMS model for Research Institutes"""

    name = models.CharField(max_length=300)
    focus = models.CharField(max_length=500, help_text="Comma-separated focus areas")
    director = models.CharField(max_length=200)
    projects_count = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Research Institute"
        verbose_name_plural = "Research Institutes"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class MediaAsset(models.Model):
    """Reusable media upload for CMS content (page sections, quick links, etc.)"""

    title = models.CharField(max_length=200, blank=True, help_text="Optional label to identify this asset")
    image = models.ImageField(upload_to='media-library/', help_text="Upload an image from your computer")
    alt_text = models.CharField(max_length=300, blank=True, help_text="Accessible description of the image")

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Media Asset"
        verbose_name_plural = "Media Assets"
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title or f"Media Asset #{self.pk}"

    def url(self):
        return self.image.url

    def file_size_kb(self):
        if self.image:
            try:
                return round(self.image.size / 1024, 1)
            except (OSError, ValueError):
                return 0
        return 0


class ContactInfo(models.Model):
    """General university contact details shown in the footer and contact page (singleton)"""

    address = models.CharField(max_length=300, blank=True, help_text="Full campus address")
    phone = models.CharField(max_length=100, blank=True, help_text="Main switchboard phone number")
    email = models.EmailField(blank=True, help_text="Primary contact email")
    emergency_label = models.CharField(max_length=100, blank=True, default='Emergency',
                                       help_text="Label for the emergency contact (e.g. Security)")
    emergency_phone = models.CharField(max_length=100, blank=True, help_text="Emergency / after-hours phone number")
    office_hours = models.CharField(max_length=200, blank=True, help_text="Office hours, e.g. Mon-Fri 8AM - 5PM")

    class Meta:
        verbose_name = "Contact Info"
        verbose_name_plural = "Contact Info"

    def __str__(self):
        return "University Contact Information"


class NewsletterSubscriber(models.Model):
    """Email subscribers to the university newsletter"""

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200, blank=True)
    source = models.CharField(max_length=50, blank=True, default='website')
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"
        ordering = ['-created_at']

    def __str__(self):
        return self.email
