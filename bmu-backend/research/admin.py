from django.contrib import admin
from .models import (
    ResearchAndDevelopment, ResearchProject, Publication,
    ResearchGrant, Collaboration, GrantApplication
)


class ResearchProjectInline(admin.TabularInline):
    model = ResearchProject
    extra = 0


class PublicationInline(admin.TabularInline):
    model = Publication.authors.through
    extra = 0


@admin.register(ResearchAndDevelopment)
class ResearchAndDevelopmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'leadership_name', 'total_publications', 'ongoing_projects_count', 'is_active']
    list_filter = ['is_active', 'is_featured']
    search_fields = ['name', 'description', 'director_display_name']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ResearchProjectInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'code', 'description')
        }),
        ('Leadership', {
            'fields': ('director', 'director_display_name', 'director_photo')
        }),
        ('Mission & Vision', {
            'fields': ('mission', 'vision', 'research_areas')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'location', 'website')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Metrics', {
            'fields': ('total_publications', 'ongoing_projects_count', 'completed_projects_count')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured', 'display_order', 'established_date')
        }),
    )


@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'center', 'principal_investigator', 'status', 'start_date', 'is_featured']
    list_filter = ['status', 'is_featured', 'start_date']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_date'


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'year', 'publication_type', 'citations', 'is_featured', 'is_peer_reviewed']
    list_filter = ['publication_type', 'year', 'is_featured', 'is_peer_reviewed']
    search_fields = ['title', 'abstract', 'keywords', 'authors__first_name', 'authors__last_name']
    filter_horizontal = ['authors']


@admin.register(ResearchGrant)
class ResearchGrantAdmin(admin.ModelAdmin):
    list_display = ['title', 'funding_agency', 'amount', 'currency', 'status', 'start_date']
    list_filter = ['status', 'start_date']
    search_fields = ['title', 'funding_agency', 'grant_number']


@admin.register(Collaboration)
class CollaborationAdmin(admin.ModelAdmin):
    list_display = ['partner_name', 'collaboration_type', 'bmu_coordinator', 'is_active', 'start_date']
    list_filter = ['collaboration_type', 'is_active']
    search_fields = ['partner_name', 'description']


@admin.register(GrantApplication)
class GrantApplicationAdmin(admin.ModelAdmin):
    list_display = ['proposal_title', 'applicant_name', 'applicant_email', 'grant', 'status', 'submitted_at', 'reviewed_at']
    list_filter = ['status', 'grant']
    search_fields = ['proposal_title', 'applicant_name', 'applicant_email']
    readonly_fields = ['submitted_at', 'updated_at']
    actions = ['approve_applications', 'reject_applications', 'shortlist_applications']

    def approve_applications(self, request, queryset):
        from django.utils import timezone
        for app in queryset:
            app.status = 'approved'
            app.reviewed_at = timezone.now()
            app.save()
        self.message_user(request, f"{queryset.count()} application(s) approved.")
    approve_applications.short_description = "Approve selected applications"

    def reject_applications(self, request, queryset):
        from django.utils import timezone
        for app in queryset:
            app.status = 'rejected'
            app.reviewed_at = timezone.now()
            app.save()
        self.message_user(request, f"{queryset.count()} application(s) rejected.")
    reject_applications.short_description = "Reject selected applications"

    def shortlist_applications(self, request, queryset):
        queryset.update(status='shortlisted')
        self.message_user(request, f"{queryset.count()} application(s) shortlisted.")
    shortlist_applications.short_description = "Shortlist selected applications"
