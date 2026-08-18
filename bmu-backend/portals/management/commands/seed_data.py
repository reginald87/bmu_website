from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from accounts.models import Notification
from accounts.alumni_models import AlumniProfile, AlumniEvent, AlumniDonation
from portals.models import (
    StudentResult, StudentFeePayment, StudentCourse, Registration, RegistrationCourse,
    ProgressionRecord, AttendanceSession, AttendanceRecord, HostelAllocation,
    FeeType, FeeStructure, FeeStructureItem,
)
from content.models import NewsItem, Event, PageContentSimple, Testimonial, Partner, ContactEnquiry, PublicDocument, FundingOrganization, FundedProject, AboutPage, AboutStat, AboutCoreValue, HistoryPage, TimelineEvent, VisionMissionPage, VisionMissionPillar, VisionMissionValue, GovernancePage, GovernanceBody, GovernanceCommittee, GovernancePolicy, PageSection, MenuItem
from academics.models import College, FacultyUnit, Department, Program, Course, SDGMetric, Leadership, CourseSchedule
from admissions.models import Application, AcademicRecord
from library.models import Book, BookCategory, BookLoan, DigitalResource
from research.models import Publication
from academics.models import Faculty
from accounts.models import StudentProfile
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
        student.set_password('student123')
        student.first_name = 'John'
        student.last_name = 'Doe'
        student.is_email_verified = True
        student.save()

        alumni_user, _ = User.objects.get_or_create(
            email='alumni@bmu.edu.ng',
            defaults=dict(username='alumni', role='alumni', is_email_verified=True),
        )
        alumni_user.set_password('alumni123')
        alumni_user.first_name = 'Sarah'
        alumni_user.last_name = 'Johnson'
        alumni_user.is_email_verified = True
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

        for notif in [
            dict(title='Course Registration Open',
                 message='Registration for 2024/2025 second semester is now open', type='info'),
            dict(title='Exam Timetable Released',
                 message='Second semester examination timetable is now available', type='success'),
            dict(title='Fee Payment Reminder',
                 message='Please complete your tuition payment before deadline', type='warning'),
        ]:
            Notification.objects.filter(user=student, title=notif['title']).delete()
            Notification.objects.create(user=student, **notif)

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

        # ------------------------------------------------------------------
        # Real BMU news (extracted from bmu.edu.ng)
        # ------------------------------------------------------------------
        NewsItem.objects.filter(slug__in=[
            'bmu-announces-new-research-partnership',
            'vc-welcomes-new-intake-of-students',
            'bmu-community-health-outreach-program',
        ]).delete()
        news_items = [
            dict(slug='bmu-on-the-move-prof-ogoina-is-working',
                 title='BMU On The Move: Prof. Ogoina Is Working...',
                 excerpt='The Bayelsa State Government has presented two coaster buses to BMU to ease the movement of staff and students between the Yenagoa and Sampou campuses.',
                 category='community',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 8, 11),
                 is_featured=True,
                 content=(
                     '<p>The Bayelsa State Government has fulfilled its promise to Bayelsa Medical University (BMU) with the presentation of two coaster buses to the institution\'s management.</p>'
                     '<p>Presenting the vehicle documents to the Vice Chancellor of BMU, Prof. Dimie Ogoina, at Government House, the Secretary to the State Government, Prof. Nimibofa Ayawei, said the procurement was in response to the pressing needs of the specialised tertiary institution.</p>'
                     '<p>Speaking on behalf of Governor Douye Diri, Prof. Ayawei urged the university management to make judicious use of the buses, noting that they would ease the movement of staff and students between the main campus in Yenagoa and the Sampou campuses.</p>'
                     '<p>Receiving the documents on behalf of the Governing Council, management, staff and students of BMU, Prof. Ogoina expressed appreciation to His Excellency, Governor Douye Diri, and the state government for fulfilling the promise, assuring that the university would ensure optimal use and proper maintenance of the buses.</p>'
                 )),
            dict(slug='bmu-hosts-tetfund-courtesy-visit',
                 title='Bayelsa Medical University Hosts Members of the Tertiary Fund (TetFund) for a Courtesy Visit',
                 excerpt='BMU hosted members of the Tertiary Education Trust Fund (TetFund) on a courtesy visit to its Yenagoa and Sampou campuses.',
                 category='community',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 8, 7),
                 content=(
                     '<p>Bayelsa Medical University (BMU) on Thursday, August 7th, 2026, hosted members of the Tertiary Education Trust Fund (TetFund) on a courtesy visit to its two campuses (Yenagoa Campus and Sampou Campus).</p>'
                     '<p>The Vice-Chancellor welcomed the delegation, which included Pharm. Ibrahim Babashehu, Arc. Ashiry M. Yusuf, and Dr Yusuf Gamawa, stating that the university has been looking forward to this visit as it highlights the institution\'s growth.</p>'
                     '<p>Appreciating the Vice-Chancellor for his warm reception, the team lead, Pharm. Ibrahim Babashehu, expressed his awe at the digital and technological development, especially the university\'s adoption of artificial intelligence, and commended the Vice-Chancellor\'s leadership and the need for continued support from the fund.</p>'
                     '<p>The team toured the Sampou campus, where they visited the Pharmacognosy/Herbal Medicine Laboratory, Pharmaceutical/Medicine Chemistry Laboratory, Clinical Pharmacy Laboratory, and faculty buildings under construction, and at the Yenagoa campus, the Nursery Science Skills Laboratory, the University Store House, and several departmental laboratory complexes.</p>'
                 )),
            dict(slug='bmu-secures-approval-bachelor-radiography',
                 title='BMU On The Move: BMU Secures Approval for Bachelor of Radiography Programme',
                 excerpt='The Radiographers\u2019 Registration Board of Nigeria (RRBN) has approved BMU\u2019s Bachelor of Radiography Programme following a successful resource verification exercise.',
                 category='achievement',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 8, 5),
                 content=(
                     '<p>Bayelsa Medical University (BMU), Yenagoa, has recorded another major milestone with the approval of its Bachelor of Radiography Programme by the Radiographers\u2019 Registration Board of Nigeria (RRBN) following a successful resource verification exercise.</p>'
                     '<p>In a letter dated 28th July, 2026, the RRBN confirmed that the University\u2019s Radiography programme met the required standards after scoring 50 out of 50 in both academic content and physical facilities at the academic and clinical levels during the resource verification exercise conducted on 17th June, 2026.</p>'
                     '<p>This achievement further reflects Bayelsa Medical University\u2019s unwavering commitment to delivering quality medical education through world-class teaching, modern infrastructure, and strict adherence to regulatory standards. The Vice-Chancellor, Professor Dimie Ogoina, congratulates the university community on the achievement \u2014 another testament to the institution\u2019s pursuit of excellence under the innovation-driven ASPIRE Agenda.</p>'
                 )),
            dict(slug='bmu-ongoing-jupeb-examination',
                 title='BMU On The Move: Ongoing JUPEB Examination',
                 excerpt='BMU successfully conducted a Physics Objective Examination for 172 JUPEB students at the university\u2019s Computer-Based Test (CBT) Centre.',
                 category='academic',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 8, 4),
                 content=(
                     '<p>In line with the innovation-driven ASPIRE Agenda of Bayelsa Medical University (BMU), the university successfully conducted a Physics Objective Examination for 172 Joint Universities Preliminary Examinations Board (JUPEB) students at the university\'s Computer-Based Test (CBT) Centre on Tuesday, 4th August 2026.</p>'
                     '<p>The examination was administered entirely as a Computer-Based Test (CBT), providing many of the students with their first experience of taking an objective examination using a digital platform. Despite this, the students demonstrated remarkable confidence and competence in navigating the CBT system.</p>'
                     '<p>The exercise was conducted seamlessly in a calm and orderly environment under the strict supervision of examination officials, ensuring adherence to the university\'s high standards of transparency, fairness, and academic integrity.</p>'
                     '<p>The examination team was led by Mrs Peremo Opiah, Secretary, Center for Foundation Studies, alongside Mr Enaregha Kelvin Oyindeinyefa, Mr Ekubo Prosper Simon, Mr Babatunde R. Atanda, and Mr Eneware Samuel Ebikonbowei.</p>'
                 )),
            dict(slug='bmu-july-in-retrospect',
                 title='BMU: July in Retrospect',
                 excerpt='A round-up of the activities and events that crowned the month of July at Bayelsa Medical University.',
                 category='announcement',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 7, 31),
                 content=(
                     '<p>The following are the activities and events that crowned the month of July at Bayelsa Medical University:</p>'
                     '<p><strong>Week One:</strong> Bayelsa Medical University strengthened research capacity through a Three-Day Grantsmanship and Mentorship Workshop.</p>'
                     '<p><strong>Week Two:</strong> The university welcomed members of the House Committee on Education of the Bayelsa State House of Assembly on a courtesy visit; the Deputy Vice-Chancellor, Sampou Campus, Professor Godwill Ziriki, held a maiden meeting with newly deployed staff; and BMU was officially granted full membership of the Consortium of Medical Schools \u2013 Africa (COMS-A).</p>'
                     '<p><strong>Week Three:</strong> The Vice-Chancellor, Prof. Dimie Ogoina, presented a keynote address at the NDU research workshop; BMU hosted a capacity-building initiative for administrative officers and secretaries; and the university hosted the ASUU NEC, Visitation and Mobilization Team for a courtesy visit.</p>'
                 )),
            dict(slug='bmu-public-disclaimer-admission-scammers',
                 title='Public Disclaimer: Beware of Admission Scammers',
                 excerpt='BMU alerts the public to fraudsters operating fake Facebook pages and circulating counterfeit admission letters.',
                 category='announcement',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 7, 29),
                 content=(
                     '<p>Bayelsa Medical University (BMU) has been alerted to the activities of fraudsters operating fake Facebook pages and circulating counterfeit admission letters in an attempt to deceive unsuspecting members of the public.</p>'
                     '<p>The university wishes to state clearly that: BMU does not offer admission through unofficial Facebook pages, WhatsApp messages, or other unauthorised social media accounts; BMU does not request or accept admission or school fee payments into personal bank accounts under any circumstance; and any admission letter, message, or individual requesting payment into a personal account or promising admission in exchange for money is fraudulent.</p>'
                     '<p>All admissions and payments are processed only through the university\'s approved official channels and designated payment platforms in line with JAMB and the university\'s admission procedures.</p>'
                     '<p>Prospective students, parents, and guardians are strongly advised to verify every admission-related information through the university\'s official communication channels before taking any action. If you receive suspicious admission offers or payment requests, ignore them and report the incident immediately.</p>'
                 )),
            dict(slug='mdcn-grants-accreditation-mbbs-programme',
                 title='MBBS Students of BMU Celebrate as MDCN Grants Accreditation for MBBS Programme, Increasing Admission Quota to 150 per Session',
                 excerpt='The Medical and Dental Council of Nigeria (MDCN) has granted accreditation for the MBBS programme and approved an increase in the admission quota from 100 to 150 per session.',
                 category='achievement',
                 author='Dr. (Mrs) Teibowei Marie (PRO/SAVC)',
                 published_at=(2026, 3, 3),
                 content=(
                     '<p>The resounding promise made during his inaugural address was not mere rhetoric. Under the dynamic, digital, globally-minded and indefatigable leadership of the Vice-Chancellor, BMU has successfully been accredited for the Bachelor of Medicine and Surgery (MBBS) programme and has been granted approval for an increase in admission quota from 100 to 150 for each session.</p>'
                     '<p>Established under the Medical and Dental Practitioners Act, the Council remains the statutory guardian of medical and dental education standards in Nigeria. The Council\u2019s accreditation of the MBBS Programme for BMU, following the verification visitation of 20th February 2026, is a powerful affirmation of BMU\u2019s rising stature as a centre of excellence in medical education \u2014 both within Nigeria and on the global stage.</p>'
                     '<p><strong>What this means for MBBS students:</strong> Current and prospective students can pursue their medical education with assurance, knowing the programme meets and exceeds national quality benchmarks. BMU medical students can now proceed to write their part 2 exams, and the MBBS programme is on course to graduate the first set of medical doctors in the next few years.</p>'
                     '<p>The university also specially congratulates the Governing Council led by Prof. Tarila Tebepah, the College of Medicine led by the Provost Professor Philip Eyimina, all Principal Officers, Deans, Professors, Directors, HODs, staff and students of the university.</p>'
                 )),
        ]
        for n in news_items:
            NewsItem.objects.update_or_create(
                slug=n['slug'],
                defaults=dict(
                    title=n['title'],
                    excerpt=n['excerpt'],
                    content=n['content'],
                    category=n['category'],
                    author=n['author'],
                    is_published=True,
                    is_featured=n.get('is_featured', False),
                    published_at=timezone.make_aware(timezone.datetime(*n['published_at'])),
                ),
            )

        # ------------------------------------------------------------------
        # Academic structure — real BMU organization
        # BMU has a single College (College of Medicine) housing the Faculty of
        # Clinical Sciences and the Faculty of Basic Medical Sciences. The other
        # five faculties (Basic Clinical Sciences, Dentistry, Health Sciences,
        # Pharmaceutical Sciences, Science) are standalone faculties with their
        # own departments. Together they hold 25 departments and 24 undergraduate
        # programs, harvested from bmu.edu.ng (structure of this app is unchanged).
        # ------------------------------------------------------------------

        def _upsert(model, slug, defaults):
            obj, created = model.objects.get_or_create(slug=slug, defaults=defaults)
            if not created:
                for key, val in defaults.items():
                    setattr(obj, key, val)
                obj.save()
            return obj

        college_defs = [
            dict(slug='college-of-medicine', name='College of Medicine',
                 provost='Prof. Philip Eyimina',
                 description='The College of Medicine is the flagship college of Bayelsa Medical University, housing the Faculty of Clinical Sciences and the Faculty of Basic Medical Sciences. The University\'s other faculties — Basic Clinical Sciences, Dentistry, Health Sciences, Pharmaceutical Sciences and Science — operate as standalone faculties with their own departments.',
                 overview='The College of Medicine provides the academic home for the Faculty of Basic Medical Sciences and the Faculty of Clinical Sciences, which together deliver the foundational and clinical training of the University\'s medical doctors. The remaining faculties of Bayelsa Medical University — Basic Clinical Sciences, Dentistry, Health Sciences, Pharmaceutical Sciences and Science — are standalone faculties, each with its own departments and programmes.',
                 mission='To deliver excellent teaching, research and community service in the basic and clinical medical sciences.',
                 vision='To be a leading centre for medical education and research in West Africa.',
                 established_year=2018, students=970, staff=108,
                 color='#1E1E1E', color2='#A51C30', icon='GraduationCap'),
        ]

        # Faculties within the College of Medicine vs standalone faculties
        college_faculty_slugs = {'basic-medical-sciences', 'clinical-sciences'}

        faculty_defs = [
            dict(slug='basic-medical-sciences', name='Basic Medical Sciences', code='FBMS', under_college=True,
                 dean='Dr. Theodore Allison',
                 description='The Faculty of Basic Medical Sciences provides foundational training in the medical sciences — human anatomy, human physiology and biochemistry — that underpin every clinical discipline at the University.',
                 mission='To deliver excellent teaching and research in the basic medical sciences, producing graduates with a deep understanding of the scientific foundations of medicine.',
                 vision='To be a leading centre for basic medical sciences education and research in West Africa.',
                 students=420, staff=48),
            dict(slug='basic-clinical-sciences', name='Basic Clinical Sciences', code='FBCS',
                 dean='Dr. Frederick Allison',
                 description='The Faculty of Basic Clinical Sciences houses the foundational clinical disciplines such as anatomical pathology that bridge the basic sciences and bedside clinical practice.',
                 mission='To provide rigorous education in the basic clinical sciences that connects scientific knowledge with patient care.',
                 vision='To be a leading faculty of basic clinical sciences in Nigeria.',
                 students=60, staff=12),
            dict(slug='clinical-sciences', name='Clinical Sciences', code='FCLS', under_college=True,
                 dean='Prof. Isaac J. Abasi',
                 description='The Faculty of Clinical Sciences trains future medical doctors through the six-year Medicine and Surgery (MBBS) programme, combining classroom instruction with supervised hospital training.',
                 mission='To produce competent, compassionate and professionally ethical medical doctors through rigorous clinical training and research.',
                 vision='To be a foremost faculty of clinical sciences producing doctors of international repute.',
                 students=550, staff=60),
            dict(slug='dentistry', name='Dentistry', code='FDEN',
                 dean='',
                 description='The Faculty of Dentistry offers the six-year Bachelor of Dental Surgery (BDS) programme, training dental surgeons in the prevention, diagnosis and treatment of oral and maxillofacial diseases.',
                 mission='To train competent and ethical dental surgeons who advance oral health care in Nigeria.',
                 vision='To be a leading faculty of dentistry known for excellence in oral health education.',
                 students=150, staff=20),
            dict(slug='health-sciences', name='Health Sciences', code='FHSS',
                 dean='Dr. (Mrs) Gift Cornelius Timighe',
                 description='The Faculty of Health Sciences is the largest faculty, offering professional programmes in nursing science, medical laboratory science, physiotherapy, optometry, public health, radiography and other health professions.',
                 mission='To produce highly skilled, ethical and patient-centred health professionals through quality education and clinical practice.',
                 vision='To be a leading faculty of health sciences in Nigeria and beyond.',
                 students=1600, staff=140),
            dict(slug='pharmaceutical-sciences', name='Pharmaceutical Sciences', code='FPHS',
                 dean='Prof. Ebiowei S. F. Orubu',
                 description='The Faculty of Pharmaceutical Sciences trains pharmacists through the six-year Doctor of Pharmacy (Pharm.D) programme, covering drug discovery, pharmaceutical formulation, clinical pharmacy and pharmacy practice.',
                 mission='To educate competent pharmacists who will advance safe, effective and accessible pharmaceutical care.',
                 vision='To be a centre of excellence in pharmaceutical education and research.',
                 students=220, staff=25),
            dict(slug='science', name='Science', code='FSCI',
                 dean='Prof. Iniobong Reuben Inyang',
                 description='The Faculty of Science offers undergraduate programmes in the biological, physical and mathematical sciences, including biology, chemistry, computer science, microbiology, physics with electronics, statistics and mathematics.',
                 mission='To provide rigorous scientific education and research that supports innovation and national development.',
                 vision='To be a leading faculty of science known for academic excellence and impactful research.',
                 students=900, staff=85),
        ]

        department_defs = [
            dict(slug='anatomical-pathology', name='Anatomical Pathology', code='ANP', faculty='basic-clinical-sciences',
                 description='Study of the structural and functional changes caused by disease, forming the basis of clinical diagnosis.'),
            dict(slug='biochemistry', name='Biochemistry', code='BCH', faculty='basic-medical-sciences',
                 description='The study of the chemical processes within and relating to living organisms, essential to understanding health and disease.'),
            dict(slug='human-anatomy', name='Human Anatomy', code='ANA', faculty='basic-medical-sciences',
                 description='The study of the structure of the human body, providing the foundation for clinical practice.'),
            dict(slug='human-physiology', name='Human Physiology', code='PSL', faculty='basic-medical-sciences',
                 description='The study of how the human body functions, from cells to organ systems.'),
            dict(slug='medicine-surgery', name='Medicine & Surgery', code='MES', faculty='clinical-sciences',
                 description='The flagship department training medical doctors through the MBBS programme with comprehensive clinical education.'),
            dict(slug='dental-surgery', name='Dental Surgery', code='DTS', faculty='dentistry',
                 description='Training dental surgeons in the prevention, diagnosis and treatment of oral diseases.'),
            dict(slug='community-health', name='Community Health', code='CMH', faculty='health-sciences',
                 description='Training community health professionals to deliver primary healthcare and promote public health at community level.'),
            dict(slug='dental-technology', name='Dental Technology', code='DTL', faculty='health-sciences',
                 description='Training dental technologists in the design and fabrication of dental prostheses and appliances.'),
            dict(slug='health-care-administration-and-hospital-management', name='Health Care Administration and Hospital Management', code='HCA', faculty='health-sciences',
                 description='Preparing health administrators to manage hospitals and health services efficiently and effectively.'),
            dict(slug='health-information-management', name='Health Information Management', code='HIM', faculty='health-sciences',
                 description='Training professionals in the management of health information, medical records and health informatics.'),
            dict(slug='human-nutrition-and-dietetics', name='Human Nutrition and Dietetics', code='HND', faculty='health-sciences',
                 description='Training nutritionists and dietitians to promote health through diet and manage nutrition-related diseases.'),
            dict(slug='medical-laboratory-science', name='Medical Laboratory Science', code='MLS', faculty='health-sciences',
                 description='Training medical laboratory scientists in diagnostic testing for disease prevention, diagnosis and treatment.'),
            dict(slug='nursing-science', name='Nursing Science', code='NUR', faculty='health-sciences',
                 description='Training professional nurses in evidence-based, compassionate patient care across all healthcare settings.'),
            dict(slug='optometry', name='Optometry', code='OPT', faculty='health-sciences',
                 description='Training optometrists in the examination, diagnosis and management of visual and eye health disorders.'),
            dict(slug='physiotherapy', name='Physiotherapy', code='PHT', faculty='health-sciences',
                 description='Training physiotherapists to restore function and mobility through physical therapy and rehabilitation.'),
            dict(slug='public-health', name='Public Health', code='PUB', faculty='health-sciences',
                 description='Training public health professionals in disease prevention, health promotion and population health.'),
            dict(slug='radiography-and-radiation-science', name='Radiography and Radiation Science', code='RAD', faculty='health-sciences',
                 description='Training radiographers in medical imaging and radiation sciences for diagnostic and therapeutic purposes.'),
            dict(slug='pharmacy', name='Pharmacy', code='PHA', faculty='pharmaceutical-sciences',
                 description='Training pharmacists in drug formulation, dispensing and clinical pharmacy through the Pharm.D programme.'),
            dict(slug='biology', name='Biology', code='BIO', faculty='science',
                 description='The study of living organisms, their structure, function, growth and evolution.'),
            dict(slug='chemistry', name='Chemistry', code='CHM', faculty='science',
                 description='The study of the composition, structure and properties of matter and the changes it undergoes.'),
            dict(slug='computer-science', name='Computer Science', code='CSE', faculty='science',
                 description='The study of computation, algorithms, programming and information systems.'),
            dict(slug='mathematics', name='Mathematics', code='MTH', faculty='science',
                 description='The study of quantity, structure, space and change through abstract reasoning.'),
            dict(slug='microbiology', name='Microbiology', code='MCB', faculty='science',
                 description='The study of microorganisms and their applications in health, industry and the environment.'),
            dict(slug='physics-with-electronics', name='Physics with Electronics', code='PHY', faculty='science',
                 description='The study of matter, energy and their interactions, with emphasis on electronics and instrumentation.'),
            dict(slug='statistics', name='Statistics', code='STA', faculty='science',
                 description='The science of collecting, analysing and interpreting data to inform decision-making.'),
        ]

        program_defs = [
            dict(slug='mbbs', title='Medicine and Surgery', degree='MBBS', duration='6 years',
                 dept='medicine-surgery', college='clinical-sciences', icon='Stethoscope', color='#1E1E1E', tuition=600000,
                 description='A comprehensive six-year programme that trains students in all aspects of medicine and surgery, producing competent medical doctors ready for residency training.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) in English, Mathematics, Physics, Chemistry and Biology obtained at not more than two sittings, with required UTME subjects in English Language, Physics, Chemistry and Biology. Direct Entry: A-Level/JUPEB passes in Biology, Chemistry and Physics. OND/HND/BSc in related sciences may be considered for advanced placement.',
                 career='Medical Doctor, Surgeon, Public Health Specialist, Medical Researcher, Hospital Administrator'),
            dict(slug='bnsc-nursing-science', title='Nursing Science', degree='B.NSc', duration='5 years',
                 dept='nursing-science', college='health-sciences', icon='Heart', color='#A51C30', tuition=400000,
                 description='A five-year professional nursing programme that prepares students for registered nursing practice across all healthcare settings.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics/Mathematics. OND/HND Nursing with Lower Credit or an RN Certificate may also be considered.',
                 career='Registered Nurse, Nurse Practitioner, Nurse Educator, Public Health Nurse, Healthcare Administrator'),
            dict(slug='bmls-medical-laboratory-science', title='Medical Laboratory Science', degree='BMLS', duration='5 years',
                 dept='medical-laboratory-science', college='health-sciences', icon='Microscope', color='#A51C30', tuition=350000,
                 description='A five-year programme training students in diagnostic laboratory science including clinical chemistry, haematology and microbiology.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in Mathematics, English, Physics, Chemistry and Biology. Direct Entry: an MLT certificate (PASS grade) for admission to Year II. A second-class-lower degree in allied sciences such as Microbiology, Zoology, Biochemistry, Anatomy or Physiology may also be considered.',
                 career='Medical Laboratory Scientist, Research Scientist, Laboratory Manager, Infection Control Specialist'),
            dict(slug='bsc-radiography-and-radiation-science', title='Radiography and Radiation Science', degree='BSc', duration='4 years',
                 dept='radiography-and-radiation-science', college='health-sciences', icon='Scan', color='#A51C30', tuition=350000,
                 description='A four-year programme in medical imaging and radiation science, covering X-ray, ultrasound, CT and MRI for diagnosis and therapy.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics/Mathematics. OND/HND Radiography or health sciences (Lower Credit) or an RR Certificate may also be considered.',
                 career='Radiographer, Radiation Therapist, Imaging Specialist, Healthcare Administrator'),
            dict(slug='bsc-physiotherapy', title='Physiotherapy', degree='BSc', duration='5 years',
                 dept='physiotherapy', college='health-sciences', icon='Activity', color='#A51C30', tuition=350000,
                 description='A five-year programme training physiotherapists to help patients recover function and mobility after injury or illness.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 9 points in Biology, Chemistry and Physics. OND/HND Physiotherapy or Physical Rehabilitation (Upper Credit) or a Registered Physiotherapy Assistant (PTA) certification may also be considered.',
                 career='Physiotherapist, Sports Therapist, Rehabilitation Specialist, Clinical Educator'),
            dict(slug='bsc-optometry', title='Optometry', degree='BSc', duration='6 years',
                 dept='optometry', college='health-sciences', icon='Scan', color='#A51C30', tuition=350000,
                 description='A six-year programme training optometrists in the examination, diagnosis and management of eye and vision disorders.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics. OND/HND Optometry or Health Sciences (Lower Credit) or a first degree in Biological/Medical Sciences (5-year direct entry) may also be considered.',
                 career='Optometrist, Vision Researcher, Optical Centre Manager, Public Eye Health Specialist'),
            dict(slug='bsc-public-health', title='Public Health', degree='BSc', duration='4 years',
                 dept='public-health', college='health-sciences', icon='Globe', color='#A51C30', tuition=300000,
                 description='A four-year programme in population health, disease prevention, health promotion and health policy.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics or a relevant social science subject. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology/Health Science, Chemistry and Physics/Mathematics. OND/HND Public Health or Community Health (Lower Credit) or an ND/Diploma in Public/Environmental Health may also be considered.',
                 career='Public Health Officer, Health Educator, Epidemiologist, Policy Analyst, NGO Program Manager'),
            dict(slug='bsc-community-health-science', title='Community Health Science', degree='BSc', duration='5 years',
                 dept='community-health', college='health-sciences', icon='Globe', color='#A51C30', tuition=300000,
                 description='A five-year programme training community health practitioners for primary healthcare delivery at community level.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology/Health Science, Chemistry and Physics. Direct Entry: ND/HND in Community Health (CHEW/CHO) with a CHPRBN licence, or A\'Level/JUPEB with a minimum of 10 points in Biology/Health Science, Chemistry and Physics/Mathematics.',
                 career='Community Health Practitioner, Primary Healthcare Coordinator, Health Extension Specialist'),
            dict(slug='bsc-dental-technology', title='Dental Technology', degree='BSc', duration='4 years',
                 dept='dental-technology', college='health-sciences', icon='Bone', color='#A51C30', tuition=158000,
                 description='A four-year programme training dental technologists in the design, fabrication and repair of dental prostheses and appliances.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) at not more than two sittings in English, Mathematics, Physics, Chemistry and Biology. Direct Entry: A\'Level/JUPEB with a minimum of 9 points in Biology, Chemistry and Physics. OND/HND Upper Credit in Dental Technology or Dental Therapy may also be considered.',
                 career='Dental Technologist, Dental Laboratory Manager, Prosthodontic Technician'),
            dict(slug='bsc-health-care-administration-and-hospital-management', title='Health Care Administration and Hospital Management', degree='BSc', duration='4 years',
                 dept='health-care-administration-and-hospital-management', college='health-sciences', icon='Heart', color='#A51C30', tuition=158000,
                 description='A four-year programme preparing health managers and administrators to lead hospitals and health services efficiently.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Economics or Government and one other relevant subject. Direct Entry: A\'Level/JUPEB with a minimum of 8 points in Biology, Economics and Mathematics. OND/HND Health Administration or Public Health (Lower Credit) or NCE may also be considered.',
                 career='Hospital Administrator, Health Services Manager, Health Policy Analyst, Medical Records Director'),
            dict(slug='bsc-health-information-management', title='Health Information Management', degree='BSc', duration='5 years',
                 dept='health-information-management', college='health-sciences', icon='Globe', color='#A51C30', tuition=300000,
                 description='A five-year programme in the management of health data, medical records and health information systems.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Physics and Chemistry or Economics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Mathematics or Economics. OND/HND Health Information Management or Medical Records (Lower Credit) or a Diploma in HIM may also be considered.',
                 career='Health Information Manager, Medical Records Officer, Health Informatics Specialist, Data Analyst'),
            dict(slug='bsc-human-nutrition-and-dietetics', title='Human Nutrition and Dietetics', degree='BSc', duration='4 years',
                 dept='human-nutrition-and-dietetics', college='health-sciences', icon='Heart', color='#A51C30', tuition=158000,
                 description='A four-year programme training nutritionists and dietitians in the science of nutrition and therapeutic dietetics.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 9 points in Biology, Chemistry and Physics/Mathematics. OND/HND Food Science or Home Economics with Lower Credit may also be considered.',
                 career='Dietitian, Nutritionist, Public Health Nutritionist, Food Service Manager'),
            dict(slug='doctor-of-pharmacy', title='Pharmacy', degree='Pharm.D', duration='6 years',
                 dept='pharmacy', college='pharmaceutical-sciences', icon='Award', color='#1E1E1E', tuition=400000,
                 description='A six-year Doctor of Pharmacy programme covering pharmaceutical sciences, clinical pharmacy and professional pharmacy practice.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A-Level/JUPEB with a minimum of 12 points in Biology, Chemistry and Physics or Mathematics. OND/HND Pharmacy Technician or Pharmacology (Upper Credit) may also be considered for a 5-year direct entry.',
                 career='Pharmacist, Clinical Pharmacist, Pharmaceutical Researcher, Drug Regulatory Affairs Officer'),
            dict(slug='bds-dentistry', title='Dentistry', degree='BDS', duration='6 years',
                 dept='dental-surgery', college='dentistry', icon='Stethoscope', color='#1E1E1E', tuition=600000,
                 description='A six-year Bachelor of Dental Surgery programme training dental surgeons in oral health care and maxillofacial surgery.',
                 requirements='UTME Entry: five O\'level credits (WAEC/NECO/NABTEB) in English, Mathematics, Physics, Chemistry and Biology obtained at not more than two sittings, with required UTME subjects in English Language, Physics, Chemistry and Biology. Direct Entry: A-Level/JUPEB passes in Biology, Chemistry and Physics. OND/HND/BSc in related sciences may be considered for advanced placement.',
                 career='Dental Surgeon, Oral Health Specialist, Dental Public Health Officer, Dental Researcher'),
            dict(slug='bsc-human-anatomy', title='Human Anatomy', degree='BSc', duration='4 years',
                 dept='human-anatomy', college='basic-medical-sciences', icon='Bone', color='#1E1E1E', tuition=158000,
                 description='A four-year programme focused on the structure of the human body, providing foundations for medical and health sciences careers.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics. OND/HND Anatomy or Physiology (Lower Credit) or NCE in biology-related fields may also be considered.',
                 career='Anatomist, Medical Illustrator, Forensic Scientist, Research Assistant, Lecturer'),
            dict(slug='bsc-human-physiology', title='Human Physiology', degree='BSc', duration='4 years',
                 dept='human-physiology', college='basic-medical-sciences', icon='Brain', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the study of body functions and regulatory mechanisms for research and academic careers.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics. OND/HND Physiology or Anatomy (Lower Credit) or NCE in Biology, Chemistry or Health Education may also be considered.',
                 career='Physiologist, Research Scientist, Lecturer, Pharmaceutical Researcher'),
            dict(slug='bsc-biochemistry', title='Biochemistry', degree='BSc', duration='4 years',
                 dept='biochemistry', college='basic-medical-sciences', icon='Microscope', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the chemistry of life, covering metabolic processes, molecular biology and clinical biochemistry.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics or Mathematics. OND/HND Biochemistry or Science Laboratory Technology (Lower Credit) may also be considered.',
                 career='Biochemist, Research Scientist, Laboratory Analyst, Pharmaceutical Researcher, Quality Control Officer'),
            dict(slug='bsc-biology', title='Biology', degree='BSc', duration='4 years',
                 dept='biology', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the biological sciences covering the structure, function and diversity of living organisms.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Biology, Chemistry and Physics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics or Mathematics. OND/HND Biology, Microbiology or Science Laboratory Technology (Lower Credit) or NCE in Biology and Chemistry may also be considered.',
                 career='Biologist, Research Scientist, Environmental Officer, Science Educator, Lab Technician'),
            dict(slug='bsc-chemistry', title='Chemistry', degree='BSc', duration='4 years',
                 dept='chemistry', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the composition, structure and properties of matter and the reactions that transform it.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Chemistry, Physics and Biology or Further Mathematics. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Chemistry, Physics and Mathematics or Biology. OND/HND Chemistry or Industrial Chemistry (Lower Credit) or NCE in Chemistry may also be considered.',
                 career='Chemist, Analytical Chemist, Quality Control Analyst, Industrial Chemist, Science Educator'),
            dict(slug='bsc-computer-science', title='Computer Science', degree='BSc', duration='4 years',
                 dept='computer-science', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in computing, covering algorithms, programming, software development and information systems.',
                 requirements='UTME Entry: five O\'level credits in English, Mathematics, Physics, Chemistry or Further Mathematics and one other science subject. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Mathematics, Physics and one other science subject. OND/HND Computer Science or ICT (Lower Credit) or NCE in Computer Science and Mathematics may also be considered.',
                 career='Software Developer, Systems Analyst, IT Consultant, Data Scientist, Network Administrator'),
            dict(slug='bsc-mathematics', title='Mathematics', degree='BSc', duration='4 years',
                 dept='mathematics', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in pure and applied mathematics, developing strong analytical and problem-solving skills.',
                 requirements='UTME Entry: five O\'level credits in English, Mathematics, Further Mathematics or Physics and any two of Chemistry, Biology, Economics or Geography. Direct Entry: A\'Level/JUPEB with a minimum of 9 points in Mathematics, Physics and another science subject. OND/HND Mathematics or Statistics (Lower Credit) or NCE in Mathematics may also be considered.',
                 career='Mathematician, Statistician, Actuary, Data Analyst, Mathematics Educator'),
            dict(slug='bsc-microbiology', title='Microbiology', degree='BSc', duration='4 years',
                 dept='microbiology', college='science', icon='Microscope', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the study of microorganisms and their roles in health, disease, industry and the environment.',
                 requirements='UTME Entry: five O\'level credits in English, Mathematics, Biology, Chemistry and Physics or Agricultural Science. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Biology, Chemistry and Physics. OND/HND Microbiology, Biology, Biotechnology or Science Laboratory Technology (Lower Credit) or NCE with Biology and Chemistry or Health Education may also be considered.',
                 career='Microbiologist, Laboratory Scientist, Quality Control Analyst, Food Safety Officer, Research Scientist'),
            dict(slug='bsc-physics-with-electronics', title='Physics with Electronics', degree='BSc', duration='4 years',
                 dept='physics-with-electronics', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in physics with emphasis on electronics, instrumentation and applied technology.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Physics, Chemistry and one other relevant science subject. Direct Entry: A\'Level/JUPEB with a minimum of 10 points in Physics, Mathematics and Chemistry or Electronics. OND/HND Physics, Electronics or Electrical/Electronic Engineering (Lower Credit) or NCE in Physics and Mathematics/Electronics may also be considered.',
                 career='Physicist, Electronics Engineer, Instrumentation Specialist, Research Scientist, ICT Officer'),
            dict(slug='bsc-statistics', title='Statistics', degree='BSc', duration='4 years',
                 dept='statistics', college='science', icon='BookOpen', color='#1E1E1E', tuition=158000,
                 description='A four-year programme in the collection, analysis and interpretation of data for informed decision-making.',
                 requirements='UTME Entry: five O\'level credits at not more than two sittings in English, Mathematics, Further Mathematics or Physics, Economics/Biology/Geography and one other relevant subject. Direct Entry: A\'Level/JUPEB with a minimum of 8 points in Mathematics, Statistics or Further Maths and one other science/social science. OND/HND Statistics, Mathematics or Computer Science (Lower Credit) or NCE in Mathematics may also be considered.',
                 career='Statistician, Data Analyst, Biostatistician, Survey Methodologist, Actuarial Analyst'),
        ]

        keep_college_slugs = [d['slug'] for d in college_defs]
        keep_faculty_slugs = [f'faculty-of-{f["slug"]}' for f in faculty_defs]
        keep_department_slugs = [d['slug'] for d in department_defs]
        keep_program_slugs = [p['slug'] for p in program_defs]

        # Remove stale placeholder academic records (structure is superseded by the real BMU organization)
        Program.objects.exclude(slug__in=keep_program_slugs).delete()
        Department.objects.exclude(slug__in=keep_department_slugs).delete()
        FacultyUnit.objects.exclude(slug__in=keep_faculty_slugs).delete()
        College.objects.exclude(slug__in=keep_college_slugs).delete()

        colleges = {}
        faculties = {}
        college_faculty_count = sum(1 for f in faculty_defs if f.get('under_college'))
        for c in college_defs:
            college = _upsert(College, c['slug'], dict(
                name=c['name'], description=c['description'],
                established_year=c['established_year'],
                faculty_count=college_faculty_count, student_count=c['students'],
                faculty_members_count=c['staff'],
                primary_color=c['color'], secondary_color=c['color2'],
                overview_content=c['overview'], mission_statement=c['mission'],
                vision_statement=c['vision'],
                provost_display_name=c['provost'], icon_name=c['icon'],
            ))
            colleges[c['slug']] = college

        for f in faculty_defs:
            faculties[f['slug']] = _upsert(FacultyUnit, f'faculty-of-{f["slug"]}', dict(
                name=f'Faculty of {f["name"]}',
                college=college if f.get('under_college') else None, code=f['code'],
                description=f['description'], mission_statement=f['mission'],
                vision_statement=f['vision'], dean_display_name=f['dean'],
                student_count=f['students'], staff_count=f['staff'],
            ))

        departments = {}
        for d in department_defs:
            departments[d['slug']] = _upsert(Department, d['slug'], dict(
                name=d['name'], faculty=faculties[d['faculty']], code=d['code'],
                description=d['description'], staff_count=5, student_count=50,
            ))

        for slug, faculty in faculties.items():
            faculty.department_count = Department.objects.filter(faculty=faculty, is_active=True).count()
            faculty.save()

        programs = {}
        for p in program_defs:
            programs[p['slug']] = _upsert(Program, p['slug'], dict(
                title=p['title'], department=departments[p['dept']],
                college=college,
                level='undergraduate', category='undergraduate',
                degree=p['degree'], duration=p['duration'],
                description=p['description'], requirements=p['requirements'],
                career_opportunities=p['career'],
                color=p['color'], icon=p['icon'],
                application_fee_local=2500, application_fee_intl=50,
                tuition_per_year_local=p['tuition'], tuition_per_year_intl=6000,
            ))

        # Convenience references used by the seeds below (alumni, applications, courses, faculty members)
        college = colleges['college-of-medicine']
        dept = departments['medicine-surgery']
        program = programs['mbbs']

        course, _ = Course.objects.get_or_create(
            code='MED101',
            defaults=dict(
                title='Human Anatomy I', credit_units=4, department=dept, level=100,
                semester='first', course_type='core',
                description='Introduction to human anatomy'
            )
        )
        med102, _ = Course.objects.get_or_create(
            code='MED102',
            defaults=dict(
                title='Physiology I', credit_units=3, department=dept, level=100,
                semester='first', course_type='core',
                description='Introduction to human physiology'
            )
        )
        course.programs.add(program)
        med102.programs.add(program)

        # Student program + profile (so portal registration/fees/clearance all work)
        student.program = program
        student.student_id = 'BMU/2021/0001'
        student.enrollment_year = 2021
        student.phone = '08034567890'
        student.address = '14 Peace Avenue, Kpansia'
        student.city = 'Yenagoa'
        student.state = 'Bayelsa'
        student.save()

        StudentProfile.objects.update_or_create(
            user=student,
            defaults=dict(
                matric_number='BMU/2021/0001',
                admission_date=date(2021, 1, 4),
                admission_type='utme', entry_mode='regular',
                current_level=200, current_semester='first',
                state_of_origin='Bayelsa', lga_of_origin='Yenagoa', nationality='Nigerian',
                nok_full_name='Mrs. Grace Doe', nok_relationship='mother',
                nok_phone='08023456789', nok_email='grace.doe@example.com',
                nok_address='14 Peace Avenue, Kpansia, Yenagoa',
            ),
        )

        # Level 200 first-semester courses for the current registration session
        course_objs = {'MED101': course, 'MED102': med102}
        courses_200 = [
            dict(code='MED201', title='Human Anatomy II', credit_units=4),
            dict(code='MED202', title='Physiology II', credit_units=3),
            dict(code='MED203', title='Medical Biochemistry I', credit_units=3),
            dict(code='MED204', title='Microbiology & Immunology I', credit_units=3),
            dict(code='MED205', title='Public Health & Community Medicine I', credit_units=2),
        ]
        for c in courses_200:
            obj, _ = Course.objects.get_or_create(
                code=c['code'],
                defaults=dict(
                    title=c['title'], credit_units=c['credit_units'], department=dept,
                    level=200, semester='first', course_type='core',
                    description=f'{c["title"]} (200 Level, First Semester)',
                ),
            )
            obj.programs.add(program)
            course_objs[c['code']] = obj

        course_objs['MED201'].prerequisites.add(course)
        course_objs['MED202'].prerequisites.add(med102)

        sched_data = [
            ('MED201', 'monday', dtime(9, 0), dtime(11, 0), 'Anatomy Theatre'),
            ('MED202', 'tuesday', dtime(9, 0), dtime(11, 0), 'Lecture Hall B'),
            ('MED203', 'wednesday', dtime(9, 0), dtime(11, 0), 'Biochemistry Laboratory'),
            ('MED204', 'thursday', dtime(9, 0), dtime(11, 0), 'Lecture Hall A'),
            ('MED205', 'friday', dtime(9, 0), dtime(11, 0), 'Lecture Hall C'),
        ]
        for code, day, st, et, venue in sched_data:
            CourseSchedule.objects.get_or_create(
                course=course_objs[code], day=day, start_time=st, end_time=et,
                defaults=dict(venue=venue),
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

        for fee in [
            dict(payment_reference='PAY-2024-001', session='2024/2025', semester='First',
                 amount=350000, status='completed', payment_method='bank_deposit'),
            dict(payment_reference='PAY-2024-002', session='2024/2025', semester='First',
                 amount=100000, status='pending', payment_method='remita'),
        ]:
            StudentFeePayment.objects.filter(student=student, payment_reference=fee['payment_reference']).delete()
            StudentFeePayment.objects.create(student=student, **fee)

        # Current-session fee structure (indigene rate) + completed payment so the
        # student is fee-clear for the current registration cycle.
        fs_2026, fs_created = FeeStructure.objects.get_or_create(
            session='2025/2026', level=200, program=None, semester='', is_indigene=True,
            defaults=dict(total_amount=125000, max_installments=2, is_active=True),
        )
        if fs_created:
            for i, (code, amount) in enumerate([
                ('TUITION-200', 90000), ('LAB', 10000), ('LIBRARY', 5000),
                ('ICT', 10000), ('DEV-LEVY', 10000),
            ]):
                ft = FeeType.objects.filter(code=code).first()
                if ft:
                    FeeStructureItem.objects.get_or_create(
                        fee_structure=fs_2026, fee_type=ft, defaults=dict(amount=amount, sort_order=i),
                    )
        StudentFeePayment.objects.filter(
            student=student, payment_reference='PAY-2026-001',
        ).delete()
        StudentFeePayment.objects.create(
            student=student, fee_structure=fs_2026, installment='full',
            session='2025/2026', semester='First',
            amount=125000, amount_paid=125000, status='completed',
            payment_method='bank_deposit', payment_reference='PAY-2026-001',
            paid_at=timezone.now() - timedelta(days=10),
        )

        StudentCourse.objects.get_or_create(
            student=student, course=course, session='2024/2025', semester='First',
            defaults=dict(total_score=78.5, grade='A', attendance_percentage=95.0),
        )

        # Completed registration for the PREVIOUS session, so the student can open a
        # fresh draft for the current one.
        Registration.objects.filter(student=student, academic_year='2025/2026').delete()
        prev_reg, _ = Registration.objects.get_or_create(
            student=student, academic_year='2024/2025', semester='first',
            defaults=dict(level=100, status='registered', total_credit_units=7,
                          registered_at=timezone.now() - timedelta(days=210)),
        )
        if _:
            prev_reg.status = 'registered'
            prev_reg.registered_at = timezone.now() - timedelta(days=210)
            prev_reg.save()
        for c in (course, med102):
            RegistrationCourse.objects.get_or_create(
                registration=prev_reg, course=c,
                defaults=dict(is_compulsory=True, approval_status='approved'),
            )

        # Attendance sessions + records so the scanner and attendance page show data
        att_sessions = [
            dict(course_obj=course_objs['MED201'], days_ago=21, token='attn-med201-1'),
            dict(course_obj=course_objs['MED201'], days_ago=14, token='attn-med201-2'),
            dict(course_obj=course_objs['MED202'], days_ago=10, token='attn-med202-1'),
        ]
        AttendanceSession.objects.filter(qr_code_token__in=[s['token'] for s in att_sessions]).delete()
        for s in att_sessions:
            sess = AttendanceSession.objects.create(
                course=s['course_obj'],
                session_date=today - timedelta(days=s['days_ago']),
                start_time=dtime(9, 0), end_time=dtime(11, 0),
                qr_code_token=s['token'], is_active=True, created_by=faculty_user,
            )
            AttendanceRecord.objects.get_or_create(session=sess, student=student)

        # Enrolled courses for the current session (drives the attendance summary)
        for code in ('MED201', 'MED202', 'MED203', 'MED204', 'MED205'):
            StudentCourse.objects.get_or_create(
                student=student, course=course_objs[code], session='2025/2026', semester='First',
                defaults=dict(attendance_percentage=87.0, approval_status='approved'),
            )

        # ------------------------------------------------------------------
        # Alumni: real profiles, future events, and a sample donation
        # ------------------------------------------------------------------
        AlumniProfile.objects.update_or_create(
            user=alumni_user,
            defaults=dict(
                graduation_year=2019,
                program=program,
                current_employer='Federal Medical Centre, Yenagoa',
                job_title='Medical Officer', career_status='employed',
                allow_networking=True, is_mentor=True,
                professional_summary='Medical Officer at FMC Yenagoa with a passion for public health and mentorship.',
            ),
        )

        extra_alumni = [
            dict(email='chioma@bmu.edu.ng', username='chioma', first='Chioma', last='Nwosu',
                 grad_year=2016, employer='World Health Organization', job='Public Health Director'),
            dict(email='james@bmu.edu.ng', username='james', first='James', last='Peters',
                 grad_year=2017, employer='National Institute of Medical Research', job='Medical Researcher'),
            dict(email='ebi@bmu.edu.ng', username='ebi', first='Ebiowei', last='Tombra',
                 grad_year=2015, employer='Niger Delta University Teaching Hospital', job='Consultant Physician'),
        ]
        for a in extra_alumni:
            u, _ = User.objects.get_or_create(
                email=a['email'],
                defaults=dict(username=a['username'], role='alumni', is_email_verified=True),
            )
            u.set_password('alumni123')
            u.first_name = a['first']
            u.last_name = a['last']
            u.save()
            AlumniProfile.objects.update_or_create(
                user=u,
                defaults=dict(
                    graduation_year=a['grad_year'],
                    program=program,
                    current_employer=a['employer'],
                    job_title=a['job'], career_status='employed',
                    allow_networking=True,
                    professional_summary=f'{a["job"]} at {a["employer"]}.',
                ),
            )

        AlumniEvent.objects.update_or_create(
            title='Class of 2019 Reunion',
            defaults=dict(
                description='Five-year reunion for the class of 2019 - reconnect with classmates and lecturers.',
                event_date=timezone.now() + timedelta(days=60),
                location='BMU Campus', event_type='reunion',
            ),
        )
        AlumniEvent.objects.update_or_create(
            title='Healthcare Leaders Networking',
            defaults=dict(
                description='Virtual networking event for healthcare professionals.',
                event_date=timezone.now() + timedelta(days=30),
                location='Online', event_type='networking', is_virtual=True,
                virtual_link='https://meet.bmu.edu.ng/alumni-networking',
            ),
        )
        AlumniEvent.objects.update_or_create(
            title='Alumni Homecoming & ASAA Reunion',
            defaults=dict(
                description='Annual alumni homecoming and Medical Students Association of Nigeria alumni reunion.',
                event_date=timezone.now() + timedelta(days=90),
                location='BMU Campus, Yenagoa', event_type='homecoming',
            ),
        )

        AlumniDonation.objects.filter(payment_reference='DON-SEED-001').delete()
        AlumniDonation.objects.create(
            donor=AlumniProfile.objects.get(user=alumni_user),
            amount=50000, currency='NGN', purpose='ASAA Endowment Fund',
            payment_method='card', payment_reference='DON-SEED-001',
            donated_at=timezone.now() - timedelta(days=20),
        )

        application, _ = Application.objects.update_or_create(
            applicant=applicant_user, program=program,
            defaults=dict(
                first_name='Michael', last_name='Brown',
                email='applicant@bmu.edu.ng', phone='08012345678',
                date_of_birth=date(2000, 5, 15), gender='male',
                address='123 Main Street, Yenagoa, Bayelsa State',
                student_type='LOCAL',
                previous_institution='Government Secondary School, Yenagoa',
                status='under_review', payment_currency='NGN',
                progress_percentage=60,
                submitted_at=timezone.now() - timedelta(days=5),
            ),
        )
        AcademicRecord.objects.update_or_create(
            application=application, type='ssce',
            institution_name='Government Secondary School, Yenagoa',
            defaults=dict(
                year_of_completion=2018,
                subjects=[
                    {'subject': 'English Language', 'grade': 'B2'},
                    {'subject': 'Mathematics', 'grade': 'B2'},
                    {'subject': 'Biology', 'grade': 'B2'},
                    {'subject': 'Chemistry', 'grade': 'B3'},
                    {'subject': 'Physics', 'grade': 'B2'},
                ],
                status='pending',
            ),
        )

        ContactEnquiry.objects.get_or_create(
            name='Parent Inquiry', email='parent@example.com',
            subject='admissions',
            defaults=dict(message='When does the next admission cycle begin?'),
        )
        ContactEnquiry.objects.get_or_create(
            name='Research Partner', email='researcher@example.com',
            subject='partnership',
            defaults=dict(message='Interested in collaborating on medical research.'),
        )

        cat, _ = BookCategory.objects.get_or_create(
            code='MED', defaults=dict(name='Medical Textbooks'),
        )
        grays, _ = Book.objects.update_or_create(
            isbn='9780323393041',
            defaults=dict(
                title='Gray Anatomy for Students',
                authors='Richard Drake, A. Wayne Vogl, Adam W. M. Mitchell',
                resource_type='book',
                publisher='Elsevier', publication_year=2020,
                description='Comprehensive anatomy textbook for medical students',
                total_copies=6, available_copies=5,
            ),
        )
        harrison, _ = Book.objects.update_or_create(
            isbn='9781264268504',
            defaults=dict(
                title='Harrison Principles of Internal Medicine',
                authors='J. Larry Jameson et al.',
                resource_type='book',
                publisher='McGraw Hill', publication_year=2022,
                description='Leading textbook on internal medicine',
                total_copies=4, available_copies=4,
            ),
        )
        harrison.categories.add(cat)
        grays.categories.add(cat)
        for b in Book.objects.filter(title__in=[
            'Library and Information Services to the Rural Community',
            'Introduction to Library and Society',
            'Demystifying Reference Services',
            'Information Literacy: Text for Students',
        ]):
            b.total_copies = 2
            b.available_copies = 2
            b.save(update_fields=['total_copies', 'available_copies'])

        # Sample borrowed loan so the "My Loans" panel has data
        BookLoan.objects.filter(
            student=student, book=grays, status='borrowed',
        ).delete()
        BookLoan.objects.create(
            book=grays, student=student, status='borrowed',
            loaned_at=timezone.now() - timedelta(days=5),
            due_date=today + timedelta(days=9),
        )

        DigitalResource.objects.get_or_create(
            name='PubMed Central',
            defaults=dict(
                description='Free full-text archive of biomedical literature',
                resource_type='database', url='https://www.ncbi.nlm.nih.gov/pmc/',
                requires_login=False, is_active=True,
            ),
        )
        DigitalResource.objects.get_or_create(
            name='BMU Institutional Repository',
            defaults=dict(
                description='Research outputs from BMU',
                resource_type='repository', url='https://repository.bmu.edu.ng/',
                requires_login=True, is_active=True,
            ),
        )
        DigitalResource.objects.get_or_create(
            name='BMU-Learn',
            defaults=dict(
                description='Access specialized medical textbooks, research papers, and interactive learning modules tailored for health sciences education.',
                resource_type='ebook_collection', url='https://bmu-learn.bmu.edu.ng/',
                requires_login=True, is_active=True,
            ),
        )

        etebu_books = [
            dict(title='Library and Information Services to the Rural Community',
                 authors='Dr. Abraham I. T. Etebu', resource_type='book',
                 description='A practical text on delivering library and information services to rural communities in Nigeria.'),
            dict(title='Introduction to Library and Society',
                 authors='Dr. Abraham I. T. Etebu', resource_type='book',
                 description='An introduction to the role of libraries and librarianship in society.'),
            dict(title='Demystifying Reference Services',
                 authors='Dr. Abraham I. T. Etebu', resource_type='book',
                 description='A guide to reference services, readers services and information literacy.'),
            dict(title='Information Literacy: Text for Students',
                 authors='Dr. Abraham I. T. Etebu', resource_type='book',
                 description='A textbook for students on information literacy, authored by the University Librarian.'),
        ]
        for b in etebu_books:
            Book.objects.get_or_create(title=b['title'], defaults=b)

        # ------------------------------------------------------------------
        # Real BMU gallery (images downloaded from bmu.edu.ng/media/gallery/)
        # ------------------------------------------------------------------
        from content.models import GalleryImage
        gallery_data = [
            dict(title='BMU Vice-Chancellor Showcases University at Global HIV/STI 2025 World Congress Symposium in Montreal, Canada',
                 description='"Africa is not just experiencing the burden of emerging infections - it is contributing to the global solutions." - Prof. Dimie Ogoina, Vice-Chancellor, BMU',
                 category='events', event_date=date(2025, 7, 26), location='Montreal, Canada',
                 image='gallery/Screenshot_2025-08-07_111406.png', display_order=1),
            dict(title='ASPIRE Visionaire',
                 description='Familiarisation tour of the Vice Chancellor, Prof. Dimie Ogoina, after his inauguration',
                 category='campus', image='gallery/IMG_0175.JPG', display_order=2),
            dict(title='Haematology Centre',
                 description='The Haematology Centre at Bayelsa Medical University',
                 category='campus', image='gallery/IMG_9802.JPG', display_order=3),
            dict(title='Student Clinic',
                 description='The Medical University Clinic with State of the Art Facilities',
                 category='campus', image='gallery/Clinic1.jpg', display_order=4),
            dict(title='Biology Laboratory',
                 description='96 Capacity State-of-the-Art Modern Laboratory for Biology',
                 category='facilities', image='gallery/Laboratory.jpg', display_order=5),
        ]
        for g in gallery_data:
            GalleryImage.objects.get_or_create(
                title=g['title'],
                defaults=dict(
                    description=g.get('description', ''), category=g['category'],
                    event_date=g.get('event_date'), location=g.get('location', ''),
                    image=g['image'], display_order=g['display_order'], is_published=True,
                ),
            )

        # ------------------------------------------------------------------
        # Real BMU testimonials and partners (from bmu.edu.ng)
        # ------------------------------------------------------------------
        testimonials_data = [
            dict(name='Janet B.', role='B.Sc. Nursing Science (300 Level), Student',
                 quote='BMU is where passion meets purpose. The hands-on training, simulation labs, and inspiring faculty make learning feel meaningful and practical.',
                 display_order=1),
            dict(name='Kingsley N.', role='B.Sc. Human Anatomy (Final Year Student)',
                 quote='What stands out at BMU is the strong sense of community and academic excellence. Every day here brings me closer to my dream of becoming a researcher.',
                 display_order=2),
            dict(name='Faith O.', role='B.Sc. Public Health (Alumni)',
                 quote='From the very beginning, I felt supported. The academic structure and mentorship at BMU shaped me into a purpose-driven professional ready to serve my community.',
                 display_order=3),
            dict(name='Ebiowei T.', role='MBBS Student (500 Level)',
                 quote='BMU provides a focused and practical medical education. The clinical exposure and modern facilities have made learning engaging and rewarding.',
                 display_order=4),
            dict(name='Amarachi E.', role='B.Sc. Biochemistry (Alumna)',
                 quote='Studying at BMU gave me not just knowledge but confidence. The lecturers were approachable and committed to our success. I left BMU fully prepared for the real world.',
                 display_order=5),
        ]
        for t in testimonials_data:
            Testimonial.objects.get_or_create(
                name=t['name'],
                defaults=dict(role=t['role'], quote=t['quote'], display_order=t['display_order'], is_active=True),
            )

        partners_data = [
            dict(name='Federal Medical Centre, Yenagoa', website='https://fmcyenagoa.org.ng',
                 description='Clinical training partner providing hospital-based training for BMU students.',
                 display_order=1),
            dict(name='National Universities Commission', website='https://www.nuc.edu.ng',
                 description='The National Universities Commission, the statutory body that accredits and regulates university education in Nigeria.',
                 display_order=2),
            dict(name='Tertiary Education Trust Fund (TETFund)', website='https://tetfund.gov.ng',
                 description='Federal government agency providing funding for infrastructure, research, and academic staff development.',
                 display_order=3),
            dict(name='Niger Delta University Teaching Hospital (NDUTH)', website='',
                 description='Clinical training partner in Okolobiri, Bayelsa State.',
                 display_order=4),
        ]
        for p in partners_data:
            Partner.objects.get_or_create(
                name=p['name'],
                defaults=dict(website=p.get('website', ''), description=p['description'],
                              display_order=p['display_order'], is_active=True),
            )

        # (All 24 real BMU undergraduate programs are created in the academic structure section above.
        #  The previous placeholder programs, including the fake postgraduate MSc/PhD entries, have been removed.)

        # Seed Faculty members
        from academics.models import Faculty as FacultyModel
        dept_medicine = departments['medicine-surgery']
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
                 college=college, department=departments['medical-laboratory-science'], position='lecturer',
                 research_interests='Medical Laboratory Science, Clinical Chemistry',
                 bio='Lecturer in Medical Laboratory Science with expertise in clinical diagnostics.', citations=320, h_index=10, i10_index=14),
            dict(first_name='Nkechi', last_name='Okonkwo', title='Prof.', email='nkechi.okonkwo@bmu.edu.ng',
                 college=college, department=departments['nursing-science'], position='professor',
                 research_interests='Nursing Education, Maternal Health, Community Health',
                 bio='Professor of Nursing with extensive experience in maternal and child health.', citations=890, h_index=18, i10_index=28),
            dict(first_name='Chidi', last_name='Eze', title='Dr.', email='chidi.eze@bmu.edu.ng',
                 college=college, department=departments['public-health'], position='senior_lecturer',
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
            dict(first_name='Dimie', last_name='Ogoina', title='Prof.', position='vc',
                 specific_title='Vice Chancellor',
                 biography=(
                     'Professor Dimie Ogoina is the Vice-Chancellor of Bayelsa Medical University (BMU), having assumed office on 2nd October 2024. '
                     'An internationally acclaimed physician-scientist and infectious diseases specialist, he is the second substantive Vice-Chancellor of the University, succeeding the pioneer Vice-Chancellor, Professor Ebitimitula Nicholas Etebu.\n\n'
                     'Professor Ogoina is globally renowned for his pioneering work on mpox (monkeypox). In 2017, he diagnosed and managed Nigeria\'s first mpox case and was the first scientist in the world to report evidence of the potential sexual transmission of the virus. In recognition of this and his wider contributions to global health, he was named one of Nature\'s Top 10 Scientists (2022) and listed among TIME\'s 100 Most Influential People in the World (2023). He served as Chair of the World Health Organization (WHO) Emergency Committee on Mpox and is consistently ranked among Stanford University\'s World Top 2% Scientists.\n\n'
                     'Prior to his appointment as Vice-Chancellor, he served as Chief Medical Director of the Niger Delta University Teaching Hospital and as Acting Provost of the College of Health Sciences, Niger Delta University.'
                 ),
                 qualifications='MBBS, FMCP, FWACP, FIDSA, FACP',
                 research_interests='Infectious diseases, Mpox, Global health governance, Health systems',
                 achievements=(
                     'Named one of Nature\'s Top 10 Scientists (2022)\n'
                     'Listed among TIME\'s 100 Most Influential People in the World (2023)\n'
                     'Consistently ranked among Stanford University\'s World Top 2% Scientists\n'
                     'Chair, WHO Emergency Committee on Mpox\n'
                     'Authored over 100 peer-reviewed publications'
                 ),
                 display_order=1),
            dict(first_name='Ligha Aloysius', last_name='Ebi', title='Prof.', position='dvc_academic',
                 specific_title='Deputy Vice Chancellor (Administration & Academics)',
                 biography=(
                     'Professor Ligha Aloysius Ebi is an accomplished physician, academic, and administrator with over two decades of teaching, research, and clinical experience. '
                     'Trained as a medical doctor at the University of Ibadan, he advanced his studies with a Master\'s degree in Anatomy (University of Lagos), a PhD in Anatomy (University of Port Harcourt), and a Doctor of Medicine in Radiology (University of Central Nicaragua). He is a Board-Certified Radiologist by the Philippine College of Radiology, Manila.\n\n'
                     'He rose through the academic ranks to become Professor of Anatomy in 2017 and has served in key leadership roles including Acting Dean of the Faculty of Basic Medical Sciences and Acting Provost at Niger Delta University. In 2024, he was appointed Deputy Vice-Chancellor (Administration & Academics) of Bayelsa Medical University, where he continues to shape institutional policy, curriculum, and research development.\n\n'
                     'His research spans radiological anatomy, histology, reproductive biology, and medical education, with publications in local and global journals. He delivered the 58th Inaugural Lecture of Niger Delta University (2024) on congenital malformations.'
                 ),
                 qualifications='MBBS, MSc, MD, PhD, FPCR',
                 research_interests='Radiological anatomy, Histology, Reproductive biology, Medical education',
                 achievements=(
                     'Professor of Anatomy (2017)\n'
                     'Deputy Vice-Chancellor (Administration & Academics), BMU (2024)\n'
                     'Over 40 publications in peer-reviewed journals\n'
                     'Delivered the 58th Inaugural Lecture of Niger Delta University (2024)'
                 ),
                 display_order=2),
            dict(first_name='Godwill Abraham', last_name='Ziriki', title='Prof.', position='dvc_admin',
                 specific_title='Deputy Vice Chancellor, Sampou Campus',
                 biography='Professor Godwill Abraham Ziriki is the Deputy Vice Chancellor in charge of the Sampou Campus of Bayelsa Medical University. He holds a Ph.D., M.Sc., and B.Sc. in Physics.',
                 qualifications='PhD, M.Sc, B.Sc',
                 research_interests='',
                 display_order=3),
            dict(first_name='Felicia Eyimuze', last_name='Akusu', title='Dr.', position='registrar',
                 specific_title='Registrar/Secretary to Council',
                 biography=(
                     'Dr. Mrs. Felicia Eyimuze Akusu is the 2nd substantive Registrar of Bayelsa Medical University (BMU). She earned a B.Sc. in Business Education from the Rivers State University of Science and Technology (RSUST), a Master\'s degree in Educational Planning and Management, and a Ph.D. in Educational Management from Niger Delta University.\n\n'
                     'She has rendered over twenty-nine years of dedicated service in tertiary education administration, serving as Secretary, Member, and Chairperson of several committees and panels across universities. She is an active member of the Association of Nigerian Universities Professional Administrators (ANUPA) and the Nigerian Institute of Management (NIM).'
                 ),
                 qualifications='PhD (Educational Management), M.Sc (Educational Planning & Management), B.Sc (Business Education)',
                 research_interests='Educational management, University administration, Governance',
                 achievements=(
                     '29+ years of service in tertiary education administration\n'
                     '2nd substantive Registrar of Bayelsa Medical University\n'
                     'Member, ANUPA and NIM'
                 ),
                 display_order=4),
            dict(first_name='Ebipuado Saware', last_name='Ombu', title='Mr.', position='bursar',
                 specific_title='The Bursar',
                 biography='Mr. Ebipuado Saware Ombu is the Bursar of Bayelsa Medical University. He is a chartered accountant and served as Chairman of the Institute of Chartered Accountants of Nigeria (ICAN), Bayelsa State Chapter.',
                 qualifications='B.Sc., M.Sc., ACA',
                 research_interests='',
                 achievements='Former Chairman, ICAN Bayelsa State Chapter',
                 display_order=6),
            dict(first_name='Abraham I. T.', last_name='Etebu', title='Dr.', position='librarian',
                 specific_title='University Librarian',
                 biography=(
                     'Dr. Abraham Inetimitula Tabor Etebu is an accomplished Associate Professor of Library and Information Science. He holds a B.Sc (Ed) in Library Science and an M.Sc in Library and Information Science from Delta State University, and a Ph.D. in Library and Information Science from the University of Nigeria, Nsukka. He is a Certified Librarian of Nigeria (CLN), accredited by the Librarians Registration Council of Nigeria (LRCN).\n\n'
                     'His areas of specialization include Readers Services (Circulation and Reference Services), Information Literacy, Attitude Studies, and Rural Information Services. He is the author of several notable publications, including Library and Information Services to the Rural Community and Information Literacy: Text for Students.'
                 ),
                 qualifications='B.Sc (Ed), M.Sc, Ph.D, CLN',
                 research_interests='Readers services, Information literacy, Rural information services',
                 achievements=(
                     'Associate Professor of Library and Information Science\n'
                     'Certified Librarian of Nigeria (CLN)\n'
                     'Former Chairman, Nigerian Library Association (NLA), Bayelsa State Chapter'
                 ),
                 display_order=7),
            dict(first_name='Tarila', last_name='Tebepah', title='Prof.', position='pro_chancellor',
                 specific_title='Pro-Chancellor & Chairman of Council',
                 biography='Prof. Tarila Tebepah is a surgeon, Professor of Ophthalmology, scholar and an Administrator. He served as Chairman of the Niger Delta Development Commission (NDDC), Commissioner for Health, Bayelsa State, Secretary of the People\'s Democratic Party (PDP), Bayelsa State, and Trustee of the Tertiary Education Trust Fund (TETFund).',
                 qualifications='Professor of Ophthalmology',
                 research_interests='',
                 achievements=(
                     'Former Chairman, Niger Delta Development Commission (NDDC)\n'
                     'Former Commissioner for Health, Bayelsa State\n'
                     'Former Secretary, PDP Bayelsa State\n'
                     'Former Trustee, Tertiary Education Trust Fund (TETFund)'
                 ),
                 display_order=0),
            dict(first_name='Frederick', last_name='Allison', title='Dr.', position='dean',
                 specific_title='Dean, Faculty of Basic Clinical Sciences',
                 biography=(
                     'Dr. Frederick Allison is a distinguished Consultant Chemical Pathologist and Senior Lecturer at the Faculty of Basic Clinical Sciences, where he also serves as the Dean of the Faculty. '
                     'He completed his medical education at the University of Calabar and achieved his specialist qualification from the National Postgraduate Medical College of Nigeria. He has made significant contributions to his field through numerous scholarly articles and presentations delivered at both local and international conferences.'
                 ),
                 qualifications='MBBS, FMCP',
                 research_interests='Chemical pathology, Clinical biochemistry',
                 achievements='Dean, Faculty of Basic Clinical Sciences\nConsultant Chemical Pathologist',
                 display_order=8),
            dict(first_name='Theodore', last_name='Allison', title='Dr.', position='dean',
                 specific_title='Ag. Dean, Faculty of Basic Medical Sciences',
                 biography='Dr. Theodore Allison is the Acting Dean of the Faculty of Basic Medical Sciences at Bayelsa Medical University, where he provides academic and administrative leadership for the foundational medical science programmes.',
                 qualifications='',
                 research_interests='',
                 display_order=9),
            dict(first_name='Gift Cornelius', last_name='Timighe', title='Dr.', position='dean',
                 specific_title='Dean, Faculty of Health Sciences',
                 biography='Dr. (Mrs) Gift Cornelius Timighe is the Dean of the Faculty of Health Sciences at Bayelsa Medical University, with expertise in Nursing and Midwifery.',
                 qualifications='',
                 research_interests='Nursing and Midwifery',
                 display_order=10),
            dict(first_name='Ebiowei S. F.', last_name='Orubu', title='Prof.', position='dean',
                 specific_title='Dean, Faculty of Pharmaceutical Sciences',
                 biography='Professor Ebiowei S. F. Orubu is the Dean of the Faculty of Pharmaceutical Sciences at Bayelsa Medical University.',
                 qualifications='',
                 research_interests='Pharmaceutical Sciences',
                 display_order=11),
            dict(first_name='Iniobong Reuben', last_name='Inyang', title='Prof.', position='dean',
                 specific_title='Dean, Faculty of Science',
                 biography='Professor Iniobong Reuben Inyang is the Dean of the Faculty of Science at Bayelsa Medical University.',
                 qualifications='',
                 research_interests='',
                 display_order=12),
            dict(first_name='Isaac J.', last_name='Abasi', title='Prof.', position='dean',
                 specific_title='Dean, Faculty of Clinical Sciences',
                 biography='Professor Isaac J. Abasi is the Dean of the Faculty of Clinical Sciences at Bayelsa Medical University, with expertise in Obstetrics and Gynaecology.',
                 qualifications='',
                 research_interests='Obstetrics and Gynaecology',
                 display_order=13),
            dict(first_name='Philip', last_name='Eyimina', title='Prof.', position='provost',
                 specific_title='Provost, College of Medicine',
                 biography='Professor Philip Eyimina is the Provost of the College of Medicine at Bayelsa Medical University, with expertise in Brachial Plexus, Cytogenetics, and Neuroanatomy.',
                 qualifications='',
                 research_interests='Brachial Plexus, Cytogenetics, Neuroanatomy',
                 display_order=5),
            dict(first_name='Marie-Thérèse', last_name='Teibowei', title='Dr.', position='hod',
                 specific_title='Special Assistant to the Vice-Chancellor, Public Relations Officer',
                 biography=(
                     'Dr. Marie-Thérèse Teibowei is the Special Assistant to the Vice-Chancellor, Public Relations Officer, and Senior Lecturer at Bayelsa Medical University (BMU). '
                     'She is a multilingual scholar with expertise in Biomedical Translation, French, Strategic Communication, and International Studies, holding a Ph.D. in French & International Studies, an M.A. in Translation (English and French), and a B.Sc. in Journalism, Mass Communication and Gender Studies.\n\n'
                     'She facilitated the establishment of the International Institute of Tourism and Hospitality (2015), established Nigeria\'s first Institute of Foreign Languages and Biomedical Translation (2019\u20132023), and was part of the pioneer management team that set up Bayelsa Medical University.'
                 ),
                 qualifications='PhD (French & International Studies), M.A. (Translation), B.Sc. (Journalism)',
                 research_interests='Biomedical translation, Strategic communication, International studies',
                 achievements=(
                     'Established Nigeria\'s first Institute of Foreign Languages and Biomedical Translation\n'
                     'Part of the pioneer management team of BMU\n'
                     'Represented BMU at the United Nations Climate Conferences'
                 ),
                 display_order=15),
        ]
        current_leader_names = {(ld['first_name'], ld['last_name']) for ld in leaders_data}
        for leader in Leadership.objects.all():
            if (leader.first_name, leader.last_name) not in current_leader_names:
                leader.delete()
        for ld in leaders_data:
            Leadership.objects.update_or_create(
                first_name=ld['first_name'],
                last_name=ld['last_name'],
                defaults=dict(
                    title=ld.get('title', ''),
                    position=ld['position'],
                    specific_title=ld.get('specific_title', ''),
                    biography=ld.get('biography', ''),
                    qualifications=ld.get('qualifications', ''),
                    research_interests=ld.get('research_interests', ''),
                    achievements=ld.get('achievements', ''),
                    email=ld.get('email'),
                    phone=ld.get('phone'),
                    display_order=ld['display_order'],
                    is_active=True,
                ),
            )

        # Public Documents
        public_docs = [
            dict(title='University Prospectus 2024-2025', description='Complete guide to programs, admissions, and campus life at Bayelsa Medical University.', category='academic', file_type='pdf', file_size='8.5 MB', version='2024', date_label='January 2024', display_order=1, is_featured=True),
            dict(title='Annual Financial Report 2023', description='Financial and operational report for the 2023 academic year.', category='financial', file_type='pdf', file_size='4.2 MB', version='2023', date_label='March 2024', display_order=2, is_featured=True),
            dict(title='Research Ethics Guidelines', description='Guidelines for conducting ethical research at BMU.', category='research', file_type='pdf', file_size='1.8 MB', version='2024', date_label='Updated 2024', display_order=3, is_featured=False),
            dict(title='Student Handbook 2024-2025', description='Rules, regulations, and guidelines for students.', category='student', file_type='pdf', file_size='3.5 MB', version='2024', date_label='August 2024', display_order=4, is_featured=True),
            dict(title='Staff Policy Manual', description='Employment policies, benefits, and procedures for staff.', category='staff', file_type='pdf', file_size='2.9 MB', version='2024', date_label='July 2024', display_order=5, is_featured=False),
            dict(title='Strategic Plan 2024-2030', description='University strategic vision and development goals.', category='strategic', file_type='pdf', file_size='5.1 MB', version='2024', date_label='December 2023', display_order=6, is_featured=True),
            dict(title='Annual Impact Report 2024', description='Comprehensive report on BMU\'s SDG contributions and community impact for the 2024 academic year.', category='strategic', file_type='pdf', file_size='4.2 MB', version='2024', date_label='March 2025', display_order=7, is_featured=True),
            dict(title='Annual Impact Report 2023', description='Detailed overview of BMU\'s impact on health, education, and gender equality in 2023.', category='strategic', file_type='pdf', file_size='3.8 MB', version='2023', date_label='March 2024', display_order=8, is_featured=False),
            dict(title='Annual Impact Report 2022', description='Baseline impact report establishing key metrics for THE Impact Rankings submission.', category='strategic', file_type='pdf', file_size='3.5 MB', version='2022', date_label='April 2023', display_order=9, is_featured=False),
        ]
        for d in public_docs:
            PublicDocument.objects.get_or_create(
                title=d['title'],
                defaults=dict(
                    description=d['description'],
                    category=d['category'],
                    file_type=d['file_type'],
                    file_size=d['file_size'],
                    version=d['version'],
                    date_label=d['date_label'],
                    display_order=d['display_order'],
                    is_featured=d['is_featured'],
                ),
            )

        # Add Public Documents to navbar menu (About mega menu)
        about_parent = MenuItem.objects.filter(label='About', parent__isnull=True, location='navbar').first()
        if about_parent:
            MenuItem.objects.get_or_create(
                label='Public Documents',
                parent=about_parent,
                defaults=dict(
                    url='/about/documents',
                    location='navbar',
                    column=2,
                    display_order=11,
                    is_active=True,
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

        ImportantDate.objects.filter(event__in=[
            'Application Opening for 2025/2026 Session',
            'UTME / Direct Entry Application Deadline',
            'Postgraduate Application Deadline',
            'Entrance Examination Date',
            'Interview for Shortlisted Candidates',
            'Admission List Publication',
            'Registration and Orientation Week',
            'First Semester Lectures Begin',
        ]).delete()
        important_dates = [
            dict(event='Application Opening', date=date(2026, 7, 1), status='upcoming', display_order=1,
                 description='Application for admission opens in July every year.'),
            dict(event='Early Decision Deadline', date=date(2026, 9, 30), status='upcoming', display_order=2,
                 description='Deadline for early decision applications (September every year).'),
            dict(event='Regular Decision Deadline', date=date(2026, 11, 30), status='upcoming', display_order=3,
                 description='Deadline for regular decision applications (November).'),
            dict(event='Notification of Decision', date=date(2026, 12, 15), status='upcoming', display_order=4,
                 description='Not fixed; depends on your credentials and intended program.'),
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
        about_page, _ = AboutPage.objects.update_or_create(
            pk=1,
            defaults=dict(
                hero_title='About Bayelsa Medical University',
                hero_content='Bayelsa Medical University is a beacon of excellence in medical education, research, and compassionate care, committed to developing the next generation of healthcare leaders and innovators.',
                about_main_title='About the Bayelsa Medical University',
                about_main_content='BMU is a specialised medical university established to raise crops of professionally competent personnel in the multi-disciplinary study of medicine and allied medical sciences that are capable of identifying health needs and challenges of society and proffering solutions to such issues for the well-being of mankind.',
                mission_content='BMU advances healthcare through quality education, evidence-based research, and compassionate service. We train competent professionals, foster innovation, and partner with communities to improve health outcomes locally and globally.',
                vision_content='To be a leading African medical university recognized globally for excellence in health education, research, innovation, and community impact.',
                why_choose=[
                    dict(icon_name='FlaskConical', title='Cutting-Edge Learning, Real-World Impact', description='At Bayelsa Medical University, our modern labs, world-class faculty, and hands-on training prepare students to lead in healthcare, science, and research \u2014 right from the heart of the Niger Delta.'),
                    dict(icon_name='Heart', title='Excellence Rooted in Purpose', description='We don\'t just teach medicine \u2014 we nurture purpose. BMU offers a student-centered education that empowers you to serve, innovate, and make a lasting difference in your community and beyond.'),
                    dict(icon_name='BadgeCheck', title='Affordable Quality, Global Standards', description='BMU combines affordability with international best practices, giving you access to quality education, clinical exposure, and global career opportunities \u2014 all within a supportive learning environment.'),
                    dict(icon_name='Award', title='Academic Excellence', description='At BMU, academic excellence isn\'t just a goal \u2014 it\'s our culture. With experienced faculty, rigorous programs, and a commitment to innovation, we equip students to excel locally and compete globally.'),
                ],
                meta_description='BMU is a specialised medical university established to raise crops of professionally competent personnel in the multi-disciplinary study of medicine and allied medical sciences.',
            )
        )
        stats_data = [
            dict(value='2019', label='Established', suffix='', order=1),
            dict(value='2,148', label='Students', suffix='', order=2),
            dict(value='7', label='Faculties', suffix='', order=3),
            dict(value='25', label='Departments', suffix='', order=4),
        ]
        about_page.stats.all().delete()
        for s in stats_data:
            AboutStat.objects.create(page=about_page, **s)
        core_values_data = [
            dict(icon_name='HeartHandshake', title='Service', description='We believe that delivering excellent service to humanity is also serving God.', order=1),
            dict(icon_name='Shield', title='Integrity', description='We are committed to upholding the truth and intellectual honesty in all our endeavors.', order=2),
            dict(icon_name='Heart', title='Compassion', description='We show kindness and care towards our students, staff, and patients.', order=3),
            dict(icon_name='Target', title='Dedication', description='We are dedicated to engaging in innovative medical science practices that will translate into improved quality of life for people.', order=4),
            dict(icon_name='ClipboardCheck', title='Accountability', description='We are accountable for all our everyday decisions and actions to our institution, stakeholders, and society in general.', order=5),
            dict(icon_name='Users', title='Collaboration', description='We value teamwork and support for each other in every way possible to achieve the University\'s purpose.', order=6),
            dict(icon_name='Sparkles', title='Passion', description='We demonstrate uncommon enthusiasm and commitment to our work, students, staff, and patients.', order=7),
        ]
        about_page.core_values.all().delete()
        for v in core_values_data:
            AboutCoreValue.objects.create(page=about_page, **v)

        # ====================================================================
        # Seed History Page
        # ====================================================================
        history_page, _ = HistoryPage.objects.update_or_create(
            pk=1,
            defaults=dict(
                hero_content='Bayelsa Medical University (BMU) was established to address critical healthcare manpower shortages in the Niger Delta region and Nigeria at large, growing into one of Nigeria\'s fastest-growing medical universities.',
                meta_description='Explore the journey of Bayelsa Medical University from its establishment to becoming one of Nigeria\'s fastest-growing medical universities.',
                intro_title='About the Bayelsa Medical University',
                intro_content=(
                    'Bayelsa Medical University (BMU) was established in 2019 by the Bayelsa State Government under the leadership of His Excellency, Governor Henry Seriake Dickson, as part of a strategic vision to address critical healthcare manpower shortages in the Niger Delta region and Nigeria at large. The institution was conceived to be a world-class, technology-driven medical university that would produce highly skilled doctors, dentists, pharmacists, and allied health professionals to improve healthcare delivery in Nigeria.\n\n'
                    'BMU is a specialised medical university established to raise crops of professionally competent personnel in the multi-disciplinary study of medicine and allied medical sciences that are capable of identifying health needs and challenges of society and proffering solutions to such issues for the well-being of mankind. It began with two pioneer faculties: Basic Medical Sciences (Anatomy, Physiology, Biochemistry) and Clinical Sciences (MBBS programme), with Prof. Ebitimitula Nicholas Etebu appointed as the pioneer Vice-Chancellor.\n\n'
                    'Today, BMU is one of Nigeria\'s fastest-growing medical universities, known for technology-enhanced learning (AI, VR, and simulation-based training), strong clinical exposure (early patient interaction from Year 3), research focus (tropical diseases, public health, and medical innovation), and state government support ensuring sustainable growth.'
                ),
                intro_image_caption='BMU Campus Development',
                stat_1_value='2,148',
                stat_1_label='Students',
                stat_2_value='7',
                stat_2_label='Faculties',
                stat_3_value='25',
                stat_3_label='Departments',
                future_title='Looking Ahead',
                future_content='Plans for postgraduate medical programmes (Residencies, MSc, PhD), the ongoing establishment of a satellite campus at Sampou, Kolokuma/Opokuma Local Government Area, and increased collaborations with global medical institutions.',
                future_quote='"Together, we are not just building a university. We are building a legacy of excellence, innovation, and impact." \u2014 Professor Dimie Ogoina, Vice-Chancellor',
            )
        )
        history_page.timeline_events.all().delete()
        timeline_data = [
            dict(year='2018', title='Establishment', description='BMU was established via the Bayelsa Medical University Law enacted by the Bayelsa State House of Assembly, beginning with two pioneer faculties: Basic Medical Sciences and Clinical Sciences (MBBS programme).', icon_name='Building2', order=1),
            dict(year='2019', title='University Founded', description='BMU admitted its first students with foundational programs in Medicine and Nursing to address regional healthcare needs, and secured full accreditation from the National Universities Commission (NUC) for its MBBS programme.', icon_name='GraduationCap', order=2),
            dict(year='2021', title='Expansion and Growth', description='The university expanded to include new faculties such as Pharmaceutical Sciences, Dentistry, Health Sciences, and Sciences, alongside accelerated development of the permanent campus along Imgbi Road.', icon_name='Award', order=3),
            dict(year='2023', title='Campus Expansion', description='Opened a state-of-the-art teaching hospital and advanced research laboratories, including VR/AR-equipped medical simulation labs, modern lecture halls, and student hostels.', icon_name='Building2', order=4),
            dict(year='2024', title='Academic Growth', description='Launched the postgraduate school and several new specialty programs, attracting international students and further strengthening research capacity.', icon_name='GraduationCap', order=5),
            dict(year='2025', title='Global Recognition', description='Forged key partnerships with leading global universities and established a high-fidelity simulation lab, positioning BMU among Nigeria\'s fastest-growing medical universities.', icon_name='Globe', order=6),
        ]
        for t in timeline_data:
            TimelineEvent.objects.create(page=history_page, **t)

        # ====================================================================
        # Seed Vision & Mission Page
        # ====================================================================
        vision_page, _ = VisionMissionPage.objects.update_or_create(
            pk=1,
            defaults=dict(
                hero_content='Bayelsa Medical University advances healthcare through quality education, evidence-based research, and compassionate service, guided by a compelling vision and a transformative mission.',
                mission_content='BMU advances healthcare through quality education, evidence-based research, and compassionate service. We train competent professionals, foster innovation, and partner with communities to improve health outcomes locally and globally.',
                vision_content='To be a leading African medical university recognized globally for excellence in health education, research, innovation, and community impact.',
                meta_description='Discover BMU\'s vision to be a leading African medical university and our mission to advance healthcare through quality education, evidence-based research, and compassionate service.',
            )
        )
        vision_page.strategic_pillars.all().delete()
        pillars_data = [
            dict(icon_name='Award', title='Academic Excellence', description='Strengthening quality assurance, curriculum innovation, faculty development, and student engagement to deliver teaching and assessment aligned with global best practices.', order=1),
            dict(icon_name='Leaf', title='Sustainability', description='Ensuring long-term financial and environmental sustainability through diversified revenue streams, entrepreneurship, and the integration of green technologies such as solar energy and energy-efficient systems.', order=2),
            dict(icon_name='Users', title='Partnerships & Engagement', description='Building strong collaborations with local, national, and international institutions, and deepening community outreach to directly address the health needs of Bayelsa State, the Niger Delta, and beyond.', order=3),
            dict(icon_name='Lightbulb', title='Innovation & Technology', description='Integrating advanced technologies \u2014 Artificial Intelligence (AI), Virtual Reality (VR), the Internet of Things (IoT), and telemedicine \u2014 into education, research, and administration.', order=4),
            dict(icon_name='Microscope', title='Research Excellence', description='Establishing Centers of Excellence and a Global Research Incubator and Accelerator Hub to nurture high-impact research, attract international scholars, and reward outstanding academic and scientific achievement.', order=5),
            dict(icon_name='HeartHandshake', title='Empowerment & Welfare', description='Creating a supportive and safe environment that prioritizes the welfare, career development, and mentorship of students and staff, fostering a community that is motivated, proud, and committed to excellence.', order=6),
        ]
        for p in pillars_data:
            VisionMissionPillar.objects.create(page=vision_page, **p)
        vision_page.core_values.all().delete()
        vm_values_data = [
            dict(title='Service', description='We believe that delivering excellent service to humanity is also serving God.', order=1),
            dict(title='Integrity', description='We are committed to upholding the truth and intellectual honesty in all our endeavors.', order=2),
            dict(title='Compassion', description='We show kindness and care towards our students, staff, and patients.', order=3),
            dict(title='Dedication', description='We are dedicated to engaging in innovative medical science practices that will translate into improved quality of life for people.', order=4),
            dict(title='Accountability', description='We are accountable for all our everyday decisions and actions to our institution, stakeholders, and society in general.', order=5),
            dict(title='Collaboration', description='We value teamwork and support for each other in every way possible to achieve the University\'s purpose.', order=6),
            dict(title='Passion', description='We demonstrate uncommon enthusiasm and commitment to our work, students, staff, and patients.', order=7),
        ]
        for v in vm_values_data:
            VisionMissionValue.objects.create(page=vision_page, **v)

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

        # ====================================================================
        # Refresh Academics overview page sections (single college + 7 faculties)
        # ====================================================================
        PageSection.objects.update_or_create(
            page_key='academics', section_key='academic_units',
            defaults=dict(
                content_type='cards',
                title='Academic Units',
                subtitle='',
                display_order=1,
                is_active=True,
                data=[
                    dict(name='College of Medicine', programs='MBBS, B.Sc Anatomy, B.Sc Physiology, B.Sc Biochemistry', link='/colleges/college-of-medicine', color='#1E1E1E', icon='GraduationCap'),
                    dict(name='Faculty of Basic Medical Sciences', programs='B.Sc Anatomy, B.Sc Physiology, B.Sc Biochemistry', link='/academics/faculties/faculty-of-basic-medical-sciences', color='#1E1E1E', icon='Microscope'),
                    dict(name='Faculty of Clinical Sciences', programs='MBBS Medicine & Surgery', link='/academics/faculties/faculty-of-clinical-sciences', color='#1E1E1E', icon='Stethoscope'),
                    dict(name='Faculty of Basic Clinical Sciences', programs='Anatomical Pathology', link='/academics/faculties/faculty-of-basic-clinical-sciences', color='#1E1E1E', icon='Activity', standalone=True),
                    dict(name='Faculty of Dentistry', programs='BDS Dental Surgery', link='/academics/faculties/faculty-of-dentistry', color='#1E1E1E', icon='Stethoscope', standalone=True),
                    dict(name='Faculty of Health Sciences', programs='B.NSc Nursing, BMLS, Radiography, Physiotherapy, Optometry, Public Health', link='/academics/faculties/faculty-of-health-sciences', color='#A51C30', icon='HeartPulse', standalone=True),
                    dict(name='Faculty of Pharmaceutical Sciences', programs='Pharm.D Pharmacy', link='/academics/faculties/faculty-of-pharmaceutical-sciences', color='#1E1E1E', icon='Award', standalone=True),
                    dict(name='Faculty of Science', programs='B.Sc Biology, Chemistry, Microbiology, Physics, Mathematics, Statistics, Computer Science', link='/academics/faculties/faculty-of-science', color='#1E1E1E', icon='FlaskConical', standalone=True),
                ],
            ),
        )
        PageSection.objects.update_or_create(
            page_key='academics', section_key='stats',
            defaults=dict(
                content_type='stats',
                title='',
                subtitle='',
                display_order=3,
                is_active=True,
                data=[
                    dict(value='24', label='Degree Programs'),
                    dict(value='7', label='Faculties'),
                    dict(value='25', label='Departments'),
                    dict(value='2,148', label='Students'),
                ],
            ),
        )

        from academics.models import HomeStats
        HomeStats.objects.update_or_create(
            id=1,
            defaults=dict(students=2148, faculty=6, research_papers=120, partners=6),
        )
