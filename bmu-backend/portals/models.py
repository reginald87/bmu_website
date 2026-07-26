from django.db import models
from django.db.models import Sum
from django.conf import settings


class ProgressionRecord(models.Model):
    """Session-end progression decision for a student"""

    DECISION_CHOICES = [
        ('promoted', 'Promoted'),
        ('referred', 'Referred'),
        ('probation', 'Probation'),
        ('withdrawn', 'Withdrawn'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='progression_records')
    session = models.CharField(max_length=50)
    from_level = models.PositiveIntegerField(help_text="Level at start of session")
    to_level = models.PositiveIntegerField(help_text="Level after progression")
    decision = models.CharField(max_length=20, choices=DECISION_CHOICES, default='promoted')
    reason = models.TextField(blank=True)

    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    carryover_units = models.PositiveIntegerField(default=0)
    total_units = models.PositiveIntegerField(default=0)

    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='processed_progressions',
    )
    processed_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False, help_text="Reviewed by registrar/VC")

    class Meta:
        unique_together = ['student', 'session']
        ordering = ['-session', 'student_id']
        verbose_name = "Progression Record"
        verbose_name_plural = "Progression Records"

    def __str__(self):
        return f"{self.student.full_name} - {self.session} → {self.get_decision_display()}"


class AttendanceSession(models.Model):
    """QR-code-generated attendance session for a course schedule slot"""

    course = models.ForeignKey('academics.Course', on_delete=models.CASCADE, related_name='attendance_sessions')
    schedule = models.ForeignKey('academics.CourseSchedule', on_delete=models.SET_NULL,
                                 null=True, blank=True, related_name='attendance_sessions')
    session_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    qr_code_token = models.CharField(max_length=64, unique=True, help_text="Unique token embedded in QR")
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='created_attendance_sessions')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-session_date', '-start_time']
        verbose_name = "Attendance Session"
        verbose_name_plural = "Attendance Sessions"

    def __str__(self):
        return f"{self.course.code} - {self.session_date} ({self.start_time}-{self.end_time})"


class AttendanceRecord(models.Model):
    """Individual student attendance mark"""

    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='records')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='attendance_records')
    scanned_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        unique_together = ['session', 'student']
        ordering = ['-scanned_at']

    def __str__(self):
        return f"{self.student.full_name} - {self.session.course.code} ({self.session.session_date})"


class GradingScale(models.Model):
    """Configurable grading scale per level/semester"""

    grade = models.CharField(max_length=5, help_text="e.g., A, B+, C")
    min_score = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.DecimalField(max_digits=5, decimal_places=2)
    grade_point = models.DecimalField(max_digits=3, decimal_places=2)
    remark = models.CharField(max_length=100, blank=True, help_text="e.g., Excellent, Good, Pass")
    level = models.PositiveIntegerField(default=100, help_text="Applies to this level (all levels if 0)")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-sort_order', '-grade_point']
        verbose_name = "Grading Scale"
        verbose_name_plural = "Grading Scales"

    def __str__(self):
        return f"{self.grade} ({self.min_score}-{self.max_score}) → {self.grade_point}"


class StudentResult(models.Model):
    """Student semester results - simplified for frontend display"""
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                 related_name='results')
    session = models.CharField(max_length=50)
    semester = models.CharField(max_length=20)
    level = models.PositiveIntegerField()
    
    # Summary
    courses_taken = models.PositiveIntegerField(default=0)
    total_units = models.PositiveIntegerField(default=0)
    
    # GPA
    gpa = models.DecimalField(max_digits=3, decimal_places=2)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    
    # Classification
    academic_status = models.CharField(max_length=50, choices=[
        ('excellent', 'Excellent'),
        ('very_good', 'Very Good'),
        ('good', 'Good'),
        ('pass', 'Pass'),
        ('probation', 'Probation'),
    ], default='good')
    
    # Remarks
    remarks = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'session', 'semester']
        ordering = ['-session', '-semester']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.session} {self.semester}"


class FeeType(models.Model):
    """Normalized fee catalog - tuition, hostel, lab, library, etc."""

    CATEGORY_CHOICES = [
        ('tuition', 'Tuition Fee'),
        ('acceptance', 'Acceptance Fee'),
        ('hostel', 'Hostel Fee'),
        ('lab', 'Laboratory Fee'),
        ('library', 'Library Fee'),
        ('sports', 'Sports Fee'),
        ('ict', 'ICT Fee'),
        ('development', 'Development Levy'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    code = models.CharField(max_length=20, unique=True, help_text="Short code e.g. TUITION-100")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.get_category_display()} - {self.name}"


class FeeStructure(models.Model):
    """Fee structure for a specific session, level, program, and indigene status.
    Total fee = aggregate of line items; can be paid in up to 2 installments.
    """

    session = models.CharField(max_length=50, db_index=True)
    level = models.PositiveIntegerField(help_text="Level e.g. 100, 200")
    semester = models.CharField(max_length=20, blank=True, help_text="Blank = both semesters")
    program = models.ForeignKey('academics.Program', on_delete=models.CASCADE, null=True, blank=True,
                                related_name='fee_structures')
    is_indigene = models.BooleanField(default=False, help_text="True = Bayelsa indigene rate")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_installments = models.PositiveSmallIntegerField(default=2, help_text="Max installments allowed (1 or 2)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['session', 'level', 'program__title']
        unique_together = [['session', 'level', 'program', 'semester', 'is_indigene']]
        verbose_name = "Fee Structure"
        verbose_name_plural = "Fee Structures"

    def __str__(self):
        prog = f" - {self.program}" if self.program else ""
        status = "Indigene" if self.is_indigene else "Non-Indigene"
        return f"{self.session} L{self.level}{prog} {status} [{self.semester or 'All'}]"

    def recompute_total(self):
        total = self.items.aggregate(total=Sum('amount'))['total'] or 0
        self.total_amount = total
        self.save(update_fields=['total_amount'])


class FeeStructureItem(models.Model):
    """Individual line item within a fee structure (e.g. Tuition, Lab, Library)."""

    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE, related_name='items')
    fee_type = models.ForeignKey(FeeType, on_delete=models.CASCADE, related_name='structure_items')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order']
        unique_together = [['fee_structure', 'fee_type']]
        verbose_name = "Fee Structure Item"
        verbose_name_plural = "Fee Structure Items"

    def __str__(self):
        return f"{self.fee_type.name}: ₦{self.amount}"


class StudentFeePayment(models.Model):
    """Student fee payments - linked to FeeStructure."""

    INSTALLMENT_CHOICES = [
        ('full', 'Full Payment'),
        ('first', 'First Installment'),
        ('second', 'Second Installment'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    GATEWAY_CHOICES = [
        ('paystack', 'Paystack'),
        ('remita', 'Remita'),
        ('bank_deposit', 'Bank Deposit'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                 related_name='fee_payments')

    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='payments')
    installment = models.CharField(max_length=10, choices=INSTALLMENT_CHOICES, default='full')

    session = models.CharField(max_length=50)
    semester = models.CharField(max_length=20, blank=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0,
                                       help_text="Actual amount received (may differ for scholarships)")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, blank=True, choices=GATEWAY_CHOICES)
    payment_reference = models.CharField(max_length=100, blank=True, db_index=True)
    gateway_response = models.JSONField(null=True, blank=True, help_text="Raw gateway response")
    paid_at = models.DateTimeField(null=True, blank=True)

    # Scholarship fields
    is_scholarship = models.BooleanField(default=False)
    scholarship_body = models.CharField(max_length=200, blank=True, help_text="Scholarship body name")
    scholarship_ref = models.CharField(max_length=100, blank=True, help_text="Scholarship reference")
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name='verified_payments')
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Student Fee Payment"
        verbose_name_plural = "Student Fee Payments"

    def __str__(self):
        return f"{self.student.full_name} - ₦{self.amount} ({self.get_status_display()})"


class ScholarshipRecord(models.Model):
    """Scholarship award record — body pays, bursary verifies."""

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                 related_name='scholarship_records')
    session = models.CharField(max_length=50, db_index=True)
    scholarship_body = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending Verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ], default='pending')
    verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True, related_name='scholarship_verifications')
    verified_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-session', 'student_id']
        unique_together = [['student', 'session']]
        verbose_name = "Scholarship Record"
        verbose_name_plural = "Scholarship Records"

    def __str__(self):
        return f"{self.student.full_name} - {self.scholarship_body} ({self.session})"


class CPDCourse(models.Model):
    """Continuing Professional Development courses"""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    CATEGORY_CHOICES = [
        ('clinical', 'Clinical Medicine'),
        ('surgery', 'Surgery'),
        ('public_health', 'Public Health'),
        ('nursing', 'Nursing'),
        ('pharmacy', 'Pharmacy'),
        ('lab_science', 'Lab Science'),
        ('health_admin', 'Health Administration'),
        ('research', 'Research Methodology'),
        ('general', 'General Medical Education'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    code = models.CharField(max_length=30, blank=True, help_text="Course code e.g., CPD-2024-001")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    description = models.TextField()
    learning_objectives = models.JSONField(default=list, blank=True, help_text="List of learning objectives")
    curriculum = models.JSONField(default=list, blank=True, help_text="List of modules/topics")

    # Duration
    duration_hours = models.PositiveIntegerField(default=8)
    duration_days = models.PositiveIntegerField(default=1)
    credit_hours = models.PositiveIntegerField(default=0, help_text="CPD credit hours awarded")

    # Delivery
    delivery_mode = models.CharField(max_length=20, choices=[
        ('online', 'Online'),
        ('in_person', 'In-Person'),
        ('hybrid', 'Hybrid'),
    ], default='online')

    # Schedule
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    enrollment_deadline = models.DateField(null=True, blank=True)

    # Capacity
    max_participants = models.PositiveIntegerField(default=50)
    enrolled_count = models.PositiveIntegerField(default=0)

    # Fees
    fee_local = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Fee in NGN")
    fee_intl = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Fee in USD")

    # Instructor
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='cpd_courses_taught')
    instructor_name = models.CharField(max_length=200, blank=True, help_text="Display name if instructor not in system")

    # Materials
    thumbnail = models.ImageField(upload_to='cpd/thumbnails/', blank=True, null=True)
    syllabus_file = models.FileField(upload_to='cpd/syllabus/', blank=True, null=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)

    # Display
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "CPD Course"
        verbose_name_plural = "CPD Courses"
        ordering = ['-is_featured', 'display_order', '-created_at']

    def __str__(self):
        return self.title


class CPDEnrollment(models.Model):
    """Student enrollment in CPD courses"""

    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name='cpd_enrollments')
    course = models.ForeignKey(CPDCourse, on_delete=models.CASCADE, related_name='enrollments')

    # Progress
    progress_percentage = models.PositiveIntegerField(default=0)
    completed_modules = models.JSONField(default=list, blank=True, help_text="List of completed module IDs")
    quiz_scores = models.JSONField(default=dict, blank=True, help_text="Dict of quiz_id: score")

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')

    # Payment
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('waived', 'Waived'),
    ], default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)

    # Completion
    completed_at = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    certificate_url = models.URLField(blank=True)

    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "CPD Enrollment"
        verbose_name_plural = "CPD Enrollments"
        unique_together = ['user', 'course']
        ordering = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.full_name} - {self.course.title}"


class Registration(models.Model):
    """Semester course registration record for a student"""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('advisor_approved', 'Advisor Approved'),
        ('hod_approved', 'HOD Approved'),
        ('dean_approved', 'Dean Approved'),
        ('registered', 'Registered'),
        ('cancelled', 'Cancelled'),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='registrations')
    registration_period = models.ForeignKey(
        'academics.RegistrationPeriod', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='student_registrations'
    )

    # Denormalized for convenience
    academic_year = models.CharField(max_length=20, help_text="e.g., 2024/2025")
    semester = models.CharField(max_length=10, choices=[
        ('first', 'First Semester'),
        ('second', 'Second Semester'),
    ])
    level = models.PositiveIntegerField(default=100)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_credit_units = models.PositiveIntegerField(default=0)
    remarks = models.TextField(blank=True)

    # Approval chain timestamps
    submitted_at = models.DateTimeField(null=True, blank=True)
    advisor_approved_at = models.DateTimeField(null=True, blank=True)
    hod_approved_at = models.DateTimeField(null=True, blank=True)
    dean_approved_at = models.DateTimeField(null=True, blank=True)
    registered_at = models.DateTimeField(null=True, blank=True)

    # Who approved
    advisor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='advised_registrations'
    )
    hod = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='hod_approved_registrations'
    )
    dean = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='dean_approved_registrations'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Registration"
        verbose_name_plural = "Registrations"
        unique_together = ['student', 'academic_year', 'semester']
        ordering = ['-academic_year', '-semester']

    def __str__(self):
        return f"{self.student.full_name} - {self.academic_year} {self.semester}"


class RegistrationCourse(models.Model):
    """Individual course selections within a student's registration"""

    APPROVAL_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    registration = models.ForeignKey(
        Registration, on_delete=models.CASCADE,
        related_name='courses'
    )
    course = models.ForeignKey('academics.Course', on_delete=models.CASCADE)
    is_compulsory = models.BooleanField(default=False, help_text="Auto-loaded from curriculum")
    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='pending')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_course_registrations'
    )
    rejection_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Registration Course"
        verbose_name_plural = "Registration Courses"
        unique_together = ['registration', 'course']
        ordering = ['course__code']

    def __str__(self):
        return f"{self.registration.student.full_name} - {self.course.code}"


class StudentCourse(models.Model):
    """Courses a student is enrolled in for a semester"""

    APPROVAL_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    RESULT_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('hod_approved', 'HOD Approved'),
        ('dean_approved', 'Dean Approved'),
        ('senate_approved', 'Senate Approved'),
        ('published', 'Published'),
    ]

    registration = models.ForeignKey(
        Registration, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='enrolled_courses'
    )
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='enrolled_courses')
    course = models.ForeignKey('academics.Course', on_delete=models.CASCADE,
                               related_name='enrolled_students')
    session = models.CharField(max_length=50)
    semester = models.CharField(max_length=20)

    is_compulsory = models.BooleanField(default=False)
    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='pending')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_enrollments'
    )

    # Grades
    assignment_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    exam_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    total_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    grade = models.CharField(max_length=5, blank=True, help_text="e.g., A, B+, C")
    grade_point = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    # Attendance
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Result approval workflow
    result_status = models.CharField(max_length=20, choices=RESULT_STATUS_CHOICES, default='draft')
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='submitted_results'
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    hod_approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='hod_approved_results'
    )
    hod_approved_at = models.DateTimeField(null=True, blank=True)
    dean_approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='dean_approved_results'
    )
    dean_approved_at = models.DateTimeField(null=True, blank=True)
    senate_approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='senate_approved_results'
    )
    senate_approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Student Course"
        verbose_name_plural = "Student Courses"
        unique_together = ['student', 'course', 'session', 'semester']
        ordering = ['course__code']

    def __str__(self):
        return f"{self.student.full_name} - {self.course.code} ({self.session})"
