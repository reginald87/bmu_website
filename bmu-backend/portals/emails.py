"""Notification emails for portal workflows (registrations, results, scholarships)."""
from django.conf import settings

from core.email import send_templated_email

PORTAL_BASE = getattr(settings, 'FRONTEND_URL', 'https://bmu.edu.ng') or 'https://bmu.edu.ng'
ACADEMICS_RECORDS_EMAIL = getattr(settings, 'ACADEMICS_RECORDS_EMAIL', '') or getattr(settings, 'ADMISSIONS_OFFICE_EMAIL', '')


def _send_notification(*, recipient, subject, heading, body, name='there', details=None,
                       next_steps=None, preheader=None, action_url=None, action_label=None):
    return send_templated_email(
        subject=subject,
        template='notification',
        context={
            'name': name,
            'heading': heading,
            'body': body,
            'details': details or [],
            'next_steps': next_steps,
            'preheader': preheader or heading,
            'action_url': action_url,
            'action_label': action_label,
        },
        recipient_list=[recipient],
    )


def notify_registration_approved(registration, actor_label):
    """Notify the student after a registration approval step."""
    student = registration.student
    approved_count = registration.courses.filter(approval_status='approved').count()
    return _send_notification(
        recipient=student.email,
        subject=f"Course Registration {registration.student.full_name}",
        heading='Registration Approved',
        body=f'Your course registration for {registration.academic_year} ({registration.semester.capitalize()} semester) '
             f'has been approved by the {actor_label}.',
        name=student.full_name,
        details=[
            {'label': 'Session', 'value': registration.academic_year},
            {'label': 'Semester', 'value': registration.semester.capitalize()},
            {'label': 'Level', 'value': str(registration.level)},
            {'label': 'Approved courses', 'value': str(approved_count)},
        ],
        next_steps='Continue to the next approval stage or check your portal for the latest status.',
        action_url=f'{PORTAL_BASE}/portals/student',
        action_label='View registration',
    )


def notify_registration_finalized(registration, course_count, student_courses):
    """Notify the student once the registration is finalized into enrolments."""
    student = registration.student
    return _send_notification(
        recipient=student.email,
        subject=f"Course Registration Finalized — {registration.academic_year}",
        heading='Registration Finalized',
        body=f'Your course registration for {registration.academic_year} '
             f'({registration.semester.capitalize()} semester) has been finalized. '
             f'You are now enrolled in {course_count} course(s).',
        name=student.full_name,
        details=[
            {'label': 'Session', 'value': registration.academic_year},
            {'label': 'Semester', 'value': registration.semester.capitalize()},
            {'label': 'Level', 'value': str(registration.level)},
            {'label': 'Enrolled courses', 'value': ', '.join(sc.course.code for sc in student_courses)},
        ],
        next_steps='Your timeline and grades will now appear in your student portal.',
        action_url=f'{PORTAL_BASE}/portals/student',
        action_label='Open your portal',
    )


def notify_course_rejected(registration, course_code, reason):
    """Notify the student that a course in their registration was rejected."""
    student = registration.student
    return _send_notification(
        recipient=student.email,
        subject=f"Course {course_code} Rejected in Registration",
        heading='Course Rejected',
        body=f'A course in your registration for {registration.academic_year} '
             f'({registration.semester.capitalize()} semester) was not approved.',
        name=student.full_name,
        details=[
            {'label': 'Course', 'value': course_code},
            {'label': 'Reason', 'value': reason or 'No reason provided by the approver'},
        ],
        action_url=f'{PORTAL_BASE}/portals/student',
        action_label='View registration',
    )


def notify_results_rejected(recipient, student_name, course_codes, data, author_label):
    """Send to the submitting lecturer(s) that grades were rejected by HOD/Dean/Senate."""
    return _send_notification(
        recipient=recipient,
        subject='Grade Submissions Rejected',
        heading='Grades Rejected',
        body=f'The {author_label} has rejected the grades you submitted for the following student(s) '
             f'({data.session}, {data.semester.capitalize()} semester).',
        name=student_name,
        details=[
            {'label': 'Course(s)', 'value': ', '.join(course_codes)},
            {'label': 'Reason', 'value': data.rejection_reason or 'No reason provided'},
        ],
        next_steps='Correct the grades in the lecturer portal and resubmit for approval.',
        action_url=f'{PORTAL_BASE}/portals/lecturer',
        action_label='Correct grades',
    )


def notify_results_published(student, session, semester, gpa):
    """Notify the student once their semester results are published."""
    return _send_notification(
        recipient=student.email,
        subject=f'Results Published — {session} ({semester.capitalize()})',
        heading='Your Results Are Out',
        body=f'Your results for {session} ({semester.capitalize()} semester) have been published.',
        name=student.full_name,
        details=[
            {'label': 'Session', 'value': session},
            {'label': 'Semester', 'value': semester.capitalize()},
            {'label': 'Semester GPA', 'value': str(gpa)},
        ],
        next_steps='Review your transcript and course grades in the student portal.',
        action_url=f'{PORTAL_BASE}/portals/student',
        action_label='View results',
    )


def notify_scholarship_updated(record, verified, note=None):
    """Notify the student of a scholarship verification outcome."""
    student = record.student
    if verified:
        heading = 'Scholarship Verified'
        body = f'Your scholarship from {record.scholarship_body} has been verified.'
    else:
        heading = 'Scholarship Update'
        body = f'Your scholarship from {record.scholarship_body} could not be verified.'
    return _send_notification(
        recipient=student.email,
        subject=f'Scholarship {("Verified" if verified else "Update")} — {record.session}',
        heading=heading,
        body=body,
        name=student.full_name,
        details=[
            {'label': 'Session', 'value': record.session},
            {'label': 'Scholarship body', 'value': record.scholarship_body},
            {'label': 'Status', 'value': record.get_status_display()},
            {'label': 'Reference', 'value': record.reference},
            {'label': 'Notes', 'value': note or record.notes or '-'},
        ],
        next_steps='If you believe this decision is incorrect, please contact the Bursary office.',
        action_url=f'{PORTAL_BASE}/portals/student',
        action_label='Open your portal',
    )