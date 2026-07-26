from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    """Custom User model for BMU"""
    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('alumni', 'Alumni'),
        ('faculty', 'Faculty'),
        ('staff', 'Staff'),
        ('admin', 'Administrator'),
        ('applicant', 'Applicant'),
        ('bursary', 'Bursary'),
        ('hod', 'HOD'),
        ('dean', 'Dean'),
        ('registrar', 'Registrar'),
        ('vc', 'Vice Chancellor'),
    ]
    
    STUDENT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('withdrawn', 'Withdrawn'),
        ('deceased', 'Deceased'),
        ('deferred', 'Deferred'),
        ('graduated', 'Graduated'),
        ('alumni', 'Alumni'),
    ]
    
    # Basic Info
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Role
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='applicant')
    student_status = models.CharField(
        max_length=20, 
        choices=STUDENT_STATUS_CHOICES, 
        blank=True, 
        null=True,
        help_text="Student lifecycle status"
    )
    
    # Profile
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True)
    
    # Position/Title for display on College/Faculty/Department pages
    position = models.CharField(max_length=200, blank=True, null=True,
                                 help_text="e.g., Provost, Dean, HOD, Professor, Lecturer")
    title = models.CharField(max_length=100, blank=True, null=True,
                             help_text="Academic title e.g., Prof., Dr., Mr., Mrs.")
    
    # Professional details for profile pages
    qualifications = models.TextField(blank=True, help_text="Academic qualifications, one per line")
    specialization = models.CharField(max_length=300, blank=True, null=True)
    office_location = models.CharField(max_length=200, blank=True, null=True)
    office_hours = models.CharField(max_length=200, blank=True, null=True)
    
    # Publications (for global search and ranking)
    publications_count = models.PositiveIntegerField(default=0)
    research_interests = models.TextField(blank=True, help_text="Research interests, comma-separated")
    
    # Social/Professional links
    linkedin_url = models.URLField(blank=True, null=True)
    google_scholar_url = models.URLField(blank=True, null=True)
    orcid_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Address
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default='Nigeria')
    
    # Academic/Professional Info
    department = models.ForeignKey('academics.Department', on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='users')
    college = models.ForeignKey('academics.College', on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='users')
    
    # For students: program enrolled
    program = models.ForeignKey('academics.Program', on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='students')
    student_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    enrollment_year = models.PositiveIntegerField(null=True, blank=True)
    
    # For faculty: employee ID
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    
    # Status
    is_email_verified = models.BooleanField(default=False)
    is_profile_complete = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Required fields
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class StudentProfile(models.Model):
    """Extended student profile information"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='student_profile'
    )
    
    # Matriculation number (format: BMU/YYYY/XXXXX)
    matric_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    
    # Admission details
    admission_date = models.DateField(null=True, blank=True)
    admission_type = models.CharField(
        max_length=20,
        choices=[
            ('utme', 'UTME'),
            ('de', 'Direct Entry'),
            ('transfer', 'Transfer'),
            ('part_time', 'Part-time'),
            ('sandwich', 'Sandwich'),
        ],
        blank=True, null=True
    )
    entry_mode = models.CharField(
        max_length=20,
        choices=[
            ('regular', 'Regular'),
            ('part_time', 'Part-time'),
            ('sandwich', 'Sandwich'),
        ],
        default='regular'
    )
    
    # Current academic standing
    current_level = models.PositiveIntegerField(default=100)
    current_semester = models.CharField(
        max_length=20,
        choices=[('first', 'First'), ('second', 'Second')],
        default='first'
    )
    
    # Academic advisor
    academic_advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, blank=True, 
        related_name='advised_students'
    )
    
    # Next of Kin
    nok_full_name = models.CharField(max_length=200, blank=True, null=True)
    nok_relationship = models.CharField(
        max_length=50, 
        choices=[
            ('father', 'Father'),
            ('mother', 'Mother'),
            ('guardian', 'Guardian'),
            ('spouse', 'Spouse'),
            ('sibling', 'Sibling'),
            ('other', 'Other'),
        ],
        blank=True, null=True
    )
    nok_phone = models.CharField(max_length=20, blank=True, null=True)
    nok_email = models.EmailField(blank=True, null=True)
    nok_address = models.TextField(blank=True, null=True)
    
    # Location
    state_of_origin = models.CharField(max_length=100, blank=True, null=True)
    lga_of_origin = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=100, default='Nigerian')
    
    # Biometrics for verification (future use)
    fingerprint_hash = models.CharField(max_length=500, blank=True, null=True)
    face_embedding = models.BinaryField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Student Profile"
        verbose_name_plural = "Student Profiles"
    
    def __str__(self):
        return f"{self.user.full_name} - {self.matric_number or 'No Matric'}"


class UserActivity(models.Model):
    """Track user activities for audit purposes"""
    
    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('register', 'Register'),
        ('profile_update', 'Profile Update'),
        ('password_change', 'Password Change'),
        ('application_submit', 'Application Submitted'),
        ('document_upload', 'Document Uploaded'),
        ('payment', 'Payment Made'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Activity"
        verbose_name_plural = "User Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.created_at}"


class Notification(models.Model):
    """User notifications"""
    
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('action_required', 'Action Required'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Link to related object (optional)
    related_object_type = models.CharField(max_length=50, blank=True)
    related_object_id = models.CharField(max_length=50, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.title[:50]}"


class PasswordResetToken(models.Model):
    """Password reset tokens"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=100, unique=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Password Reset Token"
        verbose_name_plural = "Password Reset Tokens"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"


# Import alumni models to ensure they're registered
from .alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
