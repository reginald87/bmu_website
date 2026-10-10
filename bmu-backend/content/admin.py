from django.contrib import admin
from django import forms
from django.utils.html import format_html
from django.conf import settings
from django.utils import timezone
from core.email import send_templated_email
from .models import (
    NewsItem, Event, PageContent, Testimonial, Partner, FAQ, ContactEnquiry,
    PublicDocument, GalleryImage, HeroSlide, SDG, ImpactProgram,
    InternationalPartner, MOUAgreement, ExchangeProgram, StudentSupportService,
    UniversityRanking, KeyMetric, EventRegistration,
    CampusFeature, CampusStat, CampusTestimonial, CampusContactInfo, CampusImage, CampusVideo, CampusGalleryImage,
    FundingOrganization, FundedProject, FundedProjectImage,
    InnovationProgram, InnovationProgramImage, UniversityProject, UniversityProjectImage,
    AboutPage, AboutStat, AboutCoreValue,
    HistoryPage, HistoryIntroImage, TimelineEvent,
    VisionMissionPage, VisionMissionPillar, VisionMissionValue,
    GovernancePage, GovernanceBody, GovernanceCommittee, GovernancePolicy,
    Announcement, MenuItem, UtilityLink,
    PageSection, PortalDefinition, CentrePage, ArchivedContent, InstitutePage, MediaAsset,
    ContactInfo,
)


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'published_at', 'is_featured', 'is_published', 'views_count']
    list_filter = ['category', 'is_featured', 'is_published', 'published_at']
    search_fields = ['title', 'excerpt', 'content', 'author']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_date', 'event_type', 'category', 'location', 'registration_open', 'is_featured']
    list_filter = ['event_type', 'category', 'registration_open', 'is_featured', 'event_date']
    search_fields = ['title', 'description', 'location']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'event_date'


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['page', 'section_key', 'title', 'content_type', 'is_active', 'display_order', 'updated_at']
    list_filter = ['page', 'content_type', 'is_active']
    search_fields = ['title', 'content', 'section_key']
    list_editable = ['display_order', 'is_active']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'is_active', 'display_order']
    list_filter = ['is_active']
    search_fields = ['name', 'role', 'quote']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'website', 'is_active', 'display_order']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_active', 'display_order']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_published', 'is_featured', 'display_order', 'created_at']
    list_filter = ['category', 'is_published', 'is_featured']
    search_fields = ['title', 'description', 'photographer', 'location']
    list_editable = ['display_order', 'is_published', 'is_featured']
    readonly_fields = ['thumbnail_preview', 'created_at', 'updated_at']
    fieldsets = [
        ('Image', {'fields': ['image', 'thumbnail', 'thumbnail_preview']}),
        ('Details', {'fields': ['title', 'description', 'category']}),
        ('Metadata', {'fields': ['event_date', 'photographer', 'location']}),
        ('Display', {'fields': ['display_order', 'is_published', 'is_featured']}),
    ]

    @admin.display(description='Preview')
    def thumbnail_preview(self, obj):
        from django.utils.html import format_html

        if not obj.pk:
            return format_html('<span class="help">Save the image to generate a thumbnail.</span>')
        url = obj.thumbnail.url if obj.thumbnail else (obj.image.url if obj.image else None)
        if not url:
            return '-'
        return format_html(
            '<img src="{}" style="max-height:220px;max-width:320px;'
            'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.25);" alt="{}" />',
            url,
            obj.title,
        )


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at', 'assigned_to']
    list_filter = ['subject', 'status', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    fieldsets = [
        ('Enquiry Information', {
            'fields': ['name', 'email', 'subject', 'message']
        }),
        ('Status & Assignment', {
            'fields': ['status', 'assigned_to', 'notes']
        }),
        ('Response', {
            'fields': ['responded_at', 'response_message'],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        }),
    ]

    def save_model(self, request, obj, form, change):
        obj.full_clean()
        old = None
        if change and obj.pk:
            try:
                old = type(obj).objects.get(pk=obj.pk)
            except type(obj).DoesNotExist:
                old = None
        super().save_model(request, obj, form, change)
        if change and old is not None and old.status != obj.status and obj.status == 'responded':
            obj.responded_at = timezone.now()
            type(obj).objects.filter(pk=obj.pk).update(responded_at=obj.responded_at)
            try:
                send_templated_email(
                    subject=f'Re: {obj.subject}',
                    template='notification',
                    context={
                        'name': obj.name,
                        'heading': 'We Have Responded',
                        'body': (obj.response_message
                                 or 'Thank you for contacting Bayelsa Medical University. '
                                     'Your enquiry has been reviewed and addressed by our team.'),
                        'details': [
                            {'label': 'Subject', 'value': obj.subject},
                            {'label': 'Your message', 'value': obj.message},
                            {'label': 'Our response', 'value': obj.response_message or 'See details above'},
                        ],
                        'preheader': 'Your enquiry has been responded to',
                        'action_url': (getattr(settings, 'FRONTEND_URL', 'https://bmu.edu.ng')
                                       or 'https://bmu.edu.ng') + '/contact',
                        'action_label': 'Contact us',
                    },
                    recipient_list=[obj.email],
                )
            except Exception:
                pass


@admin.register(PublicDocument)
class PublicDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'file_type', 'file_size', 'version', 'download_count', 'is_active', 'display_order']
    list_filter = ['category', 'file_type', 'is_active', 'is_featured']
    search_fields = ['title', 'description']
    list_editable = ['display_order', 'is_active']
    readonly_fields = ['download_count', 'created_at', 'updated_at']


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'content_position', 'display_order', 'is_published', 'is_featured', 'start_date', 'end_date']
    list_filter = ['is_published', 'is_featured', 'content_position', 'start_date']
    search_fields = ['title', 'subtitle', 'description']
    list_editable = ['display_order', 'is_published', 'is_featured']
    fieldsets = [
        ('Content', {'fields': ['title', 'subtitle', 'description', 'content_position', 'text_color']}),
        ('Background', {'fields': ['background_image', 'background_video', 'overlay_color']}),
        ('Primary CTA', {'fields': ['primary_cta_text', 'primary_cta_url', 'primary_cta_color']}),
        ('Secondary CTA', {'fields': ['secondary_cta_text', 'secondary_cta_url', 'secondary_cta_color']}),
        ('Schedule', {'fields': ['start_date', 'end_date', 'display_order', 'is_published', 'is_featured']}),
    ]


@admin.register(SDG)
class SDGAdmin(admin.ModelAdmin):
    list_display = ['number', 'title', 'color', 'is_active', 'is_featured', 'display_order']
    list_filter = ['is_active', 'is_featured']
    search_fields = ['title', 'short_title', 'description']
    list_editable = ['is_active', 'is_featured', 'display_order']
    fieldsets = [
        ('Basic Info', {'fields': ['number', 'title', 'short_title', 'color', 'icon', 'description']}),
        ('Contributions', {'fields': ['contributions']}),
        ('Metrics', {'fields': [
            ('metric_1_label', 'metric_1_value', 'metric_1_target'),
            ('metric_2_label', 'metric_2_value', 'metric_2_target'),
            ('metric_3_label', 'metric_3_value', 'metric_3_target'),
        ]}),
        ('Chart Data', {'fields': ['progress_data']}),
        ('Display', {'fields': ['display_order', 'is_active', 'is_featured']}),
    ]


@admin.register(ImpactProgram)
class ImpactProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'program_type', 'location', 'is_published', 'is_featured', 'display_order']
    list_filter = ['program_type', 'is_published', 'is_featured', 'related_sdgs']
    search_fields = ['title', 'description', 'location']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published', 'is_featured', 'display_order']
    filter_horizontal = ['related_sdgs']
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'slug', 'subtitle', 'program_type', 'related_sdgs', 'description']}),
        ('Images', {'fields': ['banner_image', 'thumbnail']}),
        ('Statistics', {'fields': [
            ('stat_1_label', 'stat_1_value'),
            ('stat_2_label', 'stat_2_value'),
            ('stat_3_label', 'stat_3_value'),
            ('stat_4_label', 'stat_4_value'),
        ]}),
        ('Content', {'fields': ['objectives', 'achievements', 'partners', 'gallery_images']}),
        ('Contact', {'fields': ['location', 'contact_email', 'contact_phone']}),
        ('Display', {'fields': ['display_order', 'is_published', 'is_featured']}),
    ]


@admin.register(InternationalPartner)
class InternationalPartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'city', 'partner_type', 'students_exchanged', 'is_active', 'is_featured']
    list_filter = ['partner_type', 'is_active', 'is_featured', 'country']
    search_fields = ['name', 'country', 'city', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'is_featured']
    fieldsets = [
        ('Basic Info', {'fields': ['name', 'slug', 'country', 'city', 'partner_type', 'description']}),
        ('Contact', {'fields': ['website', 'contact_person', 'contact_email', 'contact_phone']}),
        ('Media', {'fields': ['logo', 'banner_image']}),
        ('Partnership', {'fields': ['established_year', 'focus_areas']}),
        ('Metrics', {'fields': ['students_exchanged', 'joint_publications', 'joint_projects']}),
        ('Display', {'fields': ['display_order', 'is_active', 'is_featured']}),
    ]


@admin.register(MOUAgreement)
class MOUAgreementAdmin(admin.ModelAdmin):
    list_display = ['title', 'partner', 'mou_type', 'signed_date', 'expiry_date', 'status', 'is_public']
    list_filter = ['mou_type', 'status', 'is_public', 'signed_date']
    search_fields = ['title', 'partner__name', 'scope_description']
    list_editable = ['status', 'is_public']
    autocomplete_fields = ['partner', 'bmu_coordinator']
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'mou_type', 'partner', 'document_file']}),
        ('Duration', {'fields': [('signed_date', 'expiry_date', 'duration_years')]}),
        ('Status', {'fields': ['status', 'is_public', 'display_order']}),
        ('Scope', {'fields': ['scope_description', 'key_activities', 'benefits']}),
        ('Coordinator', {'fields': ['bmu_coordinator']}),
    ]


@admin.register(ExchangeProgram)
class ExchangeProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'program_type', 'partner', 'status', 'application_deadline', 'available_slots', 'is_published']
    list_filter = ['program_type', 'status', 'is_published', 'is_featured']
    search_fields = ['title', 'partner__name', 'description']
    prepopulated_fields = {'slug': ('title',)}
    autocomplete_fields = ['partner', 'coordinator']
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'slug', 'program_type', 'partner', 'mou_agreement']}),
        ('Duration', {'fields': ['duration_weeks', 'start_date', 'end_date', 'application_deadline']}),
        ('Description', {'fields': ['description', 'banner_image']}),
        ('Details', {'fields': ['eligibility_criteria', 'benefits', 'costs']}),
        ('Capacity', {'fields': ['total_slots', 'available_slots']}),
        ('Contact', {'fields': ['coordinator', 'contact_email']}),
        ('Status', {'fields': ['status', 'is_published', 'is_featured', 'display_order']}),
    ]


@admin.register(StudentSupportService)
class StudentSupportServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'service_type', 'is_published', 'is_featured', 'display_order']
    list_filter = ['service_type', 'is_published', 'is_featured']
    search_fields = ['title', 'short_description', 'full_description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published', 'is_featured', 'display_order']
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'slug', 'service_type', 'icon', 'short_description', 'full_description']}),
        ('Service Details', {'fields': ['features', 'requirements', 'process_steps', 'faqs']}),
        ('Contact', {'fields': ['contact_person', 'contact_email', 'contact_phone', 'office_location', 'office_hours']}),
        ('Resources', {'fields': ['related_documents', 'useful_links']}),
        ('Display', {'fields': ['display_order', 'is_published', 'is_featured']}),
    ]


@admin.register(UniversityRanking)
class UniversityRankingAdmin(admin.ModelAdmin):
    list_display = ['title', 'entry_type', 'rank', 'year', 'display_order', 'is_active']
    list_filter = ['entry_type', 'is_active']
    search_fields = ['title', 'source', 'accrediting_body']
    list_editable = ['is_active', 'display_order']

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('entry_type', 'display_order')


@admin.register(KeyMetric)
class KeyMetricAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'category', 'display_order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['label']
    list_editable = ['is_active', 'display_order']


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'event', 'status', 'payment_status', 'amount_paid', 'registered_at']
    list_filter = ['status', 'payment_status', 'event']
    search_fields = ['name', 'email', 'event__title']
    readonly_fields = ['registered_at', 'paid_at', 'payment_reference']
    actions = ['mark_attended', 'cancel_registrations']

    def mark_attended(self, request, queryset):
        queryset.update(status='attended')
        self.message_user(request, f"{queryset.count()} registration(s) marked as attended.")
    mark_attended.short_description = "Mark selected as attended"

    def cancel_registrations(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f"{queryset.count()} registration(s) cancelled.")
    cancel_registrations.short_description = "Cancel selected registrations"


@admin.register(CampusFeature)
class CampusFeatureAdmin(admin.ModelAdmin):
    list_display = ['title', 'section_key', 'icon', 'display_order', 'is_active']
    list_filter = ['section_key', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['display_order', 'is_active']


@admin.register(CampusStat)
class CampusStatAdmin(admin.ModelAdmin):
    list_display = ['label', 'value', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['label']
    list_editable = ['display_order', 'is_active']


@admin.register(CampusTestimonial)
class CampusTestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'program', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'program', 'quote']
    list_editable = ['display_order', 'is_active']


@admin.register(CampusContactInfo)
class CampusContactInfoAdmin(admin.ModelAdmin):
    list_display = ['address', 'phone', 'email', 'office_hours']


@admin.register(CampusGalleryImage)
class CampusGalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'image_tag', 'display_order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'category']
    list_editable = ['display_order', 'is_active']

    def image_tag(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height:50px;max-width:80px;object-fit:cover;" />'
        return '-'
    image_tag.short_description = 'Preview'
    image_tag.allow_tags = True


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['address', 'phone', 'email', 'emergency_phone']

    def has_add_permission(self, request):
        if ContactInfo.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(CampusImage)
class CampusImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'caption', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'caption']
    list_editable = ['display_order', 'is_active']


@admin.register(CampusVideo)
class CampusVideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'video_type', 'display_order', 'is_active']
    list_filter = ['video_type', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['display_order', 'is_active']


@admin.register(FundingOrganization)
class FundingOrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'acronym', 'is_active', 'display_order']
    list_filter = ['is_active']
    search_fields = ['name', 'acronym', 'description']
    list_editable = ['display_order']


class FundedProjectImageInline(admin.TabularInline):
    model = FundedProjectImage
    extra = 1
    fields = ['image', 'caption', 'order']


@admin.register(FundedProject)
class FundedProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'amount', 'year', 'status', 'display_order', 'is_active']
    list_filter = ['status', 'year', 'organization', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['status', 'display_order']
    inlines = [FundedProjectImageInline]


# ============================================================================
# Technology & Innovation
# ============================================================================

class InnovationProgramImageInline(admin.TabularInline):
    model = InnovationProgramImage
    extra = 1
    fields = ['image', 'caption', 'order']


@admin.register(InnovationProgram)
class InnovationProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'program_type', 'status', 'year', 'lead_unit', 'is_featured', 'display_order']
    list_filter = ['program_type', 'status', 'is_active', 'is_featured']
    search_fields = ['title', 'subtitle', 'description', 'lead_unit']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'display_order']
    inlines = [InnovationProgramImageInline]
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'slug', 'subtitle', 'program_type', 'status', 'year', 'lead_unit', 'description']}),
        ('Media', {'fields': ['cover_image', 'thumbnail', 'video_url']}),
        ('Content', {'fields': ['objectives', 'achievements', 'partners']}),
        ('Statistics', {'fields': [
            ('stat_1_label', 'stat_1_value'),
            ('stat_2_label', 'stat_2_value'),
            ('stat_3_label', 'stat_3_value'),
        ]}),
        ('Display', {'fields': ['display_order', 'is_active', 'is_featured']}),
    ]


# ============================================================================
# University Projects
# ============================================================================

class UniversityProjectImageInline(admin.TabularInline):
    model = UniversityProjectImage
    extra = 1
    fields = ['image', 'caption', 'order']


@admin.register(UniversityProject)
class UniversityProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'year', 'lead_unit', 'is_featured', 'display_order']
    list_filter = ['category', 'status', 'is_active', 'is_featured']
    search_fields = ['title', 'subtitle', 'description', 'lead_unit']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'display_order']
    inlines = [UniversityProjectImageInline]
    fieldsets = [
        ('Basic Info', {'fields': ['title', 'slug', 'subtitle', 'category', 'status', 'year', 'lead_unit', 'description']}),
        ('Media', {'fields': ['image', 'video_url']}),
        ('Content', {'fields': ['highlights']}),
        ('Budget', {'fields': ['budget', 'completion_date']}),
        ('Display', {'fields': ['display_order', 'is_active', 'is_featured']}),
    ]


# ============================================================================
# About Page
# ============================================================================

class AboutStatInline(admin.TabularInline):
    model = AboutStat
    extra = 1
    fields = ['value', 'label', 'suffix', 'order']


class AboutCoreValueInline(admin.TabularInline):
    model = AboutCoreValue
    extra = 1
    fields = ['icon_name', 'title', 'description', 'order']


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    inlines = [AboutStatInline, AboutCoreValueInline]
    list_display = ['hero_title', 'updated_at']
    fieldsets = [
        ('Hero Section', {'fields': ['hero_title', 'hero_content']}),
        ('Main Content', {'fields': ['about_main_title', 'about_main_content']}),
        ('SEO', {'fields': ['meta_description']}),
    ]


# ============================================================================
# History Page
# ============================================================================

class TimelineEventInline(admin.TabularInline):
    model = TimelineEvent
    extra = 1
    fields = ['year', 'title', 'description', 'icon_name', 'order']


class HistoryIntroImageInline(admin.TabularInline):
    model = HistoryIntroImage
    extra = 1
    fields = ['image', 'caption', 'order']


@admin.register(HistoryPage)
class HistoryPageAdmin(admin.ModelAdmin):
    inlines = [TimelineEventInline, HistoryIntroImageInline]
    list_display = ['updated_at']
    fieldsets = [
        ('Hero Section', {'fields': ['hero_content']}),
        ('Introduction', {'fields': ['intro_title', 'intro_content', 'intro_image', 'intro_image_caption']}),
        ('Present Day Stats', {'fields': [
            ('stat_1_value', 'stat_1_label'),
            ('stat_2_value', 'stat_2_label'),
            ('stat_3_value', 'stat_3_label'),
        ]}),
        ('Future Vision', {'fields': ['future_title', 'future_content', 'future_quote']}),
        ('SEO', {'fields': ['meta_description']}),
    ]


# ============================================================================
# Vision & Mission Page
# ============================================================================

class VisionMissionPillarInline(admin.TabularInline):
    model = VisionMissionPillar
    extra = 1
    fields = ['icon_name', 'title', 'description', 'order']


class VisionMissionValueInline(admin.TabularInline):
    model = VisionMissionValue
    extra = 1
    fields = ['title', 'description', 'order']


@admin.register(VisionMissionPage)
class VisionMissionPageAdmin(admin.ModelAdmin):
    inlines = [VisionMissionPillarInline, VisionMissionValueInline]
    list_display = ['updated_at']
    fieldsets = [
        ('Hero Section', {'fields': ['hero_content']}),
        ('Content', {'fields': ['mission_content', 'vision_content']}),
        ('SEO', {'fields': ['meta_description']}),
    ]


# ============================================================================
# Governance Page
# ============================================================================

class GovernanceBodyInline(admin.TabularInline):
    model = GovernanceBody
    extra = 1
    fields = ['title', 'role', 'description', 'responsibilities', 'icon_name', 'color', 'order']


class GovernanceCommitteeInline(admin.TabularInline):
    model = GovernanceCommittee
    extra = 1
    fields = ['name', 'focus', 'order']


class GovernancePolicyInline(admin.TabularInline):
    model = GovernancePolicy
    extra = 1
    fields = ['title', 'description', 'order']


@admin.register(GovernancePage)
class GovernancePageAdmin(admin.ModelAdmin):
    inlines = [GovernanceBodyInline, GovernanceCommitteeInline, GovernancePolicyInline]
    list_display = ['updated_at']
    fieldsets = [
        ('Hero Section', {'fields': ['hero_content']}),
        ('SEO', {'fields': ['meta_description']}),
    ]


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'announcement_type', 'is_active', 'start_date', 'end_date']
    list_filter = ['announcement_type', 'is_active']
    search_fields = ['title', 'content']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['label', 'url', 'location', 'parent', 'column', 'display_order', 'is_active']
    list_filter = ['location', 'is_active', 'is_external']
    search_fields = ['label', 'url']
    list_editable = ['display_order', 'is_active']
    raw_id_fields = ['parent']


@admin.register(UtilityLink)
class UtilityLinkAdmin(admin.ModelAdmin):
    list_display = ['label', 'url', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['label', 'url']
    list_editable = ['display_order', 'is_active']


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = ['page_key', 'section_key', 'content_type', 'title', 'display_order', 'is_active']
    list_filter = ['page_key', 'content_type', 'is_active']
    search_fields = ['page_key', 'section_key', 'title']
    list_editable = ['display_order', 'is_active']
    readonly_fields = ['media_library_hint']
    fieldsets = (
        (None, {
            'fields': ('page_key', 'section_key', 'content_type', 'title', 'subtitle'),
        }),
        ('Content Data (JSON)', {
            'fields': ('data', 'media_library_hint'),
            'description': (
                'For image fields (e.g. quick_links "image"), upload a file in the '
                'Media Library, then paste the returned URL into the JSON below.'
            ),
        }),
        ('Publishing', {
            'fields': ('display_order', 'is_active'),
        }),
    )

    def media_library_hint(self, obj):
        return format_html(
            '<p style="padding:10px;background:#f6f6f6;border:1px solid #eee;font-size:12px;">'
            'Tip: Use the <a href="/admin/content/mediaasset/" target="_blank">Media Library</a> '
            'to upload images from your computer and get a URL to paste into the data JSON.'
            '</p>'
        )

    media_library_hint.short_description = 'Uploading images'


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ['title', 'image', 'preview', 'copy_url', 'file_size_kb', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['title', 'alt_text']
    readonly_fields = ['preview', 'copy_url', 'uploaded_at', 'file_size_kb']

    fieldsets = (
        (None, {
            'fields': ('title', 'image', 'alt_text'),
        }),
        ('Use in content', {
            'fields': ('copy_url',),
            'description': (
                'Copy the URL below and paste it into the "image" field of a '
                'PageSection data JSON (e.g. quick_links cards).'
            ),
        }),
        ('Metadata', {
            'fields': ('preview', 'file_size_kb', 'uploaded_at'),
        }),
    )

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<a href="{}" target="_blank"><img src="{}" style="max-height:120px;border:1px solid #ddd;"/></a>',
                obj.image.url, obj.image.url
            )
        return '-'

    preview.short_description = 'Preview'

    def copy_url(self, obj):
        if obj.image:
            return format_html(
                '<input readonly value="{}" style="width:100%;max-width:420px;font-family:monospace;padding:6px 8px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;"/>',
                obj.image.url
            )
        return '-'

    copy_url.short_description = 'Image URL'


@admin.register(PortalDefinition)
class PortalDefinitionAdmin(admin.ModelAdmin):
    list_display = ['title', 'audience', 'url', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title', 'description', 'audience']
    list_editable = ['display_order', 'is_active']


@admin.register(CentrePage)
class CentrePageAdmin(admin.ModelAdmin):
    list_display = ['slug', 'hero_title', 'contact_email', 'is_active']
    list_filter = ['is_active', 'slug']
    search_fields = ['hero_title', 'hero_subtitle', 'about_text']


@admin.register(ArchivedContent)
class ArchivedContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'content_type', 'original_date', 'category', 'display_order', 'is_active']
    list_filter = ['content_type', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['display_order', 'is_active']
    date_hierarchy = 'original_date'


@admin.register(InstitutePage)
class InstitutePageAdmin(admin.ModelAdmin):
    list_display = ['name', 'director', 'projects_count', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'focus', 'director']
    list_editable = ['display_order', 'is_active']
