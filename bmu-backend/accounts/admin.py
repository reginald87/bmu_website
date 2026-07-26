from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserActivity, Notification, PasswordResetToken, StudentProfile
from .alumni_models import AlumniProfile, AlumniEvent, AlumniDonation


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'is_email_verified', 'created_at']
    list_filter = ['role', 'is_active', 'is_email_verified', 'is_staff', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'student_id', 'employee_id']
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('BMU Profile', {
            'fields': ('role', 'student_status', 'phone', 'profile_image', 'bio', 'address', 'city', 'state', 'country')
        }),
        ('Academic Info', {
            'fields': ('department', 'college', 'program', 'student_id', 'enrollment_year', 'employee_id')
        }),
        ('Status', {
            'fields': ('is_email_verified', 'is_profile_complete')
        }),
    )


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'ip_address', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read', 'created_at']
    search_fields = ['user__email', 'title', 'message']
    readonly_fields = ['created_at']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token', 'expires_at', 'is_used', 'created_at']
    list_filter = ['is_used', 'created_at']
    readonly_fields = ['created_at']


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'matric_number', 'current_level', 'admission_date', 'state_of_origin']
    list_filter = ['current_level', 'admission_type', 'entry_mode', 'nationality']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'matric_number']
    raw_id_fields = ['user', 'academic_advisor']
    readonly_fields = ['created_at', 'updated_at']


# Alumni models
@admin.register(AlumniProfile)
class AlumniProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'graduation_year', 'program', 'current_employer', 'job_title', 'career_status', 'is_mentor']
    list_filter = ['graduation_year', 'career_status', 'is_mentor', 'is_paying_dues']
    search_fields = ['user__first_name', 'user__last_name', 'current_employer', 'job_title']
    raw_id_fields = ['user', 'program']


@admin.register(AlumniEvent)
class AlumniEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'event_date', 'is_virtual', 'target_year']
    list_filter = ['event_type', 'is_virtual']
    search_fields = ['title', 'description']
    filter_horizontal = ['attendees']
    date_hierarchy = 'event_date'


@admin.register(AlumniDonation)
class AlumniDonationAdmin(admin.ModelAdmin):
    list_display = ['donor', 'amount', 'currency', 'purpose', 'is_anonymous', 'donated_at']
    list_filter = ['currency', 'is_anonymous']
    search_fields = ['donor__user__first_name', 'donor__user__last_name', 'purpose']
    date_hierarchy = 'donated_at'
