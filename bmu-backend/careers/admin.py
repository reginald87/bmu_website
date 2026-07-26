from django.contrib import admin
from .models import JobPosting, JobApplication


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
