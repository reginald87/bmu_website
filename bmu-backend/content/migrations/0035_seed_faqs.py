"""Seed the frequently asked questions shown on the public FAQ page.

The FAQ page is empty until these records exist, and unlike most other public
content there was no seed migration for the ``FAQ`` model. Records are matched
on ``question`` so re-running the migration (or editing an answer in the admin
beforehand) does not create duplicates.
"""
from django.db import migrations


FAQS = [
    # ── Admissions ────────────────────────────────────────────────────────────
    {
        'question': 'How do I apply for admission to BMU?',
        'answer': (
            'Apply online through the application portal. Create an account (or '
            'continue as a guest), complete the multi-step application form, '
            'upload your supporting documents and pay the application fee. You '
            'can track your progress at any time using your application ID.'
        ),
        'category': 'admissions',
        'display_order': 1,
    },
    {
        'question': 'What documents do I need to apply?',
        'answer': (
            "You will be asked to provide your O'Level/WAEC/NECO results, birth "
            'certificate, certificate of origin, a recent passport photograph and '
            'academic transcripts where applicable. International applicants may '
            'also be asked for English proficiency test results and a passport copy.'
        ),
        'category': 'admissions',
        'display_order': 2,
    },
    {
        'question': 'When are applications open?',
        'answer': (
            'Applications are open during the admission window advertised on this '
            'website. The current dates are shown on the Apply page and in '
            'official announcements. If you are unsure, contact the Admissions '
            'Office and we will be glad to help.'
        ),
        'category': 'admissions',
        'display_order': 3,
    },
    {
        'question': 'How will I know if I have been admitted?',
        'answer': (
            'You can check the status of your application at any time using your '
            'application ID on the application status page. We will also contact '
            'you by email as your application moves through each stage, and '
            'successful applicants receive a provisional letter of admission.'
        ),
        'category': 'admissions',
        'display_order': 4,
    },

    # ── Academics ─────────────────────────────────────────────────────────────
    {
        'question': 'What programmes does BMU offer?',
        'answer': (
            'Bayelsa Medical University offers undergraduate and postgraduate '
            'programmes in medicine, nursing, allied health sciences and the '
            'basic medical sciences across its colleges. Browse the Programmes '
            'section of this website for the full list and entry requirements.'
        ),
        'category': 'academics',
        'display_order': 1,
    },
    {
        'question': 'How long does a programme take?',
        'answer': (
            'Programme duration varies. Undergraduate degrees typically run for '
            'four to six years depending on the discipline, while postgraduate '
            'programmes range from one to three years. The duration for each '
            'programme is listed on its programme page.'
        ),
        'category': 'academics',
        'display_order': 2,
    },

    # ── Financial aid ─────────────────────────────────────────────────────────
    {
        'question': 'How much is the application fee?',
        'answer': (
            'The application fee is set per programme and is shown on the Review '
            '& Payment step of the application form. Nigerian applicants pay in '
            'Naira while international applicants pay in US Dollars.'
        ),
        'category': 'financial',
        'display_order': 1,
    },
    {
        'question': 'What payment methods are accepted?',
        'answer': (
            'Application fees can be paid securely online by card, bank transfer '
            'or USSD through our Paystack payment page. A bank deposit option is '
            'also available; deposits are confirmed by the Bursary before your '
            'application is marked as paid.'
        ),
        'category': 'financial',
        'display_order': 2,
    },
    {
        'question': 'Are scholarships or financial aid available?',
        'answer': (
            'Yes. BMU offers merit-based scholarships for outstanding students, '
            'and a range of external scholarship opportunities are also '
            'available. Contact the Admissions Office or the Financial Aid desk '
            'for current award details and how to apply.'
        ),
        'category': 'financial',
        'display_order': 3,
    },

    # ── Campus life ───────────────────────────────────────────────────────────
    {
        'question': 'Where is Bayelsa Medical University located?',
        'answer': (
            'The University is located in Yenagoa, Bayelsa State, Nigeria '
            '(P.M.B. 145, Yenagoa). Directions and a map are available on the '
            'Contact page.'
        ),
        'category': 'campus',
        'display_order': 1,
    },
    {
        'question': 'Is accommodation available on campus?',
        'answer': (
            'Yes, on-campus housing is available at subsidized rates. Students '
            'are encouraged to apply early as places are limited. Details on '
            'hostel allocation are shared during registration.'
        ),
        'category': 'campus',
        'display_order': 2,
    },

    # ── International students ────────────────────────────────────────────────
    {
        'question': 'What are the English language requirements?',
        'answer': (
            'International students must demonstrate English proficiency through '
            'IELTS (minimum 6.5) or TOEFL iBT (minimum 80). Alternative '
            'qualifications may be considered on a case-by-case basis.'
        ),
        'category': 'international',
        'display_order': 1,
    },
    {
        'question': 'When should I apply?',
        'answer': (
            'We recommend applying at least 6 months before your intended start '
            'date to allow time for visa processing and travel arrangements. '
            'Fall semester applications close June 30, Spring semester '
            'applications close November 30.'
        ),
        'category': 'international',
        'display_order': 2,
    },
    {
        'question': 'Are scholarships available for international students?',
        'answer': (
            'Yes, BMU offers merit-based scholarships for outstanding '
            'international students. Awards range from 25% to 75% of tuition '
            'fees. Additional external scholarship opportunities are also '
            'available.'
        ),
        'category': 'international',
        'display_order': 3,
    },
    {
        'question': 'What is the cost of living?',
        'answer': (
            'The estimated cost of living in Yenagoa is approximately $300-500 '
            'per month, covering accommodation, food, transportation, and '
            'personal expenses. On-campus housing is available at subsidized '
            'rates.'
        ),
        'category': 'international',
        'display_order': 4,
    },

    # ── General ───────────────────────────────────────────────────────────────
    {
        'question': 'How do I contact Bayelsa Medical University?',
        'answer': (
            'You can reach us by email at admissions@bmu.edu.ng, by phone on '
            '+234 803 111 0000, or through the contact form on this website. Our '
            'team is happy to help with applications, programmes and general '
            'enquiries.'
        ),
        'category': 'general',
        'display_order': 1,
    },
    {
        'question': 'Are the University\u2019s programmes accredited?',
        'answer': (
            'BMU offers its programmes in line with the approval and '
            'accreditation requirements of the relevant national regulatory '
            'bodies. For the accreditation status of a specific programme, '
            'please contact the Admissions Office.'
        ),
        'category': 'general',
        'display_order': 2,
    },
]


def seed_faqs(apps, schema_editor):
    FAQ = apps.get_model('content', 'FAQ')
    for item in FAQS:
        FAQ.objects.update_or_create(
            question=item['question'],
            defaults={
                'answer': item['answer'],
                'category': item['category'],
                'display_order': item['display_order'],
                'is_active': True,
            },
        )


def reverse_seed(apps, schema_editor):
    FAQ = apps.get_model('content', 'FAQ')
    FAQ.objects.filter(question__in=[item['question'] for item in FAQS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('content', '0034_newslettersubscriber'),
    ]

    operations = [
        migrations.RunPython(seed_faqs, reverse_seed),
    ]
