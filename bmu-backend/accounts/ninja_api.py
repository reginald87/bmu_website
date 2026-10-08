"""
Django Ninja API for Accounts and Alumni
"""
from ninja import Router, Schema, Field
from ninja.errors import HttpError
from ninja.files import UploadedFile
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ninja_auth import JWTAuth
from .models import UserActivity, Notification, PasswordResetToken
from .alumni_models import AlumniProfile, AlumniEvent, AlumniDonation

User = get_user_model()
router = Router(auth=JWTAuth())


def _link_applications_by_email(user):
    """Link any existing applications with matching email to the given user"""
    try:
        from admissions.models import Application
        Application.objects.filter(
            email=user.email,
            applicant__isnull=True
        ).update(applicant=user)
    except Exception:
        pass  # admissions app might not be installed


# Schemas
class UserSchema(Schema):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    full_name: str
    role: str
    role_display: str = Field(..., alias="get_role_display")
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    is_email_verified: bool
    is_profile_complete: bool


class UserCreateSchema(Schema):
    email: str
    username: str
    password: str
    first_name: str
    last_name: str
    role: str = "applicant"


class LoginSchema(Schema):
    email: str
    password: str


class LoginResponseSchema(Schema):
    access: str
    refresh: str
    user: UserSchema


class AlumniProfileSchema(Schema):
    id: int
    user_id: int
    user_name: str = Field(..., alias="user.full_name")
    graduation_year: int
    program_id: Optional[int] = None
    program_name: Optional[str] = Field(None, alias="program.title")
    degree_awarded: Optional[str] = None
    current_employer: Optional[str] = None
    job_title: Optional[str] = None
    industry: Optional[str] = None
    career_status: str
    career_status_display: str = Field(..., alias="get_career_status_display")
    is_mentor: bool
    is_paying_dues: bool


class AlumniProfileDetailSchema(AlumniProfileSchema):
    professional_summary: str
    linkedin_url: Optional[str] = None
    twitter_handle: Optional[str] = None
    mentorship_areas: str
    allow_networking: bool


class AlumniEventSchema(Schema):
    id: int
    title: str
    description: str
    event_type: str
    event_type_display: str = Field(..., alias="get_event_type_display")
    event_date: str
    location: Optional[str] = None
    is_virtual: bool
    target_year: Optional[int] = None


class NotificationSchema(Schema):
    id: int
    type: str
    type_display: str = Field(..., alias="get_type_display")
    title: str
    message: str
    is_read: bool
    created_at: str


class PasswordChangeSchema(Schema):
    old_password: str
    new_password: str


class ProfileUpdateSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None


# Endpoints
@router.post("/register", response=UserSchema, auth=None)
def register(request, data: UserCreateSchema):
    """Register a new user"""
    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password,
        first_name=data.first_name,
        last_name=data.last_name,
        role=data.role
    )
    UserActivity.objects.create(
        user=user,
        action='register',
        description='User registered successfully'
    )
    
    # Link any existing applications with matching email to this user
    _link_applications_by_email(user)

    # Send verification email (failure never breaks registration)
    try:
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from .emails import send_verification_email
        send_verification_email(
            user,
            urlsafe_base64_encode(force_bytes(user.pk)),
            default_token_generator.make_token(user),
        )
    except Exception:
        import logging
        logging.getLogger(__name__).exception(
            'Verification email failed for user %s', user.pk
        )

    return user


@router.post("/login", response=LoginResponseSchema, auth=None)
def login(request, data: LoginSchema):
    """User login with email and password"""
    try:
        user = User.objects.get(email=data.email)
    except User.DoesNotExist:
        raise HttpError(401, "Invalid credentials")

    user = authenticate(username=user.username, password=data.password)
    if not user or not user.is_active:
        raise HttpError(401, "Invalid credentials")
    
    # Link any existing applications with matching email to this user
    _link_applications_by_email(user)
    
    refresh = RefreshToken.for_user(user)
    
    # Log activity
    UserActivity.objects.create(
        user=user,
        action='login',
        description='User logged in'
    )
    
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": user
    }


@router.put("/profile", response=UserSchema)
def update_profile(request, data: ProfileUpdateSchema):
    """Update user profile"""
    user = request.user
    for field, value in data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(user, field, value)
    user.save()
    
    UserActivity.objects.create(
        user=user,
        action='profile_update',
        description='Profile updated'
    )
    return user


@router.post("/password/change")
def change_password(request, data: PasswordChangeSchema):
    """Change user password"""
    user = request.user
    if not user.check_password(data.old_password):
        raise HttpError(400, "Current password is incorrect")
    
    user.set_password(data.new_password)
    user.save()
    from core.tokens import blacklist_user_refresh_tokens
    blacklist_user_refresh_tokens(user)

    UserActivity.objects.create(
        user=user,
        action='password_change',
        description='Password changed'
    )
    return {"message": "Password changed successfully"}


@router.get("/notifications", response=List[NotificationSchema])
def list_notifications(request, unread_only: bool = False):
    """Get user notifications"""
    qs = Notification.objects.filter(user=request.user)
    if unread_only:
        qs = qs.filter(is_read=False)
    return qs[:50]


@router.post("/notifications/{id}/read")
def mark_notification_read(request, id: int):
    """Mark notification as read"""
    from django.utils import timezone
    notification = get_object_or_404(Notification, id=id, user=request.user)
    notification.is_read = True
    notification.read_at = timezone.now()
    notification.save()
    return {"message": "Notification marked as read"}


# Alumni endpoints
@router.get("/alumni", response=List[AlumniProfileSchema])
def list_alumni(request, year: Optional[int] = None, program_id: Optional[int] = None):
    """List alumni with optional filtering"""
    qs = AlumniProfile.objects.filter(user__is_active=True)
    if year:
        qs = qs.filter(graduation_year=year)
    if program_id:
        qs = qs.filter(program_id=program_id)
    return qs[:100]


@router.get("/alumni/mentors", response=List[AlumniProfileSchema])
def list_mentors(request):
    """List available mentors"""
    return AlumniProfile.objects.filter(is_mentor=True, user__is_active=True)


@router.get("/activities", response=List[dict])
def list_activities(request):
    """Get user activity history"""
    activities = UserActivity.objects.filter(user=request.user)[:50]
    return [{"action": a.action, "description": a.description, "created_at": str(a.created_at)} for a in activities]
