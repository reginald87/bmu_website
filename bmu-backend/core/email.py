"""
Central email service.

All outgoing email should go through ``send_templated_email`` so that
rendering, logging and failure handling are consistent. Sending never raises:
failures are logged (loudly) and ``False`` is returned so an SMTP outage can
never break the request that triggered the email.
"""
import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.template import TemplateDoesNotExist

logger = logging.getLogger(__name__)


def send_templated_email(*, subject, template, context, recipient_list,
                         cc=None, reply_to=None, from_email=None):
    """Render ``core/email/<template>.html`` + ``.txt`` and send the email.

    Returns True when the email was handed to the email backend, False otherwise.
    """
    recipient_list = [r for r in (recipient_list or []) if r]
    if not recipient_list:
        logger.warning("Email %r not sent: no recipients", template)
        return False

    try:
        text_body = render_to_string(f'core/email/{template}.txt', context)
    except TemplateDoesNotExist:
        logger.warning("Email template core/email/%s.txt missing", template)
        text_body = ''
    html_body = render_to_string(f'core/email/{template}.html', context)

    try:
        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body or html_body,
            from_email=from_email or settings.DEFAULT_FROM_EMAIL,
            to=recipient_list,
            cc=cc or [],
            reply_to=[reply_to] if reply_to else None,
        )
        message.attach_alternative(html_body, 'text/html')
        message.send(fail_silently=False)
    except Exception:
        logger.exception("Email %r failed for %s", template, recipient_list)
        return False

    logger.info("Email %r sent to %s", template, recipient_list)
    return True
