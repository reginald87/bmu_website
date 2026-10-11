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
    list_display = ['id', 'first_name', 'last_name', 'program_title', 'student_type', 'entry_mode', 'is_indigene', 'status', 'payment_status', 'created_at']
    list_filter = ['status', 'payment_status', 'student_type', 'entry_mode', 'is_indigene', 'program__level', 'created_at']
    search_fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'jamb_registration_number', 'de_jamb_registration_number']
    readonly_fields = ['id', 'created_at', 'updated_at', 'submitted_at', 'is_indigene']
    inlines = [AcademicRecordInline, ApplicationDocumentInline, ApplicationStepInline, ApplicationMessageInline]
    actions = ['matriculate_undergraduates', 'request_jamb_details']
    fieldsets = (
        ('Application Info', {
            'fields': ('id', 'status', 'progress_percentage', 'student_type', 'entry_mode', 'program', 'jamb_registration_number', 'de_jamb_registration_number')
        }),
        ('Revision', {
            'fields': ('revision_due_at', 'revision_note'),
            'description': 'Set the status to "Revision Requested" to open the edit window automatically.',
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender', 'address')
        }),
        ('Origin & Nationality', {
            'fields': ('nationality', 'state_of_origin', 'lga', 'is_indigene')
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

    def program_title(self, obj):
        return obj.program.title if obj.program else '-'
    program_title.short_description = 'Program'
    def request_jamb_details(self, request, queryset):
        """Open a revision asking legacy/UG applicants to supply their JAMB number.

        Existing applications were created before the JAMB field existed, so
        they have no number to backfill. This nudges those applicants to supply
        one (validated and unique) before their application proceeds.
        """
        from .emails import notify_application_status_change

        requested = 0
        skipped = 0
        for application in queryset.select_related('program'):
            if (not application.program
                    or application.program.level != 'undergraduate'
                    or application.jamb_registration_number):
                skipped += 1
                continue
            old_status = application.status
            application.status = 'revision_requested'
            application.save(update_fields=['status'])
            application.schedule_revision(
                note=('Please provide your JAMB registration number so we '
                      'can complete the review of your application.'),
            )
            ApplicationMessage.objects.create(
                application=application,
                type='info',
                text='Please provide your JAMB registration number.',
                from_name='Admissions Office',
            )
            notify_application_status_change(application, old_status)
            requested += 1

        self.message_user(
            request,
            f'Requested JAMB details from {requested} applicant(s); skipped {skipped}.',
        )

    @admin.action(description='Matriculate selected accepted undergraduates (assign matric numbers)')
    def matriculate_undergraduates(self, request, queryset):
        from accounts.models import StudentProfile
        from django.utils import timezone
        from .services import generate_undergraduate_matric_number
        from .views import create_student_record

        matriculated = 0
        skipped = 0
        for application in queryset.select_related('program'):
            if (application.status != 'accepted'
                    or not application.program
                    or application.program.level != 'undergraduate'):
                skipped += 1
                continue
            user = application.applicant
            profile = getattr(user, 'student_profile', None) if user else None
            if profile is None:
                user, profile, _ = create_student_record(application)
            if profile.matric_number:
                skipped += 1
                continue
            profile.matric_number = generate_undergraduate_matric_number()
            profile.matriculated_at = timezone.now()
            profile.save(update_fields=['matric_number', 'matriculated_at'])
            ApplicationMessage.objects.create(
                application=application,
                type='success',
                text=(f'You have been matriculated. Your matriculation number is '
                      f'{profile.matric_number}.'),
                from_name='Admissions Office',
            )
            matriculated += 1

        self.message_user(
            request,
            f'Matriculated {matriculated} undergraduate(s); skipped {skipped}.',
        )

    def save_model(self, request, obj, form, change):
        # The row has not been written yet at this point, so the database still
        # holds the previous status.
        old_status = None
        if change:
            old_status = Application.objects.filter(pk=obj.pk).values_list('status', flat=True).first()

        super().save_model(request, obj, form, change)

        # Keep the revision window in sync when an admin changes the status.
        if obj.status == 'revision_requested' and old_status != 'revision_requested':
            obj.schedule_revision()
        elif old_status == 'revision_requested' and obj.status != 'revision_requested':
            obj.clear_revision()

        matric_number = None
        if obj.status == 'accepted' and old_status != 'accepted':
            from .views import create_student_record
            _, _, matric_number = create_student_record(obj)

        from .emails import notify_application_submitted, notify_application_status_change
        if not change:
            if obj.status == 'submitted':
                notify_application_submitted(obj)
        else:
            notify_application_status_change(obj, old_status, matric_number=matric_number)


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
