from datetime import timedelta
from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core import mail
from django.test import RequestFactory, TestCase
from django.urls import reverse
from django.utils import timezone
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
            'jamb_registration_number': '202660304236IE',
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

    def test_accepting_undergraduate_does_not_assign_matric_number(self):
        response = self._change_status('accepted')
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data['matric_number'])

        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ['jane@example.com'])

        student = User.objects.get(email='jane@example.com')
        self.assertEqual(student.role, 'student')
        self.assertTrue(student.is_email_verified)
        profile = student.student_profile
        self.assertFalse(profile.matric_number)
        self.assertIsNone(profile.matriculated_at)

    def test_accepting_postgraduate_assigns_university_number(self):
        self.program.level = 'masters'
        self.program.save()
        response = self._change_status('accepted')
        self.assertEqual(response.status_code, 200)
        number = response.data['matric_number']
        self.assertTrue(number.startswith('MSC/BMU/'))

        student = User.objects.get(email='jane@example.com')
        self.assertEqual(student.student_profile.matric_number, number)
        self.assertIn(number, mail.outbox[0].body)

    def test_status_change_without_email_address_does_not_fail(self):
        self.application.email = ''
        self.application.save()
        response = self._change_status('under_review')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)


class JambUniquenessTests(TestCase):
    def setUp(self):
        cache.clear()
        self.program = make_program()
        self.client = APIClient()

    def _submit(self, jamb=None, **overrides):
        payload = {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': 'jane@example.com',
            'phone': '08012345678',
            'date_of_birth': '2000-01-01',
            'gender': 'female',
            'address': 'Yenagoa',
            'program_id': self.program.id,
            'student_type': 'LOCAL',
        }
        if jamb is not None:
            payload['jamb_registration_number'] = jamb
        payload.update(overrides)
        return self.client.post('/api/public/applications', payload, format='json')

    def test_undergraduate_submission_requires_jamb(self):
        response = self._submit()
        self.assertEqual(response.status_code, 400)
        self.assertIn('JAMB', response.json()['detail'])

    def test_duplicate_jamb_is_rejected(self):
        first = self._submit('202660304236IE')
        self.assertEqual(first.status_code, 200, first.content)

        response = self._submit('202660304236IE', email='other@example.com',
                                phone='08011112222')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Application.objects.filter(
            jamb_registration_number='202660304236IE').count(), 1)

    def test_jamb_is_uppercased_and_unique_case_insensitively(self):
        response = self._submit(jamb='202660304236ie')
        self.assertEqual(response.status_code, 200, response.json())
        application = Application.objects.get(id=response.json()['id'])
        self.assertEqual(application.jamb_registration_number, '202660304236IE')

        duplicate = self._submit(jamb='202660304236IE')
        self.assertEqual(duplicate.status_code, 400)

    def test_postgraduate_submission_allows_missing_jamb(self):
        program = Program.objects.create(
            title='M.Sc. Public Health',
            slug='msc-public-health',
            level='masters',
            duration='2 years',
            requirements='B.Sc.',
            application_fee_local=15000,
            application_fee_intl=75,
        )
        response = self._submit(program_id=program.id)
        self.assertEqual(response.status_code, 200, response.json())
        application = Application.objects.get(id=response.json()['id'])
        self.assertIsNone(application.jamb_registration_number)

    def test_multiple_applications_without_jamb_can_coexist(self):
        first = make_application(self.program, status='submitted',
                                 jamb_registration_number=None)
        second = make_application(self.program, status='submitted',
                                  email='other@example.com',
                                  jamb_registration_number=None)
        self.assertIsNone(first.jamb_registration_number)
        self.assertIsNone(second.jamb_registration_number)


class RequestJambDetailsActionTests(TestCase):
    def setUp(self):
        from django.contrib.admin.sites import AdminSite

        from .admin import ApplicationAdmin

        self.program = make_program()
        self.without_jamb = make_application(self.program, status='submitted')
        self.with_jamb = make_application(
            self.program, status='submitted', email='other@example.com',
            jamb_registration_number='202560304236IE')
        admin_user = User.objects.create_superuser(
            username='admin4', email='admin4@bmu.edu.ng', password='pass1234')
        self.admin = ApplicationAdmin(Application, AdminSite())
        self.request = RequestFactory().get('/admin/')
        self.request.user = admin_user

    def test_action_opens_revision_only_for_undergraduates_without_jamb(self):
        queryset = Application.objects.filter(
            id__in=[self.without_jamb.id, self.with_jamb.id])
        with patch.object(self.admin, 'message_user') as message_user:
            self.admin.request_jamb_details(self.request, queryset)

        self.without_jamb.refresh_from_db()
        self.with_jamb.refresh_from_db()

        self.assertEqual(self.without_jamb.status, 'revision_requested')
        self.assertIsNotNone(self.without_jamb.revision_due_at)
        self.assertEqual(self.without_jamb.messages.count(), 1)

        self.assertEqual(self.with_jamb.status, 'submitted')
        self.assertIsNone(self.with_jamb.revision_due_at)
        self.assertEqual(self.with_jamb.messages.count(), 0)

        message_user.assert_called_once()
        self.assertIn('skipped 1', message_user.call_args[0][1])


class RevisionWindowTests(TestCase):
    def setUp(self):
        self.program = make_program()
        self.application = make_application(self.program, status='submitted')
        self.admin = User.objects.create_superuser(
            username='admin3', email='admin3@bmu.edu.ng', password='pass1234')
        self.owner = User.objects.create_user(
            username='jane', email='jane@example.com', password='pass1234')
        self.application.applicant = self.owner
        self.application.jamb_registration_number = '202560304236IE'
        self.application.save()

        self.admin_client = APIClient()
        self.admin_client.force_authenticate(user=self.admin)

    def _change_status(self, new_status, **extra):
        return self.admin_client.post(
            reverse('application-update-status', args=[self.application.id]),
            {'status': new_status, **extra}, format='json')

    def test_requesting_revision_opens_window_with_note(self):
        response = self._change_status('revision_requested', note='Upload a clearer passport')
        self.assertEqual(response.status_code, 200)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'revision_requested')
        self.assertIsNotNone(self.application.revision_due_at)
        self.assertEqual(self.application.revision_note, 'Upload a clearer passport')
        self.assertTrue(self.application.is_editable)

    def test_editing_open_revision_resubmits_and_closes_window(self):
        self.application.status = 'revision_requested'
        self.application.revision_due_at = timezone.now() + timedelta(days=2)
        self.application.save()

        client = APIClient()
        client.force_authenticate(user=self.application.applicant)
        response = client.patch(
            reverse('application-update', args=[self.application.id]),
            {'phone': '08011112222'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)

        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 'submitted')
        self.assertIsNone(self.application.revision_due_at)
        self.assertEqual(self.application.phone, '08011112222')

    def test_expired_revision_blocks_editing(self):
        self.application.status = 'revision_requested'
        self.application.revision_due_at = timezone.now() - timedelta(days=1)
        self.application.save()

        client = APIClient()
        client.force_authenticate(user=self.application.applicant)
        response = client.patch(
            reverse('application-update', args=[self.application.id]),
            {'phone': '08099999999'}, format='json')
        self.assertEqual(response.status_code, 400)

        self.application.refresh_from_db()
        self.assertEqual(self.application.phone, '08012345678')
        self.assertTrue(self.application.revision_expired)


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
        # Undergraduates get no matriculation number on acceptance; they are
        # pointed at the portal to set a password instead.
        self.assertFalse(student.student_profile.matric_number)
        self.assertNotIn('UG/', mail.outbox[0].body)
        self.assertIn('/portals/reset-password', mail.outbox[0].body)

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
            'jamb_registration_number': '202660304236IE',
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


class ApplicationOriginTests(TestCase):
    """Origin fields drive indigene classification."""

    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.program = make_program()
        self.client = APIClient()

    def _post(self, **overrides):
        payload = {
            'first_name': 'Jane', 'last_name': 'Doe',
            'email': 'jane@example.com', 'phone': '08012345678',
            'date_of_birth': '2000-01-01', 'gender': 'female',
            'address': 'Yenagoa', 'program_id': self.program.id,
            'student_type': 'LOCAL',
            'jamb_registration_number': '202660304236IE',
        }
        payload.update(overrides)
        return self.client.post('/api/public/applications', payload, format='json')

    def test_bayelsa_origin_is_indigene(self):
        res = self._post(state_of_origin='Bayelsa', lga='Yenagoa', nationality='Nigeria')
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertTrue(app.is_indigene)
        self.assertEqual(app.state_of_origin, 'Bayelsa')
        self.assertEqual(app.lga, 'Yenagoa')

    def test_other_state_is_not_indigene(self):
        res = self._post(state_of_origin='Lagos', lga='Ikeja', nationality='Nigeria')
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertFalse(app.is_indigene)

    def test_international_is_not_indigene(self):
        res = self._post(
            student_type='INTL', nationality='Ghana',
            state_of_origin='Greater Accra', lga='Accra Metropolitan',
        )
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertFalse(app.is_indigene)
        self.assertEqual(app.nationality, 'Ghana')


class ApplicationAccountLinkTests(TestCase):
    """Applications submitted while signed in belong to the applicant."""

    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.program = make_program()
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='jane', email='jane@example.com', password='testpass123',
        )

    def _payload(self, **overrides):
        payload = {
            'first_name': 'Jane', 'last_name': 'Doe',
            'email': 'jane@example.com', 'phone': '08012345678',
            'date_of_birth': '2000-01-01', 'gender': 'female',
            'address': 'Yenagoa', 'program_id': self.program.id,
            'student_type': 'LOCAL',
            'jamb_registration_number': '202660304236IE',
        }
        payload.update(overrides)
        return payload

    def _token(self):
        from rest_framework_simplejwt.tokens import AccessToken
        return str(AccessToken.for_user(self.user))

    def test_submission_with_token_is_linked_to_account(self):
        res = self.client.post(
            '/api/public/applications', self._payload(), format='json',
            HTTP_AUTHORIZATION=f'Bearer {self._token()}',
        )
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertEqual(app.applicant, self.user)

    def test_guest_submission_has_no_owner(self):
        res = self.client.post(
            '/api/public/applications', self._payload(), format='json',
        )
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertIsNone(app.applicant)

    def test_invalid_token_is_ignored(self):
        res = self.client.post(
            '/api/public/applications', self._payload(), format='json',
            HTTP_AUTHORIZATION='Bearer not-a-real-token',
        )
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertIsNone(app.applicant)

    def test_claim_guest_applications_links_by_email(self):
        make_application(self.program, applicant=None, email='jane@example.com')
        claimed = Application.claim_guest_applications(self.user)
        self.assertEqual(claimed, 1)
        self.assertTrue(
            Application.objects.filter(applicant=self.user, status='submitted').exists()
        )

    def test_application_list_claims_guest_application(self):
        make_application(self.program, applicant=None, email='jane@example.com')
        res = self.client.get(
            '/api/v1/admissions/applications/list/',
            HTTP_AUTHORIZATION=f'Bearer {self._token()}',
        )
        self.assertEqual(res.status_code, 200, res.content)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(Application.objects.get().applicant, self.user)


class JambValidationTests(TestCase):
    """Undergraduate applications must carry a valid JAMB registration number."""

    def setUp(self):
        from django.core.cache import cache
        cache.clear()
        self.program = make_program()
        self.client = APIClient()

    def _post(self, **overrides):
        payload = {
            'first_name': 'Jane', 'last_name': 'Doe',
            'email': 'jane@example.com', 'phone': '08012345678',
            'date_of_birth': '2000-01-01', 'gender': 'female',
            'address': 'Yenagoa', 'program_id': self.program.id,
            'student_type': 'LOCAL',
        }
        payload.update(overrides)
        return self.client.post('/api/public/applications', payload, format='json')

    def test_undergraduate_requires_jamb(self):
        res = self._post()
        self.assertEqual(res.status_code, 400, res.content)
        self.assertIn('jamb', res.json()['detail'].lower())

    def test_invalid_jamb_format_rejected(self):
        res = self._post(jamb_registration_number='12345')
        self.assertEqual(res.status_code, 400, res.content)
        self.assertIn('jamb', res.json()['detail'].lower())

    def test_valid_jamb_is_normalized_and_stored(self):
        res = self._post(jamb_registration_number=' 202660304236ie ')
        self.assertEqual(res.status_code, 200, res.content)
        app = Application.objects.get(id=res.json()['id'])
        self.assertEqual(app.jamb_registration_number, '202660304236IE')

    def test_postgraduate_does_not_require_jamb(self):
        self.program.level = 'masters'
        self.program.save()
        res = self._post()
        self.assertEqual(res.status_code, 200, res.content)


class MatriculationTests(TestCase):
    """Undergraduate numbers are assigned in a batch at matriculation only."""

    def setUp(self):
        from django.contrib import admin
        self.model_admin = admin.site._registry[Application]
        self.model_admin.message_user = MagicMock()
        self.program = make_program()
        self.admin_user = User.objects.create_superuser(
            username='admin4', email='admin4@bmu.edu.ng', password='pass1234')
        self.request = MagicMock()
        self.request.user = self.admin_user

    def _matriculate(self, application):
        self.model_admin.matriculate_undergraduates(
            self.request, Application.objects.filter(pk=application.pk))

    def test_action_assigns_undergraduate_matric_number(self):
        from accounts.models import StudentProfile
        from .views import create_student_record

        application = make_application(self.program, status='accepted')
        create_student_record(application)
        profile = StudentProfile.objects.get(user__email='jane@example.com')
        self.assertFalse(profile.matric_number)

        self._matriculate(application)

        profile.refresh_from_db()
        self.assertTrue(profile.matric_number.startswith('UG/'))
        self.assertIsNotNone(profile.matriculated_at)

    def test_action_skips_non_accepted_applications(self):
        application = make_application(self.program, status='submitted')
        self._matriculate(application)
        self.assertFalse(User.objects.filter(email='jane@example.com').exists())

    def test_action_does_not_renumber_postgraduate(self):
        from accounts.models import StudentProfile
        from .views import create_student_record

        self.program.level = 'masters'
        self.program.save()
        application = make_application(self.program, status='accepted')
        create_student_record(application)
        profile = StudentProfile.objects.get(user__email='jane@example.com')
        number = profile.matric_number
        self.assertTrue(number.startswith('MSC/BMU/'))

        self._matriculate(application)

        profile.refresh_from_db()
        self.assertEqual(profile.matric_number, number)
        self.assertIsNone(profile.matriculated_at)



