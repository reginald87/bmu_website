from django.contrib import admin
from .models import Application, AcademicRecord, ApplicationDocument, ApplicationStep, ApplicationMessage, AdmissionRequirement, ImportantDate


class AcademicRecordInline(admin.TabularInline):
    model = AcademicRecord
    extra = 0
    readonly_fields = ['review_notes', 'reviewed_by', 'reviewed_at']


class ApplicationDocumentInline(admin.TabularInline):
    model = ApplicationDocument
    extra = 0
    readonly_fields = ['uploaded_at', 'updated_at']


class ApplicationStepInline(admin.TabularInline):
    model = ApplicationStep
    extra = 0
    readonly_fields = ['created_at', 'updated_at']


class ApplicationMessageInline(admin.TabularInline):
    model = ApplicationMessage
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'program', 'student_type', 'status', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'student_type', 'program__level', 'created_at']
    search_fields = ['id', 'first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['id', 'created_at', 'updated_at', 'submitted_at']
    inlines = [AcademicRecordInline, ApplicationDocumentInline, ApplicationStepInline, ApplicationMessageInline]
    fieldsets = (
        ('Application Info', {
            'fields': ('id', 'status', 'progress_percentage', 'student_type', 'program')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender', 'address')
        }),
        ('Academic Information', {
            'fields': ('previous_institution',)
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_amount', 'payment_currency', 'payment_method', 'paid_at', 'payment_reference')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AcademicRecord)
class AcademicRecordAdmin(admin.ModelAdmin):
    list_display = ['application', 'type', 'institution_name', 'year_of_completion', 'status']
    list_filter = ['type', 'status', 'year_of_completion']
    search_fields = ['application__id', 'institution_name']


@admin.register(ApplicationDocument)
class ApplicationDocumentAdmin(admin.ModelAdmin):
    list_display = ['application', 'name', 'status', 'uploaded_at']
    list_filter = ['status', 'name', 'uploaded_at']
    search_fields = ['application__id', 'application__email']


@admin.register(ApplicationStep)
class ApplicationStepAdmin(admin.ModelAdmin):
    list_display = ['application', 'name', 'status', 'completed_at']
    list_filter = ['name', 'status']


@admin.register(ApplicationMessage)
class ApplicationMessageAdmin(admin.ModelAdmin):
    list_display = ['application', 'type', 'from_name', 'created_at', 'is_from_applicant']
    list_filter = ['type', 'is_from_applicant', 'created_at']


@admin.register(AdmissionRequirement)
class AdmissionRequirementAdmin(admin.ModelAdmin):
    list_display = ['category', 'title', 'display_order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title']


@admin.register(ImportantDate)
class ImportantDateAdmin(admin.ModelAdmin):
    list_display = ['event', 'date', 'status', 'display_order']
    list_filter = ['status', 'date']
    search_fields = ['event']
