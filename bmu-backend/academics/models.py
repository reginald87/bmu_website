from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from decimal import Decimal


class College(models.Model):
    """Academic colleges and schools at BMU"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    subdomain = models.CharField(max_length=100, blank=True, null=True,
                                  help_text="e.g., medicine.bmu.edu.ng")
    description = models.TextField()
    
    # Leadership - Provost (previously dean_name)
    provost = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                 related_name='colleges_as_provost',
                                 blank=True, null=True,
                                 help_text="College Provost - links to user profile")
    provost_display_name = models.CharField(max_length=200, blank=True, 
                                             help_text="Display name if provost not in system")
    
    # For CPD and institutes without traditional provost structure
    director = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                  related_name='colleges_as_director',
                                  blank=True, null=True)
    director_display_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Overview content for College page
    overview_content = models.TextField(blank=True, help_text="Main overview content for college page")
    mission_statement = models.TextField(blank=True)
    vision_statement = models.TextField(blank=True)
    
    # Stats
    established_year = models.PositiveIntegerField()
    faculty_count = models.PositiveIntegerField(default=0)
    student_count = models.PositiveIntegerField(default=0)
    faculty_members_count = models.PositiveIntegerField(default=0,
        help_text="Total number of teaching faculty/staff in this college")
    
    # Visual
    primary_color = models.CharField(max_length=7, blank=True, null=True,
                                      help_text="Hex color code e.g., #003366")
    secondary_color = models.CharField(max_length=7, blank=True, null=True)
    banner_image = models.ImageField(upload_to='college_banners/', blank=True, null=True)
    icon_name = models.CharField(max_length=50, blank=True, null=True,
        help_text="Lucide icon name for frontend display (e.g., GraduationCap, Microscope)")
    preview_image = models.ImageField(upload_to='college_previews/', blank=True, null=True)
    provost_photo = models.ImageField(upload_to='college_leadership/', blank=True, null=True,
                                       help_text="Provost/Director profile photo")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "College"
        verbose_name_plural = "Colleges"
        ordering = ['name']

    def __str__(self):
        return self.name
    
    @property
    def leadership_name(self):
        """Return the display name of college leadership"""
        if self.provost:
            return f"{self.provost.first_name} {self.provost.last_name}"
        return self.provost_display_name or "TBA"
    
    @property
    def leadership_title(self):
        """Return the title of college leadership"""
        if self.provost or self.provost_display_name:
            return "Provost"
        elif self.director or self.director_display_name:
            return "Director"
        return "Head of College"

    @property
    def director_name(self):
        """Return the display name of college director"""
        if self.director:
            return f"{self.director.first_name} {self.director.last_name}"
        return self.director_display_name or ""


class FacultyUnit(models.Model):
    """Academic faculties/schools - can be within colleges or standalone (e.g., Faculty of Science)"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='faculties',
                                blank=True, null=True,
                                help_text="Optional: leave blank for standalone faculties like Faculty of Science")
    code = models.CharField(max_length=20, blank=True, help_text="e.g., FBCS, FMCS")
    
    description = models.TextField(blank=True)
    mission_statement = models.TextField(blank=True)
    vision_statement = models.TextField(blank=True)
    
    # Leadership - Dean
    dean = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                             related_name='faculties_as_dean',
                             blank=True, null=True,
                             help_text="Faculty Dean - links to user profile")
    dean_display_name = models.CharField(max_length=200, blank=True,
                                         help_text="Display name if dean not in system")
    
    # Stats
    department_count = models.PositiveIntegerField(default=0)
    staff_count = models.PositiveIntegerField(default=0)
    student_count = models.PositiveIntegerField(default=0)
    
    # Visual
    banner_image = models.ImageField(upload_to='faculty_banners/', blank=True, null=True)
    dean_photo = models.ImageField(upload_to='faculty_leadership/', blank=True, null=True,
                                    help_text="Dean profile photo")
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Faculty Unit"
        verbose_name_plural = "Faculty Units"
        ordering = ['display_order', 'name']

    def __str__(self):
        if self.college:
            return f"{self.name} ({self.college.name})"
        return self.name
    
    @property
    def parent_name(self):
        """Return the parent unit name (college if exists)"""
        return self.college.name if self.college else None
    
    @property
    def is_standalone(self):
        """Check if faculty is standalone (no college affiliation)"""
        return self.college is None
    
    @property
    def leadership_name(self):
        """Return the display name of faculty leadership"""
        if self.dean:
            return f"{self.dean.first_name} {self.dean.last_name}"
        return self.dean_display_name or "TBA"
    
    @property
    def leadership_title(self):
        """Return the title of faculty leadership"""
        return "Dean"


class Department(models.Model):
    """Academic departments - can be within faculties or directly under colleges"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    # Department can belong to a faculty OR directly to a college
    faculty = models.ForeignKey(FacultyUnit, on_delete=models.CASCADE, related_name='departments',
                                blank=True, null=True,
                                help_text="Link to faculty (optional if linked to college directly)")
    college_direct = models.ForeignKey(College, on_delete=models.CASCADE, related_name='departments_direct',
                                       blank=True, null=True,
                                       help_text="Direct college link for departments not under a faculty")
    code = models.CharField(max_length=20, blank=True, help_text="e.g., ANA, PHY")
    
    description = models.TextField(blank=True)
    
    # Leadership - Head of Department (HOD)
    hod = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                           related_name='departments_as_hod',
                           blank=True, null=True,
                           help_text="Head of Department - links to user profile")
    hod_display_name = models.CharField(max_length=200, blank=True,
                                        help_text="Display name if HOD not in system")
    
    # Staff
    staff_members = models.ManyToManyField(settings.AUTH_USER_MODEL, 
                                           related_name='departments',
                                           blank=True,
                                           help_text="Staff members in this department")
    
    # Stats
    staff_count = models.PositiveIntegerField(default=0)
    student_count = models.PositiveIntegerField(default=0)
    
    # Visual
    banner_image = models.ImageField(upload_to='department_banners/', blank=True, null=True)
    hod_photo = models.ImageField(upload_to='department_leadership/', blank=True, null=True,
                                   help_text="Head of Department profile photo")
    
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ['display_order', 'name']

    def __str__(self):
        if self.faculty:
            return f"{self.name} - {self.faculty.name}"
        if self.college_direct:
            return f"{self.name} ({self.college_direct.name})"
        return self.name
    
    @property
    def college(self):
        """Get the college this department belongs to (via faculty or direct link)"""
        if self.faculty and self.faculty.college:
            return self.faculty.college
        return self.college_direct
    
    @property
    def parent_name(self):
        """Return the parent unit name (faculty or college)"""
        if self.faculty:
            return self.faculty.name
        if self.college_direct:
            return self.college_direct.name
        return None
    
    @property
    def leadership_name(self):
        """Return the display name of department leadership"""
        if self.hod:
            return f"{self.hod.first_name} {self.hod.last_name}"
        return self.hod_display_name or "TBA"
    
    @property
    def leadership_title(self):
        """Return the title of department leadership"""
        return "Head of Department"


class Program(models.Model):
    """Academic programs (degrees, certificates)"""
    LEVEL_CHOICES = [
        ('undergraduate', 'Undergraduate'),
        ('masters', 'Masters'),
        ('phd', 'PhD'),
        ('certificate', 'Certificate'),
        ('professional', 'Professional'),
    ]
    
    CATEGORY_CHOICES = [
        ('undergraduate', 'Undergraduate'),
        ('postgraduate', 'Postgraduate'),
        ('professional', 'Professional'),
    ]

    # Basic info
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    degree = models.CharField(max_length=50, blank=True, help_text="e.g., MBBS, B.NSc, BMLS")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='undergraduate')
    
    # Duration and intake
    duration = models.CharField(max_length=50,
                                 help_text="e.g., '6 years', '2 years', '3 months'")
    intake = models.CharField(max_length=100, blank=True, help_text="e.g., September/October")
    
    # Descriptions
    description = models.TextField(blank=True, help_text="Short description for program lists")
    overview = models.TextField(blank=True, help_text="Detailed program overview")
    
    # Requirements and career
    requirements = models.TextField(help_text="Admission requirements (general)")
    career_opportunities = models.TextField(blank=True, help_text="Career paths after graduation")
    
    # Display
    color = models.CharField(max_length=7, blank=True, null=True,
                             help_text="Hex color code e.g., #0b27ac")
    icon = models.CharField(max_length=50, blank=True, default="Stethoscope",
                            help_text="Lucide icon name")
    display_order = models.PositiveIntegerField(default=0)
    
    # Fees
    application_fee_local = models.DecimalField(max_digits=10, decimal_places=2,
                                                 help_text="In NGN")
    application_fee_intl = models.DecimalField(max_digits=10, decimal_places=2,
                                                 help_text="In USD")
    tuition_per_year_local = models.DecimalField(max_digits=12, decimal_places=2,
                                                   null=True, blank=True,
                                                   help_text="For degree programs, in NGN")
    tuition_per_year_intl = models.DecimalField(max_digits=12, decimal_places=2,
                                                 null=True, blank=True,
                                                 help_text="For degree programs, in USD")
    tuition_fee_local = models.DecimalField(max_digits=12, decimal_places=2,
                                           null=True, blank=True,
                                           help_text="For certificate programs, in NGN")
    tuition_fee_intl = models.DecimalField(max_digits=12, decimal_places=2,
                                           null=True, blank=True,
                                           help_text="For certificate programs, in USD")
    
    # Relationships
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='programs')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name='programs')
    
    is_active = models.BooleanField(default=True)
    applications_open = models.BooleanField(
        default=True,
        help_text="Allow applicants to apply to this program",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def effective_application_fee_local(self):
        """Application fee in NGN: the programme's own fee, else its level default."""
        if self.application_fee_local and self.application_fee_local > 0:
            return self.application_fee_local
        fee = ApplicationFee.resolve(self.level)
        return fee.local_fee if fee else Decimal('0')

    def effective_application_fee_intl(self):
        """Application fee in USD: the programme's own fee, else its level default."""
        if self.application_fee_intl and self.application_fee_intl > 0:
            return self.application_fee_intl
        fee = ApplicationFee.resolve(self.level)
        return fee.intl_fee if fee else Decimal('0')

    class Meta:
        verbose_name = "Program"
        verbose_name_plural = "Programs"
        ordering = ['display_order', 'title']

    def __str__(self):
        return self.title


class ApplicationFee(models.Model):
    """Default application fee per programme level.

    A programme's own ``application_fee_local``/``application_fee_intl`` takes
    precedence when set; otherwise the fee for its level is used. This lets you
    charge, e.g., postgraduate applicants a different fee without editing every
    programme.
    """

    level = models.CharField(
        max_length=20, choices=Program.LEVEL_CHOICES, unique=True
    )
    local_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, help_text="Application fee in NGN"
    )
    intl_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, help_text="Application fee in USD"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Application Fee"
        verbose_name_plural = "Application Fees"
        ordering = ['level']

    def __str__(self):
        return f"{self.get_level_display()}: NGN {self.local_fee} / USD {self.intl_fee}"

    @classmethod
    def resolve(cls, level):
        """Return the configured fee row for a level (or ``None``)."""
        if not level:
            return None
        return cls.objects.filter(level=level).first()


class ProgramAccreditation(models.Model):
    """Accreditation bodies for programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='accreditations')
    body_name = models.CharField(max_length=200)
    body_acronym = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Program Accreditation"
        verbose_name_plural = "Program Accreditations"
    
    def __str__(self):
        return f"{self.program.title} - {self.body_name}"


class ProgramFacility(models.Model):
    """Facilities associated with programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='facilities')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Program Facility"
        verbose_name_plural = "Program Facilities"
    
    def __str__(self):
        return f"{self.program.title} - {self.name}"


class ProgramHighlight(models.Model):
    """Key highlights/selling points for programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='highlights')
    text = models.CharField(max_length=300)
    display_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "Program Highlight"
        verbose_name_plural = "Program Highlights"
        ordering = ['display_order']
    
    def __str__(self):
        return f"{self.program.title} - {self.text[:50]}"


class ProgramCurriculumYear(models.Model):
    """Curriculum structure by year for programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='curriculum_years')
    year_label = models.CharField(max_length=100, help_text="e.g., 'Year 1 (Pre-Med)'")
    year_number = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Program Curriculum Year"
        verbose_name_plural = "Program Curriculum Years"
        ordering = ['year_number']
    
    def __str__(self):
        return f"{self.program.title} - {self.year_label}"


class ProgramCurriculumCourse(models.Model):
    """Individual courses within a curriculum year"""
    curriculum_year = models.ForeignKey(ProgramCurriculumYear, on_delete=models.CASCADE, related_name='courses')
    course = models.ForeignKey(
        'Course', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='curriculum_courses',
        help_text="Optional link to the actual Course record"
    )
    name = models.CharField(max_length=200)
    display_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "Program Curriculum Course"
        verbose_name_plural = "Program Curriculum Courses"
        ordering = ['display_order']
    
    def __str__(self):
        return f"{self.curriculum_year.year_label} - {self.name}"


class ProgramAdmissionRequirement(models.Model):
    """Detailed admission requirements for programs"""
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='admission_requirements')
    requirement = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "Program Admission Requirement"
        verbose_name_plural = "Program Admission Requirements"
        ordering = ['display_order']
    
    def __str__(self):
        return f"{self.program.title} - {self.requirement[:50]}"


class Course(models.Model):
    """Individual courses within programs"""
    
    COURSE_TYPE_CHOICES = [
        ('core', 'Core'),
        ('elective', 'Elective'),
        ('prerequisite', 'Prerequisite'),
        ('general', 'General Education'),
    ]
    
    code = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Details
    credit_units = models.PositiveIntegerField(default=3)
    lecture_hours = models.PositiveIntegerField(default=0)
    lab_hours = models.PositiveIntegerField(default=0)
    tutorial_hours = models.PositiveIntegerField(default=0)
    
    # Enrollment
    capacity = models.PositiveIntegerField(default=0, help_text="Max students (0 = unlimited)")
    enrolled_count = models.PositiveIntegerField(default=0, help_text="Current enrolled students (auto-updated)")
    
    course_type = models.CharField(max_length=20, choices=COURSE_TYPE_CHOICES, default='core')
    level = models.PositiveIntegerField(help_text="Course level: 100, 200, 300, etc.")
    semester = models.CharField(max_length=10, choices=[
        ('first', 'First'),
        ('second', 'Second'),
        ('both', 'Both'),
    ], default='first')
    
    # Relationships
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    programs = models.ManyToManyField(Program, related_name='courses', blank=True)
    
    # Prerequisites
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.title}"

    @property
    def available_slots(self):
        if self.capacity == 0:
            return -1  # unlimited
        return max(0, self.capacity - self.enrolled_count)


class CourseSchedule(models.Model):
    """Timetable slot for a course offering"""
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    venue = models.CharField(max_length=100, blank=True)
    is_lab = models.BooleanField(default=False)
    group = models.CharField(max_length=50, blank=True, help_text="e.g., Group A, Tutorial Group 1")
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='course_schedules',
        help_text="Faculty assigned to teach this slot",
    )

    class Meta:
        verbose_name = "Course Schedule"
        verbose_name_plural = "Course Schedules"
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.course.code} - {self.get_day_display()} {self.start_time:%H:%M}-{self.end_time:%H:%M}"


class Faculty(models.Model):
    """Teaching staff and faculty members"""
    TITLE_CHOICES = [
        ('Prof.', 'Professor'),
        ('Assoc. Prof.', 'Associate Professor'),
        ('Dr.', 'Doctor'),
        ('Mr.', 'Mister'),
        ('Mrs.', 'Misses'),
        ('Ms.', 'Miss'),
    ]

    POSITION_CHOICES = [
        ('professor', 'Professor'),
        ('associate_professor', 'Associate Professor'),
        ('senior_lecturer', 'Senior Lecturer'),
        ('lecturer', 'Lecturer'),
        ('assistant_lecturer', 'Assistant Lecturer'),
        ('visiting_professor', 'Visiting Professor'),
    ]

    title = models.CharField(max_length=20, choices=TITLE_CHOICES)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # Academic affiliations
    college = models.ForeignKey(College, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='faculty_members')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='faculty_members')
    position = models.CharField(max_length=30, choices=POSITION_CHOICES)
    
    # Research profile
    research_interests = models.TextField()
    bio = models.TextField()
    orcid_id = models.CharField(max_length=30, blank=True, null=True)
    google_scholar_url = models.URLField(blank=True, null=True)
    researchgate_url = models.URLField(blank=True, null=True)
    
    # Metrics
    citations = models.PositiveIntegerField(default=0)
    h_index = models.PositiveIntegerField(default=0)
    i10_index = models.PositiveIntegerField(default=0)
    
    # Profile
    profile_image = models.ImageField(upload_to='faculty/', blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Faculty Member"
        verbose_name_plural = "Faculty"
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.title} {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class FacultyPublication(models.Model):
    """Publications by faculty members"""
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='publications')
    title = models.CharField(max_length=500)
    year = models.PositiveIntegerField()
    journal = models.CharField(max_length=300)
    citations = models.PositiveIntegerField(default=0)
    doi = models.CharField(max_length=200, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Faculty Publication"
        verbose_name_plural = "Faculty Publications"
        ordering = ['-year', '-citations']

    def __str__(self):
        return f"{self.title} ({self.year})"


class FacultyCustomLink(models.Model):
    """Custom external links for faculty profiles (label + URL pairs)"""

    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='custom_links')
    label = models.CharField(max_length=100, help_text="Display text for the link (e.g. 'Lab Website', 'Portfolio')")
    url = models.URLField(help_text="Full URL for the link")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Faculty Custom Link"
        verbose_name_plural = "Faculty Custom Links"
        ordering = ['display_order', 'label']

    def __str__(self):
        return f"{self.label} - {self.faculty}"


class SDGMetric(models.Model):
    """Sustainable Development Goals tracking metrics"""
    SDG_CHOICES = [
        ('sdg3', 'SDG 3: Good Health & Well-being'),
        ('sdg4', 'SDG 4: Quality Education'),
        ('sdg5', 'SDG 5: Gender Equality'),
        ('sdg17', 'SDG 17: Partnerships for the Goals'),
    ]

    sdg_code = models.CharField(max_length=10, choices=SDG_CHOICES)
    label = models.CharField(max_length=200)
    current_value = models.PositiveIntegerField()
    target_value = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SDG Metric"
        verbose_name_plural = "SDG Metrics"
        ordering = ['sdg_code', 'label']
        unique_together = ['sdg_code', 'label']

    def __str__(self):
        return f"{self.sdg_code}: {self.label}"

    @property
    def progress_percentage(self):
        if self.target_value > 0:
            return min(100, (self.current_value / self.target_value) * 100)
        return 0


class HomeStats(models.Model):
    """University statistics displayed on homepage"""
    research_papers = models.PositiveIntegerField(default=0)
    students = models.PositiveIntegerField(default=0)
    faculty = models.PositiveIntegerField(default=0)
    partners = models.PositiveIntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Homepage Statistics"
        verbose_name_plural = "Homepage Statistics"

    def __str__(self):
        return f"Stats as of {self.updated_at.strftime('%Y-%m-%d')}"


class Leadership(models.Model):
    """University leadership positions (VC, DVC, Deans, Directors, etc.)"""
    
    POSITION_CHOICES = [
        ('pro_chancellor', 'Pro-Chancellor'),
        ('vc', 'Vice Chancellor'),
        ('dvc_academic', 'Deputy Vice Chancellor - Academic'),
        ('dvc_admin', 'Deputy Vice Chancellor - Administration'),
        ('registrar', 'Registrar'),
        ('provost', 'Provost, College of Medicine'),
        ('bursar', 'Bursar'),
        ('librarian', 'University Librarian'),
        ('dean', 'Dean'),
        ('director', 'Director'),
        ('hod', 'Head of Department'),
        ('other', 'Other'),
    ]
    
    # Person info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    title = models.CharField(max_length=50, blank=True, null=True)
    
    # Position
    position = models.CharField(max_length=30, choices=POSITION_CHOICES)
    specific_title = models.CharField(max_length=200, blank=True, null=True,
                                       help_text="e.g., Dean of College of Medicine")
    
    # Affiliation
    college = models.ForeignKey(College, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='leadership')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name='leadership')
    
    # Details
    biography = models.TextField(blank=True)
    qualifications = models.TextField(blank=True, help_text="Academic qualifications")
    achievements = models.TextField(blank=True)
    research_interests = models.TextField(blank=True)
    
    # Contact
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    office_location = models.CharField(max_length=200, blank=True, null=True)
    
    # Media
    photo = models.ImageField(upload_to='leadership/', blank=True, null=True)
    
    # Order for display
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Tenure
    appointment_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Leadership"
        verbose_name_plural = "Leadership"
        ordering = ['display_order', 'last_name']
    
    def __str__(self):
        return f"{self.full_name} - {self.get_position_display()}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class LeadershipPublication(models.Model):
    """Publications by leadership members"""
    leader = models.ForeignKey(Leadership, on_delete=models.CASCADE, related_name='publications')
    title = models.CharField(max_length=500)
    year = models.PositiveIntegerField()
    journal = models.CharField(max_length=300)
    citations = models.PositiveIntegerField(default=0)
    doi = models.CharField(max_length=200, blank=True, null=True)
    url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Leadership Publication"
        verbose_name_plural = "Leadership Publications"
        ordering = ['-year', '-citations']

    def __str__(self):
        return f"{self.title} ({self.year})"


class NonAcademicStaff(models.Model):
    """Non-academic staff (administrative, technical, support staff)"""
    
    STAFF_CATEGORY_CHOICES = [
        ('admin', 'Administrative'),
        ('technical', 'Technical'),
        ('support', 'Support Services'),
        ('security', 'Security'),
        ('maintenance', 'Maintenance'),
        ('health', 'Health Services'),
        ('finance', 'Finance/Accounts'),
        ('hr', 'Human Resources'),
        ('it', 'IT Support'),
        ('library', 'Library Staff'),
        ('other', 'Other'),
    ]
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('intern', 'Intern'),
    ]
    
    # Personal info
    employee_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Employment
    category = models.CharField(max_length=30, choices=STAFF_CATEGORY_CHOICES)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full_time')
    job_title = models.CharField(max_length=200)
    
    # Affiliation
    college = models.ForeignKey(College, on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='non_academic_staff')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name='non_academic_staff')
    
    # Supervisor
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL,
                                  null=True, blank=True, related_name='subordinates')
    
    # Details
    qualifications = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    research_interests = models.TextField(blank=True)
    
    # Employment dates
    date_joined = models.DateField()
    contract_end_date = models.DateField(null=True, blank=True)
    
    # Office
    office_location = models.CharField(max_length=200, blank=True, null=True)
    
    # Media
    photo = models.ImageField(upload_to='staff/', blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Non-Academic Staff"
        verbose_name_plural = "Non-Academic Staff"
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.full_name} ({self.job_title})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class StaffPublication(models.Model):
    """Publications by non-academic staff members"""
    staff = models.ForeignKey(NonAcademicStaff, on_delete=models.CASCADE, related_name='publications')
    title = models.CharField(max_length=500)
    year = models.PositiveIntegerField()
    journal = models.CharField(max_length=300)
    citations = models.PositiveIntegerField(default=0)
    doi = models.CharField(max_length=200, blank=True, null=True)
    url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Staff Publication"
        verbose_name_plural = "Staff Publications"
        ordering = ['-year', '-citations']

    def __str__(self):
        return f"{self.title} ({self.year})"


class AcademicCalendar(models.Model):
    """Academic calendar events and term dates"""
    
    EVENT_TYPE_CHOICES = [
        ('academic', 'Academic'),
        ('registration', 'Registration'),
        ('exam', 'Exam'),
        ('holiday', 'Holiday'),
        ('deadline', 'Deadline'),
    ]
    
    TERM_CHOICES = [
        ('first', 'First Semester'),
        ('second', 'Second Semester'),
        ('summer', 'Summer Session'),
        ('full_year', 'Full Academic Year'),
    ]
    
    # Academic year
    academic_year = models.CharField(max_length=20, help_text="e.g., 2024/2025")
    term = models.CharField(max_length=20, choices=TERM_CHOICES, blank=True)
    
    # Event details
    title = models.CharField(max_length=300)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    description = models.TextField(blank=True)
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    
    # Display
    is_important = models.BooleanField(default=False, help_text="Highlight on calendar")
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Academic Calendar Event"
        verbose_name_plural = "Academic Calendar Events"
        ordering = ['academic_year', 'start_date', 'display_order']
    
    def __str__(self):
        return f"{self.academic_year} - {self.title}"


class Deadline(models.Model):
    ICON_CHOICES = [
        ('BookOpen', 'Book Open'),
        ('Clock', 'Clock'),
        ('Calendar', 'Calendar'),
        ('GraduationCap', 'Graduation Cap'),
        ('Bell', 'Bell'),
        ('FileText', 'File Text'),
        ('AlertCircle', 'Alert Circle'),
    ]

    title = models.CharField(max_length=200)
    deadline = models.CharField(max_length=200, help_text="Text description of the deadline, e.g. 'September 30, 2025'")
    icon_name = models.CharField(max_length=50, choices=ICON_CHOICES, default='Calendar')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Deadline"
        verbose_name_plural = "Deadlines"
        ordering = ['display_order']

    def __str__(self):
        return self.title


class RegistrationPeriod(models.Model):
    """Registration periods for course registration"""

    SEMESTER_CHOICES = [
        ('first', 'First Semester'),
        ('second', 'Second Semester'),
    ]

    academic_year = models.CharField(max_length=20, help_text="e.g., 2024/2025")
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)

    # Who this period applies to
    program = models.ForeignKey(
        "Program", on_delete=models.CASCADE, related_name="registration_periods",
        null=True, blank=True, help_text="Leave blank for all programs",
    )
    level = models.PositiveIntegerField(null=True, blank=True, help_text="e.g., 100, 200. Leave blank for all levels")

    # Period dates
    opens_at = models.DateTimeField(help_text="When registration opens")
    closes_at = models.DateTimeField(help_text="When registration closes")

    # Late registration
    late_registration_opens_at = models.DateTimeField(null=True, blank=True)
    late_registration_closes_at = models.DateTimeField(null=True, blank=True)
    late_registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Status
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Registration Period"
        verbose_name_plural = "Registration Periods"
        ordering = ["-academic_year", "semester", "level"]
        unique_together = ["academic_year", "semester", "program", "level"]

    def __str__(self):
        prog = f" - {self.program.title}" if self.program else " (All Programs)"
        lvl = f" Level {self.level}" if self.level else " (All Levels)"
        return f"{self.academic_year} {self.get_semester_display()}{prog}{lvl}"

    @property
    def is_open(self):
        from django.utils import timezone
        now = timezone.now()
        return self.opens_at <= now <= self.closes_at

    @property
    def is_late_registration_open(self):
        if not self.late_registration_opens_at or not self.late_registration_closes_at:
            return False
        from django.utils import timezone
        now = timezone.now()
        return self.late_registration_opens_at <= now <= self.late_registration_closes_at
