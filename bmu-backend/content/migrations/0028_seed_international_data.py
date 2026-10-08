"""Seed InternationalPartner, ExchangeProgram, and StudentSupportService."""
from django.db import migrations


def seed_international_partners(apps, schema_editor):
    InternationalPartner = apps.get_model('content', 'InternationalPartner')

    partners = [
        {
            'name': 'World Health Organization',
            'slug': 'who',
            'country': 'Switzerland',
            'city': 'Geneva',
            'partner_type': 'ngo',
            'description': 'Collaboration on disease surveillance, outbreak response, and health systems strengthening in the Niger Delta.',
            'established_year': 2020,
            'focus_areas': ['Malaria control programs', 'Disease surveillance training', 'Emergency response capacity building'],
            'joint_publications': 12,
            'joint_projects': 5,
            'display_order': 1,
            'is_featured': True,
        },
        {
            'name': 'UNICEF',
            'slug': 'unicef',
            'country': 'United States',
            'city': 'New York',
            'partner_type': 'ngo',
            'description': 'Partnership focused on maternal and child health, nutrition, and immunization programs.',
            'established_year': 2020,
            'focus_areas': ['Maternal health initiatives', 'Child nutrition programs', 'Immunization campaigns'],
            'joint_publications': 8,
            'joint_projects': 4,
            'display_order': 2,
            'is_featured': True,
        },
        {
            'name': 'UNFPA',
            'slug': 'unfpa',
            'country': 'United States',
            'city': 'New York',
            'partner_type': 'ngo',
            'description': 'Joint programs on reproductive health, family planning, and population studies.',
            'established_year': 2021,
            'focus_areas': ['Family planning services', 'Youth health programs', 'Population research'],
            'joint_publications': 6,
            'joint_projects': 3,
            'display_order': 3,
        },
        {
            'name': 'London School of Hygiene & Tropical Medicine',
            'slug': 'lshtm',
            'country': 'United Kingdom',
            'city': 'London',
            'partner_type': 'university',
            'description': 'Academic partnership for research collaboration, faculty exchange, and joint PhD supervision.',
            'established_year': 2019,
            'focus_areas': ['Joint research projects', 'Faculty exchange programs', 'PhD student supervision'],
            'students_exchanged': 8,
            'joint_publications': 25,
            'joint_projects': 6,
            'display_order': 4,
            'is_featured': True,
        },
        {
            'name': 'Johns Hopkins Bloomberg School of Public Health',
            'slug': 'jhsph',
            'country': 'United States',
            'city': 'Baltimore',
            'partner_type': 'university',
            'description': 'Research collaboration on public health surveillance, epidemiology, and health systems research.',
            'established_year': 2019,
            'focus_areas': ['Public health research', 'Epidemiological studies', 'Health policy research'],
            'students_exchanged': 5,
            'joint_publications': 18,
            'joint_projects': 4,
            'display_order': 5,
            'is_featured': True,
        },
        {
            'name': 'University of Oxford',
            'slug': 'oxford',
            'country': 'United Kingdom',
            'city': 'Oxford',
            'partner_type': 'university',
            'description': 'Collaboration on tropical disease research and clinical trials.',
            'established_year': 2020,
            'focus_areas': ['Malaria vaccine trials', 'Drug resistance studies', 'Clinical research training'],
            'students_exchanged': 6,
            'joint_publications': 30,
            'joint_projects': 7,
            'display_order': 6,
            'is_featured': True,
        },
        {
            'name': 'Federal Medical Centre, Yenagoa',
            'slug': 'fmc-yenagoa',
            'country': 'Nigeria',
            'city': 'Yenagoa',
            'partner_type': 'hospital',
            'description': 'Primary teaching hospital partner providing clinical training and research facilities.',
            'established_year': 2018,
            'focus_areas': ['Clinical clerkships', 'Residency training', 'Joint clinical research'],
            'students_exchanged': 15,
            'joint_publications': 10,
            'joint_projects': 8,
            'display_order': 7,
        },
        {
            'name': 'Bayelsa State Ministry of Health',
            'slug': 'bayelsa-moh',
            'country': 'Nigeria',
            'city': 'Yenagoa',
            'partner_type': 'government',
            'description': 'Partnership for public health programs, disease surveillance, and health policy development.',
            'established_year': 2019,
            'focus_areas': ['Disease surveillance', 'Health policy research', 'Community health programs'],
            'joint_publications': 5,
            'joint_projects': 10,
            'display_order': 8,
        },
        {
            'name': 'Niger Delta University',
            'slug': 'niger-delta-university',
            'country': 'Nigeria',
            'city': 'Wilberforce Island',
            'partner_type': 'university',
            'description': 'Inter-university collaboration for resource sharing and joint academic programs.',
            'established_year': 2020,
            'focus_areas': ['Resource sharing', 'Joint seminars', 'Student exchanges'],
            'students_exchanged': 20,
            'joint_publications': 7,
            'joint_projects': 4,
            'display_order': 9,
        },
        {
            'name': 'Public Health Reform Council of Nigeria',
            'slug': 'phrcn',
            'country': 'Nigeria',
            'city': 'Abuja',
            'partner_type': 'government',
            'description': 'Collaboration on public health training, certification, and professional development.',
            'established_year': 2021,
            'focus_areas': ['Public health training', 'Professional certification', 'Policy advocacy'],
            'joint_publications': 3,
            'joint_projects': 2,
            'display_order': 10,
        },
    ]

    for p in partners:
        InternationalPartner.objects.get_or_create(
            slug=p['slug'],
            defaults=p,
        )


def seed_exchange_programs(apps, schema_editor):
    ExchangeProgram = apps.get_model('content', 'ExchangeProgram')
    InternationalPartner = apps.get_model('content', 'InternationalPartner')

    lshtm = InternationalPartner.objects.filter(slug='lshtm').first()
    jhu = InternationalPartner.objects.filter(slug='jhsph').first()

    if not lshtm or not jhu:
        return

    programs = [
        {
            'title': 'LSHTM-BMU Joint Research Fellowship',
            'slug': 'lshtm-bmu-fellowship',
            'program_type': 'faculty_research',
            'partner': lshtm,
            'duration_weeks': 12,
            'start_date': '2025-09-01',
            'end_date': '2025-11-30',
            'application_deadline': '2025-06-30',
            'description': 'A 12-week research fellowship at the London School of Hygiene & Tropical Medicine focusing on tropical disease research.',
            'eligibility_criteria': [
                'Must be a PhD student or early-career researcher',
                'Minimum CGPA of 3.5',
                'Research proposal in tropical medicine',
            ],
            'benefits': [
                'Travel stipend',
                'Accommodation provided',
                'Research funding up to \u00a35,000',
                'Access to LSHTM labs and libraries',
            ],
            'costs': {'tuition': 'Waived', 'airfare': 'Covered by scholarship', 'living_expenses': 'Stipend provided'},
            'total_slots': 5,
            'available_slots': 3,
            'status': 'open',
            'contact_email': 'international@bmu.edu.ng',
            'is_published': True,
            'is_featured': True,
            'display_order': 1,
        },
        {
            'title': 'JHU-BMU Public Health Exchange',
            'slug': 'jhu-bmu-exchange',
            'program_type': 'student_semester',
            'partner': jhu,
            'duration_weeks': 16,
            'start_date': '2025-08-15',
            'end_date': '2025-12-15',
            'application_deadline': '2025-05-15',
            'description': 'Semester-long exchange program at Johns Hopkins Bloomberg School of Public Health.',
            'eligibility_criteria': [
                'Enrolled in MPH or related program',
                'Minimum CGPA of 3.0',
                'English proficiency',
            ],
            'benefits': [
                'Full tuition waiver',
                'Health insurance',
                'Cultural immersion activities',
            ],
            'costs': {'tuition': 'Waived', 'housing': '$3,000/semester', 'meals': '$2,000/semester', 'airfare': 'Student responsibility'},
            'total_slots': 3,
            'available_slots': 1,
            'status': 'open',
            'contact_email': 'exchange@bmu.edu.ng',
            'is_published': True,
            'is_featured': True,
            'display_order': 2,
        },
    ]

    for p in programs:
        ExchangeProgram.objects.get_or_create(
            slug=p['slug'],
            defaults=p,
        )


def seed_student_support_services(apps, schema_editor):
    StudentSupportService = apps.get_model('content', 'StudentSupportService')

    services = [
        {
            'title': 'Visa & Immigration Support',
            'slug': 'visa-immigration-support',
            'service_type': 'visa',
            'short_description': 'Visa application guidance, immigration compliance, and residence permit assistance for international students.',
            'full_description': 'Comprehensive visa and immigration support services for international students, including visa application guidance, document preparation, immigration compliance monitoring, and residence permit assistance. Our dedicated international office staff work closely with Nigeria Immigration Service to ensure smooth processing.',
            'icon': 'Stamp',
            'features': [
                'Visa application guidance and document review',
                'Immigration compliance monitoring',
                'Residence permit assistance',
                'Travel letter requests',
                'Status extension support',
            ],
            'requirements': [
                'Valid international passport',
                'Admission letter from BMU',
                'Proof of financial capability',
                'Passport-sized photographs',
            ],
            'process_steps': [
                'Receive admission letter from BMU',
                'Schedule consultation with international office',
                'Gather required documents',
                'Submit visa application with guidance',
                'Attend biometrics appointment',
                'Receive visa decision and collect passport',
            ],
            'faqs': [
                'How long does visa processing take? Typically 4-6 weeks.',
                'Can BMU help with visa extensions? Yes, contact the international office.',
                'Do I need a student visa? Yes, all international students require a student visa.',
            ],
            'contact_person': 'Mrs. Grace Eze',
            'contact_email': 'international@bmu.edu.ng',
            'contact_phone': '+234 803 111 0032',
            'office_location': 'International Office, Admin Block',
            'office_hours': 'Mon-Fri 8:00 AM - 5:00 PM',
            'related_documents': ['International Student Handbook', 'Visa Application Guide'],
            'useful_links': [{'title': 'Nigeria Immigration Service', 'url': 'https://portal.immigration.gov.ng'}],
            'display_order': 1,
        },
        {
            'title': 'Housing & Accommodation',
            'slug': 'housing-accommodation',
            'service_type': 'housing',
            'short_description': 'On-campus and off-campus housing assistance, including room assignments and accommodation support.',
            'full_description': 'BMU provides comfortable and secure on-campus accommodation for international students. Our housing team assists with room assignments, move-in coordination, maintenance requests, and transition to off-campus housing when needed. All hostels are equipped with modern amenities, 24/7 security, and high-speed internet.',
            'icon': 'Home',
            'features': [
                'On-campus hostel allocation',
                'Furnished rooms with Wi-Fi',
                '24/7 security and CCTV',
                'Laundry and kitchen facilities',
                'Off-campus housing referrals',
            ],
            'requirements': [
                'Completed accommodation application form',
                'Proof of admission',
                'Payment of accommodation fees',
            ],
            'process_steps': [
                'Submit accommodation application online',
                'Receive room allocation confirmation',
                'Pay accommodation fees',
                'Complete move-in checklist',
                'Report any maintenance issues via portal',
            ],
            'faqs': [
                'Is on-campus housing guaranteed? We try to accommodate all international students, but space is limited.',
                'What is the cost? Rooms range from \u20a6150,000 to \u20a6300,000 per academic session.',
                'Can I choose my roommate? roommate requests are considered on a first-come basis.',
            ],
            'contact_person': 'Mr. Tony Igwe',
            'contact_email': 'housing@bmu.edu.ng',
            'contact_phone': '+234 803 111 0033',
            'office_location': 'Student Affairs Building, Room 105',
            'office_hours': 'Mon-Fri 8:00 AM - 4:00 PM',
            'related_documents': ['Accommodation Application Form', 'Hostel Rules and Regulations'],
            'useful_links': [{'title': 'Online Accommodation Portal', 'url': 'https://portal.bmu.edu.ng/housing'}],
            'display_order': 2,
        },
        {
            'title': 'Orientation Program',
            'slug': 'orientation-program',
            'service_type': 'orientation',
            'short_description': 'Comprehensive orientation for new international students covering academics, culture, and campus life.',
            'full_description': 'BMU hosts a dedicated orientation program for all new international students at the start of each semester. The program covers academic expectations, cultural adaptation, campus resources, safety information, and social integration activities. Peer mentors are assigned to help new students settle in.',
            'icon': 'GraduationCap',
            'features': [
                'Welcome reception and campus tour',
                'Academic systems briefing',
                'Cultural adaptation workshop',
                'Safety and emergency procedures',
                'Peer mentor assignment',
                'Social integration activities',
            ],
            'requirements': [
                'Valid admission letter',
                'Completed pre-orientation questionnaire',
            ],
            'process_steps': [
                'Register for orientation online',
                'Attend welcome reception',
                'Complete campus tour',
                'Attend academic briefing',
                'Meet your peer mentor',
                'Participate in social activities',
            ],
            'faqs': [
                'Is orientation mandatory? Yes, all international students must attend.',
                'How long is the orientation? It runs for 3 days at the start of each semester.',
                'What should I bring? Bring your admission letter, passport copy, and any remaining documents.',
            ],
            'contact_person': 'Dr. Amadi Hart',
            'contact_email': 'orientation@bmu.edu.ng',
            'contact_phone': '+234 803 111 0034',
            'office_location': 'Student Affairs Building, Room 201',
            'office_hours': 'Mon-Fri 8:00 AM - 5:00 PM',
            'related_documents': ['Orientation Schedule', 'Campus Map'],
            'useful_links': [{'title': 'Pre-Arrival Checklist', 'url': 'https://bmu.edu.ng/international/pre-arrival'}],
            'display_order': 3,
        },
        {
            'title': 'Health & Insurance',
            'slug': 'health-insurance',
            'service_type': 'health',
            'short_description': 'Health insurance enrollment, medical services access, and wellness support for international students.',
            'full_description': 'BMU ensures all international students have access to quality healthcare through the university health center and mandatory health insurance. Services include enrollment in the National Health Insurance Scheme (NHIS), access to the BMU Teaching Hospital, mental health counseling, and wellness programs.',
            'icon': 'Heart',
            'features': [
                'NHIS enrollment assistance',
                'BMU Teaching Hospital access',
                'Mental health counseling',
                'Wellness and fitness programs',
                'Emergency medical support',
                'Health screening on arrival',
            ],
            'requirements': [
                'Valid admission letter',
                'Completed health declaration form',
                'Immunization records',
                'Proof of health insurance or willingness to enroll',
            ],
            'process_steps': [
                'Complete health declaration form',
                'Submit immunization records',
                'Enroll in NHIS at the health center',
                'Attend welcome health screening',
                'Access services as needed',
            ],
            'faqs': [
                'Is health insurance mandatory? Yes, all international students must be covered.',
                'Where is the health center? The BMU Health Center is located adjacent to the main campus.',
                'Are mental health services available? Yes, confidential counseling is available free of charge.',
            ],
            'contact_person': 'Dr. Nimi West',
            'contact_email': 'health@bmu.edu.ng',
            'contact_phone': '+234 803 111 0035',
            'office_location': 'BMU Health Center',
            'office_hours': 'Mon-Fri 8:00 AM - 5:00 PM, Sat 9:00 AM - 1:00 PM',
            'related_documents': ['Health Declaration Form', 'Immunization Requirements'],
            'useful_links': [{'title': 'NHIS Portal', 'url': 'https://www.nhis.gov.ng'}],
            'display_order': 4,
        },
        {
            'title': 'Academic Advising',
            'slug': 'academic-advising',
            'service_type': 'academic',
            'short_description': 'Guidance on course selection, academic planning, and career pathways for international students.',
            'full_description': 'Our academic advisors help international students navigate their academic journey, from course selection to career planning. Services include individual consultations, academic progress reviews, curriculum guidance, and referral to specialized support services. Advisors are familiar with international student visa requirements related to academic progress.',
            'icon': 'BookOpen',
            'features': [
                'One-on-one advising sessions',
                'Degree planning assistance',
                'Academic progress monitoring',
                'Career counseling',
                'Graduate school preparation',
            ],
            'requirements': [
                'Enrolled as a registered BMU student',
                'Valid student ID',
            ],
            'process_steps': [
                'Schedule an appointment online or in person',
                'Attend advising session with your advisor',
                'Develop or update your academic plan',
                'Follow up as needed each semester',
            ],
            'faqs': [
                'How do I book an appointment? Visit the Student Affairs portal or walk in during office hours.',
                'Can I change my advisor? Yes, by requesting through the Dean\'s office.',
                'Are advisors available during holidays? Limited advising is available during break periods.',
            ],
            'contact_person': 'Dr. Sarah Okonkwo',
            'contact_email': 'advising@bmu.edu.ng',
            'contact_phone': '+234 803 111 0031',
            'office_location': 'Student Affairs Building, Room 204',
            'office_hours': 'Mon-Fri 9:00 AM - 4:00 PM',
            'related_documents': ['Academic Policies Handbook', 'Course Registration Guide'],
            'useful_links': [{'title': 'Online Advising Portal', 'url': 'https://portal.bmu.edu.ng/advising'}],
            'display_order': 5,
        },
        {
            'title': 'International Student Support',
            'slug': 'international-support',
            'service_type': 'international',
            'short_description': 'Visa assistance, orientation, and cultural integration for international students.',
            'full_description': 'Comprehensive support services for international students including visa processing, airport pickup, accommodation assistance, and cultural orientation programs. Our international student support team is dedicated to making your transition to life in Nigeria as smooth as possible.',
            'icon': 'Globe',
            'features': [
                'Visa application support',
                'Airport pickup service',
                'Accommodation assistance',
                'Cultural orientation',
                'Bank account setup guidance',
                'Local SIM card assistance',
            ],
            'requirements': [
                'Valid international passport',
                'Admission letter from BMU',
            ],
            'process_steps': [
                'Submit visa support request',
                'Receive guidance documents',
                'Arrange airport pickup (if needed)',
                'Attend orientation program',
                'Ongoing support as needed',
            ],
            'faqs': [
                'How long does visa processing take? Typically 4-6 weeks.',
                'Is airport pickup available? Yes, request at least 2 weeks before arrival.',
                'Can I work while studying? International students may apply for limited work permits.',
            ],
            'contact_person': 'Mrs. Grace Eze',
            'contact_email': 'international@bmu.edu.ng',
            'contact_phone': '+234 803 111 0032',
            'office_location': 'International Office, Admin Block',
            'office_hours': 'Mon-Fri 8:00 AM - 5:00 PM',
            'related_documents': ['International Student Handbook', 'Pre-Arrival Guide'],
            'useful_links': [{'title': 'Nigeria Immigration Service', 'url': 'https://portal.immigration.gov.ng'}],
            'display_order': 6,
        },
    ]

    for s in services:
        StudentSupportService.objects.get_or_create(
            slug=s['slug'],
            defaults=s,
        )


def forwards(apps, schema_editor):
    seed_international_partners(apps, schema_editor)
    seed_exchange_programs(apps, schema_editor)
    seed_student_support_services(apps, schema_editor)


def backwards(apps, schema_editor):
    ExchangeProgram = apps.get_model('content', 'ExchangeProgram')
    StudentSupportService = apps.get_model('content', 'StudentSupportService')
    InternationalPartner = apps.get_model('content', 'InternationalPartner')

    ExchangeProgram.objects.filter(slug__in=['lshtm-bmu-fellowship', 'jhu-bmu-exchange']).delete()
    StudentSupportService.objects.filter(slug__in=[
        'visa-immigration-support', 'housing-accommodation', 'orientation-program',
        'health-insurance', 'academic-advising', 'international-support',
    ]).delete()
    InternationalPartner.objects.filter(slug__in=[
        'who', 'unicef', 'unfpa', 'lshtm', 'jhsph', 'oxford',
        'fmc-yenagoa', 'bayelsa-moh', 'niger-delta-university', 'phrcn',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0027_aboutpage_mission_content_aboutpage_vision_content_and_more'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
