from django.db import models
from django.conf import settings


class JobPosting(models.Model):
    """Job vacancies and recruitment"""
    
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
        ('internship', 'Internship'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
        ('filled', 'Filled'),
    ]
    
    title = models.CharField(max_length=200)
    
    # Department/College
    department = models.CharField(max_length=200)
    college = models.ForeignKey('academics.College', on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='job_postings')
    
    # Job Details
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    location = models.CharField(max_length=200, default='Yenagoa, Bayelsa')
    
    # Compensation
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, default='NGN')
    salary_display = models.CharField(max_length=100, blank=True, 
                                       help_text="Human-readable salary range")
    
    # Content
    description = models.TextField()
    requirements = models.TextField(help_text="One requirement per line")
    responsibilities = models.TextField(help_text="One responsibility per line")
    education_requirements = models.TextField(help_text="Required education/qualifications")
    experience_requirements = models.TextField(help_text="Required experience")
    
    # Benefits
    benefits = models.TextField(blank=True, help_text="Job benefits")
    
    # Timeline
    posted_date = models.DateField()
    application_deadline = models.DateField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Contact
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Applications count
    applications_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                       null=True, blank=True)

    class Meta:
        verbose_name = "Job Posting"
        verbose_name_plural = "Job Postings"
        ordering = ['-posted_date']

    def __str__(self):
        return f"{self.title} - {self.department}"

    @property
    def is_open(self):
        from django.utils import timezone
        return (self.status == 'published' and 
                self.application_deadline >= timezone.now().date())


class JobApplication(models.Model):
    """Applications for job postings"""
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]
    
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE,
                            related_name='applications')
    
    # Applicant Details
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Address
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Nigeria')
    
    # Qualifications
    highest_qualification = models.CharField(max_length=200)
    years_of_experience = models.PositiveIntegerField(default=0)
    current_employer = models.CharField(max_length=200, blank=True, null=True)
    current_position = models.CharField(max_length=200, blank=True, null=True)
    
    # Application Materials
    resume = models.FileField(upload_to='job_applications/resumes/%Y/%m/')
    cover_letter = models.TextField()
    additional_documents = models.FileField(upload_to='job_applications/additional/%Y/%m/',
                                            blank=True, null=True)
    
    # LinkedIn/Portfolio
    linkedin_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Review
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='job_application_reviews')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)
    
    # Interview
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Job Application"
        verbose_name_plural = "Job Applications"
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.job.title}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
