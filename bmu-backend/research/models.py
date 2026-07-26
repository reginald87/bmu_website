from django.db import models
from django.conf import settings


class ResearchAndDevelopment(models.Model):
    """Research and Development centers/institutes"""
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    code = models.CharField(max_length=20, blank=True, help_text="e.g., RDC, ORD")
    
    # Leadership - Director (links to User profile)
    director = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                  related_name='directed_rd_centers',
                                  null=True, blank=True,
                                  help_text="R&D Director - links to user profile")
    director_display_name = models.CharField(max_length=200, blank=True,
                                              help_text="Display name if director not in system")
    
    # Details
    description = models.TextField()
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    
    # Research Areas
    research_areas = models.TextField(help_text="Comma-separated research focus areas")
    
    # Contact
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Media
    featured_image = models.ImageField(upload_to='research_development/', blank=True, null=True)
    director_photo = models.ImageField(upload_to='rd_directors/', blank=True, null=True)
    
    # Metrics
    total_publications = models.PositiveIntegerField(default=0)
    ongoing_projects_count = models.PositiveIntegerField(default=0)
    completed_projects_count = models.PositiveIntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    established_date = models.DateField(null=True, blank=True)
    
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Research & Development"
        verbose_name_plural = "Research & Development"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name
    
    @property
    def leadership_name(self):
        """Return the display name of R&D leadership"""
        if self.director:
            return f"{self.director.first_name} {self.director.last_name}"
        return self.director_display_name or "TBA"
    
    @property
    def leadership_title(self):
        """Return the title of R&D leadership"""
        return "Director"


class ResearchProject(models.Model):
    """Ongoing research projects"""
    
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('suspended', 'Suspended'),
    ]
    
    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    
    # Affiliation
    center = models.ForeignKey(ResearchAndDevelopment, on_delete=models.CASCADE,
                                related_name='projects')
    
    # Investigators - link to User profiles for global search/ranking
    principal_investigator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                                null=True, blank=True,
                                                related_name='led_projects')
    co_investigators = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                               related_name='collaborated_projects',
                                               blank=True)
    
    # Timeline
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    # Funding
    funding_amount = models.DecimalField(max_digits=15, decimal_places=2,
                                         null=True, blank=True)
    funding_currency = models.CharField(max_length=3, default='NGN')
    funding_agency = models.CharField(max_length=300, blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    
    # Details
    objectives = models.TextField(blank=True)
    methodology = models.TextField(blank=True)
    expected_outcomes = models.TextField(blank=True)
    
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Research Project"
        verbose_name_plural = "Research Projects"
        ordering = ['-start_date']

    def __str__(self):
        return self.title


class Publication(models.Model):
    """Research publications by faculty and students"""
    
    PUBLICATION_TYPE_CHOICES = [
        ('journal', 'Journal Article'),
        ('conference', 'Conference Paper'),
        ('book', 'Book/Book Chapter'),
        ('report', 'Technical Report'),
        ('patent', 'Patent'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=500)
    
    # Authors
    authors = models.ManyToManyField('academics.Faculty', related_name='research_publications')
    external_authors = models.TextField(blank=True, help_text="Authors not in faculty database")
    
    # Publication Details
    publication_type = models.CharField(max_length=20, choices=PUBLICATION_TYPE_CHOICES)
    journal_name = models.CharField(max_length=300, blank=True, null=True)
    conference_name = models.CharField(max_length=300, blank=True, null=True)
    volume = models.CharField(max_length=50, blank=True, null=True)
    issue = models.CharField(max_length=50, blank=True, null=True)
    pages = models.CharField(max_length=50, blank=True, null=True)
    publisher = models.CharField(max_length=200, blank=True, null=True)
    
    year = models.PositiveIntegerField()
    month = models.PositiveIntegerField(null=True, blank=True)
    
    # Identifiers
    doi = models.CharField(max_length=200, blank=True, null=True)
    pmid = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    
    # Metrics
    citations = models.PositiveIntegerField(default=0)
    
    # Affiliation
    ResearchAndDevelopment = models.ForeignKey(ResearchAndDevelopment, on_delete=models.SET_NULL,
                                        null=True, blank=True, related_name='publications')
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_peer_reviewed = models.BooleanField(default=True)
    
    # Subject area category
    category = models.CharField(max_length=100, blank=True, default='', help_text="Subject area category (e.g. Malaria Research, Public Health)")
    
    abstract = models.TextField(blank=True)
    keywords = models.CharField(max_length=500, blank=True)
    
    # File
    pdf_file = models.FileField(upload_to='publications/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Publication"
        verbose_name_plural = "Publications"
        ordering = ['-year', '-citations']

    def __str__(self):
        return self.title[:80]


class ResearchGrant(models.Model):
    """Research funding and grants"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    title = models.CharField(max_length=300)
    description = models.TextField()
    
    # Funding
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    funding_agency = models.CharField(max_length=300)
    grant_number = models.CharField(max_length=100, blank=True, null=True)
    
    # Investigators
    principal_investigator = models.ForeignKey('academics.Faculty', on_delete=models.CASCADE,
                                                related_name='research_grants')
    
    # Timeline
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    deadline = models.DateField(null=True, blank=True, help_text="Application deadline (for open calls)")
    category = models.CharField(max_length=100, blank=True, default='', help_text="Research area category")
    eligibility = models.JSONField(default=list, blank=True, help_text="List of eligibility criteria")

    # Documents
    proposal_document = models.FileField(upload_to='grants/proposals/', blank=True, null=True)
    award_letter = models.FileField(upload_to='grants/awards/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Research Grant"
        verbose_name_plural = "Research Grants"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.funding_agency}"


class Collaboration(models.Model):
    """Research collaborations with other institutions"""
    
    COLLABORATION_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('industry', 'Industry'),
        ('government', 'Government'),
        ('ngo', 'NGO'),
        ('international', 'International'),
    ]
    
    partner_name = models.CharField(max_length=200)
    partner_country = models.CharField(max_length=100, blank=True, null=True)
    collaboration_type = models.CharField(max_length=20, choices=COLLABORATION_TYPE_CHOICES)
    
    description = models.TextField()
    
    # BMU Contact
    bmu_coordinator = models.ForeignKey('academics.Faculty', on_delete=models.SET_NULL,
                                        null=True, blank=True, related_name='coordinated_collaborations')
    
    # Details
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Media
    logo = models.ImageField(upload_to='collaborations/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Collaboration"
        verbose_name_plural = "Collaborations"
        ordering = ['partner_name']

    def __str__(self):
        return self.partner_name


class GrantApplication(models.Model):
    """Applications submitted for research grants"""

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('shortlisted', 'Shortlisted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    grant = models.ForeignKey(ResearchGrant, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    applicant_phone = models.CharField(max_length=50, blank=True, default='')

    proposal_title = models.CharField(max_length=500)
    proposal_summary = models.TextField()
    proposed_budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    duration_months = models.PositiveIntegerField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewer_notes = models.TextField(blank=True, default='')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        'accounts.User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reviewed_applications'
    )

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Grant Application"
        verbose_name_plural = "Grant Applications"
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.proposal_title} - {self.applicant_name} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        from django.utils import timezone

        is_new = self.pk is None
        old_status = None
        if not is_new:
            try:
                old = GrantApplication.objects.get(pk=self.pk)
                old_status = old.status
            except GrantApplication.DoesNotExist:
                pass

        if old_status and old_status != self.status and self.status in ('approved', 'rejected'):
            self.reviewed_at = timezone.now()
            self._send_status_notification()

        super().save(*args, **kwargs)

    def _send_status_notification(self):
        subject = f"Grant Application {self.get_status_display()} - {self.grant.title}"
        if self.status == 'approved':
            message = (
                f"Dear {self.applicant_name},\n\n"
                f"Congratulations! Your application for the grant \"{self.grant.title}\" "
                f"has been approved.\n\n"
                f"Proposal: {self.proposal_title}\n"
                f"Reviewer Notes: {self.reviewer_notes or 'N/A'}\n\n"
                f"We will contact you shortly with further instructions.\n\n"
                f"Best regards,\nBayelsa Medical University Research Office"
            )
        elif self.status == 'rejected':
            message = (
                f"Dear {self.applicant_name},\n\n"
                f"Thank you for your interest in the grant \"{self.grant.title}\". "
                f"After careful review, we regret to inform you that your application "
                f"has not been successful at this time.\n\n"
                f"Proposal: {self.proposal_title}\n"
                f"Reviewer Notes: {self.reviewer_notes or 'N/A'}\n\n"
                f"We encourage you to apply for future funding opportunities.\n\n"
                f"Best regards,\nBayelsa Medical University Research Office"
            )
        else:
            return

        try:
            from django.core.mail import send_mail
            from django.conf import settings
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.applicant_email],
                fail_silently=True,
            )
        except Exception:
            pass
