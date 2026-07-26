import uuid
from django.db import models
from django.conf import settings


class Application(models.Model):
    """Student admission applications"""
    
    STUDENT_TYPE_CHOICES = [
        ('LOCAL', 'Nigerian Student'),
        ('INTL', 'International Student'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('revision_requested', 'Revision Requested'),
        ('interview', 'Interview Scheduled'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('waitlisted', 'Waitlisted'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    QUALIFICATION_CHOICES = [
        ('ssce', 'SSCE/WAEC/NECO'),
        ('bsc', "Bachelor's Degree"),
        ('msc', "Master's Degree"),
        ('other', 'Other'),
    ]
    
    GRADE_CHOICES = [
        ('first', 'First Class'),
        ('second_upper', 'Second Class Upper'),
        ('second_lower', 'Second Class Lower'),
        ('third', 'Third Class'),
        ('pass', 'Pass'),
    ]
    
    # Application ID: BMU-YYYY-XXXX format
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    
    # Applicant (can be registered user or guest)
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                   null=True, blank=True, related_name='applications')
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField()
    
    # Application Details
    student_type = models.CharField(max_length=10, choices=STUDENT_TYPE_CHOICES)
    program = models.ForeignKey('academics.Program', on_delete=models.CASCADE)
    
    # Academic Information - Removed single fields, use AcademicRecord for multiple
    # Keeping for backward compatibility if needed
    previous_institution = models.CharField(max_length=200, blank=True, null=True)
    
    # Status and Progress
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    progress_percentage = models.PositiveIntegerField(default=0)
    
    # Passport for provisional success letter
    passport = models.ImageField(upload_to='applications/passports/', null=True, blank=True,
                                help_text="Passport photo for profile and provisional success letter")
    
    # Payment
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ], default='pending')
    payment_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    payment_currency = models.CharField(max_length=3, choices=[('NGN', 'NGN'), ('USD', 'USD')])
    payment_method = models.CharField(max_length=20, choices=[
        ('paystack', 'Paystack'),
        ('bank_deposit', 'Bank Deposit'),
    ], blank=True, null=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Application"
        verbose_name_plural = "Applications"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate application ID: BMU-YYYY-XXXX
            year = self.created_at.year if self.created_at else 2025
            last_app = Application.objects.filter(
                id__startswith=f'BMU{year}'
            ).order_by('-id').first()
            
            if last_app:
                last_num = int(last_app.id.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            
            self.id = f'BMU{year}-{new_num:04d}'
        else:
            # Existing application - recompute progress dynamically
            self.progress_percentage = self._compute_progress()
        super().save(*args, **kwargs)

    def _compute_progress(self):
        if self.status in ('accepted', 'rejected'):
            return 100
        if self.status == 'waitlisted':
            return 90
        if self.status == 'interview':
            return 80
        if self.status == 'under_review':
            return 70
        if self.status == 'revision_requested':
            return 20

        doc_count = self.documents.count()
        if doc_count > 0:
            verified_count = self.documents.filter(status='verified').count()
            if verified_count == doc_count:
                return 70
            if verified_count > 0:
                return 50
        return 30

    def __str__(self):
        return f"{self.id} - {self.first_name} {self.last_name}"


class AcademicRecord(models.Model):
    """Academic records for applications (SSCE, BSc, MSc, etc.)"""
    
    APPLICATION_TYPES = [
        ('ssce', 'SSCE/WAEC/NECO'),
        ('bsc', "Bachelor's Degree"),
        ('msc', "Master's Degree"),
        ('diploma', 'Diploma'),
        ('other', 'Other'),
    ]
    
    GRADE_CHOICES = [
        ('first', 'First Class'),
        ('second_upper', 'Second Class Upper'),
        ('second_lower', 'Second Class Lower'),
        ('third', 'Third Class'),
        ('pass', 'Pass'),
        ('w', 'Withdrawn'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('under_review', 'Under Review'),
        ('rejected', 'Rejected'),
    ]
    
    application = models.ForeignKey(Application, on_delete=models.CASCADE,
                                     related_name='academic_records')
    type = models.CharField(max_length=20, choices=APPLICATION_TYPES)
    institution_name = models.CharField(max_length=200)
    year_of_completion = models.PositiveIntegerField()
    
    # For SSCE/WAEC/NECO - subjects and grades
    subjects = models.JSONField(null=True, blank=True, help_text="List of subjects with grades (for SSCE/WAEC/NECO)")
    
    # For Bachelors/Masters/Other - single grade
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES, null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Review info
    review_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Academic Record"
        verbose_name_plural = "Academic Records"
        ordering = ['-year_of_completion']
    
    def __str__(self):
        return f"{self.application.id} - {self.get_type_display()} - {self.institution_name}"


class ApplicationDocument(models.Model):
    """Documents uploaded for applications"""
    
    DOCUMENT_CHOICES = [
        ('passport_photo', 'Passport Photograph'),
        ('birth_certificate', 'Birth Certificate'),
        ('academic_transcripts', 'Academic Transcripts'),
        ('certificate_of_origin', 'Certificate of Origin'),
        ('english_proficiency', 'English Proficiency (INTL)'),
        ('reference_letters', 'Reference Letters'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('under_review', 'Under Review'),
    ]
    
    application = models.ForeignKey(Application, on_delete=models.CASCADE,
                                     related_name='documents')
    name = models.CharField(max_length=50, choices=DOCUMENT_CHOICES)
    file = models.FileField(upload_to='applications/documents/%Y/%m/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Review notes
    review_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='document_reviews')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Application Document"
        verbose_name_plural = "Application Documents"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.application.id} - {self.name}"


class ApplicationStep(models.Model):
    """Track progress steps for each application"""
    
    STEP_CHOICES = [
        ('application_submitted', 'Application Submitted'),
        ('payment_verified', 'Payment Verified'),
        ('documents_verified', 'Documents Verified'),
        ('academic_review', 'Academic Review'),
        ('interview', 'Interview'),
        ('final_decision', 'Final Decision'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    application = models.ForeignKey(Application, on_delete=models.CASCADE,
                                     related_name='steps')
    name = models.CharField(max_length=50, choices=STEP_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    decision = models.CharField(max_length=100, blank=True, null=True,
                                 help_text="For final decision step")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Application Step"
        verbose_name_plural = "Application Steps"
        ordering = ['id']
        unique_together = ['application', 'name']

    def __str__(self):
        return f"{self.application.id} - {self.name}"


class ApplicationMessage(models.Model):
    """Messages between admissions office and applicants"""
    
    MESSAGE_TYPE_CHOICES = [
        ('info', 'Information'),
        ('action', 'Action Required'),
        ('success', 'Success'),
        ('warning', 'Warning'),
    ]
    
    application = models.ForeignKey(Application, on_delete=models.CASCADE,
                                     related_name='messages')
    type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='info')
    text = models.TextField()
    from_name = models.CharField(max_length=200)
    is_from_applicant = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Application Message"
        verbose_name_plural = "Application Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.application.id} - {self.type} - {self.created_at.strftime('%Y-%m-%d')}"


class AdmissionRequirement(models.Model):
    CATEGORY_CHOICES = [
        ('undergraduate', 'Undergraduate'),
        ('postgraduate', 'Postgraduate'),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=200, default='General Requirements')
    items = models.JSONField(default=list, help_text="List of requirement strings")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Admission Requirement"
        verbose_name_plural = "Admission Requirements"
        ordering = ['category', 'display_order']

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


class ImportantDate(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('extended', 'Extended'),
    ]

    event = models.CharField(max_length=300)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Important Date"
        verbose_name_plural = "Important Dates"
        ordering = ['date', 'display_order']

    def __str__(self):
        return f"{self.event} - {self.date}"


from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=ApplicationDocument)
def update_app_progress_on_doc_change(sender, instance, **kwargs):
    """Recalculate application progress when a document is saved (status change)"""
    app = instance.application
    old_progress = app.progress_percentage
    new_progress = app._compute_progress()
    if old_progress != new_progress:
        Application.objects.filter(pk=app.pk).update(progress_percentage=new_progress)
