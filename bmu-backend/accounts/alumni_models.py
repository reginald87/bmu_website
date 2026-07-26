from django.db import models
from django.conf import settings


class AlumniProfile(models.Model):
    """Extended profile for alumni users"""
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                 related_name='alumni_profile')
    
    # Academic Info
    graduation_year = models.PositiveIntegerField()
    program = models.ForeignKey('academics.Program', on_delete=models.SET_NULL,
                                 null=True, blank=True)
    degree_awarded = models.CharField(max_length=100, blank=True, null=True)
    final_grade = models.CharField(max_length=10, blank=True, null=True)
    
    # Professional Info
    current_employer = models.CharField(max_length=200, blank=True, null=True)
    job_title = models.CharField(max_length=200, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(null=True, blank=True)
    
    # Career Status
    CAREER_STATUS_CHOICES = [
        ('employed', 'Employed'),
        ('self_employed', 'Self-Employed'),
        ('entrepreneur', 'Entrepreneur/Business Owner'),
        ('further_studies', 'Further Studies'),
        ('job_seeking', 'Job Seeking'),
        ('other', 'Other'),
    ]
    career_status = models.CharField(max_length=20, choices=CAREER_STATUS_CHOICES,
                                    default='employed')
    
    # Contact Preferences
    show_email_to_alumni = models.BooleanField(default=False)
    show_phone_to_alumni = models.BooleanField(default=False)
    allow_networking = models.BooleanField(default=True)
    
    # Profile
    professional_summary = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_handle = models.CharField(max_length=50, blank=True, null=True)
    
    # Engagement
    is_paying_dues = models.BooleanField(default=False)
    last_donation_date = models.DateField(null=True, blank=True)
    events_attended_count = models.PositiveIntegerField(default=0)
    
    # Mentorship
    is_mentor = models.BooleanField(default=False)
    mentorship_areas = models.TextField(blank=True, help_text="Areas willing to mentor in")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Alumni Profile"
        verbose_name_plural = "Alumni Profiles"
        ordering = ['-graduation_year', 'user__last_name']
    
    def __str__(self):
        return f"{self.user.full_name} - Class of {self.graduation_year}"


class AlumniEvent(models.Model):
    """Events organized for alumni"""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=50, choices=[
        ('reunion', 'Class Reunion'),
        ('networking', 'Networking Event'),
        ('webinar', 'Webinar/Seminar'),
        ('homecoming', 'Homecoming'),
        ('fundraising', 'Fundraising Event'),
        ('other', 'Other'),
    ])
    
    event_date = models.DateTimeField()
    location = models.CharField(max_length=300, blank=True, null=True)
    is_virtual = models.BooleanField(default=False)
    virtual_link = models.URLField(blank=True, null=True)
    
    target_year = models.PositiveIntegerField(null=True, blank=True,
                                               help_text="For class reunions")
    target_program = models.ForeignKey('academics.Program', on_delete=models.SET_NULL,
                                        null=True, blank=True)
    
    attendees = models.ManyToManyField(AlumniProfile, related_name='events_attended',
                                      blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-event_date']
    
    def __str__(self):
        return self.title


class AlumniDonation(models.Model):
    """Track alumni donations"""
    
    donor = models.ForeignKey(AlumniProfile, on_delete=models.CASCADE,
                               related_name='donations')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    
    purpose = models.CharField(max_length=200, blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)
    
    payment_method = models.CharField(max_length=50)
    payment_reference = models.CharField(max_length=100)
    
    donated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-donated_at']
    
    def __str__(self):
        return f"{self.donor.user.full_name} - {self.amount} {self.currency}"
