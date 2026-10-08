from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import UserActivity, Notification, PasswordResetToken
from .serializers import (
    UserSerializer, UserCreateSerializer, UserProfileUpdateSerializer,
    UserActivitySerializer, NotificationSerializer, LoginSerializer,
    ChangePasswordSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
import uuid
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """Register a new user"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        # Log the activity
        UserActivity.objects.create(
            user=user,
            action='register',
            description='User registered successfully'
        )
        # Link any existing applications with matching email
        try:
            from admissions.models import Application
            Application.objects.filter(
                email=user.email,
                applicant__isnull=True
            ).update(applicant=user)
        except Exception:
            pass
        self.send_verification_email(user)
        return user

    def send_verification_email(self, user):
        """Email a verification link; failures never break registration."""
        try:
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            from .emails import send_verification_email
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            send_verification_email(user, uid, token)
        except Exception:
            import logging
            logging.getLogger(__name__).exception(
                'Verification email failed for user %s', user.pk
            )


class UserLoginView(generics.GenericAPIView):
    """User login with JWT"""
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authenticate
        user = authenticate(username=user.username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Link any existing applications with matching email
        try:
            from admissions.models import Application
            Application.objects.filter(
                email=user.email,
                applicant__isnull=True
            ).update(applicant=user)
        except Exception:
            pass
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Log activity
        UserActivity.objects.create(
            user=user,
            action='login',
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """Update user profile"""
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        user = serializer.save()
        UserActivity.objects.create(
            user=user,
            action='profile_update',
            description='Profile updated'
        )


class ChangePasswordView(generics.GenericAPIView):
    """Change user password"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        from core.tokens import blacklist_user_refresh_tokens
        blacklist_user_refresh_tokens(user)

        # Log activity
        UserActivity.objects.create(
            user=user,
            action='password_change',
            description='Password changed'
        )
        
        from .emails import send_password_changed_email
        send_password_changed_email(user)
        
        return Response({'message': 'Password changed successfully'})


class PasswordResetRequestView(generics.GenericAPIView):
    """Request password reset (emails a 6-digit code)"""
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [permissions.AllowAny]

    RESET_CODE_TTL_MINUTES = 30

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({'message': 'If the email exists, a reset code has been sent'})

        # Invalidate any outstanding codes, then issue a fresh one
        from django.utils import timezone
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

        code = f'{uuid.uuid4().int % 1000000:06d}'
        PasswordResetToken.objects.create(
            user=user,
            token=code,
            expires_at=timezone.now() + timedelta(minutes=self.RESET_CODE_TTL_MINUTES),
        )

        from .emails import send_password_reset_code
        send_password_reset_code(user, code, expires_minutes=self.RESET_CODE_TTL_MINUTES)

        return Response({'message': 'If the email exists, a reset code has been sent'})


class PasswordResetConfirmView(generics.GenericAPIView):
    """Confirm password reset with the emailed code and set a new password"""
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        invalid_response = Response(
            {'error': 'Invalid or expired reset code'},
            status=status.HTTP_400_BAD_REQUEST,
        )

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            return invalid_response

        from django.utils import timezone
        reset_token = PasswordResetToken.objects.filter(
            user=user, token=code, is_used=False, expires_at__gt=timezone.now()
        ).first()
        if not reset_token:
            return invalid_response

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        from core.tokens import blacklist_user_refresh_tokens
        blacklist_user_refresh_tokens(user)

        reset_token.is_used = True
        reset_token.save(update_fields=['is_used'])
        # Any other outstanding codes are now invalid too
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

        UserActivity.objects.create(
            user=user,
            action='password_change',
            description='Password reset via email code'
        )

        from .emails import send_password_changed_email
        send_password_changed_email(user)

        return Response({'message': 'Password has been reset successfully'})


def verify_email(request):
    """GET /accounts/verify-email/?uid=...&token=... — confirms the address.

    Returns JSON so the SPA can call it; safe to open directly from an email
    client too.
    """
    uid = request.GET.get('uid', '')
    token = request.GET.get('token', '')

    try:
        from django.utils.http import urlsafe_base64_decode
        from django.contrib.auth.tokens import default_token_generator
        user_pk = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_pk)
    except Exception:
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        return JsonResponse({'error': 'Invalid or expired verification link'}, status=400)

    if not user.is_email_verified:
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        UserActivity.objects.create(
            user=user,
            action='profile_update',
            description='Email address verified'
        )

    return JsonResponse({'message': 'Email verified successfully'})


class UserActivityListView(generics.ListAPIView):
    """Get user activity history"""
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)


class NotificationListView(generics.ListAPIView):
    """Get user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a notification as read"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'message': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Logout user (blacklist token)"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='logout',
            description='User logged out'
        )
        
        return Response({'message': 'Logout successful'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """List all users (admin only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


# Traditional Django login view for HTML templates
def login_view(request):
    """Traditional Django login view for HTML templates"""
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(email=email)
            # Authenticate with username (Django uses username for authentication)
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                auth_login(request, authenticated_user)
                # Log activity
                UserActivity.objects.create(
                    user=authenticated_user,
                    action='login',
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                # Redirect to next page or dashboard
                next_page = request.GET.get('next', '/chat/agent/dashboard/')
                return redirect(next_page)
            else:
                return render(request, 'accounts/login.html', {
                    'error': 'Invalid email or password'
                })
        except User.DoesNotExist:
            return render(request, 'accounts/login.html', {
                'error': 'Invalid email or password'
            })
    
    # GET request - render login form
    return render(request, 'accounts/login.html')


def logout_view_html(request):
    """Traditional Django logout view for HTML templates"""
    if request.user.is_authenticated:
        UserActivity.objects.create(
            user=request.user,
            action='logout',
            description='User logged out'
        )
    auth_logout(request)
    return redirect('/accounts/login/')
