"""Seed UniversityRanking, KeyMetric, CampusFeature, and PageSections for remaining public pages."""
from django.db import migrations


def seed_university_rankings(apps, schema_editor):
    UniversityRanking = apps.get_model('content', 'UniversityRanking')

    entries = [
        # Rankings
        {'entry_type': 'ranking', 'title': 'Best Medical University in Nigeria', 'rank': 'Top 5', 'year': '2024', 'source': 'Nigerian Universities Ranking', 'display_order': 1},
        {'entry_type': 'ranking', 'title': 'Research Output in Health Sciences', 'rank': 'Top 10', 'year': '2024', 'source': 'Scimago Institutions Rankings', 'display_order': 2},
        {'entry_type': 'ranking', 'title': 'Community Impact Index', 'rank': '#1', 'year': '2024', 'source': 'Nigerian Education Innovation Hub', 'display_order': 3},
        {'entry_type': 'ranking', 'title': 'Student Satisfaction', 'rank': '4.5/5', 'year': '2024', 'source': 'National Student Survey', 'display_order': 4},
        # Accreditations
        {'entry_type': 'accreditation', 'title': 'NUC Accreditation', 'accrediting_body': 'NUC', 'body_full_name': 'National Universities Commission', 'status': 'Full Accreditation', 'validity': '2020 - Present', 'accredited_programs': 'All Undergraduate Programs, All Postgraduate Programs', 'display_order': 1},
        {'entry_type': 'accreditation', 'title': 'MDCN Accreditation', 'accrediting_body': 'MDCN', 'body_full_name': 'Medical & Dental Council of Nigeria', 'status': 'Full Accreditation', 'validity': '2019 - Present', 'accredited_programs': 'MBBS (Medicine & Surgery)', 'display_order': 2},
        {'entry_type': 'accreditation', 'title': 'NMCN Accreditation', 'accrediting_body': 'NMCN', 'body_full_name': 'Nursing & Midwifery Council of Nigeria', 'status': 'Full Accreditation', 'validity': '2019 - Present', 'accredited_programs': 'B.NSc Nursing Science, Post-Basic Nursing', 'display_order': 3},
        {'entry_type': 'accreditation', 'title': 'MLSCN Accreditation', 'accrediting_body': 'MLSCN', 'body_full_name': 'Medical Laboratory Science Council of Nigeria', 'status': 'Full Accreditation', 'validity': '2020 - Present', 'accredited_programs': 'BMLS Medical Laboratory Science', 'display_order': 4},
        {'entry_type': 'accreditation', 'title': 'PCN Accreditation', 'accrediting_body': 'PCN', 'body_full_name': 'Pharmacy Council of Nigeria', 'status': 'Provisional Accreditation', 'validity': '2023 - Present', 'accredited_programs': 'Doctor of Pharmacy (Pharm.D)', 'display_order': 5},
        # Achievements
        {'entry_type': 'achievement', 'title': 'WHO Grant Recipient', 'description': 'Received $500,000 grant for malaria research in the Niger Delta', 'year': '2024', 'display_order': 1},
        {'entry_type': 'achievement', 'title': 'Best Teaching Hospital Partnership', 'description': 'Awarded by the Association of Medical Schools in Africa', 'year': '2024', 'display_order': 2},
        {'entry_type': 'achievement', 'title': 'Innovation in Medical Education', 'description': 'Recognized for pioneering simulation-based learning', 'year': '2023', 'display_order': 3},
        {'entry_type': 'achievement', 'title': 'Community Health Champion', 'description': 'Award for free medical outreach programs reaching 10,000+ residents', 'year': '2023', 'display_order': 4},
        {'entry_type': 'achievement', 'title': 'Research Excellence Award', 'description': 'Highest number of publications per faculty in Nigerian medical schools', 'year': '2022', 'display_order': 5},
        {'entry_type': 'achievement', 'title': 'SDG Champion Institution', 'description': 'Recognized for contributions to SDG 3 (Good Health & Well-being)', 'year': '2021', 'display_order': 6},
    ]

    for e in entries:
        UniversityRanking.objects.get_or_create(
            entry_type=e['entry_type'],
            title=e['title'],
            defaults=e,
        )


def seed_key_metrics(apps, schema_editor):
    KeyMetric = apps.get_model('content', 'KeyMetric')

    metrics = [
        {'label': 'Research Publications', 'value': '1,247+', 'icon_name': 'BookOpen', 'category': 'research', 'display_order': 1},
        {'label': 'Citations', 'value': '8,500+', 'icon_name': 'TrendingUp', 'category': 'research', 'display_order': 2},
        {'label': 'h-Index', 'value': '28', 'icon_name': 'Star', 'category': 'research', 'display_order': 3},
        {'label': 'International Partnerships', 'value': '15+', 'icon_name': 'Globe', 'category': 'partnership', 'display_order': 4},
        {'label': 'Faculty with PhD', 'value': '78%', 'icon_name': 'Users', 'category': 'academic', 'display_order': 5},
        {'label': 'Licensure Exam Pass Rate', 'value': '94%', 'icon_name': 'CheckCircle', 'category': 'quality', 'display_order': 6},
    ]

    for m in metrics:
        KeyMetric.objects.get_or_create(
            label=m['label'],
            defaults=m,
        )


def seed_campus_features(apps, schema_editor):
    CampusFeature = apps.get_model('content', 'CampusFeature')

    features = [
        # Housing
        {'section_key': 'housing', 'title': 'Male Hostel', 'description': 'Fully furnished rooms with 24/7 security, common rooms, and study areas. Capacity: 400 students.', 'icon': 'Building2', 'display_order': 1},
        {'section_key': 'housing', 'title': 'Female Hostel', 'description': 'Secure and comfortable accommodation with lounge areas, laundry facilities, and kitchenettes. Capacity: 400 students.', 'icon': 'Building2', 'display_order': 2},
        {'section_key': 'housing', 'title': 'International House', 'description': 'Premium accommodation for international and postgraduate students with en-suite rooms and wireless internet.', 'icon': 'Globe', 'display_order': 3},
        {'section_key': 'housing', 'title': 'Student Apartments', 'description': 'Self-contained apartments for final-year and married students with living, dining, and kitchen areas.', 'icon': 'Home', 'display_order': 4},
        {'section_key': 'housing', 'title': 'Hostel Amenities', 'description': 'Common rooms, TV lounges, study carrels, mini-marts, and recreational areas in every hall.', 'icon': 'Wifi', 'display_order': 5},
        {'section_key': 'housing', 'title': 'Residential Life Programs', 'description': 'Floor meetings, cultural nights, wellness checks, and peer mentoring programs in each hall.', 'icon': 'Users', 'display_order': 6},
        # Dining
        {'section_key': 'dining', 'title': 'Main Cafeteria', 'description': 'Buffet-style dining hall serving breakfast, lunch, and dinner with diverse menu options daily.', 'icon': 'UtensilsCrossed', 'display_order': 1},
        {'section_key': 'dining', 'title': 'Food Court', 'description': 'Multiple food vendors offering Nigerian, continental, and fast-food options in a food-court setting.', 'icon': 'Store', 'display_order': 2},
        {'section_key': 'dining', 'title': 'Smoothie & Juice Bar', 'description': 'Fresh fruit smoothies, juices, and healthy snacks available throughout the day.', 'icon': 'Coffee', 'display_order': 3},
        {'section_key': 'dining', 'title': 'Campus Bakery', 'description': 'Freshly baked bread, pastries, and cakes made on campus daily.', 'icon': 'Cake', 'display_order': 4},
        # Wellness
        {'section_key': 'wellness', 'title': 'University Health Center', 'description': 'On-campus medical facility providing primary care, immunizations, and health screenings.', 'icon': 'Heart', 'display_order': 1},
        {'section_key': 'wellness', 'title': 'Counseling Services', 'description': 'Confidential mental health support, stress management workshops, and personal development programs.', 'icon': 'Brain', 'display_order': 2},
        {'section_key': 'wellness', 'title': 'Sports Complex', 'description': 'Football pitch, basketball court, tennis courts, swimming pool, and modern gymnasium.', 'icon': 'Dumbbell', 'display_order': 3},
        {'section_key': 'wellness', 'title': 'Fitness & Recreation', 'description': 'Group fitness classes, intramural sports leagues, outdoor adventure trips, and wellness challenges.', 'icon': 'Activity', 'display_order': 4},
        # Organizations
        {'section_key': 'organizations', 'title': 'Medical Students Association', 'description': 'The largest student body representing all medical students with academic, social, and welfare programs.', 'icon': 'Stethoscope', 'display_order': 1},
        {'section_key': 'organizations', 'title': 'Research & Innovation Club', 'description': 'Student-led research initiatives, journal clubs, and annual research symposium.', 'icon': 'FlaskConical', 'display_order': 2},
        {'section_key': 'organizations', 'title': 'Community Health Volunteers', 'description': 'Organize free health screenings, health education campaigns, and community outreach programs.', 'icon': 'HeartHandshake', 'display_order': 3},
        {'section_key': 'organizations', 'title': 'Cultural & Arts Society', 'description': 'Celebrate Nigeria diverse cultures through festivals, drama, music, and art exhibitions.', 'icon': 'Music', 'display_order': 4},
        # Diversity
        {'section_key': 'diversity', 'title': 'International Student body', 'description': 'Students from over 45 countries study at BMU, creating a vibrant multicultural campus.', 'icon': 'Globe', 'display_order': 1},
        {'section_key': 'diversity', 'title': 'Cultural Exchange Programs', 'description': 'Regular cultural exchange events, international food festivals, and language exchange meetups.', 'icon': 'Users', 'display_order': 2},
        {'section_key': 'diversity', 'title': 'Inclusion Office', 'description': 'Dedicated office supporting students with disabilities, mature students, and underrepresented groups.', 'icon': 'Heart', 'display_order': 3},
        # Safety
        {'section_key': 'safety', 'title': '24/7 Security Patrol', 'description': 'Armed security personnel and civilian guards patrol the campus round the clock.', 'icon': 'Shield', 'display_order': 1},
        {'section_key': 'safety', 'title': 'CCTV Surveillance', 'description': 'Comprehensive camera coverage across all campus buildings, pathways, and parking areas.', 'icon': 'Camera', 'display_order': 2},
        {'section_key': 'safety', 'title': 'Emergency Response', 'description': 'Dedicated emergency response team, fire stations, and first-aid stations across campus.', 'icon': 'Siren', 'display_order': 3},
        {'section_key': 'safety', 'title': 'Safe Walk Program', 'description': 'Campus safety escorts available for students walking alone after dark.', 'icon': 'Footprints', 'display_order': 4},
    ]

    for f in features:
        CampusFeature.objects.get_or_create(
            section_key=f['section_key'],
            title=f['title'],
            defaults=f,
        )


def seed_remaining_page_sections(apps, schema_editor):
    PS = apps.get_model('content', 'PageSection')

    sections = [
        # International Students - stats
        ('international_students', 'stats', 'stats', '', '', [
            {'value': '500+', 'label': 'International Students', 'icon': 'Users'},
            {'value': '45+', 'label': 'Countries Represented', 'icon': 'Globe'},
            {'value': '95%', 'label': 'Visa Success Rate', 'icon': 'CheckCircle'},
            {'value': '85%', 'label': 'Student Satisfaction', 'icon': 'Heart'},
        ], 1),
        # International Students - admission steps
        ('international_students', 'admission_steps', 'steps', 'Admission Process', 'Follow these steps to apply as an international student', [
            {'step': 1, 'title': 'Choose Your Program', 'description': 'Explore our programs and select the right fit for your academic goals.', 'icon': 'GraduationCap'},
            {'step': 2, 'title': 'Submit Application', 'description': 'Complete online application with required documents and application fee.', 'icon': 'FileText'},
            {'step': 3, 'title': 'Document Evaluation', 'description': 'Academic credentials reviewed and verified by admissions committee.', 'icon': 'CheckCircle'},
            {'step': 4, 'title': 'Interview', 'description': 'Virtual interview with program coordinator (if required).', 'icon': 'Phone'},
            {'step': 5, 'title': 'Admission Decision', 'description': 'Receive official admission letter and enrollment package.', 'icon': 'Mail'},
            {'step': 6, 'title': 'Visa & Travel', 'description': 'Apply for student visa and arrange travel to Nigeria.', 'icon': 'Plane'},
        ], 2),
        # International Students - required documents
        ('international_students', 'required_documents', 'list', 'Required Documents', 'Gather these documents before starting your application', [
            'Completed application form',
            'Secondary school certificate / Bachelor\'s degree transcript',
            'English proficiency test results (IELTS/TOEFL)',
            'Passport copy (minimum 6 months validity)',
            'Medical fitness certificate',
            'Recommendation letters (2)',
            'Statement of purpose',
            'Application fee payment receipt',
        ], 3),
        # International Students - FAQs
        ('international_students', 'faqs', 'faqs', 'Frequently Asked Questions', '', [
            {'question': 'What are the English language requirements?', 'answer': 'International students must demonstrate English proficiency through IELTS (minimum 6.5) or TOEFL iBT (minimum 80). Alternative qualifications may be considered on a case-by-case basis.'},
            {'question': 'When should I apply?', 'answer': 'We recommend applying at least 6 months before your intended start date to allow time for visa processing and travel arrangements. Fall semester applications close June 30, Spring semester applications close November 30.'},
            {'question': 'Are scholarships available for international students?', 'answer': 'Yes, BMU offers merit-based scholarships for outstanding international students. Awards range from 25% to 75% of tuition fees. Additional external scholarship opportunities are also available.'},
            {'question': 'What is the cost of living?', 'answer': 'The estimated cost of living in Yenagoa is approximately $300-500 per month, covering accommodation, food, transportation, and personal expenses. On-campus housing is available at subsidized rates.'},
        ], 4),
        # Exchange - requirements
        ('exchange', 'requirements', 'list', 'Eligibility Requirements', 'Meet these criteria to apply for an exchange program', [
            'Minimum GPA of 3.0',
            'Good academic standing',
            'English proficiency (IELTS 6.5 or equivalent)',
            'Recommendation from faculty advisor',
            'Valid passport and visa eligibility',
            'Health insurance coverage',
        ], 1),
        # Exchange - process steps
        ('exchange', 'process_steps', 'steps', 'Application Process', 'Follow these steps to apply for an exchange program', [
            {'step': 1, 'title': 'Information Session', 'description': 'Attend mandatory pre-application briefing'},
            {'step': 2, 'title': 'Online Application', 'description': 'Submit application with required documents'},
            {'step': 3, 'title': 'Interview', 'description': 'Panel interview with selection committee'},
            {'step': 4, 'title': 'Nomination', 'description': 'Selected students nominated to partner institution'},
            {'step': 5, 'title': 'Visa & Travel', 'description': 'Apply for visa and arrange travel logistics'},
            {'step': 6, 'title': 'Pre-Departure', 'description': 'Attend orientation and finalize preparations'},
        ], 2),
        # Exchange - deadlines
        ('exchange', 'upcoming_deadlines', 'list', 'Upcoming Deadlines', '', [
            {'program': 'Fall Semester Exchange 2025', 'deadline': 'March 15, 2025', 'status': 'Open'},
            {'program': 'Summer Research 2025', 'deadline': 'January 31, 2025', 'status': 'Open'},
            {'program': 'Spring Semester Exchange 2026', 'deadline': 'September 30, 2025', 'status': 'Upcoming'},
        ], 3),
        # Partnerships - types
        ('partnerships', 'partnership_types', 'cards', 'Partnership Models', 'We offer several types of international partnerships', [
            {'title': 'Academic Exchange', 'description': 'Student and faculty exchange programs, joint degree programs, and study abroad opportunities.', 'icon': 'GraduationCap', 'benefits': ['Student mobility', 'Faculty sabbaticals', 'Joint degrees', 'Credit transfer']},
            {'title': 'Research Collaboration', 'description': 'Joint research projects, shared laboratories, and collaborative funding applications.', 'icon': 'FlaskConical', 'benefits': ['Joint publications', 'Shared facilities', 'Grant partnerships', 'Knowledge transfer']},
            {'title': 'Institutional Partnerships', 'description': 'Strategic alliances with universities, hospitals, and healthcare organizations worldwide.', 'icon': 'Building2', 'benefits': ['MOU agreements', 'Visiting scholars', 'Dual appointments', 'Resource sharing']},
        ], 1),
        # Partnerships - benefits
        ('partnerships', 'partnership_benefits', 'list', 'Partnership Benefits', 'Why partner with BMU?', [
            'Access to international research networks',
            'Student exchange opportunities',
            'Joint degree program development',
            'Shared resources and facilities',
            'International faculty development',
            'Global health impact initiatives',
        ], 2),
        # Sustainability - carbon targets
        ('sustainability', 'carbon_targets', 'stats', 'Carbon Neutrality Roadmap', 'Our targets for achieving net-zero carbon emissions', [
            {'year': '2020', 'baseline': '100%', 'reduction': '0%'},
            {'year': '2024', 'baseline': '60%', 'reduction': '40%'},
            {'year': '2028', 'baseline': '35%', 'reduction': '65%'},
            {'year': '2035', 'baseline': '15%', 'reduction': '85%'},
            {'year': '2040', 'baseline': '0%', 'reduction': '100%'},
        ], 1),
        # Sustainability - research areas
        ('sustainability', 'research_areas', 'list', 'Research Focus Areas', '', [
            'Climate change health impacts in the Niger Delta',
            'Renewable energy solutions for healthcare facilities',
            'Environmental health monitoring systems',
            'Sustainable agriculture and nutrition',
            'Waste-to-energy technologies',
            'Coastal ecosystem preservation',
        ], 2),
    ]

    for s in sections:
        PS.objects.get_or_create(
            page_key=s[0],
            section_key=s[1],
            defaults={
                'content_type': s[2],
                'title': s[3],
                'subtitle': s[4],
                'data': s[5],
                'display_order': s[6],
            },
        )


def forwards(apps, schema_editor):
    seed_university_rankings(apps, schema_editor)
    seed_key_metrics(apps, schema_editor)
    seed_campus_features(apps, schema_editor)
    seed_remaining_page_sections(apps, schema_editor)


def backwards(apps, schema_editor):
    UniversityRanking = apps.get_model('content', 'UniversityRanking')
    KeyMetric = apps.get_model('content', 'KeyMetric')
    CampusFeature = apps.get_model('content', 'CampusFeature')
    PS = apps.get_model('content', 'PageSection')

    UniversityRanking.objects.filter(title__in=[
        'Best Medical University in Nigeria', 'Research Output in Health Sciences',
        'Community Impact Index', 'Student Satisfaction',
        'NUC Accreditation', 'MDCN Accreditation', 'NMCN Accreditation',
        'MLSCN Accreditation', 'PCN Accreditation',
        'WHO Grant Recipient', 'Best Teaching Hospital Partnership',
        'Innovation in Medical Education', 'Community Health Champion',
        'Research Excellence Award', 'SDG Champion Institution',
    ]).delete()

    KeyMetric.objects.filter(label__in=[
        'Research Publications', 'Citations', 'h-Index',
        'International Partnerships', 'Faculty with PhD', 'Licensure Exam Pass Rate',
    ]).delete()

    CampusFeature.objects.filter(section_key__in=[
        'housing', 'dining', 'wellness', 'organizations', 'diversity', 'safety',
    ]).delete()

    PS.objects.filter(page_key__in=[
        'international_students', 'exchange', 'partnerships', 'sustainability',
    ]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0028_seed_international_data'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
