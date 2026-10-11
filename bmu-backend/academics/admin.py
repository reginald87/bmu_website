from django.contrib import admin
from .models import (
    College, FacultyUnit, Department, Program, Course, Faculty,
    FacultyPublication, FacultyCustomLink, SDGMetric, HomeStats,
    Leadership, LeadershipPublication, NonAcademicStaff, StaffPublication,
    AcademicCalendar, Deadline,
    ProgramAccreditation, ProgramFacility, ProgramHighlight,
    ProgramCurriculumYear, ProgramCurriculumCourse, ProgramAdmissionRequirement,
    RegistrationPeriod, CourseSchedule,
    ApplicationFee,
)


class FacultyUnitInline(admin.StackedInline):
    model = FacultyUnit
    extra = 1
    show_change_link = True
    prepopulated_fields = {'slug': ('name',)}


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'leadership_name', 'established_year', 'faculty_count', 'faculty_members_count', 'student_count', 'is_active']
    list_filter = ['is_active', 'established_year']
    search_fields = ['name', 'provost_display_name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [FacultyUnitInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'subdomain', 'description')
        }),
        ('Leadership', {
            'fields': ('provost', 'provost_display_name', 'director', 'director_display_name')
        }),
        ('Overview Content', {
            'fields': ('overview_content', 'mission_statement', 'vision_statement')
        }),
        ('Visual', {
            'fields': ('primary_color', 'secondary_color', 'banner_image', 'icon_name', 'preview_image', 'provost_photo')
        }),
        ('Stats', {
            'fields': ('established_year', 'faculty_count', 'faculty_members_count', 'student_count')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(FacultyUnit)
class FacultyUnitAdmin(admin.ModelAdmin):
    list_display = ['name', 'college', 'is_standalone', 'code', 'leadership_name', 'department_count', 'is_active']
    list_filter = ['is_active', 'college']
    search_fields = ['name', 'college__name', 'dean_display_name']
    prepopulated_fields = {'slug': ('name',)}
    
    def is_standalone(self, obj):
        return obj.is_standalone
    is_standalone.boolean = True
    is_standalone.short_description = 'Standalone'
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'code', 'college')
        }),
        ('Leadership', {
            'fields': ('dean', 'dean_display_name')
        }),
        ('Content', {
            'fields': ('description', 'mission_statement', 'vision_statement')
        }),
        ('Visual', {
            'fields': ('banner_image', 'dean_photo')
        }),
        ('Stats', {
            'fields': ('department_count', 'staff_count', 'student_count')
        }),
        ('Display', {
            'fields': ('display_order', 'is_active')
        }),
    )


class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 1
    show_change_link = True
    prepopulated_fields = {'slug': ('name',)}
    fields = ['name', 'slug', 'code', 'hod', 'is_active']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'faculty', 'college_direct', 'parent_name', 'code', 'leadership_name', 'staff_count', 'is_active']
    list_filter = ['is_active', 'faculty', 'college_direct']
    search_fields = ['name', 'faculty__name', 'college_direct__name', 'hod_display_name']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['staff_members']
    
    def parent_name(self, obj):
        return obj.parent_name
    parent_name.short_description = 'Parent'
    
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'code')
        }),
        ('Hierarchy (choose ONE)', {
            'fields': ('faculty', 'college_direct'),
            'description': 'Link to either a Faculty OR directly to a College, not both.'
        }),
        ('Leadership', {
            'fields': ('hod', 'hod_display_name')
        }),
        ('Staff', {
            'fields': ('staff_members',)
        }),
        ('Content', {
            'fields': ('description',)
        }),
        ('Visual', {
            'fields': ('banner_image', 'hod_photo')
        }),
        ('Stats', {
            'fields': ('staff_count', 'student_count')
        }),
        ('Display', {
            'fields': ('display_order', 'is_active')
        }),
    )

class ProgramAccreditationInline(admin.TabularInline):
    model = ProgramAccreditation
    extra = 1

class ProgramFacilityInline(admin.TabularInline):
    model = ProgramFacility
    extra = 1

class ProgramHighlightInline(admin.TabularInline):
    model = ProgramHighlight
    extra = 2

class ProgramCurriculumCourseInline(admin.TabularInline):
    model = ProgramCurriculumCourse
    extra = 3

class ProgramCurriculumYearInline(admin.StackedInline):
    model = ProgramCurriculumYear
    extra = 1
    show_change_link = True
    inlines = [ProgramCurriculumCourseInline]

class ProgramAdmissionRequirementInline(admin.TabularInline):
    model = ProgramAdmissionRequirement
    extra = 2


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['title', 'degree', 'level', 'college', 'duration', 'is_active', 'applications_open']
    list_filter = ['level', 'category', 'is_active', 'applications_open', 'college']
    list_editable = ['applications_open']
    search_fields = ['title', 'degree', 'college__name', 'department__name']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [
        ProgramAccreditationInline, ProgramFacilityInline, ProgramHighlightInline,
        ProgramCurriculumYearInline, ProgramAdmissionRequirementInline
    ]


@admin.register(ApplicationFee)
class ApplicationFeeAdmin(admin.ModelAdmin):
    list_display = ['level', 'local_fee', 'intl_fee', 'updated_at']
    ordering = ['level']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'credit_units', 'course_type', 'level', 'capacity', 'enrolled_count', 'is_active']
    list_filter = ['course_type', 'level', 'is_active', 'department']
    search_fields = ['code', 'title']
    filter_horizontal = ['programs', 'prerequisites']


class FacultyPublicationInline(admin.TabularInline):
    model = FacultyPublication
    extra = 1


class FacultyCustomLinkInline(admin.TabularInline):
    model = FacultyCustomLink
    extra = 1
    fields = ['label', 'url', 'display_order', 'is_active']


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    inlines = [FacultyPublicationInline, FacultyCustomLinkInline]
    list_display = ['full_name', 'title', 'position', 'college', 'department', 'email', 'is_active']
    list_filter = ['title', 'position', 'college', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'research_interests']


@admin.register(FacultyPublication)
class FacultyPublicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'faculty', 'year', 'journal', 'citations']
    list_filter = ['year']
    search_fields = ['title', 'faculty__first_name', 'faculty__last_name']


@admin.register(FacultyCustomLink)
class FacultyCustomLinkAdmin(admin.ModelAdmin):
    list_display = ['label', 'url', 'faculty', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['label', 'url', 'faculty__first_name', 'faculty__last_name']
    list_editable = ['display_order', 'is_active']
    raw_id_fields = ['faculty']


@admin.register(SDGMetric)
class SDGMetricAdmin(admin.ModelAdmin):
    list_display = ['sdg_code', 'label', 'current_value', 'target_value', 'unit', 'progress_percentage']
    list_filter = ['sdg_code', 'is_active']


@admin.register(HomeStats)
class HomeStatsAdmin(admin.ModelAdmin):
    list_display = ['research_papers', 'students', 'faculty', 'partners', 'updated_at']
    readonly_fields = ['updated_at']


class LeadershipPublicationInline(admin.TabularInline):
    model = LeadershipPublication
    extra = 1


@admin.register(Leadership)
class LeadershipAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'position', 'specific_title', 'college', 'is_active', 'display_order']
    list_filter = ['position', 'is_active', 'college']
    search_fields = ['first_name', 'last_name', 'specific_title']
    ordering = ['display_order', 'last_name']
    inlines = [LeadershipPublicationInline]


class StaffPublicationInline(admin.TabularInline):
    model = StaffPublication
    extra = 1


@admin.register(NonAcademicStaff)
class NonAcademicStaffAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'full_name', 'job_title', 'category', 'department', 'is_active']
    list_filter = ['category', 'employment_type', 'is_active', 'college']
    search_fields = ['first_name', 'last_name', 'employee_id', 'job_title', 'email']
    raw_id_fields = ['supervisor']
    inlines = [StaffPublicationInline]


@admin.register(AcademicCalendar)
class AcademicCalendarAdmin(admin.ModelAdmin):
    list_display = ['academic_year', 'term', 'title', 'event_type', 'start_date', 'is_important']
    list_filter = ['academic_year', 'term', 'event_type', 'is_important']
    date_hierarchy = 'start_date'
    search_fields = ['title', 'description']


@admin.register(Deadline)
class DeadlineAdmin(admin.ModelAdmin):
    list_display = ['title', 'deadline', 'icon_name', 'display_order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['title']


@admin.register(CourseSchedule)
class CourseScheduleAdmin(admin.ModelAdmin):
    list_display = ['course', 'day', 'start_time', 'end_time', 'venue', 'is_lab']
    list_filter = ['day', 'is_lab']
    search_fields = ['course__code', 'course__title', 'venue']


@admin.register(RegistrationPeriod)
class RegistrationPeriodAdmin(admin.ModelAdmin):
    list_display = ['academic_year', 'semester', 'program', 'level', 'opens_at', 'closes_at', 'is_open', 'is_active']
    list_filter = ['academic_year', 'semester', 'is_active']
    search_fields = ['academic_year', 'program__title']
    date_hierarchy = 'opens_at'



