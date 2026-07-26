export interface Program {
 id: number;
 title: string;
 slug: string;
 duration: string;
 requirements: string;
 applicationFee: { local: number; intl: number };
 tuitionPerYear?: { local: number; intl: number };
  tuitionFee?: { local: number; intl: number };
  college?: string;
  department?: string;
}

export interface Faculty {
 id: number;
 title: string;
 firstName: string;
 lastName: string;
 email: string;
 department: string;
 college: string;
 position: string;
 researchInterests: string;
 bio: string;
 orcidId?: string;
 googleScholarUrl?: string;
 researchgateUrl?: string;
 citations: number;
 hIndex: number;
 i10Index: number;
 profileImage: string;
 publications?: { title: string; year: number; journal: string; citations: number }[];
}

export interface College {
  id: number;
  name: string;
  slug: string;
  subdomain?: string;
  description: string;
  deanName?: string;
  directorName?: string;
  establishedYear: number;
  facultyCount?: number;
  studentCount?: number;
  facultyMembersCount?: number;
  departments: string[];
  programs: string[];
  primaryColor?: string;
  secondaryColor?: string;
  courses?: string[];
  iconName?: string;
  previewImage?: string;
}

export interface SDGMetric {
 label: string;
 value: number;
 target: number;
 unit: string;
}

export interface SDGData {
 title: string;
 metrics: SDGMetric[];
}

export interface NewsItem {
 id: number;
 title: string;
 slug: string;
 excerpt: string;
 content: string;
 category: string;
 image: string;
 publishedAt: string;
 author: string;
}

export interface ResearchCenter {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  mission: string | null;
  vision: string | null;
  research_areas: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  featured_image: string | null;
  director_id: number | null;
  director_name: string;
  director_title: string;
  director_photo: string | null;
  total_publications: number;
  ongoing_projects_count: number;
  completed_projects_count: number;
  is_active: boolean;
  is_featured: boolean;
  established_date: string | null;
}

export const mockPrograms = {
 undergraduate: [
 {
 id: 1,
 title: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
 slug: "mbbs",
 duration: "6 years",
 requirements: "5 credits in WAEC/NECO including English, Math, Biology, Chemistry, Physics",
 applicationFee: { local: 10000, intl: 50 },
 tuitionPerYear: { local: 500000, intl: 8500 },
 college: "College of Medicine",
 department: "Clinical Sciences"
 },
 {
 id: 2,
 title: "Bachelor of Nursing Science (B.NSc)",
 slug: "nursing",
 duration: "5 years",
 requirements: "5 credits including English, Math, Biology, Chemistry, Physics",
 applicationFee: { local: 10000, intl: 50 },
 tuitionPerYear: { local: 400000, intl: 6000 },
 college: "School of Nursing",
 department: "Nursing"
 },
 {
 id: 3,
 title: "Bachelor of Medical Laboratory Science (BMLS)",
 slug: "medical-lab-science",
 duration: "5 years",
 requirements: "5 credits including English, Math, Biology, Chemistry, Physics",
 applicationFee: { local: 10000, intl: 50 },
 tuitionPerYear: { local: 400000, intl: 6000 },
 college: "School of Allied Health",
 department: "Medical Laboratory Science"
 },
 {
 id: 4,
 title: "Bachelor of Public Health (BPH)",
 slug: "public-health",
 duration: "4 years",
 requirements: "5 credits including English, Math, Biology, Chemistry",
 applicationFee: { local: 10000, intl: 50 },
 tuitionPerYear: { local: 350000, intl: 5000 },
 college: "Institute of Public Health",
 department: "Public Health"
 }
 ],
 masters: [
 {
 id: 5,
 title: "Master of Public Health (MPH)",
 slug: "mph",
 duration: "2 years",
 requirements: "Bachelor's degree in related field, minimum 2nd class lower",
 applicationFee: { local: 15000, intl: 75 },
 tuitionPerYear: { local: 600000, intl: 5000 },
 college: "Institute of Public Health"
 },
 {
 id: 6,
 title: "MSc Medical Microbiology",
 slug: "msc-microbiology",
 duration: "2 years",
 requirements: "Bachelor's in Microbiology or related field",
 applicationFee: { local: 15000, intl: 75 },
 tuitionPerYear: { local: 600000, intl: 5000 },
 college: "College of Medicine"
 }
 ],
 phd: [
 {
 id: 7,
 title: "PhD Public Health",
 slug: "phd-public-health",
 duration: "3-5 years",
 requirements: "Master's degree in Public Health or related, research proposal",
 applicationFee: { local: 20000, intl: 100 },
 tuitionPerYear: { local: 800000, intl: 4500 },
 college: "Institute of Public Health"
 }
 ],
 certificate: [
 {
 id: 8,
 title: "Certificate in Health Research Methods",
 slug: "cert-health-research",
 duration: "3 months",
 requirements: "Bachelor's degree or relevant experience",
 applicationFee: { local: 5000, intl: 25 },
 tuitionFee: { local: 150000, intl: 1000 },
 college: "CPD"
 }
 ]
};

export const mockFaculty: Faculty[] = [
 {
 id: 1,
 title: "Prof.",
 firstName: "John",
 lastName: "Okonkwo",
 email: "jokonkwo@bmu.edu.ng",
 department: "Community Medicine",
 college: "College of Medicine",
 position: "Professor of Public Health",
 researchInterests: "Malaria elimination, Health systems strengthening, Maternal mortality",
 bio: "Professor Okonkwo has over 20 years of experience in public health research...",
 orcidId: "0000-0001-2345-6789",
 googleScholarUrl: "https://scholar.google.com/citations?user=xxx",
 researchgateUrl: "https://researchgate.net/profile/John-Okonkwo",
 citations: 2847,
 hIndex: 28,
 i10Index: 42,
 profileImage: "/images/faculty/john-okonkwo.jpg",
 publications: [
 { title: "Malaria prevalence in the Niger Delta", year: 2024, journal: "BMU Medical Journal", citations: 45 },
 { title: "Health systems strengthening in rural Nigeria", year: 2023, journal: "African Health Sciences", citations: 32 }
 ]
 },
 {
 id: 2,
 title: "Dr.",
 firstName: "Adaeze",
 lastName: "Nwosu",
 email: "anwosu@bmu.edu.ng",
 department: "Paediatrics",
 college: "College of Medicine",
 position: "Senior Lecturer",
 researchInterests: "Child nutrition, Neonatal health, Vaccine preventable diseases",
 bio: "Dr. Nwosu is a paediatrician with focus on child survival in the Niger Delta...",
 googleScholarUrl: "https://scholar.google.com/citations?user=yyy",
 citations: 1245,
 hIndex: 18,
 i10Index: 25,
 profileImage: "/images/faculty/adaeze-nwosu.jpg"
 }
];

export const mockColleges: College[] = [
 {
  id: 1,
  name: "College of Medicine",
  slug: "medicine",
  subdomain: "medicine.bmu.edu.ng",
  description: "The College of Medicine is the flagship college of BMU, offering the MBBS program and training the next generation of physicians.",
  deanName: "Prof. Emmanuel Ekanem",
  establishedYear: 2018,
  facultyCount: 120,
  studentCount: 850,
  facultyMembersCount: 120,
  departments: ["Basic Medical Sciences", "Clinical Sciences", "Community Medicine"],
  programs: ["MBBS", "MSc Medical Microbiology", "PhD Anatomy"],
  primaryColor: "#1E1E1E",
  secondaryColor: "#00a651",
  iconName: "GraduationCap",
  previewImage: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80"
  },
 {
  id: 2,
  name: "School of Allied Health Sciences",
  slug: "allied-health",
  description: "Training professionals in medical laboratory science, radiography, physiotherapy, and more.",
  deanName: "Dr. Grace Ebi",
  establishedYear: 2019,
  facultyCount: 45,
  studentCount: 600,
  facultyMembersCount: 45,
  departments: ["Medical Laboratory Science", "Radiography", "Physiotherapy"],
  programs: ["BMLS", "BSc Radiography", "BSc Physiotherapy"],
  iconName: "Microscope",
  previewImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80"
  },
 {
  id: 3,
  name: "School of Nursing",
  slug: "nursing",
  description: "Producing compassionate and competent nursing professionals.",
  deanName: "Prof. Helen Douglas",
  establishedYear: 2018,
  facultyCount: 35,
  studentCount: 450,
  facultyMembersCount: 35,
  departments: ["Nursing", "Midwifery"],
  programs: ["B.NSc", "Post-RN", "MSc Nursing"],
  iconName: "HeartPulse",
  previewImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80"
  },
 {
  id: 4,
  name: "School of Postgraduate Studies",
  slug: "postgraduate",
  description: "Advanced training and research at master's and doctoral levels.",
  deanName: "Prof. Michael Ogu",
  establishedYear: 2020,
  facultyCount: 80,
  studentCount: 300,
  facultyMembersCount: 80,
  departments: ["All departments across colleges"],
  programs: ["MPH", "MSc", "PhD"],
  iconName: "BookOpen",
  previewImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80"
  },
 {
  id: 5,
  name: "Institute of Public Health",
  slug: "public-health",
  description: "Focusing on population health, epidemiology, and health policy.",
  deanName: "Prof. Chioma Amadi",
  establishedYear: 2020,
  facultyCount: 25,
  studentCount: 350,
  facultyMembersCount: 25,
  departments: ["Epidemiology", "Health Policy", "Biostatistics"],
  programs: ["BPH", "MPH", "PhD Public Health"],
  iconName: "Globe",
  previewImage: "https://images.unsplash.com/photo-1576670159805-3817f06fae1e?w=600&q=80"
  },
 {
  id: 6,
  name: "Continuing Professional Development (CPD)",
  slug: "cpd",
  description: "Lifelong learning for medical professionals.",
  directorName: "Dr. Peter Iruo",
  establishedYear: 2022,
  departments: [],
  programs: [],
  courses: ["Health Research Methods", "Biostatistics", "Infection Control"],
  iconName: "Library",
  previewImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
  }
];

export const mockSDGMetrics: Record<string, SDGData> = {
 sdg3: {
 title: "Good Health & Well-being",
 metrics: [
 { label: "Patients treated in free clinics", value: 12847, target: 20000, unit: "patients" },
 { label: "Malaria sensitization campaigns", value: 45, target: 60, unit: "communities" },
 { label: "Maternal health workshops", value: 128, target: 150, unit: "sessions" },
 { label: "Outbreak responses", value: 8, target: 10, unit: "responses" }
 ]
 },
 sdg4: {
 title: "Quality Education",
 metrics: [
 { label: "Scholarships awarded", value: 342, target: 500, unit: "students" },
 { label: "CPD certificates issued", value: 1280, target: 2000, unit: "certificates" },
 { label: "Licensure exam pass rate", value: 89, target: 95, unit: "%" }
 ]
 },
 sdg5: {
 title: "Gender Equality",
 metrics: [
 { label: "Female faculty percentage", value: 38, target: 50, unit: "%" },
 { label: "Female student enrollment", value: 52, target: 55, unit: "%" },
 { label: "Female leadership positions", value: 4, target: 8, unit: "positions" }
 ]
 }
};

export const mockNews: NewsItem[] = [
 {
 id: 1,
 title: "BMU Receives WHO Grant for Malaria Research",
 slug: "bmu-receives-who-grant",
 excerpt: "Bayelsa Medical University has been awarded a $500,000 grant by the World Health Organization...",
 content: "Full content here...",
 category: "Research",
 image: "/images/news/who-grant.jpg",
 publishedAt: "2025-03-15",
 author: "Communications Office"
 },
 {
 id: 2,
 title: "VC Launches Free Medical Outreach in 10 Communities",
 slug: "free-medical-outreach",
 excerpt: "Over 2,000 residents of Yenagoa received free medical consultations and medications...",
 content: "Full content here...",
 category: "Community",
 image: "/images/news/medical-outreach.jpg",
 publishedAt: "2025-03-10",
 author: "Community Health Department"
 }
];

export const mockResearchCenters: ResearchCenter[] = [
  {
    id: 1,
    name: "Research & Development Center",
    slug: "research-development-center",
    code: "RDC",
    description: 'The Research & Development Center (RDC) is the flagship research arm of Bayelsa Medical University, dedicated to advancing medical knowledge and addressing critical health challenges in the Niger Delta region and beyond. Through cutting-edge research, strategic collaborations, and innovative solutions, the RDC drives BMU\u2019s mission of transforming healthcare delivery.',
    mission: 'To conduct innovative, impactful research that addresses critical health challenges in the Niger Delta region, contributing to global medical knowledge while improving local healthcare outcomes through evidence-based solutions.',
    vision: 'To be a leading center for medical research and innovation in Africa, recognized for groundbreaking discoveries, transformative healthcare solutions, and excellence in research training.',
    research_areas: 'Malaria & Vector-Borne Diseases, Non-Communicable Diseases, Maternal & Child Health, Infectious Diseases & Epidemiology, Neuroscience & Mental Health, Environmental Health & Climate Impact, Health Systems & Policy Research, Genomics & Precision Medicine',
    email: 'rdc@bmu.edu.ng',
    phone: '+234 803 111 0030',
    location: 'Research & Development Complex, BMU Main Campus, Elebele, Yenagoa',
    website: null,
    featured_image: null,
    director_id: null,
    director_name: 'Prof. Emmanuel Okpako',
    director_title: 'Director, Research & Development',
    director_photo: null,
    total_publications: 500,
    ongoing_projects_count: 50,
    completed_projects_count: 120,
    is_active: true,
    is_featured: true,
    established_date: '2018-09-01',
  },
];

export interface PageContentSection {
  id: number;
  page: string;
  page_display: string;
  section_key: string;
  content_type: string;
  content_type_display: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image: string | null;
  extra_data: Record<string, unknown> | null;
  display_order: number;
}

export const mockPageContent: PageContentSection[] = [
  {
    id: 1, page: 'about', page_display: 'About Page',
    section_key: 'hero', content_type: 'hero', content_type_display: 'Hero Section',
    title: 'About Bayelsa Medical University', subtitle: null,
    content: 'Bayelsa Medical University (BMU) is Nigeria\'s first specialized medical university...',
    image: null, extra_data: null, display_order: 1,
  },
  {
    id: 2, page: 'about', page_display: 'About Page',
    section_key: 'stats', content_type: 'stats', content_type_display: 'Statistics',
    title: 'Our Impact', subtitle: null, content: null, image: null,
    extra_data: { yearsEstablished: 7, programs: 25, faculty: 450, students: 3500, partners: 28 },
    display_order: 2,
  },
  {
    id: 3, page: 'about', page_display: 'About Page',
    section_key: 'core_values', content_type: 'text', content_type_display: 'Text Block',
    title: 'Our Core Values', subtitle: null,
    content: null, image: null,
    extra_data: {
      values: [
        { title: 'Excellence', description: 'We pursue the highest standards in teaching, research, and healthcare delivery.' },
        { title: 'Compassion', description: 'We put patients and communities at the center of everything we do.' },
        { title: 'Innovation', description: 'We embrace new ideas and technologies to advance medical science.' },
        { title: 'Impact', description: 'We are committed to improving health outcomes in the Niger Delta and beyond.' },
      ]
    },
    display_order: 3,
  },
  {
    id: 4, page: 'mission_vision', page_display: 'Mission & Vision',
    section_key: 'hero', content_type: 'hero', content_type_display: 'Hero Section',
    title: 'Our Vision & Mission', subtitle: null,
    content: 'Shaping the future of healthcare through excellence in education, research, and service.',
    image: null, extra_data: null, display_order: 1,
  },
  {
    id: 5, page: 'mission_vision', page_display: 'Mission & Vision',
    section_key: 'vision', content_type: 'text', content_type_display: 'Text Block',
    title: 'Our Vision', subtitle: null,
    content: 'To be Africa\'s leading medical university, transforming healthcare through innovative education, groundbreaking research, and compassionate service.',
    image: null, extra_data: null, display_order: 2,
  },
  {
    id: 6, page: 'mission_vision', page_display: 'Mission & Vision',
    section_key: 'mission', content_type: 'text', content_type_display: 'Text Block',
    title: 'Our Mission', subtitle: null,
    content: 'To advance medical knowledge and practice through comprehensive education, impactful research, and community-centered healthcare delivery.',
    image: null, extra_data: null, display_order: 3,
  },
  {
    id: 7, page: 'mission_vision', page_display: 'Mission & Vision',
    section_key: 'strategic_pillars', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Our Strategic Pillars', subtitle: null, content: null, image: null,
    extra_data: {
      pillars: [
        { title: 'Excellence in Education', description: 'Delivering world-class medical education through innovative teaching methods, modern facilities, and experienced faculty.', icon: 'Lightbulb' },
        { title: 'Compassionate Care', description: 'Instilling values of empathy and patient-centered care in every graduate who serves our communities.', icon: 'Heart' },
        { title: 'Research Innovation', description: 'Advancing medical knowledge through cutting-edge research addressing regional and global health challenges.', icon: 'Compass' },
        { title: 'Community Impact', description: 'Transforming healthcare delivery in the Niger Delta through service, outreach, and partnership.', icon: 'Target' },
      ]
    },
    display_order: 4,
  },
  {
    id: 8, page: 'mission_vision', page_display: 'Mission & Vision',
    section_key: 'core_values', content_type: 'list', content_type_display: 'List Items',
    title: 'Our Core Values', subtitle: null, content: null, image: null,
    extra_data: {
      values: [
        { title: 'Integrity', description: 'Upholding the highest ethical standards in all our dealings' },
        { title: 'Excellence', description: 'Pursuing the highest quality in education, research, and service' },
        { title: 'Innovation', description: 'Embracing new ideas and technologies to advance healthcare' },
        { title: 'Compassion', description: 'Putting patients and communities first in everything we do' },
        { title: 'Collaboration', description: 'Working together across disciplines and with our communities' },
        { title: 'Accountability', description: 'Taking responsibility for our actions and their outcomes' },
      ]
    },
    display_order: 5,
  },
  {
    id: 9, page: 'history', page_display: 'History',
    section_key: 'hero', content_type: 'hero', content_type_display: 'Hero Section',
    title: 'Our History', subtitle: null,
    content: 'From vision to reality — the journey of Bayelsa Medical University.',
    image: null, extra_data: null, display_order: 1,
  },
  {
    id: 10, page: 'history', page_display: 'History',
    section_key: 'timeline', content_type: 'timeline', content_type_display: 'Timeline',
    title: 'Our Journey', subtitle: null, content: null, image: null,
    extra_data: {
      events: [
        { year: '2018', title: 'Foundation Established', description: 'Bayelsa Medical University was established by the Bayelsa State Government.' },
        { year: '2019', title: 'First Academic Session Begins', description: 'BMU admitted its first cohort of students into the MBBS program.' },
        { year: '2020', title: 'NUC Accreditation', description: 'Received full accreditation from the National Universities Commission.' },
        { year: '2021', title: 'Teaching Hospital Partnership', description: 'Established formal partnership with the Federal Medical Centre, Yenagoa.' },
        { year: '2022', title: 'Research Centers Launch', description: 'Launched the Center for Malaria Research and Center for Non-Communicable Diseases.' },
        { year: '2023', title: 'Postgraduate Programs', description: 'Introduced Master of Public Health (MPH) and other postgraduate programs.' },
        { year: '2024', title: 'International Collaborations', description: 'Established partnerships with leading international medical universities.' },
      ]
    },
    display_order: 2,
  },
  {
    id: 11, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'hero', content_type: 'hero', content_type_display: 'Hero Section',
    title: 'Campus Life', subtitle: null,
    content: 'Experience a vibrant, supportive community dedicated to your growth and well-being.',
    image: null, extra_data: null, display_order: 1,
  },
  {
    id: 12, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'features', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Life on Campus', subtitle: null, content: null, image: null,
    extra_data: {
      features: [
        { title: 'Modern Lecture Halls', description: 'State-of-the-art classrooms equipped with the latest technology.' },
        { title: 'Student Support', description: 'Guidance, counseling, and academic support services.' },
      ]
    },
    display_order: 2,
  },
  {
    id: 16, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'stats', content_type: 'stats', content_type_display: 'Statistics',
    title: 'By the Numbers', subtitle: null, content: null, image: null,
    extra_data: {
      stats: [
        { label: 'Students', value: '3,500+' },
        { label: 'Student Organizations', value: '50+' },
        { label: 'Campus Size', value: '200+ Acres' },
        { label: 'Residential Halls', value: '6' },
        { label: 'Dining Options', value: '4' },
        { label: 'Sports Facilities', value: '8' },
      ]
    }, display_order: 3,
  },
  {
    id: 17, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'housing', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Residential Life', subtitle: 'Your home away from home. Our residential halls provide a safe, comfortable, and inclusive living environment.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'Male Hostel', description: 'Fully furnished rooms with 24/7 security, common rooms, and study areas. Capacity: 400 students.', icon: 'Building2' },
        { title: 'Female Hostel', description: 'Secure and comfortable accommodation with lounge areas, laundry facilities, and kitchenettes. Capacity: 400 students.', icon: 'Building2' },
        { title: 'International House', description: 'Premium accommodation for international and postgraduate students with en-suite rooms and wireless internet.', icon: 'Globe' },
        { title: 'Student Apartments', description: 'Self-contained apartments for final-year and married students with living, dining, and kitchen areas.', icon: 'Home' },
        { title: 'Hostel Amenities', description: 'Common rooms, TV lounges, study carrels, mini-marts, and recreational areas in every hall.', icon: 'Wifi' },
        { title: 'Residential Life Programs', description: 'Floor meetings, cultural nights, wellness checks, and peer mentoring programs in each hall.', icon: 'Users' },
      ]
    }, display_order: 4,
  },
  {
    id: 18, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'dining', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Dining & Nutrition', subtitle: 'From local delicacies to international cuisine, our dining halls offer nutritious meals for every palate.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'Main Cafeteria', description: 'Buffet-style dining hall serving breakfast, lunch, and dinner with diverse menu options daily.', icon: 'UtensilsCrossed' },
        { title: 'Food Court', description: 'Multiple food vendors offering Nigerian, continental, and fast-food options in a food-court setting.', icon: 'Store' },
        { title: 'Coffee & Snack Bar', description: 'Casual cafe serving beverages, pastries, and light snacks between classes.', icon: 'Coffee' },
        { title: 'Meal Plans', description: 'Flexible meal plans from 7 to 21 meals per week. All plans include dietary accommodation.', icon: 'ClipboardCheck' },
        { title: 'Dietary Options', description: 'Vegetarian, vegan, halal, and special dietary needs accommodated with advance notice.', icon: 'Leaf' },
        { title: 'Nutrition Services', description: 'Registered nutritionists available for dietary counseling and meal planning consultations.', icon: 'Heart' },
      ]
    }, display_order: 5,
  },
  {
    id: 19, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'wellness', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Health & Wellness', subtitle: 'Your well-being is our priority. Comprehensive health services and wellness programs support your mind, body, and spirit.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'University Health Centre', description: 'On-campus clinic staffed by qualified doctors and nurses providing primary care, emergency services, and referrals.', icon: 'Stethoscope' },
        { title: 'Counseling Services', description: 'Professional counselors offering individual and group sessions for stress, anxiety, and personal challenges.', icon: 'HeartHandshake' },
        { title: 'Fitness Centre', description: 'Modern gym with cardio and weight equipment, fitness classes, and personal training sessions.', icon: 'Dumbbell' },
        { title: 'Sports Complex', description: 'Multi-purpose indoor and outdoor courts for basketball, volleyball, badminton, and table tennis.', icon: 'Trophy' },
        { title: 'Swimming Pool', description: 'Olympic-size swimming pool with lap lanes, swimming classes, and recreational swim sessions.', icon: 'Waves' },
        { title: 'Wellness Programs', description: 'Yoga, meditation, health talks, fitness challenges, and annual health screening events.', icon: 'Sparkles' },
      ]
    }, display_order: 6,
  },
  {
    id: 20, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'organizations', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Student Organizations', subtitle: 'Join 50+ clubs and societies to pursue your passions, build leadership skills, and make lifelong friends.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'Student Union Government', description: 'Elected student representatives advocating for student welfare and organizing campus-wide events.', icon: 'Vote' },
        { title: 'Medical Students Association', description: 'Pre-professional organization for clinical skills workshops, conferences, and community health outreaches.', icon: 'Syringe' },
        { title: 'Research Club', description: 'For students interested in medical research with journal clubs, poster sessions, and mentorship.', icon: 'FlaskConical' },
        { title: 'Cultural Society', description: 'Celebrating diversity through cultural nights, traditional music, dance performances, and food festivals.', icon: 'Palette' },
        { title: 'Debate & Press Club', description: 'Develop public speaking, debate, and journalism skills through competitions and university publications.', icon: 'Microphone' },
        { title: 'Sports & Recreation Club', description: 'Organizes intramural sports, inter-college competitions, and recreational outdoor activities.', icon: 'Activity' },
        { title: 'Community Service Club', description: 'Volunteer initiatives including health outreaches, environmental clean-ups, and charity fundraisers.', icon: 'HandHeart' },
        { title: 'Music & Drama Society', description: 'For musically and dramatically inclined students featuring choir, band, and theatrical productions.', icon: 'Music' },
      ]
    }, display_order: 7,
  },
  {
    id: 21, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'diversity', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Diversity & Inclusion', subtitle: 'We celebrate diversity and are committed to creating an inclusive environment where every student belongs.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'International Student Office', description: 'Dedicated support for visa processing, orientation, cultural adjustment, and immigration advising.', icon: 'Globe' },
        { title: 'Gender Equity Office', description: 'Promoting gender equality through policies, awareness campaigns, and support services.', icon: 'Equal' },
        { title: 'Accessibility Services', description: 'Academic accommodations, assistive technologies, and accessible facilities for students with disabilities.', icon: 'Accessibility' },
        { title: 'Interfaith Centre', description: 'Multi-faith prayer rooms, chaplaincy services, and interfaith dialogue programs for spiritual well-being.', icon: 'Church' },
        { title: 'Cultural Exchange Programs', description: 'Student exchange, study abroad, and cultural immersion programs with partner universities.', icon: 'Plane' },
        { title: 'Inclusion Initiatives', description: 'Workshops, awareness campaigns, and policy advocacy fostering a culture of respect and belonging.', icon: 'Heart' },
      ]
    }, display_order: 8,
  },
  {
    id: 22, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'safety', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Safety & Security', subtitle: 'Your safety is paramount. We maintain a secure campus environment through comprehensive measures and 24/7 support.',
    content: null, image: null,
    extra_data: {
      features: [
        { title: 'Campus Security', description: 'Professional security personnel patrolling the campus 24/7, with response time under 5 minutes.', icon: 'Shield' },
        { title: 'Emergency Call Points', description: 'Strategically placed emergency phones across campus that connect directly to security control.', icon: 'Phone' },
        { title: 'CCTV Surveillance', description: 'High-definition cameras covering all public areas, entrances, parking lots, and walkways.', icon: 'Camera' },
        { title: 'Student ID System', description: 'Electronic access control at all residence halls and academic buildings using student ID cards.', icon: 'IdCard' },
        { title: 'Campus Shuttle', description: 'Free evening shuttle service operating on fixed routes across campus for student safety.', icon: 'Bus' },
        { title: 'Emergency Response Team', description: 'Trained first responders available 24/7 for medical emergencies, fire safety, and disaster response.', icon: 'Ambulance' },
      ]
    }, display_order: 9,
  },
  {
    id: 23, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'testimonials', content_type: 'gallery', content_type_display: 'Testimonials',
    title: 'What Our Students Say', subtitle: null, content: null, image: null,
    extra_data: {
      testimonials: [
        { name: 'Sarah Okon', program: 'MBBS, Final Year', quote: 'Living on campus has been the best part of my medical education. The community is incredibly supportive, and I\'ve made friends from all over Nigeria.', image: '/images/testimonials/sarah.jpg' },
        { name: 'Emeka Okafor', program: 'B.Sc. Nursing, Year 3', quote: 'From the fitness centre to the study groups in my hall, everything I need is right here. The residential advisors truly care about our well-being.', image: '/images/testimonials/emeka.jpg' },
        { name: 'Fatima Usman', program: 'M.P.H., Postgraduate', quote: 'As an international student, I was nervous about moving to a new country. The International Student Office made the transition seamless.', image: '/images/testimonials/fatima.jpg' },
        { name: 'David Adeleke', program: 'MBBS, Year 4', quote: 'The student organizations here are incredible. Through the Research Club, I\'ve presented at two international conferences and published a paper.', image: '/images/testimonials/david.jpg' },
      ]
    }, display_order: 10,
  },
  {
    id: 24, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'virtual_tour', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Explore Our Campus', subtitle: 'Take a virtual tour of our beautiful campus from anywhere in the world.',
    content: null, image: null,
    extra_data: {
      highlights: [
        { title: '360° Campus Tour', description: 'Interactive panoramic views of the main campus, lecture halls, and residential areas.', icon: 'Eye' },
        { title: 'Virtual Lab Tour', description: 'Walk through our state-of-the-art research and teaching laboratories.', icon: 'FlaskConical' },
        { title: 'Library Virtual Visit', description: 'Explore our medical library\'s collections, study spaces, and digital resources.', icon: 'BookOpen' },
        { title: 'Sports Facilities Tour', description: 'See our gym, swimming pool, sports complex, and outdoor courts.', icon: 'Trophy' },
      ]
    }, display_order: 11,
  },
  {
    id: 25, page: 'campus_life', page_display: 'Campus Life',
    section_key: 'contact_support', content_type: 'text', content_type_display: 'Text Block',
    title: 'Campus Life Support', subtitle: null,
    content: 'Our campus life team is here to help. Whether you have questions about housing, need wellness support, or want to join a club, we are just a call or visit away.',
    image: null,
    extra_data: {
      address: 'Student Affairs Division, BMU Main Campus, Elebele, Yenagoa',
      phone: '+234 803 111 0025',
      email: 'studentaffairs@bmu.edu.ng',
      office_hours: 'Monday - Friday: 8:00 AM - 5:00 PM | Saturday: 9:00 AM - 1:00 PM',
    }, display_order: 12,
  },
  {
    id: 13, page: 'governance', page_display: 'Governance',
    section_key: 'hero', content_type: 'hero', content_type_display: 'Hero Section',
    title: 'University Governance', subtitle: null,
    content: 'Our leadership structure ensures transparent, accountable management.',
    image: null, extra_data: null, display_order: 1,
  },
  {
    id: 14, page: 'governance', page_display: 'Governance',
    section_key: 'structure', content_type: 'feature', content_type_display: 'Feature Cards',
    title: 'Governance Structure', subtitle: null, content: null, image: null,
    extra_data: {
      bodies: [
        { title: 'Governing Council', description: 'The highest policy-making body of the university, responsible for strategic direction and oversight.' },
        { title: 'Senate', description: 'The academic authority of the university, responsible for all academic matters and standards.' },
        { title: 'Management Committee', description: 'Responsible for day-to-day administration and implementation of policies.' },
        { title: 'College Boards', description: 'Oversee the academic and administrative affairs of each college.' },
      ]
    },
    display_order: 2,
  },
  {
    id: 15, page: 'contact_info', page_display: 'Contact Information',
    section_key: 'info', content_type: 'text', content_type_display: 'Text Block',
    title: 'Get in Touch', subtitle: null,
    content: null, image: null,
    extra_data: {
      address: 'Permanent Site, Elebele, Yenagoa, Bayelsa State',
      phone: '+234 803 111 0000',
      email: 'info@bmu.edu.ng',
      office_hours: 'Monday - Friday: 8:00 AM - 4:00 PM',
    },
    display_order: 1,
  },
];

export interface LeadershipProfile {
  id: number;
  full_name: string;
  position: string;
  position_display: string;
  specific_title: string | null;
  biography: string;
  qualifications?: string;
  research_interests?: string;
  email?: string | null;
  phone?: string | null;
  photo: string | null;
  achievements?: string;
  publications?: PublicationItem[];
}

export const mockLeadership: LeadershipProfile[] = [
  { id: 1, full_name: 'Prof. Dimie Ogoina', position: 'vc', position_display: 'Vice Chancellor', specific_title: 'Vice Chancellor', biography: 'Professor Dimie brings over 25 years of experience in medical education and healthcare administration. Former MD the Niger Delta University Teaching Hospital, he has published extensively in public health and health systems research.', qualifications: 'MBBS, FWACS, PhD', research_interests: 'Infectious Disease Control, Public Health Policy, Health Systems Research', email: 'vc@bmu.edu.ng', phone: '+234 803 111 0001', photo: null, achievements: 'Established 3 new research centers at BMU\nSecured $2M in research grants\nPublished 50+ peer-reviewed articles', publications: [{ title: 'Health Systems Resilience in the Niger Delta', journal: 'African Journal of Public Health', year: 2023, citations: 15 }, { title: 'Medical Education Reform in Nigeria', journal: 'Medical Education International', year: 2022, citations: 28 }] },
  { id: 2, full_name: 'Prof. Ligha Aloysius Ebi', position: 'dvc_academic', position_display: 'Deputy Vice Chancellor - Academic', specific_title: 'Deputy Vice Chancellor', biography: 'Professor Ligha Aloysius Ebi is a renowned professor of Nursing with expertise in curriculum development and quality assurance in health professions education.', qualifications: 'PhD Nursing, MSc Health Education', research_interests: 'Nursing Education, Curriculum Development, Quality Assurance', email: 'dvc.academic@bmu.edu.ng', phone: '+234 803 111 0002', photo: null, achievements: 'Developed competency-based nursing curriculum\nLed BMU to full NMCN accreditation\nEstablished virtual simulation laboratory', publications: [{ title: 'Virtual Simulation in Nursing Education', journal: 'Nurse Education Today', year: 2023, citations: 12 }, { title: 'Competency-Based Nursing Education in African Context', journal: 'International Nursing Review', year: 2022, citations: 20 }] },
  { id: 3, full_name: 'Prof. Godwill Abraham Ziriki', position: 'dvc_admin', position_display: 'Deputy Vice Chancellor - Administration', specific_title: 'Deputy Vice Chancellor, Sampou Campus', biography: 'Professor Godwill Abraham Ziriki oversees the administrative operations of the Sampou Campus. With expertise in Physics, he has successfully managed the Sampou Campus of the University effectively.', qualifications: 'MBBS, MPH, MBA', research_interests: 'Healthcare Management, Strategic Planning, Operations Management', email: 'dvc.admin@bmu.edu.ng', phone: '+234 803 111 0003', photo: null, achievements: 'Implemented ERP system reducing costs by 30%\nEstablished performance management framework\nLed ISO 9001 certification process', publications: [{ title: 'Operational Efficiency in Nigerian Universities', journal: 'Journal of Higher Education Management', year: 2023, citations: 8 }] },
  { id: 4, full_name: 'Dr. Mrs. Felicia Eyimuze Akusu', position: 'registrar', position_display: 'Registrar', specific_title: 'Registrar', biography: 'Dr. Felicia manages the university\'s governance and administrative records. She brings expertise in academic policy and regulatory compliance.', qualifications: 'PhD Educational Administration', research_interests: 'Educational Administration, Regulatory Compliance, Records Management', email: 'registrar@bmu.edu.ng', phone: '+234 803 111 0004', photo: null, achievements: 'Processed accreditation for 15+ programs\nImplemented digital records management system\nEstablished quality assurance framework', publications: [{ title: 'Digital Transformation in University Administration', journal: 'Journal of Educational Management in Africa', year: 2023, citations: 5 }] },
  { id: 5, full_name: 'Mr. David Alagoa', position: 'bursar', position_display: 'Bursar', specific_title: 'Bursar', biography: 'Mr. Alagoa oversees all financial operations of the university. With over 15 years of experience in educational institution finance, he ensures prudent resource management.', qualifications: 'MBA (Finance), ACA', research_interests: '', email: 'bursar@bmu.edu.ng', phone: '+234 803 111 0021', photo: null, achievements: 'Implemented automated financial reporting\nAchieved clean audit for 5 consecutive years\nReduced processing time by 40%', publications: [{ title: 'Financial Sustainability in Nigerian Universities', journal: 'Journal of Educational Finance in Africa', year: 2023, citations: 3 }] },
  { id: 6, full_name: 'Mrs. Blessing Ayibatari', position: 'librarian', position_display: 'University Librarian', specific_title: 'University Librarian', biography: 'Mrs. Ayibatari manages the university library system and digital resources. She has transformed BMU\'s library into a modern information center.', qualifications: 'MLS, MA (Information Science)', research_interests: 'Library Management, Information Science, Digital Resources', email: 'librarian@bmu.edu.ng', phone: '+234 803 111 0022', photo: null, achievements: 'Digital library transformation completed\nAccess to 50+ medical databases secured\nLibrary usage increased by 200%', publications: [{ title: 'Digital Transformation in Academic Libraries', journal: 'Library Trends', year: 2023, citations: 10 }] },
  { id: 7, full_name: 'Engr. Tonye Oweifa', position: 'director', position_display: 'Director', specific_title: 'Director of Works', biography: 'Engr. Tonye manages the university\'s physical infrastructure development and maintenance, ensuring a safe and conducive environment for learning.', qualifications: 'B.Eng (Civil), MNSE', research_interests: '', email: 'director.works@bmu.edu.ng', phone: '+234 803 111 0023', photo: null, achievements: 'Completed 5 major construction projects\nReduced maintenance costs by 25%\nImplemented preventive maintenance system', publications: [] },
  { id: 8, full_name: 'Prof. John Okonkwo', position: 'dean', position_display: 'Dean', specific_title: 'Dean, College of Medicine', biography: 'Professor Okonkwo is an experienced internist with over 20 years of clinical and teaching experience. He leads the College of Medicine with a focus on producing competent physicians.', qualifications: 'MBBS, PhD (Internal Medicine)', research_interests: 'Internal Medicine, Tropical Medicine, Medical Education', email: 'dean.medicine@bmu.edu.ng', phone: '+234 803 111 0011', photo: null, achievements: 'Established 5 new clinical training partnerships\nPublished 40+ peer-reviewed articles\nLed MBBS program to full MDCN accreditation', publications: [{ title: 'Pattern of Cardiovascular Disease in the Niger Delta', journal: 'Nigerian Medical Journal', year: 2023, citations: 22 }, { title: 'Community-Based Medical Education: The BMU Model', journal: 'Medical Education International', year: 2022, citations: 15 }] },
  { id: 9, full_name: 'Dr. Grace Ebi', position: 'dean', position_display: 'Dean', specific_title: 'Dean, School of Allied Health Sciences', biography: 'Dr. Ebi brings extensive experience in public health and laboratory medicine. She oversees programs in medical laboratory science, radiography, and other allied health disciplines.', qualifications: 'MBBS, MPH, MSc (Medical Laboratory Science)', research_interests: 'Public Health, Medical Laboratory Science, Disease Surveillance', email: 'dean.alliedhealth@bmu.edu.ng', phone: '+234 803 111 0012', photo: null, achievements: 'WHO Consultant on Laboratory Systems\nEstablished 3 new allied health programs\nPublished 25+ articles on laboratory medicine', publications: [{ title: 'Quality Assurance in Medical Laboratory Practice', journal: 'African Journal of Laboratory Medicine', year: 2023, citations: 18 }] },
  { id: 10, full_name: 'Prof. Helen Douglas', position: 'dean', position_display: 'Dean', specific_title: 'Dean, School of Nursing', biography: 'Professor Douglas serves dual roles as DVC Academic and Dean of Nursing. She is a renowned nursing educator with expertise in curriculum development.', qualifications: 'PhD Nursing, MSc Health Education', research_interests: 'Nursing Education, Maternal Health, Clinical Simulation', email: 'dean.nursing@bmu.edu.ng', phone: '+234 803 111 0002', photo: null, achievements: 'Achieved NMCN full accreditation\nDeveloped simulation-based nursing curriculum\nPublished 30+ nursing education articles', publications: [{ title: 'Competency-Based Nursing Education: Implementation and Outcomes', journal: 'International Nursing Review', year: 2023, citations: 25 }] },
  { id: 11, full_name: 'Prof. Michael Ogu', position: 'dean', position_display: 'Dean', specific_title: 'Dean, School of Postgraduate Studies', biography: 'Professor Ogu manages postgraduate programs at BMU, ensuring high standards for advanced degrees and research supervision.', qualifications: 'MBBS, MPH, MBA', research_interests: 'Postgraduate Education, Research Methodology, Health Systems Research', email: 'dean.postgraduate@bmu.edu.ng', phone: '+234 803 111 0003', photo: null, achievements: 'Established 4 new postgraduate programs\nSupervised 20+ postgraduate theses\nPublished 35+ research articles', publications: [{ title: 'Postgraduate Research Output in Nigerian Universities', journal: 'Journal of Higher Education in Africa', year: 2023, citations: 7 }] },
  { id: 12, full_name: 'Prof. Chioma Amadi', position: 'director', position_display: 'Director', specific_title: 'Director, Institute of Public Health', biography: 'Professor Amadi is an epidemiologist with expertise in disease surveillance and community health interventions. She leads public health research and training initiatives.', qualifications: 'MBBS, DrPH (Epidemiology)', research_interests: 'Epidemiology, Disease Surveillance, Infectious Disease Control', email: 'director.publichealth@bmu.edu.ng', phone: '+234 803 111 0015', photo: null, achievements: 'Led 10+ major disease outbreak investigations\nPublished 50+ public health research articles\nTrained 500+ public health professionals', publications: [{ title: 'Disease Surveillance Systems in the Niger Delta', journal: 'African Journal of Public Health', year: 2023, citations: 30 }] },
  { id: 13, full_name: 'Dr. Peter Iruo', position: 'director', position_display: 'Director', specific_title: 'Director, Continuing Professional Development', biography: 'Dr. Iruo coordinates professional development programs for healthcare practitioners. He has pioneered innovative approaches to continuing medical education.', qualifications: 'MBBS, MSc (Health Professions Education)', research_interests: 'Continuing Medical Education, Health Professions Education, Blended Learning', email: 'director.cpd@bmu.edu.ng', phone: '+234 803 111 0016', photo: null, achievements: 'Developed 20+ CPD programs\nTrained 1,000+ healthcare professionals\nEstablished online CPD platform', publications: [{ title: 'Blended Learning in Continuing Medical Education', journal: 'Journal of Continuing Education in the Health Professions', year: 2023, citations: 14 }] },
];

export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image_url: string;
  background_video: string | null;
  overlay_color: string | null;
  content_position: string | null;
  text_color: string | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  primary_cta_color: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  secondary_cta_color: string | null;
}

export const mockHeroSlides: HeroSlideData[] = [
  {
    id: 1,
    title: 'Welcome to Bayelsa Medical University',
    subtitle: 'Nigeria\'s First Specialized Medical University',
    description: 'Shaping the future of healthcare through excellence in education, research, and community service.',
    background_image_url: '/images/hero/bmu-campus.jpg',
    background_video: null,
    overlay_color: 'rgba(0,0,0,0.5)',
    content_position: 'center',
    text_color: '#ffffff',
    primary_cta_text: 'Explore Programs',
    primary_cta_url: '/academics/programs',
    primary_cta_color: '#A51C30',
    secondary_cta_text: 'Apply Now',
    secondary_cta_url: '/apply',
    secondary_cta_color: '#ffffff',
  },
  {
    id: 2,
    title: 'Excellence in Medical Education',
    subtitle: 'Our Colleges & Schools',
    description: 'Discover our range of undergraduate and postgraduate programs across six academic colleges.',
    background_image_url: '/images/hero/academics.jpg',
    background_video: null,
    overlay_color: 'rgba(0,0,0,0.5)',
    content_position: 'center',
    text_color: '#ffffff',
    primary_cta_text: 'View Colleges',
    primary_cta_url: '/academics/colleges',
    primary_cta_color: '#A51C30',
    secondary_cta_text: null,
    secondary_cta_url: null,
    secondary_cta_color: null,
  },
  {
    id: 3,
    title: 'Research & Innovation',
    subtitle: 'Advancing Medical Science',
    description: 'Our research centers tackle the most pressing health challenges facing our region.',
    background_image_url: '/images/hero/research.jpg',
    background_video: null,
    overlay_color: 'rgba(0,0,0,0.5)',
    content_position: 'center',
    text_color: '#ffffff',
    primary_cta_text: 'Our Research',
    primary_cta_url: '/research-development',
    primary_cta_color: '#A51C30',
    secondary_cta_text: null,
    secondary_cta_url: null,
    secondary_cta_color: null,
  },
];

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo_url: string | null;
}

export const mockTestimonials: TestimonialData[] = [
  {
    id: 1, name: 'Dr. Amara Okafor',
    role: 'MBBS Graduate, 2023',
    quote: 'BMU provided me with a solid foundation in medical sciences. The clinical exposure was exceptional.',
    photo_url: null,
  },
  {
    id: 2, name: 'Nurse Blessing George',
    role: 'School of Nursing, 2023',
    quote: 'The hands-on training at BMU\'s School of Nursing prepared me well for the challenges of modern healthcare.',
    photo_url: null,
  },
  {
    id: 3, name: 'Mr. Emmanuel Douglas',
    role: 'MPH Candidate',
    quote: 'The public health program at BMU has given me the tools to make a real difference in community health.',
    photo_url: null,
  },
];

export interface UniversityRankingData {
  id: number;
  entry_type: string;
  title: string;
  description: string;
  rank: string;
  year: string;
  source: string;
  accrediting_body: string;
  body_full_name: string;
  status: string;
  validity: string;
  accredited_programs: string;
  display_order: number;
  is_active: boolean;
  logo_url?: string | null;
}

export const mockUniversityRankings: UniversityRankingData[] = [
  { id: 1, entry_type: 'ranking', title: 'Best Medical University in Nigeria', description: '', rank: 'Top 5', year: '2024', source: 'Nigerian Universities Ranking', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 1, is_active: true, logo_url: null },
  { id: 2, entry_type: 'ranking', title: 'Research Output in Health Sciences', description: '', rank: 'Top 10', year: '2024', source: 'Scimago Institutions Rankings', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 2, is_active: true, logo_url: null },
  { id: 3, entry_type: 'ranking', title: 'Community Impact Index', description: '', rank: '#1', year: '2024', source: 'Nigerian Education Innovation Hub', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 3, is_active: true, logo_url: null },
  { id: 4, entry_type: 'ranking', title: 'Student Satisfaction', description: '', rank: '4.5/5', year: '2024', source: 'National Student Survey', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 4, is_active: true, logo_url: null },
  { id: 5, entry_type: 'accreditation', title: 'NUC Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NUC', body_full_name: 'National Universities Commission', status: 'Full Accreditation', validity: '2020 - Present', accredited_programs: 'All Undergraduate Programs,All Postgraduate Programs', display_order: 1, is_active: true, logo_url: null },
  { id: 6, entry_type: 'accreditation', title: 'MDCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'MDCN', body_full_name: 'Medical & Dental Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'MBBS (Medicine & Surgery)', display_order: 2, is_active: true, logo_url: null },
  { id: 7, entry_type: 'accreditation', title: 'NMCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NMCN', body_full_name: 'Nursing & Midwifery Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'B.NSc Nursing Science,Post-Basic Nursing', display_order: 3, is_active: true, logo_url: null },
  { id: 8, entry_type: 'accreditation', title: 'MLSCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'MLSCN', body_full_name: 'Medical Laboratory Science Council of Nigeria', status: 'Full Accreditation', validity: '2020 - Present', accredited_programs: 'BMLS Medical Laboratory Science', display_order: 4, is_active: true, logo_url: null },
  { id: 9, entry_type: 'accreditation', title: 'PCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'PCN', body_full_name: 'Pharmacy Council of Nigeria', status: 'Provisional Accreditation', validity: '2023 - Present', accredited_programs: 'Doctor of Pharmacy (Pharm.D)', display_order: 5, is_active: true, logo_url: null },
  { id: 10, entry_type: 'achievement', title: 'WHO Grant Recipient', description: 'Received $500,000 grant for malaria research in the Niger Delta', rank: '', year: '2024', source: '', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 1, is_active: true, logo_url: null },
  { id: 11, entry_type: 'achievement', title: 'Best Teaching Hospital Partnership', description: 'Awarded by the Association of Medical Schools in Africa', rank: '', year: '2024', source: '', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 2, is_active: true, logo_url: null },
  { id: 12, entry_type: 'achievement', title: 'Innovation in Medical Education', description: 'Recognized for pioneering simulation-based learning', rank: '', year: '2023', source: '', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 3, is_active: true, logo_url: null },
  { id: 13, entry_type: 'achievement', title: 'Research Excellence Award', description: 'Highest number of publications per faculty in Nigerian medical schools', rank: '', year: '2022', source: '', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 4, is_active: true, logo_url: null },
  { id: 14, entry_type: 'achievement', title: 'SDG Champion Institution', description: 'Recognized for contributions to SDG 3 (Good Health & Well-being)', rank: '', year: '2021', source: '', accrediting_body: '', body_full_name: '', status: '', validity: '', accredited_programs: '', display_order: 5, is_active: true, logo_url: null },
];

export interface NonAcademicStaffData {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  category: string;
  category_display: string;
  employment_type: string;
  job_title: string;
  college_name: string | null;
  department_name: string | null;
  qualifications: string;
  responsibilities: string;
  research_interests: string;
  date_joined: string | null;
  office_location: string | null;
  photo_url: string | null;
  publications?: PublicationItem[];
}

export const mockNonAcademicStaff: NonAcademicStaffData[] = [
  { id: 1, employee_id: 'STF001', first_name: 'James', last_name: 'Okon', full_name: 'Mr. James Okon', email: 'j.okon@bmu.edu.ng', phone: '+234 803 222 0001', category: 'admin', category_display: 'Administrative', employment_type: 'full_time', job_title: 'Director of Student Affairs', college_name: null, department_name: 'Student Services', qualifications: 'MBA, B.Sc Public Admin', responsibilities: 'Student welfare and counseling\nStudent governance support\nDisciplinary matters\nStudent activities coordination', research_interests: '', date_joined: '2019-01-15', office_location: 'Admin Block, Room 301', photo_url: null },
  { id: 2, employee_id: 'STF002', first_name: 'Grace', last_name: 'Ebi', full_name: 'Mrs. Grace Ebi', email: 'registrar@bmu.edu.ng', phone: '+234 803 222 0002', category: 'admin', category_display: 'Administrative', employment_type: 'full_time', job_title: 'Registrar', college_name: null, department_name: 'Academic Affairs', qualifications: 'M.Ed, B.Sc Education', responsibilities: 'Academic records management\nStudent registration\nTranscript processing\nAcademic policy compliance', research_interests: 'Educational Administration, Policy Development', date_joined: '2019-02-01', office_location: 'Senate Building, Room 105', photo_url: null },
  { id: 3, employee_id: 'STF003', first_name: 'Michael', last_name: 'Douglas', full_name: 'Mr. Michael Douglas', email: 'finance@bmu.edu.ng', phone: '+234 803 222 0003', category: 'finance', category_display: 'Finance/Accounts', employment_type: 'full_time', job_title: 'Director of Finance', college_name: null, department_name: 'Finance & Accounts', qualifications: 'MBA, B.Sc Accounting, ACA', responsibilities: 'Budget planning and management\nFinancial reporting\nPayroll administration\nGrants and funding management', research_interests: 'Healthcare Finance, Public Financial Management', date_joined: '2019-01-20', office_location: 'Finance Block, Room 201', photo_url: null },
  { id: 4, employee_id: 'STF004', first_name: 'Sarah', last_name: 'Ibe', full_name: 'Mrs. Sarah Ibe', email: 'hr@bmu.edu.ng', phone: '+234 803 222 0004', category: 'hr', category_display: 'Human Resources', employment_type: 'full_time', job_title: 'Director of HR', college_name: null, department_name: 'Human Resources', qualifications: 'M.Sc HRM, B.Sc Psychology', responsibilities: 'Recruitment and staffing\nEmployee relations\nPerformance management\nTraining and development', research_interests: 'Organizational Behavior, Talent Management', date_joined: '2019-03-01', office_location: 'Admin Block, Room 205', photo_url: null },
];

export interface KeyMetricData {
  id: number;
  label: string;
  value: string;
  category: string;
  icon_name: string;
  description: string;
  display_order: number;
}

export const mockKeyMetrics: KeyMetricData[] = [
  { id: 1, label: 'Research Publications', value: '1,247+', category: 'research', icon_name: 'BookOpen', description: '', display_order: 1 },
  { id: 2, label: 'Citations', value: '8,500+', category: 'research', icon_name: 'TrendingUp', description: '', display_order: 2 },
  { id: 3, label: 'h-Index', value: '28', category: 'research', icon_name: 'Star', description: '', display_order: 3 },
  { id: 4, label: 'International Partnerships', value: '15+', category: 'partnership', icon_name: 'Globe', description: '', display_order: 4 },
  { id: 5, label: 'Faculty with PhD', value: '78%', category: 'academic', icon_name: 'Users', description: '', display_order: 5 },
  { id: 6, label: 'Licensure Exam Pass Rate', value: '94%', category: 'quality', icon_name: 'CheckCircle', description: '', display_order: 6 },
];

export interface PublicationData {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  type: string;
  doi?: string;
  citations: number;
  category: string;
  abstract?: string;
  keywords?: string[];
  pages?: string;
  volume?: string;
  issue?: string;
  pdfUrl?: string;
  downloadCount?: number;
}

export const mockPublications: PublicationData[] = [
  {
    id: 1, title: 'Artemisinin Resistance in Plasmodium falciparum: A Study from the Niger Delta Region',
    authors: ['Ekanem, E.', 'Okonkwo, J.', 'Amadi, C.'], journal: 'Malaria Journal', year: 2024, type: 'journal',
    doi: '10.1186/s12936-024-04567-x', citations: 12, category: 'Malaria Research',
    abstract: 'This study investigates the emergence and spread of artemisinin resistance in Plasmodium falciparum isolates from the Niger Delta region of Nigeria. We collected 500 clinical isolates from patients with uncomplicated malaria across 12 healthcare facilities. Our findings reveal a concerning increase in resistance markers, with 23% of isolates showing reduced susceptibility to artemisinin derivatives. Molecular analysis identified mutations in the kelch13 gene in 18% of samples. These findings highlight the urgent need for enhanced surveillance and alternative treatment strategies in the region.',
    keywords: ['Malaria', 'Artemisinin', 'Drug Resistance', 'Plasmodium falciparum', 'Niger Delta'], pages: '1-12', volume: '23', issue: '1', pdfUrl: '#', downloadCount: 145,
  },
  {
    id: 2, title: 'Hypertension Prevalence and Management in Rural Bayelsa Communities',
    authors: ['Ogu, M.', 'Ebi, G.', 'Douglas, H.'], journal: 'African Journal of Cardiology', year: 2024, type: 'journal',
    doi: '10.1016/j.afjca.2024.02.001', citations: 8, category: 'Non-Communicable Diseases',
    abstract: 'This cross-sectional study examined the prevalence, awareness, treatment, and control of hypertension among adults in rural Bayelsa State communities. A total of 1,200 participants aged 30-70 years were enrolled. The overall prevalence of hypertension was 32.4%, with only 28.3% aware of their status. Among those aware, 56.7% were on treatment, and only 18.9% had controlled blood pressure.',
    keywords: ['Hypertension', 'Rural Health', 'NCDs', 'Bayelsa', 'Cardiovascular'], pages: '45-56', volume: '15', issue: '2', pdfUrl: '#', downloadCount: 89,
  },
  {
    id: 3, title: 'Community Health Worker Impact on Maternal Health Outcomes in the Niger Delta',
    authors: ['Amadi, C.', 'Douglas, H.', 'Iruo, P.'], journal: 'BMC Pregnancy and Childbirth', year: 2023, type: 'journal',
    doi: '10.1186/s12884-023-05678-y', citations: 23, category: 'Maternal Health',
    abstract: 'This cluster-randomized controlled trial evaluated the impact of trained community health workers on maternal and neonatal health outcomes in hard-to-reach Niger Delta communities. Twenty communities were randomized to intervention or control groups.',
    keywords: ['Maternal Health', 'Community Health Workers', 'Nigeria', 'Niger Delta', 'MNCH'], pages: '1-15', volume: '23', issue: '156', pdfUrl: '#', downloadCount: 234,
  },
  {
    id: 4, title: 'Oil Spill Exposure and Respiratory Health: A 5-Year Cohort Study',
    authors: ['Orunaboka, T.', 'Kpodoh, T.', 'Ayibatari, B.'], journal: 'Environmental Health Perspectives', year: 2023, type: 'journal',
    doi: '10.1289/EHP10234', citations: 34, category: 'Environmental Health',
    abstract: 'This longitudinal cohort study examined the relationship between oil spill exposure and respiratory health outcomes among residents of oil-producing communities in Bayelsa State. We followed 800 adults for 5 years, tracking exposure through biomonitoring and lung function annually.',
    keywords: ['Oil Spill', 'Environmental Health', 'Respiratory', 'Air Pollution', 'Niger Delta'], pages: '234-245', volume: '131', issue: '4', pdfUrl: '#', downloadCount: 312,
  },
  {
    id: 5, title: 'Telemedicine Implementation in Resource-Limited Settings: The BMU Model',
    authors: ['Kpodoh, T.', 'Iruo, P.', 'Alagoa, D.'], journal: 'Journal of Telemedicine and Telecare', year: 2023, type: 'journal',
    doi: '10.1177/1357633X23104589', citations: 15, category: 'Health Systems',
    abstract: 'This implementation study describes the development and evaluation of a telemedicine system at Bayelsa Medical University designed to overcome healthcare access barriers in the Niger Delta.',
    keywords: ['Telemedicine', 'Digital Health', 'Health Access', 'Nigeria', 'Implementation Science'], pages: '456-468', volume: '29', issue: '6', pdfUrl: '#', downloadCount: 178,
  },
  {
    id: 6, title: 'Medical Education in the Niger Delta: Challenges and Opportunities',
    authors: ['Ekanem, E.', 'Nwosu, S.', 'Okonkwo, J.'], journal: 'Medical Teacher', year: 2022, type: 'journal',
    doi: '10.1080/0142159X.2022.2084567', citations: 19, category: 'Medical Education',
    abstract: 'This comprehensive review examines the unique challenges facing medical education in the Niger Delta region and identifies innovative strategies employed by Bayelsa Medical University.',
    keywords: ['Medical Education', 'Nigeria', 'Health Workforce', 'Curriculum', 'Niger Delta'], pages: '1234-1245', volume: '44', issue: '11', pdfUrl: '#', downloadCount: 267,
  },
  {
    id: 7, title: 'Stroke Burden and Risk Factors in the Niger Delta Population',
    authors: ['Orunaboka, T.', 'Ekanem, E.', 'Oweifa, T.'], journal: 'International Journal of Stroke', year: 2022, type: 'journal',
    doi: '10.1177/17474930221104567', citations: 27, category: 'Neuroscience',
    abstract: 'This population-based study provides the first comprehensive assessment of stroke burden in the Niger Delta region. Using WHO Stepwise approach, we surveyed 5,000 adults across Bayelsa State.',
    keywords: ['Stroke', 'Neuroscience', 'Cerebrovascular', 'Nigeria', 'Epidemiology'], pages: '678-689', volume: '17', issue: '7', pdfUrl: '#', downloadCount: 198,
  },
  {
    id: 8, title: 'Antimicrobial Resistance Patterns in Clinical Isolates from Bayelsa State',
    authors: ['Ebi, G.', 'Amadi, C.', 'Orunaboka, T.'], journal: 'Journal of Global Antimicrobial Resistance', year: 2022, type: 'journal',
    doi: '10.1016/j.jgar.2022.03.012', citations: 21, category: 'Infectious Diseases',
    abstract: 'This surveillance study analyzed antimicrobial resistance patterns in 2,400 clinical isolates from BMU Teaching Hospital between 2020-2022.',
    keywords: ['Antimicrobial Resistance', 'AMR', 'Nigeria', 'Hospital', 'Surveillance'], pages: '156-164', volume: '29', issue: '1', pdfUrl: '#', downloadCount: 223,
  },
];

export interface GrantData {
  id: number;
  title: string;
  description: string;
  amount: string;
  currency: string;
  funding_agency: string;
  principal_investigator: string | null;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  status: string;
  category: string;
  eligibility: string[];
  year: number;
}

export const mockResearchGrants: GrantData[] = [
  {
    id: 1, title: 'Malaria Research Innovation Grant',
    description: 'Funding for innovative research on malaria prevention, treatment, and vector control in the Niger Delta region.',
    amount: 'NGN 5,000,000.00 - NGN 15,000,000.00', currency: 'NGN', funding_agency: 'BMU Research Office',
    principal_investigator: null, start_date: null, end_date: null, deadline: '2025-03-31',
    status: 'active', category: 'Malaria Research',
    eligibility: ['BMU faculty', 'Postdoctoral researchers', 'Collaborating institutions'], year: 2025,
  },
  {
    id: 2, title: 'Non-Communicable Disease Research Fund',
    description: 'Support for research on diabetes, hypertension, and cardiovascular diseases in underserved communities.',
    amount: 'NGN 3,000,000.00 - NGN 10,000,000.00', currency: 'NGN', funding_agency: 'BMU Research Office',
    principal_investigator: null, start_date: null, end_date: null, deadline: '2025-04-15',
    status: 'active', category: 'NCD Research',
    eligibility: ['Early career researchers', 'Established faculty', 'Research centers'], year: 2025,
  },
  {
    id: 3, title: 'Environmental Health Impact Study Grant',
    description: 'Research funding for studies on oil spill health effects and environmental monitoring.',
    amount: 'NGN 8,000,000.00 - NGN 20,000,000.00', currency: 'NGN', funding_agency: 'BMU Research Office',
    principal_investigator: null, start_date: null, end_date: null, deadline: '2025-05-30',
    status: 'pending', category: 'Environmental Health',
    eligibility: ['Multi-disciplinary teams', 'External collaborators', 'Community partnerships'], year: 2025,
  },
  {
    id: 4, title: 'Young Investigator Research Award',
    description: 'Seed funding for early career researchers to establish independent research programs.',
    amount: 'NGN 2,000,000.00 - NGN 5,000,000.00', currency: 'NGN', funding_agency: 'BMU Research Office',
    principal_investigator: null, start_date: null, end_date: null, deadline: '2025-06-15',
    status: 'pending', category: 'Career Development',
    eligibility: ['Lecturers II & below', 'Within 5 years of PhD', 'First-time PIs'], year: 2025,
  },
  {
    id: 5, title: 'Maternal Health Innovation Grant',
    description: 'Support for research improving maternal and child health outcomes in rural communities.',
    amount: 'NGN 4,000,000.00 - NGN 12,000,000.00', currency: 'NGN', funding_agency: 'BMU Research Office',
    principal_investigator: null, start_date: null, end_date: null, deadline: '2025-07-31',
    status: 'pending', category: 'Maternal Health',
    eligibility: ['Nursing and public health faculty', 'Clinical researchers', 'Community health programs'], year: 2025,
  },
  {
    id: 6, title: 'Artemisinin Resistance Surveillance Network',
    description: 'Surveillance network for monitoring artemisinin resistance in the Niger Delta.',
    amount: 'USD 150,000.00', currency: 'USD', funding_agency: 'WHO/TDR',
    principal_investigator: 'Prof. Emmanuel Ekanem', start_date: '2023-01-01', end_date: '2024-12-31', deadline: null,
    status: 'completed', category: 'Malaria Research',
    eligibility: [], year: 2024,
  },
  {
    id: 7, title: 'Community-Based Diabetes Management Program',
    description: 'Community-based intervention program for diabetes management in rural Bayelsa.',
    amount: 'NGN 25,000,000.00', currency: 'NGN', funding_agency: 'Bayelsa State Government',
    principal_investigator: 'Prof. Michael Ogu', start_date: '2023-06-01', end_date: '2024-12-31', deadline: null,
    status: 'completed', category: 'NCD Research',
    eligibility: [], year: 2024,
  },
  {
    id: 8, title: 'Oil Spill Health Effects Cohort Study',
    description: 'Longitudinal cohort study on health effects of oil spill exposure.',
    amount: 'NGN 40,000,000.00', currency: 'NGN', funding_agency: 'NERFUND',
    principal_investigator: 'Dr. Timipa Orunaboka', start_date: '2022-01-01', end_date: '2024-06-30', deadline: null,
    status: 'completed', category: 'Environmental Health',
    eligibility: [], year: 2023,
  },
  {
    id: 9, title: 'Telemedicine Infrastructure Development',
    description: 'Development of telemedicine infrastructure for the Niger Delta region.',
    amount: 'NGN 30,000,000.00', currency: 'NGN', funding_agency: 'NITDA',
    principal_investigator: 'Dr. Tamaraebi Kpodoh', start_date: '2022-03-01', end_date: '2024-02-28', deadline: null,
    status: 'completed', category: 'Health Systems',
    eligibility: [], year: 2023,
  },
  {
    id: 10, title: 'Maternal Health Worker Training Initiative',
    description: 'Training initiative for community maternal health workers.',
    amount: 'USD 80,000.00', currency: 'USD', funding_agency: 'UNFPA',
    principal_investigator: 'Prof. Helen Douglas', start_date: '2022-06-01', end_date: '2023-12-31', deadline: null,
    status: 'completed', category: 'Maternal Health',
    eligibility: [], year: 2023,
  },
];

export interface GrantApplicationData {
  id: number;
  grant_id: number;
  grant_title: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  proposal_title: string;
  proposal_summary: string;
  proposed_budget: number | null;
  duration_months: number | null;
  status: string;
  status_display: string;
  reviewer_notes: string;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface EventData {
  id: number;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  event_type: string;
  event_type_display: string;
  category: string;
  category_display: string;
  location: string;
  featured_image: string | null;
  registration_open: boolean;
  registered_count: number;
  max_attendees: number | null;
  is_featured: boolean;
  fee: number | null;
  currency: string;
}

export const mockEvents: EventData[] = [
  { id: 1, slug: 'international-medical-conference-2024', title: 'International Medical Conference 2024', description: 'Join over 500 healthcare professionals from 30 countries discussing emerging infectious diseases, global health security, and the latest medical research.', event_date: '2024-12-10', start_time: '9:00 AM', end_time: '5:00 PM', event_type: 'conference', event_type_display: 'Conference', category: 'academic', category_display: 'Academic', location: 'BMU Main Auditorium, Yenagoa', featured_image: null, registration_open: true, registered_count: 320, max_attendees: 500, is_featured: true, fee: 50000, currency: 'NGN' },
  { id: 2, slug: 'matriculation-ceremony-2024', title: '2024/2025 Matriculation Ceremony', description: 'Official welcome ceremony for new students entering the 2024/2025 academic session. Parents and guardians are invited.', event_date: '2024-11-25', start_time: '10:00 AM', end_time: '1:00 PM', event_type: 'ceremony', event_type_display: 'Ceremony', category: 'academic', category_display: 'Academic', location: 'University Convocation Arena', featured_image: null, registration_open: true, registered_count: 1500, max_attendees: 2000, is_featured: false, fee: null, currency: 'NGN' },
  { id: 3, slug: 'medical-research-symposium', title: 'Medical Research Symposium', description: 'Annual research symposium showcasing cutting-edge medical research from BMU faculty and students.', event_date: '2024-12-05', start_time: '2:00 PM', end_time: '6:00 PM', event_type: 'symposium', event_type_display: 'Symposium', category: 'research', category_display: 'Research', location: 'Research Center Hall', featured_image: null, registration_open: true, registered_count: 180, max_attendees: 300, is_featured: false, fee: 15000, currency: 'NGN' },
  { id: 4, slug: 'healthcare-leadership-workshop', title: 'Healthcare Leadership Workshop', description: 'Professional development workshop for healthcare administrators and emerging leaders in the medical field.', event_date: '2024-12-15', start_time: '9:00 AM', end_time: '4:00 PM', event_type: 'workshop', event_type_display: 'Workshop', category: 'professional', category_display: 'Professional', location: 'College of Health Sciences', featured_image: null, registration_open: true, registered_count: 90, max_attendees: 150, is_featured: false, fee: 25000, currency: 'NGN' },
  { id: 5, slug: 'community-health-outreach', title: 'Community Health Outreach Program', description: 'Free medical screening and health education for residents of Yenagoa and surrounding communities.', event_date: '2024-11-30', start_time: '8:00 AM', end_time: '4:00 PM', event_type: 'outreach', event_type_display: 'Outreach', category: 'community', category_display: 'Community', location: 'Various Community Centers', featured_image: null, registration_open: false, registered_count: 1000, max_attendees: null, is_featured: false, fee: null, currency: 'NGN' },
  { id: 6, slug: 'alumni-homecoming-2024', title: 'Alumni Homecoming 2024', description: 'Annual gathering of BMU alumni featuring networking events, awards ceremony, and reunion activities.', event_date: '2024-12-20', start_time: '5:00 PM', end_time: '11:00 PM', event_type: 'social', event_type_display: 'Social', category: 'alumni', category_display: 'Alumni', location: 'University Grand Hall', featured_image: null, registration_open: true, registered_count: 450, max_attendees: 800, is_featured: false, fee: 10000, currency: 'NGN' },
];

export interface GalleryImageData {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string | null;
  event_date: string | null;
  photographer: string | null;
  location: string | null;
  created_at: string;
}

export const mockGalleryImages: GalleryImageData[] = [
  { id: 1, title: 'Matriculation Ceremony 2024', description: 'New students taking the matriculation oath at the convocation arena.', image_url: '/gallery/matriculation-2024.jpg', thumbnail_url: null, category: 'Ceremonies', event_date: '2024-11-25', photographer: 'BMU Media Team', location: 'Convocation Arena', created_at: '2024-11-25T12:00:00Z' },
  { id: 2, title: 'Medical Conference Keynote', description: 'Prof. Sarah Chen delivering the keynote address at the International Medical Conference.', image_url: '/gallery/conference-keynote.jpg', thumbnail_url: null, category: 'Conferences', event_date: '2024-12-10', photographer: 'BMU Media Team', location: 'Main Auditorium', created_at: '2024-12-10T14:00:00Z' },
  { id: 3, title: 'Research Lab Opening', description: 'Inauguration of the new molecular biology research laboratory.', image_url: '/gallery/lab-opening.jpg', thumbnail_url: null, category: 'Facilities', event_date: '2024-10-15', photographer: 'John Adewale', location: 'Research Centre', created_at: '2024-10-15T16:00:00Z' },
  { id: 4, title: 'Community Health Outreach', description: 'BMU medical students providing free health screenings in Yenagoa communities.', image_url: '/gallery/health-outreach.jpg', thumbnail_url: null, category: 'Community', event_date: '2024-11-30', photographer: 'BMU Media Team', location: 'Yenagoa', created_at: '2024-11-30T18:00:00Z' },
  { id: 5, title: 'Alumni Homecoming Gala', description: 'Annual alumni gathering and awards night.', image_url: '/gallery/alumni-gala.jpg', thumbnail_url: null, category: 'Events', event_date: '2024-12-20', photographer: 'PhotoPro Studios', location: 'University Grand Hall', created_at: '2024-12-20T23:00:00Z' },
  { id: 6, title: 'Campus Aerial View', description: 'Aerial view of the beautiful BMU campus.', image_url: '/gallery/campus-aerial.jpg', thumbnail_url: null, category: 'Campus', event_date: null, photographer: 'Drone Media', location: 'BMU Campus', created_at: '2024-09-01T10:00:00Z' },
  { id: 7, title: 'Library Reading Session', description: 'Students studying in the newly renovated library.', image_url: '/gallery/library-session.jpg', thumbnail_url: null, category: 'Campus', event_date: null, photographer: 'BMU Media Team', location: 'Central Library', created_at: '2024-10-05T15:00:00Z' },
  { id: 8, title: 'Sports Festival', description: 'Inter-college sports competition and awards.', image_url: '/gallery/sports-fest.jpg', thumbnail_url: null, category: 'Events', event_date: '2024-09-20', photographer: 'Sports Dept', location: 'Sports Complex', created_at: '2024-09-20T18:00:00Z' },
];

export interface EventRegistrationData {
  id: number;
  event_id: number;
  name: string;
  email: string;
  status: string;
  status_display: string;
  amount_paid: number | null;
  payment_status: string;
  payment_status_display: string;
  payment_reference: string;
  paid_at: string | null;
  registered_at: string;
}

export interface EventRegistrationInput {
  event_id: number;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
}

export interface PaymentInitializeInput {
  event_id: number;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
}

export interface PaymentInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  registration_id: number;
}

export interface PaymentVerifyResponse {
  status: string;
  message: string;
  registration: EventRegistrationData;
}

export interface GrantApplicationSubmitData {
  grant_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  proposal_title: string;
  proposal_summary: string;
  proposed_budget?: number;
  duration_months?: number;
}

export interface PartnerData {
  id: number;
  name: string;
  logo_url: string | null;
  description: string | null;
  website: string | null;
}

export const mockPartners: PartnerData[] = [
  { id: 1, name: 'World Health Organization', logo_url: null, description: 'Global health partnership for disease prevention and health promotion', website: 'https://www.who.int' },
  { id: 2, name: 'Bill & Melinda Gates Foundation', logo_url: null, description: 'Supporting innovative healthcare solutions and medical research', website: 'https://www.gatesfoundation.org' },
  { id: 3, name: 'National Institutes of Health', logo_url: null, description: 'Collaborative biomedical research and clinical trials', website: 'https://www.nih.gov' },
  { id: 4, name: 'United Nations Development Programme', logo_url: null, description: 'Sustainable development goals and capacity building', website: 'https://www.undp.org' },
  { id: 5, name: 'African Development Bank', logo_url: null, description: 'Infrastructure development and educational funding support', website: 'https://www.afdb.org' },
];

export interface InternationalPartnerData {
  id: number;
  name: string;
  slug: string;
  country: string;
  city: string | null;
  partner_type: string;
  partner_type_display: string;
  description: string;
  website: string | null;
  established_year: number | null;
  logo_url: string | null;
  banner_image_url: string | null;
  focus_areas: string[];
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  students_exchanged: number;
  joint_publications: number;
  joint_projects: number;
}

export const mockInternationalPartners: InternationalPartnerData[] = [
  { id: 1, name: 'World Health Organization', slug: 'who', country: 'Switzerland', city: 'Geneva', partner_type: 'ngo', partner_type_display: 'NGO/Non-profit', description: 'Collaboration on disease surveillance, outbreak response, and health systems strengthening in the Niger Delta.', website: null, established_year: 2020, logo_url: null, banner_image_url: null, focus_areas: ['Malaria control programs', 'Disease surveillance training', 'Emergency response capacity building'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 0, joint_publications: 12, joint_projects: 5 },
  { id: 2, name: 'UNICEF', slug: 'unicef', country: 'United States', city: 'New York', partner_type: 'ngo', partner_type_display: 'NGO/Non-profit', description: 'Partnership focused on maternal and child health, nutrition, and immunization programs.', website: null, established_year: 2020, logo_url: null, banner_image_url: null, focus_areas: ['Maternal health initiatives', 'Child nutrition programs', 'Immunization campaigns'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 0, joint_publications: 8, joint_projects: 4 },
  { id: 3, name: 'UNFPA', slug: 'unfpa', country: 'United States', city: 'New York', partner_type: 'ngo', partner_type_display: 'NGO/Non-profit', description: 'Joint programs on reproductive health, family planning, and population studies.', website: null, established_year: 2021, logo_url: null, banner_image_url: null, focus_areas: ['Family planning services', 'Youth health programs', 'Population research'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 0, joint_publications: 6, joint_projects: 3 },
  { id: 4, name: 'London School of Hygiene & Tropical Medicine', slug: 'lshtm', country: 'United Kingdom', city: 'London', partner_type: 'university', partner_type_display: 'University', description: 'Academic partnership for research collaboration, faculty exchange, and joint PhD supervision.', website: null, established_year: 2019, logo_url: null, banner_image_url: null, focus_areas: ['Joint research projects', 'Faculty exchange programs', 'PhD student supervision'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 8, joint_publications: 25, joint_projects: 6 },
  { id: 5, name: 'Johns Hopkins Bloomberg School of Public Health', slug: 'jhsph', country: 'United States', city: 'Baltimore', partner_type: 'university', partner_type_display: 'University', description: 'Research collaboration on public health surveillance, epidemiology, and health systems research.', website: null, established_year: 2019, logo_url: null, banner_image_url: null, focus_areas: ['Public health research', 'Epidemiological studies', 'Health policy research'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 5, joint_publications: 18, joint_projects: 4 },
  { id: 6, name: 'University of Oxford', slug: 'oxford', country: 'United Kingdom', city: 'Oxford', partner_type: 'university', partner_type_display: 'University', description: 'Collaboration on tropical disease research and clinical trials.', website: null, established_year: 2020, logo_url: null, banner_image_url: null, focus_areas: ['Malaria vaccine trials', 'Drug resistance studies', 'Clinical research training'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 6, joint_publications: 30, joint_projects: 7 },
  { id: 7, name: 'Federal Medical Centre, Yenagoa', slug: 'fmc-yenagoa', country: 'Nigeria', city: 'Yenagoa', partner_type: 'hospital', partner_type_display: 'Hospital/Medical Center', description: 'Primary teaching hospital partner providing clinical training and research facilities.', website: null, established_year: 2018, logo_url: null, banner_image_url: null, focus_areas: ['Clinical clerkships', 'Residency training', 'Joint clinical research'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 15, joint_publications: 10, joint_projects: 8 },
  { id: 8, name: 'Bayelsa State Ministry of Health', slug: 'bayelsa-moh', country: 'Nigeria', city: 'Yenagoa', partner_type: 'government', partner_type_display: 'Government Agency', description: 'Partnership for public health programs, disease surveillance, and health policy development.', website: null, established_year: 2019, logo_url: null, banner_image_url: null, focus_areas: ['Disease surveillance', 'Health policy research', 'Community health programs'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 0, joint_publications: 5, joint_projects: 10 },
  { id: 9, name: 'Niger Delta University', slug: 'niger-delta-university', country: 'Nigeria', city: 'Wilberforce Island', partner_type: 'university', partner_type_display: 'University', description: 'Inter-university collaboration for resource sharing and joint academic programs.', website: null, established_year: 2020, logo_url: null, banner_image_url: null, focus_areas: ['Resource sharing', 'Joint seminars', 'Student exchanges'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 20, joint_publications: 7, joint_projects: 4 },
  { id: 10, name: 'Public Health Reform Council of Nigeria', slug: 'phrcn', country: 'Nigeria', city: 'Abuja', partner_type: 'government', partner_type_display: 'Government Agency', description: 'Collaboration on public health training, certification, and professional development.', website: null, established_year: 2021, logo_url: null, banner_image_url: null, focus_areas: ['Public health training', 'Professional certification', 'Policy advocacy'], contact_person: null, contact_email: null, contact_phone: null, students_exchanged: 0, joint_publications: 3, joint_projects: 2 },
];

export interface PublicDocumentData {
  id: number;
  title: string;
  document_type: string;
  category: string;
  description: string | null;
  file: string | null;
  download_count: number;
  published_at: string | null;
}

export const mockPublicDocuments: PublicDocumentData[] = [
  { id: 1, title: 'University Prospectus 2024-2025', document_type: 'pdf', category: 'academic', description: 'Complete guide to programs, admissions, and campus life.', file: null, download_count: 1250, published_at: '2024-01-15' },
  { id: 2, title: 'Annual Report 2023', document_type: 'pdf', category: 'financial', description: 'Financial and operational report for the 2023 academic year.', file: null, download_count: 890, published_at: '2024-03-20' },
  { id: 3, title: 'Research Ethics Guidelines', document_type: 'pdf', category: 'research', description: 'Guidelines for conducting ethical research at BMU.', file: null, download_count: 2100, published_at: '2024-02-10' },
  { id: 4, title: 'Academic Calendar 2024-2025', document_type: 'pdf', category: 'academic', description: 'Important dates and academic events for the current session.', file: null, download_count: 3200, published_at: '2024-04-01' },
  { id: 5, title: 'Student Handbook', document_type: 'pdf', category: 'student', description: 'Essential information for students about policies and services.', file: null, download_count: 1800, published_at: '2024-01-30' },
  { id: 6, title: 'Strategic Plan 2023-2028', document_type: 'pdf', category: 'strategic', description: 'Five-year strategic roadmap for university development.', file: null, download_count: 650, published_at: '2024-02-28' },
  { id: 7, title: 'Financial Statements 2023', document_type: 'pdf', category: 'financial', description: 'Audited financial statements for the 2023 fiscal year.', file: null, download_count: 430, published_at: '2024-03-15' },
  { id: 8, title: 'Admissions Policy', document_type: 'pdf', category: 'admissions', description: 'Policies and procedures for undergraduate and postgraduate admissions.', file: null, download_count: 1500, published_at: '2024-01-20' },
  { id: 9, title: 'Annual Impact Report 2024', document_type: 'pdf', category: 'strategic', description: 'Comprehensive report on BMU\'s SDG contributions and community impact for the 2024 academic year.', file: null, download_count: 1250, published_at: '2025-03-15' },
  { id: 10, title: 'Annual Impact Report 2023', document_type: 'pdf', category: 'strategic', description: 'Detailed overview of BMU\'s impact on health, education, and gender equality in 2023.', file: null, download_count: 2100, published_at: '2024-03-20' },
  { id: 11, title: 'Annual Impact Report 2022', document_type: 'pdf', category: 'strategic', description: 'Baseline impact report establishing key metrics for THE Impact Rankings submission.', file: null, download_count: 1850, published_at: '2023-04-10' },
];

/* ─── Campus Life: Dedicated Models ─── */

export interface CampusFeatureData {
  id: number;
  section_key: string;
  section_key_display: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  display_order: number;
}

export const mockCampusFeatures: CampusFeatureData[] = [
  { id: 1, section_key: 'housing', section_key_display: 'Residential Life', title: 'Male Hostel', description: 'Fully furnished rooms with 24/7 security, common rooms, and study areas. Capacity: 400 students.', icon: 'Building2', image: null, display_order: 1 },
  { id: 2, section_key: 'housing', section_key_display: 'Residential Life', title: 'Female Hostel', description: 'Secure and comfortable accommodation with lounge areas, laundry facilities, and kitchenettes. Capacity: 400 students.', icon: 'Building2', image: null, display_order: 2 },
  { id: 3, section_key: 'housing', section_key_display: 'Residential Life', title: 'International House', description: 'Premium accommodation for international and postgraduate students with en-suite rooms and wireless internet.', icon: 'Globe', image: null, display_order: 3 },
  { id: 4, section_key: 'housing', section_key_display: 'Residential Life', title: 'Student Apartments', description: 'Self-contained apartments for final-year and married students with living, dining, and kitchen areas.', icon: 'Home', image: null, display_order: 4 },
  { id: 5, section_key: 'housing', section_key_display: 'Residential Life', title: 'Hostel Amenities', description: 'Common rooms, TV lounges, study carrels, mini-marts, and recreational areas in every hall.', icon: 'Wifi', image: null, display_order: 5 },
  { id: 6, section_key: 'housing', section_key_display: 'Residential Life', title: 'Residential Life Programs', description: 'Floor meetings, cultural nights, wellness checks, and peer mentoring programs in each hall.', icon: 'Users', image: null, display_order: 6 },
  { id: 7, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Main Cafeteria', description: 'Buffet-style dining hall serving breakfast, lunch, and dinner with diverse menu options daily.', icon: 'UtensilsCrossed', image: null, display_order: 1 },
  { id: 8, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Food Court', description: 'Multiple food vendors offering Nigerian, continental, and fast-food options in a food-court setting.', icon: 'Store', image: null, display_order: 2 },
  { id: 9, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Coffee & Snack Bar', description: 'Casual cafe serving beverages, pastries, and light snacks between classes.', icon: 'Coffee', image: null, display_order: 3 },
  { id: 10, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Meal Plans', description: 'Flexible meal plans from 7 to 21 meals per week. All plans include dietary accommodation.', icon: 'ClipboardCheck', image: null, display_order: 4 },
  { id: 11, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Dietary Options', description: 'Vegetarian, vegan, halal, and special dietary needs accommodated with advance notice.', icon: 'Leaf', image: null, display_order: 5 },
  { id: 12, section_key: 'dining', section_key_display: 'Dining & Nutrition', title: 'Nutrition Services', description: 'Registered nutritionists available for dietary counseling and meal planning consultations.', icon: 'Heart', image: null, display_order: 6 },
  { id: 13, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'University Health Centre', description: 'On-campus clinic staffed by qualified doctors and nurses providing primary care, emergency services, and referrals.', icon: 'Stethoscope', image: null, display_order: 1 },
  { id: 14, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'Counseling Services', description: 'Professional counselors offering individual and group sessions for stress, anxiety, and personal challenges.', icon: 'HeartHandshake', image: null, display_order: 2 },
  { id: 15, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'Fitness Centre', description: 'Modern gym with cardio and weight equipment, fitness classes, and personal training sessions.', icon: 'Dumbbell', image: null, display_order: 3 },
  { id: 16, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'Sports Complex', description: 'Multi-purpose indoor and outdoor courts for basketball, volleyball, badminton, and table tennis.', icon: 'Trophy', image: null, display_order: 4 },
  { id: 17, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'Swimming Pool', description: 'Olympic-size swimming pool with lap lanes, swimming classes, and recreational swim sessions.', icon: 'Waves', image: null, display_order: 5 },
  { id: 18, section_key: 'wellness', section_key_display: 'Health & Wellness', title: 'Wellness Programs', description: 'Yoga, meditation, health talks, fitness challenges, and annual health screening events.', icon: 'Sparkles', image: null, display_order: 6 },
  { id: 19, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Student Union Government', description: 'Elected student representatives advocating for student welfare and organizing campus-wide events.', icon: 'Vote', image: null, display_order: 1 },
  { id: 20, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Medical Students Association', description: 'Pre-professional organization for clinical skills workshops, conferences, and community health outreaches.', icon: 'Syringe', image: null, display_order: 2 },
  { id: 21, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Research Club', description: 'For students interested in medical research with journal clubs, poster sessions, and mentorship.', icon: 'FlaskConical', image: null, display_order: 3 },
  { id: 22, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Cultural Society', description: 'Celebrating diversity through cultural nights, traditional music, dance performances, and food festivals.', icon: 'Palette', image: null, display_order: 4 },
  { id: 23, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Debate & Press Club', description: 'Develop public speaking, debate, and journalism skills through competitions and university publications.', icon: 'Microphone', image: null, display_order: 5 },
  { id: 24, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Sports & Recreation Club', description: 'Organizes intramural sports, inter-college competitions, and recreational outdoor activities.', icon: 'Activity', image: null, display_order: 6 },
  { id: 25, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Community Service Club', description: 'Volunteer initiatives including health outreaches, environmental clean-ups, and charity fundraisers.', icon: 'HandHeart', image: null, display_order: 7 },
  { id: 26, section_key: 'organizations', section_key_display: 'Student Organizations', title: 'Music & Drama Society', description: 'For musically and dramatically inclined students featuring choir, band, and theatrical productions.', icon: 'Music', image: null, display_order: 8 },
  { id: 27, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'International Student Office', description: 'Dedicated support for visa processing, orientation, cultural adjustment, and immigration advising.', icon: 'Globe', image: null, display_order: 1 },
  { id: 28, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'Gender Equity Office', description: 'Promoting gender equality through policies, awareness campaigns, and support services.', icon: 'Equal', image: null, display_order: 2 },
  { id: 29, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'Accessibility Services', description: 'Academic accommodations, assistive technologies, and accessible facilities for students with disabilities.', icon: 'Accessibility', image: null, display_order: 3 },
  { id: 30, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'Interfaith Centre', description: 'Multi-faith prayer rooms, chaplaincy services, and interfaith dialogue programs for spiritual well-being.', icon: 'Church', image: null, display_order: 4 },
  { id: 31, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'Cultural Exchange Programs', description: 'Student exchange, study abroad, and cultural immersion programs with partner universities.', icon: 'Plane', image: null, display_order: 5 },
  { id: 32, section_key: 'diversity', section_key_display: 'Diversity & Inclusion', title: 'Inclusion Initiatives', description: 'Workshops, awareness campaigns, and policy advocacy fostering a culture of respect and belonging.', icon: 'Heart', image: null, display_order: 6 },
  { id: 33, section_key: 'safety', section_key_display: 'Safety & Security', title: 'Campus Security', description: 'Professional security personnel patrolling the campus 24/7, with response time under 5 minutes.', icon: 'Shield', image: null, display_order: 1 },
  { id: 34, section_key: 'safety', section_key_display: 'Safety & Security', title: 'Emergency Call Points', description: 'Strategically placed emergency phones across campus that connect directly to security control.', icon: 'Phone', image: null, display_order: 2 },
  { id: 35, section_key: 'safety', section_key_display: 'Safety & Security', title: 'CCTV Surveillance', description: 'High-definition cameras covering all public areas, entrances, parking lots, and walkways.', icon: 'Camera', image: null, display_order: 3 },
  { id: 36, section_key: 'safety', section_key_display: 'Safety & Security', title: 'Student ID System', description: 'Electronic access control at all residence halls and academic buildings using student ID cards.', icon: 'IdCard', image: null, display_order: 4 },
  { id: 37, section_key: 'safety', section_key_display: 'Safety & Security', title: 'Campus Shuttle', description: 'Free evening shuttle service operating on fixed routes across campus for student safety.', icon: 'Bus', image: null, display_order: 5 },
  { id: 38, section_key: 'safety', section_key_display: 'Safety & Security', title: 'Emergency Response Team', description: 'Trained first responders available 24/7 for medical emergencies, fire safety, and disaster response.', icon: 'Ambulance', image: null, display_order: 6 },
  { id: 39, section_key: 'virtual_tour', section_key_display: 'Virtual Tour', title: '360° Campus Tour', description: 'Interactive panoramic views of the main campus, lecture halls, and residential areas.', icon: 'Eye', image: null, display_order: 1 },
  { id: 40, section_key: 'virtual_tour', section_key_display: 'Virtual Tour', title: 'Virtual Lab Tour', description: 'Walk through our state-of-the-art research and teaching laboratories.', icon: 'FlaskConical', image: null, display_order: 2 },
  { id: 41, section_key: 'virtual_tour', section_key_display: 'Virtual Tour', title: 'Library Virtual Visit', description: 'Explore our medical library\'s collections, study spaces, and digital resources.', icon: 'BookOpen', image: null, display_order: 3 },
  { id: 42, section_key: 'virtual_tour', section_key_display: 'Virtual Tour', title: 'Sports Facilities Tour', description: 'See our gym, swimming pool, sports complex, and outdoor courts.', icon: 'Trophy', image: null, display_order: 4 },
  { id: 43, section_key: 'virtual_tour', section_key_display: 'Virtual Tour', title: 'Healthcare Facility Tour', description: 'Explore our teaching hospital, simulation center, and clinical skills labs.', icon: 'Stethoscope', image: null, display_order: 5 },
];

export interface CampusStatData {
  id: number;
  label: string;
  value: string;
  display_order: number;
}

export const mockCampusStats: CampusStatData[] = [
  { id: 1, label: 'Students', value: '3,500+', display_order: 1 },
  { id: 2, label: 'Student Organizations', value: '50+', display_order: 2 },
  { id: 3, label: 'Campus Size', value: '200+ Acres', display_order: 3 },
  { id: 4, label: 'Residential Halls', value: '6', display_order: 4 },
  { id: 5, label: 'Dining Options', value: '4', display_order: 5 },
  { id: 6, label: 'Sports Facilities', value: '8', display_order: 6 },
];

export interface CampusTestimonialData {
  id: number;
  name: string;
  program: string | null;
  quote: string;
  image: string | null;
}

export const mockCampusTestimonials: CampusTestimonialData[] = [
  { id: 1, name: 'Sarah Okon', program: 'MBBS, Final Year', quote: 'Living on campus has been the best part of my medical education. The community is incredibly supportive, and I\'ve made friends from all over Nigeria.', image: null },
  { id: 2, name: 'Emeka Okafor', program: 'B.Sc. Nursing, Year 3', quote: 'From the fitness centre to the study groups in my hall, everything I need is right here. The residential advisors truly care about our well-being.', image: null },
  { id: 3, name: 'Fatima Usman', program: 'M.P.H., Postgraduate', quote: 'As an international student, I was nervous about moving to a new country. The International Student Office made the transition seamless.', image: null },
  { id: 4, name: 'David Adeleke', program: 'MBBS, Year 4', quote: 'The student organizations here are incredible. Through the Research Club, I\'ve presented at two international conferences and published a paper.', image: null },
];

export interface CampusContactInfoData {
  id: number;
  address: string | null;
  phone: string | null;
  email: string | null;
  office_hours: string | null;
}

export interface PeopleStatsData {
  leadership_count: number;
  faculty_count: number;
  staff_count: number;
  total_personnel: number;
  department_count: number;
}

export const mockPeopleStats: PeopleStatsData = {
  leadership_count: 12,
  faculty_count: 150,
  staff_count: 200,
  total_personnel: 362,
  department_count: 12,
};

export interface CTAStatsData {
  undergraduate_programs: number;
  postgraduate_programs: number;
  research_centers: number;
  international_partners: number;
}

export const mockCTAStats: CTAStatsData = {
  undergraduate_programs: 20,
  postgraduate_programs: 15,
  research_centers: 8,
  international_partners: 28,
};

export interface FundingOrganizationData {
  id: number;
  name: string;
  acronym: string;
  logo: string | null;
  website: string;
  description: string;
  total_funding: number;
  project_count: number;
}

export const mockFundingOrganizations: FundingOrganizationData[] = [
  { id: 1, name: 'Tertiary Education Trust Fund', acronym: 'TETFUND', logo: null, website: 'https://www.tetfund.gov.ng', description: 'Federal government agency established to provide funding for public tertiary institutions for infrastructure, research, and academic staff development.', total_funding: 1100000000, project_count: 5 },
  { id: 2, name: 'Nigerian Content Development and Monitoring Board', acronym: 'NCDMB', logo: null, website: 'https://www.ncdmb.gov.ng', description: 'Parastatal of the Federal Government of Nigeria that promotes Nigerian content development in the oil and gas industry.', total_funding: 350000000, project_count: 3 },
  { id: 3, name: 'World Health Organization', acronym: 'WHO', logo: null, website: 'https://www.who.int', description: 'Provides technical and financial support for health research, disease control, and health systems strengthening at BMU.', total_funding: 205000000, project_count: 2 },
  { id: 4, name: 'Nigerian Medical Association', acronym: 'NMA', logo: null, website: 'https://www.nma.org.ng', description: 'Supports medical education, research, and professional development at BMU.', total_funding: 45000000, project_count: 1 },
  { id: 5, name: 'Bayelsa State Government', acronym: 'Bayelsa Govt', logo: null, website: 'https://www.bayelsa.gov.ng', description: 'Provides funding for infrastructure development, scholarships, and health programs at BMU.', total_funding: 350000000, project_count: 2 },
];

export interface PublicationItem {
  id?: number;
  title: string;
  year: number;
  journal: string;
  citations?: number;
  doi?: string | null;
  url?: string | null;
}

export interface FundedProjectImageData {
  image: string;
  caption: string;
  order: number;
}

export interface FundedProjectData {
  id: number;
  title: string;
  organization_id: number;
  organization_name: string;
  amount: number;
  principal_investigator: string;
  impact: string;
  year: number;
  status: string;
  description: string;
  image: string | null;
  completion_date: string | null;
  gallery_images?: FundedProjectImageData[];
}

export const mockFundedProjects: FundedProjectData[] = [
  { id: 1, title: 'Construction of Modern Medical Research Laboratory', organization_id: 1, organization_name: 'TETFUND', amount: 250000000, principal_investigator: 'Prof. John Okonkwo', impact: '12,847 patients served across 45 communities', year: 2024, status: 'ongoing', description: 'Construction of a state-of-the-art medical research laboratory equipped with modern diagnostic and research equipment.', image: null, completion_date: null },
  { id: 2, title: 'Academic Staff Development Program (PhD)', organization_id: 1, organization_name: 'TETFUND', amount: 180000000, principal_investigator: '', impact: '25 staff enrolled in PhD programs', year: 2024, status: 'ongoing', description: 'Sponsorship of 25 academic staff for PhD programs in various medical specialties.', image: null, completion_date: null },
  { id: 3, title: 'E-Library Infrastructure Upgrade', organization_id: 1, organization_name: 'TETFUND', amount: 120000000, principal_investigator: '', impact: 'Digital access for 5,000+ students', year: 2023, status: 'completed', description: 'Upgrade of the university e-library with high-speed internet, digital databases, and modern computing facilities.', image: null, completion_date: null },
  { id: 4, title: 'Medical Simulation Centre', organization_id: 1, organization_name: 'TETFUND', amount: 200000000, principal_investigator: '', impact: '500+ students trained annually', year: 2023, status: 'completed', description: 'Establishment of a medical simulation centre for clinical skills training using high-fidelity mannequins and VR technology.', image: null, completion_date: null },
  { id: 5, title: 'University Teaching Hospital Equipment', organization_id: 1, organization_name: 'TETFUND', amount: 350000000, principal_investigator: '', impact: 'Modern equipment for 15 hospital departments', year: 2022, status: 'completed', description: 'Procurement and installation of modern medical equipment for the BMU Teaching Hospital.', image: null, completion_date: null },
  { id: 6, title: 'Oil and Gas Occupational Health Centre', organization_id: 2, organization_name: 'NCDMB', amount: 180000000, principal_investigator: 'Dr. Peter Iruo', impact: '', year: 2024, status: 'ongoing', description: 'Establishment of a specialized occupational health centre for oil and gas industry worker health and safety.', image: null, completion_date: null },
  { id: 7, title: 'Environmental Health Research Programme', organization_id: 2, organization_name: 'NCDMB', amount: 95000000, principal_investigator: 'Prof. Chioma Amadi', impact: '8 communities surveyed', year: 2024, status: 'ongoing', description: 'Research program studying the health impact of oil exploration on host communities.', image: null, completion_date: null },
  { id: 8, title: 'Community Health Outreach in Oil-Producing Areas', organization_id: 2, organization_name: 'NCDMB', amount: 75000000, principal_investigator: 'Dr. Grace Ebi', impact: '20 communities reached', year: 2023, status: 'completed', description: 'Mobile health outreach program providing free medical services to 20 communities in oil-producing areas.', image: null, completion_date: null },
  { id: 9, title: 'Malaria Elimination Research Initiative', organization_id: 3, organization_name: 'WHO', amount: 120000000, principal_investigator: 'Prof. John Okonkwo', impact: '40% reduction in target areas', year: 2024, status: 'ongoing', description: 'Research initiative focused on developing new strategies for malaria elimination in the Niger Delta region.', image: null, completion_date: null },
  { id: 10, title: 'Maternal and Child Health Improvement Project', organization_id: 3, organization_name: 'WHO', amount: 85000000, principal_investigator: 'Dr. Adaeze Nwosu', impact: '30% reduction in maternal mortality', year: 2023, status: 'completed', description: 'Community-based intervention program to reduce maternal and child mortality in Bayelsa State.', image: null, completion_date: null },
  { id: 11, title: 'Continuing Medical Education Programme', organization_id: 4, organization_name: 'NMA', amount: 45000000, principal_investigator: '', impact: '200+ practitioners trained', year: 2024, status: 'ongoing', description: 'Annual continuing medical education program for healthcare professionals across Bayelsa State.', image: null, completion_date: null },
  { id: 12, title: 'Free Medical Mission Programme', organization_id: 5, organization_name: 'Bayelsa Govt', amount: 150000000, principal_investigator: '', impact: '5,000+ patients treated annually', year: 2024, status: 'ongoing', description: 'Quarterly free medical missions providing consultations, surgeries, and medications to underserved communities.', image: null, completion_date: null },
  { id: 13, title: 'Scholarship Scheme for Indigent Students', organization_id: 5, organization_name: 'Bayelsa Govt', amount: 200000000, principal_investigator: '', impact: '500 students supported', year: 2023, status: 'completed', description: 'Scholarship program supporting 500 indigent students studying medicine and health sciences.', image: null, completion_date: null },
];

export interface FundingStatsData {
  total_funding: number;
  project_count: number;
  organization_count: number;
  organizations: Array<{
    id: number;
    name: string;
    acronym: string;
    logo: string | null;
    project_count: number;
  }>;
}

export const mockFundingStats: FundingStatsData = {
  total_funding: 2050000000,
  project_count: 13,
  organization_count: 5,
  organizations: [
    { id: 1, name: 'Tertiary Education Trust Fund', acronym: 'TETFUND', logo: null, project_count: 5 },
    { id: 2, name: 'Nigerian Content Development and Monitoring Board', acronym: 'NCDMB', logo: null, project_count: 3 },
    { id: 3, name: 'World Health Organization', acronym: 'WHO', logo: null, project_count: 2 },
    { id: 4, name: 'Nigerian Medical Association', acronym: 'NMA', logo: null, project_count: 1 },
    { id: 5, name: 'Bayelsa State Government', acronym: 'Bayelsa Govt', logo: null, project_count: 2 },
  ],
};

export const mockCampusContactInfo: CampusContactInfoData = {
  id: 1,
  address: 'Student Affairs Division, BMU Main Campus, Elebele, Yenagoa',
  phone: '+234 803 111 0025',
  email: 'studentaffairs@bmu.edu.ng',
  office_hours: 'Monday - Friday: 8:00 AM - 5:00 PM | Saturday: 9:00 AM - 1:00 PM',
};

export interface CampusImageData {
  id: number;
  title: string;
  caption: string | null;
  image: string;
  display_order: number;
}

export const mockCampusImages: CampusImageData[] = [
  { id: 1, title: 'BMU Main Campus', caption: 'The entrance to Bayelsa Medical University', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop', display_order: 1 },
  { id: 2, title: 'University Library', caption: 'A modern library with extensive medical collections', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop', display_order: 2 },
  { id: 3, title: 'Medical Laboratory', caption: 'State-of-the-art laboratory facilities for research and training', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop', display_order: 3 },
  { id: 4, title: 'Campus Garden', caption: 'Lush green spaces for relaxation and study', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop', display_order: 4 },
];

export interface CampusVideoData {
  id: number;
  title: string;
  description: string | null;
  video_type: 'url' | 'upload';
  video_url: string | null;
  video_file: string | null;
  thumbnail: string | null;
  embed_url: string;
  display_order: number;
}

export const mockCampusVideo: CampusVideoData = {
  id: 1,
  title: 'Experience Our Campus',
  description: 'Take a virtual tour of BMU\'s state-of-the-art facilities',
  video_type: 'url',
  video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  video_file: null,
  thumbnail: null,
  embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  display_order: 1,
};

export interface AcademicEventData {
  id: number;
  academic_year: string;
  term: string | null;
  term_display: string | null;
  title: string;
  event_type: string;
  event_type_display: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_important: boolean;
}

export interface AdmissionRequirementData {
  id: number;
  category: string;
  category_display: string;
  title: string;
  items: string[];
  display_order: number;
}

export interface ImportantDateData {
  id: number;
  event: string;
  date: string;
  status: string;
  status_display: string;
  description: string;
}

export const mockAdmissionRequirements: AdmissionRequirementData[] = [
  { id: 1, category: 'undergraduate', category_display: 'Undergraduate', title: 'General Requirements', display_order: 1, items: ['Five (5) O-level Credit Passes at NOT MORE THAN TWO (2) SITTINGS', 'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Minimum UTME score of 180', 'Must be at least 16 years of age'] },
  { id: 2, category: 'undergraduate', category_display: 'Undergraduate', title: 'Document Requirements', display_order: 2, items: ['Completed Application Form', 'O-Level Results (WAEC/NECO/NABTEB)', 'UTME Result Slip', 'Birth Certificate or Age Declaration', 'Certificate of Origin', 'Recent Passport Photographs (4 copies)', 'Medical Fitness Report'] },
  { id: 3, category: 'postgraduate', category_display: 'Postgraduate', title: 'General Requirements', display_order: 1, items: ["Bachelor degree in relevant field with at least Second Class Upper division", "NYSC discharge/exemption certificate", "Transcript of academic records from previous institution", "Three Referee Reports", "Statement of Purpose", "Curriculum Vitae"] },
  { id: 4, category: 'postgraduate', category_display: 'Postgraduate', title: 'Document Requirements', display_order: 2, items: ['Completed Application Form', 'Bachelor Degree Certificate', 'NYSC Discharge/Exemption Certificate', 'Academic Transcripts', 'Birth Certificate or Age Declaration', 'Certificate of Origin', 'Recent Passport Photographs (6 copies)', 'Proof of payment of application fee'] },
];

export const mockImportantDates: ImportantDateData[] = [
  { id: 1, event: 'Application Opening for 2025/2026 Session', date: '2025-06-01', status: 'upcoming', status_display: 'Upcoming', description: '' },
  { id: 2, event: 'UTME / Direct Entry Application Deadline', date: '2025-08-30', status: 'upcoming', status_display: 'Upcoming', description: '' },
  { id: 3, event: 'Postgraduate Application Deadline', date: '2025-09-15', status: 'upcoming', status_display: 'Upcoming', description: '' },
  { id: 4, event: 'Entrance Examination Date', date: '2025-09-20', status: 'upcoming', status_display: 'Upcoming', description: '' },
  { id: 5, event: 'Interview for Shortlisted Candidates', date: '2025-10-05', status: 'upcoming', status_display: 'Upcoming', description: 'Interviews for postgraduate and selected undergraduate programs' },
  { id: 6, event: 'Admission List Publication', date: '2025-10-30', status: 'upcoming', status_display: 'Upcoming', description: '' },
  { id: 7, event: 'Registration and Orientation Week', date: '2025-11-10', status: 'upcoming', status_display: 'Upcoming', description: 'Registration for new students begins' },
  { id: 8, event: 'First Semester Lectures Begin', date: '2025-11-24', status: 'upcoming', status_display: 'Upcoming', description: '' },
];

export const mockAcademicEvents: AcademicEventData[] = [
  { id: 1, academic_year: '2024/2025', term: 'first', term_display: 'First Semester', title: 'Resumption - Freshers', event_type: 'resumption', event_type_display: 'Resumption', description: 'Arrival and registration for new students.', start_date: '2024-09-16T00:00:00', end_date: null, is_important: true },
  { id: 2, academic_year: '2024/2025', term: 'first', term_display: 'First Semester', title: 'Lectures Begin', event_type: 'academic', event_type_display: 'Academic', description: 'Start of lectures for all students.', start_date: '2024-09-30T00:00:00', end_date: null, is_important: true },
  { id: 3, academic_year: '2024/2025', term: 'first', term_display: 'First Semester', title: 'Matriculation Ceremony', event_type: 'ceremony', event_type_display: 'Ceremony', description: 'Formal induction of new students into the university.', start_date: '2024-10-14T00:00:00', end_date: null, is_important: true },
  { id: 4, academic_year: '2024/2025', term: 'first', term_display: 'First Semester', title: 'First Semester Examinations', event_type: 'exam', event_type_display: 'Examination', description: 'First semester examinations for all students.', start_date: '2024-12-09T00:00:00', end_date: '2024-12-20T00:00:00', is_important: true },
  { id: 5, academic_year: '2024/2025', term: 'second', term_display: 'Second Semester', title: 'Second Semester Begins', event_type: 'resumption', event_type_display: 'Resumption', description: 'Resumption for second semester.', start_date: '2025-01-13T00:00:00', end_date: null, is_important: true },
  { id: 6, academic_year: '2024/2025', term: 'second', term_display: 'Second Semester', title: 'Second Semester Examinations', event_type: 'exam', event_type_display: 'Examination', description: 'Second semester examinations.', start_date: '2025-04-28T00:00:00', end_date: '2025-05-09T00:00:00', is_important: true },
  { id: 7, academic_year: '2024/2025', term: null, term_display: null, title: 'Academic Session Ends', event_type: 'holiday', event_type_display: 'Holiday', description: 'End of academic session.', start_date: '2025-06-30T00:00:00', end_date: null, is_important: false },
];

export interface BookData {
  id: number;
  title: string;
  authors: string;
  isbn: string | null;
  resource_type: string;
  publication_year: number | null;
  description: string;
}

export const mockBooks: BookData[] = [
  { id: 1, title: 'Principles of Internal Medicine', authors: 'Harrison et al.', isbn: '978-0-07-180215-3', resource_type: 'reference', publication_year: 2022, description: 'Comprehensive guide to internal medicine covering diagnosis and treatment.' },
  { id: 2, title: 'Gray\'s Anatomy for Students', authors: 'Drake, Vogl, Mitchell', isbn: '978-0-323-39304-1', resource_type: 'textbook', publication_year: 2023, description: 'Essential anatomy textbook with clinical correlations.' },
  { id: 3, title: 'Robbins Basic Pathology', authors: 'Kumar, Abbas, Aster', isbn: '978-0-323-35317-5', resource_type: 'textbook', publication_year: 2021, description: 'Foundational pathology textbook for medical students.' },
  { id: 4, title: 'Oxford Handbook of Clinical Medicine', authors: 'Longmore et al.', isbn: '978-0-19-880840-0', resource_type: 'handbook', publication_year: 2023, description: 'Portable clinical reference for medical practice.' },
  { id: 5, title: 'Nelson Textbook of Pediatrics', authors: 'Kliegman et al.', isbn: '978-0-323-67352-5', resource_type: 'textbook', publication_year: 2024, description: 'Comprehensive pediatric medicine reference.' },
  { id: 6, title: 'Williams Gynecology', authors: 'Hoffman et al.', isbn: '978-0-07-184898-4', resource_type: 'reference', publication_year: 2022, description: 'Clinical gynecology reference for practitioners.' },
];

export interface DigitalResourceData {
  id: number;
  name: string;
  description: string;
  resource_type: string;
  url: string;
}

export const mockDigitalResources: DigitalResourceData[] = [
  { id: 1, name: 'PubMed Central', description: 'Free full-text archive of biomedical and life sciences journal literature.', resource_type: 'database', url: 'https://www.ncbi.nlm.nih.gov/pmc/' },
  { id: 2, name: 'BMU E-Journal Portal', description: 'Access to thousands of academic journals across medical and health sciences.', resource_type: 'portal', url: 'https://ejournals.bmu.edu.ng' },
  { id: 3, name: 'Cochrane Library', description: 'Collection of high-quality systematic reviews in healthcare.', resource_type: 'database', url: 'https://www.cochranelibrary.com' },
  { id: 4, name: 'BMU Institutional Repository', description: 'Digital archive of BMU research publications and theses.', resource_type: 'repository', url: 'https://repository.bmu.edu.ng' },
];

export interface ExchangeProgramData {
  id: number;
  title: string;
  slug: string;
  program_type: string;
  program_type_display: string;
  partner: InternationalPartnerData;
  duration_weeks: number;
  start_date: string | null;
  end_date: string | null;
  application_deadline: string | null;
  description: string;
  eligibility_criteria: string[];
  benefits: string[];
  costs: Record<string, string>;
  total_slots: number;
  available_slots: number;
  status: string;
  status_display: string;
  banner_image_url: string | null;
  contact_email: string | null;
}

export const mockExchangePrograms: ExchangeProgramData[] = [
  { id: 1, title: 'LSHTM-BMU Joint Research Fellowship', slug: 'lshtm-bmu-fellowship', program_type: 'research', program_type_display: 'Research Exchange', partner: mockInternationalPartners[3], duration_weeks: 12, start_date: '2025-09-01', end_date: '2025-11-30', application_deadline: '2025-06-30', description: 'A 12-week research fellowship at the London School of Hygiene & Tropical Medicine focusing on tropical disease research.', eligibility_criteria: ['Must be a PhD student or early-career researcher', 'Minimum CGPA of 3.5', 'Research proposal in tropical medicine'], benefits: ['Travel stipend', 'Accommodation provided', 'Research funding up to £5,000', 'Access to LSHTM labs and libraries'], costs: { tuition: 'Waived', airfare: 'Covered by scholarship', living_expenses: 'Stipend provided' }, total_slots: 5, available_slots: 3, status: 'open', status_display: 'Applications Open', banner_image_url: null, contact_email: 'international@bmu.edu.ng' },
  { id: 2, title: 'JHU-BMU Public Health Exchange', slug: 'jhu-bmu-exchange', program_type: 'student', program_type_display: 'Student Exchange', partner: mockInternationalPartners[4], duration_weeks: 16, start_date: '2025-08-15', end_date: '2025-12-15', application_deadline: '2025-05-15', description: 'Semester-long exchange program at Johns Hopkins Bloomberg School of Public Health.', eligibility_criteria: ['Enrolled in MPH or related program', 'Minimum CGPA of 3.0', 'English proficiency'], benefits: ['Full tuition waiver', 'Health insurance', 'Cultural immersion activities'], costs: { tuition: 'Waived', housing: '$3,000/semester', meals: '$2,000/semester', airfare: 'Student responsibility' }, total_slots: 3, available_slots: 1, status: 'open', status_display: 'Applications Open', banner_image_url: null, contact_email: 'exchange@bmu.edu.ng' },
];

export interface StudentSupportServiceData {
  id: number;
  title: string;
  slug: string;
  service_type: string;
  service_type_display: string;
  short_description: string;
  full_description: string;
  icon: string | null;
  features: string[];
  requirements: string[];
  process_steps: string[];
  faqs: string[];
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  office_location: string | null;
  office_hours: string | null;
  related_documents: string[];
  useful_links: Record<string, string>[];
}

export const mockSupportServices: StudentSupportServiceData[] = [
  { id: 1, title: 'Academic Advising', slug: 'academic-advising', service_type: 'academic', service_type_display: 'Academic Support', short_description: 'Guidance on course selection, academic planning, and career pathways.', full_description: 'Our academic advisors help students navigate their academic journey, from course selection to career planning. Services include individual consultations, academic progress reviews, and referral to specialized support.', icon: null, features: ['One-on-one advising sessions', 'Degree planning assistance', 'Academic progress monitoring', 'Career counseling'], requirements: ['Enrolled as a registered BMU student'], process_steps: ['Schedule an appointment online', 'Attend advising session', 'Develop academic plan', 'Follow up as needed'], faqs: ['How do I book an appointment? Visit the Student Affairs portal.', 'Can I change my advisor? Yes, by requesting through the Dean\'s office.'], contact_person: 'Dr. Sarah Okonkwo', contact_email: 'advising@bmu.edu.ng', contact_phone: '+234 803 111 0031', office_location: 'Student Affairs Building, Room 204', office_hours: 'Mon-Fri 9:00 AM - 4:00 PM', related_documents: ['Academic Policies Handbook'], useful_links: [{ title: 'Online Advising Portal', url: 'https://portal.bmu.edu.ng/advising' }] },
  { id: 2, title: 'International Student Support', slug: 'international-support', service_type: 'international', service_type_display: 'International Student Services', short_description: 'Visa assistance, orientation, and cultural integration for international students.', full_description: 'Comprehensive support services for international students including visa processing, airport pickup, accommodation assistance, and cultural orientation programs.', icon: null, features: ['Visa application support', 'Airport pickup service', 'Accommodation assistance', 'Cultural orientation'], requirements: ['Valid international passport', 'Admission letter from BMU'], process_steps: ['Submit visa support request', 'Receive guidance documents', 'Attend orientation program', 'Ongoing support as needed'], faqs: ['How long does visa processing take? Typically 4-6 weeks.', 'Is airport pickup available? Yes, request at least 2 weeks before arrival.'], contact_person: 'Mrs. Grace Eze', contact_email: 'international@bmu.edu.ng', contact_phone: '+234 803 111 0032', office_location: 'International Office, Admin Block', office_hours: 'Mon-Fri 8:00 AM - 5:00 PM', related_documents: ['International Student Handbook'], useful_links: [{ title: 'Nigeria Immigration Service', url: 'https://portal.immigration.gov.ng' }] },
];

export interface JobPostingData {
  id: number;
  title: string;
  department: string;
  job_type: string;
  job_type_display: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  application_deadline: string;
  status: string;
  is_open: boolean;
}

export const mockJobPostings: JobPostingData[] = [
  { id: 1, title: 'Senior Lecturer in Public Health', department: 'Public Health', job_type: 'academic', job_type_display: 'Academic', location: 'Main Campus, Elebele', salary_min: 5000000, salary_max: 8000000, description: 'We seek an experienced Senior Lecturer to join our Public Health department. The ideal candidate will have a strong research background and teaching experience in epidemiology and biostatistics.', requirements: 'PhD in Public Health or related field\nMinimum 5 years teaching experience\nStrong publication record\nExperience with grant writing', responsibilities: 'Teach undergraduate and postgraduate courses\nSupervise PhD students\nLead research projects\nContribute to curriculum development', benefits: 'Health insurance\nHousing allowance\nResearch funding\nConference travel allowance', application_deadline: '2025-08-30', status: 'published', is_open: true },
  { id: 2, title: 'Research Fellow - Tropical Medicine', department: 'Tropical Medicine', job_type: 'research', job_type_display: 'Research', location: 'Research Institute, Yenagoa', salary_min: 3500000, salary_max: 5000000, description: 'We are looking for a Research Fellow to work on ongoing tropical disease research projects, focusing on malaria and neglected tropical diseases.', requirements: 'PhD in Tropical Medicine or related field\nLaboratory research experience\nExperience with field studies in rural settings', responsibilities: 'Conduct laboratory and field research\nAnalyze data and prepare manuscripts\nSupervise junior researchers\nCollaborate with international partners', benefits: 'Health insurance\nResearch funding\nInternational collaboration opportunities', application_deadline: '2025-07-15', status: 'published', is_open: true },
  { id: 3, title: 'Administrative Officer', department: 'Administration', job_type: 'administrative', job_type_display: 'Administrative', location: 'Main Campus, Elebele', salary_min: 2000000, salary_max: 3000000, description: 'We seek an Administrative Officer to support the daily operations of the university administration office.', requirements: 'Bachelor\'s degree in Administration or related field\nMinimum 3 years administrative experience\nProficiency in MS Office', responsibilities: 'Manage office correspondence\nCoordinate meetings and events\nMaintain records and filing systems\nSupport senior administrators', benefits: 'Health insurance\nPension plan\nAnnual leave', application_deadline: '2025-06-30', status: 'published', is_open: true },
  { id: 4, title: 'IT Support Specialist', department: 'ICT', job_type: 'technical', job_type_display: 'Technical', location: 'Main Campus, Elebele', salary_min: 2500000, salary_max: 4000000, description: 'We need an IT Support Specialist to provide technical support to faculty, staff, and students across campus.', requirements: 'Bachelor\'s degree in Computer Science or related field\nExperience with network administration\nKnowledge of learning management systems', responsibilities: 'Provide technical support\nMaintain computer labs\nManage network infrastructure\nTrain staff on new technologies', benefits: 'Health insurance\nProfessional development allowance', application_deadline: '2025-06-15', status: 'published', is_open: true },
];

export interface CPDCourseData {
  id: number;
  title: string;
  slug: string;
  code: string;
  category: string;
  category_display: string;
  description: string;
  learning_objectives: string[];
  curriculum: string[];
  duration_hours: number;
  credit_hours: number;
  delivery_mode: string;
  delivery_mode_display: string;
  fee_local: number;
  fee_intl: number;
  instructor_name: string;
  status: string;
  start_date: string;
  end_date: string;
  enrollment_deadline: string;
}

export const mockCPDCourses: CPDCourseData[] = [
  { id: 1, title: 'Advanced Cardiac Life Support (ACLS)', slug: 'acls-provider', code: 'CPD-ACLS-001', category: 'clinical', category_display: 'Clinical', description: 'Comprehensive ACLS provider course covering advanced cardiovascular life support techniques, including rhythm recognition, defibrillation, and team dynamics.', learning_objectives: ['Recognize and manage cardiac arrest situations', 'Interpret cardiac rhythms accurately', 'Lead effective resuscitation teams', 'Administer appropriate pharmacological interventions'], curriculum: ['Module 1: Basic Life Support Review', 'Module 2: Cardiac Rhythm Recognition', 'Module 3: Defibrillation and Cardioversion', 'Module 4: Airway Management', 'Module 5: Pharmacology', 'Module 6: Team Dynamics and Communication'], duration_hours: 40, credit_hours: 4, delivery_mode: 'hybrid', delivery_mode_display: 'Hybrid (Online + In-Person)', fee_local: 150000, fee_intl: 500, instructor_name: 'Prof. Michael Okoro', status: 'published', start_date: '2025-04-01', end_date: '2025-04-12', enrollment_deadline: '2025-03-25' },
  { id: 2, title: 'Health Systems Management', slug: 'health-systems-mgmt', code: 'CPD-HSM-002', category: 'public_health', category_display: 'Public Health', description: 'A comprehensive course on health systems management covering leadership, financing, and quality improvement in healthcare delivery.', learning_objectives: ['Understand health system frameworks', 'Apply management principles to healthcare', 'Analyze healthcare financing models', 'Design quality improvement initiatives'], curriculum: ['Module 1: Health Systems Overview', 'Module 2: Leadership in Healthcare', 'Module 3: Healthcare Financing', 'Module 4: Quality Improvement', 'Module 5: Health Policy Analysis', 'Module 6: Capstone Project'], duration_hours: 60, credit_hours: 6, delivery_mode: 'online', delivery_mode_display: 'Fully Online', fee_local: 200000, fee_intl: 600, instructor_name: 'Dr. Amina Bello', status: 'published', start_date: '2025-05-05', end_date: '2025-06-16', enrollment_deadline: '2025-04-28' },
  { id: 3, title: 'Surgical Skills Workshop', slug: 'surgical-skills', code: 'CPD-SUR-003', category: 'surgery', category_display: 'Surgery', description: 'Hands-on surgical skills workshop covering basic and advanced surgical techniques for practicing surgeons and senior residents.', learning_objectives: ['Master basic surgical techniques', 'Learn advanced suturing methods', 'Practice minimally invasive approaches', 'Manage surgical complications'], curriculum: ['Module 1: Aseptic Technique', 'Module 2: Suturing and Knot Tying', 'Module 3: Tissue Handling', 'Module 4: Laparoscopic Basics', 'Module 5: Emergency Surgical Procedures'], duration_hours: 32, credit_hours: 3, delivery_mode: 'in_person', delivery_mode_display: 'In-Person', fee_local: 250000, fee_intl: 800, instructor_name: 'Prof. Chukwudi Okafor', status: 'published', start_date: '2025-06-01', end_date: '2025-06-07', enrollment_deadline: '2025-05-20' },
  { id: 4, title: 'Emergency Ultrasound in Clinical Practice', slug: 'emergency-ultrasound', code: 'CPD-EUS-004', category: 'clinical', category_display: 'Clinical', description: 'Focused course on point-of-care ultrasound (POCUS) for emergency and critical care settings.', learning_objectives: ['Perform focused ultrasound exams', 'Identify pathology on ultrasound', 'Integrate ultrasound findings into clinical decisions'], curriculum: ['Module 1: Physics of Ultrasound', 'Module 2: FAST Exam', 'Module 3: Cardiac Ultrasound', 'Module 4: Lung Ultrasound', 'Module 5: Vascular Access', 'Module 6: Hands-on Practice'], duration_hours: 24, credit_hours: 2, delivery_mode: 'in_person', delivery_mode_display: 'In-Person', fee_local: 180000, fee_intl: 550, instructor_name: 'Dr. Funmi Adeyemi', status: 'published', start_date: '2025-07-10', end_date: '2025-07-12', enrollment_deadline: '2025-06-30' },
  { id: 5, title: 'Teaching and Learning in Medical Education', slug: 'med-ed-teaching', code: 'CPD-MED-005', category: 'medical_education', category_display: 'Medical Education', description: 'Professional development course for healthcare educators on modern teaching methodologies and assessment strategies.', learning_objectives: ['Design effective learning experiences', 'Implement competency-based assessment', 'Use educational technology effectively', 'Evaluate teaching effectiveness'], curriculum: ['Module 1: Learning Theories', 'Module 2: Curriculum Design', 'Module 3: Assessment Methods', 'Module 4: Educational Technology', 'Module 5: Clinical Teaching', 'Module 6: Teaching Portfolio'], duration_hours: 40, credit_hours: 4, delivery_mode: 'online', delivery_mode_display: 'Fully Online', fee_local: 120000, fee_intl: 400, instructor_name: 'Prof. Grace Okon', status: 'published', start_date: '2025-08-01', end_date: '2025-08-29', enrollment_deadline: '2025-07-20' },
];

export interface ImpactProgramData {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  program_type: string;
  program_type_display: string;
  stats: Record<string, number>;
  objectives: string[];
  achievements: string[];
  partners: string[];
}

export const mockImpactPrograms: ImpactProgramData[] = [
  { id: 1, title: 'Community Health Outreach', slug: 'community-health-outreach', subtitle: 'Bringing healthcare to underserved communities', description: 'BMU\'s flagship community health program provides free medical screenings, health education, and treatment to rural communities in Bayelsa State and beyond.', program_type: 'community_health', program_type_display: 'Community Health', stats: { communities_reached: 45, patients_treated: 12500, volunteers: 320, screenings: 28000 }, objectives: ['Provide accessible healthcare to rural communities', 'Conduct health education and awareness campaigns', 'Train community health workers', 'Reduce preventable disease burden'], achievements: ['Reached over 12,000 patients in 2024', 'Established 5 community health posts', 'Trained 200 community health workers', 'Reduced malaria incidence by 35% in target areas'], partners: ['Bayelsa State Ministry of Health', 'World Health Organization', 'Niger Delta Development Commission', 'Médecins Sans Frontières'] },
  { id: 2, title: 'Environmental Sustainability Initiative', slug: 'env-sustainability', subtitle: 'Protecting our environment for future generations', description: 'A comprehensive environmental program focusing on waste management, tree planting, renewable energy adoption, and environmental education across campus and surrounding communities.', program_type: 'environment', program_type_display: 'Environment', stats: { trees_planted: 5000, waste_recycled_kg: 25000, energy_saved_kwh: 120000, participants: 3000 }, objectives: ['Reduce campus carbon footprint', 'Implement comprehensive recycling program', 'Promote renewable energy adoption', 'Educate community on environmental stewardship'], achievements: ['Planted 5,000 trees across campus', 'Achieved 40% waste recycling rate', 'Installed solar panels on 3 buildings', 'Reduced energy consumption by 25%'], partners: ['Nigerian Conservation Foundation', 'UNDP Nigeria', 'Bayelsa State Environmental Protection Agency', 'Greenpeace Africa'] },
  { id: 3, title: 'Medical Research for Impact', slug: 'medical-research-impact', subtitle: 'Translating research into real-world solutions', description: 'Research programs focused on tropical diseases, maternal health, and health systems strengthening that directly impact policy and practice in Nigeria and the West African region.', program_type: 'research', program_type_display: 'Research', stats: { publications: 150, grants_secured: 500000000, researchers: 85, collaborations: 30 }, objectives: ['Conduct high-impact health research', 'Secure competitive research funding', 'Publish in top-tier journals', 'Translate findings into policy'], achievements: ['Published 150 papers in 2024', 'Secured NGN 500M in research grants', 'Established 30 international collaborations', 'Influenced 3 national health policies'], partners: ['Wellcome Trust', 'National Institutes of Health', 'World Health Organization', 'Africa CDC'] },
  { id: 4, title: 'Education Access Program', slug: 'education-access', subtitle: 'Breaking barriers to quality education', description: 'Scholarships, mentorship, and educational support programs designed to ensure talented students from disadvantaged backgrounds can access and succeed in medical education.', program_type: 'education', program_type_display: 'Education', stats: { scholarships_awarded: 150, students_mentored: 500, schools_reached: 60, graduation_rate: 95 }, objectives: ['Provide scholarships to deserving students', 'Offer mentorship and academic support', 'Conduct career guidance in secondary schools', 'Improve educational outcomes'], achievements: ['Awarded 150 scholarships since 2020', '95% graduation rate among scholars', 'Reached 60 secondary schools', 'Established 10 study centers'], partners: ['TETFund', 'NNPC Foundation', 'Access Bank PLC', 'MTN Foundation'] },
];

export interface ApplicationData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program: string;
  student_type: string;
  status: string;
  status_display: string;
  progress_percentage: number;
  payment_status: string;
  submitted_at: string | null;
}

export const mockApplications: ApplicationData[] = [
  { id: 'BMU-2025-0001', first_name: 'John', last_name: 'Okafor', email: 'john.okafor@example.com', phone: '+234 803 123 4567', program: 'MBBS', student_type: 'LOCAL', status: 'submitted', status_display: 'Submitted', progress_percentage: 100, payment_status: 'paid', submitted_at: '2025-01-15T10:30:00Z' },
  { id: 'BMU-2025-0002', first_name: 'Aisha', last_name: 'Mohammed', email: 'aisha.m@example.com', phone: '+234 803 234 5678', program: 'B.Sc. Nursing', student_type: 'LOCAL', status: 'under_review', status_display: 'Under Review', progress_percentage: 75, payment_status: 'paid', submitted_at: '2025-01-20T14:00:00Z' },
  { id: 'BMU-2025-0003', first_name: 'David', last_name: 'Williams', email: 'david.w@example.co.uk', phone: '+44 7700 900123', program: 'M.Sc. Public Health', student_type: 'INTL', status: 'accepted', status_display: 'Accepted', progress_percentage: 100, payment_status: 'paid', submitted_at: '2024-12-10T09:00:00Z' },
];

export interface SearchResultItemData {
  id: number;
  title: string;
  type: string;
  slug: string | null;
  description: string | null;
  url: string;
  image: string | null;
  metadata: Record<string, unknown> | null;
}

export interface SearchResponseData {
  query: string;
  total_results: number;
  results: SearchResultItemData[];
  authors_count: number;
  publications_count: number;
  programs_count: number;
  news_count: number;
}

export const mockSearchResponse: SearchResponseData = {
  query: '',
  total_results: 0,
  results: [],
  authors_count: 0,
  publications_count: 0,
  programs_count: 0,
  news_count: 0,
};

export interface LibraryServiceData {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const mockLibraryServices: LibraryServiceData[] = [
  { id: 1, icon: 'BookOpen', title: 'Book Lending', description: 'Borrow books, journals, and other materials from our extensive collection of medical and health sciences resources. Students can borrow up to 5 books for 2 weeks.' },
  { id: 2, icon: 'Search', title: 'Reference Services', description: 'Professional librarians assist with research queries, literature searches, and citation management. Book a one-on-one consultation with a subject librarian.' },
  { id: 3, icon: 'Globe', title: 'Digital Resources', description: 'Access online databases, e-journals, e-books, and institutional repository 24/7 from anywhere on campus or remotely with your student credentials.' },
  { id: 4, icon: 'Wifi', title: 'E-Library & Internet', description: 'High-speed internet access and a fully equipped e-library with 50 computer workstations for digital research and online learning.' },
  { id: 5, icon: 'Users', title: 'Study Spaces', description: 'Quiet study areas, group study rooms, and carrel spaces available for individual and collaborative learning. Group rooms can be reserved online.' },
  { id: 6, icon: 'Printer', title: 'Printing & Scanning', description: 'Print, photocopy, and scan services available at nominal fees. Students can upload documents for printing from any device on campus.' },
];

export interface LibraryStatData {
  id: number;
  value: string;
  label: string;
}

export const mockLibraryStats: LibraryStatData[] = [
  { id: 1, value: '50,000+', label: 'Book Collection' },
  { id: 2, value: '200+', label: 'Medical Journals' },
  { id: 3, value: '5,000+', label: 'Active Users' },
  { id: 4, value: '24/7', label: 'Digital Access' },
];

export interface LibraryHourData {
  id: number;
  day: string;
  hours: string;
}

export const mockLibraryHours: LibraryHourData[] = [
  { id: 1, day: 'Monday - Thursday', hours: '8:00 AM - 10:00 PM' },
  { id: 2, day: 'Friday', hours: '8:00 AM - 6:00 PM' },
  { id: 3, day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
  { id: 4, day: 'Sunday / Public Holidays', hours: 'Closed' },
];

export interface LibraryGuidelineData {
  id: number;
  title: string;
  text: string;
}

export const mockLibraryGuidelines: LibraryGuidelineData[] = [
  { id: 1, title: 'Library Cards', text: 'All students, faculty, and staff must obtain a valid library card. Cards are issued at the circulation desk upon presentation of a valid university ID. Lost cards should be reported immediately.' },
  { id: 2, title: 'Borrowing Limits', text: 'Students: 5 books for 2 weeks. Faculty: 10 books for 4 weeks. Staff: 3 books for 2 weeks. Reference materials and periodicals are for library use only.' },
  { id: 3, title: 'Overdue & Lost Items', text: 'Overdue fines of N100 per day per item apply. Lost items must be replaced or paid for at current market value. Borrowing privileges are suspended when fines exceed N1,000.' },
  { id: 4, title: 'Code of Conduct', text: 'Silence must be observed in reading areas. Food and drinks are prohibited near library materials. Mobile phones must be set to silent mode. Users must respect library property and other patrons.' },
];

export interface DeadlineData {
  id: number;
  title: string;
  deadline: string;
  icon_name: string;
}

export const mockDeadlines: DeadlineData[] = [
  { id: 1, title: 'Application for Admission', deadline: 'September 30, 2025', icon_name: 'BookOpen' },
  { id: 2, title: 'Payment of School Fees', deadline: 'Within 2 weeks of resumption', icon_name: 'Clock' },
  { id: 3, title: 'Course Registration', deadline: 'Within 4 weeks of semester start', icon_name: 'Calendar' },
  { id: 4, title: 'Project/Thesis Submission', deadline: '2 weeks before final exams', icon_name: 'GraduationCap' },
  { id: 5, title: 'Graduation Clearance', deadline: '4 weeks before convocation', icon_name: 'Bell' },
];


// ============================================================================
// Dedicated About Page types (replacing generic PageContent)
// ============================================================================

export interface AboutStatData {
  value: string;
  label: string;
  suffix: string;
  order: number;
}

export interface AboutCoreValueData {
  icon_name: string;
  title: string;
  description: string;
  order: number;
}

export interface AboutPageData {
  hero_title: string;
  hero_content: string;
  about_main_title: string;
  about_main_content: string;
  meta_description: string;
  stats: AboutStatData[];
  core_values: AboutCoreValueData[];
}

export interface TimelineEventData {
  year: string;
  title: string;
  description: string;
  icon_name: string;
  order: number;
}

export interface HistoryStatData {
  value: string;
  label: string;
}

export interface HistoryIntroImageData {
  image: string;
  caption: string;
  order: number;
}

export interface HistoryPageData {
  hero_content: string;
  meta_description: string;
  timeline_events: TimelineEventData[];
  intro_title: string;
  intro_content: string;
  intro_image: string | null;
  intro_image_caption: string;
  intro_images: HistoryIntroImageData[];
  stats: HistoryStatData[];
  future_title: string;
  future_content: string;
  future_quote: string;
}

export interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  image: string | null;
  announcement_type: string;
  link_url: string;
  link_text: string;
  created_at: string;
}

export interface VisionMissionPillarData {
  icon_name: string;
  title: string;
  description: string;
  order: number;
}

export interface VisionMissionValueData {
  title: string;
  description: string;
  order: number;
}

export interface VisionMissionPageData {
  hero_content: string;
  mission_content: string;
  vision_content: string;
  meta_description: string;
  strategic_pillars: VisionMissionPillarData[];
  core_values: VisionMissionValueData[];
}

export interface GovernanceBodyData {
  title: string;
  role: string;
  description: string;
  responsibilities: string[];
  icon_name: string;
  color: string;
  order: number;
}

export interface GovernanceCommitteeData {
  name: string;
  focus: string;
  order: number;
}

export interface GovernancePolicyData {
  title: string;
  description: string;
  order: number;
}

export interface GovernancePageData {
  hero_content: string;
  meta_description: string;
  governing_bodies: GovernanceBodyData[];
  committees: GovernanceCommitteeData[];
  policies: GovernancePolicyData[];
}
