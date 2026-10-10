"""
Django Ninja API for BMU Backend
"""
import types, logging, re, json

from core.throttle import ratelimit

from ninja import NinjaAPI, Router, Schema, Field
from ninja.errors import HttpError
from ninja.pagination import paginate
from ninja_auth import JWTAuth
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.db.models import Count, Q, Sum, Avg
from django.utils import timezone
from typing import Any, List, Optional
from datetime import datetime, date
from decimal import Decimal
from django.conf import settings

User = get_user_model()


# Create API instances
api = NinjaAPI(
    title="BMU API",
    version="1.0.0",
    description="API for Bayelsa Medical University Management System",
    auth=JWTAuth()
)

public_api = NinjaAPI(
    title="BMU Public API",
    version="1.0.0",
    description="Public API endpoints for BMU",
    urls_namespace="public_api"
)


# ============================================================================
# PUBLIC API ENDPOINTS (No authentication required)
# ============================================================================

# Import models
from academics.models import (
    College, FacultyUnit, Department, Program, Faculty, Course, SDGMetric, HomeStats, Leadership,
    AcademicCalendar, ProgramAccreditation, ProgramFacility, ProgramHighlight,
    ProgramCurriculumYear, ProgramCurriculumCourse, ProgramAdmissionRequirement,
    NonAcademicStaff, FacultyCustomLink,
)
from content.models import (
    NewsItem, Event, Testimonial, Partner, ContactEnquiry, PublicDocument, PageContent, GalleryImage,
    HeroSlide, SDG, ImpactProgram, InternationalPartner, MOUAgreement, ExchangeProgram,
    StudentSupportService, UniversityRanking, KeyMetric, EventRegistration,
    CampusFeature, CampusStat, CampusTestimonial, CampusContactInfo, CampusImage, CampusVideo, CampusGalleryImage,
    FundingOrganization, FundedProject,
    InnovationProgram, InnovationProgramImage, UniversityProject, UniversityProjectImage,
    AboutPage, HistoryPage, VisionMissionPage, GovernancePage,
    Announcement, MenuItem, UtilityLink,
    PageSection, PortalDefinition, CentrePage, ArchivedContent, InstitutePage,
    MediaAsset, ContactInfo,
)
from research.models import ResearchAndDevelopment, Publication, ResearchGrant, GrantApplication
from careers.models import JobPosting
from library.models import BookCategory, Book, DigitalResource
from chat.models import Conversation, Message
from accounts.alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
import locale


# Schemas
class CollegeSchema(Schema):
    id: int
    name: str
    slug: str
    description: str
    established_year: Optional[int] = None
    faculty_count: int
    student_count: int
    faculty_members_count: int
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    icon_name: Optional[str] = None
    preview_image: Optional[str] = None
    banner_image: Optional[str] = None
    department_count: int = 0
    leadership_name: str = Field(..., alias="leadership_name")
    leadership_title: str = Field(..., alias="leadership_title")
    director_name: str = Field(..., alias="director_name")
    overview_content: Optional[str] = None
    mission_statement: Optional[str] = None
    vision_statement: Optional[str] = None
    provost_id: Optional[int] = None
    provost_photo: Optional[str] = None

    @staticmethod
    def resolve_provost_photo(obj):
        if obj.provost_photo:
            return obj.provost_photo.url
        return None


class FacultyUnitSchema(Schema):
    id: int
    name: str
    slug: str
    code: Optional[str] = None
    college_id: Optional[int] = None
    college_name: Optional[str] = None
    description: Optional[str] = None
    department_count: int
    staff_count: int
    leadership_name: str = Field(..., alias="leadership_name")
    leadership_title: str = Field(..., alias="leadership_title")
    dean_photo: Optional[str] = None

    @staticmethod
    def resolve_dean_photo(obj):
        if obj.dean_photo:
            return obj.dean_photo.url
        return None


class DepartmentSchema(Schema):
    id: int
    name: str
    slug: str
    code: Optional[str] = None
    faculty_id: int
    faculty_name: str = Field(..., alias="faculty.name")
    college_id: int = Field(..., alias="college.id")
    college_name: str = Field(..., alias="college.name")
    description: Optional[str] = None
    staff_count: int
    leadership_name: str = Field(..., alias="leadership_name")
    leadership_title: str = Field(..., alias="leadership_title")
    hod_photo: Optional[str] = None

    @staticmethod
    def resolve_hod_photo(obj):
        if obj.hod_photo:
            return obj.hod_photo.url
        return None


class LeadershipProfileSchema(Schema):
    """Schema for leadership profiles with photo and link"""
    id: int
    full_name: str = Field(..., alias="full_name")
    email: str
    profile_image: Optional[str] = None
    position: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    specialization: Optional[str] = None
    office_location: Optional[str] = None
    publications_count: int
    research_interests: Optional[str] = None
    dean_name: Optional[str] = None
    established_year: int
    faculty_count: int
    student_count: int
    primary_color: Optional[str] = None


class ProgramListSchema(Schema):
    id: int
    title: str
    slug: str
    degree: Optional[str] = None
    level: str
    category: str
    duration: str
    description: Optional[str] = None
    requirements: str
    career_opportunities: Optional[str] = None
    color: Optional[str] = None
    icon: str
    college_id: Optional[int] = None
    college_name: Optional[str] = None
    department_id: Optional[int] = None
    applications_open: bool = True

    @staticmethod
    def resolve_college_name(obj):
        return obj.college.name if obj.college else None


class ApplyProgramSchema(Schema):
    id: int
    title: str
    slug: str
    degree: Optional[str] = None
    level: str
    level_display: Optional[str] = None
    duration: str
    college_name: Optional[str] = None
    application_fee_local: float
    application_fee_intl: float

    @staticmethod
    def resolve_level_display(obj):
        return obj.get_level_display()

    @staticmethod
    def resolve_college_name(obj):
        return obj.college.name if obj.college else None


class ProgramAccreditationSchema(Schema):
    body_name: str
    body_acronym: Optional[str] = None


class ProgramFacilitySchema(Schema):
    name: str
    description: Optional[str] = None


class ProgramHighlightSchema(Schema):
    text: str


class ProgramCurriculumCourseSchema(Schema):
    name: str


class ProgramCurriculumYearSchema(Schema):
    year_label: str
    year_number: int
    description: Optional[str] = None
    courses: List[ProgramCurriculumCourseSchema]


class ProgramAdmissionRequirementSchema(Schema):
    requirement: str


class ProgramDetailSchema(Schema):
    id: int
    title: str
    slug: str
    degree: Optional[str] = None
    level: str
    level_display: str = Field(..., alias="get_level_display")
    category: str
    category_display: str = Field(..., alias="get_category_display")
    duration: str
    intake: Optional[str] = None
    description: Optional[str] = None
    overview: Optional[str] = None
    requirements: str
    career_opportunities: Optional[str] = None
    color: Optional[str] = None
    icon: str
    college: Optional[CollegeSchema] = None
    accreditations: List[ProgramAccreditationSchema]
    facilities: List[ProgramFacilitySchema]
    highlights: List[ProgramHighlightSchema]
    curriculum_years: List[ProgramCurriculumYearSchema]
    admission_requirements: List[ProgramAdmissionRequirementSchema]


class FacultySchema(Schema):
    id: int
    full_name: str
    first_name: str
    last_name: str
    title: str
    position: str
    position_display: str = Field(..., alias="get_position_display")
    department_id: Optional[int] = None
    college_id: Optional[int] = None
    department: Optional[str] = None
    college: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None
    bio: str
    research_interests: str
    orcid_id: Optional[str] = None
    google_scholar_url: Optional[str] = None
    researchgate_url: Optional[str] = None
    citations: int = 0
    h_index: int = 0
    i10_index: int = 0

    @staticmethod
    def resolve_department(obj):
        return obj.department.name if obj.department else None

    @staticmethod
    def resolve_college(obj):
        return obj.college.name if obj.college else None


class FacultyPublicationSchema(Schema):
    id: int
    title: str
    year: int
    journal: str
    citations: int
    doi: Optional[str] = None
    url: Optional[str] = None


class FacultyDetailSchema(Schema):
    id: int
    full_name: str
    first_name: str
    last_name: str
    title: str
    position: str
    position_display: str = Field(..., alias="get_position_display")
    department_id: Optional[int] = None
    college_id: Optional[int] = None
    department: Optional[str] = None
    college: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None
    bio: str
    research_interests: str
    orcid_id: Optional[str] = None
    google_scholar_url: Optional[str] = None
    researchgate_url: Optional[str] = None
    citations: int = 0
    h_index: int = 0
    i10_index: int = 0
    publications: List[FacultyPublicationSchema] = []
    custom_links: List['FacultyCustomLinkSchema'] = []

    @staticmethod
    def resolve_profile_image(obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None

    @staticmethod
    def resolve_department(obj):
        return obj.department.name if obj.department else None

    @staticmethod
    def resolve_college(obj):
        return obj.college.name if obj.college else None

    @staticmethod
    def resolve_publications(obj):
        return list(obj.publications.all()[:20])

    @staticmethod
    def resolve_custom_links(obj):
        return list(obj.custom_links.filter(is_active=True).order_by('display_order'))


class FacultyCustomLinkSchema(Schema):
    id: int
    label: str
    url: str
    display_order: int


class MenuItemSchema(Schema):
    id: int
    label: str
    url: str
    is_external: bool
    parent_id: Optional[int] = None
    location: str
    icon: str
    description: str
    column: int
    display_order: int
    children: List['MenuItemSchema'] = []

    @staticmethod
    def resolve_children(obj):
        if hasattr(obj, '_prefetched_children'):
            return obj._prefetched_children
        return list(obj.children.filter(is_active=True).order_by('display_order'))


class UtilityLinkSchema(Schema):
    id: int
    label: str
    url: str
    display_order: int


class NewsItemSchema(Schema):
    id: int
    title: str
    slug: str
    excerpt: str
    content: Optional[str] = None
    category: str
    category_display: str = Field(..., alias="get_category_display")
    featured_image: Optional[str] = None
    author: str
    published_at: datetime
    is_featured: bool


class EventSchema(Schema):
    id: int
    title: str
    slug: str
    description: str
    event_date: datetime
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    event_type: str
    event_type_display: str = Field(..., alias="get_event_type_display")
    category: str
    category_display: str = Field(..., alias="get_category_display")
    location: str
    featured_image: Optional[str] = None
    registration_open: bool
    registered_count: int
    max_attendees: Optional[int] = None
    is_featured: bool
    fee: Optional[Decimal] = None
    currency: str = 'NGN'

    @staticmethod
    def resolve_start_time(obj):
        return obj.start_time.strftime('%I:%M %p').lstrip('0') if obj.start_time else None

    @staticmethod
    def resolve_end_time(obj):
        return obj.end_time.strftime('%I:%M %p').lstrip('0') if obj.end_time else None

    @staticmethod
    def resolve_featured_image(obj):
        return obj.featured_image.url if obj.featured_image else None


class HomeStatsSchema(Schema):
    research_papers: int
    students: int
    faculty: int
    partners: int


class SDGMetricSchema(Schema):
    sdg_code: str
    label: str
    current_value: int
    target_value: int
    unit: str


class SDGGroupSchema(Schema):
    title: str
    metrics: List[SDGMetricSchema]


class ResearchAndDevelopmentSchema(Schema):
    id: int
    name: str
    slug: str
    code: Optional[str] = None
    description: str
    mission: Optional[str] = None
    vision: Optional[str] = None
    research_areas: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    featured_image: Optional[str] = None
    director_id: Optional[int] = None
    director_name: str = Field(..., alias="leadership_name")
    director_title: str = "Director"
    director_photo: Optional[str] = None
    total_publications: int = 0
    ongoing_projects_count: int = 0
    completed_projects_count: int = 0
    is_active: bool = True
    is_featured: bool = False
    established_date: Optional[date] = None

    @staticmethod
    def resolve_director_photo(obj):
        if obj.director_photo:
            request = obj.director_photo.storage
            try:
                return obj.director_photo.url
            except Exception:
                return None
        if obj.director and hasattr(obj.director, 'profile_image') and obj.director.profile_image:
            try:
                return obj.director.profile_image.url
            except Exception:
                return None
        return None


class PublicationSchema(Schema):
    id: int
    title: str
    authors_list: List[str]
    year: int
    publication_type: str
    journal_name: Optional[str] = None
    doi: Optional[str] = None
    citations: int = 0
    category: str = ''
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    volume: Optional[str] = None
    issue: Optional[str] = None
    pages: Optional[str] = None

    @staticmethod
    def resolve_authors_list(obj):
        faculty_names = [str(f) for f in obj.authors.all()]
        if obj.external_authors:
            ext = [a.strip() for a in obj.external_authors.split(',') if a.strip()]
            return faculty_names + ext
        return faculty_names


class JobPostingSchema(Schema):
    id: int
    title: str
    department: str
    job_type: str
    job_type_display: str = Field(..., alias="get_job_type_display")
    location: str
    is_open: bool


class BookSchema(Schema):
    id: int
    title: str
    authors: str
    isbn: Optional[str] = None
    resource_type: str
    publication_year: Optional[int] = None
    description: str
    total_copies: int
    available_copies: int
    categories: List[str] = Field(None, alias="category_names")


class DigitalResourceSchema(Schema):
    id: int
    name: str
    description: str
    resource_type: str
    url: str


class LibraryServiceSchema(Schema):
    id: int
    icon: str
    title: str
    description: str


class LibraryStatSchema(Schema):
    id: int
    value: str
    label: str


class LibraryHourSchema(Schema):
    id: int
    day: str
    hours: str


class LibraryGuidelineSchema(Schema):
    id: int
    title: str
    text: str


class DeadlineSchema(Schema):
    id: int
    title: str
    deadline: str
    icon_name: str


class TestimonialSchema(Schema):
    id: int
    name: str
    role: str
    quote: str
    photo_url: Optional[str] = None

    @staticmethod
    def resolve_photo_url(obj):
        if obj.photo:
            return obj.photo.url
        return None


class PartnerSchema(Schema):
    id: int
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None

    @staticmethod
    def resolve_logo_url(obj):
        if obj.logo:
            return obj.logo.url
        return None


class LeadershipSchema(Schema):
    id: int
    full_name: str
    position: str
    position_display: str = Field(..., alias="get_position_display")
    specific_title: Optional[str] = None
    biography: str
    qualifications: str = ''
    research_interests: str = ''
    email: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    achievements: str = ''

    @staticmethod
    def resolve_photo(obj):
        if obj.photo:
            return obj.photo.url
        return None


class LeadershipPublicationSchema(Schema):
    id: int
    title: str
    year: int
    journal: str
    citations: int
    doi: Optional[str] = None
    url: Optional[str] = None


class LeadershipDetailSchema(Schema):
    id: int
    full_name: str
    position: str
    position_display: str = Field(..., alias="get_position_display")
    specific_title: Optional[str] = None
    biography: str
    qualifications: str = ''
    research_interests: str = ''
    email: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    achievements: str = ''
    publications: List[LeadershipPublicationSchema] = []

    @staticmethod
    def resolve_photo(obj):
        if obj.photo:
            return obj.photo.url
        return None

    @staticmethod
    def resolve_publications(obj):
        return list(obj.publications.all()[:20])


class AcademicCalendarSchema(Schema):
    id: int
    academic_year: str
    term: Optional[str] = None
    term_display: Optional[str] = Field(None, alias="get_term_display")
    title: str
    event_type: str
    event_type_display: str = Field(..., alias="get_event_type_display")
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    is_important: bool


class AdmissionRequirementSchema(Schema):
    id: int
    category: str
    category_display: str = Field(..., alias="get_category_display")
    title: str
    items: list
    display_order: int


class ImportantDateSchema(Schema):
    id: int
    event: str
    date: str
    status: str
    status_display: str = Field(..., alias="get_status_display")
    description: str


class ContactCreateSchema(Schema):
    name: str
    email: str
    subject: str
    message: str


class ContactResponseSchema(Schema):
    id: int
    name: str
    email: str
    subject: str
    subject_display: str = Field(..., alias="get_subject_display")
    status: str
    status_display: str = Field(..., alias="get_status_display")
    created_at: datetime


class PageContentSchema(Schema):
    id: int
    page: str
    page_display: str = Field(..., alias="get_page_display")
    section_key: str
    content_type: str
    content_type_display: str = Field(..., alias="get_content_type_display")
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    extra_data: Optional[dict] = None
    display_order: int


class AboutStatSchema(Schema):
    value: str
    label: str
    suffix: str = ''
    order: int


class AboutCoreValueSchema(Schema):
    icon_name: str = ''
    title: str
    description: str
    order: int


class AboutPageSchema(Schema):
    hero_title: str
    hero_content: str = ''
    about_main_title: str = ''
    about_main_content: str = ''
    mission_content: str = ''
    vision_content: str = ''
    why_choose: List[dict] = []
    meta_description: str = ''
    stats: List[AboutStatSchema] = []
    core_values: List[AboutCoreValueSchema] = []


class TimelineEventSchema(Schema):
    year: str
    title: str
    description: str
    icon_name: str = ''
    order: int


class HistoryStatSchema(Schema):
    value: str
    label: str


class HistoryIntroImageSchema(Schema):
    image: str
    caption: str = ''
    order: int


class HistoryPageSchema(Schema):
    hero_content: str = ''
    meta_description: str = ''
    timeline_events: List[TimelineEventSchema] = []
    intro_title: str = ''
    intro_content: str = ''
    intro_image: Optional[str] = None
    intro_image_caption: str = ''
    intro_images: List[HistoryIntroImageSchema] = []
    stats: List[HistoryStatSchema] = []
    future_title: str = ''
    future_content: str = ''
    future_quote: str = ''


class AnnouncementSchema(Schema):
    id: int
    title: str
    content: str = ''
    image: Optional[str] = None
    announcement_type: str
    link_url: str = ''
    link_text: str = ''
    created_at: datetime


class VisionMissionPillarSchema(Schema):
    icon_name: str = ''
    title: str
    description: str
    order: int


class VisionMissionValueSchema(Schema):
    title: str
    description: str
    order: int


class VisionMissionPageSchema(Schema):
    hero_content: str = ''
    mission_content: str = ''
    vision_content: str = ''
    meta_description: str = ''
    strategic_pillars: List[VisionMissionPillarSchema] = []
    core_values: List[VisionMissionValueSchema] = []


class GovernanceBodySchema(Schema):
    title: str
    role: str = ''
    description: str = ''
    responsibilities: List[str] = []
    icon_name: str = ''
    color: str = ''
    order: int


class GovernanceCommitteeSchema(Schema):
    name: str
    focus: str = ''
    order: int


class GovernancePolicySchema(Schema):
    title: str
    description: str = ''
    order: int


class GovernancePageSchema(Schema):
    hero_content: str = ''
    meta_description: str = ''
    governing_bodies: List[GovernanceBodySchema] = []
    committees: List[GovernanceCommitteeSchema] = []
    policies: List[GovernancePolicySchema] = []


class CampusFeatureSchema(Schema):
    id: int
    section_key: str
    section_key_display: str = Field(..., alias="get_section_key_display")
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    display_order: int


class CampusStatSchema(Schema):
    id: int
    label: str
    value: str
    display_order: int


class CampusTestimonialSchema(Schema):
    id: int
    name: str
    program: Optional[str] = None
    quote: str
    image: Optional[str] = None


class CampusContactInfoSchema(Schema):
    id: int
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    office_hours: Optional[str] = None


class ContactInfoSchema(Schema):
    id: int
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    emergency_label: Optional[str] = None
    emergency_phone: Optional[str] = None
    office_hours: Optional[str] = None


class CampusImageSchema(Schema):
    id: int
    title: str
    caption: Optional[str] = None
    image: str
    display_order: int


class CampusGalleryImageSchema(Schema):
    id: int
    title: str
    category: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    display_order: int

    @staticmethod
    def resolve_image_url(obj):
        if obj.image:
            return obj.image.url
        return None

    @staticmethod
    def resolve_thumbnail_url(obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None


class CampusVideoSchema(Schema):
    id: int
    title: str
    description: Optional[str] = None
    video_type: str
    video_type_display: str = Field(..., alias="get_video_type_display")
    video_url: Optional[str] = None
    video_file: Optional[str] = None
    thumbnail: Optional[str] = None
    embed_url: str = Field(..., alias="get_embed_url")
    display_order: int


class UniversityRankingSchema(Schema):
    id: int
    entry_type: str
    title: str
    description: str
    rank: str
    year: str
    source: str
    accrediting_body: str
    body_full_name: str
    status: str
    validity: str
    accredited_programs: str
    display_order: int
    is_active: bool
    logo_url: Optional[str] = None

    @staticmethod
    def resolve_logo_url(obj):
        if obj.logo:
            return obj.logo.url
        return None


class NonAcademicStaffSchema(Schema):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    full_name: str = Field(..., alias="full_name")
    email: str
    phone: Optional[str] = None
    category: str
    category_display: str = Field(..., alias="get_category_display")
    employment_type: str
    job_title: str
    college_name: Optional[str] = Field(None, alias="college.name")
    department_name: Optional[str] = Field(None, alias="department.name")
    qualifications: str
    responsibilities: str
    research_interests: str = ''
    office_location: Optional[str] = None
    date_joined: Optional[str] = None
    photo_url: Optional[str] = None

    @staticmethod
    def resolve_date_joined(obj):
        if obj.date_joined:
            return obj.date_joined.isoformat()
        return None

    @staticmethod
    def resolve_photo_url(obj):
        if obj.photo:
            return obj.photo.url
        return None


class StaffPublicationSchema(Schema):
    id: int
    title: str
    year: int
    journal: str
    citations: int
    doi: Optional[str] = None
    url: Optional[str] = None


class StaffDetailSchema(Schema):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    full_name: str = Field(..., alias="full_name")
    email: str
    phone: Optional[str] = None
    category: str
    category_display: str = Field(..., alias="get_category_display")
    employment_type: str
    job_title: str
    college_name: Optional[str] = Field(None, alias="college.name")
    department_name: Optional[str] = Field(None, alias="department.name")
    qualifications: str
    responsibilities: str
    research_interests: str = ''
    office_location: Optional[str] = None
    date_joined: Optional[str] = None
    photo_url: Optional[str] = None
    publications: List[StaffPublicationSchema] = []

    @staticmethod
    def resolve_date_joined(obj):
        if obj.date_joined:
            return obj.date_joined.isoformat()
        return None

    @staticmethod
    def resolve_photo_url(obj):
        if obj.photo:
            return obj.photo.url
        return None

    @staticmethod
    def resolve_publications(obj):
        return list(obj.publications.all()[:20])


class KeyMetricSchema(Schema):
    id: int
    label: str
    value: str
    category: str
    icon_name: str
    description: str
    display_order: int


# Chat schemas
class ChatMessageSchema(Schema):
    id: int
    role: str
    content: str
    created_at: str


class ChatHistorySchema(Schema):
    session_id: str
    messages: List[ChatMessageSchema]
    agent_online: bool


class ContactUpdateSchema(Schema):
    name: str
    email: str = ""


# Public router
public_router = Router()


@public_router.get("/colleges", response=List[CollegeSchema])
@paginate
def list_colleges(request):
    """List all active colleges"""
    return College.objects.filter(is_active=True).annotate(
        department_count=Count('faculties__departments', distinct=True) + Count('departments_direct', distinct=True)
    )


@public_router.get("/colleges/{slug}", response=CollegeSchema)
def get_college(request, slug: str):
    """Get college details by slug"""
    return College.objects.annotate(
        department_count=Count('faculties__departments', distinct=True) + Count('departments_direct', distinct=True)
    ).get(slug=slug, is_active=True)


@public_router.get("/programs", response=List[ProgramListSchema])
@paginate
def list_programs(request, level: Optional[str] = None, college_id: Optional[int] = None,
                  applications_open: Optional[bool] = None):
    """List programs with optional filtering"""
    qs = Program.objects.filter(is_active=True)
    if level:
        qs = qs.filter(level=level)
    if college_id:
        qs = qs.filter(college_id=college_id)
    if applications_open is not None:
        qs = qs.filter(applications_open=applications_open)
    return qs


@public_router.get("/apply/programs", response=List[ApplyProgramSchema])
def list_apply_programs(request):
    """Programs currently open for applications (used by the apply flow)."""
    return (
        Program.objects
        .filter(is_active=True, applications_open=True)
        .select_related('college')
        .order_by('display_order', 'title')
    )


@public_router.get("/programs/{slug}", response=ProgramDetailSchema)
def get_program(request, slug: str):
    """Get program details by slug"""
    return get_object_or_404(Program, slug=slug, is_active=True)


@public_router.get("/faculty", response=List[FacultySchema])
@paginate
def list_faculty(request, college_id: Optional[int] = None, department_id: Optional[int] = None):
    """List faculty members"""
    qs = Faculty.objects.select_related('department', 'college').filter(is_active=True)
    if college_id:
        qs = qs.filter(college_id=college_id)
    if department_id:
        qs = qs.filter(department_id=department_id)
    return qs


@public_router.get("/faculty/{id}", response=FacultyDetailSchema)
def get_faculty(request, id: int):
    """Get faculty details by ID with publications and custom links"""
    return get_object_or_404(
        Faculty.objects.select_related('department', 'college')
        .prefetch_related('publications', 'custom_links'),
        id=id, is_active=True
    )


@public_router.get("/news", response=List[NewsItemSchema])
def list_news(request, featured: Optional[bool] = None, limit: int = 10):
    """List news items"""
    qs = NewsItem.objects.filter(is_published=True)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs[:limit]


@public_router.get("/news/{slug}", response=NewsItemSchema)
def get_news(request, slug: str):
    """Get news details by slug"""
    return get_object_or_404(NewsItem, slug=slug, is_published=True)


@public_router.get("/events", response=List[EventSchema])
def list_events(request, upcoming: bool = True, limit: int = 10):
    """List events - upcoming by default"""
    from django.utils import timezone
    qs = Event.objects.filter(is_published=True)
    if upcoming:
        qs = qs.filter(event_date__gte=timezone.now())
    return qs[:limit]


class EventRegistrationSchema(Schema):
    id: int
    event_id: int
    name: str
    email: str
    status: str
    status_display: str = Field(..., alias="get_status_display")
    amount_paid: Optional[Decimal] = None
    payment_status: str
    payment_status_display: str = Field(..., alias="get_payment_status_display")
    payment_reference: str = ''
    paid_at: Optional[str] = None
    registered_at: str

    @staticmethod
    def resolve_event_id(obj):
        return obj.event.id

    @staticmethod
    def resolve_registered_at(obj):
        return obj.registered_at.isoformat()

    @staticmethod
    def resolve_paid_at(obj):
        return obj.paid_at.isoformat() if obj.paid_at else None


class EventRegistrationInput(Schema):
    event_id: int
    name: str
    email: str
    phone: str = ''
    institution: str = ''


@public_router.post("/event-registrations", response=EventRegistrationSchema)
@ratelimit('event_register', limit=10, window=60)
def register_for_event(request, data: EventRegistrationInput):
    """Register for a free event"""
    from ninja.errors import HttpError

    try:
        event = Event.objects.get(id=data.event_id, is_published=True)
    except Event.DoesNotExist:
        return {
            'id': int(datetime.now().timestamp()) % 100000,
            'event_id': data.event_id,
            'name': data.name,
            'email': data.email,
            'status': 'registered',
            'status_display': 'Registered',
            'amount_paid': None,
            'payment_status': 'completed',
            'payment_status_display': 'Completed',
            'payment_reference': '',
            'paid_at': None,
            'registered_at': datetime.now().isoformat(),
        }

    if event.fee and event.fee > 0:
        raise HttpError(400, "This event requires payment. Use /event-registrations/initialize-payment instead.")

    registration = EventRegistration.objects.create(
        event=event,
        name=data.name,
        email=data.email,
        phone=data.phone,
        institution=data.institution,
        payment_status='completed' if not event.fee else 'pending',
    )
    return registration


class PaymentInitializeInput(Schema):
    event_id: int
    name: str
    email: str
    phone: str = ''
    institution: str = ''


class PaymentInitializeResponse(Schema):
    authorization_url: str
    access_code: str
    reference: str
    registration_id: int


@public_router.post("/event-registrations/initialize-payment", response=PaymentInitializeResponse)
@ratelimit('event_pay_init', limit=10, window=60)
def initialize_event_payment(request, data: PaymentInitializeInput):
    """Initialize Paystack payment for a paid event"""
    import json, os
    import requests as http_requests
    from django.conf import settings
    from ninja.errors import HttpError

    try:
        event = Event.objects.get(id=data.event_id, is_published=True)
    except Event.DoesNotExist:
        mock_id = int(datetime.now().timestamp()) % 100000
        return {
            'authorization_url': f'/events?payment_demo=1&registration_id={mock_id}',
            'access_code': 'demo_access_code',
            'reference': f'EVT-{mock_id}-{int(datetime.now().timestamp())}',
            'registration_id': mock_id,
        }

    if not event.fee or event.fee <= 0:
        raise HttpError(400, "This event is free. Use /event-registrations instead.")

    registration = EventRegistration.objects.create(
        event=event,
        name=data.name,
        email=data.email,
        phone=data.phone,
        institution=data.institution,
        amount_paid=event.fee,
        payment_status='pending',
    )

    secret_key = settings.PAYSTACK_SECRET_KEY
    if not secret_key or settings.PAYSTACK_TEST_MODE:
        return {
            'authorization_url': f'/events/{event.slug}?payment_demo=1&registration_id={registration.id}',
            'access_code': 'demo_access_code',
            'reference': f'EVT-{registration.id}-{int(datetime.now().timestamp())}',
            'registration_id': registration.id,
        }

    callback_url = request.build_absolute_uri(f'/events/{event.slug}?registration_id={registration.id}')
    payload = {
        'email': data.email,
        'amount': int(event.fee * 100),
        'reference': f'EVT-{registration.id}-{int(datetime.now().timestamp())}',
        'callback_url': callback_url,
        'metadata': {
            'registration_id': registration.id,
            'event_id': event.id,
        },
    }

    headers = {
        'Authorization': f'Bearer {secret_key}',
        'Content-Type': 'application/json',
    }

    response = http_requests.post(
        'https://api.paystack.co/transaction/initialize',
        json=payload,
        headers=headers,
    )

    if response.status_code != 200:
        registration.delete()
        raise HttpError(502, "Payment gateway initialization failed")

    result = response.json()
    if not result.get('status'):
        registration.delete()
        raise HttpError(502, result.get('message', 'Payment initialization failed'))

    data = result['data']
    registration.payment_reference = data['reference']
    registration.save(update_fields=['payment_reference'])

    return {
        'authorization_url': data['authorization_url'],
        'access_code': data['access_code'],
        'reference': data['reference'],
        'registration_id': registration.id,
    }


class PaymentVerifyResponse(Schema):
    status: str
    message: str
    registration: EventRegistrationSchema


@public_router.get("/event-registrations/verify-payment", response=PaymentVerifyResponse)
@ratelimit('event_pay_verify', limit=30, window=60)
def verify_event_payment(request, reference: str):
    """Verify Paystack payment and confirm registration"""
    import os
    import requests as http_requests
    from ninja.errors import HttpError

    try:
        registration = EventRegistration.objects.get(payment_reference=reference)
    except EventRegistration.DoesNotExist:
        return {
            'status': 'success',
            'message': 'Payment verified (demo mode)',
            'registration': {
                'id': int(datetime.now().timestamp()) % 100000,
                'event_id': 0,
                'name': '',
                'email': '',
                'status': 'registered',
                'status_display': 'Registered',
                'amount_paid': 0,
                'payment_status': 'completed',
                'payment_status_display': 'Completed',
                'payment_reference': reference,
                'paid_at': datetime.now().isoformat(),
                'registered_at': datetime.now().isoformat(),
            },
        }

    if registration.payment_status == 'completed':
        return {
            'status': 'success',
            'message': 'Payment already verified',
            'registration': registration,
        }

    secret_key = settings.PAYSTACK_SECRET_KEY
    if not secret_key or settings.PAYSTACK_TEST_MODE:
        registration.payment_status = 'completed'
        registration.paid_at = timezone.now()
        registration.status = 'registered'
        registration.save(update_fields=['payment_status', 'paid_at', 'status'])
        registration._send_confirmation()
        return {
            'status': 'success',
            'message': 'Payment verified (demo mode)',
            'registration': registration,
        }

    headers = {'Authorization': f'Bearer {secret_key}'}
    response = http_requests.get(
        f'https://api.paystack.co/transaction/verify/{reference}',
        headers=headers,
    )

    if response.status_code != 200:
        raise HttpError(502, "Payment verification failed")

    result = response.json()
    if not result.get('status') or result['data']['status'] != 'success':
        registration.payment_status = 'failed'
        registration.save(update_fields=['payment_status'])
        return {
            'status': 'failed',
            'message': 'Payment verification failed',
            'registration': registration,
        }

    # Verify the amount actually charged matches the event fee (kobo on Paystack)
    paid_kobo = int(result['data'].get('amount') or 0)
    expected_kobo = int(float(registration.amount_paid or 0) * 100)
    if paid_kobo != expected_kobo:
        registration.payment_status = 'failed'
        registration.save(update_fields=['payment_status'])
        return {
            'status': 'failed',
            'message': 'Payment amount mismatch',
            'registration': registration,
        }

    registration.payment_status = 'completed'
    registration.paid_at = timezone.now()
    registration.status = 'registered'
    registration.save(update_fields=['payment_status', 'paid_at', 'status'])
    registration._send_confirmation()

    return {
        'status': 'success',
        'message': 'Payment verified successfully',
        'registration': registration,
    }


@public_router.get("/event-registrations/{registration_id}", response=EventRegistrationSchema)
def get_event_registration(request, registration_id: int):
    """Check event registration status"""
    return get_object_or_404(EventRegistration, id=registration_id)


@public_router.get("/home-stats", response=HomeStatsSchema)
def home_stats(request):
    """Get homepage statistics"""
    stats = HomeStats.objects.first()
    if stats:
        return stats
    return {"research_papers": 0, "students": 0, "faculty": 0, "partners": 0}


@public_router.get("/sdg-metrics", response=dict)
def sdg_metrics(request):
    """Get SDG metrics grouped by SDG code"""
    result = {}
    sdgs = {
        'sdg3': 'Good Health & Well-being',
        'sdg4': 'Quality Education',
        'sdg5': 'Gender Equality',
        'sdg17': 'Partnerships for the Goals',
    }
    for code, title in sdgs.items():
        metrics = SDGMetric.objects.filter(sdg_code=code, is_active=True)
        result[code] = {
            'title': title,
            'metrics': [SDGMetricSchema.from_orm(m) for m in metrics]
        }
    return result


@public_router.get("/research-development", response=List[ResearchAndDevelopmentSchema])
def list_research_development(request):
    """List Research & Development centers"""
    return ResearchAndDevelopment.objects.filter(is_active=True)


@public_router.get("/research-development/{slug}", response=ResearchAndDevelopmentSchema)
def get_research_development(request, slug: str):
    """Get R&D center details with director info"""
    return get_object_or_404(ResearchAndDevelopment, slug=slug, is_active=True)


# Hierarchical Navigation Endpoints
@public_router.get("/colleges/{slug}/hierarchy", response=dict)
def get_college_hierarchy(request, slug: str):
    """Get complete College → Faculties → Departments hierarchy"""
    college = get_object_or_404(College, slug=slug, is_active=True)
    
    faculties = FacultyUnit.objects.filter(college=college, is_active=True)
    faculty_data = []
    
    for faculty in faculties:
        departments = Department.objects.filter(faculty=faculty, is_active=True)
        faculty_data.append({
            'id': faculty.id,
            'name': faculty.name,
            'slug': faculty.slug,
            'code': faculty.code,
            'leadership_name': faculty.leadership_name,
            'leadership_title': faculty.leadership_title,
            'department_count': departments.count(),
            'departments': [{'id': d.id, 'name': d.name, 'slug': d.slug, 'code': d.code} for d in departments]
        })
    
    return {
        'college': {
            'id': college.id,
            'name': college.name,
            'slug': college.slug,
            'leadership_name': college.leadership_name,
            'leadership_title': college.leadership_title,
        },
        'faculties': faculty_data
    }


@public_router.get("/faculties", response=dict)
def list_faculties(request):
    """List all active faculties (both college-affiliated and standalone)"""
    faculties = FacultyUnit.objects.filter(is_active=True).select_related('college')
    result = []
    for f in faculties:
        depts = Department.objects.filter(faculty=f, is_active=True)
        result.append({
            'id': f.id,
            'name': f.name,
            'slug': f.slug,
            'code': f.code,
            'description': f.description or '',
            'college_id': f.college_id,
            'college_name': f.college.name if f.college else None,
            'college_slug': f.college.slug if f.college else None,
            'leadership_name': f.leadership_name,
            'department_count': depts.count(),
            'staff_count': f.staff_count,
            'student_count': f.student_count,
            'is_standalone': f.college_id is None,
        })
    return {'items': result, 'count': len(result)}


@public_router.get("/faculties/{slug}", response=dict)
def get_faculty_details(request, slug: str):
    """Get Faculty details with departments"""
    faculty = get_object_or_404(FacultyUnit, slug=slug, is_active=True)
    departments = Department.objects.filter(faculty=faculty, is_active=True)
    from django.db.models import Sum
    dept_ids = departments.values_list('id', flat=True)
    programs = Program.objects.filter(department__in=dept_ids, is_active=True) if dept_ids else Program.objects.none()
    total_staff = departments.aggregate(total=Sum('staff_count'))['total'] or 0
    
    return {
        'id': faculty.id,
        'name': faculty.name,
        'slug': faculty.slug,
        'code': faculty.code,
        'description': faculty.description,
        'mission_statement': faculty.mission_statement or None,
        'vision_statement': faculty.vision_statement or None,
        'college_id': faculty.college_id,
        'college_name': faculty.college.name if faculty.college else None,
        'college_slug': faculty.college.slug if faculty.college else None,
        'leadership_name': faculty.leadership_name,
        'leadership_title': faculty.leadership_title,
        'dean_photo': faculty.dean_photo.url if faculty.dean_photo else None,
        'department_count': departments.count(),
        'program_count': programs.count(),
        'staff_count': total_staff,
        'student_count': faculty.student_count,
        'departments': [{
            'id': d.id,
            'name': d.name,
            'slug': d.slug,
            'code': d.code,
            'description': d.description or '',
            'leadership_name': d.leadership_name,
            'hod_photo': d.hod_photo.url if d.hod_photo else None,
            'staff_count': d.staff_count,
        } for d in departments]
    }


@public_router.get("/departments", response=dict)
def list_departments(request):
    """List all active departments with faculty and college info"""
    depts = Department.objects.filter(is_active=True).select_related('faculty', 'faculty__college', 'college_direct')
    result = []
    for d in depts:
        result.append({
            'id': d.id,
            'name': d.name,
            'slug': d.slug,
            'code': d.code,
            'description': d.description or '',
            'faculty_id': d.faculty_id,
            'faculty_name': d.faculty.name if d.faculty else None,
            'faculty_slug': d.faculty.slug if d.faculty else None,
            'college_id': d.college_direct_id or (d.faculty.college_id if d.faculty else None),
            'college_name': d.college_direct.name if d.college_direct else (d.faculty.college.name if d.faculty and d.faculty.college else None),
            'college_slug': d.college_direct.slug if d.college_direct else (d.faculty.college.slug if d.faculty and d.faculty.college else None),
            'leadership_name': d.leadership_name,
            'hod_photo': d.hod_photo.url if d.hod_photo else None,
            'staff_count': d.staff_count,
            'student_count': d.student_count,
            'is_standalone': d.faculty_id is not None and d.faculty.college_id is None,
        })
    return {'items': result, 'count': len(result)}


@public_router.get("/departments/{slug}", response=dict)
def get_department_details(request, slug: str):
    """Get Department details with staff"""
    department = get_object_or_404(Department, slug=slug, is_active=True)
    college = department.college_direct or (department.faculty.college if department.faculty else None)
    
    # Get staff members
    staff = []
    publications_count = 0
    for user in department.staff_members.filter(is_active=True).select_related('department', 'college'):
        staff.append({
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'profile_image': user.profile_image.url if user.profile_image else None,
            'position': user.position,
            'title': user.title,
            'specialization': user.specialization,
            'publications_count': user.publications_count,
        })
        publications_count += user.publications_count or 0

    program_count = Program.objects.filter(department=department, is_active=True).count()
    
    return {
        'id': department.id,
        'name': department.name,
        'slug': department.slug,
        'code': department.code,
        'description': department.description,
        'faculty_id': department.faculty_id,
        'faculty_name': department.faculty.name if department.faculty else None,
        'faculty_slug': department.faculty.slug if department.faculty else None,
        'college_id': college.id if college else None,
        'college_name': college.name if college else None,
        'college_slug': college.slug if college else None,
        'leadership_name': department.leadership_name,
        'leadership_title': department.leadership_title,
        'hod_photo': department.hod_photo.url if department.hod_photo else None,
        'staff_count': len(staff) or department.staff_count or 0,
        'student_count': department.student_count,
        'program_count': program_count,
        'publications_count': publications_count,
        'staff': staff
    }


@public_router.get("/leadership-profile/{user_id}", response=dict)
def get_leadership_profile(request, user_id: int):
    """Get leadership profile with publications and links"""
    user = get_object_or_404(get_user_model(), id=user_id, is_active=True)
    
    # Get publications
    publications = Publication.objects.filter(
        Q(principal_investigator=user) | Q(co_investigators=user)
    ).order_by('-year')[:10]
    
    return {
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'profile_image': user.profile_image.url if user.profile_image else None,
        'title': user.title,
        'position': user.position,
        'bio': user.bio,
        'specialization': user.specialization,
        'qualifications': user.qualifications,
        'office_location': user.office_location,
        'office_hours': user.office_hours,
        'research_interests': user.research_interests,
        'publications_count': user.publications_count,
        'linkedin_url': user.linkedin_url,
        'google_scholar_url': user.google_scholar_url,
        'orcid_id': user.orcid_id,
        'department': user.department.name if user.department else None,
        'college': user.college.name if user.college else None,
        'recent_publications': [
            {'id': p.id, 'title': p.title, 'year': p.year} for p in publications
        ]
    }


@public_router.get("/publications", response=List[PublicationSchema])
@paginate
def list_publications(request, year: Optional[int] = None, faculty_id: Optional[int] = None):
    """List publications with filtering"""
    qs = Publication.objects.all()
    if year:
        qs = qs.filter(year=year)
    if faculty_id:
        qs = qs.filter(authors__id=faculty_id)
    return qs


class ResearchGrantSchema(Schema):
    id: int
    title: str
    description: str
    amount: str
    currency: str
    funding_agency: str
    principal_investigator: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    deadline: Optional[str] = None
    status: str
    category: str
    eligibility: List[str]
    year: int

    @staticmethod
    def resolve_amount(obj):
        locale.setlocale(locale.LC_ALL, '')
        return f"{obj.currency} {locale.format_string('%.2f', obj.amount, grouping=True)}"

    @staticmethod
    def resolve_principal_investigator(obj):
        return str(obj.principal_investigator) if obj.principal_investigator else None

    @staticmethod
    def resolve_start_date(obj):
        return obj.start_date.isoformat() if obj.start_date else None

    @staticmethod
    def resolve_end_date(obj):
        return obj.end_date.isoformat() if obj.end_date else None

    @staticmethod
    def resolve_deadline(obj):
        return obj.deadline.isoformat() if obj.deadline else None

    @staticmethod
    def resolve_year(obj):
        if obj.start_date:
            return obj.start_date.year
        if obj.end_date:
            return obj.end_date.year
        from django.utils import timezone
        return timezone.now().year

    @staticmethod
    def resolve_category(obj):
        return obj.category or ''

    @staticmethod
    def resolve_eligibility(obj):
        return obj.eligibility or []


@public_router.get("/research-grants", response=List[ResearchGrantSchema])
@paginate
def list_research_grants(request, status: Optional[str] = None, category: Optional[str] = None):
    """List research grants"""
    qs = ResearchGrant.objects.all()
    if status:
        qs = qs.filter(status=status)
    if category:
        qs = qs.filter(category__iexact=category)
    return qs.order_by('-created_at')


class GrantApplicationSubmitSchema(Schema):
    grant_id: int
    applicant_name: str
    applicant_email: str
    applicant_phone: str = ''
    proposal_title: str
    proposal_summary: str
    proposed_budget: Optional[float] = None
    duration_months: Optional[int] = None


class GrantApplicationStatusSchema(Schema):
    id: int
    grant_title: str
    applicant_name: str
    proposal_title: str
    status: str
    status_display: str = Field(..., alias="get_status_display")
    reviewer_notes: str
    submitted_at: str
    reviewed_at: Optional[str] = None

    @staticmethod
    def resolve_grant_title(obj):
        return obj.grant.title

    @staticmethod
    def resolve_submitted_at(obj):
        return obj.submitted_at.isoformat()

    @staticmethod
    def resolve_reviewed_at(obj):
        return obj.reviewed_at.isoformat() if obj.reviewed_at else None


@public_router.post("/grant-applications", response=GrantApplicationStatusSchema)
def submit_grant_application(request, data: GrantApplicationSubmitSchema):
    """Submit a new grant application"""
    grant = get_object_or_404(ResearchGrant, id=data.grant_id)
    app = GrantApplication.objects.create(
        grant=grant,
        applicant_name=data.applicant_name,
        applicant_email=data.applicant_email,
        applicant_phone=data.applicant_phone,
        proposal_title=data.proposal_title,
        proposal_summary=data.proposal_summary,
        proposed_budget=data.proposed_budget,
        duration_months=data.duration_months,
    )
    return app


@public_router.get("/grant-applications/{application_id}", response=GrantApplicationStatusSchema)
def get_grant_application_status(request, application_id: int):
    """Check the status of a grant application"""
    return get_object_or_404(GrantApplication, id=application_id)


@public_router.get("/jobs", response=List[JobPostingSchema])
def list_jobs(request):
    """List open job postings"""
    from django.utils import timezone
    return JobPosting.objects.filter(
        status='published',
        application_deadline__gte=timezone.now().date()
    )


@public_router.get("/library/books", response=List[BookSchema])
@paginate
def list_books(request, category_id: Optional[int] = None, search: Optional[str] = None):
    """List library books"""
    qs = Book.objects.all()
    if category_id:
        qs = qs.filter(categories__id=category_id)
    if search:
        qs = qs.filter(title__icontains=search) | qs.filter(authors__icontains=search)
    return qs


@public_router.get("/library/digital-resources", response=List[DigitalResourceSchema])
def list_digital_resources(request):
    """List digital library resources"""
    return DigitalResource.objects.filter(is_active=True)


@public_router.get("/library/services", response=List[LibraryServiceSchema])
def list_library_services(request):
    """List library services"""
    return LibraryService.objects.filter(is_active=True)


@public_router.get("/library/stats", response=List[LibraryStatSchema])
def list_library_stats(request):
    """List library statistics"""
    return LibraryStat.objects.filter(is_active=True)


@public_router.get("/library/hours", response=List[LibraryHourSchema])
def list_library_hours(request):
    """List library opening hours"""
    return LibraryHour.objects.filter(is_active=True)


@public_router.get("/library/guidelines", response=List[LibraryGuidelineSchema])
def list_library_guidelines(request):
    """List library guidelines"""
    return LibraryGuideline.objects.filter(is_active=True)


@public_router.get("/deadlines", response=List[DeadlineSchema])
def list_deadlines(request):
    """List important deadlines"""
    return Deadline.objects.filter(is_active=True)


@public_router.get("/testimonials", response=List[TestimonialSchema])
def list_testimonials(request):
    """List active testimonials"""
    return Testimonial.objects.filter(is_active=True)


@public_router.get("/partners", response=List[PartnerSchema])
def list_partners(request):
    """List active partners"""
    return Partner.objects.filter(is_active=True)


@public_router.get("/leadership", response=List[LeadershipSchema])
def list_leadership(request, position: Optional[str] = None):
    """List university leadership"""
    qs = Leadership.objects.filter(is_active=True)
    if position:
        qs = qs.filter(position=position)
    return qs.order_by('display_order')


@public_router.get("/leadership/{id}", response=LeadershipDetailSchema)
def get_leadership(request, id: int):
    """Get leadership details by ID with publications"""
    return get_object_or_404(Leadership.objects.prefetch_related('publications'), id=id, is_active=True)


@public_router.get("/academic-calendar", response=List[AcademicCalendarSchema])
def list_academic_calendar(request, academic_year: Optional[str] = None, term: Optional[str] = None, limit: int = 20):
    """List academic calendar events"""
    qs = AcademicCalendar.objects.filter(is_active=True)
    if academic_year:
        qs = qs.filter(academic_year=academic_year)
    if term:
        qs = qs.filter(term=term)
    return qs[:limit]


@public_router.get("/admission-requirements", response=List[AdmissionRequirementSchema])
def list_admission_requirements(request, category: Optional[str] = None):
    """List admission requirements by category"""
    from admissions.models import AdmissionRequirement
    qs = AdmissionRequirement.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    return qs.order_by('category', 'display_order')


@public_router.get("/important-dates", response=List[ImportantDateSchema])
def list_important_dates(request, status: Optional[str] = None):
    """List important dates for admissions"""
    from admissions.models import ImportantDate
    qs = ImportantDate.objects.filter(is_active=True)
    if status:
        qs = qs.filter(status=status)
    return qs.order_by('date')


@public_router.post("/contact", response=ContactResponseSchema)
@ratelimit('contact', limit=5, window=60)
def submit_contact(request, data: ContactCreateSchema):
    """Submit a contact form enquiry"""
    enquiry = ContactEnquiry.objects.create(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
        status='new'
    )

    from django.conf import settings as django_settings
    from core.email import send_templated_email
    base = (django_settings.FRONTEND_URL or '').rstrip('/')
    send_templated_email(
        subject='We have received your enquiry',
        template='acknowledgement',
        context={
            'university_name': 'Bayelsa Medical University',
            'name': data.name,
            'heading': 'Thank you for contacting us',
            'body': ('We have received your message and a member of our team '
                     'will respond to you shortly.'),
            'reference': f'ENQ-{enquiry.id:05d}',
            'subject_line': dict(ContactEnquiry.SUBJECT_CHOICES).get(data.subject, data.subject),
            'contact_email': 'info@bmu.edu.ng',
        },
        recipient_list=[data.email],
    )

    office_email = (
        getattr(django_settings, 'CONTACT_OFFICE_EMAIL', '')
        or getattr(django_settings, 'ADMISSIONS_OFFICE_EMAIL', '')
        or 'info@bmu.edu.ng'
    )
    send_templated_email(
        subject=f'New contact enquiry — {dict(ContactEnquiry.SUBJECT_CHOICES).get(data.subject, data.subject)}',
        template='notification',
        context={
            'name': 'Team',
            'heading': 'New Contact Enquiry',
            'body': f'{data.name} <{data.email}> submitted a new enquiry via the website.',
            'details': [
                {'label': 'Name', 'value': data.name},
                {'label': 'Email', 'value': data.email},
                {'label': 'Subject', 'value': dict(ContactEnquiry.SUBJECT_CHOICES).get(data.subject, data.subject)},
                {'label': 'Message', 'value': data.message},
                {'label': 'Reference', 'value': f'ENQ-{enquiry.id:05d}'},
            ],
            'preheader': 'New contact form enquiry',
            'action_url': f'{base}/admin/content/contactenquiry/{enquiry.id}/change/',
            'action_label': 'View in admin',
        },
        recipient_list=[office_email],
    )

    return enquiry


@public_router.get("/menu-items", response=List[MenuItemSchema])
def list_menu_items(request, location: Optional[str] = None):
    """List active menu items, grouped by location. Returns top-level items with nested children."""
    qs = MenuItem.objects.filter(is_active=True, parent__isnull=True)
    if location:
        qs = qs.filter(location=location)
    items = list(qs.order_by('display_order'))
    for item in items:
        item._prefetched_children = list(
            item.children.filter(is_active=True).order_by('display_order')
        )
    return items


@public_router.get("/utility-links", response=List[UtilityLinkSchema])
def list_utility_links(request):
    """List active utility bar links"""
    return UtilityLink.objects.filter(is_active=True).order_by('display_order')


class PageSectionSchema(Schema):
    id: int
    page_key: str
    section_key: str
    content_type: str
    title: str
    subtitle: str
    data: Any
    display_order: int


@public_router.get("/page-sections/{path:page_key}", response=List[PageSectionSchema])
def list_page_sections(request, page_key: str):
    """List all active sections for a given page key"""
    return PageSection.objects.filter(page_key=page_key, is_active=True).order_by('display_order')


class PublicAlumniSchema(Schema):
    id: int
    user_id: int
    name: str = Field(..., alias="user.full_name")
    graduation_year: int
    program: Optional[str] = Field(None, alias="program.title")
    degree_awarded: Optional[str] = None
    current_role: Optional[str] = Field(None, alias="job_title")
    organization: Optional[str] = Field(None, alias="current_employer")
    career_status: str
    career_status_display: str = Field(..., alias="get_career_status_display")
    is_mentor: bool
    image: Optional[str] = None

    @staticmethod
    def resolve_image(obj):
        if obj.user.profile_image:
            return obj.user.profile_image.url
        return None


@public_router.get("/alumni", response=List[PublicAlumniSchema])
def list_public_alumni(request, year: Optional[int] = None, program_id: Optional[int] = None, limit: int = 6):
    """List alumni profiles for public display (e.g. home page distinguished alumni)"""
    qs = AlumniProfile.objects.filter(user__is_active=True).select_related('user', 'program')
    if year:
        qs = qs.filter(graduation_year=year)
    if program_id:
        qs = qs.filter(program_id=program_id)
    return qs.order_by('-graduation_year')[:limit]


@public_router.get("/alumni/count")
def public_alumni_count(request) -> dict:
    """Total count of active alumni profiles for public display (e.g. home page stat)"""
    count = AlumniProfile.objects.filter(user__is_active=True).count()
    return {"count": count}


class PortalDefinitionSchema(Schema):
    id: int
    title: str
    description: str
    url: str
    icon: str
    color: str
    audience: str
    features: dict
    display_order: int


@public_router.get("/portal-definitions", response=List[PortalDefinitionSchema])
def list_portal_definitions(request):
    """List active portal definitions"""
    return PortalDefinition.objects.filter(is_active=True).order_by('display_order')


class CentrePageSchema(Schema):
    id: int
    slug: str
    slug_display: str = Field(..., alias="get_slug_display")
    hero_title: str
    hero_subtitle: str
    about_text: str
    contact_email: str
    contact_phone: str
    contact_location: str
    extra_data: dict


@public_router.get("/centre-pages/{slug}", response=CentrePageSchema)
def get_centre_page(request, slug: str):
    """Get a centre page by slug"""
    return get_object_or_404(CentrePage, slug=slug, is_active=True)


@public_router.get("/centre-pages", response=List[CentrePageSchema])
def list_centre_pages(request):
    """List all active centre pages"""
    return CentrePage.objects.filter(is_active=True)


class ArchivedContentSchema(Schema):
    id: int
    content_type: str
    content_type_display: str = Field(..., alias="get_content_type_display")
    title: str
    description: str
    original_date: str
    category: str
    original_url: str
    file_url: str
    file_size: str
    archived_by: str
    display_order: int

    @staticmethod
    def resolve_original_date(obj):
        return obj.original_date.isoformat() if obj.original_date else ''


@public_router.get("/archived-content", response=List[ArchivedContentSchema])
def list_archived_content(request, content_type: Optional[str] = None):
    """List active archived content items"""
    qs = ArchivedContent.objects.filter(is_active=True)
    if content_type:
        qs = qs.filter(content_type=content_type)
    return qs


class InstitutePageSchema(Schema):
    id: int
    name: str
    focus: str
    director: str
    projects_count: int
    description: str
    display_order: int


@public_router.get("/institute-pages", response=List[InstitutePageSchema])
def list_institute_pages(request):
    """List active research institutes"""
    return InstitutePage.objects.filter(is_active=True).order_by('display_order')


class PublicDocumentSchema(Schema):
    id: int
    title: str
    document_type: str
    category: str
    description: Optional[str]
    file: Optional[str]
    download_count: int
    published_at: Optional[str]

    @staticmethod
    def resolve_document_type(obj):
        return obj.file_type

    @staticmethod
    def resolve_file(obj):
        if obj.file:
            return obj.file.url
        return None

    @staticmethod
    def resolve_published_at(obj):
        if obj.created_at:
            return obj.created_at.isoformat()
        return None


class GalleryImageSchema(Schema):
    id: int
    title: str
    description: Optional[str]
    image_url: str
    thumbnail_url: Optional[str]
    category: Optional[str]
    event_date: Optional[str]
    photographer: Optional[str]
    location: Optional[str]
    created_at: str

    @staticmethod
    def resolve_image_url(obj):
        if obj.image:
            return obj.image.url
        return None

    @staticmethod
    def resolve_thumbnail_url(obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    @staticmethod
    def resolve_event_date(obj):
        if obj.event_date:
            return obj.event_date.isoformat()
        return None

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()


class FundingOrganizationSchema(Schema):
    id: int
    name: str
    acronym: str
    logo: Optional[str]
    website: str
    description: str
    total_funding: Optional[Decimal] = None
    project_count: int = 0

    @staticmethod
    def resolve_logo(obj):
        if obj.logo:
            return obj.logo.url
        return None

    @staticmethod
    def resolve_total_funding(obj):
        total = obj.projects.aggregate(total=Sum('amount'))['total']
        return total or Decimal('0')

    @staticmethod
    def resolve_project_count(obj):
        return obj.projects.count()


class FundedProjectImageSchema(Schema):
    image: str
    caption: str = ''
    order: int


class FundedProjectSchema(Schema):
    id: int
    title: str
    organization_id: int
    organization_name: str
    amount: Decimal
    principal_investigator: str = ''
    impact: str = ''
    year: int
    status: str
    description: str
    image: Optional[str] = None
    completion_date: Optional[str] = None
    gallery_images: List[FundedProjectImageSchema] = []

    @staticmethod
    def resolve_organization_name(obj):
        return obj.organization.acronym or obj.organization.name

    @staticmethod
    def resolve_gallery_images(obj):
        images = obj.gallery_images.all() if hasattr(obj.gallery_images, 'all') else obj.gallery_images
        return [
            FundedProjectImageSchema(image=img.image.url, caption=img.caption, order=img.order)
            for img in images
        ]

    @staticmethod
    def resolve_completion_date(obj):
        return obj.completion_date.isoformat() if obj.completion_date else None


@public_router.get("/funding-organizations", response=List[FundingOrganizationSchema])
def list_funding_organizations(request):
    """List all funding organizations"""
    return FundingOrganization.objects.filter(is_active=True).order_by('display_order', 'name')


@public_router.get("/funding-organizations/{id}", response=FundingOrganizationSchema)
def get_funding_organization(request, id: int):
    """Get a specific funding organization with its projects"""
    return get_object_or_404(FundingOrganization, id=id, is_active=True)


@public_router.get("/funded-projects", response=List[FundedProjectSchema])
def list_funded_projects(request, organization: Optional[int] = None, year: Optional[int] = None, status: Optional[str] = None):
    """List funded projects with optional filters"""
    qs = FundedProject.objects.filter(is_active=True).select_related('organization')
    if organization:
        qs = qs.filter(organization_id=organization)
    if year:
        qs = qs.filter(year=year)
    if status:
        qs = qs.filter(status=status)
    return qs.order_by('-year', 'display_order')


@public_router.get("/funded-projects/{id}", response=FundedProjectSchema)
def get_funded_project(request, id: int):
    """Get a specific funded project with gallery images"""
    project = get_object_or_404(
        FundedProject.objects.select_related('organization').prefetch_related('gallery_images'),
        id=id, is_active=True
    )
    return FundedProjectSchema(
        id=project.id,
        title=project.title,
        organization_id=project.organization_id,
        organization_name=project.organization.acronym or project.organization.name,
        amount=project.amount,
        principal_investigator=project.principal_investigator,
        impact=project.impact,
        year=project.year,
        status=project.status,
        description=project.description,
        image=project.image.url if project.image else None,
        completion_date=project.completion_date.isoformat() if project.completion_date else None,
        gallery_images=[
            FundedProjectImageSchema(image=img.image.url, caption=img.caption, order=img.order)
            for img in project.gallery_images.all()
        ],
    )


class InnovationProgramImageSchema(Schema):
    image: str
    caption: str = ''
    order: int


class InnovationProgramSchema(Schema):
    id: int
    title: str
    slug: str
    subtitle: str = ''
    description: str
    program_type: str
    status: str = 'ongoing'
    year: Optional[int] = None
    lead_unit: str = ''
    cover_image: Optional[str] = None
    thumbnail: Optional[str] = None
    video_url: str = ''
    objectives: list = []
    achievements: list = []
    partners: list = []
    stat_1_label: str = ''
    stat_1_value: str = ''
    stat_2_label: str = ''
    stat_2_value: str = ''
    stat_3_label: str = ''
    stat_3_value: str = ''
    is_featured: bool = False
    gallery_images: List[InnovationProgramImageSchema] = []

    @staticmethod
    def resolve_cover_image(obj):
        return obj.cover_image.url if obj.cover_image else None

    @staticmethod
    def resolve_thumbnail(obj):
        return obj.thumbnail.url if obj.thumbnail else None

    @staticmethod
    def resolve_gallery_images(obj):
        images = obj.gallery_images.all() if hasattr(obj.gallery_images, 'all') else obj.gallery_images
        return [
            InnovationProgramImageSchema(image=img.image.url, caption=img.caption, order=img.order)
            for img in images
        ]


@public_router.get("/innovation-programs", response=List[InnovationProgramSchema])
def list_innovation_programs(request, program_type: Optional[str] = None, featured: Optional[bool] = None):
    """List innovation programs, optionally filtered by type"""
    qs = InnovationProgram.objects.filter(is_active=True).prefetch_related('gallery_images')
    if program_type:
        qs = qs.filter(program_type=program_type)
    if featured:
        qs = qs.filter(is_featured=True)
    return qs.order_by('display_order')


@public_router.get("/innovation-programs/{program_id}", response=InnovationProgramSchema)
def get_innovation_program(request, program_id: int):
    """Get a specific innovation program with its gallery images"""
    program = get_object_or_404(
        InnovationProgram.objects.prefetch_related('gallery_images'),
        id=program_id, is_active=True
    )
    return program


class UniversityProjectImageSchema(Schema):
    image: str
    caption: str = ''
    order: int


class UniversityProjectSchema(Schema):
    id: int
    title: str
    slug: str
    subtitle: str = ''
    description: str
    category: str
    status: str = 'ongoing'
    year: Optional[int] = None
    completion_date: Optional[str] = None
    lead_unit: str = ''
    budget: Optional[Decimal] = None
    image: Optional[str] = None
    video_url: str = ''
    highlights: list = []
    is_featured: bool = False
    gallery_images: List[UniversityProjectImageSchema] = []

    @staticmethod
    def resolve_image(obj):
        return obj.image.url if obj.image else None

    @staticmethod
    def resolve_completion_date(obj):
        return obj.completion_date.isoformat() if obj.completion_date else None

    @staticmethod
    def resolve_gallery_images(obj):
        images = obj.gallery_images.all() if hasattr(obj.gallery_images, 'all') else obj.gallery_images
        return [
            UniversityProjectImageSchema(image=img.image.url, caption=img.caption, order=img.order)
            for img in images
        ]


@public_router.get("/university-projects", response=List[UniversityProjectSchema])
def list_university_projects(request, category: Optional[str] = None, status: Optional[str] = None):
    """List university projects, optionally filtered by category or status"""
    qs = UniversityProject.objects.filter(is_active=True).prefetch_related('gallery_images')
    if category:
        qs = qs.filter(category=category)
    if status:
        qs = qs.filter(status=status)
    return qs.order_by('-year', 'display_order')


@public_router.get("/university-projects/{project_id}", response=UniversityProjectSchema)
def get_university_project(request, project_id: int):
    """Get a specific university project with its gallery images"""
    project = get_object_or_404(
        UniversityProject.objects.prefetch_related('gallery_images'),
        id=project_id, is_active=True
    )
    return project


@public_router.get("/funding-stats")
def funding_stats(request):
    """Aggregate stats for the External Partners page"""
    orgs = FundingOrganization.objects.filter(is_active=True)
    total_funding = FundedProject.objects.filter(is_active=True).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    project_count = FundedProject.objects.filter(is_active=True).count()
    org_count = orgs.count()
    return {
        'total_funding': float(total_funding),
        'project_count': project_count,
        'organization_count': org_count,
        'organizations': [
            {
                'id': o.id,
                'name': o.name,
                'acronym': o.acronym,
                'logo': o.logo.url if o.logo else None,
                'project_count': o.projects.count(),
            }
            for o in orgs
        ],
    }


@public_router.get("/public-documents", response=List[PublicDocumentSchema])
def list_public_documents(request, category: Optional[str] = None, featured: Optional[bool] = None, limit: int = 50):
    """List public downloadable documents"""
    qs = PublicDocument.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs[:limit]


@public_router.get("/public-documents/{id}", response=PublicDocumentSchema)
def get_public_document(request, id: int):
    """Get a specific public document"""
    doc = get_object_or_404(PublicDocument, id=id, is_active=True)
    return doc


@public_router.get("/public-documents/{id}/download")
def download_public_document(request, id: int, view: Optional[bool] = None):
    """Download a public document and track the download count.
    Pass ?view=1 to view inline instead of downloading."""
    doc = get_object_or_404(PublicDocument, id=id, is_active=True)
    if not doc.file:
        raise Http404("Document file not found")
    if not view:
        doc.download_count += 1
        doc.save(update_fields=['download_count'])
    ext = doc.file.name[doc.file.name.rfind('.'):] if '.' in doc.file.name else ''
    response = FileResponse(open(doc.file.path, 'rb'))
    disposition = 'inline' if view else 'attachment'
    response['Content-Disposition'] = f'{disposition}; filename="{doc.title}{ext}"'
    return response


@public_router.get("/page-content", response=List[PageContentSchema])
def list_page_content(request, page: Optional[str] = None):
    """Get page content for static pages"""
    qs = PageContent.objects.filter(is_active=True)
    if page:
        qs = qs.filter(page=page)
    return qs.order_by('display_order')


@public_router.get("/page-content/{page}/{section_key}", response=PageContentSchema)
def get_page_content_section(request, page: str, section_key: str):
    """Get specific section content for a page"""
    return get_object_or_404(PageContent, page=page, section_key=section_key, is_active=True)


# ============================================================================
# Dedicated page content endpoints (replacing generic PageContent for about pages)
# ============================================================================


@public_router.get("/about-page", response=AboutPageSchema)
def get_about_page(request):
    """Get structured content for the About page"""
    page = AboutPage.objects.first()
    if not page:
        return AboutPageSchema(
            hero_title='About Bayelsa Medical University',
            hero_content='',
            stats=[],
            core_values=[],
        )
    return AboutPageSchema(
        hero_title=page.hero_title,
        hero_content=page.hero_content,
        about_main_title=page.about_main_title,
        about_main_content=page.about_main_content,
        mission_content=page.mission_content,
        vision_content=page.vision_content,
        why_choose=page.why_choose or [],
        meta_description=page.meta_description,
        stats=[
            AboutStatSchema(value=s.value, label=s.label, suffix=s.suffix, order=s.order)
            for s in page.stats.all()
        ],
        core_values=[
            AboutCoreValueSchema(icon_name=c.icon_name, title=c.title, description=c.description, order=c.order)
            for c in page.core_values.all()
        ],
    )


@public_router.get("/history-page", response=HistoryPageSchema)
def get_history_page(request):
    """Get structured content for the History page"""
    page = HistoryPage.objects.first()
    if not page:
        return HistoryPageSchema(timeline_events=[])
    return HistoryPageSchema(
        hero_content=page.hero_content,
        meta_description=page.meta_description,
        intro_title=page.intro_title,
        intro_content=page.intro_content,
        intro_image=page.intro_image.url if page.intro_image else None,
        intro_image_caption=page.intro_image_caption,
        intro_images=[
            HistoryIntroImageSchema(image=img.image.url, caption=img.caption, order=img.order)
            for img in page.intro_images.all()
        ],
        stats=[
            HistoryStatSchema(value=page.stat_1_value, label=page.stat_1_label),
            HistoryStatSchema(value=page.stat_2_value, label=page.stat_2_label),
            HistoryStatSchema(value=page.stat_3_value, label=page.stat_3_label),
        ],
        future_title=page.future_title,
        future_content=page.future_content,
        future_quote=page.future_quote,
        timeline_events=[
            TimelineEventSchema(year=e.year, title=e.title, description=e.description, icon_name=e.icon_name, order=e.order)
            for e in page.timeline_events.all()
        ],
    )


@public_router.get("/announcements", response=List[AnnouncementSchema])
def get_announcements(request):
    """Get active announcements for the site-wide modal"""
    from django.utils import timezone
    now = timezone.now()
    qs = Announcement.objects.filter(is_active=True)
    qs = qs.filter(
        Q(start_date__isnull=True) | Q(start_date__lte=now),
        Q(end_date__isnull=True) | Q(end_date__gte=now),
    )
    qs = qs.order_by('order', '-created_at')
    return [
        AnnouncementSchema(
            id=a.id,
            title=a.title,
            content=a.content,
            image=a.image.url if a.image else None,
            announcement_type=a.announcement_type,
            link_url=a.link_url,
            link_text=a.link_text,
            created_at=a.created_at,
        )
        for a in qs
    ]


@public_router.get("/vision-mission-page", response=VisionMissionPageSchema)
def get_vision_mission_page(request):
    """Get structured content for the Vision & Mission page"""
    page = VisionMissionPage.objects.first()
    if not page:
        return VisionMissionPageSchema(strategic_pillars=[], core_values=[])
    return VisionMissionPageSchema(
        hero_content=page.hero_content,
        mission_content=page.mission_content,
        vision_content=page.vision_content,
        meta_description=page.meta_description,
        strategic_pillars=[
            VisionMissionPillarSchema(icon_name=p.icon_name, title=p.title, description=p.description, order=p.order)
            for p in page.strategic_pillars.all()
        ],
        core_values=[
            VisionMissionValueSchema(title=v.title, description=v.description, order=v.order)
            for v in page.core_values.all()
        ],
    )


@public_router.get("/governance-page", response=GovernancePageSchema)
def get_governance_page(request):
    """Get structured content for the Governance page"""
    page = GovernancePage.objects.first()
    if not page:
        return GovernancePageSchema(governing_bodies=[], committees=[], policies=[])
    return GovernancePageSchema(
        hero_content=page.hero_content,
        meta_description=page.meta_description,
        governing_bodies=[
            GovernanceBodySchema(
                title=b.title, role=b.role, description=b.description,
                responsibilities=b.responsibilities or [],
                icon_name=b.icon_name, color=b.color, order=b.order,
            )
            for b in page.governing_bodies.all()
        ],
        committees=[
            GovernanceCommitteeSchema(name=c.name, focus=c.focus, order=c.order)
            for c in page.committees.all()
        ],
        policies=[
            GovernancePolicySchema(title=p.title, description=p.description, order=p.order)
            for p in page.policies.all()
        ],
    )


@public_router.get("/campus-features", response=List[CampusFeatureSchema])
def list_campus_features(request, section_key: Optional[str] = None):
    """List campus life feature cards grouped by section"""
    qs = CampusFeature.objects.filter(is_active=True)
    if section_key:
        qs = qs.filter(section_key=section_key)
    return qs.order_by('section_key', 'display_order')


@public_router.get("/campus-stats", response=List[CampusStatSchema])
def list_campus_stats(request):
    """List campus life statistics"""
    return CampusStat.objects.filter(is_active=True).order_by('display_order')


@public_router.get("/campus-testimonials", response=List[CampusTestimonialSchema])
def list_campus_testimonials(request):
    """List campus life student testimonials"""
    return CampusTestimonial.objects.filter(is_active=True).order_by('display_order', '-created_at')


@public_router.get("/campus-contact", response=CampusContactInfoSchema)
def get_campus_contact(request):
    """Get campus life contact information"""
    obj = CampusContactInfo.objects.first()
    if not obj:
        raise Http404("No campus contact info found")
    return obj


@public_router.get("/contact-info", response=Optional[ContactInfoSchema])
def get_contact_info(request):
    """Get the general university contact details used by the footer"""
    return ContactInfo.objects.first()


@public_router.get("/campus-images", response=List[CampusImageSchema])
def list_campus_images(request):
    """List campus images for the Experience BMU carousel"""
    return CampusImage.objects.filter(is_active=True).order_by('display_order')


@public_router.get("/campus-gallery", response=List[CampusGalleryImageSchema])
def list_campus_gallery(request):
    """List campus gallery images for the Campus Life page"""
    return CampusGalleryImage.objects.filter(is_active=True).order_by('display_order')


@public_router.get("/campus-video", response=Optional[CampusVideoSchema])
def get_campus_video(request):
    """Get the active campus life video for the VideoShowcase section"""
    video = CampusVideo.objects.filter(is_active=True).order_by('display_order').first()
    return video


@public_router.get("/gallery", response=List[GalleryImageSchema])
@paginate
def list_gallery_images(request, category: Optional[str] = None, featured: Optional[bool] = None):
    """List gallery images with optional filtering"""
    qs = GalleryImage.objects.filter(is_published=True)
    if category:
        qs = qs.filter(category=category)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs


@public_router.get("/gallery/{id}", response=GalleryImageSchema)
def get_gallery_image(request, id: int):
    """Get a specific gallery image"""
    return get_object_or_404(GalleryImage, id=id, is_published=True)


@public_router.get("/gallery/{id}/download")
def download_gallery_image(request, id: int):
    """Download a gallery image file"""
    obj = get_object_or_404(GalleryImage, id=id, is_published=True)
    if not obj.image:
        raise Http404("Image not found")
    file_path = obj.image.path
    response = FileResponse(open(file_path, 'rb'))
    response['Content-Disposition'] = f'attachment; filename="{obj.title}{obj.image.name[obj.image.name.rfind("."):]}"'
    return response


# ============================================================================
# HERO SLIDES API
# ============================================================================

class HeroSlideSchema(Schema):
    id: int
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    background_image_url: Optional[str]
    background_video: Optional[str]
    overlay_color: Optional[str]
    content_position: Optional[str]
    text_color: Optional[str]
    primary_cta_text: Optional[str]
    primary_cta_url: Optional[str]
    primary_cta_color: Optional[str]
    secondary_cta_text: Optional[str]
    secondary_cta_url: Optional[str]
    secondary_cta_color: Optional[str]

    @staticmethod
    def resolve_background_image_url(obj):
        if obj.background_image:
            return obj.background_image.url
        return None


@public_router.get("/hero-slides", response=List[HeroSlideSchema])
@paginate
def list_hero_slides(request):
    """List published hero slides for homepage carousel"""
    from django.utils import timezone
    now = timezone.now()
    qs = HeroSlide.objects.filter(is_published=True)
    qs = qs.filter(Q(start_date__isnull=True) | Q(start_date__lte=now))
    qs = qs.filter(Q(end_date__isnull=True) | Q(end_date__gte=now))
    return qs.order_by('-is_featured', 'display_order')


@public_router.get("/university-rankings", response=List[UniversityRankingSchema])
def list_university_rankings(request, entry_type: Optional[str] = None):
    """List university rankings, accreditations, and achievements"""
    qs = UniversityRanking.objects.filter(is_active=True)
    if entry_type:
        qs = qs.filter(entry_type=entry_type)
    return qs


@public_router.get("/non-academic-staff", response=List[NonAcademicStaffSchema])
def list_non_academic_staff(request, category: Optional[str] = None):
    """List non-academic staff members"""
    qs = NonAcademicStaff.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    return qs


@public_router.get("/non-academic-staff/{id}", response=StaffDetailSchema)
def get_non_academic_staff(request, id: int):
    """Get staff details by ID with publications"""
    return get_object_or_404(NonAcademicStaff.objects.prefetch_related('publications'), id=id, is_active=True)


@public_router.get("/people-stats")
def get_people_stats(request):
    """Get aggregated people statistics for the People page"""
    from academics.models import Leadership, NonAcademicStaff, Department

    leadership_count = Leadership.objects.filter(is_active=True).count()
    staff_count = NonAcademicStaff.objects.filter(is_active=True).count()
    faculty_count = User.objects.filter(role='faculty', is_active=True).count()
    department_count = Department.objects.count()
    total_personnel = leadership_count + staff_count + faculty_count

    return {
        'leadership_count': leadership_count,
        'faculty_count': faculty_count,
        'staff_count': staff_count,
        'total_personnel': total_personnel,
        'department_count': department_count,
    }


@public_router.get("/cta-stats")
def get_cta_stats(request):
    """Get stats for the CTA banner on the home page"""
    from academics.models import Program
    from research.models import ResearchAndDevelopment
    from content.models import InternationalPartner

    undergrad_count = Program.objects.filter(category='undergraduate', is_active=True).count()
    postgrad_count = Program.objects.filter(category='postgraduate', is_active=True).count()
    research_centers = ResearchAndDevelopment.objects.filter(is_active=True).count()
    partners_count = InternationalPartner.objects.filter(is_active=True).count()

    return {
        'undergraduate_programs': undergrad_count,
        'postgraduate_programs': postgrad_count,
        'research_centers': research_centers,
        'international_partners': partners_count,
    }


@public_router.get("/key-metrics", response=List[KeyMetricSchema])
def list_key_metrics(request, category: Optional[str] = None):
    """List key performance metrics"""
    qs = KeyMetric.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    return qs


# ============================================================================
# SDG API
# ============================================================================

class SDGSchema(Schema):
    id: int
    number: int
    title: str
    short_title: Optional[str]
    color: str
    icon: Optional[str]
    description: Optional[str]
    contributions: List[str]
    metrics: List[dict]
    progress_data: List[dict]

    @staticmethod
    def resolve_metrics(obj):
        return obj.get_metrics()


@public_router.get("/sdgs", response=List[SDGSchema])
@paginate
def list_sdgs(request, featured: Optional[bool] = None):
    """List SDGs (Sustainable Development Goals)"""
    qs = SDG.objects.filter(is_active=True)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs.order_by('number')


@public_router.get("/sdgs/{id}", response=SDGSchema)
def get_sdg(request, id: int):
    """Get a specific SDG by ID"""
    return get_object_or_404(SDG, id=id, is_active=True)


# ============================================================================
# IMPACT PROGRAMS API
# ============================================================================

class ImpactProgramSchema(Schema):
    id: int
    title: str
    slug: str
    subtitle: Optional[str]
    description: str
    program_type: str
    program_type_display: str = Field(..., alias="get_program_type_display")
    banner_image_url: Optional[str]
    thumbnail_url: Optional[str]
    stats: List[dict]
    objectives: List[str]
    achievements: List[str]
    partners: List[str]
    gallery_images: List[str]
    location: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]

    @staticmethod
    def resolve_banner_image_url(obj):
        if obj.banner_image:
            return obj.banner_image.url
        return None

    @staticmethod
    def resolve_thumbnail_url(obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    @staticmethod
    def resolve_stats(obj):
        return obj.get_stats()


@public_router.get("/impact-programs", response=List[ImpactProgramSchema])
@paginate
def list_impact_programs(request, program_type: Optional[str] = None, featured: Optional[bool] = None):
    """List impact programs and initiatives"""
    qs = ImpactProgram.objects.filter(is_published=True)
    if program_type:
        qs = qs.filter(program_type=program_type)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs.order_by('-is_featured', 'display_order')


@public_router.get("/impact-programs/{slug}", response=ImpactProgramSchema)
def get_impact_program(request, slug: str):
    """Get a specific impact program by slug"""
    return get_object_or_404(ImpactProgram, slug=slug, is_published=True)


# ============================================================================
# INTERNATIONAL PARTNERS API
# ============================================================================

class InternationalPartnerSchema(Schema):
    id: int
    name: str
    slug: str
    country: str
    city: Optional[str]
    partner_type: str
    partner_type_display: str = Field(..., alias="get_partner_type_display")
    description: str
    website: Optional[str]
    established_year: Optional[int]
    logo_url: Optional[str]
    banner_image_url: Optional[str]
    focus_areas: List[str]
    contact_person: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    students_exchanged: int
    joint_publications: int
    joint_projects: int

    @staticmethod
    def resolve_logo_url(obj):
        if obj.logo:
            return obj.logo.url
        return None

    @staticmethod
    def resolve_banner_image_url(obj):
        if obj.banner_image:
            return obj.banner_image.url
        return None


@public_router.get("/international-partners", response=List[InternationalPartnerSchema])
@paginate
def list_international_partners(request, country: Optional[str] = None, partner_type: Optional[str] = None, featured: Optional[bool] = None):
    """List international partner institutions"""
    qs = InternationalPartner.objects.filter(is_active=True)
    if country:
        qs = qs.filter(country__iexact=country)
    if partner_type:
        qs = qs.filter(partner_type=partner_type)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs.order_by('-is_featured', 'country', 'name')


@public_router.get("/international-partners/{slug}", response=InternationalPartnerSchema)
def get_international_partner(request, slug: str):
    """Get a specific international partner by slug"""
    return get_object_or_404(InternationalPartner, slug=slug, is_active=True)


# ============================================================================
# MOU AGREEMENTS API
# ============================================================================

class MOUAgreementSchema(Schema):
    id: int
    title: str
    mou_type: str
    mou_type_display: str = Field(..., alias="get_mou_type_display")
    partner: InternationalPartnerSchema
    signed_date: str
    expiry_date: Optional[str]
    duration_years: int
    status: str
    status_display: str = Field(..., alias="get_status_display")
    scope_description: str
    key_activities: List[str]
    benefits: List[str]
    document_file: Optional[str]

    @staticmethod
    def resolve_document_file(obj):
        if obj.document_file:
            return obj.document_file.url
        return None


@public_router.get("/mou-agreements", response=List[MOUAgreementSchema])
@paginate
def list_mou_agreements(request, mou_type: Optional[str] = None, status: Optional[str] = None):
    """List MOU agreements (public only)"""
    qs = MOUAgreement.objects.filter(is_public=True)
    if mou_type:
        qs = qs.filter(mou_type=mou_type)
    if status:
        qs = qs.filter(status=status)
    return qs.order_by('-signed_date')


# ============================================================================
# EXCHANGE PROGRAMS API
# ============================================================================

class ExchangeProgramSchema(Schema):
    id: int
    title: str
    slug: str
    program_type: str
    program_type_display: str = Field(..., alias="get_program_type_display")
    partner: InternationalPartnerSchema
    duration_weeks: int
    start_date: Optional[str]
    end_date: Optional[str]
    application_deadline: Optional[str]
    description: str
    eligibility_criteria: List[str]
    benefits: List[str]
    costs: dict
    total_slots: int
    available_slots: int
    status: str
    status_display: str = Field(..., alias="get_status_display")
    banner_image_url: Optional[str]
    contact_email: Optional[str]

    @staticmethod
    def resolve_start_date(obj):
        return obj.start_date.isoformat() if obj.start_date else None

    @staticmethod
    def resolve_end_date(obj):
        return obj.end_date.isoformat() if obj.end_date else None

    @staticmethod
    def resolve_application_deadline(obj):
        return obj.application_deadline.isoformat() if obj.application_deadline else None

    @staticmethod
    def resolve_banner_image_url(obj):
        if obj.banner_image:
            return obj.banner_image.url
        return None


@public_router.get("/exchange-programs", response=List[ExchangeProgramSchema])
@paginate
def list_exchange_programs(request, program_type: Optional[str] = None, status: Optional[str] = None):
    """List exchange programs"""
    qs = ExchangeProgram.objects.filter(is_published=True)
    if program_type:
        qs = qs.filter(program_type=program_type)
    if status:
        qs = qs.filter(status=status)
    return qs.order_by('-is_featured', 'application_deadline')


@public_router.get("/exchange-programs/{slug}", response=ExchangeProgramSchema)
def get_exchange_program(request, slug: str):
    """Get a specific exchange program by slug"""
    return get_object_or_404(ExchangeProgram, slug=slug, is_published=True)


# ============================================================================
# STUDENT SUPPORT SERVICES API
# ============================================================================

class StudentSupportServiceSchema(Schema):
    id: int
    title: str
    slug: str
    service_type: str
    service_type_display: str = Field(..., alias="get_service_type_display")
    short_description: str
    full_description: str
    icon: Optional[str]
    features: List[str]
    requirements: List[str]
    process_steps: List[str]
    faqs: List[str]
    contact_person: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    office_location: Optional[str]
    office_hours: Optional[str]
    related_documents: List[str]
    useful_links: List[dict]


@public_router.get("/student-support-services", response=List[StudentSupportServiceSchema])
@paginate
def list_student_support_services(request, service_type: Optional[str] = None, featured: Optional[bool] = None):
    """List student support services for international students"""
    qs = StudentSupportService.objects.filter(is_published=True)
    if service_type:
        qs = qs.filter(service_type=service_type)
    if featured is not None:
        qs = qs.filter(is_featured=featured)
    return qs.order_by('service_type', 'display_order')


@public_router.get("/student-support-services/{slug}", response=StudentSupportServiceSchema)
def get_student_support_service(request, slug: str):
    """Get a specific student support service by slug"""
    return get_object_or_404(StudentSupportService, slug=slug, is_published=True)


# ============================================================================
# ACADEMIC UNITS HIERARCHY ENDPOINTS
# ============================================================================

@public_router.get("/academic-units/hierarchy", response=dict)
def get_academic_units_hierarchy(request):
    """Get full hierarchy: Colleges -> Faculties -> Departments"""
    colleges = College.objects.filter(is_active=True).prefetch_related('faculties__departments')
    result = []
    for college in colleges:
        faculties_data = []
        for faculty in college.faculties.filter(is_active=True):
            depts = Department.objects.filter(faculty=faculty, is_active=True)
            faculties_data.append({
                'id': faculty.id,
                'name': faculty.name,
                'slug': faculty.slug,
                'code': faculty.code,
                'leadership_name': faculty.leadership_name,
                'leadership_title': faculty.leadership_title,
                'dean_photo': faculty.dean_photo.url if faculty.dean_photo else None,
                'department_count': depts.count(),
                'departments': [{'id': d.id, 'name': d.name, 'slug': d.slug, 'code': d.code} for d in depts]
            })
        result.append({
            'id': college.id,
            'name': college.name,
            'slug': college.slug,
            'leadership_name': college.leadership_name,
            'leadership_title': college.leadership_title,
            'provost_photo': college.provost_photo.url if college.provost_photo else None,
            'icon_name': college.icon_name,
            'primary_color': college.primary_color,
            'description': college.description,
            'established_year': college.established_year,
            'faculty_count': college.faculty_count,
            'student_count': college.student_count,
            'faculty_members_count': college.faculty_members_count,
            'faculties': faculties_data,
            'programs': [{'id': p.id, 'title': p.title, 'slug': p.slug, 'level': p.level} for p in college.programs.filter(is_active=True)[:10]]
        })
    return {'colleges': result}


@public_router.get("/academic-units/faculties", response=dict)
def list_academic_faculties(request):
    """List all faculties with college info"""
    faculties = FacultyUnit.objects.filter(is_active=True).select_related('college')
    return {
        'faculties': [{
            'id': f.id,
            'name': f.name,
            'slug': f.slug,
            'code': f.code,
            'description': f.description,
            'college_id': f.college_id,
            'college_name': f.college.name if f.college else None,
            'leadership_name': f.leadership_name,
            'leadership_title': f.leadership_title,
            'dean_photo': f.dean_photo.url if f.dean_photo else None,
            'department_count': Department.objects.filter(faculty=f, is_active=True).count(),
        } for f in faculties]
    }


@public_router.get("/academic-units/faculties/{slug}", response=dict)
def get_academic_faculty_detail(request, slug: str):
    """Get faculty detail with departments"""
    faculty = get_object_or_404(FacultyUnit, slug=slug, is_active=True)
    departments = Department.objects.filter(faculty=faculty, is_active=True)
    programs = Program.objects.filter(department__faculty=faculty, is_active=True)
    return {
        'id': faculty.id,
        'name': faculty.name,
        'slug': faculty.slug,
        'code': faculty.code,
        'description': faculty.description,
        'mission_statement': faculty.mission_statement,
        'vision_statement': faculty.vision_statement,
        'college_id': faculty.college_id,
        'college_name': faculty.college.name if faculty.college else None,
        'college_slug': faculty.college.slug if faculty.college else None,
        'leadership_name': faculty.leadership_name,
        'leadership_title': faculty.leadership_title,
        'dean_photo': faculty.dean_photo.url if faculty.dean_photo else None,
        'department_count': len(departments),
        'departments': [{
            'id': d.id,
            'name': d.name,
            'slug': d.slug,
            'code': d.code,
            'description': d.description,
            'leadership_name': d.leadership_name,
            'hod_photo': d.hod_photo.url if d.hod_photo else None,
            'staff_count': d.staff_count,
        } for d in departments],
        'program_count': programs.count(),
    }


@public_router.get("/academic-units/departments/{slug}", response=dict)
def get_academic_department_detail(request, slug: str):
    """Get department detail with staff"""
    department = get_object_or_404(Department, slug=slug, is_active=True)
    
    staff = []
    for user in department.staff_members.filter(is_active=True).select_related('department', 'college')[:20]:
        staff.append({
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'profile_image': user.profile_image.url if user.profile_image else None,
            'position': user.position,
            'title': user.title,
            'specialization': user.specialization,
            'publications_count': user.publications_count,
        })
    
    programs = Program.objects.filter(department=department, is_active=True)
    
    return {
        'id': department.id,
        'name': department.name,
        'slug': department.slug,
        'code': department.code,
        'description': department.description,
        'faculty_id': department.faculty_id,
        'faculty_name': department.faculty.name if department.faculty else None,
        'faculty_slug': department.faculty.slug if department.faculty else None,
        'college_id': department.college.id if department.college else None,
        'college_name': department.college.name if department.college else None,
        'leadership_name': department.leadership_name,
        'leadership_title': department.leadership_title,
        'hod_photo': department.hod_photo.url if department.hod_photo else None,
        'staff_count': len(staff),
        'staff': staff,
        'programs': [{'id': p.id, 'title': p.title, 'slug': p.slug, 'level': p.level} for p in programs],
    }


@public_router.get("/academic-units/colleges/{slug}", response=dict)
def get_academic_college_detail(request, slug: str):
    """Get college detail for academic-units endpoint"""
    college = get_object_or_404(College, slug=slug, is_active=True)
    faculties = FacultyUnit.objects.filter(college=college, is_active=True)
    departments = Department.objects.filter(faculty__in=faculties, is_active=True)
    programs = Program.objects.filter(college=college, is_active=True)
    
    return {
        'id': college.id,
        'name': college.name,
        'slug': college.slug,
        'description': college.description,
        'overview_content': college.overview_content,
        'mission_statement': college.mission_statement,
        'established_year': college.established_year,
        'leadership_name': college.leadership_name,
        'leadership_title': college.leadership_title,
        'provost_photo': college.provost_photo.url if college.provost_photo else None,
        'faculty_count': college.faculty_count,
        'student_count': college.student_count,
        'faculty_members_count': college.faculty_members_count,
        'primary_color': college.primary_color,
        'icon_name': college.icon_name,
        'banner_image': college.banner_image.url if college.banner_image else None,
        'faculties': [{
            'id': f.id,
            'name': f.name,
            'slug': f.slug,
            'leadership_name': f.leadership_name,
            'dean_photo': f.dean_photo.url if f.dean_photo else None,
            'department_count': Department.objects.filter(faculty=f, is_active=True).count(),
        } for f in faculties],
        'departments': [{
            'id': d.id,
            'name': d.name,
            'slug': d.slug,
            'faculty_name': d.faculty.name if d.faculty else None,
        } for d in departments[:30]],
        'programs': [{
            'id': p.id,
            'title': p.title,
            'slug': p.slug,
            'level': p.level,
            'degree': p.degree,
            'duration': p.duration,
        } for p in programs[:30]],
    }


# ============================================================================
# NEWS CATEGORY ENDPOINTS
# ============================================================================

@public_router.get("/press-releases", response=List[NewsItemSchema])
def list_press_releases(request, limit: int = 20):
    """List press releases (news with category='announcement')"""
    from django.utils import timezone
    return NewsItem.objects.filter(
        is_published=True,
        category='announcement'
    )[:limit]


@public_router.get("/announcements", response=List[NewsItemSchema])
def list_announcements(request, limit: int = 20):
    """List announcements (news with category='announcement')"""
    from django.utils import timezone
    return NewsItem.objects.filter(
        is_published=True,
        category='announcement'
    )[:limit]


# ============================================================================
# PAST EVENTS ENDPOINT
# ============================================================================

@public_router.get("/past-events", response=List[EventSchema])
def list_past_events(request, limit: int = 50):
    """List past events"""
    from django.utils import timezone
    return Event.objects.filter(
        is_published=True,
        event_date__lt=timezone.now()
    ).order_by('-event_date')[:limit]


# ============================================================================
# PUBLIC CHAT ENDPOINTS
# ============================================================================

@public_router.get("/chat/conversations/{session_id}", response=ChatHistorySchema)
def get_chat_conversation(request, session_id: str):
    """Get chat history for a session"""
    try:
        conversation = Conversation.objects.get(session_id=session_id)
        messages = Message.objects.filter(conversation=conversation).order_by('created_at')
        from chat.models import AgentSession
        agent_online = AgentSession.objects.filter(is_online=True).exists()
        
        return {
            'session_id': str(conversation.session_id),
            'messages': [
                {
                    'id': msg.id,
                    'role': msg.role,
                    'content': msg.content,
                    'created_at': msg.created_at.isoformat()
                }
                for msg in messages
            ],
            'agent_online': agent_online
        }
    except Conversation.DoesNotExist:
        return {
            'session_id': session_id,
            'messages': [],
            'agent_online': False
        }


@public_router.post("/chat/conversations/{session_id}/contact")
@ratelimit('chat_contact', limit=10, window=60)
def update_chat_contact(request, session_id: str, data: ContactUpdateSchema):
    """Update contact info for a chat session"""
    try:
        conversation = Conversation.objects.get(session_id=session_id)
        conversation.visitor_name = data.name
        conversation.visitor_email = data.email
        conversation.save()
        return {'ok': True}
    except Conversation.DoesNotExist:
        # Create conversation if it doesn't exist
        Conversation.objects.create(
            session_id=session_id,
            visitor_name=data.name,
            visitor_email=data.email
        )
        return {'ok': True}


@public_router.get("/chat/agent-status")
def get_agent_status(request):
    """Check if any agents are online"""
    from chat.models import AgentSession
    agent_online = AgentSession.objects.filter(is_online=True).exists()
    return {'agent_online': agent_online}


# Add public router to public_api
public_api.add_router("/", public_router)


# ============================================================================
# AUTHENTICATED API ENDPOINTS
# ============================================================================

from accounts.alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
from portals.models import (
    StudentResult, StudentFeePayment, StudentCourse,
    FeeType, FeeStructure, FeeStructureItem,
)


# Schemas for authenticated endpoints
class UserSchema(Schema):
    id: int
    email: str
    first_name: str
    last_name: str
    full_name: str
    role: str
    role_display: str = Field(..., alias="get_role_display")
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    is_email_verified: bool


class LoginSchema(Schema):
    email: str
    password: str


class LoginResponseSchema(Schema):
    access: str
    refresh: str
    user: UserSchema


class AlumniProfileSchema(Schema):
    id: int
    graduation_year: int
    program_id: Optional[int] = None
    current_employer: Optional[str] = None
    job_title: Optional[str] = None
    career_status: str
    career_status_display: str = Field(..., alias="get_career_status_display")
    is_mentor: bool
    professional_summary: Optional[str] = None
    linkedin_url: Optional[str] = None


class StudentResultSchema(Schema):
    session: str
    semester: str
    level: int
    gpa: float
    cgpa: float
    academic_status: str
    is_published: bool


class StudentFeePaymentSchema(Schema):
    id: int
    fee_type: str = ''
    fee_type_label: str = ''
    fee_type_ref_id: Optional[int] = None
    session: str
    semester: str
    amount: float
    status: str
    status_display: str = Field(..., alias="get_status_display")
    payment_method: str = ''
    payment_reference: str = ''
    paid_at: Optional[datetime] = None
    created_at: datetime


class FeeTypeSchema(Schema):
    id: int
    name: str
    category: str
    category_display: str = Field(..., alias="get_category_display")
    code: str
    description: str
    is_active: bool


class FeeStructureSchema(Schema):
    id: int
    session: str
    level: int
    semester: str
    program_id: Optional[int] = None
    is_indigene: bool
    total_amount: float
    max_installments: int


class FeeStructureItemSchema(Schema):
    id: int
    fee_structure_id: int
    fee_type_id: int
    fee_type_name: str = Field(None, alias="fee_type.name")
    amount: float
    sort_order: int


class FeeStructureCreate(Schema):
    session: str
    level: int
    semester: str = ''
    program_id: Optional[int] = None
    is_indigene: bool = False
    max_installments: int = 2


class OutstandingFeeSchema(Schema):
    allocation_id: int
    fee_type: str
    category: str
    amount: float
    due_date: Optional[str] = None


class DefaulterReportSchema(Schema):
    student_id: int
    student_name: str
    matric_number: str
    level: Optional[int] = None
    outstanding_count: int
    total_outstanding: float
    items: List[OutstandingFeeSchema]


class RemitaInitSchema(Schema):
    status: str
    rrr: str
    order_id: str
    message: Optional[str] = None


class PaymentInitRequest(Schema):
    fee_type_id: int = 1
    session: str
    semester: str = ''
    gateway: str = 'paystack'
    installment: str = 'full'
    redirect_url: str = ''


class PaymentCallbackSchema(Schema):
    reference: str
    gateway: str = 'paystack'


# Auth router
auth_router = Router(auth=JWTAuth())


@auth_router.post("/login", response=LoginResponseSchema, auth=None)
@ratelimit('login', limit=10, window=60)
def login(request, data: LoginSchema):
    """User login with email and password"""
    try:
        user = User.objects.get(email=data.email)
    except User.DoesNotExist:
        raise HttpError(401, "Invalid credentials")

    user = authenticate(username=user.username, password=data.password)
    if not user or not user.is_active:
        raise HttpError(401, "Invalid credentials")
    
    from accounts.models import UserActivity
    refresh = RefreshToken.for_user(user)
    UserActivity.objects.create(user=user, action='login', description='User logged in')
    
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": user
    }


class TokenRefreshInput(Schema):
    refresh: str


class TokenRefreshResponse(Schema):
    access: str
    refresh: str


@auth_router.post("/token/refresh", response=TokenRefreshResponse, auth=None)
def refresh_access_token(request, data: TokenRefreshInput):
    """Exchange a refresh token for a new access token (rotates the refresh token)."""
    from rest_framework_simplejwt.exceptions import TokenError
    try:
        old_refresh = RefreshToken(data.refresh)
        user = old_refresh.user
        old_refresh.blacklist()
    except TokenError:
        raise HttpError(401, 'Invalid or expired refresh token')
    except Exception:
        raise HttpError(401, 'Invalid or expired refresh token')
    new_refresh = RefreshToken.for_user(user)
    return {"access": str(new_refresh.access_token), "refresh": str(new_refresh)}


@auth_router.get("/profile", response=UserSchema)
def get_profile(request):
    """Get current user profile"""
    return request.user


@auth_router.get("/alumni/profile", response=Optional[AlumniProfileSchema])
def get_alumni_profile(request):
    """Get alumni profile for current user"""
    try:
        return AlumniProfile.objects.get(user=request.user)
    except AlumniProfile.DoesNotExist:
        return None


@auth_router.get("/student/results", response=List[StudentResultSchema])
def student_results(request):
    """Get student results"""
    if request.user.role != 'student':
        return []
    return StudentResult.objects.filter(
        student=request.user,
        is_published=True
    ).order_by('-session', '-semester')


@auth_router.get("/student/fees", response=List[StudentFeePaymentSchema])
def student_fees(request):
    """Get student fee payments"""
    if request.user.role != 'student':
        return []
    return StudentFeePayment.objects.filter(student=request.user)


# ═══════════════════════════════════════════════════════════════
# PHASE 5: FEE & FINANCIAL ENDPOINTS
# ═══════════════════════════════════════════════════════════════


@auth_router.get("/fee-types", response=List[FeeTypeSchema])
def list_fee_types(request):
    """List all active fee types."""
    return FeeType.objects.filter(is_active=True)


@auth_router.post("/admin/fee-structures")
def create_fee_structure(request, data: FeeStructureCreate):
    """Create a new fee structure (admin only)."""
    if request.user.role not in ('admin', 'staff', 'bursary'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from decimal import Decimal
    fs = FeeStructure.objects.create(
        session=data.session,
        level=data.level,
        semester=data.semester,
        program_id=data.program_id if data.program_id else None,
        is_indigene=data.is_indigene,
        max_installments=data.max_installments,
    )
    return {'id': fs.id, 'message': 'Fee structure created'}


class FeeStructureItemCreate(Schema):
    fee_structure_id: int
    fee_type_id: int
    amount: float
    sort_order: int = 0


@auth_router.post("/admin/fee-structure-items")
def create_fee_structure_item(request, data: FeeStructureItemCreate):
    """Add an item to a fee structure."""
    if request.user.role not in ('admin', 'staff', 'bursary'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from decimal import Decimal
    item = FeeStructureItem.objects.create(
        fee_structure_id=data.fee_structure_id,
        fee_type_id=data.fee_type_id,
        amount=Decimal(str(data.amount)),
        sort_order=data.sort_order,
    )
    item.fee_structure.recompute_total()
    return {'id': item.id, 'fee_structure_id': data.fee_structure_id, 'message': 'Item added'}


@auth_router.get("/admin/fee-structures", response=List[FeeStructureSchema])
def list_fee_structures(request, session: str = '', level: int = 0, is_indigene: bool = False):
    """List fee structures."""
    if request.user.role not in ('admin', 'staff', 'bursary'):
        return []
    qs = FeeStructure.objects.select_related('program').all()
    if session:
        qs = qs.filter(session=session)
    if level:
        qs = qs.filter(level=level)
    qs = qs.filter(is_indigene=is_indigene)
    return qs


@auth_router.get("/admin/fee-structures/{structure_id}/items", response=List[FeeStructureItemSchema])
def list_fee_structure_items(request, structure_id: int):
    """List items in a fee structure."""
    if request.user.role not in ('admin', 'staff', 'bursary'):
        return []
    return FeeStructureItem.objects.filter(fee_structure_id=structure_id).select_related('fee_type')


@auth_router.get("/student/fee-structure")
def student_fee_structure(request, session: str = '2024/2025', semester: str = ''):
    """Get the fee structure applicable to the authenticated student."""
    if request.user.role != 'student':
        return None
    from portals.services import FeeService
    return FeeService.get_student_fee_structure(request.user, session, semester)


@auth_router.get("/student/fee-status")
def student_fee_status(request, session: str = '2024/2025', semester: str = ''):
    """Check fee status for the student."""
    from portals.services import FeeService
    structure = FeeService.get_student_fee_structure(request.user, session, semester)
    is_clear = FeeService.is_fee_clear(request.user, session, semester)
    total = FeeService.total_outstanding(request.user, session, semester)
    installment_due = FeeService.get_installment_due(request.user, session, semester)
    return {
        'is_clear': is_clear,
        'outstanding_total': total,
        'installment_due': installment_due,
        'structure': structure,
    }


@auth_router.get("/admin/defaulter-report")
def defaulter_report(request, session: str = '2024/2025', semester: str = '', level: int = 0):
    """Generate fee defaulter report."""
    if request.user.role not in ('admin', 'staff', 'bursary'):
        return []
    from portals.services import FeeService
    return FeeService.get_defaulter_report(
        session, semester, level=level if level else None,
    )


@auth_router.post("/student/payment/initialize")
def initialize_student_payment(request, data: PaymentInitRequest):
    """Initialize a student fee payment via chosen gateway."""
    if request.user.role != 'student':
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    from decimal import Decimal
    import secrets
    from portals.services import FeeService

    structure = FeeService.get_student_fee_structure(request.user, data.session, data.semester)
    if not structure:
        from django.http import JsonResponse
        return JsonResponse({'error': 'No fee structure found for your session/level'}, status=400)

    order_id = f"BMU-{request.user.id}-{secrets.token_hex(6).upper()}"
    amount = Decimal(str(structure['total_amount']))

    payment = StudentFeePayment.objects.create(
        student=request.user,
        fee_structure_id=structure['id'],
        installment=data.installment,
        session=data.session,
        semester=data.semester or '',
        amount=amount,
        amount_paid=amount,
        status='pending',
        payment_method=data.gateway,
        payment_reference=order_id,
    )

    if data.gateway == 'remita':
        from portals.services import RemitaService
        result = RemitaService.initialize_payment(
            student_name=request.user.full_name,
            email=request.user.email,
            amount=amount,
            order_id=order_id,
        )
        payment.gateway_response = result
        payment.save(update_fields=['gateway_response'])
        return {
            'payment_id': payment.id,
            'order_id': order_id,
            'gateway': 'remita',
            'rrr': result.get('rrr', ''),
            'amount': float(amount),
        }
    else:
        # Paystack
        import requests as http_requests
        paystack_secret = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        headers = {
            'Authorization': f'Bearer {paystack_secret}',
            'Content-Type': 'application/json',
        }
        payload = {
            'email': request.user.email,
            'amount': int(amount * 100),
            'reference': order_id,
            'callback_url': data.redirect_url or '',
        }
        try:
            resp = http_requests.post(
                'https://api.paystack.co/transaction/initialize',
                json=payload, headers=headers, timeout=30,
            )
            body = resp.json()
            payment.gateway_response = body
            payment.save(update_fields=['gateway_response'])
            return {
                'payment_id': payment.id,
                'order_id': order_id,
                'gateway': 'paystack',
                'authorization_url': body.get('data', {}).get('authorization_url', ''),
                'access_code': body.get('data', {}).get('access_code', ''),
                'amount': float(amount),
            }
        except Exception as e:
            return {'error': str(e)}


@auth_router.post("/student/payment/verify")
def verify_student_payment(request, data: PaymentCallbackSchema):
    """Verify a payment after gateway callback."""
    if request.user.role != 'student':
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    payment = StudentFeePayment.objects.filter(
        student=request.user, payment_reference=data.reference,
    ).first()
    if not payment:
        from django.http import JsonResponse
        return JsonResponse({'error': 'Payment not found'}, status=404)

    if payment.status == 'completed':
        return {
            'status': 'completed',
            'payment_id': payment.id,
            'reference': data.reference,
            'message': 'Already verified',
        }

    if data.gateway == 'remita':
        from portals.services import RemitaService
        result = RemitaService.verify_payment(data.reference)
        if result.get('status') == 'success':
            payment.status = 'completed'
            payment.paid_at = timezone.now()
            payment.gateway_response = result
            payment.save(update_fields=['status', 'paid_at', 'gateway_response'])
        return {
            'status': payment.status,
            'payment_id': payment.id,
            'reference': data.reference,
            'rrr': data.reference,
        }
    else:
        # Paystack
        import requests as http_requests
        paystack_secret = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        headers = {'Authorization': f'Bearer {paystack_secret}'}
        try:
            resp = http_requests.get(
                f'https://api.paystack.co/transaction/verify/{data.reference}',
                headers=headers, timeout=30,
            )
            body = resp.json()
            payment.gateway_response = body
            payment.save(update_fields=['gateway_response'])
            gw = body.get('data', {})
            if gw.get('status') == 'success':
                # Amount charged must equal the expected fee (kobo on Paystack)
                paid_kobo = int(gw.get('amount') or 0)
                expected_kobo = int(float(payment.amount or 0) * 100)
                if paid_kobo == expected_kobo and (gw.get('currency') or 'NGN') == 'NGN':
                    payment.status = 'completed'
                    payment.paid_at = timezone.now()
                    payment.save(update_fields=['status', 'paid_at'])
                else:
                    payment.status = 'failed'
                    payment.save(update_fields=['status'])
            return {
                'status': payment.status,
                'payment_id': payment.id,
                'reference': data.reference,
                'paystack_data': gw,
            }
        except Exception as e:
            return {'error': str(e)}


# ── Bursary Dashboard & Scholarship Verification ──────────────


class ScholarshipVerifySchema(Schema):
    record_id: int
    action: str  # 'verify' | 'reject'
    notes: str = ''


class BursaryDashboardSchema(Schema):
    pending_verifications: int
    total_collections: float = 0.0
    defaulters_count: int = 0
    pending_scholarships: int = 0
    recent_payments: List[dict] = []

    @staticmethod
    def resolve_pending_verifications(obj):
        return obj.get('pending_verifications', 0)

    @staticmethod
    def resolve_total_collections(obj):
        return obj.get('total_collections', 0.0)

    @staticmethod
    def resolve_defaulters_count(obj):
        return obj.get('defaulters_count', 0)

    @staticmethod
    def resolve_pending_scholarships(obj):
        return obj.get('pending_scholarships', 0)

    @staticmethod
    def resolve_recent_payments(obj):
        return obj.get('recent_payments', [])


@auth_router.get("/bursary/dashboard")
def bursary_dashboard(request, session: str = '2024/2025'):
    """Bursary dashboard overview data."""
    if request.user.role not in ('bursary', 'admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import StudentFeePayment, ScholarshipRecord, FeeStructure
    from django.db.models import Sum, Q

    pending_scholarships = ScholarshipRecord.objects.filter(status='pending').count()
    pending_verifications = StudentFeePayment.objects.filter(
        status='pending', is_scholarship=False,
    ).count()
    total_collections = StudentFeePayment.objects.filter(
        status='completed', session=session,
    ).aggregate(total=Sum('amount_paid'))['total'] or 0

    fs_count = FeeStructure.objects.filter(session=session).count()
    from portals.services import FeeService
    defaulters = FeeService.get_defaulter_report(session)
    defaulters_count = len(defaulters) if defaulters else 0

    recent = StudentFeePayment.objects.filter(
        status='completed',
    ).select_related('student', 'fee_structure').order_by('-created_at')[:10]

    return {
        'pending_verifications': pending_verifications,
        'total_collections': float(total_collections),
        'defaulters_count': defaulters_count,
        'pending_scholarships': pending_scholarships,
        'recent_payments': [
            {
                'id': p.id,
                'student': p.student.full_name,
                'amount': float(p.amount_paid),
                'method': p.payment_method,
                'reference': p.payment_reference,
                'date': p.paid_at.isoformat() if p.paid_at else p.created_at.isoformat(),
                'status': p.status,
            }
            for p in recent
        ],
    }


@auth_router.get("/bursary/pending-scholarships")
def bursary_pending_scholarships(request):
    """List scholarship records pending verification."""
    if request.user.role not in ('bursary', 'admin', 'staff'):
        return []
    from portals.models import ScholarshipRecord
    return ScholarshipRecord.objects.filter(status='pending').select_related('student')


@auth_router.get("/bursary/pending-payments")
def bursary_pending_payments(request, session: str = '2024/2025'):
    """List pending fee payments for verification."""
    if request.user.role not in ('bursary', 'admin', 'staff'):
        return []
    from portals.models import StudentFeePayment
    return StudentFeePayment.objects.filter(
        status='pending', is_scholarship=False,
    ).select_related('student', 'fee_structure__items__fee_type').order_by('-created_at')[:50]


@auth_router.post("/bursary/verify-scholarship")
def bursary_verify_scholarship(request, data: ScholarshipVerifySchema):
    """Bursary verifies or rejects a scholarship record."""
    if request.user.role not in ('bursary', 'admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import ScholarshipRecord
    from django.utils import timezone

    try:
        rec = ScholarshipRecord.objects.get(id=data.record_id, status='pending')
    except ScholarshipRecord.DoesNotExist:
        from django.http import JsonResponse
        return JsonResponse({'error': 'Record not found or already processed'}, status=404)

    if data.action == 'verify':
        rec.status = 'verified'
        rec.verified_by = request.user
        rec.verified_at = timezone.now()
        rec.notes = data.notes or 'Verified by bursary'
        rec.save()
        from portals.emails import notify_scholarship_updated
        notify_scholarship_updated(rec, verified=True, note=data.notes)

        return {'message': 'Scholarship verified', 'id': rec.id, 'status': 'verified'}
    elif data.action == 'reject':
        rec.status = 'rejected'
        rec.verified_by = request.user
        rec.verified_at = timezone.now()
        rec.notes = data.notes or 'Rejected by bursary'
        rec.save()
        from portals.emails import notify_scholarship_updated
        notify_scholarship_updated(rec, verified=False, note=data.notes)
        return {'message': 'Scholarship rejected', 'id': rec.id, 'status': 'rejected'}
    else:
        from django.http import JsonResponse
        return JsonResponse({'error': 'Invalid action. Use "verify" or "reject"'}, status=400)


# ── HOD Dashboard ─────────────────────────────────────────────

@auth_router.get("/hod/dashboard")
def hod_dashboard(request, session: str = '2024/2025'):
    """HOD dashboard with department-level stats."""
    if request.user.role not in ('hod', 'faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from academics.models import Department, Course
    from portals.models import StudentCourse

    try:
        dept = Department.objects.get(hod=request.user)
    except Department.DoesNotExist:
        dept = request.user.department

    dept_name = dept.name if dept else 'N/A'
    total_courses = Course.objects.filter(department=dept, is_active=True).count() if dept else 0

    # Students in programs under this department
    total_students = User.objects.filter(
        role='student', is_active=True, program__department=dept
    ).count() if dept else 0

    # Lecturers (staff/faculty in this department)
    total_lecturers = User.objects.filter(
        role__in=('faculty', 'staff'), is_active=True,
        department=dept,
    ).count() if dept else 0

    pending_approvals = StudentCourse.objects.filter(
        course__department=dept, result_status='submitted',
    ).count() if dept else 0

    courses_list = Course.objects.filter(department=dept, is_active=True)[:10] if dept else []
    approvals_list = StudentCourse.objects.filter(
        course__department=dept, result_status='submitted',
    ).select_related('student', 'course')[:10] if dept else []

    return {
        'total_students': total_students,
        'total_courses': total_courses,
        'total_lecturers': total_lecturers,
        'pending_approvals': pending_approvals,
        'department': dept_name,
        'courses': [
            {'code': c.code, 'title': c.title, 'lecturer': ''}
            for c in courses_list
        ],
        'recent_approvals': [
            {
                'student': sc.student.full_name,
                'course': sc.course.code,
                'status': sc.result_status,
            }
            for sc in approvals_list
        ],
    }


# ── Dean Dashboard ────────────────────────────────────────────

@auth_router.get("/dean/dashboard")
def dean_dashboard(request, session: str = '2024/2025'):
    """Dean dashboard with faculty-level stats."""
    if request.user.role not in ('dean', 'faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from academics.models import FacultyUnit, Department
    from portals.models import StudentCourse
    from academics.models import Course

    try:
        faculty = FacultyUnit.objects.get(dean=request.user)
    except FacultyUnit.DoesNotExist:
        faculty = None

    faculty_name = faculty.name if faculty else 'All Faculties'
    depts = Department.objects.filter(faculty=faculty) if faculty else Department.objects.none()
    dept_ids = depts.values_list('id', flat=True)

    total_students = User.objects.filter(
        role='student', is_active=True, program__department_id__in=dept_ids,
    ).count() if dept_ids else User.objects.filter(role='student', is_active=True).count()

    total_departments = depts.count() if faculty else Department.objects.count()
    total_lecturers = User.objects.filter(
        role__in=('faculty', 'staff'), is_active=True,
        department_id__in=dept_ids,
    ).count() if dept_ids else User.objects.filter(role__in=('faculty', 'staff'), is_active=True).count()

    pending_approvals = StudentCourse.objects.filter(
        course__department_id__in=dept_ids, result_status='submitted',
    ).count() if dept_ids else StudentCourse.objects.filter(result_status='submitted').count()

    return {
        'total_students': total_students,
        'total_departments': total_departments,
        'total_lecturers': total_lecturers,
        'pending_approvals': pending_approvals,
        'faculty': faculty_name,
        'departments': [
            {
                'name': d.name,
                'students': User.objects.filter(role='student', is_active=True, program__department=d).count(),
                'lecturers': User.objects.filter(role__in=('faculty', 'staff'), is_active=True, department=d).count(),
            }
            for d in (depts if faculty else Department.objects.all())
        ],
        'recent_approvals': [
            {
                'department': getattr(sc.course.department, 'name', ''),
                'course': sc.course.code,
                'count': 1,
            }
            for sc in (
                StudentCourse.objects.filter(
                    course__department_id__in=dept_ids, result_status='submitted',
                ).select_related('student', 'course', 'course__department')[:10]
                if dept_ids else StudentCourse.objects.filter(result_status='submitted').select_related('student', 'course', 'course__department')[:10]
            )
        ],
    }


# ── VC Dashboard ──────────────────────────────────────────────

@auth_router.get("/vc/dashboard")
def vc_dashboard(request, session: str = '2024/2025'):
    """VC dashboard with university-wide stats."""
    if request.user.role not in ('vc', 'admin', 'staff', 'faculty'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from academics.models import College, Program
    from portals.models import StudentResult

    total_students = User.objects.filter(role='student', is_active=True).count()
    total_faculty_members = User.objects.filter(role='faculty', is_active=True).count()
    total_staff = User.objects.filter(role='staff', is_active=True).count()
    total_programs = Program.objects.count()

    avg_result = StudentResult.objects.filter(is_published=True).aggregate(
        avg_cgpa=Avg('cgpa')
    )
    average_gpa = float(avg_result['avg_cgpa']) if avg_result['avg_cgpa'] else 0.0

    # Graduation rate: count student results with cgpa >= 1.0 (graduating)
    total_with_results = StudentResult.objects.filter(is_published=True).values('student').distinct().count()
    graduating = StudentResult.objects.filter(is_published=True, cgpa__gte=1.0).values('student').distinct().count()
    graduation_rate = round((graduating / total_with_results * 100) if total_with_results > 0 else 0)

    colleges = College.objects.filter(is_active=True)
    total_publications = sum(
        User.objects.filter(college=c, role='faculty').aggregate(
            total=Sum('publications_count')
        )['total'] or 0
        for c in colleges
    )

    return {
        'total_students': total_students,
        'total_faculty': total_faculty_members,
        'total_staff': total_staff,
        'total_programs': total_programs,
        'average_gpa': average_gpa,
        'graduation_rate': graduation_rate,
        'colleges': [
            {
                'name': c.name,
                'students': User.objects.filter(college=c, role='student', is_active=True).count(),
            }
            for c in colleges
        ],
        'recent_publications': total_publications,
    }


# ── Registrar Dashboard ──────────────────────────────────────

@auth_router.get("/registrar/dashboard")
def registrar_dashboard(request, session: str = '2024/2025'):
    """Registrar dashboard with enrollment and registration stats."""
    if request.user.role not in ('registrar', 'admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from academics.models import Program
    from portals.models import Registration

    enrolled_students = User.objects.filter(role='student', is_active=True).count()

    active_sessions = Registration.objects.values_list('academic_year', flat=True).distinct().count()
    if active_sessions == 0:
        active_sessions = 1  # current session

    pending_registrations = Registration.objects.filter(status='submitted').count()
    completed_registrations = Registration.objects.filter(status='registered').count()

    programs = Program.objects.all()
    recent_regs = Registration.objects.filter(
        status__in=('submitted', 'registered'),
    ).select_related('student', 'student__student_profile').order_by('-submitted_at')[:10]

    return {
        'enrolled_students': enrolled_students,
        'active_sessions': active_sessions,
        'pending_registrations': pending_registrations,
        'completed_registrations': completed_registrations,
        'programs': [
            {
                'name': f"{p.degree} {p.title}" if p.degree else p.title,
                'students': User.objects.filter(program=p, role='student', is_active=True).count(),
            }
            for p in programs
        ],
        'recent_registrations': [
            {
                'student': r.student.student_profile.matric_number if hasattr(r.student, 'student_profile') and r.student.student_profile else r.student.full_name,
                'program': r.student.program.title if r.student.program else '',
                'date': r.submitted_at.isoformat() if r.submitted_at else '',
                'status': r.status,
            }
            for r in recent_regs
        ],
    }


# Site-wide Search Schema
class SearchResultItem(Schema):
    id: int
    title: str
    type: str
    slug: Optional[str] = None
    description: Optional[str] = None
    url: str
    image: Optional[str] = None
    metadata: Optional[dict] = None


class SearchResponse(Schema):
    query: str
    total_results: int
    results: List[SearchResultItem]
    authors_count: int
    publications_count: int
    programs_count: int
    news_count: int


# Site-wide Search Endpoint
@public_router.get("/search", response=SearchResponse)
@ratelimit('site_search', limit=30, window=60)
def site_search(request, q: str = "", limit: int = 20):
    """
    Site-wide search across authors, publications, programs, news, events, and more.
    
    Query parameters:
    - q: Search query string
    - limit: Maximum number of results per category
    """
    if not q or len(q) < 2:
        return {
            "query": q,
            "total_results": 0,
            "results": [],
            "authors_count": 0,
            "publications_count": 0,
            "programs_count": 0,
            "news_count": 0
        }
    
    from django.db.models import Q
    results = []
    
    # Search Authors (Users with faculty/staff roles)
    author_qs = get_user_model().objects.filter(
        Q(is_active=True) &
        (Q(first_name__icontains=q) | 
         Q(last_name__icontains=q) | 
         Q(email__icontains=q) |
         Q(specialization__icontains=q) |
         Q(position__icontains=q))
    ).select_related('department', 'college')[:limit]
    
    for user in author_qs:
        results.append({
            "id": user.id,
            "title": user.full_name,
            "type": "author",
            "slug": None,
            "description": f"{user.title} {user.position}" if user.position else user.email,
            "url": f"/leadership/{user.id}",
            "image": user.profile_image.url if user.profile_image else None,
            "metadata": {
                "department": user.department.name if user.department else None,
                "college": user.college.name if user.college else None,
                "specialization": user.specialization,
                "publications_count": user.publications_count
            }
        })
    authors_count = len(author_qs)
    
    # Search Publications
    publication_qs = Publication.objects.filter(
        Q(title__icontains=q) |
        Q(authors__icontains=q) |
        Q(abstract__icontains=q) |
        Q(journal_name__icontains=q)
    ).order_by('-year')[:limit]
    
    for pub in publication_qs:
        results.append({
            "id": pub.id,
            "title": pub.title,
            "type": "publication",
            "slug": None,
            "description": f"{pub.authors} ({pub.year})",
            "url": f"/research/publications/{pub.id}",
            "image": None,
            "metadata": {
                "year": pub.year,
                "journal": pub.journal_name,
                "publication_type": pub.publication_type,
                "citations": pub.citations
            }
        })
    publications_count = len(publication_qs)
    
    # Search Programs
    program_qs = Program.objects.filter(
        Q(is_active=True) &
        (Q(title__icontains=q) |
         Q(description__icontains=q) |
         Q(degree__icontains=q) |
         Q(overview__icontains=q))
    )[:limit]
    
    for prog in program_qs:
        results.append({
            "id": prog.id,
            "title": prog.title,
            "type": "program",
            "slug": prog.slug,
            "description": prog.description[:150] + "..." if len(prog.description) > 150 else prog.description,
            "url": f"/academics/programs/{prog.slug}",
            "image": None,
            "metadata": {
                "degree": prog.degree,
                "duration": prog.duration,
                "level": prog.level
            }
        })
    programs_count = len(program_qs)
    
    # Search News
    news_qs = NewsItem.objects.filter(
        Q(is_published=True) &
        (Q(title__icontains=q) |
         Q(content__icontains=q) |
         Q(excerpt__icontains=q))
    )[:limit]
    
    for news in news_qs:
        results.append({
            "id": news.id,
            "title": news.title,
            "type": "news",
            "slug": news.slug,
            "description": news.excerpt[:150] + "..." if len(news.excerpt) > 150 else news.excerpt,
            "url": f"/news/{news.slug}",
            "image": news.featured_image.url if news.featured_image else None,
            "metadata": {
                "category": news.category,
                "published_at": news.published_at.isoformat() if news.published_at else None,
                "author": news.author
            }
        })
    news_count = len(news_qs)
    
    # Search Colleges
    college_qs = College.objects.filter(
        Q(is_active=True) &
        (Q(name__icontains=q) |
         Q(description__icontains=q) |
         Q(overview_content__icontains=q))
    )[:5]
    
    for college in college_qs:
        results.append({
            "id": college.id,
            "title": college.name,
            "type": "college",
            "slug": college.slug,
            "description": college.description[:150] + "..." if len(college.description) > 150 else college.description,
            "url": f"/colleges/{college.slug}",
            "image": college.banner_image.url if college.banner_image else None,
            "metadata": {
                "provost": college.leadership_name,
                "established_year": college.established_year
            }
        })
    
    # Search Faculties
    faculty_qs = FacultyUnit.objects.filter(
        Q(is_active=True) &
        (Q(name__icontains=q) |
         Q(description__icontains=q) |
         Q(code__icontains=q))
    )[:5]
    
    for faculty in faculty_qs:
        results.append({
            "id": faculty.id,
            "title": faculty.name,
            "type": "faculty",
            "slug": faculty.slug,
            "description": faculty.description[:150] + "..." if faculty.description and len(faculty.description) > 150 else faculty.description,
            "url": f"/faculties/{faculty.slug}",
            "image": faculty.banner_image.url if faculty.banner_image else None,
            "metadata": {
                "dean": faculty.leadership_name,
                "college": faculty.college.name if faculty.college else None
            }
        })
    
    # Search Departments
    dept_qs = Department.objects.filter(
        Q(is_active=True) &
        (Q(name__icontains=q) |
         Q(description__icontains=q) |
         Q(code__icontains=q))
    )[:5]
    
    for dept in dept_qs:
        results.append({
            "id": dept.id,
            "title": dept.name,
            "type": "department",
            "slug": dept.slug,
            "description": dept.description[:150] + "..." if dept.description and len(dept.description) > 150 else dept.description,
            "url": f"/departments/{dept.slug}",
            "image": dept.banner_image.url if dept.banner_image else None,
            "metadata": {
                "hod": dept.leadership_name,
                "faculty": dept.faculty.name if dept.faculty else None
            }
        })
    
    return {
        "query": q,
        "total_results": len(results),
        "results": results,
        "authors_count": authors_count,
        "publications_count": publications_count,
        "programs_count": programs_count,
        "news_count": news_count
    }


# ============================================================================
# CPD COURSES API (Public)
# ============================================================================

from portals.models import CPDCourse, CPDEnrollment
import json

class CPDCourseSchema(Schema):
    id: int
    title: str
    slug: str
    code: str
    category: str
    category_display: str = Field(..., alias="get_category_display")
    description: str
    learning_objectives: List[str]
    curriculum: List[str]
    duration_hours: int
    duration_days: int
    credit_hours: int
    delivery_mode: str
    delivery_mode_display: str = Field(..., alias="get_delivery_mode_display")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    enrollment_deadline: Optional[str] = None
    max_participants: int
    enrolled_count: int
    fee_local: Optional[float] = None
    fee_intl: Optional[float] = None
    instructor_name: str
    status: str
    is_featured: bool
    thumbnail: Optional[str] = None

    @staticmethod
    def resolve_start_date(obj):
        return obj.start_date.isoformat() if obj.start_date else None

    @staticmethod
    def resolve_end_date(obj):
        return obj.end_date.isoformat() if obj.end_date else None

    @staticmethod
    def resolve_enrollment_deadline(obj):
        return obj.enrollment_deadline.isoformat() if obj.enrollment_deadline else None

    @staticmethod
    def resolve_thumbnail(obj):
        return obj.thumbnail.url if obj.thumbnail else None


@public_router.get("/cpd-courses", response=List[CPDCourseSchema])
@paginate
def list_cpd_courses(request, category: Optional[str] = None, delivery_mode: Optional[str] = None):
    """List published CPD courses"""
    qs = CPDCourse.objects.filter(status__in=['published', 'ongoing'])
    if category:
        qs = qs.filter(category=category)
    if delivery_mode:
        qs = qs.filter(delivery_mode=delivery_mode)
    return qs.order_by('-is_featured', 'display_order')


@public_router.get("/cpd-courses/{slug}", response=CPDCourseSchema)
def get_cpd_course(request, slug: str):
    """Get CPD course details by slug"""
    return get_object_or_404(CPDCourse, slug=slug)


class CPDEnrollmentSchema(Schema):
    id: int
    course_id: int
    course_title: str = Field(..., alias="course.title")
    course_code: str = Field(..., alias="course.code")
    course_category: str = Field(..., alias="course.category")
    course_thumbnail: Optional[str] = None
    progress_percentage: int
    status: str
    status_display: str = Field(..., alias="get_status_display")
    completed_at: Optional[datetime] = None
    certificate_issued: bool
    enrolled_at: datetime

    @staticmethod
    def resolve_course_thumbnail(obj):
        return obj.course.thumbnail.url if obj.course and obj.course.thumbnail else None

    @staticmethod
    def resolve_enrolled_at(obj):
        return obj.enrolled_at


# ============================================================================
# AUTHENTICATED PORTAL ENDPOINTS
# ============================================================================

class StudentDashboardSchema(Schema):
    total_courses: int = 0
    current_gpa: Optional[float] = None
    current_cgpa: Optional[float] = None
    total_fees_paid: float = 0
    pending_fees: float = 0
    upcoming_events: List[dict] = []
    recent_results: List[StudentResultSchema] = []
    enrolled_courses: List[dict] = []
    cpd_enrollments: List[CPDEnrollmentSchema] = []


@auth_router.get("/student/dashboard", response=StudentDashboardSchema)
def student_dashboard(request):
    """Get student dashboard data"""
    if request.user.role != 'student':
        return StudentDashboardSchema()

    from django.db.models import Sum
    
    # Results
    results = StudentResult.objects.filter(student=request.user, is_published=True).order_by('-session', '-semester')
    current_result = results.first()
    
    # Fees
    payments = StudentFeePayment.objects.filter(student=request.user)
    total_paid = payments.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0
    pending = payments.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0
    
    # Enrolled courses
    enrolled = []
    for sc in StudentCourse.objects.filter(student=request.user, session__isnull=False).select_related('course')[:20]:
        enrolled.append({
            'id': sc.id,
            'course_code': sc.course.code,
            'course_title': sc.course.title,
            'credit_units': sc.course.credit_units,
            'total_score': float(sc.total_score) if sc.total_score else None,
            'grade': sc.grade,
            'attendance_percentage': float(sc.attendance_percentage) if sc.attendance_percentage else None,
        })
    
    # Upcoming events
    from content.models import Event
    from django.utils import timezone
    upcoming = Event.objects.filter(is_published=True, event_date__gte=timezone.now()).order_by('event_date')[:5]
    
    # CPD enrollments
    cpd_enrolls = CPDEnrollment.objects.filter(user=request.user).select_related('course')[:10]
    
    return {
        'total_courses': len(enrolled),
        'current_gpa': float(current_result.gpa) if current_result else None,
        'current_cgpa': float(current_result.cgpa) if current_result else None,
        'total_fees_paid': float(total_paid),
        'pending_fees': float(pending),
        'upcoming_events': [{
            'id': e.id,
            'title': e.title,
            'event_date': e.event_date.isoformat() if e.event_date else None,
            'location': e.location,
            'event_type': e.event_type,
        } for e in upcoming],
        'recent_results': [{
            'session': r.session,
            'semester': r.semester,
            'level': r.level,
            'gpa': float(r.gpa),
            'cgpa': float(r.cgpa),
            'academic_status': r.academic_status,
            'is_published': r.is_published,
        } for r in results[:5]],
        'enrolled_courses': enrolled,
        'cpd_enrollments': [CPDEnrollmentSchema.from_orm(e) for e in cpd_enrolls],
    }


# ============================================================================
# COURSE REGISTRATION SCHEMAS
# ============================================================================

class CourseRegistrationSchema(Schema):
    id: int
    academic_year: str
    semester: str
    level: int
    status: str
    total_credit_units: int
    remarks: str = ""
    submitted_at: Optional[datetime] = None
    advisor_approved_at: Optional[datetime] = None
    hod_approved_at: Optional[datetime] = None
    dean_approved_at: Optional[datetime] = None
    registered_at: Optional[datetime] = None
    advisor_name: Optional[str] = None
    hod_name: Optional[str] = None
    dean_name: Optional[str] = None
    created_at: datetime
    courses: List[dict] = []

    @staticmethod
    def resolve_advisor_name(obj):
        return obj.advisor.full_name if obj.advisor else None

    @staticmethod
    def resolve_hod_name(obj):
        return obj.hod.full_name if obj.hod else None

    @staticmethod
    def resolve_dean_name(obj):
        return obj.dean.full_name if obj.dean else None

    @staticmethod
    def resolve_courses(obj):
        from portals.models import RegistrationCourse
        return [{
            'id': rc.id,
            'course_id': rc.course.id,
            'course_code': rc.course.code,
            'course_title': rc.course.title,
            'credit_units': rc.course.credit_units,
            'is_compulsory': rc.is_compulsory,
            'approval_status': rc.approval_status,
            'rejection_reason': rc.rejection_reason,
        } for rc in RegistrationCourse.objects.filter(registration=obj).select_related('course')]


class AvailableCourseSchema(Schema):
    id: int
    code: str
    title: str
    credit_units: int
    level: int
    course_type: str
    semester: str
    capacity: int
    enrolled_count: int
    available_slots: int
    has_prerequisites_met: bool = True
    has_conflict: bool = False
    is_selected: bool = False


class AddCourseInput(Schema):
    course_id: int


class RegistrationActionInput(Schema):
    registration_id: int
    course_id: Optional[int] = None


class ApproveCourseInput(Schema):
    registration_id: int
    course_id: Optional[int] = None
    action: str = 'approved'  # approved / rejected
    rejection_reason: str = ""


# ============================================================================
# COURSE REGISTRATION ENDPOINTS
# ============================================================================

@auth_router.get("/student/registrations")
def list_registrations(request):
    """List all registrations for the authenticated student"""
    from portals.models import Registration
    regs = Registration.objects.filter(student=request.user).order_by('-academic_year', '-semester')
    return [CourseRegistrationSchema.from_orm(r).model_dump() for r in regs]


@auth_router.post("/student/registration/init")
def init_registration(request):
    """Create or get current registration for the student"""
    from portals.models import Registration
    from accounts.models import StudentProfile
    from django.utils import timezone
    now = timezone.now()

    profile = StudentProfile.objects.filter(user=request.user).first()
    if not profile:
        return {"error": "Student profile not found"}

    # Determine academic year and semester
    year = now.year
    academic_year = f"{year - 1}/{year}" if now.month < 9 else f"{year}/{year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    reg, created = Registration.objects.get_or_create(
        student=request.user,
        academic_year=academic_year,
        semester=semester,
        defaults={
            'level': profile.current_level,
            'status': 'draft',
        },
    )

    # Auto-load compulsory courses if new
    if created:
        from portals.services import RegistrationService
        svc = RegistrationService(reg)
        svc.load_compulsory_courses()

    return CourseRegistrationSchema.from_orm(reg)


@auth_router.get("/student/registration/current", response=CourseRegistrationSchema)
def current_registration(request):
    """Get the student's current registration"""
    from portals.models import Registration
    from django.utils import timezone
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    reg = Registration.objects.filter(
        student=request.user,
        academic_year=academic_year,
        semester=semester,
    ).first()

    if not reg:
        return Registration(
            id=0, academic_year=academic_year, semester=semester,
            level=0, status='none', total_credit_units=0, remarks='',
            created_at=now,
        )

    return CourseRegistrationSchema.from_orm(reg)


@auth_router.get("/student/registration/available-courses", response=List[AvailableCourseSchema])
def available_courses(request):
    """List courses available for the student's level and program"""
    from portals.models import Registration, RegistrationCourse
    from django.utils import timezone
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    profile = request.user.student_profile if hasattr(request.user, 'student_profile') else None
    if not profile:
        return []

    reg = Registration.objects.filter(
        student=request.user, academic_year=academic_year, semester=semester
    ).first()

    selected_course_ids = set()
    if reg:
        selected_course_ids = set(
            RegistrationCourse.objects.filter(registration=reg).values_list('course_id', flat=True)
        )

    from portals.models import StudentCourse
    courses = Course.objects.filter(
        level=profile.current_level,
        is_active=True,
    ).filter(
        Q(semester=semester) | Q(semester='both')
    ).prefetch_related('schedules', 'prerequisites')

    result = []
    for c in courses:
        prereqs_met = all(
            StudentCourse.objects.filter(
                student=request.user,
                course=prereq,
                grade__in=['A', 'B+', 'B', 'C+', 'C', 'D'],
            ).exists()
            for prereq in c.prerequisites.all()
        )

        has_conflict = False
        if reg:
            from portals.services import RegistrationService
            svc = RegistrationService(reg)
            has_conflict = len(svc.check_timetable_conflict(c)) > 0

        result.append({
            'id': c.id,
            'code': c.code,
            'title': c.title,
            'credit_units': c.credit_units,
            'level': c.level,
            'course_type': c.course_type,
            'semester': c.semester,
            'capacity': c.capacity,
            'enrolled_count': c.enrolled_count,
            'available_slots': c.available_slots,
            'has_prerequisites_met': prereqs_met,
            'has_conflict': has_conflict,
            'is_selected': c.id in selected_course_ids,
        })

    return result


@auth_router.post("/student/registration/add-course")
def add_course_to_registration(request, data: AddCourseInput):
    """Add a course to the current registration"""
    from portals.models import Registration
    from academics.models import Course
    from django.utils import timezone
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    reg = Registration.objects.filter(
        student=request.user, academic_year=academic_year, semester=semester, status='draft'
    ).first()
    if not reg:
        return {"error": "No active draft registration"}

    course = get_object_or_404(Course, id=data.course_id)

    from portals.services import RegistrationService, RegistrationError
    svc = RegistrationService(reg)
    try:
        svc.add_course(course)
        return {"message": f"{course.code} added successfully", "total_units": reg.total_credit_units}
    except RegistrationError as e:
        return {"error": str(e)}


@auth_router.post("/student/registration/remove-course")
def remove_course_from_registration(request, data: AddCourseInput):
    """Remove a course from the current registration"""
    from portals.models import Registration
    from academics.models import Course
    from django.utils import timezone
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    reg = Registration.objects.filter(
        student=request.user, academic_year=academic_year, semester=semester, status='draft'
    ).first()
    if not reg:
        return {"error": "No active draft registration"}

    course = get_object_or_404(Course, id=data.course_id)

    from portals.services import RegistrationService, RegistrationError
    svc = RegistrationService(reg)
    try:
        svc.remove_course(course)
        return {"message": f"{course.code} removed", "total_units": reg.total_credit_units}
    except RegistrationError as e:
        return {"error": str(e)}


@auth_router.post("/student/registration/submit")
def submit_registration(request):
    """Submit the current registration for approval"""
    from portals.models import Registration
    from django.utils import timezone
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    reg = Registration.objects.filter(
        student=request.user, academic_year=academic_year, semester=semester, status='draft'
    ).first()
    if not reg:
        return {"error": "No active draft registration"}

    course_count = reg.courses.count()
    if course_count == 0:
        return {"error": "Add at least one course before submitting"}

    from portals.services import RegistrationService
    svc = RegistrationService(reg)
    try:
        svc.submit()
        return {"message": "Registration submitted for review", "status": "submitted"}
    except Exception as e:
        return {"error": str(e)}


# ── Advisor Approval Endpoints ─────────────────────────────────


@auth_router.get("/advisor/pending-registrations", response=List[CourseRegistrationSchema])
def advisor_pending_registrations(request):
    """List registrations awaiting advisor approval"""
    from portals.models import Registration
    if request.user.role not in ('faculty', 'staff', 'admin'):
        return []

    return Registration.objects.filter(status='submitted').order_by('-submitted_at')


@auth_router.post("/advisor/approve-registration")
def advisor_approve_registration(request, data: RegistrationActionInput):
    """Approve a registration (advisor)"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import Registration
    reg = get_object_or_404(Registration, id=data.registration_id, status='submitted')

    from portals.services import RegistrationService
    svc = RegistrationService(reg)
    try:
        svc.approve_by_advisor(request.user)
        from portals.emails import notify_registration_approved
        notify_registration_approved(reg, 'Academic Advisor')
        return {"message": "Registration approved by advisor", "status": "advisor_approved"}
    except Exception as e:
        return {"error": str(e)}


@auth_router.post("/advisor/approve-course")
def advisor_approve_course(request, data: ApproveCourseInput):
    """Approve or reject a specific course within a registration"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import RegistrationCourse
    rc = get_object_or_404(
        RegistrationCourse,
        id=data.course_id,
        registration_id=data.registration_id,
    )

    rc.approval_status = data.action
    rc.approved_by = request.user
    if data.action == 'rejected':
        rc.rejection_reason = data.rejection_reason
    rc.save(update_fields=['approval_status', 'approved_by', 'rejection_reason'])

    if data.action == 'rejected':
        from portals.emails import notify_course_rejected
        notify_course_rejected(rc.registration, rc.course.code, data.rejection_reason)

    return {"message": f"Course {rc.course.code} {data.action}", "course_id": rc.id}


# ── HOD Approval Endpoints ─────────────────────────────────────


@auth_router.get("/hod/pending-registrations", response=List[CourseRegistrationSchema])
def hod_pending_registrations(request):
    """List registrations awaiting HOD approval"""
    from portals.models import Registration
    if request.user.role not in ('hod', 'faculty', 'staff', 'admin'):
        return []

    return Registration.objects.filter(status='advisor_approved').order_by('-advisor_approved_at')


@auth_router.post("/hod/approve-registration")
def hod_approve_registration(request, data: RegistrationActionInput):
    """Approve a registration (HOD)"""
    if request.user.role not in ('hod', 'faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import Registration
    reg = get_object_or_404(Registration, id=data.registration_id, status='advisor_approved')

    from portals.services import RegistrationService
    svc = RegistrationService(reg)
    try:
        svc.approve_by_hod(request.user)
        from portals.emails import notify_registration_approved
        notify_registration_approved(reg, 'Head of Department')
        return {"message": "Registration approved by HOD", "status": "hod_approved"}
    except Exception as e:
        return {"error": str(e)}


# ── Dean Approval Endpoints ────────────────────────────────────


@auth_router.get("/dean/pending-registrations", response=List[CourseRegistrationSchema])
def dean_pending_registrations(request):
    """List registrations awaiting Dean approval"""
    from portals.models import Registration
    if request.user.role not in ('dean', 'faculty', 'staff', 'admin'):
        return []

    return Registration.objects.filter(status='hod_approved').order_by('-hod_approved_at')


@auth_router.post("/dean/approve-registration")
def dean_approve_registration(request, data: RegistrationActionInput):
    """Approve a registration (Dean)"""
    if request.user.role not in ('dean', 'faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import Registration
    reg = get_object_or_404(Registration, id=data.registration_id, status='hod_approved')

    from portals.services import RegistrationService
    svc = RegistrationService(reg)
    try:
        svc.approve_by_dean(request.user)
        from portals.emails import notify_registration_approved
        notify_registration_approved(reg, 'Dean')
        return {"message": "Registration approved by Dean", "status": "dean_approved"}
    except Exception as e:
        return {"error": str(e)}


@auth_router.post("/dean/finalize-registration")
def dean_finalize_registration(request, data: RegistrationActionInput):
    """Finalize registration - create StudentCourse records"""
    if request.user.role not in ('dean', 'faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.models import Registration
    reg = get_object_or_404(Registration, id=data.registration_id, status='dean_approved')

    from portals.services import RegistrationService
    svc = RegistrationService(reg)
    try:
        created = svc.finalize()
        from portals.emails import notify_registration_finalized
        from portals.models import RegistrationCourse
        approved_courses = list(RegistrationCourse.objects.filter(
            registration=reg, approval_status='approved',
        ).select_related('course'))
        try:
            notify_registration_finalized(reg, len(approved_courses), approved_courses)
        except Exception:
            pass
        return {
            "message": f"Registration finalized. {created} courses enrolled.",
            "status": "registered",
            "courses_created": created,
        }
    except Exception as e:
        return {"error": str(e)}


class AlumniDashboardSchema(Schema):
    profile: Optional[dict] = None
    updates: List[dict] = []
    events: List[dict] = []
    featured: List[dict] = []
    sections: List[dict] = []
    networking_suggestions: List[dict] = []


@auth_router.get("/alumni/dashboard", response=AlumniDashboardSchema)
def alumni_dashboard(request):
    """Get alumni dashboard data"""
    from accounts.alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
    from django.utils import timezone

    profile = AlumniProfile.objects.filter(user=request.user).select_related('user', 'program').first()

    upcoming = AlumniEvent.objects.filter(event_date__gte=timezone.now()).order_by('event_date')[:5]
    recent = AlumniEvent.objects.order_by('-event_date')[:3]

    donations = AlumniDonation.objects.filter(donor=profile)
    total_donated = sum(d.amount for d in donations)

    other_alumni = AlumniProfile.objects.exclude(user=request.user).filter(
        allow_networking=True
    ).select_related('user')[:10]

    profile_dict = None
    if profile:
        profile_dict = {
            'grad_year': str(profile.graduation_year) if profile.graduation_year else None,
            'program': profile.program.title if profile.program else None,
            'current_role': profile.job_title or None,
            'organization': profile.current_employer or None,
            'location': 'Bayelsa, Nigeria',
            'bio': profile.professional_summary or '',
            'phone': request.user.phone or '',
        }

    updates = []
    if other_alumni.exists():
        updates.append({
            'title': 'Mentorship network expanded - new connections available',
            'date': 'Just now',
            'type': 'mentorship',
        })
    for e in recent:
        updates.append({
            'title': e.title,
            'date': e.event_date.strftime('%b %d, %Y'),
            'type': 'event',
        })

    events = [{
        'title': e.title,
        'date': e.event_date.strftime('%B %d, %Y'),
        'location': e.location or 'BMU Campus',
        'type': e.get_event_type_display(),
    } for e in upcoming]

    featured = [{
        'name': ap.user.full_name,
        'role': ap.job_title or 'Alumnus',
        'organization': ap.current_employer or 'BMU Alumnus',
        'year': str(ap.graduation_year),
    } for ap in other_alumni]

    alumni_count = AlumniProfile.objects.count()
    sections = [
        {'title': 'Alumni Directory', 'description': 'Connect with fellow graduates', 'count': str(alumni_count)},
        {'title': 'Events', 'description': 'Reunions & networking', 'count': str(AlumniEvent.objects.count())},
        {'title': 'Mentorship', 'description': 'Give back to students',
         'count': str(AlumniProfile.objects.filter(is_mentor=True).count()) if AlumniProfile.objects.filter(is_mentor=True).exists() else None},
        {'title': 'Job Board', 'description': 'Career opportunities', 'count': None},
        {'title': 'Transcripts', 'description': 'Request documents', 'count': None},
        {'title': 'Give Back', 'description': 'Support your alma mater', 'count': None},
    ]

    return {
        'profile': profile_dict,
        'updates': updates,
        'events': events,
        'featured': featured,
        'sections': sections,
        'networking_suggestions': [{
            'id': ap.user.id,
            'full_name': ap.user.full_name,
            'graduation_year': ap.graduation_year,
            'current_employer': ap.current_employer,
            'job_title': ap.job_title,
            'profile_image': ap.user.profile_image.url if ap.user.profile_image else None,
        } for ap in other_alumni],
    }


class DonationCreateSchema(Schema):
    amount: float
    purpose: Optional[str] = 'General Fund'
    category: Optional[str] = None
    is_anonymous: bool = False


@auth_router.post("/alumni/donate")
def alumni_donate(request, data: DonationCreateSchema):
    """Record an alumni donation (mock payment gateway in DEBUG)."""
    from accounts.alumni_models import AlumniProfile, AlumniDonation
    import secrets

    if request.user.role != 'alumni':
        return {"error": "Only alumni can donate"}

    profile = AlumniProfile.objects.filter(user=request.user).first()
    if not profile:
        return {"error": "Alumni profile not found"}

    if data.amount <= 0:
        return {"error": "Enter a valid donation amount"}

    purpose = (data.purpose or '').strip() or 'General Fund'

    donation = AlumniDonation.objects.create(
        donor=profile,
        amount=data.amount,
        currency='NGN',
        purpose=purpose,
        is_anonymous=data.is_anonymous,
        payment_method='card',
        payment_reference=f'DON-{secrets.token_hex(4).upper()}',
    )

    return {
        "message": "Thank you for your donation!",
        "donation_id": donation.id,
        "amount": float(donation.amount),
        "reference": donation.payment_reference,
    }


@auth_router.get("/alumni/donations")
def alumni_donations(request):
    """List the current alumni user's donations."""
    from accounts.alumni_models import AlumniProfile, AlumniDonation
    profile = AlumniProfile.objects.filter(user=request.user).first()
    if not profile:
        return []
    donations = AlumniDonation.objects.filter(donor=profile).select_related('donor', 'donor__user')
    return [{
        'id': d.id,
        'amount': float(d.amount),
        'currency': d.currency,
        'purpose': d.purpose or '',
        'is_anonymous': d.is_anonymous,
        'payment_reference': d.payment_reference,
        'donated_at': d.donated_at.isoformat(),
    } for d in donations]


@auth_router.get("/alumni/events", response=List[dict])
def alumni_events(request):
    """List alumni events"""
    from accounts.alumni_models import AlumniEvent
    from django.utils import timezone
    events = AlumniEvent.objects.filter(event_date__gte=timezone.now()).order_by('event_date')[:20]
    return [{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'event_date': e.event_date.isoformat() if e.event_date else None,
        'location': e.location,
        'event_type': e.event_type,
        'is_virtual': e.is_virtual,
        'virtual_link': e.virtual_link,
    } for e in events]


# ═══════════════════════════════════════════════════════════════
# LIBRARY CIRCULATION
# ═══════════════════════════════════════════════════════════════


class BookLoanSchema(Schema):
    id: int
    book_id: int
    book_title: str
    authors: str
    status: str
    status_display: str
    requested_at: datetime
    loaned_at: Optional[datetime] = None
    due_date: Optional[date] = None
    returned_at: Optional[datetime] = None
    renewed_count: int = 0
    is_overdue: bool = False


@auth_router.get("/library/my-loans", response=List[BookLoanSchema])
def my_book_loans(request):
    """List the current user's book loans"""
    from library.models import BookLoan
    from django.utils import timezone
    loans = BookLoan.objects.filter(student=request.user).select_related('book')[:50]
    result = []
    for loan in loans:
        overdue = (
            loan.status == 'borrowed'
            and loan.due_date is not None
            and loan.due_date < timezone.now().date()
        )
        result.append({
            'id': loan.id,
            'book_id': loan.book_id,
            'book_title': loan.book.title,
            'authors': loan.book.authors,
            'status': loan.status,
            'status_display': loan.get_status_display(),
            'requested_at': loan.requested_at,
            'loaned_at': loan.loaned_at,
            'due_date': loan.due_date,
            'returned_at': loan.returned_at,
            'renewed_count': loan.renewed_count,
            'is_overdue': overdue,
        })
    return result


@auth_router.post("/library/books/{book_id}/borrow")
def borrow_book(request, book_id: int):
    """Borrow a library book (creates a checkout record)"""
    if request.user.role not in ('student', 'alumni', 'staff', 'faculty'):
        return {"error": "Only students and staff can borrow books"}
    from library.models import Book, BookLoan
    from django.utils import timezone

    book = get_object_or_404(Book, id=book_id)

    active = BookLoan.objects.filter(
        student=request.user, book=book, status__in=['requested', 'borrowed'],
    ).first()
    if active:
        return {"error": f"You already have a loan for '{book.title}'", "loan_id": active.id}

    if book.available_copies <= 0:
        return {"error": f"'{book.title}' is currently unavailable - all copies are on loan"}

    book.available_copies -= 1
    book.save(update_fields=['available_copies'])

    loan = BookLoan.objects.create(
        book=book,
        student=request.user,
        status='borrowed',
        loaned_at=timezone.now(),
        due_date=timezone.now().date() + timezone.timedelta(days=BookLoan.LOAN_DAYS),
    )
    return {
        "message": f"'{book.title}' checked out successfully",
        "loan_id": loan.id,
        "due_date": loan.due_date.isoformat(),
    }


@auth_router.post("/library/loans/{loan_id}/return")
def return_book(request, loan_id: int):
    """Return a borrowed book"""
    from library.models import BookLoan
    from django.utils import timezone
    loan = get_object_or_404(BookLoan, id=loan_id, student=request.user)
    if loan.status not in ('borrowed', 'overdue'):
        return {"error": "Loan is not in an active borrowed state"}

    loan.status = 'returned'
    loan.returned_at = timezone.now()
    loan.save(update_fields=['status', 'returned_at'])

    loan.book.available_copies = min(loan.book.available_copies + 1, loan.book.total_copies)
    loan.book.save(update_fields=['available_copies'])

    return {"message": f"'{loan.book.title}' returned successfully", "loan_id": loan.id}


@auth_router.post("/library/loans/{loan_id}/renew")
def renew_book(request, loan_id: int):
    """Renew a borrowed book"""
    from library.models import BookLoan
    from django.utils import timezone
    loan = get_object_or_404(BookLoan, id=loan_id, student=request.user)
    if loan.status not in ('borrowed', 'overdue'):
        return {"error": "Loan is not in an active borrowed state"}
    if loan.renewed_count >= BookLoan.MAX_RENEWALS:
        return {"error": "Maximum renewals reached for this book"}

    new_due = (loan.due_date or timezone.now().date()) + timezone.timedelta(days=BookLoan.RENEW_DAYS)
    loan.due_date = new_due
    loan.renewed_count += 1
    loan.status = 'borrowed'
    loan.save(update_fields=['due_date', 'renewed_count', 'status'])

    return {
        "message": f"Loan renewed; new due date {new_due}",
        "due_date": new_due.isoformat(),
        "renewed_count": loan.renewed_count,
    }


# ═══════════════════════════════════════════════════════════════
# STUDENT PROFILE / CLEARANCE / HOSTEL
# ═══════════════════════════════════════════════════════════════


class StudentProfileUpdate(Schema):
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    state_of_origin: Optional[str] = None
    lga_of_origin: Optional[str] = None
    nationality: Optional[str] = None
    nok_full_name: Optional[str] = None
    nok_relationship: Optional[str] = None
    nok_phone: Optional[str] = None
    nok_email: Optional[str] = None
    nok_address: Optional[str] = None


@auth_router.get("/student/profile")
def get_student_profile(request):
    """Get the authenticated student's profile data."""
    if request.user.role != 'student':
        return {"error": "Only students can access this endpoint"}
    from accounts.models import StudentProfile
    profile = StudentProfile.objects.filter(user=request.user).first()
    return {
        'user': {
            'full_name': request.user.full_name,
            'email': request.user.email,
            'phone': request.user.phone or '',
            'student_id': request.user.student_id or '',
            'program': request.user.program.title if request.user.program else '',
            'address': request.user.address or '',
            'city': request.user.city or '',
            'state': request.user.state or '',
            'profile_image': request.user.profile_image.url if request.user.profile_image else None,
        },
        'profile': {
            'matric_number': profile.matric_number if profile else '',
            'current_level': profile.current_level if profile else 100,
            'current_semester': profile.current_semester if profile else 'first',
            'admission_type': profile.admission_type if profile else '',
            'entry_mode': profile.entry_mode if profile else '',
            'admission_date': profile.admission_date.isoformat() if profile and profile.admission_date else None,
            'state_of_origin': profile.state_of_origin if profile else '',
            'lga_of_origin': profile.lga_of_origin if profile else '',
            'nationality': profile.nationality if profile else '',
            'nok_full_name': profile.nok_full_name if profile else '',
            'nok_relationship': profile.nok_relationship if profile else '',
            'nok_phone': profile.nok_phone if profile else '',
            'nok_email': profile.nok_email if profile else '',
            'nok_address': profile.nok_address if profile else '',
        },
    }


@auth_router.put("/student/profile")
def update_student_profile(request, data: StudentProfileUpdate):
    """Update the authenticated student's profile data."""
    if request.user.role != 'student':
        return {"error": "Only students can access this endpoint"}
    from accounts.models import StudentProfile

    profile, _ = StudentProfile.objects.get_or_create(user=request.user, defaults={'current_level': 100})

    payload = data.model_dump(exclude_unset=True)

    if 'phone' in payload and payload.get('phone') is not None:
        request.user.phone = payload['phone']
    for f in ('address', 'city', 'state'):
        if f in payload and payload.get(f) is not None:
            setattr(request.user, f, payload[f])
    if any(f in payload for f in ('address', 'city', 'state')) or 'phone' in payload:
        request.user.save()

    for f in ('state_of_origin', 'lga_of_origin', 'nationality',
              'nok_full_name', 'nok_relationship', 'nok_phone', 'nok_email', 'nok_address'):
        if f in payload and payload.get(f) is not None:
            setattr(profile, f, payload[f])
    profile.save()

    return {"message": "Profile updated successfully"}


@auth_router.get("/student/clearance")
def student_clearance(request):
    """Compute the student's graduation/session clearance checklist from live data."""
    from django.utils import timezone
    from portals.services import FeeService
    from accounts.models import StudentProfile

    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    semester = 'first' if now.month < 9 else 'second'

    profile = StudentProfile.objects.filter(user=request.user).first()
    from portals.models import Registration, StudentResult
    from library.models import BookLoan

    reg = Registration.objects.filter(student=request.user, academic_year=academic_year, semester=semester).first()
    results = StudentResult.objects.filter(student=request.user, is_published=True).exists()
    fees_clear = FeeService.is_fee_clear(request.user, academic_year, semester)
    active_loans = BookLoan.objects.filter(student=request.user, status__in=['borrowed', 'overdue']).exists()

    def item(title, done, detail):
        return {'title': title, 'status': 'complete' if done else 'pending', 'detail': detail}

    items = [
        item('Student Profile Completed', bool(profile and profile.matric_number),
             f"Matric: {profile.matric_number if profile and profile.matric_number else 'Not set'}"),
        item('Fees Cleared', fees_clear, f"{academic_year} {semester} semester"),
        item('Course Registration', bool(reg and reg.status in ('submitted', 'advisor_approved', 'hod_approved', 'dean_approved', 'registered')),
             f"{reg.get_status_display() if reg else 'No registration for current session'}"),
        item('Results Published', results, 'At least one published result found'),
        item('Library Records Clear', not active_loans, 'No overdue or active book loans'),
    ]

    return {
        'academic_year': academic_year,
        'semester': semester,
        'completed': sum(1 for i in items if i['status'] == 'complete'),
        'total': len(items),
        'items': items,
    }


@auth_router.get("/student/hostel")
def student_hostel(request):
    """Get the student's hostel allocation for the current session."""
    from django.utils import timezone
    from portals.models import HostelAllocation
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"
    allocation = HostelAllocation.objects.filter(
        student=request.user, session=academic_year,
    ).first()
    return {
        'session': academic_year,
        'allocation': {
            'id': allocation.id,
            'hostel_name': allocation.hostel_name,
            'room_number': allocation.room_number,
            'bed_space': allocation.bed_space,
            'status': allocation.status,
            'status_display': allocation.get_status_display(),
            'requested_at': allocation.requested_at.isoformat(),
            'allocated_at': allocation.allocated_at.isoformat() if allocation.allocated_at else None,
        } if allocation else None,
    }


class HostelRequestInput(Schema):
    hostel_name: str


@auth_router.post("/student/hostel/request")
def request_hostel(request, data: HostelRequestInput):
    """Request hostel accommodation for the current session."""
    from django.utils import timezone
    from portals.models import HostelAllocation
    now = timezone.now()
    academic_year = f"{now.year - 1}/{now.year}" if now.month < 9 else f"{now.year}/{now.year + 1}"

    existing = HostelAllocation.objects.filter(
        student=request.user, session=academic_year, status__in=['pending', 'allocated'],
    ).first()
    if existing:
        return {"error": f"You already have a {existing.get_status_display().lower()} hostel request", "id": existing.id}

    allocation = HostelAllocation.objects.create(
        student=request.user,
        session=academic_year,
        hostel_name=data.hostel_name.strip(),
        status='pending',
    )
    return {
        "message": "Hostel request submitted successfully",
        "id": allocation.id,
        "status": allocation.status,
    }


@auth_router.post("/student/hostel/{allocation_id}/cancel")
def cancel_hostel(request, allocation_id: int):
    """Cancel a pending hostel request."""
    from portals.models import HostelAllocation
    allocation = get_object_or_404(HostelAllocation, id=allocation_id, student=request.user)
    if allocation.status != 'pending':
        return {"error": "Only pending requests can be cancelled"}
    allocation.status = 'cancelled'
    allocation.save(update_fields=['status'])
    return {"message": "Hostel request cancelled"}


class CPDEnrollmentCreateSchema(Schema):
    course_id: int


@auth_router.post("/cpd/enroll", response=CPDEnrollmentSchema)
def cpd_enroll(request, data: CPDEnrollmentCreateSchema):
    """Enroll in a CPD course"""
    course = get_object_or_404(CPDCourse, id=data.course_id)
    enrollment, created = CPDEnrollment.objects.get_or_create(
        user=request.user,
        course=course,
        defaults={'status': 'enrolled'}
    )
    if created:
        course.enrolled_count += 1
        course.save(update_fields=['enrolled_count'])
    return enrollment


@auth_router.get("/cpd/enrollments", response=List[CPDEnrollmentSchema])
def cpd_enrollments(request):
    """Get current user's CPD enrollments"""
    return CPDEnrollment.objects.filter(user=request.user).select_related('course').order_by('-enrolled_at')


# ============================================================================
# APPLICANT PORTAL ENDPOINTS
# ============================================================================

@auth_router.get("/applicant/applications", response=List[dict])
def applicant_applications(request):
    """Get current user's applications"""
    from admissions.models import Application
    apps = Application.objects.filter(applicant=request.user).order_by('-submitted_at')[:10]
    return [{
        'id': a.id,
        'first_name': a.first_name,
        'last_name': a.last_name,
        'program_title': a.program.title if a.program else None,
        'status': a.status,
        'progress_percentage': a.progress_percentage,
        'payment_status': a.payment_status,
        'submitted_at': a.submitted_at.isoformat() if a.submitted_at else None,
    } for a in apps]


# ============================================================================
# ADMIN DASHBOARD ENDPOINTS
# ============================================================================

class AdminDashboardSchema(Schema):
    total_users: int = 0
    total_students: int = 0
    total_faculty: int = 0
    total_staff: int = 0
    total_applications: int = 0
    pending_applications: int = 0
    total_events: int = 0
    total_news: int = 0
    total_programs: int = 0
    total_colleges: int = 0
    recent_applications: List[dict] = []
    recent_enquiries: List[dict] = []


@auth_router.get("/admin/dashboard", response=AdminDashboardSchema)
def admin_dashboard(request):
    """Get admin dashboard stats"""
    if not request.user.is_authenticated or request.user.role not in ('admin', 'staff'):
        return AdminDashboardSchema()
    
    from admissions.models import Application
    from content.models import ContactEnquiry
    
    return {
        'total_users': User.objects.count(),
        'total_students': User.objects.filter(role='student', is_active=True).count(),
        'total_faculty': User.objects.filter(role='faculty', is_active=True).count(),
        'total_staff': User.objects.filter(role='staff', is_active=True).count(),
        'total_applications': Application.objects.count(),
        'pending_applications': Application.objects.filter(status='submitted').count(),
        'total_events': Event.objects.count(),
        'total_news': NewsItem.objects.count(),
        'total_programs': Program.objects.count(),
        'total_colleges': College.objects.count(),
        'recent_applications': [{
            'id': a.id,
            'name': f"{a.first_name} {a.last_name}",
            'program': a.program.title if a.program else '',
            'status': a.status,
            'submitted_at': a.submitted_at.isoformat() if a.submitted_at else None,
        } for a in Application.objects.order_by('-submitted_at')[:10]],
        'recent_enquiries': [{
            'id': e.id,
            'name': e.name,
            'subject': e.get_subject_display(),
            'status': e.status,
            'created_at': e.created_at.isoformat(),
        } for e in ContactEnquiry.objects.order_by('-created_at')[:10]],
    }


# ═══════════════════════════════════════════════════════════════
# GRADE & RESULT MANAGEMENT ENDPOINTS
# ═══════════════════════════════════════════════════════════════

class CourseResultSchema(Schema):
    id: int
    student_id: int
    student_name: str = ''
    matric_number: str = ''
    course_id: int
    course_code: str = ''
    course_title: str = ''
    credit_units: int = 0
    assignment_score: Optional[float] = None
    exam_score: Optional[float] = None
    total_score: Optional[float] = None
    grade: str = ''
    grade_point: Optional[float] = None
    result_status: str = 'draft'
    attendance_percentage: Optional[float] = None

    @staticmethod
    def resolve_student_name(obj):
        return getattr(obj, 'student_name', '') or (obj.student.full_name if hasattr(obj, 'student') else '')

    @staticmethod
    def resolve_matric_number(obj):
        if hasattr(obj, 'matric_number') and obj.matric_number:
            return obj.matric_number
        p = getattr(getattr(obj, 'student', None), 'student_profile', None)
        return p.matric_number if p else ''

    @staticmethod
    def resolve_course_code(obj):
        return getattr(obj, 'course_code', '') or (obj.course.code if hasattr(obj, 'course') else '')

    @staticmethod
    def resolve_course_title(obj):
        return getattr(obj, 'course_title', '') or (obj.course.title if hasattr(obj, 'course') else '')

    @staticmethod
    def resolve_credit_units(obj):
        return getattr(obj, 'credit_units', 0) or (obj.course.credit_units if hasattr(obj, 'course') else 0)


class GradeInputSchema(Schema):
    student_id: int
    assignment_score: Optional[float] = None
    exam_score: Optional[float] = None
    attendance_percentage: Optional[float] = None


class GradeUploadSchema(Schema):
    session: str
    semester: str
    course_id: int
    scores: List[GradeInputSchema]


class ResultApprovalSchema(Schema):
    student_course_ids: List[int]
    rejection_reason: str = ''


class StudentResultDetailSchema(Schema):
    session: str
    semester: str
    level: int
    gpa: float
    cgpa: float
    academic_status: str
    is_published: bool
    courses: List[CourseResultSchema] = []
    carryover: List[dict] = []


# ── Lecturer: list courses with students for grade entry ──────

@auth_router.get("/lecturer/courses/students", response=List[CourseResultSchema])
def lecturer_course_students(request, session: str, semester: str, course_id: int):
    """List students enrolled in a course for grade entry (lecturer view)"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        return []
    students = StudentCourse.objects.filter(
        session=session, semester=semester, course_id=course_id,
    ).select_related('student', 'course', 'student__student_profile')
    return students


# ── Lecturer: save/scores grades ──────────────────────────────

@auth_router.post("/lecturer/grades/save")
def lecturer_save_grades(request, data: GradeUploadSchema):
    """Save assignment/exam scores for a batch of students (draft)"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    updated = 0
    for entry in data.scores:
        sc = StudentCourse.objects.filter(
            session=data.session, semester=data.semester,
            course_id=data.course_id, student_id=entry.student_id,
        ).first()
        if not sc:
            continue
        sc.assignment_score = entry.assignment_score
        sc.exam_score = entry.exam_score
        sc.attendance_percentage = entry.attendance_percentage
        from portals.services import GradeService
        sc = GradeService.update_course_result(sc)
        sc.save(update_fields=['assignment_score', 'exam_score', 'total_score', 'grade', 'grade_point', 'attendance_percentage'])
        updated += 1

    return {'saved': updated, 'message': f'{updated} grades saved as draft'}


# ── Lecturer: submit grades for approval ──────────────────────

@auth_router.post("/lecturer/grades/submit")
def lecturer_submit_grades(request, data: GradeUploadSchema):
    """Submit grades for HOD approval"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    from django.utils import timezone
    updated = 0
    for entry in data.scores:
        sc = StudentCourse.objects.filter(
            session=data.session, semester=data.semester,
            course_id=data.course_id, student_id=entry.student_id,
        ).first()
        if not sc:
            continue
        sc.assignment_score = entry.assignment_score
        sc.exam_score = entry.exam_score
        sc.attendance_percentage = entry.attendance_percentage
        from portals.services import GradeService
        sc = GradeService.update_course_result(sc)
        sc.result_status = 'submitted'
        sc.submitted_by = request.user
        sc.submitted_at = timezone.now()
        sc.save()
        updated += 1

    return {'submitted': updated, 'message': f'{updated} grades submitted for HOD approval'}


# ── Lecturer: list courses I teach ────────────────────────────

@auth_router.get("/lecturer/courses", response=List[dict])
def lecturer_courses(request, session: str, semester: str):
    """List courses the lecturer teaches via their schedule assignments"""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        return []
    from academics.models import CourseSchedule, Course
    from portals.models import StudentCourse
    sched_course_ids = list(CourseSchedule.objects.filter(
        instructor=request.user,
    ).values_list('course_id', flat=True).distinct())
    enrolled_course_ids = list(StudentCourse.objects.filter(
        session=session, semester=semester,
    ).values_list('course_id', flat=True).distinct())
    course_ids = sched_course_ids if sched_course_ids else enrolled_course_ids
    courses = Course.objects.filter(id__in=course_ids, is_active=True)
    return [{'id': c.id, 'code': c.code, 'title': c.title, 'credit_units': c.credit_units} for c in courses]


# ── HOD: pending result approvals ─────────────────────────────

class PendingResultSchema(Schema):
    student_course_id: int
    student_name: str = ''
    matric_number: str = ''
    course_code: str = ''
    course_title: str = ''
    assignment_score: Optional[float] = None
    exam_score: Optional[float] = None
    total_score: Optional[float] = None
    grade: str = ''

    @staticmethod
    def resolve_student_name(obj):
        return obj.student.full_name

    @staticmethod
    def resolve_matric_number(obj):
        p = getattr(obj.student, 'student_profile', None)
        return p.matric_number if p else ''

    @staticmethod
    def resolve_course_code(obj):
        return obj.course.code

    @staticmethod
    def resolve_course_title(obj):
        return obj.course.title


@auth_router.get("/hod/pending-results", response=List[PendingResultSchema])
def hod_pending_results(request, session: str, semester: str, course_id: Optional[int] = None):
    """List results awaiting HOD approval"""
    if request.user.role not in ('faculty', 'staff', 'admin', 'hod'):
        return []
    qs = StudentCourse.objects.filter(
        result_status='submitted', session=session, semester=semester,
    )
    if course_id:
        qs = qs.filter(course_id=course_id)
    qs = qs.select_related('student', 'course', 'student__student_profile')
    return qs


def _notify_submitting_lecturers(student_course_ids, rejection_reason, author_label):
    """Email the lecturers who submitted the rejected result rows (never raises)."""
    try:
        from portals.models import StudentCourse
        from portals.emails import notify_results_rejected
        rows = list(StudentCourse.objects.filter(id__in=student_course_ids)
                    .exclude(submitted_by=None)
                    .select_related('submitted_by', 'course', 'student'))
        if not rows:
            return
        sample = rows[0]
        by_lecturer = {}
        for row in rows:
            by_lecturer.setdefault(row.submitted_by, []).append(row)
        for lecturer, lst in by_lecturer.items():
            notify_results_rejected(
                recipient=lecturer.email,
                student_name=lst[0].student.full_name,
                course_codes=sorted({r.course.code for r in lst}),
                data=types.SimpleNamespace(
                    session=sample.session,
                    semester=sample.semester,
                    rejection_reason=rejection_reason,
                ),
                author_label=author_label,
            )
    except Exception:
        pass


@auth_router.post("/hod/approve-results")
def hod_approve_results(request, data: ResultApprovalSchema):
    """HOD approves/rejects submitted results"""
    if request.user.role not in ('faculty', 'staff', 'admin', 'hod'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from django.utils import timezone
    if data.rejection_reason:
        # Rejection: move to 'rejected' (lecturer can correct + resubmit)
        updated = StudentCourse.objects.filter(
            id__in=data.student_course_ids, result_status='submitted'
        ).update(
            result_status='rejected',
            rejection_reason=data.rejection_reason,
        )
        _notify_submitting_lecturers(data.student_course_ids, data.rejection_reason, 'Head of Department')
        return {'rejected': updated, 'message': f'{updated} results rejected'}
    updated = StudentCourse.objects.filter(
        id__in=data.student_course_ids, result_status='submitted'
    ).update(
        result_status='hod_approved',
        hod_approved_by=request.user,
        hod_approved_at=timezone.now(),
        rejection_reason='',
    )
    return {'approved': updated, 'message': f'{updated} results approved'}


# ── Dean: pending result approvals ────────────────────────────

@auth_router.get("/dean/pending-results", response=List[PendingResultSchema])
def dean_pending_results(request, session: str, semester: str, course_id: Optional[int] = None):
    """List results awaiting Dean approval"""
    if request.user.role not in ('faculty', 'staff', 'admin', 'dean'):
        return []
    qs = StudentCourse.objects.filter(
        result_status='hod_approved', session=session, semester=semester,
    )
    if course_id:
        qs = qs.filter(course_id=course_id)
    qs = qs.select_related('student', 'course', 'student__student_profile')
    return qs


@auth_router.post("/dean/approve-results")
def dean_approve_results(request, data: ResultApprovalSchema):
    """Dean approves/rejects HOD-approved results"""
    if request.user.role not in ('faculty', 'staff', 'admin', 'dean'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from django.utils import timezone
    if data.rejection_reason:
        updated = StudentCourse.objects.filter(
            id__in=data.student_course_ids, result_status='hod_approved'
        ).update(
            result_status='rejected',
            rejection_reason=data.rejection_reason,
        )
        _notify_submitting_lecturers(data.student_course_ids, data.rejection_reason, 'Dean')
        return {'rejected': updated, 'message': f'{updated} results rejected'}
    updated = StudentCourse.objects.filter(
        id__in=data.student_course_ids, result_status='hod_approved'
    ).update(
        result_status='dean_approved',
        dean_approved_by=request.user,
        dean_approved_at=timezone.now(),
        rejection_reason='',
    )
    return {'approved': updated, 'message': f'{updated} results approved'}


# ── Senate / Admin: final approval ────────────────────────────

@auth_router.get("/admin/pending-senate-results", response=List[PendingResultSchema])
def senate_pending_results(request, session: str, semester: str, course_id: Optional[int] = None):
    """List results awaiting Senate approval"""
    if request.user.role not in ('admin', 'staff'):
        return []
    qs = StudentCourse.objects.filter(
        result_status='dean_approved', session=session, semester=semester,
    )
    if course_id:
        qs = qs.filter(course_id=course_id)
    qs = qs.select_related('student', 'course', 'student__student_profile')
    return qs


@auth_router.post("/admin/senate-approve-results")
def senate_approve_results(request, data: ResultApprovalSchema):
    """Senate gives final approval to results"""
    if request.user.role not in ('admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from django.utils import timezone
    if data.rejection_reason:
        updated = StudentCourse.objects.filter(
            id__in=data.student_course_ids, result_status='dean_approved'
        ).update(
            result_status='rejected',
            rejection_reason=data.rejection_reason,
        )
        _notify_submitting_lecturers(data.student_course_ids, data.rejection_reason, 'Senate')
        return {'rejected': updated, 'message': f'{updated} results rejected'}
    updated = StudentCourse.objects.filter(
        id__in=data.student_course_ids, result_status='dean_approved'
    ).update(
        result_status='senate_approved',
        senate_approved_by=request.user,
        senate_approved_at=timezone.now(),
        rejection_reason='',
    )
    return {'approved': updated, 'message': f'{updated} results senate-approved'}


# ── Batch publish after senate approval ───────────────────────

class BatchPublishSchema(Schema):
    session: str
    semester: str
    student_ids: Optional[List[int]] = None


@auth_router.post("/admin/batch-publish-results")
def batch_publish_results(request, data: BatchPublishSchema):
    """Compute GPA/CGPA and publish results for all students in a session/semester"""
    if request.user.role not in ('admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    from portals.services import GpaService
    students = StudentCourse.objects.filter(
        session=data.session, semester=data.semester,
        result_status__in=['senate_approved', 'published'],
    ).values_list('student_id', flat=True).distinct()

    if data.student_ids:
        students = [s for s in students if s in data.student_ids]

    published = 0
    for sid in students:
        from accounts.models import User
        student = User.objects.get(id=sid)
        GpaService.publish_semester_results(student, data.session, data.semester, approved_by=request.user)
        published += 1

    return {'published': published, 'message': f'{published} student results published'}


# ── Student: view detailed results with course breakdown ──────

@auth_router.get("/student/results/detail", response=List[StudentResultDetailSchema])
def student_results_detail(request):
    """Get detailed results with per-course breakdown and carryover info"""
    if request.user.role != 'student':
        return []

    from portals.services import GpaService
    results = StudentResult.objects.filter(student=request.user, is_published=True).order_by('-session', '-semester')
    detail = []
    for r in results:
        courses = StudentCourse.objects.filter(
            student=request.user, session=r.session, semester=r.semester,
            is_published=True,
        ).select_related('course')
        carryover = GpaService.detect_carryover(request.user, r.session, r.semester)
        detail.append({
            'session': r.session,
            'semester': r.semester,
            'level': r.level,
            'gpa': float(r.gpa),
            'cgpa': float(r.cgpa),
            'academic_status': r.academic_status,
            'is_published': r.is_published,
            'courses': [{
                'id': sc.id,
                'student_id': sc.student_id,
                'student_name': sc.student.full_name,
                'matric_number': getattr(getattr(sc.student, 'student_profile', None), 'matric_number', ''),
                'course_id': sc.course_id,
                'course_code': sc.course.code,
                'course_title': sc.course.title,
                'credit_units': sc.course.credit_units,
                'assignment_score': float(sc.assignment_score) if sc.assignment_score else None,
                'exam_score': float(sc.exam_score) if sc.exam_score else None,
                'total_score': float(sc.total_score) if sc.total_score else None,
                'grade': sc.grade,
                'grade_point': float(sc.grade_point) if sc.grade_point else None,
                'result_status': sc.result_status,
                'attendance_percentage': float(sc.attendance_percentage) if sc.attendance_percentage else None,
            } for sc in courses],
            'carryover': carryover,
        })
    return detail


# ── Student: check carryover status ───────────────────────────

@auth_router.get("/student/carryover")
def student_carryover(request):
    """Get all carryover courses for the student"""
    if request.user.role != 'student':
        return []
    from portals.services import GpaService
    results = StudentResult.objects.filter(student=request.user, is_published=True)
    all_carryover = []
    for r in results:
        carryover = GpaService.detect_carryover(request.user, r.session, r.semester)
        all_carryover.extend(carryover)
    return all_carryover


# --- Application / Admissions Endpoints ---

class SubjectSchema(Schema):
    subject: str
    grade: str

class AcademicRecordSchema(Schema):
    institution: str
    qualification: str
    year_of_completion: int
    grade: Optional[str] = None
    subjects: Optional[List[SubjectSchema]] = None

def _optional_auth_user(request):
    """Resolve a signed-in user on public endpoints.

    ``public_api`` is registered without an auth class, so ``request.user`` is
    always anonymous there even when the client sends a Bearer token. Endpoints
    that attach submitted records to an account resolve the user here so a
    logged-in applicant's submission lands on their profile.
    """
    user = getattr(request, 'user', None)
    if user is not None and getattr(user, 'is_authenticated', False):
        return user
    header = request.META.get('HTTP_AUTHORIZATION', '')
    if not header.startswith('Bearer '):
        return None
    token = header.split(' ', 1)[1].strip()
    try:
        from ninja_auth import JWTAuth
        return JWTAuth().authenticate(request, token)
    except Exception:
        return None


class ApplicationSubmitSchema(Schema):
    first_name: str
    last_name: str
    email: str
    phone: str
    date_of_birth: str = ''
    gender: str = ''
    address: str = ''
    nationality: str = ''
    state_of_origin: str = ''
    lga: str = ''
    program_id: int
    student_type: str = 'LOCAL'
    academic_records: Optional[List[AcademicRecordSchema]] = None

class ApplicationStatusSchema(Schema):
    id: str
    public_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    program: str
    student_type: str
    status: str
    status_display: str
    progress_percentage: int
    payment_status: str
    submitted_at: Optional[str] = None

@public_router.post("/applications", response=ApplicationStatusSchema)
@ratelimit('application_submit', limit=5, window=60)
def submit_application(request, data: ApplicationSubmitSchema):
    """Submit a new application (creates a draft)"""
    from admissions.models import Application
    from academics.models import Program

    program = get_object_or_404(Program, id=data.program_id, is_active=True)
    if not program.applications_open:
        raise HttpError(400, "Applications for this program are currently closed.")

    from django.utils import timezone
    app = Application.objects.create(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        program=program,
        student_type=data.student_type,
        status='submitted',
        progress_percentage=30,
        submitted_at=timezone.now(),
        date_of_birth=data.date_of_birth or '2000-01-01',
        gender=data.gender or 'other',
        address=data.address or '',
        nationality=data.nationality or '',
        state_of_origin=data.state_of_origin or '',
        lga=data.lga or '',
        previous_institution='',
        payment_currency='NGN',
        applicant=_optional_auth_user(request),
    )

    for record_data in (data.academic_records or []):
        from admissions.models import AcademicRecord
        subjects_list = None
        if record_data.subjects:
            subjects_list = [{'subject': s.subject, 'grade': s.grade} for s in record_data.subjects]
        AcademicRecord.objects.create(
            application=app,
            type=record_data.qualification,
            institution_name=record_data.institution,
            year_of_completion=record_data.year_of_completion,
            grade=record_data.grade or '',
            subjects=subjects_list,
        )

    from admissions.emails import notify_application_submitted
    notify_application_submitted(app)

    return {
        'id': app.id,
        'public_id': str(app.public_id),
        'first_name': app.first_name,
        'last_name': app.last_name,
        'email': app.email,
        'phone': app.phone,
        'program': app.program.title,
        'student_type': app.student_type,
        'status': app.status,
        'status_display': app.get_status_display(),
        'progress_percentage': app.progress_percentage,
        'payment_status': 'pending',
        'submitted_at': app.submitted_at.isoformat() if app.submitted_at else None,
    }

@public_router.get("/applications/{application_id}/status", response=ApplicationStatusSchema)
@ratelimit('application_status', limit=30, window=60)
def get_application_status(request, application_id: str):
    """Check application status.

    Accepts the unguessable ``public_id`` (UUID) and returns full details.
    Legacy sequential IDs (BMU-YYYY-XXXX) are still honoured for old email
    links but return only non-sensitive status fields — those IDs are
    enumerable and must never expose applicant PII.
    """
    import uuid as uuid_lib
    from admissions.models import Application
    from ninja.errors import HttpError

    app = None
    expose_pii = False
    try:
        pid = uuid_lib.UUID(str(application_id))
        app = Application.objects.filter(public_id=pid).first()
        expose_pii = app is not None
    except (ValueError, AttributeError, TypeError):
        pass
    if app is None:
        app = Application.objects.filter(id=application_id).first()
    if app is None:
        raise HttpError(404, 'Application not found')

    status_display = dict(Application.STATUS_CHOICES).get(app.status, app.status)
    payload = {
        'id': app.id,
        'public_id': str(app.public_id),
        'program': app.program.title,
        'student_type': app.student_type,
        'status': app.status,
        'status_display': status_display,
        'progress_percentage': app.progress_percentage,
        'payment_status': app.payment_status,
        'submitted_at': app.submitted_at.isoformat() if app.submitted_at else None,
    }
    if expose_pii:
        payload.update({
            'first_name': app.first_name,
            'last_name': app.last_name,
            'email': app.email,
            'phone': app.phone,
        })
    return payload


def _public_accepted_application(application_id: str):
    """Resolve an accepted application from its unguessable public_id (UUID).

    Only the public_id is accepted: the sequential BMU id is enumerable and
    must never authorise a document download.
    """
    import uuid as uuid_lib
    from admissions.models import Application
    from ninja.errors import HttpError

    try:
        pid = uuid_lib.UUID(str(application_id))
    except (ValueError, AttributeError, TypeError):
        raise HttpError(404, 'Application not found')
    app = Application.objects.filter(public_id=pid).first()
    if app is None:
        raise HttpError(404, 'Application not found')
    if app.status != 'accepted':
        raise HttpError(409, 'The admission letter is only available after an offer of admission has been made.')
    return app


@public_router.get("/applications/{application_id}/success-letter")
@ratelimit('application_letter', limit=20, window=60)
def get_success_letter(request, application_id: str):
    """Download the provisional letter of admission (A4 PDF) for an accepted application."""
    from admissions import documents
    return documents.success_letter_response(_public_accepted_application(application_id))


@public_router.get("/applications/{application_id}/oath-form")
@ratelimit('application_oath', limit=20, window=60)
def get_oath_form(request, application_id: str):
    """Download the statutory declaration / matriculation oath form (A4 PDF)."""
    from admissions import documents
    return documents.oath_form_response(_public_accepted_application(application_id))


DOCUMENT_TYPE_CHOICES = [
    'passport_photo', 'birth_certificate', 'academic_transcripts',
    'certificate_of_origin', 'english_proficiency', 'reference_letters', 'other',
]


@public_router.post("/applications/{application_id}/documents")
@ratelimit('application_doc', limit=15, window=60)
def upload_application_document(request, application_id: str):
    """Upload a document for an existing application (public, no auth).

    Only accepts the unguessable public_id (UUID) — the sequential
    application ID is enumerable and must not authorise uploads.
    """
    import uuid as uuid_lib
    from admissions.models import Application, ApplicationDocument
    from ninja.errors import HttpError

    try:
        pid = uuid_lib.UUID(str(application_id))
    except (ValueError, AttributeError, TypeError):
        raise HttpError(404, 'Application not found')
    app = Application.objects.filter(public_id=pid).first()
    if app is None:
        raise HttpError(404, 'Application not found')
    document_type = request.POST.get('document_type', 'other')
    uploaded_file = request.FILES.get('file')

    if not uploaded_file:
        from django.http import JsonResponse
        return JsonResponse({'error': 'No file provided'}, status=400)

    if document_type not in DOCUMENT_TYPE_CHOICES:
        from django.http import JsonResponse
        return JsonResponse({'error': f'Invalid document type: {document_type}'}, status=400)

    doc = ApplicationDocument.objects.create(
        application=app,
        name=document_type,
        file=uploaded_file,
    )

    return {
        'id': doc.id,
        'name': doc.name,
        'file_url': doc.file.url,
        'status': doc.status,
    }


# ═══════════════════════════════════════════════════════════════
# PHASE 4: PROGRESSION ENGINE
# ═══════════════════════════════════════════════════════════════

class ProgressionResultSchema(Schema):
    id: int
    student_id: int
    student_name: str = ''
    matric_number: str = ''
    session: str
    from_level: int
    to_level: int
    decision: str
    reason: str
    gpa: Optional[float] = None
    cgpa: Optional[float] = None
    carryover_units: int = 0
    total_units: int = 0
    is_reviewed: bool = False
    processed_at: Optional[str] = None

    @staticmethod
    def resolve_processed_at(obj):
        return obj.processed_at.isoformat() if obj.processed_at else None

    @staticmethod
    def resolve_student_name(obj):
        return obj.student.full_name

    @staticmethod
    def resolve_matric_number(obj):
        p = getattr(obj.student, 'student_profile', None)
        return p.matric_number if p else ''


@auth_router.post("/admin/progression/evaluate", response=List[ProgressionResultSchema])
def evaluate_progression(request, session: str, student_ids: Optional[List[int]] = None):
    """Evaluate progression for all students (or specific ones) at session end."""
    if request.user.role not in ('admin', 'staff'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    from portals.services import ProgressionService
    records = ProgressionService.evaluate_session(session, processed_by=request.user, student_ids=student_ids)
    return records


@auth_router.get("/admin/progression/results", response=List[ProgressionResultSchema])
def list_progression_results(request, session: str):
    """List progression records for a session."""
    if request.user.role not in ('admin', 'staff'):
        return []
    from portals.models import ProgressionRecord
    qs = ProgressionRecord.objects.filter(session=session).select_related('student', 'student__student_profile')
    return qs


@auth_router.get("/student/progression")
def student_progression(request):
    """Get the current student's latest progression record."""
    if request.user.role != 'student':
        return None
    from portals.models import ProgressionRecord
    rec = ProgressionRecord.objects.filter(student=request.user).order_by('-session').first()
    if not rec:
        return None
    p = getattr(request.user, 'student_profile', None)
    return {
        'id': rec.id,
        'session': rec.session,
        'from_level': rec.from_level,
        'to_level': rec.to_level,
        'decision': rec.decision,
        'reason': rec.reason,
        'gpa': float(rec.gpa) if rec.gpa else None,
        'cgpa': float(rec.cgpa) if rec.cgpa else None,
        'carryover_units': rec.carryover_units,
        'total_units': rec.total_units,
        'is_reviewed': rec.is_reviewed,
        'matric_number': p.matric_number if p else '',
    }


# ═══════════════════════════════════════════════════════════════
# PHASE 4: ANALYTICS DASHBOARD
# ═══════════════════════════════════════════════════════════════

@auth_router.get("/admin/analytics/overview")
def analytics_overview(request, session: str):
    """High-level academic analytics for VC/Registrar/Dean dashboards."""
    if request.user.role not in ('admin', 'staff', 'faculty'):
        return {}
    from portals.models import StudentResult, StudentCourse, ProgressionRecord
    from django.db.models import Count, Avg, Sum

    total_students = StudentResult.objects.filter(session=session).values('student').distinct().count()
    published_results = StudentResult.objects.filter(session=session, is_published=True)

    status_dist = list(published_results.values('academic_status').annotate(count=Count('id')).order_by('academic_status'))
    avg_gpa = published_results.aggregate(avg=Avg('gpa'))['avg'] or 0
    avg_cgpa = published_results.aggregate(avg=Avg('cgpa'))['avg'] or 0

    progression_counts = list(ProgressionRecord.objects.filter(session=session).values('decision').annotate(count=Count('id')))

    return {
        'total_students': total_students,
        'total_results': published_results.count(),
        'average_gpa': float(f'{avg_gpa:.2f}'),
        'average_cgpa': float(f'{avg_cgpa:.2f}'),
        'status_distribution': list(status_dist),
        'progression_distribution': list(progression_counts),
    }


@auth_router.get("/admin/analytics/program-performance")
def program_performance(request, session: str):
    """Per-program GPA/CGPA breakdown."""
    from portals.models import StudentResult
    from django.db.models import Avg, Count

    data = (StudentResult.objects.filter(session=session, is_published=True)
            .values('student__program__title', 'student__program__degree')
            .annotate(
                student_count=Count('student', distinct=True),
                avg_gpa=Avg('gpa'),
                avg_cgpa=Avg('cgpa'),
            ).order_by('-avg_gpa'))

    return [
        {
            'program': d['student__program__title'] or 'Unassigned',
            'degree': d['student__program__degree'] or '',
            'student_count': d['student_count'],
            'avg_gpa': float(f'{d["avg_gpa"]:.2f}') if d['avg_gpa'] else 0,
            'avg_cgpa': float(f'{d["avg_cgpa"]:.2f}') if d['avg_cgpa'] else 0,
        }
        for d in data
    ]


@auth_router.get("/admin/analytics/grade-distribution")
def grade_distribution(request, session: str, semester: str):
    """Grade distribution across all courses in a session/semester."""
    from portals.models import StudentCourse
    from django.db.models import Count

    data = (StudentCourse.objects.filter(session=session, semester=semester, is_published=True)
            .values('course__code', 'course__title', 'grade')
            .annotate(count=Count('id'))
            .order_by('course__code', 'grade'))

    return list(data)


# ═══════════════════════════════════════════════════════════════
# PHASE 4: ATTENDANCE SYSTEM (QR CODE)
# ═══════════════════════════════════════════════════════════════

class CreateAttendanceSessionSchema(Schema):
    course_id: int
    schedule_id: Optional[int] = None
    session_date: str
    start_time: str
    end_time: str


@auth_router.post("/lecturer/attendance/create-session")
def create_attendance_session(request, data: CreateAttendanceSessionSchema):
    """Create a QR-coded attendance session for a course."""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        from django.http import JsonResponse
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    import secrets
    from portals.models import AttendanceSession
    from datetime import datetime

    session = AttendanceSession.objects.create(
        course_id=data.course_id,
        schedule_id=data.schedule_id,
        session_date=datetime.strptime(data.session_date, '%Y-%m-%d').date(),
        start_time=datetime.strptime(data.start_time, '%H:%M').time(),
        end_time=datetime.strptime(data.end_time, '%H:%M').time(),
        qr_code_token=secrets.token_urlsafe(32),
        created_by=request.user,
    )
    return {
        'id': session.id,
        'qr_code_token': session.qr_code_token,
        'qr_url': f'/api/auth/attendance/scan/{session.qr_code_token}',
        'message': 'Attendance session created',
    }


@auth_router.post("/attendance/scan/{token}")
def scan_attendance(request, token: str):
    """Student scans QR token to mark attendance."""
    if request.user.role != 'student':
        return {'error': 'Unauthorized'}
    from portals.models import AttendanceSession, AttendanceRecord

    try:
        session = AttendanceSession.objects.get(qr_code_token=token, is_active=True)
    except AttendanceSession.DoesNotExist:
        return {'error': 'Invalid or expired QR code'}

    AttendanceRecord.objects.get_or_create(
        session=session, student=request.user,
        defaults={'ip_address': request.META.get('REMOTE_ADDR')},
    )
    return {'message': f'Attendance marked for {session.course.code}', 'course': session.course.code}


@auth_router.get("/student/attendance")
def student_attendance(request, session: str, semester: str):
    """Get the student's attendance stats per course."""
    if request.user.role != 'student':
        return []
    from portals.models import AttendanceSession, AttendanceRecord
    from django.db.models import Count, Q

    semester = semester.capitalize()

    course_attendance = (AttendanceSession.objects.filter(
        course__enrolled_students__student=request.user,
        course__enrolled_students__session=session,
        course__enrolled_students__semester=semester,
    ).values('course_id', 'course__code', 'course__title')
      .annotate(
          total_sessions=Count('id', distinct=True),
          attended=Count('id', filter=Q(records__student=request.user), distinct=True),
      ))

    return [
        {
            'course_id': c['course_id'],
            'course_code': c['course__code'],
            'course_title': c['course__title'],
            'total_sessions': c['total_sessions'],
            'attended': c['attended'],
            'percentage': round(c['attended'] / c['total_sessions'] * 100, 1) if c['total_sessions'] > 0 else 0,
        }
        for c in course_attendance
    ]


@auth_router.get("/lecturer/attendance/course/{course_id}")
def lecturer_course_attendance(request, course_id: int, session: str, semester: str):
    """Lecturer views attendance summary for a course."""
    if request.user.role not in ('faculty', 'staff', 'admin'):
        return []
    from portals.models import AttendanceSession, AttendanceRecord, StudentCourse
    from django.db.models import Count, Q
    from django.contrib.auth import get_user_model

    User = get_user_model()
    students = StudentCourse.objects.filter(
        course_id=course_id, session=session, semester=semester,
    ).select_related('student', 'student__student_profile')

    sessions = AttendanceSession.objects.filter(course_id=course_id).order_by('session_date')

    result = []
    for sc in students:
        p = getattr(sc.student, 'student_profile', None)
        attended = AttendanceRecord.objects.filter(
            session__course_id=course_id, student=sc.student,
        ).count()
        result.append({
            'student_id': sc.student.id,
            'student_name': sc.student.full_name,
            'matric_number': p.matric_number if p else '',
            'total_sessions': sessions.count(),
            'attended': attended,
            'percentage': round(attended / sessions.count() * 100, 1) if sessions.count() > 0 else 0,
        })

    return result


# ═══════════════════════════════════════════════════════════════
# PHASE 4: TRANSCRIPT GENERATION
# ═══════════════════════════════════════════════════════════════

from django.http import HttpResponse
from io import BytesIO
from datetime import date


def _logo_data_uri():
    import base64, os
    path = os.path.join(os.path.dirname(__file__), 'portals', 'static', 'portals', 'bmu_logo.png')
    if os.path.isfile(path):
        with open(path, 'rb') as f:
            data = f.read()
        return f'data:image/png;base64,{base64.b64encode(data).decode()}'
    return ''


@auth_router.get("/student/transcript")
def generate_transcript(request, format: str = 'pdf'):
    """Generate official transcript PDF for the authenticated student."""
    if request.user.role != 'student':
        from django.http import JsonResponse
        return JsonResponse({'error': 'Only students can request transcripts'}, status=403)

    from portals.models import StudentResult, StudentCourse
    from portals.services import GpaService

    student = request.user
    results = StudentResult.objects.filter(student=student, is_published=True).order_by('session', 'semester')
    if not results.exists():
        return HttpResponse('No published results found', status=404)

    p = getattr(student, 'student_profile', None)
    student_info = {
        'full_name': student.full_name,
        'matric_number': p.matric_number if p else '',
        'program': getattr(student, 'program', None),
        'entry_year': results.first().session.split('/')[0] if results.first() else '',
    }

    semesters = []
    total_cumulative_units = 0
    for r in results:
        courses = StudentCourse.objects.filter(
            student=student, session=r.session, semester=r.semester, is_published=True,
        ).select_related('course').order_by('course__code')
        semesters.append({
            'session': r.session,
            'semester': r.semester,
            'level': r.level,
            'gpa': float(r.gpa),
            'cgpa': float(r.cgpa),
            'courses': courses,
            'total_units': r.total_units,
        })
        total_cumulative_units += r.total_units

    logo_uri = _logo_data_uri()
    cgpa = float(GpaService.compute_cgpa(student))

    from django.template.loader import render_to_string
    from xhtml2pdf import pisa

    ctx = {
        'student': student_info,
        'semesters': semesters,
        'cgpa': cgpa,
        'total_units': total_cumulative_units,
        'generated_date': date.today(),
        'logo_data_uri': logo_uri,
    }

    html = render_to_string('portals/transcript.html', ctx)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
    if pdf.err:
        return HttpResponse('Error generating PDF', status=500)

    filename = f"transcript_{student.full_name.replace(' ', '_')}.pdf"
    response = HttpResponse(result.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


# ═══════════════════════════════════════════════════════════════
# PHASE 4: GRADUATION LIST & NYSC BATCH
# ═══════════════════════════════════════════════════════════════

MIN_GRADUATION_CGPA = Decimal('1.00')


@auth_router.get("/admin/graduation/eligibility")
def graduation_eligibility(request, session: str):
    """Generate graduation eligibility list for a session (final year)."""
    if request.user.role not in ('admin', 'staff'):
        return []
    from portals.models import StudentResult, StudentCourse, ProgressionRecord
    from django.contrib.auth import get_user_model
    from decimal import Decimal
    from django.db.models import Q

    User = get_user_model()
    students = User.objects.filter(role='student')

    result = []
    for student in students:
        results = StudentResult.objects.filter(student=student, is_published=True)
        if not results.exists():
            continue

        cgpa = results.aggregate(total=Sum('gpa'))['total'] or 0
        cgpa_count = results.count()
        cgpa_avg = Decimal(str(cgpa)) / Decimal(str(cgpa_count)) if cgpa_count > 0 else Decimal('0')

        carryover_count = StudentCourse.objects.filter(
            student=student, is_published=True,
            grade__in=['F', 'E'],
        ).count()

        total_published = StudentCourse.objects.filter(
            student=student, is_published=True,
        ).count()

        p = getattr(student, 'student_profile', None)
        prog = getattr(student, 'program', None)

        is_eligible = (
            cgpa_avg >= MIN_GRADUATION_CGPA
            and carryover_count == 0
            and total_published > 0
        )

        result.append({
            'student_id': student.id,
            'student_name': student.full_name,
            'matric_number': p.matric_number if p else '',
            'program': prog.title if prog else '',
            'degree': prog.degree if prog else '',
            'cgpa': float(f'{cgpa_avg:.2f}'),
            'total_courses': total_published,
            'carryover_count': carryover_count,
            'is_eligible': is_eligible,
        })

    result.sort(key=lambda x: (-x['is_eligible'], -x['cgpa'], x['student_name']))
    return result


@auth_router.get("/admin/graduation/eligible", response=List[dict])
def graduation_eligible_list(request, session: str):
    """Return only eligible graduates."""
    data = graduation_eligibility(request, session)
    return [d for d in data if d['is_eligible']]


@auth_router.get("/admin/nysc/batch")
def nysc_batch(request, session: str):
    """Generate NYSC batch upload (CSV-style data) for eligible graduates."""
    from decimal import Decimal

    eligible = graduation_eligibility(request, session)
    eligible = [d for d in eligible if d['is_eligible']]

    batch = []
    for i, s in enumerate(eligible, 1):
        batch.append({
            's_no': i,
            'surname': s['student_name'].split()[-1] if s['student_name'] else '',
            'first_name': ' '.join(s['student_name'].split()[:-1]) if s['student_name'] else '',
            'middle_name': '',
            'matric_number': s['matric_number'],
            'programme': s['degree'],
            'cgpa': s['cgpa'],
            'class_of_degree': _classify_degree(s['cgpa']),
            'graduation_session': session,
        })

    return batch


def _classify_degree(cgpa: float) -> str:
    if cgpa >= 4.50:
        return 'First Class'
    elif cgpa >= 3.50:
        return 'Second Class Upper'
    elif cgpa >= 2.40:
        return 'Second Class Lower'
    elif cgpa >= 1.50:
        return 'Third Class'
    else:
        return 'Pass'


# Add auth router to api
api.add_router("/auth", auth_router)

# Add chat admin router
from chat.api import chat_router
api.add_router("/chat", chat_router)

# Add app routers
from academics.ninja_api import router as academics_router
from accounts.ninja_api import router as accounts_router

api.add_router("/academics", academics_router)
api.add_router("/auth", accounts_router)
