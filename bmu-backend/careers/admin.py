from django.contrib import admin
from django.conf import settings
from core.email import send_templated_email
from .models import JobPosting, JobApplication


def notify_job_application_status(application):
    """Email the applicant when their application status changes."""
    try:
        status_label = application.get_status_display()
        base = getattr(settings, 'FRONTEND_URL', 'https://bmu.edu.ng') or 'https://bmu.edu.ng'
        send_templated_email(
            subject=f'Application Update — {application.job.title}',
            template='notification',
            context={
                'name': application.first_name,
                'heading': 'Job Application Update',
                'body': f"Your application for {application.job.title} ({application.job.department}) "
                        f'is now marked as "{status_label}".',
                'details': [
                    {'label': 'Position', 'value': application.job.title},
                    {'label': 'Department', 'value': application.job.department},
                    {'label': 'Status', 'value': status_label},
                ],
                'next_steps': 'The recruitment team will reach out with the next steps.',
                'preheader': f'Application update: {status_label}',
                'action_url': f'{base}/careers',
                'action_label': 'View careers',
            },
            recipient_list=[application.email],
        )
    except Exception:
        pass


class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    readonly_fields = ['submitted_at', 'updated_at']
    fields = ['first_name', 'last_name', 'email', 'status', 'resume', 'submitted_at']


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'college', 'job_type', 'status', 'posted_date', 'application_deadline', 'is_open']
    list_filter = ['job_type', 'status', 'college', 'posted_date']
    search_fields = ['title', 'department', 'description']
    inlines = [JobApplicationInline]
    date_hierarchy = 'posted_date'


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['job', 'full_name', 'email', 'status', 'submitted_at', 'interview_date']
    list_filter = ['status', 'submitted_at']
    search_fields = ['first_name', 'last_name', 'email', 'job__title']
    readonly_fields = ['submitted_at', 'updated_at']
    date_hierarchy = 'submitted_at'

    def save_model(self, request, obj, form, change):
        old_status = None
        if change and obj.pk:
            try:
                old_status = type(obj).objects.get(pk=obj.pk).status
            except (type(obj).DoesNotExist, AttributeError):
                pass
        super().save_model(request, obj, form, change)
        if old_status is not None and old_status != obj.status:
            notify_job_application_status(obj)
