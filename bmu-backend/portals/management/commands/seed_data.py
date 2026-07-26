from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from accounts.models import Notification
from accounts.alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
from portals.models import StudentResult, StudentFeePayment, StudentCourse
from content.models import NewsItem, Event, PageContentSimple, Testimonial, Partner, ContactEnquiry, PublicDocument, FundingOrganization, FundedProject, AboutPage, AboutStat, AboutCoreValue, HistoryPage, TimelineEvent, VisionMissionPage, VisionMissionPillar, VisionMissionValue, GovernancePage, GovernanceBody, GovernanceCommittee, GovernancePolicy
from academics.models import College, FacultyUnit, Department, Program, Course, SDGMetric, Leadership
from admissions.models import Application
from library.models import Book, BookCategory, DigitalResource
from research.models import Publication
from academics.models import Faculty
from datetime import date, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed database with sample data for development'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        admin, _ = User.objects.get_or_create(
            email='admin@bmu.edu.ng',
            defaults=dict(username='admin', role='admin', is_superuser=True, is_staff=True),
        )
        if _ or not admin.check_password('admin123'):
            admin.set_password('admin123')
            admin.first_name = 'Admin'
            admin.last_name = 'User'
            admin.save()

        student, _ = User.objects.get_or_create(
            email='student@bmu.edu.ng',
            defaults=dict(username='student', role='student', is_email_verified=True),
        )
        if _:
            student.set_password('student123')
            student.first_name = 'John'
            student.last_name = 'Doe'
            student.save()

        alumni_user, _ = User.objects.get_or_create(
            email='alumni@bmu.edu.ng',
            defaults=dict(username='alumni', role='alumni', is_email_verified=True),
        )
        if _:
            alumni_user.set_password('alumni123')
            alumni_user.first_name = 'Sarah'
            alumni_user.last_name = 'Johnson'
            alumni_user.save()

        faculty_user, _ = User.objects.get_or_create(
            email='faculty@bmu.edu.ng',
            defaults=dict(username='faculty', role='faculty', is_email_verified=True),
        )
        if _:
            faculty_user.set_password('faculty123')
            faculty_user.first_name = 'James'
            faculty_user.last_name = 'Wilson'
            faculty_user.save()

        staff_user, _ = User.objects.get_or_create(
            email='staff@bmu.edu.ng',
            defaults=dict(username='staff', role='staff', is_email_verified=True),
        )
        if _:
            staff_user.set_password('staff123')
            staff_user.first_name = 'Jane'
            staff_user.last_name = 'Smith'
            staff_user.save()

        applicant_user, _ = User.objects.get_or_create(
            email='applicant@bmu.edu.ng',
            defaults=dict(username='applicant', role='applicant', is_email_verified=True),
        )
        if _:
            applicant_user.set_password('applicant123')
            applicant_user.first_name = 'Michael'
            applicant_user.last_name = 'Brown'
            applicant_user.save()

        Notification.objects.create(
            user=student, title='Course Registration Open',
            message='Registration for 2024/2025 second semester is now open',
            type='info'
        )
        Notification.objects.create(
            user=student, title='Exam Timetable Released',
            message='Second semester examination timetable is now available',
            type='success'
        )
        Notification.objects.create(
            user=student, title='Fee Payment Reminder',
            message='Please complete your tuition payment before deadline',
            type='warning'
        )

        today = date.today()
        from datetime import time as dtime
        for ev_data in [
            dict(slug='first-semester-examination', title='First Semester Examination',
                 description='End of semester examinations for all programs',
                 event_date=today + timedelta(days=14), start_time=dtime(9, 0),
                 location='Main Campus', event_type='academic', is_published=True),
            dict(slug='medical-practicals', title='Medical Practicals',
                 description='Practical sessions for medical students',
                 event_date=today + timedelta(days=7), start_time=dtime(14, 0),
                 location='Teaching Hospital', event_type='academic', is_published=True),
            dict(slug='anatomy-lab-session', title='Anatomy Lab Session',
                 description='Anatomy practical laboratory session',
                 event_date=today + timedelta(days=21), start_time=dtime(10, 0),
                 location='Science Complex', event_type='academic', is_published=True),
        ]:
            Event.objects.get_or_create(slug=ev_data.pop('slug'), defaults=ev_data)

        NewsItem.objects.update_or_create(
            slug='bmu-announces-new-research-partnership',
            defaults={
                'title': 'BMU Announces New Research Partnership',
                'excerpt': 'Bayelsa Medical University has entered into a research partnership with leading international institutions to advance medical research in the Niger Delta region.',
                'content': '<p>Bayelsa Medical University has entered into a landmark research partnership with leading international institutions to advance medical research in the Niger Delta region.</p><p>The partnership will focus on tropical disease research, community health initiatives, and capacity building for local researchers. This collaboration marks a significant step in BMU\'s mission to become a centre of excellence in medical education and research in Africa.</p>',
                'category': 'research',
                'author': 'Admin User',
                'is_published': True,
                'published_at': timezone.now(),
            },
        )
        NewsItem.objects.update_or_create(
            slug='vc-welcomes-new-intake-of-students',
            defaults={
                'title': 'VC Welcomes New Intake of Students',
                'excerpt': 'The Vice Chancellor has welcomed the new batch of students for the 2025/2026 academic session, encouraging them to strive for excellence in their medical studies.',
                'content': '<p>The Vice Chancellor of Bayelsa Medical University has officially welcomed the new intake of students for the 2025/2026 academic session during a matriculation ceremony held at the university\'s main campus.</p><p>In his address, the Vice Chancellor encouraged the new students to remain focused, dedicated, and committed to their studies, emphasizing the university\'s commitment to producing world-class healthcare professionals.</p>',
                'category': 'academic',
                'author': 'Admin User',
                'is_published': True,
                'published_at': timezone.now(),
            },
        )
        NewsItem.objects.update_or_create(
            slug='bmu-community-health-outreach-program',
            defaults={
                'title': 'BMU Community Health Outreach Program Reaches 5,000 Residents',
                'excerpt': 'The university\'s community health outreach program has successfully provided free medical screenings and health education to over 5,000 residents in Bayelsa State.',
                'content': '<p>Bayelsa Medical University\'s community health outreach program has successfully reached over 5,000 residents across Bayelsa State, providing free medical screenings, health education, and basic treatment.</p><p>The initiative, which involves medical students and faculty members, aims to improve healthcare access in rural communities while providing valuable practical experience for students.</p>',
                'category': 'community',
                'author': 'Admin User',
                'is_published': True,
                'is_featured': True,
                'published_at': timezone.now(),
            },
        )

        college, created = College.objects.get_or_create(
            slug='college-of-medical-sciences',
            defaults={
                'name': 'College of Medical Sciences',
                'description': 'The College of Medical Sciences is the flagship academic division of Bayelsa Medical University, offering comprehensive medical and health sciences education.',
                'established_year': 2018,
                'faculty_count': 3,
                'student_count': 120,
                'faculty_members_count': 15,
                'primary_color': '#1E1E1E',
                'secondary_color': '#A51C30',
                'overview_content': 'The College of Medical Sciences provides world-class medical education and research opportunities. Our programs are designed to produce competent, compassionate healthcare professionals who will serve the community and advance medical knowledge.',
                'mission_statement': 'To advance medical education and research through innovative teaching, cutting-edge research, and community service, producing competent and compassionate healthcare professionals.',
                'vision_statement': 'To be a leading center of medical excellence in Africa, recognized for our contributions to healthcare delivery, medical research, and community development.',
                'provost_display_name': 'Prof. Emmanuel Ekanem',
                'director_display_name': 'Dr. Grace Ebi',
                'icon_name': 'GraduationCap',
            },
        )
        if not created:
            college.name = 'College of Medical Sciences'
            college.description = 'The College of Medical Sciences is the flagship academic division of Bayelsa Medical University, offering comprehensive medical and health sciences education.'
            college.established_year = 2018
            college.faculty_count = 3
            college.student_count = 120
            college.faculty_members_count = 15
            college.primary_color = '#1E1E1E'
            college.secondary_color = '#A51C30'
            college.overview_content = 'The College of Medical Sciences provides world-class medical education and research opportunities. Our programs are designed to produce competent, compassionate healthcare professionals who will serve the community and advance medical knowledge.'
            college.mission_statement = 'To advance medical education and research through innovative teaching, cutting-edge research, and community service, producing competent and compassionate healthcare professionals.'
            college.vision_statement = 'To be a leading center of medical excellence in Africa, recognized for our contributions to healthcare delivery, medical research, and community development.'
            college.provost_display_name = 'Prof. Emmanuel Ekanem'
            college.director_display_name = 'Dr. Grace Ebi'
            college.icon_name = 'GraduationCap'
            college.save()
        faculty_unit, created = FacultyUnit.objects.get_or_create(
            slug='faculty-of-basic-medical-sciences',
            defaults={
                'name': 'Faculty of Basic Medical Sciences',
                'college': college,
                'code': 'FBMS',
                'description': 'The Faculty of Basic Medical Sciences provides foundational training in the basic sciences that underpin medical practice, including anatomy, physiology, biochemistry, and pharmacology.',
                'mission_statement': 'To provide excellence in basic medical sciences education and research, laying the foundation for competent medical professionals.',
                'vision_statement': 'To be a leading centre for basic medical sciences education and research in Africa.',
                'dean_display_name': 'Prof. Godwin Ikorite',
                'department_count': 1,
                'staff_count': 10,
                'student_count': 120,
            },
        )
        if not created:
            faculty_unit.name = 'Faculty of Basic Medical Sciences'
            faculty_unit.code = 'FBMS'
            faculty_unit.description = 'The Faculty of Basic Medical Sciences provides foundational training in the basic sciences that underpin medical practice, including anatomy, physiology, biochemistry, and pharmacology.'
            faculty_unit.mission_statement = 'To provide excellence in basic medical sciences education and research, laying the foundation for competent medical professionals.'
            faculty_unit.vision_statement = 'To be a leading centre for basic medical sciences education and research in Africa.'
            faculty_unit.dean_display_name = 'Prof. Godwin Ikorite'
            faculty_unit.department_count = 1
            faculty_unit.staff_count = 10
            faculty_unit.student_count = 120
            faculty_unit.save()

        dept, created = Department.objects.get_or_create(
            slug='department-of-medicine',
            defaults={
                'name': 'Department of Medicine',
                'faculty': faculty_unit,
                'code': 'MED',
                'description': 'The Department of Medicine offers comprehensive training in internal medicine, preparing students for careers in clinical practice and medical research.',
                'hod_display_name': 'Prof. John Ebieri',
                'staff_count': 8,
                'student_count': 60,
            },
        )
        if not created:
            dept.name = 'Department of Medicine'
            dept.code = 'MED'
            dept.description = 'The Department of Medicine offers comprehensive training in internal medicine, preparing students for careers in clinical practice and medical research.'
            dept.hod_display_name = 'Prof. John Ebieri'
            dept.staff_count = 8
            dept.student_count = 60
            dept.save()
        program, updated = Program.objects.get_or_create(
            slug='mbbs-medicine-surgery',
            defaults={
                'title': 'MBBS Medicine and Surgery',
                'department': dept, 'college': college,
                'level': 'undergraduate', 'category': 'undergraduate',
                'duration': '6 years',
                'degree': 'MBBS',
                'description': 'A comprehensive six-year program that trains students in all aspects of medicine and surgery, producing competent medical doctors ready for residency training.',
                'requirements': 'Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                'career_opportunities': 'Medical Doctor, Surgeon, Public Health Specialist, Medical Researcher, Hospital Administrator',
                'color': '#0b27ac', 'icon': 'Stethoscope',
                'application_fee_local': 2500, 'application_fee_intl': 50,
                'tuition_per_year_local': 500000, 'tuition_per_year_intl': 8500,
            },
        )
        if not updated:
            program.title = 'MBBS Medicine and Surgery'
            program.degree = 'MBBS'
            program.duration = '6 years'
            program.description = 'A comprehensive six-year program that trains students in all aspects of medicine and surgery, producing competent medical doctors ready for residency training.'
            program.requirements = 'Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.'
            program.career_opportunities = 'Medical Doctor, Surgeon, Public Health Specialist, Medical Researcher, Hospital Administrator'
            program.color = '#0b27ac'
            program.icon = 'Stethoscope'
            program.application_fee_local = 2500
            program.application_fee_intl = 50
            program.tuition_per_year_local = 500000
            program.tuition_per_year_intl = 8500
            program.save()

        course, _ = Course.objects.get_or_create(
            code='MED101',
            defaults=dict(
                title='Human Anatomy I', credit_units=4, department=dept, level=100,
                description='Introduction to human anatomy'
            )
        )
        Course.objects.get_or_create(
            code='MED102',
            defaults=dict(
                title='Physiology I', credit_units=3, department=dept, level=100,
                description='Introduction to human physiology'
            )
        )

        # --- Additional Colleges ---
        allied_college, _ = College.objects.get_or_create(
            slug='school-of-allied-health-sciences',
            defaults={
                'name': 'School of Allied Health Sciences',
                'description': 'Training professionals in medical laboratory science, radiography, physiotherapy, and allied health disciplines.',
                'established_year': 2019,
                'faculty_count': 2,
                'student_count': 80,
                'faculty_members_count': 12,
                'primary_color': '#A51C30',
                'secondary_color': '#1E1E1E',
                'overview_content': 'The School of Allied Health Sciences provides comprehensive training in various allied health disciplines, producing skilled professionals for the healthcare sector.',
                'mission_statement': 'To produce highly skilled allied health professionals through quality education, practical training, and research.',
                'vision_statement': 'To be a leading institution for allied health sciences education in Nigeria.',
                'provost_display_name': 'Dr. Grace Ebi',
                'director_display_name': '',
                'icon_name': 'Microscope',
            },
        )
        nursing_college, _ = College.objects.get_or_create(
            slug='school-of-nursing',
            defaults={
                'name': 'School of Nursing',
                'description': 'Producing compassionate and competent nursing professionals through rigorous training and clinical practice.',
                'established_year': 2018,
                'faculty_count': 2,
                'student_count': 60,
                'faculty_members_count': 10,
                'primary_color': '#1E1E1E',
                'secondary_color': '#A51C30',
                'overview_content': 'The School of Nursing offers comprehensive nursing education programs designed to produce competent, compassionate nurses who will provide quality healthcare services.',
                'mission_statement': 'To educate and train competent nursing professionals who will provide compassionate, evidence-based care.',
                'vision_statement': 'To be a centre of excellence in nursing education and practice.',
                'provost_display_name': 'Prof. Helen Douglas',
                'director_display_name': '',
                'icon_name': 'HeartPulse',
            },
        )
        public_health_college, _ = College.objects.get_or_create(
            slug='institute-of-public-health',
            defaults={
                'name': 'Institute of Public Health',
                'description': 'Focusing on population health, epidemiology, health policy, and community health interventions.',
                'established_year': 2020,
                'faculty_count': 2,
                'student_count': 40,
                'faculty_members_count': 8,
                'primary_color': '#A51C30',
                'secondary_color': '#1E1E1E',
                'overview_content': 'The Institute of Public Health addresses population health challenges through education, research, and community engagement.',
                'mission_statement': 'To advance public health through innovative education, research, and community service.',
                'vision_statement': 'To be a leading public health institution in Africa.',
                'provost_display_name': 'Prof. Chioma Amadi',
                'director_display_name': '',
                'icon_name': 'Activity',
            },
        )

        StudentResult.objects.get_or_create(
            student=student, session='2024/2025', semester='First',
            defaults=dict(level=200, gpa=4.25, cgpa=4.15, courses_taken=8, total_units=24,
                          academic_status='excellent', is_published=True),
        )
        StudentResult.objects.get_or_create(
            student=student, session='2023/2024', semester='Second',
            defaults=dict(level=100, gpa=4.05, cgpa=4.10, courses_taken=7, total_units=21,
                          academic_status='very_good', is_published=True),
        )

        StudentFeePayment.objects.create(
            student=student, fee_type='tuition',
            amount=350000, status='completed',
            payment_reference='PAY-2024-001',
        )
        StudentFeePayment.objects.create(
            student=student, fee_type='accommodation',
            amount=100000, status='pending',
            payment_reference='PAY-2024-002',
        )

        StudentCourse.objects.get_or_create(
            student=student, course=course, session='2024/2025', semester='First',
            defaults=dict(total_score=78.5, grade='A', attendance_percentage=95.0),
        )

        AlumniProfile.objects.create(
            user=alumni_user, graduation_year=2019,
            program=program,
            current_employer='Federal Medical Centre, Yenagoa',
            job_title='Medical Officer', career_status='employed',
            allow_networking=True,
        )

        AlumniEvent.objects.create(
            title='Class of 2019 Reunion',
            description='Five-year reunion for the class of 2019',
            event_date=today + timedelta(days=60),
            location='BMU Campus', event_type='reunion',
        )
        AlumniEvent.objects.create(
            title='Healthcare Leaders Networking',
            description='Networking event for healthcare professionals',
            event_date=today + timedelta(days=30),
            location='Lagos', event_type='networking', is_virtual=True,
        )

        Application.objects.create(
            applicant=applicant_user, first_name='Michael', last_name='Brown',
            email='applicant@bmu.edu.ng', phone='08012345678',
            date_of_birth=date(2000, 5, 15), gender='male',
            address='123 Main Street, Yenagoa, Bayelsa State',
            student_type='LOCAL', program=program,
            previous_institution='Government Secondary School, Yenagoa',
            qualification='ssce', year_of_graduation=2018, grade='pass',
            status='under_review', payment_currency='NGN',
            progress_percentage=60,
            submitted_at=timezone.now() - timedelta(days=5),
        )

        ContactEnquiry.objects.create(
            name='Parent Inquiry', email='parent@example.com',
            subject='admission', message='When does the next admission cycle begin?',
        )
        ContactEnquiry.objects.create(
            name='Research Partner', email='researcher@example.com',
            subject='partnership', message='Interested in collaborating on medical research.',
        )

        cat = BookCategory.objects.create(name='Medical Textbooks', code='MED')
        Book.objects.create(
            title='Gray Anatomy for Students',
            authors='Richard Drake, A. Wayne Vogl, Adam W. M. Mitchell',
            isbn='9780323393041', resource_type='book',
            publisher='Elsevier', publication_year=2020,
            description='Comprehensive anatomy textbook for medical students',
        )
        Book.objects.create(
            title='Harrison Principles of Internal Medicine',
            authors='J. Larry Jameson et al.',
            isbn='9781264268504', resource_type='book',
            publisher='McGraw Hill', publication_year=2022,
            description='Leading textbook on internal medicine',
        ).categories.add(cat)

        DigitalResource.objects.create(
            name='PubMed Central', description='Free full-text archive of biomedical literature',
            resource_type='database', url='https://www.ncbi.nlm.nih.gov/pmc/',
            requires_login=False, is_active=True,
        )
        DigitalResource.objects.create(
            name='BMU Institutional Repository', description='Research outputs from BMU',
            resource_type='repository', url='https://repository.bmu.edu.ng/',
            requires_login=True, is_active=True,
        )

        # --- Additional Programs ---
        extra_programs = [
            # School of Allied Health Sciences
            dict(slug='bmls-medical-laboratory-science', title='BMLS Medical Laboratory Science', college=allied_college, level='undergraduate', category='undergraduate', degree='BMLS', duration='5 years', icon='Microscope', color='#A51C30',
                 description='A comprehensive program training students in medical laboratory diagnostics, including hematology, microbiology, and clinical chemistry.',
                 requirements='Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                 career_opportunities='Medical Laboratory Scientist, Research Scientist, Lab Manager, Infection Control Specialist',
                 application_fee_local=2500, application_fee_intl=50, tuition_per_year_local=350000, tuition_per_year_intl=6000),
            dict(slug='bsc-radiography', title='BSc Radiography', college=allied_college, level='undergraduate', category='undergraduate', degree='BSc', duration='5 years', icon='Scan', color='#A51C30',
                 description='Training students in medical imaging techniques including X-ray, ultrasound, CT scan, and MRI for diagnostic purposes.',
                 requirements='Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                 career_opportunities='Radiographer, Ultrasound Technician, CT/MRI Technologist, Healthcare Administrator',
                 application_fee_local=2500, application_fee_intl=50, tuition_per_year_local=350000, tuition_per_year_intl=6000),
            dict(slug='bsc-physiotherapy', title='BSc Physiotherapy', college=allied_college, level='undergraduate', category='undergraduate', degree='BSc', duration='5 years', icon='Activity', color='#A51C30',
                 description='Training students in physical therapy techniques to help patients recover from injuries and improve mobility.',
                 requirements='Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                 career_opportunities='Physiotherapist, Sports Therapist, Rehabilitation Specialist, Clinic Owner',
                 application_fee_local=2500, application_fee_intl=50, tuition_per_year_local=350000, tuition_per_year_intl=6000),
            # School of Nursing
            dict(slug='bnsc-nursing-science', title='B.NSc Nursing Science', college=nursing_college, level='undergraduate', category='undergraduate', degree='B.NSc', duration='5 years', icon='HeartPulse', color='#1E1E1E',
                 description='A comprehensive nursing program that prepares students for professional nursing practice across all healthcare settings.',
                 requirements='Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                 career_opportunities='Registered Nurse, Nurse Educator, Nurse Administrator, Public Health Nurse',
                 application_fee_local=2500, application_fee_intl=50, tuition_per_year_local=300000, tuition_per_year_intl=5500),
            dict(slug='msc-nursing', title='MSc Nursing', college=nursing_college, level='masters', category='postgraduate', degree='MSc', duration='2 years', icon='BookOpen', color='#1E1E1E',
                 description='Advanced nursing education for registered nurses seeking specialization and leadership roles.',
                 requirements='B.NSc degree with at least Second Class Upper division. Registered Nurse with current practicing license.',
                 career_opportunities='Nurse Specialist, Nurse Educator, Clinical Researcher, Healthcare Administrator',
                 application_fee_local=5000, application_fee_intl=100, tuition_per_year_local=400000, tuition_per_year_intl=7000),
            # Institute of Public Health
            dict(slug='msc-public-health', title='MSc Public Health', college=public_health_college, level='masters', category='postgraduate', degree='MSc', duration='2 years', icon='Globe', color='#A51C30',
                 description='Advanced training in public health practice, epidemiology, health policy, and community health intervention.',
                 requirements='Bachelor\'s degree in health-related field with at least Second Class Upper division.',
                 career_opportunities='Public Health Specialist, Epidemiologist, Health Policy Analyst, NGO Program Manager',
                 application_fee_local=5000, application_fee_intl=100, tuition_per_year_local=500000, tuition_per_year_intl=8500),
            dict(slug='phd-public-health', title='PhD Public Health', college=public_health_college, level='phd', category='postgraduate', degree='PhD', duration='3 years', icon='Award', color='#A51C30',
                 description='Doctoral program for advanced research in public health, preparing academic and research leaders.',
                 requirements='Master\'s degree in Public Health or related field with research thesis component.',
                 career_opportunities='University Professor, Senior Researcher, Public Health Director, Policy Advisor',
                 application_fee_local=10000, application_fee_intl=150, tuition_per_year_local=600000, tuition_per_year_intl=10000),
            # College of Medical Sciences - additional programs
            dict(slug='bsc-human-anatomy', title='BSc Human Anatomy', college=college, level='undergraduate', category='undergraduate', degree='BSc', duration='4 years', icon='Bone', color='#1E1E1E',
                 description='A program focused on the structure of the human body, providing foundational knowledge for medical and health sciences careers.',
                 requirements='Five O-level credits in Biology, Chemistry, Physics, Mathematics, and English.',
                 career_opportunities='Anatomist, Medical Illustrator, Forensic Scientist, Research Assistant',
                 application_fee_local=2500, application_fee_intl=50, tuition_per_year_local=300000, tuition_per_year_intl=5500),
            dict(slug='msc-physiology', title='MSc Physiology', college=college, level='masters', category='postgraduate', degree='MSc', duration='2 years', icon='Brain', color='#1E1E1E',
                 description='Advanced study of body functions and regulatory mechanisms for research and academic careers.',
                 requirements='Bachelor\'s degree in Physiology or related biomedical science with Second Class Upper division.',
                 career_opportunities='Physiologist, Research Scientist, Lecturer, Pharmaceutical Researcher',
                 application_fee_local=5000, application_fee_intl=100, tuition_per_year_local=400000, tuition_per_year_intl=7000),
        ]
        for prog in extra_programs:
            p, created = Program.objects.get_or_create(
                slug=prog.pop('slug'),
                defaults=prog,
            )
            if not created:
                for key, val in prog.items():
                    setattr(p, key, val)
                p.save()

        # Seed Faculty members
        from academics.models import Faculty as FacultyModel
        dept_medicine = Department.objects.filter(name='Department of Medicine').first()
        faculty_data = [
            dict(first_name='Emeka', last_name='Okafor', title='Prof.', email='emeka.okafor@bmu.edu.ng',
                 college=college, department=dept_medicine, position='professor',
                 research_interests='Malaria, Infectious Diseases, Public Health',
                 bio='Professor of Medicine with over 20 years of research experience in infectious diseases.', citations=1450, h_index=22, i10_index=35),
            dict(first_name='Funmilayo', last_name='Adebayo', title='Dr.', email='funmi.adebayo@bmu.edu.ng',
                 college=college, department=dept_medicine, position='senior_lecturer',
                 research_interests='Non-Communicable Diseases, Cardiovascular Health',
                 bio='Senior Lecturer specializing in NCD epidemiology and prevention.', citations=680, h_index=15, i10_index=22),
            dict(first_name='Godwin', last_name='Samuel', title='Dr.', email='godwin.samuel@bmu.edu.ng',
                 college=allied_college, department=None, position='lecturer',
                 research_interests='Medical Laboratory Science, Clinical Chemistry',
                 bio='Lecturer in Medical Laboratory Science with expertise in clinical diagnostics.', citations=320, h_index=10, i10_index=14),
            dict(first_name='Nkechi', last_name='Okonkwo', title='Prof.', email='nkechi.okonkwo@bmu.edu.ng',
                 college=nursing_college, department=None, position='professor',
                 research_interests='Nursing Education, Maternal Health, Community Health',
                 bio='Professor of Nursing with extensive experience in maternal and child health.', citations=890, h_index=18, i10_index=28),
            dict(first_name='Chidi', last_name='Eze', title='Dr.', email='chidi.eze@bmu.edu.ng',
                 college=public_health_college, department=None, position='senior_lecturer',
                 research_interests='Environmental Health, Climate Change, Water Sanitation',
                 bio='Senior Lecturer in Public Health focusing on environmental determinants of health.', citations=520, h_index=12, i10_index=18),
        ]
        for fdata in faculty_data:
            obj, created = FacultyModel.objects.get_or_create(
                email=fdata.pop('email'),
                defaults=fdata,
            )
            if not created:
                for key, val in fdata.items():
                    setattr(obj, key, val)
                obj.save()

        # Seed Publications
        publication_data = [
            dict(title='Malaria burden and trends in the Niger Delta region: A 10-year retrospective analysis',
                 external_authors='Prof. Emeka Okafor, Dr. Funmilayo Adebayo, Dr. Ibrahim Musa, Chinedu Nwosu',
                 publication_type='journal', journal_name='Journal of Tropical Medicine and Public Health',
                 year=2024, volume='18', issue='3', pages='245-260',
                 doi='10.1234/jtmph.2024.01803', citations=24, category='Malaria Research',
                 abstract='This study examines the 10-year epidemiological trends of malaria in Bayelsa State and the wider Niger Delta region. A retrospective analysis of hospital records from 2014-2023 reveals a declining but still significant burden, with seasonal peaks corresponding to rainy seasons. Children under 5 remain the most affected demographic. The findings underscore the need for sustained vector control programs and improved access to diagnostic services in rural communities.',
                 keywords='malaria, Niger Delta, epidemiology, infectious disease, public health',
                 is_peer_reviewed=True),
            dict(title='Prevalence and risk factors for hypertension among adults in Yenagoa, Bayelsa State',
                 external_authors='Dr. Funmilayo Adebayo, Prof. Godwin Okpara, Blessing Williams',
                 publication_type='journal', journal_name='Nigerian Journal of Cardiology',
                 year=2023, volume='45', issue='2', pages='112-128',
                 doi='10.5678/njc.2023.04502', citations=18, category='Non-Communicable Diseases',
                 abstract='A cross-sectional study of 1,200 adults aged 18-65 in Yenagoa metropolis assessed the prevalence and determinants of hypertension. The overall prevalence was 34.2%, with significantly higher rates among males, older adults, and those with higher BMI. Physical inactivity, high salt intake, and alcohol consumption emerged as key modifiable risk factors. The study highlights the urgent need for community-based screening and lifestyle intervention programs.',
                 keywords='hypertension, cardiovascular disease, risk factors, Yenagoa, Nigeria',
                 is_peer_reviewed=True),
            dict(title='Evaluation of laboratory diagnostic accuracy for tuberculosis in resource-limited settings',
                 external_authors='Dr. Godwin Samuel, Prof. Emmanuel Akpan, Mary James',
                 publication_type='journal', journal_name='African Journal of Laboratory Medicine',
                 year=2024, volume='12', issue='1', pages='78-92',
                 doi='10.7890/ajlm.2024.12101', citations=9, category='Infectious Diseases',
                 abstract='This study evaluated the diagnostic accuracy of microscopy, GeneXpert, and culture methods for pulmonary tuberculosis diagnosis across three health facilities in Bayelsa State. GeneXpert demonstrated the highest sensitivity (94.2%) and specificity (98.5%), while microscopy showed reduced sensitivity (62.3%) in HIV-coinfected patients. The findings support the expanded deployment of molecular diagnostics in peripheral health facilities.',
                 keywords='tuberculosis, diagnostic accuracy, GeneXpert, laboratory medicine, Nigeria',
                 is_peer_reviewed=True),
            dict(title='Nursing students\' perception of simulation-based learning in clinical education',
                 external_authors='Prof. Nkechi Okonkwo, Dr. Adaobi Eze, Chinwe Umeh',
                 publication_type='journal', journal_name='West African Journal of Nursing',
                 year=2023, volume='55', issue='4', pages='301-318',
                 doi='10.2345/wajn.2023.05504', citations=15, category='Medical Education',
                 abstract='A mixed-methods study exploring nursing students\' perceptions of simulation-based learning at BMU. Quantitative data from 180 students showed high satisfaction scores (mean 4.2/5), with students reporting improved clinical confidence and critical thinking skills. Qualitative themes highlighted the value of safe practice environments and the need for more simulation hours. Recommendations include integrating structured simulation across the nursing curriculum.',
                 keywords='nursing education, simulation, clinical training, students, Nigeria',
                 is_peer_reviewed=True),
            dict(title='Climate change awareness and adaptation practices in coastal communities of Bayelsa State',
                 external_authors='Dr. Chidi Eze, Prof. Michael Benson, Esther George',
                 publication_type='journal', journal_name='International Journal of Environmental Health Research',
                 year=2024, volume='30', issue='2', pages='189-205',
                 doi='10.3456/ijerh.2024.03002', citations=12, category='Environmental Health',
                 abstract='A community-based survey of 600 households across 12 coastal communities assessed climate change awareness, perceived impacts, and adaptation strategies. While 78% of respondents acknowledged changes in weather patterns, only 35% had adopted adaptive measures. Flooding was the most frequently reported climate-related hazard (62%). The study recommends culturally-tailored awareness campaigns and improved early warning systems for vulnerable coastal populations.',
                 keywords='climate change, adaptation, coastal communities, environmental health, Bayelsa',
                 is_peer_reviewed=True),
            dict(title='Medical education in Nigeria: Challenges and opportunities for reform',
                 external_authors='Prof. Emeka Okafor, Dr. Funmilayo Adebayo, Prof. Nkechi Okonkwo',
                 publication_type='journal', journal_name='Nigerian Medical Journal',
                 year=2022, volume='63', issue='6', pages='410-425',
                 doi='10.7891/nmj.2022.06306', citations=32, category='Medical Education',
                 abstract='This review examines the current state of medical education in Nigeria, identifying key challenges including inadequate infrastructure, faculty shortages, limited clinical placement sites, and curriculum gaps. Opportunities for reform include competency-based curricula, expanded use of simulation and e-learning, interprofessional education models, and strengthened accreditation processes. Lessons from reforms in other African countries are discussed.',
                 keywords='medical education, Nigeria, curriculum reform, accreditation, health workforce',
                 is_peer_reviewed=True),
            dict(title='Prevalence of antimicrobial resistance among clinical isolates in a tertiary hospital in Southern Nigeria',
                 external_authors='Dr. Godwin Samuel, Dr. Ibrahim Musa, Prof. Emeka Okafor',
                 publication_type='journal', journal_name='African Journal of Clinical Microbiology',
                 year=2023, volume='28', issue='Con/NCE/2023', pages='55-70',
                 doi='10.4567/ajcm.2023.02804', citations=20, category='Infectious Diseases',
                 abstract='A retrospective analysis of antimicrobial susceptibility data from 2,500 clinical isolates collected at a tertiary hospital between 2020-2022. High resistance rates were observed for commonly used antibiotics: 78% of S. aureus isolates were methicillin-resistant (MRSA), and 65% of E. coli isolates were extended-spectrum beta-lactamase (ESBL) producers. Carbapenem resistance among Gram-negative organisms was 22%. The study reinforces the urgent need for antimicrobial stewardship programs.',
                 keywords='antimicrobial resistance, MRSA, ESBL, clinical microbiology, Nigeria',
                 is_peer_reviewed=True),
            dict(title='Community health workers\' role in improving maternal and child health outcomes in rural Nigeria',
                 external_authors='Prof. Nkechi Okonkwo, Dr. Chioma Amadi, Esther George',
                 publication_type='journal', journal_name='Journal of Community Health',
                 year=2024, volume='49', issue='1', pages='33-48',
                 doi='10.5679/jch.2024.04901', citations=8, category='Maternal Health',
                 abstract='An evaluation of a community health worker (CHW) program in 15 rural communities in Bayelsa State. CHW-facilitated interventions led to a 40% increase in antenatal care attendance, 35% improvement in skilled birth attendance, and 28% increase in childhood immunization coverage. Qualitative findings indicate that trust, cultural competence, and community embeddedness were key success factors. Sustainable financing and supervision remain critical challenges.',
                 keywords='community health workers, maternal health, child health, rural, Nigeria',
                 is_peer_reviewed=True),
            dict(title='Water quality assessment of borehole sources in peri-urban communities of Bayelsa State',
                 external_authors='Dr. Chidi Eze, Prof. Michael Benson',
                 publication_type='journal', journal_name='Journal of Water and Health',
                 year=2023, volume='41', issue='3', pages='267-284',
                 doi='10.6780/jwh.2023.04103', citations=14, category='Environmental Health',
                 abstract='Physicochemical and bacteriological analysis of water samples from 40 boreholes across 8 peri-urban communities was conducted. 55% of samples exceeded WHO guidelines for coliform bacteria, and 30% had elevated nitrate levels. Iron and manganese concentrations exceeded aesthetic guidelines in 45% of samples. The study recommends regular water quality monitoring, point-of-use treatment, and community education on safe water handling practices.',
                 keywords='water quality, borehole, contamination, peri-urban, Bayelsa',
                 is_peer_reviewed=True),
            dict(title='Impact of a school-based malaria prevention program on knowledge and practices among secondary school students',
                 external_authors='Prof. Emeka Okafor, Dr. Funmilayo Adebayo, Blessing Williams',
                 publication_type='conference', journal_name='Proceedings of the Nigerian Medical Association Annual Conference',
                 conference_name='NMA Annual Conference 2024',
                 year=2024, volume='', issue='', pages='125-130',
                 doi='10.8901/nma.2024.conf', citations=5, category='Malaria Research',
                 abstract='A school-based intervention involving 600 secondary school students demonstrated significant improvements in malaria knowledge (pre: 45%, post: 82%) and preventive practices (ITN usage: from 38% to 67%). The peer-education model proved particularly effective. The program provides a scalable framework for school-based malaria control in endemic regions.',
                 keywords='malaria, school-based intervention, health education, prevention, adolescents',
                 is_peer_reviewed=True),
            dict(title='Bayelsa Medical University research report 2023-2024',
                 external_authors='Research and Development Directorate',
                 publication_type='report',
                 journal_name='BMU Research and Development Directorate Report',
                 year=2024, volume='', issue='', pages='1-85',
                 doi='', citations=0, category='Health Systems',
                 abstract='Annual research report summarizing research activities, publications, grants, and collaborations at Bayelsa Medical University for the academic year 2023-2024.',
                 keywords='research report, BMU, research activities, 2024',
                 is_peer_reviewed=False),
            dict(title='Nigeria\'s health system strengthening: A roadmap for universal health coverage',
                 external_authors='Dr. Chidi Eze, Prof. Michael Benson, Dr. Chioma Amadi',
                 publication_type='book',
                 journal_name='Health Policy Press',
                 year=2023, volume='', issue='', pages='1-320',
                 doi='10.9012/hpp.2023.uhc', citations=42, category='Health Systems',
                 abstract='A comprehensive analysis of Nigeria\'s health system challenges and a proposed roadmap for achieving universal health coverage through strengthened primary care, innovative financing mechanisms, improved health information systems, and enhanced human resources for health.',
                 keywords='health system, Nigeria, universal health coverage, health policy, primary care',
                 is_peer_reviewed=True),
        ]
        for pub in publication_data:
            Publication.objects.get_or_create(
                title=pub['title'],
                defaults=dict(
                    publication_type=pub['publication_type'],
                    journal_name=pub.get('journal_name', ''),
                    external_authors=pub['external_authors'],
                    year=pub['year'],
                    volume=pub.get('volume', ''),
                    issue=pub.get('issue', ''),
                    pages=pub.get('pages', ''),
                    doi=pub.get('doi', ''),
                    citations=pub.get('citations', 0),
                    abstract=pub.get('abstract', ''),
                    keywords=pub.get('keywords', ''),
                    is_peer_reviewed=pub.get('is_peer_reviewed', True),
                    conference_name=pub.get('conference_name', ''),
                    category=pub.get('category', ''),
                ),
            )

        # Seed SDG metrics
        sdg_metrics_data = [
            # SDG 3: Good Health & Well-being
            dict(sdg_code='sdg3', label='Patients treated in free clinics', current_value=12847, target_value=20000, unit='patients'),
            dict(sdg_code='sdg3', label='Malaria sensitization campaigns', current_value=45, target_value=60, unit='communities'),
            dict(sdg_code='sdg3', label='Maternal health workshops', current_value=128, target_value=150, unit='sessions'),
            dict(sdg_code='sdg3', label='Outbreak responses', current_value=8, target_value=10, unit='responses'),
            dict(sdg_code='sdg3', label='Healthcare workers trained', current_value=2150, target_value=2500, unit='trainees'),
            # SDG 4: Quality Education
            dict(sdg_code='sdg4', label='Scholarships awarded', current_value=520, target_value=600, unit='students'),
            dict(sdg_code='sdg4', label='CPD certificates issued', current_value=1450, target_value=2000, unit='certificates'),
            dict(sdg_code='sdg4', label='Licensure exam pass rate', current_value=94, target_value=95, unit='%'),
            dict(sdg_code='sdg4', label='Students enrolled', current_value=15200, target_value=18000, unit='students'),
            dict(sdg_code='sdg4', label='Youth mentored', current_value=1200, target_value=1500, unit='mentees'),
            # SDG 5: Gender Equality
            dict(sdg_code='sdg5', label='Female faculty percentage', current_value=45, target_value=50, unit='%'),
            dict(sdg_code='sdg5', label='Female student enrollment', current_value=62, target_value=65, unit='%'),
            dict(sdg_code='sdg5', label='Female leadership positions', current_value=45, target_value=50, unit='%'),
            dict(sdg_code='sdg5', label='Gender-based violence programs', current_value=48, target_value=60, unit='programs'),
        ]
        for sm in sdg_metrics_data:
            SDGMetric.objects.get_or_create(
                sdg_code=sm['sdg_code'],
                label=sm['label'],
                defaults=dict(
                    current_value=sm['current_value'],
                    target_value=sm['target_value'],
                    unit=sm['unit'],
                ),
            )

        # Leadership
        leaders_data = [
            dict(first_name='Dimie', last_name='Ogoina', title='Prof.', position='vc', specific_title='Vice Chancellor', biography='Professor Dimie brings over 25 years of experience in medical education and healthcare administration. Former MD the Niger Delta University Teaching Hospital, he has published extensively in public health and health systems research.', qualifications='MBBS, FWACS, PhD', email='vc@bmu.edu.ng', phone='+234 803 111 0001', display_order=1),
            dict(first_name='Ligha Aloysius', last_name='Ebi', title='Prof.', position='dvc_academic', specific_title='Deputy Vice Chancellor - Academic', biography='Professor Ligha Aloysius Ebi is a renowned professor of Nursing with expertise in curriculum development and quality assurance in health professions education.', qualifications='PhD Nursing, MSc Health Education', email='dvc.academic@bmu.edu.ng', phone='+234 803 111 0002', display_order=2),
            dict(first_name='Godwill Abraham', last_name='Ziriki', title='Prof.', position='dvc_admin', specific_title='Deputy Vice Chancellor, Sampou Campus', biography='Professor Godwill Abraham Ziriki oversees the administrative operations of the Sampou Campus. With expertise in Physics, he has successfully managed the Sampou Campus of the University effectively.', qualifications='MBBS, MPH, MBA', email='dvc.admin@bmu.edu.ng', phone='+234 803 111 0003', display_order=3),
            dict(first_name='Felicia Eyimuze', last_name='Akusu', title='Dr.', position='registrar', specific_title='Registrar', biography='Dr. Felicia manages the university\'s governance and administrative records. She brings expertise in academic policy and regulatory compliance.', qualifications='PhD Educational Administration', email='registrar@bmu.edu.ng', phone='+234 803 111 0004', display_order=4),
            dict(first_name='David', last_name='Alagoa', title='Mr.', position='bursar', specific_title='Bursar', biography='Mr. Alagoa oversees all financial operations of the university. With over 15 years of experience in educational institution finance, he ensures prudent resource management.', qualifications='MBA (Finance), ACA', email='bursar@bmu.edu.ng', phone='+234 803 111 0021', display_order=5),
            dict(first_name='Blessing', last_name='Ayibatari', title='Mrs.', position='librarian', specific_title='University Librarian', biography='Mrs. Ayibatari manages the university library system and digital resources. She has transformed BMU\'s library into a modern information center.', qualifications='MLS, MA (Information Science)', email='librarian@bmu.edu.ng', phone='+234 803 111 0022', display_order=6),
            dict(first_name='Tonye', last_name='Oweifa', title='Engr.', position='director', specific_title='Director of Works', biography='Engr. Tonye manages the university\'s physical infrastructure development and maintenance, ensuring a safe and conducive environment for learning.', qualifications='B.Eng (Civil), MNSE', email='director.works@bmu.edu.ng', phone='+234 803 111 0023', display_order=7),
            dict(first_name='John', last_name='Okonkwo', title='Prof.', position='dean', specific_title='Dean, College of Medicine', biography='Professor Okonkwo is an experienced internist with over 20 years of clinical and teaching experience. He leads the College of Medicine with a focus on producing competent physicians.', qualifications='MBBS, PhD (Internal Medicine)', email='dean.medicine@bmu.edu.ng', phone='+234 803 111 0011', display_order=8),
            dict(first_name='Grace', last_name='Ebi', title='Dr.', position='dean', specific_title='Dean, School of Allied Health Sciences', biography='Dr. Ebi brings extensive experience in public health and laboratory medicine. She oversees programs in medical laboratory science, radiography, and other allied health disciplines.', qualifications='MBBS, MPH, MSc (Medical Laboratory Science)', email='dean.alliedhealth@bmu.edu.ng', phone='+234 803 111 0012', display_order=9),
            dict(first_name='Helen', last_name='Douglas', title='Prof.', position='dean', specific_title='Dean, School of Nursing', biography='Professor Douglas serves dual roles as DVC Academic and Dean of Nursing. She is a renowned nursing educator with expertise in curriculum development.', qualifications='PhD Nursing, MSc Health Education', email='dean.nursing@bmu.edu.ng', phone='+234 803 111 0002', display_order=10),
            dict(first_name='Michael', last_name='Ogu', title='Prof.', position='dean', specific_title='Dean, School of Postgraduate Studies', biography='Professor Ogu manages postgraduate programs at BMU, ensuring high standards for advanced degrees and research supervision.', qualifications='MBBS, MPH, MBA', email='dean.postgraduate@bmu.edu.ng', phone='+234 803 111 0003', display_order=11),
            dict(first_name='Esther', last_name='Friday', title='Dr.', position='dean', specific_title='Dean, School of Basic Medical Sciences', biography='Dr. Esther leads the School of Basic Medical Sciences, overseeing foundational science education for all health professional programs.', qualifications='MBBS, PhD (Anatomy)', email='dean.basicmed@bmu.edu.ng', phone='+234 803 111 0014', display_order=12),
            dict(first_name='Solomon', last_name='Briggs', title='Dr.', position='dean', specific_title='Dean, School of Public Health', biography='Dr. Briggs leads the School of Public Health, focusing on community health education, epidemiology training, and health policy research.', qualifications='MBBS, MPH, DrPH', email='dean.publichealth@bmu.edu.ng', phone='+234 803 111 0015', display_order=13),
        ]
        for ld in leaders_data:
            Leadership.objects.get_or_create(
                first_name=ld['first_name'],
                last_name=ld['last_name'],
                defaults=dict(
                    title=ld.get('title', ''),
                    position=ld['position'],
                    specific_title=ld.get('specific_title', ''),
                    biography=ld['biography'],
                    qualifications=ld.get('qualifications', ''),
                    email=ld.get('email'),
                    phone=ld.get('phone'),
                    display_order=ld['display_order'],
                    is_active=True,
                ),
            )

        # Annual Impact Reports
        impact_reports = [
            dict(title='Annual Impact Report 2024', description='Comprehensive report on BMU\'s SDG contributions and community impact for the 2024 academic year.', category='strategic', file_type='pdf', file_size='4.2 MB', version='2024', date_label='March 2025', display_order=1, is_featured=True),
            dict(title='Annual Impact Report 2023', description='Detailed overview of BMU\'s impact on health, education, and gender equality in 2023.', category='strategic', file_type='pdf', file_size='3.8 MB', version='2023', date_label='March 2024', display_order=2, is_featured=True),
            dict(title='Annual Impact Report 2022', description='Baseline impact report establishing key metrics for THE Impact Rankings submission.', category='strategic', file_type='pdf', file_size='3.5 MB', version='2022', date_label='April 2023', display_order=3, is_featured=True),
        ]
        for r in impact_reports:
            PublicDocument.objects.get_or_create(
                title=r['title'],
                defaults=dict(
                    description=r['description'],
                    category=r['category'],
                    file_type=r['file_type'],
                    file_size=r['file_size'],
                    version=r['version'],
                    date_label=r['date_label'],
                    display_order=r['display_order'],
                    is_featured=r['is_featured'],
                ),
            )

        # Funding Organizations
        orgs_data = [
            dict(name='Tertiary Education Trust Fund', acronym='TETFUND', description='Federal government agency established to provide funding for public tertiary institutions in Nigeria for infrastructure, research, and academic staff development.', website='https://www.tetfund.gov.ng'),
            dict(name='Nigerian Content Development and Monitoring Board', acronym='NCDMB', description='The Nigerian Content Development and Monitoring Board (NCDMB) is a parastatal of the Federal Government of Nigeria that promotes the development of Nigerian content in the oil and gas industry.', website='https://www.ncdmb.gov.ng'),
            dict(name='World Health Organization', acronym='WHO', description='The World Health Organization provides technical and financial support for health research, disease control, and health systems strengthening at BMU.', website='https://www.who.int'),
            dict(name='Nigerian Medical Association', acronym='NMA', description='The Nigerian Medical Association supports medical education, research, and professional development at BMU.', website='https://www.nma.org.ng'),
            dict(name='Bayelsa State Government', acronym='Bayelsa Govt', description='The Bayelsa State Government provides funding for infrastructure development, scholarships, and health programs at BMU.', website='https://www.bayelsa.gov.ng'),
        ]
        org_instances = {}
        for od in orgs_data:
            org, _ = FundingOrganization.objects.get_or_create(
                name=od['name'],
                defaults=dict(acronym=od['acronym'], description=od['description'], website=od['website']),
            )
            org_instances[org.acronym] = org

        # Funded Projects
        projects_data = [
            # TETFUND projects
            dict(title='Construction of Modern Medical Research Laboratory', org='TETFUND', amount=250_000_000, year=2024, status='ongoing', description='Construction of a state-of-the-art medical research laboratory equipped with modern diagnostic and research equipment for infectious disease research.'),
            dict(title='Academic Staff Development Program (PhD)', org='TETFUND', amount=180_000_000, year=2024, status='ongoing', description='Sponsorship of 25 academic staff for PhD programs in various medical specialties at universities across Nigeria and abroad.'),
            dict(title='E-Library Infrastructure Upgrade', org='TETFUND', amount=120_000_000, year=2023, status='completed', description='Upgrade of the university e-library with high-speed internet, digital databases, and modern computing facilities to support medical research.'),
            dict(title='Medical Simulation Centre', org='TETFUND', amount=200_000_000, year=2023, status='completed', description='Establishment of a medical simulation centre for clinical skills training using high-fidelity mannequins and virtual reality technology.'),
            dict(title='University Teaching Hospital Equipment', org='TETFUND', amount=350_000_000, year=2022, status='completed', description='Procurement and installation of modern medical equipment for the BMU Teaching Hospital including MRI, CT scan, and dialysis machines.'),
            # NCDMB projects
            dict(title='Oil and Gas Occupational Health Centre', org='NCDMB', amount=180_000_000, year=2024, status='ongoing', description='Establishment of a specialized occupational health centre focusing on oil and gas industry worker health and safety in the Niger Delta region.'),
            dict(title='Environmental Health Research Programme', org='NCDMB', amount=95_000_000, year=2024, status='ongoing', description='Research program studying the health impact of oil exploration on host communities and developing mitigation strategies.'),
            dict(title='Community Health Outreach in Oil-Producing Areas', org='NCDMB', amount=75_000_000, year=2023, status='completed', description='Mobile health outreach program providing free medical services to 20 communities in oil-producing areas of Bayelsa State.'),
            # WHO projects
            dict(title='Malaria Elimination Research Initiative', org='WHO', amount=120_000_000, year=2024, status='ongoing', description='Research initiative focused on developing new strategies for malaria elimination in the Niger Delta region.'),
            dict(title='Maternal and Child Health Improvement Project', org='WHO', amount=85_000_000, year=2023, status='completed', description='Community-based intervention program to reduce maternal and child mortality in Bayelsa State.'),
            # NMA projects
            dict(title='Continuing Medical Education Programme', org='NMA', amount=45_000_000, year=2024, status='ongoing', description='Annual continuing medical education program for healthcare professionals across Bayelsa State.'),
            # Bayelsa Govt projects
            dict(title='Free Medical Mission Programme', org='Bayelsa Govt', amount=150_000_000, year=2024, status='ongoing', description='Quarterly free medical missions providing consultations, surgeries, and medications to underserved communities.'),
            dict(title='Scholarship Scheme for Indigent Students', org='Bayelsa Govt', amount=200_000_000, year=2023, status='completed', description='Scholarship program supporting 500 indigent students studying medicine and health sciences at BMU.'),
        ]
        for pd in projects_data:
            FundedProject.objects.get_or_create(
                title=pd['title'],
                defaults=dict(
                    organization=org_instances[pd['org']],
                    amount=pd['amount'],
                    year=pd['year'],
                    status=pd['status'],
                    description=pd['description'],
                ),
            )

        # Seed Admission Requirements
        from admissions.models import AdmissionRequirement, ImportantDate

        req_data = [
            dict(category='undergraduate', title='General Requirements', display_order=1,
                 items=['Five (5) O\'level Credit Passes at NOT MORE THAN TWO (2) SITTINGS in the following subjects:',
                        'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
                        'Minimum UTME score of 180',
                        'Must be at least 16 years of age',
                        'NYSC discharge/exemption certificate (for Direct Entry candidates)']),
            dict(category='undergraduate', title='Document Requirements', display_order=2,
                 items=['Completed Application Form', 'O\'Level Results (WAEC/NECO/NABTEB)',
                        'UTME Result Slip', 'Birth Certificate or Age Declaration',
                        'Certificate of Origin', 'Recent Passport Photographs (4 copies)',
                        'Medical Fitness Report']),
            dict(category='postgraduate', title='General Requirements', display_order=1,
                 items=['Bachelor\'s degree in relevant field with at least Second Class Upper division',
                        'NYSC discharge/exemption certificate',
                        'Transcript of academic records from previous institution',
                        'Three (3) Referee Reports (academic references)',
                        'Statement of Purpose (500 words)',
                        'Curriculum Vitae']),
            dict(category='postgraduate', title='Document Requirements', display_order=2,
                 items=['Completed Application Form', 'Bachelor\'s Degree Certificate',
                        'NYSC Discharge/Exemption Certificate', 'Academic Transcripts',
                        'Birth Certificate or Age Declaration', 'Certificate of Origin',
                        'Recent Passport Photographs (6 copies)',
                        'Proof of payment of application fee']),
        ]
        for rd in req_data:
            AdmissionRequirement.objects.get_or_create(
                category=rd['category'],
                title=rd['title'],
                defaults=dict(items=rd['items'], display_order=rd['display_order']),
            )

        important_dates = [
            dict(event='Application Opening for 2025/2026 Session', date=date(2025, 6, 1), status='upcoming', display_order=1),
            dict(event='UTME / Direct Entry Application Deadline', date=date(2025, 8, 30), status='upcoming', display_order=2),
            dict(event='Postgraduate Application Deadline', date=date(2025, 9, 15), status='upcoming', display_order=3),
            dict(event='Entrance Examination Date', date=date(2025, 9, 20), status='upcoming', display_order=4),
            dict(event='Interview for Shortlisted Candidates', date=date(2025, 10, 5), status='upcoming', display_order=5, description='Interviews for postgraduate and selected undergraduate programs'),
            dict(event='Admission List Publication', date=date(2025, 10, 30), status='upcoming', display_order=6),
            dict(event='Registration and Orientation Week', date=date(2025, 11, 10), status='upcoming', display_order=7, description='Registration for new students begins'),
            dict(event='First Semester Lectures Begin', date=date(2025, 11, 24), status='upcoming', display_order=8),
        ]
        for d in important_dates:
            ImportantDate.objects.get_or_create(
                event=d['event'],
                defaults=dict(date=d['date'], status=d['status'], display_order=d['display_order'], description=d.get('description', '')),
            )

        # Seed Library Services
        from library.models import LibraryService, LibraryStat, LibraryHour, LibraryGuideline
        from academics.models import Deadline

        services_data = [
            dict(icon='BookOpen', title='Book Lending', description='Borrow books, journals, and other materials from our extensive collection of medical and health sciences resources. Students can borrow up to 5 books for 2 weeks.', display_order=1),
            dict(icon='Search', title='Reference Services', description='Professional librarians assist with research queries, literature searches, and citation management. Book a one-on-one consultation with a subject librarian.', display_order=2),
            dict(icon='Globe', title='Digital Resources', description='Access online databases, e-journals, e-books, and institutional repository 24/7 from anywhere on campus or remotely with your student credentials.', display_order=3),
            dict(icon='Wifi', title='E-Library & Internet', description='High-speed internet access and a fully equipped e-library with 50 computer workstations for digital research and online learning.', display_order=4),
            dict(icon='Users', title='Study Spaces', description='Quiet study areas, group study rooms, and carrel spaces available for individual and collaborative learning. Group rooms can be reserved online.', display_order=5),
            dict(icon='Printer', title='Printing & Scanning', description='Print, photocopy, and scan services available at nominal fees. Students can upload documents for printing from any device on campus.', display_order=6),
        ]
        for s in services_data:
            LibraryService.objects.get_or_create(
                title=s['title'],
                defaults=s,
            )

        stats_data = [
            dict(value='50,000+', label='Book Collection', display_order=1),
            dict(value='200+', label='Medical Journals', display_order=2),
            dict(value='5,000+', label='Active Users', display_order=3),
            dict(value='24/7', label='Digital Access', display_order=4),
        ]
        for st in stats_data:
            LibraryStat.objects.get_or_create(
                label=st['label'],
                defaults=st,
            )

        hours_data = [
            dict(day='Monday - Thursday', hours='8:00 AM - 10:00 PM', display_order=1),
            dict(day='Friday', hours='8:00 AM - 6:00 PM', display_order=2),
            dict(day='Saturday', hours='9:00 AM - 5:00 PM', display_order=3),
            dict(day='Sunday / Public Holidays', hours='Closed', display_order=4),
        ]
        for h in hours_data:
            LibraryHour.objects.get_or_create(
                day=h['day'],
                defaults=h,
            )

        guidelines_data = [
            dict(title='Library Cards', text='All students, faculty, and staff must obtain a valid library card. Cards are issued at the circulation desk upon presentation of a valid university ID. Lost cards should be reported immediately.', display_order=1),
            dict(title='Borrowing Limits', text='Students: 5 books for 2 weeks. Faculty: 10 books for 4 weeks. Staff: 3 books for 2 weeks. Reference materials and periodicals are for library use only.', display_order=2),
            dict(title='Overdue & Lost Items', text='Overdue fines of N100 per day per item apply. Lost items must be replaced or paid for at current market value. Borrowing privileges are suspended when fines exceed N1,000.', display_order=3),
            dict(title='Code of Conduct', text='Silence must be observed in reading areas. Food and drinks are prohibited near library materials. Mobile phones must be set to silent mode. Users must respect library property and other patrons.', display_order=4),
        ]
        for g in guidelines_data:
            LibraryGuideline.objects.get_or_create(
                title=g['title'],
                defaults=g,
            )

        deadlines_data = [
            dict(title='Application for Admission', deadline='September 30, 2025', icon_name='BookOpen', display_order=1),
            dict(title='Payment of School Fees', deadline='Within 2 weeks of resumption', icon_name='Clock', display_order=2),
            dict(title='Course Registration', deadline='Within 4 weeks of semester start', icon_name='Calendar', display_order=3),
            dict(title='Project/Thesis Submission', deadline='2 weeks before final exams', icon_name='GraduationCap', display_order=4),
            dict(title='Graduation Clearance', deadline='4 weeks before convocation', icon_name='Bell', display_order=5),
        ]
        for d in deadlines_data:
            Deadline.objects.get_or_create(
                title=d['title'],
                defaults=d,
            )

        # ====================================================================
        # Seed About Page
        # ====================================================================
        about_page, _ = AboutPage.objects.get_or_create(
            pk=1,
            defaults=dict(
                hero_title='About Bayelsa Medical University',
                hero_content='Nigeria\'s premier institution for healthcare education, dedicated to training the next generation of medical professionals and advancing health outcomes in the Niger Delta region.',
                about_main_title='Our Mission & Vision',
                about_main_content='',
                meta_description='Bayelsa Medical University (BMU) is a premier institution dedicated to excellence in healthcare education, research, and community service in Nigeria.',
            )
        )
        stats_data = [
            dict(value='2018', label='Founded', suffix='', order=1),
            dict(value='6', label='Colleges & Schools', suffix='', order=2),
            dict(value='50+', label='Degree Programs', suffix='', order=3),
            dict(value='3,500+', label='Students', suffix='', order=4),
        ]
        for s in stats_data:
            AboutStat.objects.get_or_create(page=about_page, label=s['label'], defaults=s)
        core_values_data = [
            dict(icon_name='Award', title='Excellence', description='We pursue the highest standards in teaching, research, and healthcare delivery.', order=1),
            dict(icon_name='Heart', title='Compassion', description='We put patients and communities at the center of everything we do.', order=2),
            dict(icon_name='Lightbulb', title='Innovation', description='We embrace new ideas and technologies to advance medical science.', order=3),
            dict(icon_name='Globe', title='Impact', description='We are committed to improving health outcomes in the Niger Delta and beyond.', order=4),
        ]
        for v in core_values_data:
            AboutCoreValue.objects.get_or_create(page=about_page, title=v['title'], defaults=v)

        # ====================================================================
        # Seed History Page
        # ====================================================================
        history_page, _ = HistoryPage.objects.get_or_create(
            pk=1,
            defaults=dict(
                hero_content='From visionary beginnings in 2018 to becoming Nigeria\'s premier destination for healthcare education - the remarkable journey of Bayelsa Medical University.',
                meta_description='Explore the journey of Bayelsa Medical University from its establishment in 2018 to becoming a leading medical institution in Nigeria.',
            )
        )
        timeline_data = [
            dict(year='2018', title='Foundation Established', description='Bayelsa Medical University was established by the Bayelsa State Government under the administration of Governor Henry Seriake Dickson, recognizing the critical need for quality medical education in the Niger Delta region.', icon_name='Building2', order=1),
            dict(year='2019', title='First Academic Session Begins', description='BMU admitted its first cohort of students into the MBBS program and the School of Nursing, marking the beginning of academic activities at the Permanent Site in Yenagoa.', icon_name='GraduationCap', order=2),
            dict(year='2020', title='NUC Accreditation', description='Received full accreditation from the National Universities Commission (NUC) for all undergraduate programs, validating the quality of our academic standards and facilities.', icon_name='Award', order=3),
            dict(year='2021', title='Teaching Hospital Partnership', description='Established formal partnership with the Federal Medical Centre, Yenagoa, providing students with hands-on clinical training and expanding community healthcare services.', icon_name='Users', order=4),
            dict(year='2022', title='Research Centers Launch', description='Launched the Center for Malaria Research and Center for Non-Communicable Diseases, positioning BMU as a leader in regional health research.', icon_name='Globe', order=5),
            dict(year='2023', title='Postgraduate Programs', description='Introduced Master of Public Health (MPH) and other postgraduate programs, expanding access to advanced medical education in the region.', icon_name='Calendar', order=6),
            dict(year='2024', title='International Recognition', description='BMU achieved recognition from the World Health Organization and established partnerships with international institutions for student exchange and research collaboration.', icon_name='Award', order=7),
            dict(year='2025', title='Campus Expansion', description='Completed Phase II of campus development, including new research laboratories, a 500-seat auditorium, and expanded student accommodation facilities.', icon_name='Building2', order=8),
        ]
        for t in timeline_data:
            TimelineEvent.objects.get_or_create(page=history_page, title=t['title'], defaults=t)

        # ====================================================================
        # Seed Vision & Mission Page
        # ====================================================================
        vision_page, _ = VisionMissionPage.objects.get_or_create(
            pk=1,
            defaults=dict(
                hero_content='Guided by a compelling vision and driven by a transformative mission, we are shaping the future of healthcare in Africa.',
                mission_content='To provide world-class education in medical and health sciences, conduct cutting-edge research addressing regional health challenges, and deliver compassionate healthcare services that improve the quality of life for communities in the Niger Delta and beyond.',
                vision_content='To be the leading medical university in Africa, recognized globally for excellence in healthcare education, research innovation, and community health transformation. We aspire to be the institution of choice for aspiring medical professionals across the continent.',
                meta_description='Discover BMU\'s vision to be Africa\'s leading medical university and our mission to transform healthcare through education, research, and service.',
            )
        )
        pillars_data = [
            dict(icon_name='Lightbulb', title='Excellence in Education', description='Delivering world-class medical education through innovative teaching methods, modern facilities, and experienced faculty.', order=1),
            dict(icon_name='Heart', title='Compassionate Care', description='Instilling values of empathy and patient-centered care in every graduate who serves our communities.', order=2),
            dict(icon_name='Compass', title='Research Innovation', description='Advancing medical knowledge through cutting-edge research addressing regional and global health challenges.', order=3),
            dict(icon_name='Target', title='Community Impact', description='Transforming healthcare delivery in the Niger Delta through service, outreach, and partnership.', order=4),
        ]
        for p in pillars_data:
            VisionMissionPillar.objects.get_or_create(page=vision_page, title=p['title'], defaults=p)
        vm_values_data = [
            dict(title='Integrity', description='Upholding the highest ethical standards in all our dealings', order=1),
            dict(title='Excellence', description='Pursuing the highest quality in education, research, and service', order=2),
            dict(title='Innovation', description='Embracing new ideas and technologies to advance healthcare', order=3),
            dict(title='Compassion', description='Putting patients and communities first in everything we do', order=4),
            dict(title='Collaboration', description='Working together across disciplines and with our communities', order=5),
            dict(title='Accountability', description='Taking responsibility for our actions and their outcomes', order=6),
        ]
        for v in vm_values_data:
            VisionMissionValue.objects.get_or_create(page=vision_page, title=v['title'], defaults=v)

        # ====================================================================
        # Seed Governance Page
        # ====================================================================
        gov_page, _ = GovernancePage.objects.get_or_create(
            pk=1,
            defaults=dict(
                hero_content='Transparent, accountable, and effective governance structures that ensure the highest standards of institutional leadership and academic excellence.',
                meta_description='Learn about BMU\'s governance structure including the University Council, Senate, and key administrative bodies ensuring transparent and effective leadership.',
            )
        )
        bodies_data = [
            dict(title='University Council', role='Supreme Governing Body', description='The highest decision-making body responsible for the overall policy, governance, and strategic direction of the university.', responsibilities=['Approve major policies', 'Oversee financial management', 'Appoint key officials', 'Ensure institutional accountability'], icon_name='Building2', color='#1E1E1E', order=1),
            dict(title='University Senate', role='Academic Authority', description='The highest academic body responsible for academic standards, curriculum development, and research oversight.', responsibilities=['Academic policy formulation', 'Curriculum approval', 'Research standards', 'Student discipline (academic)'], icon_name='Users', color='#A51C30', order=2),
            dict(title='Management Board', role='Executive Body', description='The day-to-day administrative leadership team implementing policies and managing university operations.', responsibilities=['Operational management', 'Resource allocation', 'Staff administration', 'Implementation of policies'], icon_name='Gavel', color='#1E1E1E', order=3),
        ]
        for b in bodies_data:
            GovernanceBody.objects.get_or_create(page=gov_page, title=b['title'], defaults=b)
        committees_data = [
            dict(name='Finance & General Purposes Committee', focus='Financial oversight and resource management', order=1),
            dict(name='Appointments & Promotions Committee', focus='Staff appointments and career progression', order=2),
            dict(name='Tender Board', focus='Procurement and contract approvals', order=3),
            dict(name='Academic Planning Committee', focus='Strategic academic development', order=4),
            dict(name='Research Ethics Committee', focus='Research ethics and compliance', order=5),
            dict(name='Quality Assurance Committee', focus='Quality standards and accreditation', order=6),
        ]
        for c in committees_data:
            GovernanceCommittee.objects.get_or_create(page=gov_page, name=c['name'], defaults=c)
        policies_data = [
            dict(title='Academic Integrity Policy', description='Maintaining highest standards in research and teaching', order=1),
            dict(title='Anti-Corruption Policy', description='Zero tolerance for corruption in all university dealings', order=2),
            dict(title='Gender Policy', description='Promoting gender equality and inclusion across all levels', order=3),
            dict(title='Environmental Sustainability Policy', description='Commitment to eco-friendly campus operations', order=4),
            dict(title='Student Code of Conduct', description='Guidelines for ethical student behavior', order=5),
            dict(title='Staff Welfare Policy', description='Ensuring staff wellbeing and professional development', order=6),
        ]
        for p in policies_data:
            GovernancePolicy.objects.get_or_create(page=gov_page, title=p['title'], defaults=p)
