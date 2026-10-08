"""Account-related emails: password reset, password changed, email verification."""
import logging

from django.conf import settings

from core.email import send_templated_email

logger = logging.getLogger(__name__)

UNIVERSITY_NAME = 'Bayelsa Medical University'


def _base_context(user):
    return {
        'university_name': UNIVERSITY_NAME,
        'first_name': user.first_name or user.username,
        'full_name': user.get_full_name() or user.username,
        'email': user.email,
    }


def send_password_reset_code(user, code, expires_minutes=30):
    """Email the 6-digit password reset code to the user."""
    context = _base_context(user)
    context.update({
        'subject': 'Your password reset code',
        'code': code,
        'expires_minutes': expires_minutes,
    })
    return send_templated_email(
        subject=f'{UNIVERSITY_NAME} password reset code',
        template='password_reset_code',
        context=context,
        recipient_list=[user.email],
    )


def send_password_changed_email(user):
    """Security notice sent after any successful password change/reset."""
    context = _base_context(user)
    context['subject'] = 'Your password was changed'
    return send_templated_email(
        subject=f'{UNIVERSITY_NAME} — your password was changed',
        template='password_changed',
        context=context,
        recipient_list=[user.email],
    )


def send_verification_email(user, uid, token):
    """Email verification link for newly registered accounts."""
    base = (settings.FRONTEND_URL or '').rstrip('/')
    context = _base_context(user)
    context.update({
        'subject': 'Verify your email address',
        'verify_url': f'{base}/verify-email?uid={uid}&token={token}',
    })
    return send_templated_email(
        subject=f'{UNIVERSITY_NAME} — verify your email address',
        template='email_verification',
        context=context,
        recipient_list=[user.email],
    )
