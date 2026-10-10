from django.test import TestCase

from academics.models import College, Program


def make_college(**overrides):
    defaults = dict(
        name='College of Medicine',
        slug='college-of-medicine',
        description='Flagship college.',
        established_year=2018,
    )
    defaults.update(overrides)
    return College.objects.create(**defaults)


def make_program(college, title, slug, is_active=True):
    return Program.objects.create(
        title=title,
        slug=slug,
        level='undergraduate',
        duration='6 years',
        requirements='Five O-level credits',
        application_fee_local=10000,
        application_fee_intl=50,
        college=college,
        is_active=is_active,
    )


class CollegeProgramCountApiTests(TestCase):
    """The public colleges API reports how many active programs each college has."""

    def setUp(self):
        self.college = make_college()
        make_program(self.college, 'Medicine and Surgery', 'medicine-and-surgery')
        make_program(self.college, 'Human Anatomy', 'human-anatomy')
        make_program(self.college, 'Retired Program', 'retired-program', is_active=False)

    def _college_payload(self, slug='college-of-medicine'):
        res = self.client.get('/api/public/colleges')
        self.assertEqual(res.status_code, 200)
        items = res.json()['items']
        return next(c for c in items if c['slug'] == slug)

    def test_program_count_excludes_inactive_programs(self):
        payload = self._college_payload()
        self.assertEqual(payload['program_count'], 2)

    def test_college_detail_includes_program_count(self):
        res = self.client.get('/api/public/colleges/college-of-medicine')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['program_count'], 2)
