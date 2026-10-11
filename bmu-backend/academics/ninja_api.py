"""
Django Ninja API for Academics app
"""
from ninja import Router, Schema, Field
from ninja.pagination import paginate
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import College, Department, Program, Faculty, Leadership, NonAcademicStaff, SDGMetric, HomeStats

router = Router()


# Schemas
class CollegeListSchema(Schema):
    id: int
    name: str
    slug: str
    dean_name: Optional[str] = None
    description: str
    faculty_count: int
    student_count: int
    primary_color: Optional[str] = None


class CollegeDetailSchema(CollegeListSchema):
    director_name: Optional[str] = None
    subdomain: Optional[str] = None
    established_year: int
    secondary_color: Optional[str] = None


class DepartmentSchema(Schema):
    id: int
    name: str
    slug: str
    description: str
    head_name: Optional[str] = None


class ProgramListSchema(Schema):
    id: int
    title: str
    slug: str
    level: str
    level_display: str = Field(..., alias="get_level_display")
    duration: str
    college_id: Optional[int] = None
    department_id: Optional[int] = None


class ProgramDetailSchema(ProgramListSchema):
    description: str
    overview: str
    admission_requirements: str
    career_opportunities: str
    tuition_fee_local: float
    tuition_fee_international: float
    application_fee_local: float
    application_fee_international: float

    @staticmethod
    def resolve_application_fee_local(obj):
        return float(obj.effective_application_fee_local())

    @staticmethod
    def resolve_application_fee_international(obj):
        return float(obj.effective_application_fee_intl())


class FacultyListSchema(Schema):
    id: int
    full_name: str
    title: str
    position: str
    position_display: str = Field(..., alias="get_position_display")
    department_id: Optional[int] = None
    college_id: Optional[int] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None


class FacultyDetailSchema(FacultyListSchema):
    bio: str
    education: str
    research_interests: str
    office_location: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool


class LeadershipSchema(Schema):
    id: int
    full_name: str
    title: Optional[str] = None
    position: str
    position_display: str = Field(..., alias="get_position_display")
    specific_title: Optional[str] = None
    college_id: Optional[int] = None
    department_id: Optional[int] = None
    biography: str
    qualifications: str
    email: Optional[str] = None
    phone: Optional[str] = None
    office_location: Optional[str] = None
    photo: Optional[str] = None
    display_order: int


class NonAcademicStaffSchema(Schema):
    id: int
    employee_id: str
    full_name: str
    email: str
    job_title: str
    category: str
    category_display: str = Field(..., alias="get_category_display")
    employment_type: str
    employment_type_display: str = Field(..., alias="get_employment_type_display")
    department_id: Optional[int] = None
    college_id: Optional[int] = None
    photo: Optional[str] = None
    is_active: bool


class SDGMetricSchema(Schema):
    id: int
    sdg_code: str
    label: str
    current_value: int
    target_value: int
    unit: str
    progress_percentage: float


class SDGGroupSchema(Schema):
    title: str
    metrics: List[SDGMetricSchema]


class HomeStatsSchema(Schema):
    research_papers: int
    students: int
    faculty: int
    partners: int
    updated_at: Optional[str] = None


# Endpoints
@router.get("/colleges", response=List[CollegeListSchema])
@paginate
def list_colleges(request):
    """List all active colleges"""
    return College.objects.filter(is_active=True)


@router.get("/colleges/{slug}", response=CollegeDetailSchema)
def get_college(request, slug: str):
    """Get college details by slug"""
    return get_object_or_404(College, slug=slug, is_active=True)


@router.get("/departments", response=List[DepartmentSchema])
@paginate
def list_departments(request, college_id: Optional[int] = None):
    """List departments, optionally filtered by college"""
    qs = Department.objects.filter(is_active=True)
    if college_id:
        qs = qs.filter(college_id=college_id)
    return qs


@router.get("/programs", response=List[ProgramListSchema])
@paginate
def list_programs(request, level: Optional[str] = None, college_id: Optional[int] = None):
    """List programs with optional filtering"""
    qs = Program.objects.filter(is_active=True)
    if level:
        qs = qs.filter(level=level)
    if college_id:
        qs = qs.filter(college_id=college_id)
    return qs


@router.get("/programs/{slug}", response=ProgramDetailSchema)
def get_program(request, slug: str):
    """Get program details by slug"""
    return get_object_or_404(Program, slug=slug, is_active=True)


@router.get("/programs/by-level/{level}", response=List[ProgramListSchema])
def programs_by_level(request, level: str):
    """Get programs by level (undergraduate, masters, phd, certificate)"""
    return Program.objects.filter(level=level, is_active=True)


@router.get("/faculty", response=List[FacultyListSchema])
@paginate
def list_faculty(request, college_id: Optional[int] = None, department_id: Optional[int] = None):
    """List faculty members"""
    qs = Faculty.objects.filter(is_active=True)
    if college_id:
        qs = qs.filter(college_id=college_id)
    if department_id:
        qs = qs.filter(department_id=department_id)
    return qs


@router.get("/faculty/{id}", response=FacultyDetailSchema)
def get_faculty(request, id: int):
    """Get faculty details by ID"""
    return get_object_or_404(Faculty, id=id, is_active=True)


@router.get("/leadership", response=List[LeadershipSchema])
def list_leadership(request, position: Optional[str] = None):
    """List university leadership"""
    qs = Leadership.objects.filter(is_active=True)
    if position:
        qs = qs.filter(position=position)
    return qs.order_by('display_order', 'last_name')


@router.get("/leadership/{id}", response=LeadershipSchema)
def get_leader(request, id: int):
    """Get leadership details"""
    return get_object_or_404(Leadership, id=id, is_active=True)


@router.get("/staff", response=List[NonAcademicStaffSchema])
@paginate
def list_staff(request, category: Optional[str] = None, college_id: Optional[int] = None):
    """List non-academic staff"""
    qs = NonAcademicStaff.objects.filter(is_active=True)
    if category:
        qs = qs.filter(category=category)
    if college_id:
        qs = qs.filter(college_id=college_id)
    return qs


@router.get("/sdg-metrics", response=dict)
def list_sdg_metrics(request):
    """Get SDG metrics grouped by SDG code"""
    result = {}
    sdgs = {
        'sdg3': 'Good Health & Well-being',
        'sdg4': 'Quality Education',
        'sdg5': 'Gender Equality',
    }
    for code, title in sdgs.items():
        metrics = SDGMetric.objects.filter(sdg_code=code, is_active=True)
        result[code] = {
            'title': title,
            'metrics': [SDGMetricSchema.from_orm(m) for m in metrics]
        }
    return result


@router.get("/home-stats", response=HomeStatsSchema)
def home_stats(request):
    """Get homepage statistics"""
    stats = HomeStats.objects.first()
    if stats:
        return stats
    return {"research_papers": 0, "students": 0, "faculty": 0, "partners": 0, "updated_at": None}
