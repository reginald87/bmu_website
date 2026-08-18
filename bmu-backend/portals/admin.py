from django.contrib import admin
from .models import (
    GradingScale, StudentResult, StudentFeePayment, CPDCourse, CPDEnrollment,
    StudentCourse, Registration, RegistrationCourse,
    ProgressionRecord, AttendanceSession, AttendanceRecord, HostelAllocation,
    FeeType, FeeStructure, FeeStructureItem, ScholarshipRecord,
)


@admin.register(GradingScale)
class GradingScaleAdmin(admin.ModelAdmin):
    list_display = ['grade', 'min_score', 'max_score', 'grade_point', 'remark', 'level', 'is_active']
    list_filter = ['is_active', 'level']
    ordering = ['-sort_order', '-grade_point']


@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'session', 'semester', 'gpa', 'cgpa', 'is_published']
    list_filter = ['is_published', 'academic_status']
    search_fields = ['student__email', 'student__first_name', 'student__last_name']


@admin.register(StudentFeePayment)
class StudentFeePaymentAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee_structure', 'installment', 'amount', 'amount_paid', 'status', 'payment_method', 'payment_reference', 'is_scholarship']
    list_filter = ['status', 'payment_method', 'session', 'installment', 'is_scholarship']
    search_fields = ['student__email', 'payment_reference', 'scholarship_body']
    readonly_fields = ['gateway_response', 'paid_at', 'verified_at', 'created_at', 'updated_at']
    raw_id_fields = ['student', 'fee_structure', 'verified_by']


@admin.register(FeeType)
class FeeTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'code']


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ['session', 'level', 'semester', 'program', 'is_indigene', 'total_amount', 'max_installments', 'is_active']
    list_filter = ['session', 'level', 'is_indigene', 'is_active']
    search_fields = ['program__title']
    raw_id_fields = ['program']


@admin.register(FeeStructureItem)
class FeeStructureItemAdmin(admin.ModelAdmin):
    list_display = ['fee_structure', 'fee_type', 'amount', 'sort_order']
    list_filter = ['fee_type__category']
    search_fields = ['fee_structure__session', 'fee_type__name']
    raw_id_fields = ['fee_structure', 'fee_type']


@admin.register(ScholarshipRecord)
class ScholarshipRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'scholarship_body', 'session', 'amount', 'status', 'verified_at']
    list_filter = ['status', 'session']
    search_fields = ['student__email', 'scholarship_body', 'reference']
    raw_id_fields = ['student', 'verified_by']


@admin.register(CPDCourse)
class CPDCourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'credit_hours', 'delivery_mode', 'start_date']
    list_filter = ['category', 'status', 'delivery_mode']
    search_fields = ['title', 'code']
    prepopulated_fields = {'slug': ['title']}


@admin.register(CPDEnrollment)
class CPDEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'status', 'enrolled_at', 'completed_at']
    list_filter = ['status']
    search_fields = ['user__email', 'course__title']


@admin.register(StudentCourse)
class StudentCourseAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'session', 'semester', 'grade', 'total_score', 'result_status']
    list_filter = ['grade', 'session', 'semester', 'result_status']
    search_fields = ['student__email']
    raw_id_fields = ['student', 'course', 'submitted_by', 'hod_approved_by', 'dean_approved_by', 'senate_approved_by']


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'academic_year', 'semester', 'level', 'status', 'total_credit_units', 'created_at']
    list_filter = ['status', 'academic_year', 'semester', 'level']
    search_fields = ['student__email', 'student__first_name', 'student__last_name']
    readonly_fields = ['created_at', 'updated_at', 'submitted_at', 'advisor_approved_at',
                       'hod_approved_at', 'dean_approved_at', 'registered_at']
    raw_id_fields = ['student', 'advisor', 'hod', 'dean', 'registration_period']


@admin.register(ProgressionRecord)
class ProgressionRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'session', 'decision', 'from_level', 'to_level', 'gpa', 'cgpa', 'is_reviewed', 'processed_at']
    list_filter = ['decision', 'session', 'is_reviewed']
    search_fields = ['student__email', 'student__first_name', 'student__last_name']
    raw_id_fields = ['student', 'processed_by']


@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ['course', 'session_date', 'start_time', 'end_time', 'is_active', 'created_by']
    list_filter = ['is_active', 'session_date']
    search_fields = ['course__code', 'course__title']


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'session', 'scanned_at']
    list_filter = ['session__session_date']
    search_fields = ['student__email', 'session__course__code']


@admin.register(RegistrationCourse)
class RegistrationCourseAdmin(admin.ModelAdmin):
    list_display = ['registration', 'course', 'is_compulsory', 'approval_status']
    list_filter = ['approval_status', 'is_compulsory']
    search_fields = ['registration__student__email', 'course__code', 'course__title']
    raw_id_fields = ['registration', 'course', 'approved_by']


@admin.register(HostelAllocation)
class HostelAllocationAdmin(admin.ModelAdmin):
    list_display = ['student', 'hostel_name', 'room_number', 'session', 'status', 'requested_at']
    list_filter = ['status', 'session']
    search_fields = ['student__email', 'hostel_name']
    raw_id_fields = ['student']



