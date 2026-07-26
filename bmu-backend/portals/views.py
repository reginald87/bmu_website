import base64
import os
from io import BytesIO
from datetime import date
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from xhtml2pdf import pisa
from .models import Registration
from django.conf import settings


def _to_base64_data_uri(path):
    """Read a file and return a base64 data URI. Returns empty string if file not found."""
    if not path or not os.path.isfile(path):
        return ''
    with open(path, 'rb') as f:
        data = f.read()
    ext = os.path.splitext(path)[1].lower()
    mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'gif': 'image/gif', 'webp': 'image/webp'}.get(ext.lstrip('.'), 'image/png')
    return f'data:{mime};base64,{base64.b64encode(data).decode()}'


def _get_logo_data_uri():
    logo_path = os.path.join(os.path.dirname(__file__), 'static', 'portals', 'bmu_logo.png')
    return _to_base64_data_uri(logo_path)


def _make_pdf(template, context, filename):
    html = render_to_string(template, context)
    result = BytesIO()
    pdf = pisa.pisaDocument(BytesIO(html.encode('UTF-8')), result)
    if pdf.err:
        return HttpResponse('Error generating PDF', status=500)
    response = HttpResponse(result.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


def _get_student_info(student):
    profile = getattr(student, 'student_profile', None)
    photo_uri = ''
    if student.profile_image and os.path.isfile(student.profile_image.path):
        photo_uri = _to_base64_data_uri(student.profile_image.path)
    return {
        'full_name': student.full_name,
        'matric_number': profile.matric_number if profile else None,
        'program_name': student.program.title if hasattr(student, 'program') and student.program else None,
        'current_level': profile.current_level if profile else None,
        'photo_data_uri': photo_uri,
    }


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_combined_slip(request):
    """Download registration slip with both semesters for an academic year"""
    academic_year = request.query_params.get('academic_year')
    student_id = request.query_params.get('student_id')

    if student_id:
        from django.contrib.auth import get_user_model
        student = get_object_or_404(get_user_model(), id=student_id)
    else:
        student = request.user

    registrations = Registration.objects.filter(
        student=student,
        academic_year=academic_year,
    ).order_by('semester').select_related('student__student_profile', 'student__program')

    if not registrations:
        return HttpResponse('No registration found for the specified academic year', status=404)

    info = _get_student_info(student)

    semesters = []
    for reg in registrations:
        courses = reg.courses.select_related('course').order_by('course__code')
        total_units = sum(rc.course.credit_units for rc in courses)
        semesters.append({
            'registration': reg,
            'courses': courses,
            'total_credit_units': total_units,
        })

    filename = f"registration_slip_{registrations[0].academic_year.replace('/', '_')}_{student.full_name.replace(' ', '_')}.pdf"
    return _make_pdf('portals/registration_slip.html', {
        'student': info,
        'semesters': semesters,
        'academic_year': academic_year or registrations[0].academic_year,
        'generated_date': date.today(),
        'logo_data_uri': _get_logo_data_uri(),
    }, filename)
