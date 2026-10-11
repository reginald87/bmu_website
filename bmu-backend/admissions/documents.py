"""A4 PDF documents generated for a successful applicant.

Two self-contained documents are produced for every accepted application:

* a screening success letter (provisional admission), and
* a statutory declaration / matriculation oath form.

Both follow the same house style as the other printable documents in the
project (academic calendar, registration slip, transcript): HTML rendered
through :mod:`xhtml2pdf`. The university crest and the applicant's passport
photograph are embedded as base64 data URIs so a downloaded PDF needs no
network access to display them.
"""
import base64
import os
from datetime import date
from io import BytesIO

from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from xhtml2pdf import pisa

UNIVERSITY_NAME = 'Bayelsa Medical University'
UNIVERSITY_ADDRESS = 'P.M.B. 145, Yenagoa, Bayelsa State, Nigeria'
UNIVERSITY_MOTTO = 'Knowledge, Service and Humanity'
ADMISSION_OFFICER = 'Mr. Jones Igene'
OFFICER_TITLE = 'Admission Officer'


def _file_to_data_uri(path):
    """Return a base64 data URI for an image file, or '' if it is missing."""
    if not path or not os.path.isfile(path):
        return ''
    with open(path, 'rb') as fh:
        data = fh.read()
    ext = os.path.splitext(path)[1].lower().lstrip('.')
    mime = {
        'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'gif': 'image/gif', 'webp': 'image/webp',
    }.get(ext, 'image/png')
    return f'data:{mime};base64,{base64.b64encode(data).decode()}'


def _logo_data_uri():
    path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'portals', 'static', 'portals', 'bmu_logo.png',
    )
    return _file_to_data_uri(path)


def _passport_data_uri(application):
    passport = getattr(application, 'passport', None)
    if not passport:
        return ''
    try:
        return _file_to_data_uri(passport.path)
    except (ValueError, OSError):
        return ''


def academic_session(reference=None):
    """Return the session label an application is being admitted into.

    A session runs from August to July, so admissions issued on or after
    August belong to the session starting that year.
    """
    reference = reference or timezone.localdate()
    start = reference.year if reference.month >= 8 else reference.year - 1
    return f'{start}/{start + 1}'


def faculty_label(program):
    if program is None:
        return UNIVERSITY_NAME
    college = getattr(program, 'college', None)
    if college is not None:
        return college.name
    department = getattr(program, 'department', None)
    if department is not None:
        return department.parent_name or department.name
    return UNIVERSITY_NAME


def build_context(application):
    issued = timezone.localtime(timezone.now())
    program = application.program
    applicant_name = f'{application.first_name} {application.last_name}'.strip()
    return {
        'university_name': UNIVERSITY_NAME,
        'university_address': UNIVERSITY_ADDRESS,
        'motto': UNIVERSITY_MOTTO,
        'officer_name': ADMISSION_OFFICER,
        'officer_title': OFFICER_TITLE,
        'application': application,
        'reference': application.id,
        'applicant_name': applicant_name,
        'applicant_email': application.email,
        'applicant_phone': application.phone,
        'applicant_address': application.address,
        'program_title': program.title if program else '',
        'program_degree': program.degree if program else '',
        'program_duration': program.duration if program else '',
        'faculty': faculty_label(program),
        'session': academic_session(issued.date()),
        'student_type': application.get_student_type_display(),
        'issued_date': issued,
        'issued_date_long': issued.strftime('%d %B %Y'),
        'logo_data_uri': _logo_data_uri(),
        'passport_data_uri': _passport_data_uri(application),
        'generated_date': date.today(),
    }


def _render_pdf(template, context, filename):
    html = render_to_string(template, context)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
    if pdf.err:
        return HttpResponse('Error generating PDF', status=500)
    response = HttpResponse(result.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


def success_letter_response(application):
    context = build_context(application)
    filename = f'screening_success_letter_{application.id}.pdf'
    return _render_pdf('admissions/success_letter.html', context, filename)


def oath_form_response(application):
    context = build_context(application)
    filename = f'statutory_declaration_{application.id}.pdf'
    return _render_pdf('admissions/oath_form.html', context, filename)


def receipt_context(application):
    """Context for the payment receipt PDF."""
    context = build_context(application)
    paid_at = application.paid_at or timezone.now()
    context.update({
        'currency': application.payment_currency or 'NGN',
        'amount_display': (
            f'{application.payment_amount:,.2f}' if application.payment_amount else '0.00'
        ),
        'payment_method': application.get_payment_method_display() or 'Not specified',
        'payment_reference': application.payment_reference or '—',
        'payment_status': application.get_payment_status_display(),
        'is_paid': application.payment_status == 'completed',
        'paid_at': paid_at,
        'paid_at_long': paid_at.strftime('%d %B %Y, %H:%M'),
    })
    return context


def receipt_response(application):
    context = receipt_context(application)
    filename = f'payment_receipt_{application.id}.pdf'
    return _render_pdf('admissions/payment_receipt.html', context, filename)
