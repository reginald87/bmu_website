"""
Admissions email notifications.

Called from every place that creates an application or changes its status:
the public Ninja submission endpoint, the DRF views and the Django admin.
"""
import logging

from django.conf import settings
from django.utils import timezone

from core.email import send_templated_email

logger = logging.getLogger(__name__)

UNIVERSITY_NAME = 'Bayelsa Medical University'

# Applicant-facing copy per status. 'submitted' is handled separately by the
# dedicated confirmation template.
STATUS_EMAIL_CONTENT = {
    'under_review': {
        'headline': 'Your application is under review',
        'body': ('Your application has been passed to the admissions committee '
                 'and is now being reviewed. We will write to you again as soon '
                 'as a decision is made.'),
        'next_steps': '',
    },
    'revision_requested': {
        'headline': 'Action required: please revise your application',
        'body': ('Our admissions office has reviewed your application and needs '
                 'additional information or corrections before it can proceed. '
                 'Please sign in to the applicant portal to see what needs to be '
                 'updated.'),
        'next_steps': 'Sign in to the applicant portal and resubmit your application.',
    },
    'interview': {
        'headline': 'Interview scheduled',
        'body': ('Congratulations — your application has progressed to the '
                 'interview stage. The admissions office will contact you '
                 'separately with the date, time and venue.'),
        'next_steps': 'Watch your email and phone for your interview details.',
    },
    'accepted': {
        'headline': 'Congratulations — you have been offered admission!',
        'body': ('We are delighted to inform you that your application has been '
                 'accepted. Welcome to ' + UNIVERSITY_NAME + '!'),
        'next_steps': ('Complete your registration and pay your fees within the '
                       'stipulated deadline to secure your place.'),
    },
    'rejected': {
        'headline': 'Decision on your application',
        'body': ('After careful consideration, we regret to inform you that your '
                 'application was not successful this time. We encourage you to '
                 'apply again in a future admission cycle.'),
        'next_steps': '',
    },
    'waitlisted': {
        'headline': 'You have been placed on the waiting list',
        'body': ('Your application has been placed on the waiting list. We will '
                 'contact you immediately should a place become available.'),
        'next_steps': '',
    },
}


def application_status_url(application):
    base = (settings.FRONTEND_URL or '').rstrip('/')
    # Use the unguessable public_id — the sequential application ID is
    # enumerable and must not appear in public URLs.
    return f'{base}/apply/status/{application.public_id}'


def _base_context(application):
    return {
        'university_name': UNIVERSITY_NAME,
        'subject': '',
        'application_id': application.id,
        'first_name': application.first_name,
        'full_name': f'{application.first_name} {application.last_name}',
        'email': application.email,
        'phone': application.phone,
        'program': str(application.program),
        'student_type': application.get_student_type_display(),
        'status_display': application.get_status_display(),
        'submitted_at': (application.submitted_at or timezone.now()).strftime('%d %B %Y, %H:%M'),
        'status_url': application_status_url(application),
    }


def send_application_submitted_confirmation(application):
    """Receipt email to the applicant, sent once the application is submitted."""
    context = _base_context(application)
    context['subject'] = f'Application received — {application.id}'
    return send_templated_email(
        subject=context['subject'],
        template='application_submitted',
        context=context,
        recipient_list=[application.email],
    )


def send_new_application_alert(application):
    """Internal alert to the admissions office for every new submission."""
    recipients = [r.strip() for r in
                  (settings.ADMISSIONS_OFFICE_EMAIL or '').split(',') if r.strip()]
    context = _base_context(application)
    context['subject'] = f'New application received — {application.id}'
    context['admin_url'] = (
        f"{(settings.FRONTEND_URL or '').rstrip('/')}"
        f"/admin/admissions/application/{application.id}/change/"
    )
    return send_templated_email(
        subject=context['subject'],
        template='new_application_alert',
        context=context,
        recipient_list=recipients,
    )


def send_application_status_update(application, old_status=None, matric_number=None):
    """Email the applicant when their application status changes."""
    new_status = application.status
    if new_status == 'draft' or new_status == old_status:
        return False
    if not application.email:
        logger.warning('Status email skipped for %s: no email address', application.id)
        return False
    if new_status == 'submitted':
        return send_application_submitted_confirmation(application)

    content = STATUS_EMAIL_CONTENT.get(new_status)
    if not content:
        logger.warning('No email copy for status %r (%s)', new_status, application.id)
        return False

    context = _base_context(application)
    context.update(content)
    context['matric_number'] = matric_number or ''
    context['subject'] = f'Update on your application {application.id}: {application.get_status_display()}'
    return send_templated_email(
        subject=context['subject'],
        template='application_status',
        context=context,
        recipient_list=[application.email],
    )


def send_payment_receipt(application):
    """Receipt email after the application fee is paid."""
    if not application.email:
        return False
    context = _base_context(application)
    context.update({
        'subject': f'Payment receipt — {application.id}',
        'currency': application.payment_currency or 'NGN',
        'amount': f'{application.payment_amount:,.2f}' if application.payment_amount else '0.00',
        'payment_method': application.get_payment_method_display() or 'Not specified',
        'payment_reference': application.payment_reference or '—',
        'paid_at': (application.paid_at or timezone.now()).strftime('%d %B %Y, %H:%M'),
    })
    return send_templated_email(
        subject=context['subject'],
        template='payment_receipt',
        context=context,
        recipient_list=[application.email],
    )


def send_payment_pending(application):
    """Acknowledgement that a manual (bank deposit) payment was recorded, pending confirmation."""
    if not application.email:
        return False
    context = _base_context(application)
    context.update({
        'subject': f'Payment recorded — {application.id} (pending confirmation)',
        'currency': application.payment_currency or 'NGN',
        'amount': f'{application.payment_amount:,.2f}' if application.payment_amount else '0.00',
        'payment_method': application.get_payment_method_display() or 'Bank deposit',
        'payment_reference': application.payment_reference or '—',
    })
    return send_templated_email(
        subject=context['subject'],
        template='payment_pending',
        context=context,
        recipient_list=[application.email],
    )


def notify_application_submitted(application, alert_office=True):
    """Applicant confirmation + (optionally) the admissions office alert."""
    sent = False
    if application.email:
        sent = send_application_submitted_confirmation(application)
    if alert_office:
        send_new_application_alert(application)
    return sent


def notify_application_status_change(application, old_status, matric_number=None):
    """Single entry point for status transitions from views and the admin."""
    return send_application_status_update(
        application, old_status=old_status, matric_number=matric_number
    )
