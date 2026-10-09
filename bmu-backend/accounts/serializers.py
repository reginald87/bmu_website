import re

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserActivity, Notification

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'role', 'role_display', 'profile_image', 'bio',
            'address', 'city', 'state', 'country',
            'department', 'college', 'program',
            'student_id', 'enrollment_year', 'employee_id',
            'is_email_verified', 'is_profile_complete', 'is_active',
            'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users.

    Accepts the confirmation password under either ``password_confirm``
    (existing API/test contract) or ``confirm_password`` (frontend payload).
    Usernames are optional and derived from the email when omitted.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone', 'role', 'password', 'password_confirm', 'confirm_password'
        ]
        extra_kwargs = {
            'username': {'required': False, 'validators': []},
        }

    def validate(self, data):
        confirm = data.get('password_confirm') or data.get('confirm_password')
        if not confirm:
            raise serializers.ValidationError(
                {'password_confirm': 'This field is required.'}
            )
        if data['password'] != confirm:
            raise serializers.ValidationError('Passwords do not match.')
        data['password_confirm'] = confirm
        return data

    @staticmethod
    def _generate_username(email):
        base = re.sub(r'[^a-z0-9._-]', '', (email.split('@')[0] or '').lower())
        base = (base or 'user')[:150]
        username = base
        suffix = 1
        while User.objects.filter(username=username).exists():
            tail = str(suffix)
            username = f'{base[:150 - len(tail)]}{tail}'
            suffix += 1
        return username

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        validated_data.pop('confirm_password', None)
        if not validated_data.get('username'):
            validated_data['username'] = self._generate_username(
                validated_data['email']
            )
        return User.objects.create_user(**validated_data)


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'bio',
            'address', 'city', 'state', 'country',
            'profile_image'
        ]


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for UserActivity model"""
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ['id', 'action', 'action_display', 'description', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'type_display', 'title', 'message',
            'related_object_type', 'related_object_id',
            'is_read', 'read_at', 'created_at'
        ]
        read_only_fields = ['created_at']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("New passwords do not match.")
        return data


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming a password reset with the emailed code"""
    email = serializers.EmailField(required=True)
    code = serializers.CharField(required=True, min_length=6, max_length=6)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("New passwords do not match.")
        return data
