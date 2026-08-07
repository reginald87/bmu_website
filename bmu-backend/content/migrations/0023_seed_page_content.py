"""Seed PageSection, PortalDefinition, CentrePage, ArchivedContent, InstitutePage with all hardcoded data."""
from django.db import migrations


def seed_page_sections(apps, schema_editor):
    PS = apps.get_model('content', 'PageSection')

    sections = [
        # ============================================================
        # HOME PAGE
        # ============================================================
        ('home', 'featured_story_highlights', 'stats', 'Our Mission', 'Driving healthcare excellence through education, research, and community service.', [
            {'stat': '15,000+', 'label': 'Students Enrolled', 'icon': 'GraduationCap'},
            {'stat': '500+', 'label': 'Research Publications', 'icon': 'Microscope'},
            {'stat': '98%', 'label': 'Graduate Employment Rate', 'icon': 'Heart'},
        ], 1),
        ('home', 'cta_stats', 'stats', '', '', [
            {'key': 'undergraduate_programs', 'value': 20, 'label': 'Undergraduate Programs'},
            {'key': 'postgraduate_programs', 'value': 15, 'label': 'Postgraduate Programs'},
            {'key': 'research_centers', 'value': 8, 'label': 'Research Centers'},
            {'key': 'international_partners', 'value': 28, 'label': 'International Partners'},
        ], 2),
        ('home', 'quick_links', 'cards', 'Discover Excellence', 'Discover excellence in medical education and healthcare innovation', [
            {'to': '/academics', 'image': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80', 'titleKey': 'home.quickLinks.academics_title', 'descKey': 'home.quickLinks.academics_desc'},
            {'to': '/academics/colleges', 'image': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80', 'titleKey': 'home.quickLinks.colleges_title', 'descKey': 'home.quickLinks.colleges_desc'},
            {'to': '/research', 'image': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80', 'titleKey': 'home.quickLinks.research_title', 'descKey': 'home.quickLinks.research_desc'},
        ], 3),
        ('home', 'sdgs', 'custom', 'Sustainable Development Goals', '', [
            {'number': 3, 'titleKey': 'home.sdg.goodHealth', 'color': '#4c9f38'},
            {'number': 4, 'titleKey': 'home.sdg.qualityEducation', 'color': '#c5192d'},
            {'number': 5, 'titleKey': 'home.sdg.genderEquality', 'color': '#ff3a21'},
            {'number': 17, 'titleKey': 'home.sdg.partnerships', 'color': '#19486a'},
        ], 4),
        ('home', 'alumni_notable', 'custom', '', '', [
            {'name': 'Dr. Sarah Okonkwo', 'graduationYear': 2020, 'program': 'MBBS', 'achievement': 'Young Physician Award 2024', 'currentRole': 'Resident Surgeon', 'organization': 'Lagos University Teaching Hospital', 'image': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80'},
            {'name': 'Dr. Michael Ebi', 'graduationYear': 2019, 'program': 'MPH', 'achievement': 'WHO Fellowship Recipient', 'currentRole': 'Epidemiologist', 'organization': 'World Health Organization', 'image': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80'},
            {'name': 'Nurse Adaeze Douglas', 'graduationYear': 2021, 'program': 'B.NSc', 'achievement': 'Excellence in Patient Care', 'currentRole': 'Head Nurse', 'organization': 'National Hospital Abuja', 'image': 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=300&q=80'},
        ], 5),
        ('home', 'alumni_stat', 'stats', '', '', [
            {'value': '2,500+', 'label': 'Active Alumni Network'},
        ], 6),

        # ============================================================
        # ACADEMICS OVERVIEW
        # ============================================================
        ('academics', 'academic_units', 'cards', 'Academic Units', '', [
            {'name': 'College of Medicine', 'programs': 'MBBS, B.Sc Anatomy, B.Sc Physiology', 'link': '/academics/colleges', 'color': '#1E1E1E', 'icon': 'Stethoscope'},
            {'name': 'College of Nursing Sciences', 'programs': 'B.NSc Nursing, Post-Basic Nursing', 'link': '/academics/colleges', 'color': '#A51C30', 'icon': 'HeartPulse'},
            {'name': 'College of Allied Health Sciences', 'programs': 'BMLS Medical Lab, BSc Radiography', 'link': '/academics/colleges', 'color': '#2563EB', 'icon': 'Microscope'},
            {'name': 'College of Sciences', 'programs': 'BSc Biology, BSc Chemistry, BSc Physics', 'link': '/academics/colleges', 'color': '#059669', 'icon': 'FlaskConical'},
        ], 1),
        ('academics', 'quick_links', 'cards', 'Academic Resources', '', [
            {'title': 'Academic Programs', 'desc': 'Browse all degree programs', 'icon': 'GraduationCap', 'link': '/academics/programs'},
            {'title': 'Admissions', 'desc': 'Start your application today', 'icon': 'UserPlus', 'link': '/academics/admissions'},
            {'title': 'Academic Calendar', 'desc': 'Important dates and deadlines', 'icon': 'Calendar', 'link': '/academics/calendar'},
            {'title': 'Library', 'desc': 'Access our digital and physical resources', 'icon': 'BookOpen', 'link': '/academics/library'},
            {'title': 'Faculty Directory', 'desc': 'Meet our expert faculty', 'icon': 'Users', 'link': '/research/faculty'},
            {'title': 'Research', 'desc': 'Explore research opportunities', 'icon': 'FlaskConical', 'link': '/research'},
        ], 2),
        ('academics', 'stats', 'stats', '', '', [
            {'value': '50+', 'label': 'Degree Programs'},
            {'value': '6', 'label': 'Academic Units'},
            {'value': '200+', 'label': 'Faculty Members'},
            {'value': '5000+', 'label': 'Students Enrolled'},
        ], 3),
        ('academics', 'why_study', 'list', 'Why Study at BMU?', '', [
            'Modern teaching hospitals and laboratories',
            'Experienced faculty with clinical expertise',
            'Strong industry partnerships',
            'Research opportunities from year one',
            'Student support and mentorship programs',
        ], 4),

        # ============================================================
        # PROGRAMS PAGE
        # ============================================================
        ('programs', 'stats', 'stats', '', '', [
            {'value': '50+', 'label': 'Degree Programs', 'icon': 'BookOpen'},
            {'value': '6', 'label': 'Academic Units', 'icon': 'GraduationCap'},
            {'value': '15:1', 'label': 'Student-Faculty Ratio', 'icon': 'Award'},
            {'value': '95%', 'label': 'Employment Rate', 'icon': 'ArrowRight'},
        ], 1),

        # ============================================================
        # ADMISSIONS PAGE
        # ============================================================
        ('admissions', 'application_steps', 'steps', 'How to Apply', '', [
            {'step': 1, 'title': 'Create Account', 'description': 'Register on the BMU admission portal with your email address and create a profile.', 'icon': 'Users'},
            {'step': 2, 'title': 'Fill Application', 'description': 'Complete the online application form with your personal and academic details.', 'icon': 'FileText'},
            {'step': 3, 'title': 'Upload Documents', 'description': 'Upload scanned copies of required documents including O-level results and identification.', 'icon': 'CheckCircle'},
            {'step': 4, 'title': 'Pay Fee', 'description': 'Pay the non-refundable application fee through the secure payment gateway.', 'icon': 'CreditCard'},
            {'step': 5, 'title': 'Submit', 'description': 'Review your application thoroughly and submit for processing.', 'icon': 'CheckCircle'},
            {'step': 6, 'title': 'Screening', 'description': 'Attend the post-UTME screening exercise at the designated center.', 'icon': 'Calendar'},
        ], 1),
        ('admissions', 'contact_info', 'contact', 'Need Help?', '', [
            {'title': 'Email', 'details': ['admissions@bmu.edu.ng']},
            {'title': 'Hotline', 'details': ['+234 803 111 0000']},
            {'title': 'Office Hours', 'details': ['Mon-Fri: 8AM - 4PM']},
            {'title': 'Location', 'details': ['Admissions Office, Admin Block']},
        ], 2),

        # ============================================================
        # PUBLICATIONS PAGE
        # ============================================================
        ('publications', 'stats', 'stats', '', '', [
            {'value': '200+', 'label': 'Publications', 'icon': 'FileText'},
            {'value': '1,500+', 'label': 'Total Citations', 'icon': 'Award'},
            {'value': '45', 'label': 'H-Index', 'icon': 'BookOpen'},
            {'value': '50+', 'label': 'Active Researchers', 'icon': 'Users'},
        ], 1),

        # ============================================================
        # COLLABORATIONS PAGE
        # ============================================================
        ('collaborations', 'stats', 'stats', '', '', [
            {'value': '25+', 'label': 'Active Partnerships', 'icon': 'Handshake'},
            {'value': '12', 'label': 'Countries', 'icon': 'Globe'},
            {'value': '50+', 'label': 'Joint Projects', 'icon': 'Microscope'},
            {'value': '100+', 'label': 'Exchange Students', 'icon': 'Plane'},
        ], 1),
        ('collaborations', 'benefits', 'cards', 'Partnership Benefits', '', [
            {'title': 'Research Collaboration', 'desc': 'Access to international research networks and joint grant applications', 'icon': 'Microscope'},
            {'title': 'Student Exchange', 'desc': 'Opportunities for students to study abroad and gain international exposure', 'icon': 'GraduationCap'},
            {'title': 'Faculty Development', 'desc': 'Training programs, sabbaticals, and collaborative teaching', 'icon': 'Users'},
            {'title': 'Resource Sharing', 'desc': 'Access to specialized equipment, databases, and facilities', 'icon': 'Building2'},
        ], 2),
        ('collaborations', 'why_partner', 'list', 'Why Partner with BMU?', '', [
            'Access to the Niger Delta research context',
            'Collaboration with leading African medical university',
            'Student and faculty exchange opportunities',
            'Joint grant applications and funding',
            'Shared research infrastructure',
        ], 3),

        # ============================================================
        # RESEARCH OVERVIEW
        # ============================================================
        ('research', 'highlights', 'cards', '', '', [
            {'title': 'Research Centers', 'description': '6 specialized centers focusing on regional health challenges', 'icon': 'Target', 'link': '/research/centers'},
            {'title': 'Publications', 'description': 'Peer-reviewed research in leading medical journals', 'icon': 'BookOpen', 'link': '/research/publications'},
            {'title': 'Funding', 'description': 'Grants and partnerships supporting innovative research', 'icon': 'Award', 'link': '/research/funding'},
            {'title': 'Collaborations', 'description': 'Global partnerships with leading institutions', 'icon': 'Globe', 'link': '/research/collaborations'},
        ], 1),
        ('research', 'impact_metrics', 'stats', 'Research Impact', '', [
            {'metric': '1,500+', 'label': 'Citations in peer-reviewed journals', 'color': '#1E1E1E'},
            {'metric': '45', 'label': 'H-Index score', 'color': '#A51C30'},
            {'metric': '25', 'label': 'International research partners', 'color': '#A51C30'},
        ], 2),
        ('research', 'opportunities', 'list', 'Research Opportunities', '', [
            'Postgraduate research programs',
            'Research assistant positions',
            'Collaborative research projects',
            'Visiting researcher program',
            'Industry research partnerships',
        ], 3),

        # ============================================================
        # RESEARCH FUNDING PAGE
        # ============================================================
        ('research/funding', 'how_to_apply', 'steps', 'How to Apply', '', [
            {'step': 1, 'title': 'Review Guidelines', 'description': 'Read the funding call and eligibility criteria carefully'},
            {'step': 2, 'title': 'Prepare Proposal', 'description': 'Develop your research proposal following the provided template'},
            {'step': 3, 'title': 'Submit Application', 'description': 'Submit through the online portal before the deadline'},
            {'step': 4, 'title': 'Review Process', 'description': 'Applications reviewed by expert panels, results within 6 weeks'},
        ], 1),
        ('research/funding', 'research_support', 'cards', 'Research Support', 'We provide comprehensive support for researchers seeking funding', [
            {'title': 'Grant Writing Workshops', 'description': 'Regular workshops to help researchers develop competitive proposals'},
            {'title': 'Funding Database Access', 'description': 'Access to comprehensive databases of national and international funding opportunities'},
            {'title': 'Collaboration Matching', 'description': 'Connecting researchers with potential collaborators for multi-disciplinary projects'},
        ], 2),
        ('research/funding', 'contact', 'contact', 'Contact Research Office', '', [
            {'title': 'Email', 'details': ['research@bmu.edu.ng']},
            {'title': 'Office Hours', 'details': ['Mon-Fri: 8:00 AM - 4:00 PM']},
        ], 3),

        # ============================================================
        # CONTACT PAGE
        # ============================================================
        ('contact', 'contact_info', 'contact', '', '', [
            {'title': 'Main Campus', 'details': ['Permanent Site,', 'Yenagoa-Amasoma Road,', 'Yenagoa, Bayelsa State, Nigeria']},
            {'title': 'Phone', 'details': ['+234 803 123 4567', '+234 805 987 6543']},
            {'title': 'Email', 'details': ['info@bmu.edu.ng', 'admissions@bmu.edu.ng']},
            {'title': 'Office Hours', 'details': ['Monday - Friday', '8:00 AM - 5:00 PM WAT']},
        ], 1),
        ('contact', 'department_contacts', 'custom', 'Department Contacts', '', [
            {'name': 'Admissions Office', 'email': 'admissions@bmu.edu.ng', 'phone': '+234 803 123 4567'},
            {'name': 'Student Affairs', 'email': 'studentaffairs@bmu.edu.ng', 'phone': '+234 803 123 4568'},
            {'name': 'Research & Innovation', 'email': 'research@bmu.edu.ng', 'phone': '+234 803 123 4569'},
            {'name': 'International Relations', 'email': 'international@bmu.edu.ng', 'phone': '+234 803 123 4570'},
            {'name': 'Human Resources', 'email': 'hr@bmu.edu.ng', 'phone': '+234 803 123 4571'},
            {'name': 'Public Relations', 'email': 'pro@bmu.edu.ng', 'phone': '+234 803 123 4572'},
            {'name': 'Webmaster', 'email': 'webmaster@bmu.edu.ng', 'phone': '+234 803 123 4573'},
        ], 2),
        ('contact', 'map_coords', 'custom', '', '', [
            {'lat': 4.9279, 'lng': 6.2673},
        ], 3),

        # ============================================================
        # INTERNATIONAL PAGE
        # ============================================================
        ('international', 'quick_links', 'cards', 'International Opportunities', '', [
            {'title': 'Global Partnerships', 'description': 'Collaborate with leading institutions worldwide', 'icon': 'Handshake', 'link': '/international/partnerships', 'color': '#1E1E1E', 'stat': '45+ Partners'},
            {'title': 'International Students', 'description': 'Join our diverse community of students', 'icon': 'Globe', 'link': '/international/students', 'color': '#A51C30', 'stat': '500+ Students'},
            {'title': 'Exchange Programs', 'description': 'Study abroad opportunities', 'icon': 'Plane', 'link': '/international/exchange', 'color': '#2563EB', 'stat': '120+ Exchanges/Year'},
            {'title': 'Visitors & Delegations', 'description': 'Partner with BMU', 'icon': 'Users', 'link': '/international/visitors', 'color': '#059669', 'stat': '100+ Visits/Year'},
        ], 1),
        ('international', 'partner_countries', 'list', 'Partner Countries', 'Our partnerships span across 25+ countries on 5 continents', [
            'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
            'Netherlands', 'South Africa', 'Ghana', 'Kenya', 'India',
            'China', 'Japan', 'Australia', 'Brazil', 'Egypt',
        ], 2),
        ('international', 'stats', 'stats', '', '', [
            {'value': '45+', 'label': 'Partner Institutions', 'icon': 'Building'},
            {'value': '25+', 'label': 'Countries', 'icon': 'Globe'},
            {'value': '500+', 'label': 'International Students', 'icon': 'Users'},
            {'value': '120+', 'label': 'Exchange Students/Year', 'icon': 'Plane'},
        ], 3),

        # ============================================================
        # VISITORS PAGE
        # ============================================================
        ('visitors', 'visitor_types', 'cards', '', '', [
            {'title': 'Academic Delegations', 'description': 'University partnerships, research collaborations, and academic exchanges', 'duration': '1-3 days', 'icon': 'Building'},
            {'title': 'Research Collaborators', 'description': 'Joint research projects, data collection, and field studies', 'duration': '1-4 weeks', 'icon': 'Microscope'},
            {'title': 'Dignitaries & Officials', 'description': 'Government officials, funding agency representatives, and policy makers', 'duration': '1-2 days', 'icon': 'Crown'},
            {'title': 'Visiting Scholars', 'description': 'Guest lecturers, sabbatical researchers, and academic visitors', 'duration': '1-6 months', 'icon': 'BookOpen'},
        ], 1),
        ('visitors', 'services', 'list', 'Services We Provide', '', [
            'Itinerary planning and logistics coordination',
            'Accommodation arrangements',
            'Campus tour and facility visits',
            'Meeting scheduling with relevant departments',
            'Cultural program arrangements',
            'Local transportation support',
            'Protocol and security arrangements',
            'Souvenir and documentation packages',
        ], 2),
        ('visitors', 'recent_visits', 'custom', 'Recent Visits', '', [
            {'institution': 'Johns Hopkins Bloomberg School', 'country': 'USA', 'date': 'November 2024', 'purpose': 'Research Collaboration Discussion'},
            {'institution': 'University of Oxford', 'country': 'UK', 'date': 'October 2024', 'purpose': 'Student Exchange Agreement'},
            {'institution': 'WHO Regional Office', 'country': 'Nigeria', 'date': 'September 2024', 'purpose': 'Public Health Partnership'},
            {'institution': 'University of Cape Town', 'country': 'South Africa', 'date': 'August 2024', 'purpose': 'Faculty Development Program'},
        ], 3),
        ('visitors', 'stats', 'stats', '', '', [
            {'value': '100+', 'label': 'Visits Per Year'},
            {'value': '25+', 'label': 'Countries'},
            {'value': '45', 'label': 'Partner Institutions'},
            {'value': '30+', 'label': 'Visiting Scholars'},
        ], 4),
        ('visitors', 'contact', 'contact', 'Protocol Office', '', [
            {'title': 'Phone', 'details': ['+234 803 111 0020']},
            {'title': 'Email', 'details': ['protocol@bmu.edu.ng']},
            {'title': 'Location', 'details': ["Vice Chancellor's Office, BMU"]},
        ], 5),

        # ============================================================
        # IMPACT PAGE
        # ============================================================
        ('impact', 'impact_areas', 'cards', 'Impact Areas', '', [
            {'title': 'SDG Alignment', 'description': 'Contributing to UN Sustainable Development Goals through education and research', 'icon': 'Globe', 'link': '/impact/sdg-dashboard', 'color': '#1E1E1E', 'stat': '12/17 SDGs'},
            {'title': 'Community Health', 'description': 'Medical outreach programs serving underserved communities in the Niger Delta', 'icon': 'Heart', 'link': '/impact/community', 'color': '#A51C30', 'stat': '50,000+ Served'},
            {'title': 'Environmental Sustainability', 'description': 'Research and programs addressing environmental health challenges', 'icon': 'Leaf', 'link': '/impact/sustainability', 'color': '#059669', 'stat': '20+ Programs'},
        ], 1),
        ('impact', 'stats', 'stats', '', '', [
            {'value': '50,000+', 'label': 'Community Members Served', 'icon': 'Users'},
            {'value': '200+', 'label': 'Health Outreach Programs', 'icon': 'Heart'},
            {'value': '15,000+', 'label': 'Students Educated', 'icon': 'GraduationCap'},
            {'value': '12/17', 'label': 'UN SDGs Addressed', 'icon': 'Globe'},
        ], 2),
        ('impact', 'highlights', 'custom', 'Impact Highlights', '', [
            {'title': 'Free Medical Outreach', 'description': 'Annual medical outreach providing free healthcare to rural communities', 'impact': '12,000 patients treated annually'},
            {'title': 'Clean Water Initiative', 'description': 'Installing water purification systems in underserved communities', 'impact': '50 communities served'},
            {'title': 'Health Education Program', 'description': 'Community health awareness and disease prevention education', 'impact': '25,000 people reached'},
            {'title': 'Maternal Health Project', 'description': 'Reducing maternal mortality through trained midwives and equipment', 'impact': '40% mortality reduction'},
        ], 3),

        # ============================================================
        # APPLY PAGE
        # ============================================================
        ('apply', 'application_steps', 'steps', 'How to Apply', '', [
            {'step': 1, 'title': 'Choose Program', 'description': 'Select from undergraduate, postgraduate, or certificate programs', 'icon': 'GraduationCap'},
            {'step': 2, 'title': 'Check Requirements', 'description': 'Review admission requirements for your chosen program', 'icon': 'ClipboardCheck'},
            {'step': 3, 'title': 'Complete Application', 'description': 'Fill out the online application form with required details', 'icon': 'FileText'},
            {'step': 4, 'title': 'Submit & Pay', 'description': 'Submit your application and pay the application fee', 'icon': 'CreditCard'},
            {'step': 5, 'title': 'Track Status', 'description': 'Monitor your application status through the portal', 'icon': 'Search'},
        ], 1),
        ('apply', 'deadlines', 'custom', 'Application Deadlines', '', [
            {'program': 'Undergraduate (Fall 2025)', 'deadline': 'June 30, 2025', 'status': 'Open'},
            {'program': 'Postgraduate (Fall 2025)', 'deadline': 'July 31, 2025', 'status': 'Open'},
            {'program': 'Certificate Programs', 'deadline': 'Rolling Admission', 'status': 'Open'},
            {'program': 'International Students', 'deadline': 'May 31, 2025', 'status': 'Closing Soon'},
        ], 2),
        ('apply', 'requirements', 'list', 'General Requirements', '', [
            'Completed secondary education (or equivalent) for undergraduate',
            "Bachelor's degree for postgraduate programs",
            'Minimum GPA requirements vary by program',
            'English proficiency for international students',
            'Valid identification documents',
            'Application fee payment',
        ], 3),
        ('apply', 'stats', 'stats', '', '', [
            {'value': '4-6', 'label': 'Weeks Processing', 'icon': 'Clock'},
            {'value': '₦10,000', 'label': 'Local App Fee', 'icon': 'Banknote'},
            {'value': '$50', 'label': 'Intl App Fee', 'icon': 'DollarSign'},
            {'value': '85%', 'label': 'Acceptance Rate', 'icon': 'CheckCircle'},
        ], 4),

        # ============================================================
        # CAREER CENTRE
        # ============================================================
        ('centres/career', 'services', 'cards', 'Our Services', '', [
            {'title': 'Career Counseling', 'desc': 'One-on-one guidance for career planning and development'},
            {'title': 'CV & Resume Reviews', 'desc': 'Professional review and optimization of your career documents'},
            {'title': 'Interview Preparation', 'desc': 'Mock interviews and feedback to improve your performance'},
            {'title': 'Job Placement', 'desc': 'Connecting graduates with employment opportunities'},
            {'title': 'Skills Workshops', 'desc': 'Professional development workshops and seminars'},
            {'title': 'Networking Events', 'desc': 'Industry networking sessions and career fairs'},
        ], 1),
        ('centres/career', 'stats', 'stats', '', '', [
            {'value': '85%', 'label': 'Employment Rate'},
            {'value': '200+', 'label': 'Partner Employers'},
            {'value': '1,500', 'label': 'Alumni Network'},
            {'value': '50+', 'label': 'Annual Workshops'},
        ], 2),
        ('centres/career', 'contact', 'contact', 'Contact Us', '', [
            {'title': 'Email', 'details': ['career@bmu.edu.ng']},
            {'title': 'Phone', 'details': ['+234 xxx xxx xxxx']},
            {'title': 'Location', 'details': ['Student Affairs Building']},
        ], 3),
        ('centres/career', 'office_hours', 'custom', 'Office Hours', '', [
            {'days': 'Monday - Friday', 'hours': '9:00 AM - 5:00 PM', 'note': 'Walk-ins welcome'},
        ], 4),
        ('centres/career', 'upcoming_events', 'list', 'Upcoming Events', '', [
            'Career Fair 2025 - March 15',
            'CV Writing Workshop - Feb 20',
            'Interview Skills - March 5',
        ], 5),

        # ============================================================
        # CPD CENTRE
        # ============================================================
        ('centres/cpd', 'programs', 'custom', 'Programs', '', [
            {'category': 'Clinical Skills', 'courses': ['Advanced Life Support (ALS)', 'Basic Life Support (BLS)', 'Emergency Medicine Updates', 'Surgical Skills Workshop']},
            {'category': 'Nursing & Midwifery', 'courses': ['Neonatal Care Excellence', 'Midwifery Emergency Skills', 'Infection Control & Prevention', 'Patient Safety & Quality Care']},
            {'category': 'Public Health', 'courses': ['Epidemiology & Disease Surveillance', 'Health Promotion Strategies', 'Community Health Programs', 'Global Health Challenges']},
            {'category': 'Healthcare Management', 'courses': ['Hospital Administration', 'Healthcare Quality Management', 'Medical Ethics & Law', 'Leadership in Healthcare']},
        ], 1),
        ('centres/cpd', 'certifications', 'list', 'Certification & Accreditation', '', [
            'MDCN Accredited',
            'NMCN Approved',
            'CME Credits',
        ], 2),
        ('centres/cpd', 'contact', 'contact', 'Contact CPD Centre', '', [
            {'title': 'Email', 'details': ['cpd@bmu.edu.ng']},
            {'title': 'Phone', 'details': ['+234 xxx xxx xxxx']},
            {'title': 'Location', 'details': ['Sampou Campus']},
        ], 3),
        ('centres/cpd', 'why_choose', 'list', 'Why Choose BMU CPD?', '', [
            'Expert faculty & practitioners',
            'Hands-on training approach',
            'Flexible learning schedules',
            'Nationally recognized certificates',
            'Online & in-person options',
        ], 4),

        # ============================================================
        # FOUNDATION STUDIES
        # ============================================================
        ('centres/foundation-studies', 'pathways', 'custom', 'Foundation Pathways', '', [
            {'name': 'Pre-Medicine Pathway', 'duration': '1 Year', 'subjects': ['Biology', 'Chemistry', 'Physics', 'Mathematics'], 'leadsTo': 'MBBS Program'},
            {'name': 'Pre-Nursing Pathway', 'duration': '1 Year', 'subjects': ['Biology', 'Chemistry', 'Health Sciences'], 'leadsTo': 'B.Sc Nursing'},
            {'name': 'Pre-Allied Health', 'duration': '1 Year', 'subjects': ['Biology', 'Chemistry', 'Anatomy'], 'leadsTo': 'Allied Health Programs'},
            {'name': 'English Enhancement', 'duration': '6-12 Months', 'subjects': ['Academic Writing', 'Medical English', 'Communication'], 'leadsTo': 'All Programs'},
        ], 1),
        ('centres/foundation-studies', 'requirements', 'list', 'Admission Requirements', '', [
            "5 O'level credits including English, Mathematics, Biology, Chemistry",
            'UTME score of 180+ (for Pre-Medicine pathway)',
            'International students: Equivalent qualifications accepted',
            'English proficiency test for non-native speakers',
        ], 2),
        ('centres/foundation-studies', 'contact', 'contact', 'Contact Us', '', [
            {'title': 'Email', 'details': ['foundation@bmu.edu.ng']},
            {'title': 'Phone', 'details': ['+234 xxx xxx xxxx']},
            {'title': 'Location', 'details': ['Yenagoa Campus']},
        ], 3),
        ('centres/foundation-studies', 'quick_facts', 'list', 'Quick Facts', '', [
            '4 Foundation Pathways',
            'Small Class Sizes (30 max)',
            'Modern Teaching Labs',
            '95% Progression Rate',
        ], 4),
        ('centres/foundation-studies', 'important_dates', 'custom', 'Important Dates', '', [
            {'label': 'Application Opens', 'value': 'Jan 1'},
            {'label': 'Application Deadline', 'value': 'Aug 31'},
            {'label': 'Program Starts', 'value': 'Oct 1'},
        ], 5),

        # ============================================================
        # INNOVATION CENTRE
        # ============================================================
        ('centres/innovation', 'pillars', 'cards', 'Innovation Pillars', '', [
            {'title': 'Digital Health', 'description': 'Telemedicine platforms, health informatics, and AI-powered diagnostic tools', 'projects': 8},
            {'title': 'Medical Devices', 'description': 'Development of affordable medical devices for local healthcare needs', 'projects': 5},
            {'title': 'Biotech & Genomics', 'description': 'Genomic research and biotechnology applications in healthcare', 'projects': 6},
            {'title': 'Health Entrepreneurship', 'description': 'Supporting health-tech startups and innovation ventures', 'projects': 12},
        ], 1),
        ('centres/innovation', 'facilities', 'list', 'Facilities', '', [
            'Makerspace & Prototyping Lab',
            'Digital Health Innovation Lab',
            'Biotechnology Research Lab',
            'Co-working Spaces',
            'VR/AR Medical Training Suite',
            '3D Printing & Fabrication Lab',
        ], 2),
        ('centres/innovation', 'partners', 'list', 'Partners', '', [
            'Microsoft',
            'Google Health',
            'IBM Research',
            'NITDA',
            'Tech startups',
        ], 3),
        ('centres/innovation', 'contact', 'contact', 'Contact Us', '', [
            {'title': 'Email', 'details': ['innovation@bmu.edu.ng']},
            {'title': 'Phone', 'details': ['+234 xxx xxx xxxx']},
            {'title': 'Location', 'details': ['Yenagoa Campus - Innovation Hub']},
        ], 4),
        ('centres/innovation', 'stats', 'stats', 'Impact Stats', '', [
            {'label': 'Innovation Projects', 'value': '31'},
            {'label': 'Startups Supported', 'value': '15'},
            {'label': 'Patents Filed', 'value': '8'},
            {'label': 'Research Grants', 'value': '₦450M'},
        ], 5),

        # ============================================================
        # FOREIGN LANGUAGES
        # ============================================================
        ('institutes/foreign-languages', 'programs', 'custom', 'Programs Offered', '', [
            {'lang': 'French', 'level': 'Beginner to Advanced', 'desc': 'Essential for West African medical practice'},
            {'lang': 'Spanish', 'level': 'Beginner to Advanced', 'desc': 'Global medical communication'},
            {'lang': 'German', 'level': 'Beginner to Advanced', 'desc': 'For medical studies in Germany'},
            {'lang': 'English for Medical Purposes', 'level': 'Professional', 'desc': 'Academic writing & communication'},
        ], 1),
        ('institutes/foreign-languages', 'contact', 'contact', 'Contact Us', '', [
            {'title': 'Email', 'details': ['ifl@bmu.edu.ng']},
            {'title': 'Phone', 'details': ['+234 xxx xxx xxxx']},
            {'title': 'Location', 'details': ['Yenagoa Campus']},
        ], 2),
        ('institutes/foreign-languages', 'quick_facts', 'list', 'Quick Facts', '', [
            '8 Language Programs',
            'Native Speaking Instructors',
            'Online & In-Person Classes',
            'Certificate Programs',
        ], 3),

        # ============================================================
        # RESEARCH INSTITUTES
        # ============================================================
        ('institutes/research', 'sidebar_stats', 'stats', 'Research Impact', '', [
            {'label': 'Active Projects', 'value': '45+'},
            {'label': 'Publications (2024)', 'value': '127'},
            {'label': 'Research Grants', 'value': '₦2.1B'},
            {'label': 'PhD Researchers', 'value': '89'},
        ], 1),
        ('institutes/research', 'funding_partners', 'list', 'Funding Partners', '', [
            'WHO',
            'NIH/NIAID',
            'Bill & Melinda Gates Foundation',
            'European Union',
        ], 2),
    ]

    for ps in sections:
        PS.objects.get_or_create(
            page_key=ps[0],
            section_key=ps[1],
            defaults={
                'content_type': ps[2],
                'title': ps[3],
                'subtitle': ps[4],
                'data': ps[5],
                'display_order': ps[6],
                'is_active': True,
            },
        )


def seed_portal_definitions(apps, schema_editor):
    PD = apps.get_model('content', 'PortalDefinition')
    portals = [
        {
            'title': 'Applicant Portal', 'url': '/portals/applicant', 'icon': 'UserCircle',
            'color': '#1E1E1E', 'audience': 'Prospective Students',
            'description': 'Apply to BMU and track your admission status. Upload documents, pay fees, and receive your offer letter online.',
            'features': ['Online Application', 'Document Upload', 'Application Tracking', 'Fee Payment'],
            'display_order': 1,
        },
        {
            'title': 'BMU Portal', 'url': '/portals/login', 'icon': 'GraduationCap',
            'color': '#A51C30', 'audience': 'All BMU Community',
            'description': 'Access student records, course registration, results, and academic resources. Your one-stop academic hub.',
            'features': ['Course Registration', 'Result Checking', 'Fee Payment', 'Academic Records'],
            'display_order': 2,
        },
        {
            'title': 'Alumni Portal', 'url': '/portals/alumni', 'icon': 'Users',
            'color': '#2563EB', 'audience': 'Graduates',
            'description': 'Stay connected with BMU alumni network. Access mentorship programs, events, and career opportunities.',
            'features': ['Alumni Network', 'Mentorship Program', 'Events Calendar', 'Career Board'],
            'display_order': 3,
        },
        {
            'title': 'CPD Platform', 'url': '/portals/login', 'icon': 'Stethoscope',
            'color': '#059669', 'audience': 'Healthcare Professionals',
            'description': 'Continuing Professional Development courses and certifications for healthcare workers.',
            'features': ['Online Courses', 'Certification Tracking', 'CME Credits', 'Workshop Registration'],
            'display_order': 4,
        },
    ]
    for p in portals:
        PD.objects.get_or_create(title=p['title'], defaults=p)


def seed_institutes(apps, schema_editor):
    IP = apps.get_model('content', 'InstitutePage')
    institutes = [
        {'name': 'Institute of Tropical Medicine', 'focus': 'Malaria, Neglected Tropical Diseases', 'director': 'Prof. John Okonkwo', 'projects_count': 12, 'description': 'Leading research into tropical diseases affecting the Niger Delta region.', 'display_order': 1},
        {'name': 'Institute of Public Health', 'focus': 'Epidemiology, Community Health, Health Policy', 'director': 'Prof. Adaeze Nwosu', 'projects_count': 15, 'description': 'Addressing public health challenges through research and community engagement.', 'display_order': 2},
        {'name': 'Institute of Biomedical Sciences', 'focus': 'Molecular Biology, Genomics, diagnostics', 'director': 'Prof. Emeka Obi', 'projects_count': 10, 'description': 'Advancing biomedical research and diagnostic capabilities.', 'display_order': 3},
        {'name': 'Institute of Environmental Health', 'focus': 'Oil Spill Health Effects, Water Quality, Air Pollution', 'director': 'Prof. Ngozi Adekunle', 'projects_count': 8, 'description': 'Studying environmental factors affecting community health in the Niger Delta.', 'display_order': 4},
    ]
    for inst in institutes:
        IP.objects.get_or_create(name=inst['name'], defaults=inst)


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0024_archivedcontent_centrepage_institutepage_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_page_sections, migrations.RunPython.noop),
        migrations.RunPython(seed_portal_definitions, migrations.RunPython.noop),
        migrations.RunPython(seed_institutes, migrations.RunPython.noop),
    ]
