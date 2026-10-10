from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from academics.models import Program
from core.email import send_templated_email
from .emails import notify_application_status_change
from .models import Application

User = get_user_model()


def make_program():
    return Program.objects.create(
        title='MBBS',
        slug='mbbs',
        level='undergraduate',
        duration='6 years',
        requirements='Five O-level credits',
        application_fee_local=10000,
        application_fee_intl=50,
    )


def make_application(program, **overrides):
    defaults = dict(
        first_name='Jane',
        last_name='Doe',
        email='jane@example.com',
        phone='08012345678',
        date_of_birth='2000-01-01',
        gender='female',
        address='Yenagoa, Bayelsa',
        program=program,
        student_type='LOCAL',
        payment_currency='NGN',
        status='submitted',
    )
    defaults.update(overrides)
    return Application.objects.create(**defaults)


class EmailServiceTests(TestCase):
    def test_sends_rendered_template(self):
        sent = send_templated_email(
            subject='Hello',
            template='application_submitted',
            context={'first_name': 'Jane', 'application_id': 'BMU2025-0001',
                     'program': 'MBBS', 'status_display': 'Submitted',
                     'university_name': 'Bayelsa Medical University'},
            recipient_list=['jane@example.com'],
        )
        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['jane@example.com'])
        self.assertIn('BMU2025-0001', mail.outbox[0].alternatives[0][0])

    def test_returns_false_without_recipients(self):
        self.assertFalse(send_templated_email(
            subject='Hello', template='application_submitted',
            context={}, recipient_list=[],
        ))
        self.assertEqual(len(mail.outbox), 0)

    def test_failure_is_logged_not_raised(self):
        with patch('core.email.EmailMultiAlternatives.send',
                   side_effect=RuntimeError('smtp down')):
            sent = send_templated_email(
                subject='Hello', template='application_submitted',
                context={}, recipient_list=['jane@example.com'],
            )
        self.assertFalse(sent)


class SubmissionEmailTests(TestCase):
    def setUp(self):
        self.program = make_program()
        self.client = APIClient()

    def test_public_submission_sends_confirmation_and_office_alert(self):
        response = self.client.post('/api/public/applications', {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': 'jane@example.com',
            'phone': '08012345678',
            'date_of_birth': '2000-01-01',
            'gender': 'female',
            'address': 'Yenagoa',
            'program_id': self.program.id,
            'student_type': 'LOCAL',
        }, format='json')

        payload = response.json()
        self.assertEqual(response.status_code, 200, payload)
        application_id = payload['id']

        recipients = sorted(r for m in mail.outbox for r in m.to)
        self.assertEqual(recipients, ['admissions@bmu.edu.ng', 'jane@example.com'])

        confirmation = next(m for m in mail.outbox if 'jane@example.com' in m.to)
        self.assertIn(application_id, confirmation.subject)
        self.assertIn(application_id, confirmation.body)

        alert = next(m for m in mail.outbox if 'admissions@bmu.edu.ng' in m.to)
        self.assertIn(application_id, alert.subject)

    def test_drf_submit_sends_confirmation(self):
        user = User.objects.create_user(
            username='jane', email='jane@example.com', password='pass1234')
        application = make_application(self.program, applicant=user, status='draft',
                                       payment_status='completed')
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.post(
            reverse('application-submit', args=[application.id]))

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(mail.outbox), 2)
        self.assertTrue(any('jane@example.com' in m.to for m in mail.outbox))
        self.assertTrue(any('admissions@bmu.edu.ng' in m.to for m in mail.outbox))


class StatusChangeEmailTests(TestCase):
    def setUp(self):
        self.program = make_program()
        self.application = make_application(self.program, status='submitted')
        self.admin = User.objects.create_superuser(
            username='admin', email='admin@bmu.edu.ng', password='pass1234')
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    def _change_status(self, new_status):
        return self.client.post(
            reverse('application-update-status', args=[self.application.id]),
            {'status': new_status}, format='json')

    def test_no_email_when_status_unchanged(self):
        response = self._change_status('submitted')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)

    def test_revision_requested_sends_action_email(self):
        response = self._change_status('revision_requested')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ['jane@example.com'])
        self.assertIn('revision', message.subject.lower())
        self.assertIn(self.application.id, message.body)

    def test_accepted_sends_matric_number_and_creates_student(self):
        response = self._change_status('accepted')
        self.assertEqual(response.status_code, 200)
        matric_number = response.data['matric_number']

        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ['jane@example.com'])
        self.assertIn(matric_number, message.body)

        student = User.objects.get(email='jane@example.com')
        self.assertEqual(student.role, 'student')
        self.assertTrue(student.is_email_verified)

    def test_status_change_without_email_address_does_not_fail(self):
        self.application.email = ''
        self.application.save()
        response = self._change_status('under_review')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)


class AdminSaveModelTests(TestCase):
    def setUp(self):
        from django.contrib import admin
        self.model_admin = admin.site._registry[Application]
        self.program = make_program()
        self.application = make_application(self.program, status='submitted')
        self.admin_user = User.objects.create_superuser(
            username='admin2', email='admin2@bmu.edu.ng', password='pass1234')
        self.request = MagicMock()
        self.request.user = self.admin_user

    def _save(self, obj, change):
        self.model_admin.save_model(self.request, obj, MagicMock(), change)

    def test_status_change_in_admin_sends_email(self):
        self.application.status = 'interview'
        self._save(self.application, change=True)

        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['jane@example.com'])
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'interview')

    def test_no_email_when_unchanged(self):
        self._save(self.application, change=True)
        self.assertEqual(len(mail.outbox), 0)

    def test_acceptance_in_admin_creates_student_and_emails(self):
        self.application.status = 'accepted'
        self._save(self.application, change=True)

        self.assertEqual(len(mail.outbox), 1)
        student = User.objects.get(email='jane@example.com')
        self.assertEqual(student.role, 'student')
        self.assertIn('UG/', mail.outbox[0].body)

    def test_new_application_created_as_submitted_notifies(self):
        new_app = make_application(self.program, status='submitted')
        self._save(new_app, change=False)
        self.assertEqual(len(mail.outbox), 2)
        recipients = sorted(r for m in mail.outbox for r in m.to)
        self.assertEqual(recipients, ['admissions@bmu.edu.ng', 'jane@example.com'])


class PaymentReceiptTests(TestCase):
    def setUp(self):
        self.program = make_program()
        self.application = make_application(
            self.program, status='draft', payment_status='pending')
        self.user = User.objects.create_user(
            username='jane', email='jane@example.com', password='pass1234')
        self.application.applicant = self.user
        self.application.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_payment_sends_receipt(self):
        response = self.client.post(
            reverse('application-payment', args=[self.application.id]),
            {'payment_method': 'bank_deposit', 'payment_reference': 'REF123'},
            format='json')

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ['jane@example.com'])
        self.assertIn('payment', message.subject.lower())
        self.assertIn(self.application.id, message.body)
        self.assertIn('REF123', message.body)


class ContactAcknowledgementTests(TestCase):
    def test_contact_form_sends_acknowledgement(self):
        from rest_framework.test import APIClient
        client = APIClient()
        response = client.post('/api/public/contact', {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'subject': 'admissions',
            'message': 'When does the session start?',
        }, format='json')

        self.assertEqual(response.status_code, 200, response.json())
        self.assertEqual(len(mail.outbox), 2)
        recipients = [m.to for m in mail.outbox]
        self.assertIn(['jane@example.com'], recipients)
        self.assertIn(['admissions@bmu.edu.ng'], recipients)
        ack = next(m for m in mail.outbox if m.to == ['jane@example.com'])
        self.assertIn('received', ack.subject.lower())


class JobApplicationAcknowledgementTests(TestCase):
    def test_job_application_sends_acknowledgement(self):
        from django.utils import timezone
        from datetime import date
        from careers.models import JobPosting

        today = timezone.now().date()
        job = JobPosting.objects.create(
            title='Lecturer',
            description='Teaching duties',
            department='Medicine',
            job_type='full_time',
            location='Yenagoa',
            requirements='BSc',
            responsibilities='Teach',
            education_requirements='BSc',
            experience_requirements='3 years',
            posted_date=today,
            application_deadline=date(today.year + 1, 12, 31),
            status='published',
            contact_email='careers@bmu.edu.ng',
        )
        payload = {
            'job': job.id,
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': 'jane@example.com',
            'phone': '08012345678',
            'address': 'Yenagoa',
            'city': 'Yenagoa',
            'state': 'Bayelsa',
            'country': 'Nigeria',
            'highest_qualification': 'BSc',
            'years_of_experience': 3,
            'cover_letter': 'I would be a great fit.',
        }

        from rest_framework.test import APIClient
        client = APIClient()
        from django.core.files.uploadedfile import SimpleUploadedFile
        payload['resume'] = SimpleUploadedFile(
            'resume.pdf', b'%PDF-1.4 test', content_type='application/pdf')
        response = client.post(
            reverse('job-application-create'), payload, format='multipart')

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['jane@example.com'])
        self.assertIn('Lecturer', mail.outbox[0].subject)


class StatusChangeHelperTests(TestCase):
    def setUp(self):
        self.program = make_program()

    def test_skips_draft_status(self):
        application = make_application(self.program, status='draft')
        self.assertFalse(notify_application_status_change(application, 'submitted'))

    def test_submitted_routes_to_confirmation(self):
        application = make_application(self.program, status='submitted')
        self.assertTrue(notify_application_status_change(application, 'draft'))
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(application.id, mail.outbox[0].subject)


class AdmissionDocumentTests(TestCase):
    def setUp(self):
        self.program = make_program()
        self.user = User.objects.create_user(
            username='jane', email='jane@example.com', password='pass1234')
        self.application = make_application(
            self.program, applicant=self.user, status='accepted')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_success_letter_is_a4_pdf(self):
        response = self.client.get(
            reverse('application-success-letter', args=[self.application.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))
        self.assertIn(self.application.id, response['Content-Disposition'])

    def test_oath_form_is_a4_pdf(self):
        response = self.client.get(
            reverse('application-oath-form', args=[self.application.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))
        self.assertIn(self.application.id, response['Content-Disposition'])

    def test_letter_blocked_until_accepted(self):
        self.application.status = 'under_review'
        self.application.save()
        response = self.client.get(
            reverse('application-success-letter', args=[self.application.id]))
        self.assertEqual(response.status_code, 409)

    def test_letter_blocked_for_other_users(self):
        other = User.objects.create_user(
            username='sam', email='sam@example.com', password='pass1234')
        self.client.force_authenticate(user=other)
        response = self.client.get(
            reverse('application-success-letter', args=[self.application.id]))
        self.assertEqual(response.status_code, 403)

    def test_public_download_uses_public_id(self):
        response = self.client.get(
            f'/api/public/applications/{self.application.public_id}/success-letter')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_public_download_rejects_sequential_id(self):
        response = self.client.get(
            f'/api/public/applications/{self.application.id}/success-letter')
        self.assertEqual(response.status_code, 404)

    def test_public_download_blocked_until_accepted(self):
        self.application.status = 'submitted'
        self.application.save()
        response = self.client.get(
            f'/api/public/applications/{self.application.public_id}/oath-form')
        self.assertEqual(response.status_code, 409)


class DocumentContextTests(TestCase):
    def test_academic_session_boundaries(self):
        from datetime import date
        from .documents import academic_session

        self.assertEqual(academic_session(date(2026, 9, 1)), '2026/2027')
        self.assertEqual(academic_session(date(2026, 1, 15)), '2025/2026')

    def test_faculty_label_falls_back_to_university(self):
        from .documents import faculty_label
        self.assertEqual(faculty_label(None), 'Bayelsa Medical University')


class ProgramApplicationStatusTests(TestCase):
    """Applicants must not be able to apply to a program that is closed."""

    def setUp(self):
        self.program = make_program()
        self.client = APIClient()

    def _payload(self):
        return {
            'first_name': 'Jane', 'last_name': 'Doe',
            'email': 'jane@example.com', 'phone': '08012345678',
            'date_of_birth': '2000-01-01', 'gender': 'female',
            'address': 'Yenagoa',
            'program_id': self.program.id, 'student_type': 'LOCAL',
        }

    def test_closed_program_hidden_from_apply_list(self):
        self.program.applications_open = False
        self.program.save()
        res = self.client.get('/api/public/apply/programs')
        self.assertEqual(res.status_code, 200)
        self.assertNotIn(self.program.id, [p['id'] for p in res.json()])

    def test_open_program_listed_with_fee(self):
        res = self.client.get('/api/public/apply/programs')
        self.assertEqual(res.status_code, 200)
        listed = {p['id']: p for p in res.json()}
        self.assertIn(self.program.id, listed)
        self.assertEqual(listed[self.program.id]['application_fee_local'], 10000.0)

    def test_closed_program_rejected_on_submit(self):
        self.program.applications_open = False
        self.program.save()
        res = self.client.post('/api/public/applications', self._payload(), format='json')
        self.assertEqual(res.status_code, 400, res.content)
        self.assertIn('closed', res.json()['detail'].lower())

    def test_open_program_submits(self):
        res = self.client.post('/api/public/applications', self._payload(), format='json')
        self.assertEqual(res.status_code, 200, res.content)

