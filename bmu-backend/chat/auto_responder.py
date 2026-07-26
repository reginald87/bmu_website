import re
from typing import Optional
from django.db import models
from academics.models import College, Program, FacultyUnit, Department
from careers.models import JobPosting
from research.models import ResearchProject, Publication
from admissions.models import AdmissionRequirement, ImportantDate


def get_active_colleges():
    """Get list of active colleges from database"""
    return College.objects.filter(is_active=True).order_by('name')


def get_active_programs():
    """Get list of active programs from database"""
    return Program.objects.filter(is_active=True).order_by('display_order', 'title')


def get_program_by_name(name: str):
    """Search for programs by name"""
    return Program.objects.filter(
        is_active=True,
        title__icontains=name
    ).first()


def get_open_job_postings():
    """Get list of open job postings"""
    from django.utils import timezone
    return JobPosting.objects.filter(
        status='published',
        application_deadline__gte=timezone.now().date()
    ).order_by('-posted_date')[:5]


def get_recent_research_projects():
    """Get recent research projects"""
    return ResearchProject.objects.filter(
        status='ongoing'
    ).order_by('-start_date')[:5]


def get_recent_publications():
    """Get recent publications"""
    return Publication.objects.filter(
        is_featured=True
    ).order_by('-year', '-citations')[:5]


def get_db_response(message: str) -> Optional[str]:
    """Look up a response from the ChatAutoResponse table first."""
    from .models import ChatAutoResponse
    text = message.lower().strip()
    if not text:
        return None

    auto_responses = ChatAutoResponse.objects.filter(is_active=True)
    for ar in auto_responses:
        keywords = [kw.strip().lower() for kw in ar.trigger_keywords.split(',') if kw.strip()]
        if any(kw in text for kw in keywords):
            # Optional regex pattern
            if ar.question_pattern:
                import re
                try:
                    if re.search(ar.question_pattern, text):
                        ChatAutoResponse.objects.filter(pk=ar.pk).update(use_count=ar.use_count + 1)
                        return ar.response_text
                except re.error:
                    pass
            else:
                ChatAutoResponse.objects.filter(pk=ar.pk).update(use_count=ar.use_count + 1)
                return ar.response_text

    return None


def get_bot_response(message: str) -> Optional[str]:
    # Try DB-based responses first
    db_reply = get_db_response(message)
    if db_reply:
        return db_reply

    text = message.lower().strip()

    # Greetings
    greetings = r'\b(hi|hello|hey|good morning|good afternoon|good evening|greetings|howdy)\b'
    if re.search(greetings, text):
        return ("Hello! Welcome to Bayelsa Medical University. "
                "I'm here to help you with information about our programs, admissions, "
                "research opportunities, campus life, and more. What would you like to know?")

    # Thanks
    if re.search(r'\b(thanks|thank you|appreciate)\b', text):
        return "You're welcome! Is there anything else I can help you with?"

    # Goodbye
    if re.search(r'\b(bye|goodbye|see you|farewell)\b', text):
        return ("Goodbye! Thank you for chatting with Bayelsa Medical University. "
                "If you have more questions, feel free to reach out anytime. Have a great day!")

    # MBBS Program - Try to fetch from database first
    if re.search(r'\b(mbbs|medicine|doctor|medical doctor)\b', text):
        program = get_program_by_name('mbbs')
        if program:
            return (f"Our {program.title} program is a {program.duration} {program.level} degree. "
                    f"{program.description or ''} "
                    f"Entry requirements: {program.requirements or 'Contact admissions for details'}. "
                    f"Visit our College of Medicine page for detailed curriculum.")
        return ("Our MBBS (Bachelor of Medicine, Bachelor of Surgery) program is a 6-year undergraduate degree "
                "that prepares students for medical practice. The program includes pre-clinical and clinical phases, "
                "with rotations in teaching hospitals. Entry requirements include 5 O'Level credits (including English, "
                "Mathematics, Biology, Chemistry, and Physics), a good JAMB/UTME score, and passing the Post-UTME. "
                "Visit our College of Medicine page for detailed curriculum and admission requirements.")

    # Nursing Program - Try to fetch from database first
    if re.search(r'\b(nursing|nurse|b.nsc)\b', text):
        program = get_program_by_name('nursing')
        if program:
            return (f"Our {program.title} program is a {program.duration} {program.level} degree. "
                    f"{program.description or ''} "
                    f"Entry requirements: {program.requirements or 'Contact admissions for details'}. "
                    f"Graduates are eligible to register with the Nursing and Midwifery Council of Nigeria.")
        return ("Our Bachelor of Nursing Science (B.NSc) program is a 5-year degree that combines theoretical knowledge "
                "with extensive clinical practice. Students gain experience in various healthcare settings including "
                "our teaching hospitals. Requirements include 5 O'Level credits in science subjects, JAMB/UTME score, "
                "and Post-UTME. Graduates are eligible to register with the Nursing and Midwifery Council of Nigeria.")

    # Medical Laboratory Science
    if re.search(r'\b(medical lab|laboratory|bmls|mls)\b', text):
        return ("The Bachelor of Medical Laboratory Science (BMLS) is a 5-year program training students in diagnostic "
                "laboratory techniques. Students learn hematology, microbiology, clinical chemistry, histopathology, "
                "and more. The program includes intensive practical training in modern laboratories. "
                "Graduates can work in hospitals, research institutes, and diagnostic centers.")

    # Physiology
    if re.search(r'\b(physiology)\b', text):
        return ("Our Physiology program explores how the human body functions. Students study organ systems, "
                "cellular processes, and physiological mechanisms. This 4-year program prepares students for careers "
                "in research, teaching, and healthcare. It's also excellent preparation for postgraduate studies "
                "in medicine or biomedical research.")

    # Anatomy
    if re.search(r'\b(anatomy)\b', text):
        return ("The Anatomy program provides in-depth study of human body structure through dissection and imaging. "
                "This 4-year degree covers gross anatomy, histology, embryology, and neuroanatomy. "
                "Graduates can pursue careers in teaching, research, or as anatomical technologists in medical schools.")

    # Colleges - Fetch from database
    if re.search(r'\b(college|college of)\b', text):
        colleges = get_active_colleges()
        if colleges.exists():
            college_list = ", ".join([college.name for college in colleges[:5]])
            return (f"Bayelsa Medical University comprises the following colleges: {college_list}. "
                    f"Each college offers specialized programs led by experienced faculty. "
                    f"Visit our Academics page to explore all colleges and their respective programs.")
        return ("Bayelsa Medical University comprises several colleges offering specialized programs. "
                "Visit our Academics page to explore all colleges and their respective programs.")

    # List all programs - Fetch from database
    if re.search(r'\b(list program|what program|all program|available program|program offer)\b', text):
        programs = get_active_programs()
        if programs.exists():
            program_list = "\n".join([f"• {prog.title} ({prog.level}) - {prog.duration}" for prog in programs[:8]])
            return (f"Bayelsa Medical University offers the following programs:\n{program_list}\n\n"
                    f"Visit our Academics page for complete program details and admission requirements.")
        return ("Bayelsa Medical University offers various undergraduate and postgraduate programs. "
                "Visit our Academics page for complete program details and admission requirements.")

    # Admissions General
    if re.search(r'\b(admission|apply|application|enroll)\b', text):
        requirements = AdmissionRequirement.objects.filter(is_active=True, category='undergraduate')
        dates = ImportantDate.objects.filter(is_active=True, status__in=['upcoming', 'open']).order_by('date')[:3]

        parts = [
            "To apply to Bayelsa Medical University:",
            "1) Obtain JAMB form and select BMU as your choice.",
            "2) Register for Post-UTME on our website.",
            "3) Upload required documents (O'Level results, passport, birth certificate).",
            "4) Pay application fee.",
            "5) Attend screening exercise.",
            "Successful candidates will be offered admission."
        ]

        if requirements.exists():
            req = requirements.first()
            if req.items:
                req_list = "\n".join([f"  • {item}" for item in req.items[:6]])
                parts.append(f"\n{req.title}:\n{req_list}")

        if dates:
            date_list = "\n".join([f"  • {d.event} — {d.date.strftime('%d %b %Y')} ({d.get_status_display()})" for d in dates])
            parts.append(f"\nImportant Dates:\n{date_list}")

        parts.append("\nCheck our Admissions portal for current requirements.")
        return "\n".join(parts)

    # Entry Requirements
    if re.search(r'\b(entry require|requirement|jamb|utme|post-utme|cut off|cutoff)\b', text):
        requirements = AdmissionRequirement.objects.filter(is_active=True)
        if requirements.exists():
            lines = ["Entry requirements at Bayelsa Medical University:"]
            for req in requirements[:3]:
                if req.items:
                    item_list = ", ".join(req.items[:5])
                    lines.append(f"• {req.title}: {item_list}")
            lines.append("\nMinimum JAMB score of 200 (varies by program). Must participate in BMU Post-UTME screening.")
            lines.append("Check the program page for specific requirements.")
            return "\n".join(lines)
        return ("General entry requirements: 5 O'Level credits in not more than 2 sittings, including English, "
                "Mathematics, Biology, Chemistry, and Physics. Minimum JAMB score of 200 (varies by program). "
                "Must participate in BMU Post-UTME screening. Direct entry requires A'Level results, OND/HND, "
                "or first degree with minimum GPA. Specific requirements vary by program - check the program page.")

    # Documents Required
    if re.search(r'\b(document|certificate|transcript|waec|neco|birth certificate)\b', text):
        return ("Required documents for admission: O'Level result (WAEC/NECO), Birth Certificate, "
                "Certificate of Origin, Passport Photograph, JAMB Result Slip, and Post-UTME registration slip. "
                "Direct entry candidates also need A'Level results or previous degree certificates. "
                "All documents must be uploaded to the application portal.")

    # Tuition and Fees
    if re.search(r'\b(fee|school fee|tuition|payment|acceptance fee)\b', text):
        return ("Tuition fees vary by program and student category (local/international). Fees include tuition, "
                "acceptance fee, hostel accommodation (optional), and other charges. Payment is made through the "
                "student portal via Paystack or bank deposit. Fee schedules are published on our website. "
                "Scholarships are available for deserving students - check the Scholarships page.")

    # Scholarships
    if re.search(r'\b(scholarship|financial aid|bursary|grant)\b', text):
        return ("BMU offers various scholarship opportunities including merit-based scholarships, "
                "need-based financial aid, and special scholarships for indigene students. "
                "Scholarship applications are typically open at the beginning of each academic year. "
                "Contact the Bursary Department or Student Affairs for current scholarship opportunities.")

    # Hostel/Accommodation
    if re.search(r'\b(hostel|accommodation|housing|lodge|dorm|stay|live)\b', text):
        return ("On-campus accommodation is available in our hostels with modern amenities including study areas, "
                "recreational facilities, and 24/7 security. Rooms are allocated on first-come, first-served basis. "
                "Hostel fees are paid annually. Off-campus accommodation is also available in Yenagoa. "
                "Contact Student Affairs for hostel allocation procedures.")

    # Campus Location
    if re.search(r'\b(location|address|where|campus|situated)\b', text):
        return ("Bayelsa Medical University is located in Yenagoa, Bayelsa State, Nigeria. "
                "Our main campus houses lecture halls, laboratories, administrative buildings, and student facilities. "
                "We also have teaching hospitals for clinical training. The campus is easily accessible from "
                "major parts of the city. Visit our Contact page for detailed directions and map.")

    # Contact Information
    if re.search(r'\b(contact|phone|email|call|reach)\b', text):
        return ("Contact BMU: Email: info@bmu.edu.ng | Phone: Check our website for current numbers "
                "| Address: Yenagoa, Bayelsa State, Nigeria. For admissions: admissions@bmu.edu.ng. "
                "For specific departments, visit our Contact page for direct lines. "
                "You can also visit our campus in person during working hours (Monday-Friday, 8am-4pm).")

    # Library
    if re.search(r'\b(library|book|journal|reading|study material)\b', text):
        return ("The BMU Library offers extensive resources including textbooks, medical journals, "
                "e-books, and digital databases. We have dedicated sections for each college and program. "
                "Library services include borrowing, reference assistance, and access to online databases. "
                "Opening hours: Monday-Friday 8am-8pm, Saturday 9am-4pm. Bring your student ID for access.")

    # Research - Fetch from database
    if re.search(r'\b(research|project|publication|thesis|dissertation)\b', text):
        projects = get_recent_research_projects()
        if projects:
            project_list = "\n".join([f"• {project.title}" for project in projects[:3]])
            return (f"BMU is actively involved in medical and health research. Recent projects include:\n{project_list}\n\n"
                    f"Our Research and Development centers conduct studies in tropical medicine, public health, "
                    f"and clinical research. Faculty and students participate in research projects and publish "
                    f"in peer-reviewed journals. Contact the Research Office for opportunities.")
        return ("BMU is actively involved in medical and health research. Our Research and Development centers "
                "conduct studies in various areas including tropical medicine, public health, and clinical research. "
                "Faculty and students participate in research projects and publish in peer-reviewed journals. "
                "Contact the Research Office for opportunities.")

    # Career/Jobs - Fetch from database
    if re.search(r'\b(job|career|employment|work|vacancy|recruitment)\b', text):
        jobs = get_open_job_postings()
        if jobs:
            job_list = "\n".join([f"• {job.title} - {job.department}" for job in jobs[:3]])
            return (f"BMU currently has the following open positions:\n{job_list}\n\n"
                    f"Visit our Careers page for full details and to apply. "
                    f"We also offer internship opportunities for students and graduates.")
        return ("BMU offers career opportunities for academic and non-academic staff. "
                "Job openings are posted on our Careers page. Academic positions require relevant qualifications. "
                "To apply, submit your application through the Careers portal. "
                "We also offer internship opportunities for students and graduates.")

    # Student Life
    if re.search(r'\b(student life|campus life|activity|club|association)\b', text):
        return ("Student life at BMU is vibrant with various activities including academic clubs, "
                "professional associations (e.g., Medical Students Association), sports, and cultural events. "
                "We have sports facilities for football, basketball, volleyball, and athletics. "
                "Student organizations provide leadership opportunities and professional development. "
                "The Student Affairs Office coordinates student activities and welfare.")

    # Sports
    if re.search(r'\b(sport|game|athletic|football|basketball|volleyball)\b', text):
        return ("BMU has excellent sports facilities including a football pitch, basketball court, "
                "volleyball court, and track for athletics. We participate in inter-university competitions "
                "and host annual sports festivals. Sports are encouraged for physical fitness and team building. "
                "Join a sports team or participate in recreational activities at our sports complex.")

    # Leadership/VC
    if re.search(r'\b(vc|vice chancellor|leadership|management|who leads|who is in charge)\b', text):
        return ("Bayelsa Medical University is led by a Vice Chancellor supported by Deputy Vice Chancellors "
                "(Academic and Administration), Registrar, Bursar, and University Librarian. "
                "Each college has a Provost, and each department has a Head of Department. "
                "Visit our Leadership page to see current university leadership and their profiles.")

    # Academic Calendar
    if re.search(r'\b(calendar|session|semester|term|date|resumption)\b', text):
        return ("The academic year runs from September to August, divided into two semesters. "
                "First Semester: September - February, Second Semester: March - August. "
                "Examinations are held at the end of each semester. The academic calendar includes "
                "registration periods, lecture weeks, exam schedules, and holidays. "
                "Download the current academic calendar from our website for specific dates.")

    # Results/Transcript
    if re.search(r'\b(result|transcript|grade|score|cgpa)\b', text):
        return ("Students can access their results through the Student Portal. Semester results are "
                "published after examinations. CGPA is calculated based on course grades and credit units. "
                "For official transcripts, apply through the Registry or Student Affairs. "
                "Transcript requests are processed within 2-3 weeks. Contact the Exam and Records Office "
                "for result-related inquiries.")

    # Medical Services
    if re.search(r'\b(clinic|hospital|medical center|health service|sick bay)\b', text):
        return ("BMU has a medical center on campus providing primary healthcare services to students and staff. "
                "Services include general consultations, first aid, health education, and referrals. "
                "For specialized care, we partner with teaching hospitals. "
                "Health insurance is recommended for comprehensive coverage. "
                "The medical center is staffed by qualified medical professionals.")

    # ICT/Computer
    if re.search(r'\b(ict|computer|wifi|internet|email)\b', text):
        return ("BMU provides ICT facilities including computer labs with internet access, campus-wide WiFi, "
                "and student email accounts. The ICT Center supports students with technical issues. "
                "Students receive official BMU email addresses upon registration. "
                "Computer labs are available for research and assignments. "
                "Contact the ICT Unit for connectivity and technical support.")

    # Transport
    if re.search(r'\b(transport|bus|shuttle|movement)\b', text):
        return ("BMU provides shuttle bus services within the campus and to key locations in Yenagoa. "
                "Transport schedules are posted at bus stops. Students can also use public transport "
                "or private vehicles. Parking is available for students with vehicles. "
                "Transport fees are subsidized. Contact Student Affairs for current shuttle routes and schedules.")

    # Security
    if re.search(r'\b(security|safety|guard)\b', text):
        return ("Campus security is a priority at BMU. We have 24/7 security personnel, CCTV surveillance, "
                "and controlled access points. Students and staff must carry valid ID cards. "
                "Report any security concerns to the Security Office immediately. "
                "Emergency contact numbers are displayed across campus. "
                "We maintain a safe and secure learning environment.")

    # Alumni
    if re.search(r'\b(alumni|graduate|old student)\b', text):
        return ("The BMU Alumni Association connects graduates worldwide. Alumni benefits include networking "
                "opportunities, career services, library access, and invitations to university events. "
                "Register on the Alumni Portal to stay connected. Alumni can also mentor current students "
                "and contribute to university development. We celebrate our alumni achievements!")

    # International Students
    if re.search(r'\b(international|foreign|abroad|from outside nigeria)\b', text):
        return ("BMU welcomes international students! International applicants must provide: "
                "equivalent O'Level results, passport, visa, and proof of English proficiency. "
                "International student fees apply. We provide support with visa processing, accommodation, "
                "and orientation. Contact the International Students Office for guidance. "
                "Join our diverse community of learners from around the world.")

    # Direct Entry
    if re.search(r'\b(direct entry|de|transfer)\b', text):
        return ("Direct Entry admission is available for candidates with A'Level results (IJMB, JUPEB), "
                "OND/HND (minimum upper credit), or first degree (minimum second class lower). "
                "Direct entry candidates start from 200 level or 300 level depending on qualification. "
                "Apply through JAMB Direct Entry and participate in BMU screening. "
                "Check the Admissions page for specific Direct Entry requirements by program.")

    # Pre-degree
    if re.search(r'\b(pre-degree|premed|foundation|remedial)\b', text):
        return ("BMU offers pre-degree and foundation programs to prepare students for university education. "
                "These programs are designed for candidates who need additional preparation or don't meet "
                "direct entry requirements. Successful completion guarantees admission into degree programs. "
                "Duration is typically 1 year. Contact the Admissions Office for pre-degree program details.")

    # Postgraduate
    if re.search(r'\b(postgraduate|masters|phd|post grad)\b', text):
        return ("BMU offers postgraduate programs including Masters and PhD degrees in various medical and "
                "health disciplines. Requirements include a relevant first degree with minimum GPA, "
                "NYSC certificate (for Nigerian graduates), and entrance examination. "
                "Postgraduate studies involve coursework, research, and thesis/dissertation. "
                "Visit the Postgraduate School page for available programs and admission requirements.")

    # Accreditation
    if re.search(r'\b(accredited|accreditation|nuc|mnc)\b', text):
        return ("All BMU programs are fully accredited by the National Universities Commission (NUC). "
                "Professional programs like MBBS, Nursing, and Medical Laboratory Science also have "
                "accreditation from respective professional bodies (MDCN, NMCN, MLSCN). "
                "Our accreditation status is regularly reviewed and maintained. "
                "Graduates are eligible for professional registration and practice in Nigeria and abroad.")

    # Teaching Hospital
    if re.search(r'\b(teaching hospital|clinical|rotation|practical)\b', text):
        return ("BMU has affiliated teaching hospitals where students gain clinical experience. "
                "Clinical rotations are integral to medical and health programs. Students rotate through "
                "various departments including medicine, surgery, pediatrics, obstetrics, and more. "
                "Clinical training is supervised by experienced consultants and medical officers. "
                "This hands-on experience prepares students for professional practice.")

    # Default fallback
    return ("Thank you for your message. While I'm a virtual assistant, I'd be happy to help with general inquiries "
            "about Bayelsa Medical University including programs, admissions, campus facilities, and student services. "
            "For specific or complex matters, our human agents are available to provide detailed assistance. "
            "Is there something specific about our university I can help you with?")
