from django.db import models
from django.utils import timezone


class LibraryService(models.Model):
    icon = models.CharField(max_length=50, blank=True, default='BookOpen', help_text="Lucide icon name")
    title = models.CharField(max_length=200)
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Library Service"
        verbose_name_plural = "Library Services"
        ordering = ['display_order']

    def __str__(self):
        return self.title


class LibraryStat(models.Model):
    value = models.CharField(max_length=50)
    label = models.CharField(max_length=100)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Library Statistic"
        verbose_name_plural = "Library Statistics"
        ordering = ['display_order']

    def __str__(self):
        return f"{self.label}: {self.value}"


class LibraryHour(models.Model):
    day = models.CharField(max_length=50, help_text="e.g. 'Monday - Thursday' or 'Saturday'")
    hours = models.CharField(max_length=100, help_text="e.g. '8:00 AM - 10:00 PM'")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Library Hour"
        verbose_name_plural = "Library Hours"
        ordering = ['display_order']

    def __str__(self):
        return f"{self.day}: {self.hours}"


class LibraryGuideline(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Library Guideline"
        verbose_name_plural = "Library Guidelines"
        ordering = ['display_order']

    def __str__(self):
        return self.title


class BookCategory(models.Model):
    """Book categories/subjects"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='subcategories')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Book Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Book(models.Model):
    """Library books and resources - info only, no circulation tracking"""
    
    RESOURCE_TYPE_CHOICES = [
        ('book', 'Book'),
        ('ebook', 'E-Book'),
        ('journal', 'Journal'),
        ('thesis', 'Thesis/Dissertation'),
        ('report', 'Report'),
        ('audiobook', 'Audiobook'),
        ('video', 'Video/DVD'),
        ('other', 'Other'),
    ]
    
    # Basic Info
    title = models.CharField(max_length=500)
    subtitle = models.CharField(max_length=500, blank=True)
    authors = models.CharField(max_length=500)
    isbn = models.CharField(max_length=20, blank=True, null=True, unique=True)
    isbn13 = models.CharField(max_length=20, blank=True, null=True, unique=True)
    
    # Publication Info
    publisher = models.CharField(max_length=200, blank=True)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    edition = models.CharField(max_length=50, blank=True)
    language = models.CharField(max_length=50, default='English')
    
    # Categorization
    categories = models.ManyToManyField(BookCategory, related_name='books', blank=True)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES, default='book')
    
    # Location
    call_number = models.CharField(max_length=100, blank=True, help_text="Library classification number")
    shelf_location = models.CharField(max_length=200, blank=True)
    
    # Description
    description = models.TextField(blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    cover_image = models.ImageField(upload_to='library/covers/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title[:80]


class DigitalResource(models.Model):
    """Digital library resources and databases"""
    
    RESOURCE_TYPE_CHOICES = [
        ('database', 'Academic Database'),
        ('ebook_collection', 'E-Book Collection'),
        ('journal_collection', 'Journal Collection'),
        ('repository', 'Institutional Repository'),
        ('archive', 'Digital Archive'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    
    # Access
    url = models.URLField()
    access_instructions = models.TextField(blank=True)
    requires_login = models.BooleanField(default=True)
    is_on_campus_only = models.BooleanField(default=False)
    
    # Coverage
    subject_areas = models.CharField(max_length=500, blank=True)
    coverage_dates = models.CharField(max_length=200, blank=True, help_text="e.g., 1990-present")
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Logo/Icon
    logo = models.ImageField(upload_to='library/logos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
