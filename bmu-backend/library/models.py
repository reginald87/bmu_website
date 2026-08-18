from django.db import models
from django.utils import timezone
from django.conf import settings


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
    """Library books and resources with circulation tracking"""

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
    
    # Availability / circulation
    total_copies = models.PositiveIntegerField(default=1, help_text="Total physical copies owned")
    available_copies = models.PositiveIntegerField(default=1, help_text="Copies currently on the shelf")
    
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

    @property
    def is_available(self) -> bool:
        return self.available_copies > 0

    @property
    def category_names(self) -> list:
        return list(self.categories.values_list('name', flat=True))


class BookLoan(models.Model):
    """Circulation record: a student borrowing a physical copy of a book"""

    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]

    LOAN_DAYS = 14
    MAX_RENEWALS = 2
    RENEW_DAYS = 7

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='loans')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='book_loans')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    requested_at = models.DateTimeField(auto_now_add=True)
    loaned_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    renewed_count = models.PositiveIntegerField(default=0)
    notes = models.CharField(max_length=300, blank=True)

    class Meta:
        verbose_name = "Book Loan"
        verbose_name_plural = "Book Loans"
        ordering = ['-requested_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.book.title} ({self.get_status_display()})"


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
