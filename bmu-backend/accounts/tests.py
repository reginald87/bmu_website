from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.urls import reverse

from .models import PasswordResetToken

User = get_user_model()


class PasswordResetTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jane', email='jane@example.com',
            password='oldpassword1', first_name='Jane'
        )
        self.request_url = reverse('password-reset-request')
        self.confirm_url = reverse('password-reset-confirm')

    def _latest_code(self):
        token = PasswordResetToken.objects.filter(user=self.user).first()
        return token.token

    def test_request_sends_code_email(self):
        response = self.client.post(self.request_url, {'email': 'jane@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['jane@example.com'])
        code = self._latest_code()
        self.assertEqual(len(code), 6)
        self.assertIn(code, mail.outbox[0].body)

    def test_request_does_not_reveal_unknown_email(self):
        response = self.client.post(self.request_url, {'email': 'nobody@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(len(mail.outbox), 0)

    def test_request_invalidates_previous_codes(self):
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        old_code = self._latest_code()
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        new_code = self._latest_code()
        self.assertNotEqual(old_code, new_code)
        old_token = PasswordResetToken.objects.get(token=old_code)
        self.assertTrue(old_token.is_used)

    def test_confirm_resets_password(self):
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        code = self._latest_code()
        response = self.client.post(self.confirm_url, {
            'email': 'jane@example.com',
            'code': code,
            'new_password': 'newpassword1',
            'new_password_confirm': 'newpassword1',
        })
        self.assertEqual(response.status_code, 200, response.json())

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword1'))
        # Security notice sent after reset
        self.assertEqual(len(mail.outbox), 2)

    def test_confirm_rejects_wrong_code(self):
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        response = self.client.post(self.confirm_url, {
            'email': 'jane@example.com',
            'code': '000000',
            'new_password': 'newpassword1',
            'new_password_confirm': 'newpassword1',
        })
        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('oldpassword1'))

    def test_confirm_rejects_reused_code(self):
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        code = self._latest_code()
        payload = {
            'email': 'jane@example.com',
            'code': code,
            'new_password': 'newpassword1',
            'new_password_confirm': 'newpassword1',
        }
        self.assertEqual(self.client.post(self.confirm_url, payload).status_code, 200)
        response = self.client.post(self.confirm_url, payload)
        self.assertEqual(response.status_code, 400)

    def test_confirm_rejects_expired_code(self):
        from django.utils import timezone
        from datetime import timedelta
        self.client.post(self.request_url, {'email': 'jane@example.com'})
        code = self._latest_code()
        PasswordResetToken.objects.filter(token=code).update(
            expires_at=timezone.now() - timedelta(minutes=1)
        )
        response = self.client.post(self.confirm_url, {
            'email': 'jane@example.com',
            'code': code,
            'new_password': 'newpassword1',
            'new_password_confirm': 'newpassword1',
        })
        self.assertEqual(response.status_code, 400)

    def test_password_change_sends_security_email(self):
        from rest_framework.test import APIClient
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post(reverse('password-change'), {
            'old_password': 'oldpassword1',
            'new_password': 'newpassword1',
            'new_password_confirm': 'newpassword1',
        })
        self.assertEqual(response.status_code, 200, response.json())
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('password was changed', mail.outbox[0].subject.lower())


class EmailVerificationTests(TestCase):
    def setUp(self):
        self.register_url = reverse('user-register')

    def _register(self):
        return self.client.post(self.register_url, {
            'username': 'john',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'applicant',
            'password': 'password123',
            'password_confirm': 'password123',
        })

    def test_registration_sends_verification_email(self):
        response = self._register()
        self.assertEqual(response.status_code, 201, response.json())
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['john@example.com'])
        body = mail.outbox[0].body
        self.assertIn('/verify-email?uid=', body)
        self.assertIn('token=', body)

    def test_verify_email_endpoint_confirms_account(self):
        self._register()
        user = User.objects.get(email='john@example.com')
        self.assertFalse(user.is_email_verified)

        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.get(
            reverse('verify-email'), {'uid': uid, 'token': token}
        )
        self.assertEqual(response.status_code, 200)

        user.refresh_from_db()
        self.assertTrue(user.is_email_verified)

    def test_verify_email_rejects_bad_token(self):
        self._register()
        user = User.objects.get(email='john@example.com')
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        response = self.client.get(
            reverse('verify-email'), {'uid': uid, 'token': 'garbage'}
        )
        self.assertEqual(response.status_code, 400)
        user.refresh_from_db()
        self.assertFalse(user.is_email_verified)
