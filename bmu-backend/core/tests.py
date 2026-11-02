from django.test import TestCase
from django.utils import timezone

from academics.models import College, Department, Faculty, Leadership, Program
from content.models import Event, NewsItem
from research.models import Publication


class SiteSearchApiTests(TestCase):
    """The public site search must return clickable results.

    Regression: searching publications used the ``authors`` M2M directly with
    ``icontains``, which raised a FieldError (HTTP 500). In development that 500
    silently fell back to mock results whose ``url`` was ``'#'``, so clicking any
    result appeared to do nothing.
    """

    def setUp(self):
        self.college = College.objects.create(
            name='College of Medicine',
            slug='college-of-medicine',
            description='Flagship college.',
            established_year=2018,
        )
        self.department = Department.objects.create(
            name='Human Anatomy',
            slug='human-anatomy',
            code='ANA',
            description='Anatomy department.',
            college_direct=self.college,
        )
        self.faculty = Faculty.objects.create(
            title='Dr.',
            first_name='Ada',
            last_name='Zubairu',
            email='ada.zubairu@bmu.edu.ng',
            position='senior_lecturer',
            research_interests='Malaria and public health',
            bio='Researcher.',
            college=self.college,
            department=self.department,
        )
        self.publication = Publication.objects.create(
            title='Malaria prevention in the Niger Delta',
            publication_type='journal',
            journal_name='Malaria Journal',
            year=2024,
            abstract='A study of malaria prevention.',
        )
        self.publication.authors.add(self.faculty)
        self.leadership = Leadership.objects.create(
            first_name='Dimie',
            last_name='Ogoina',
            title='Prof.',
            position='vc',
        )
        self.news = NewsItem.objects.create(
            title='BMU malaria breakthrough',
            slug='bmu-malaria-breakthrough',
            excerpt='A malaria breakthrough.',
            content='A malaria breakthrough in Bayelsa.',
            category='research',
            author='Communications Office',
            published_at=timezone.now(),
            is_published=True,
        )
        self.event = Event.objects.create(
            title='Malaria Research Symposium',
            slug='malaria-research-symposium',
            description='A symposium on malaria research.',
            event_date='2026-01-15',
            start_time='09:00',
            location='Main Auditorium',
            event_type='conference',
            category='research',
            speakers=[],
            agenda=[],
            is_published=True,
        )
        self.program = Program.objects.create(
            title='Medicine and Surgery',
            slug='mbbs',
            level='undergraduate',
            duration='6 years',
            requirements='Five O-level credits',
            description='The MBBS programme.',
            application_fee_local=10000,
            application_fee_intl=50,
            college=self.college,
        )

    def _search(self, query):
        return self.client.get('/api/public/search', {'q': query, 'limit': 10})

    def test_publication_author_search_does_not_crash(self):
        res = self._search('Zubairu')
        self.assertEqual(res.status_code, 200)
        body = res.json()
        publications = [r for r in body['results'] if r['type'] == 'publication']
        self.assertEqual(len(publications), 1)
        self.assertEqual(publications[0]['url'], f'/research/publications/{self.publication.id}')
        self.assertIn('Zubairu', publications[0]['description'])

    def test_people_results_link_to_existing_routes(self):
        res = self._search('Ada')
        self.assertEqual(res.status_code, 200)
        faculty = [r for r in res.json()['results'] if r['type'] == 'faculty']
        self.assertEqual(len(faculty), 1)
        self.assertEqual(faculty[0]['url'], f'/research/faculty/{self.faculty.id}')

        res = self._search('Ogoina')
        self.assertEqual(res.status_code, 200)
        leadership = [r for r in res.json()['results'] if r['type'] == 'leadership']
        self.assertEqual(len(leadership), 1)
        self.assertEqual(leadership[0]['url'], f'/about/leadership/{self.leadership.id}')

    def test_every_result_has_a_clickable_internal_url(self):
        for query in ('Ada', 'Malaria', 'Medicine', 'Ogoina', 'Symposium'):
            res = self._search(query)
            self.assertEqual(res.status_code, 200, query)
            for result in res.json()['results']:
                self.assertTrue(result['url'].startswith('/'), result)
                self.assertNotEqual(result['url'], '#', result)

    def test_results_cover_news_events_and_programs(self):
        res = self._search('Malaria')
        self.assertEqual(res.status_code, 200)
        types = {r['type'] for r in res.json()['results']}
        self.assertIn('news', types)
        self.assertIn('event', types)
        self.assertIn('publication', types)

        res = self._search('Medicine')
        self.assertEqual(res.status_code, 200)
        programs = [r for r in res.json()['results'] if r['type'] == 'program']
        self.assertEqual(len(programs), 1)
        self.assertEqual(programs[0]['url'], '/academics/programs/mbbs')

    def test_short_query_returns_empty_payload(self):
        res = self._search('a')
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body['results'], [])
        self.assertEqual(body['total_results'], 0)
        self.assertEqual(body['events_count'], 0)
