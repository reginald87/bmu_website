from django.test import TestCase

from content.models import PageSection


class PageSectionApiTests(TestCase):
    """Public page-sections API must accept keys that contain slashes.

    Seeded keys include values like ``research/funding`` and ``centres/career``,
    so the route must allow slashes (Django's ``path`` converter).
    """

    def setUp(self):
        PageSection.objects.create(
            page_key='zztest/nested/deep', section_key='alpha',
            content_type='custom', title='Deep', data=[], display_order=1,
        )
        PageSection.objects.create(
            page_key='zztest-plain', section_key='beta',
            content_type='custom', title='Plain', data=[], display_order=1,
        )

    def test_slash_key_returns_created_row(self):
        res = self.client.get('/api/public/page-sections/zztest/nested/deep')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]['title'], 'Deep')

    def test_slash_key_without_rows_returns_empty(self):
        res = self.client.get('/api/public/page-sections/zztest/nested')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])

    def test_seeded_slash_key_returns_rows(self):
        res = self.client.get('/api/public/page-sections/research/funding')
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()), 1)

    def test_plain_key_returns_created_row(self):
        res = self.client.get('/api/public/page-sections/zztest-plain')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]['title'], 'Plain')

    def test_unknown_key_returns_empty(self):
        res = self.client.get('/api/public/page-sections/does/not/exist')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), [])
