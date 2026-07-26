import axios from 'axios';
import type { 
  Program, 
  Faculty, 
  College, 
  SDGData, 
  NewsItem, 
  ResearchCenter,
  PageContentSection,
  LeadershipProfile,
  HeroSlideData,
  TestimonialData,
  PublicDocumentData,
  UniversityRankingData,
  NonAcademicStaffData,
  PeopleStatsData,
  CTAStatsData,
  KeyMetricData,
  PartnerData,
  InternationalPartnerData,
  PublicationData,
  GrantData,
  GrantApplicationData,
  GrantApplicationSubmitData,
  EventData,
  EventRegistrationData,
  EventRegistrationInput,
  PaymentInitializeInput,
  PaymentInitializeResponse,
  PaymentVerifyResponse,
  FundingOrganizationData,
  FundedProjectData,
  SearchResultData,
  SearchResponseData,
  ExchangeProgramData,
  StudentSupportServiceData,
  CampusFeatureData,
  CampusStatData,
  CampusTestimonialData,
  CampusContactInfoData,
  CampusImageData,
  CampusVideoData,
  JobPostingData,
  CPDCourseData,
  ImpactProgramData,
  LibraryServiceData,
  LibraryStatData,
  LibraryHourData,
  LibraryGuidelineData,
  DeadlineData,
  AboutPageData,
  HistoryPageData,
  VisionMissionPageData,
  GovernancePageData,
  AnnouncementData,
} from './mockData';
import {
  mockEvents,
  mockGalleryImages,
  mockCampusFeatures,
  mockCampusStats,
  mockCampusTestimonials,
  mockCampusContactInfo,
  mockCampusImages,
  mockCampusVideo,
  mockApplications,
} from './mockData';
import {
  mockPrograms,
  mockFaculty,
  mockColleges,
  mockSDGMetrics,
  mockNews,
  mockResearchCenters,
  mockPageContent,
  mockLeadership,
  mockHeroSlides,
  mockTestimonials,
  mockPublicDocuments,
  mockUniversityRankings,
  mockNonAcademicStaff,
  mockKeyMetrics,
  mockInternationalPartners,
  mockPublications,
  mockResearchGrants,
  mockPeopleStats,
  mockCTAStats,
  mockFundingOrganizations,
  mockFundedProjects,
  mockFundingStats,
  mockAcademicEvents,
  mockAdmissionRequirements,
  mockImportantDates,
  mockBooks,
  mockDigitalResources,
  mockExchangePrograms,
  mockSupportServices,
  mockJobPostings,
  mockCPDCourses,
  mockImpactPrograms,
  mockLibraryServices,
  mockLibraryStats,
  mockLibraryHours,
  mockLibraryGuidelines,
  mockDeadlines,
} from './mockData';

export interface FacultyUnitData {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  college_id: number | null;
  college_name: string | null;
  college_slug: string | null;
  leadership_name: string;
  department_count: number;
  staff_count: number;
  student_count: number;
  is_standalone: boolean;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmu_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('bmu_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || '/api'}/v1/auth/login/`,
            { refresh: refreshToken }
          );
          const newAccess = res.data.access;
          localStorage.setItem('bmu_access_token', newAccess);
          processQueue(null, newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('bmu_access_token');
          localStorage.removeItem('bmu_refresh_token');
          window.location.href = '/portals';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        window.location.href = '/portals';
      }
    }
    return Promise.reject(error);
  }
);

export async function fetchWithFallback<T>(
  endpoint: string,
  mockData: T | (() => T),
  params?: Record<string, unknown>,
  extractItems?: boolean
): Promise<T> {
  try {
    const response = await apiClient.get(endpoint, { params });
    let data = response.data;

    if (extractItems && data && Array.isArray(data.items)) {
      data = data.items;
    }

    if (data !== undefined && data !== null) {
      if (Array.isArray(data)) return data as unknown as T;
      if (typeof data === 'object' && !Array.isArray(data)) return data as T;
      if (typeof data === 'number' || typeof data === 'boolean' || typeof data === 'string') return data as T;
    }
  } catch {
    // API unavailable — fall through to mock
  }

  if (typeof mockData === 'function') {
    return (mockData as () => T)();
  }
  return mockData as T;
}

interface FetchProgramsParams {
  level?: 'undergraduate' | 'masters' | 'phd' | 'certificate';
  studentType?: 'local' | 'international';
}

export const fetchPrograms = async (params: FetchProgramsParams = {}): Promise<Program[] | Record<string, Program[]>> => {
  const { level } = params;

  const mock = () => {
    if (level && (mockPrograms as Record<string, Program[]>)[level]) {
      return (mockPrograms as Record<string, Program[]>)[level];
    }
    return [
      ...mockPrograms.undergraduate,
      ...mockPrograms.masters,
      ...mockPrograms.phd,
      ...mockPrograms.certificate
    ];
  };

  return fetchWithFallback('/public/programs', mock, params as unknown as Record<string, unknown>, true);
};

export const fetchProgramBySlug = async (slug: string): Promise<Program | undefined> => {
  const mock = () => {
    const all = [
      ...mockPrograms.undergraduate,
      ...mockPrograms.masters,
      ...mockPrograms.phd,
      ...mockPrograms.certificate
    ];
    return all.find(p => p.slug === slug);
  };
  return fetchWithFallback(`/public/programs/${slug}`, mock);
};

interface FetchFacultyParams {
  college?: string;
  department?: string;
  search?: string;
}

export const fetchFaculty = async (params: FetchFacultyParams = {}): Promise<Faculty[]> => {
  const mock = () => {
    let faculty = [...mockFaculty];
    if (params.college) faculty = faculty.filter(f => f.college === params.college);
    if (params.department) faculty = faculty.filter(f => f.department === params.department);
    if (params.search) {
      const q = params.search.toLowerCase();
      faculty = faculty.filter(f =>
        f.firstName.toLowerCase().includes(q) ||
        f.lastName.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q)
      );
    }
    return faculty;
  };
  return fetchWithFallback('/public/faculty', mock, params as unknown as Record<string, unknown>, true);
};

export const fetchFacultyById = async (id: string | number): Promise<Faculty | undefined> => {
  const mock = () => mockFaculty.find(f => f.id === parseInt(id as string));
  return fetchWithFallback(`/public/faculty/${id}`, mock);
};

export const fetchColleges = async (): Promise<College[]> => {
  return fetchWithFallback('/public/colleges', () => [...mockColleges], undefined, true);
};

export const fetchCollegeBySlug = async (slug: string): Promise<College | undefined> => {
  const mock = () => mockColleges.find(c => c.slug === slug);
  return fetchWithFallback(`/public/colleges/${slug}`, mock);
};

export const fetchFaculties = async (): Promise<FacultyUnitData[]> => {
  return fetchWithFallback('/public/faculties', () => {
    const collegesData = mockColleges;
    const faculties: FacultyUnitData[] = [];
    for (const c of collegesData) {
      for (const f of (c as any).faculties || []) {
        faculties.push({
          id: f.id, name: f.name, slug: f.slug, code: f.code || '',
          description: f.description || '', college_id: c.id, college_name: c.name,
          college_slug: c.slug, leadership_name: f.dean_name || '', department_count: f.department_count || 0,
          staff_count: f.staff_count ?? 0, student_count: f.student_count ?? 0,
          is_standalone: false,
        });
      }
    }
    return faculties;
  });
};

export const fetchPageContent = async (page?: string): Promise<PageContentSection[]> => {
  const mock = () => {
    let items = [...mockPageContent];
    if (page) items = items.filter(s => s.page === page);
    return items;
  };
  const params = page ? { page } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/page-content', mock, params);
};

export const fetchAboutPage = async (): Promise<AboutPageData> => {
  return fetchWithFallback('/public/about-page', () => ({
    hero_title: 'About Bayelsa Medical University',
    hero_content: 'Nigeria\'s premier institution for healthcare education, dedicated to training the next generation of medical professionals and advancing health outcomes in the Niger Delta region.',
    about_main_title: 'Our Mission & Vision',
    about_main_content: '',
    meta_description: '',
    stats: [
      { value: '2018', label: 'Founded', suffix: '', order: 1 },
      { value: '450', label: 'Faculty', suffix: '+', order: 2 },
      { value: '50+', label: 'Degree Programs', suffix: '', order: 3 },
      { value: '3,500+', label: 'Students', suffix: '', order: 4 },
    ],
    core_values: [
      { icon_name: 'Award', title: 'Excellence', description: 'We pursue the highest standards in teaching, research, and healthcare delivery.', order: 1 },
      { icon_name: 'Heart', title: 'Compassion', description: 'We put patients and communities at the center of everything we do.', order: 2 },
      { icon_name: 'Lightbulb', title: 'Innovation', description: 'We embrace new ideas and technologies to advance medical science.', order: 3 },
      { icon_name: 'Globe', title: 'Impact', description: 'We are committed to improving health outcomes in the Niger Delta and beyond.', order: 4 },
    ],
  }));
};

export const fetchHistoryPage = async (): Promise<HistoryPageData> => {
  return fetchWithFallback('/public/history-page', () => ({
    hero_content: 'From visionary beginnings in 2018 to becoming Nigeria\'s premier destination for healthcare education - the remarkable journey of Bayelsa Medical University.',
    meta_description: '',
    intro_title: 'A Vision for Healthcare Excellence',
    intro_content: `Bayelsa Medical University was born from a vision to address the critical shortage of qualified healthcare professionals in the Niger Delta region. Prior to 2018, aspiring medical students from Bayelsa State had to travel far from home to pursue their dreams.\n\nThe establishment of BMU changed this narrative, bringing world-class medical education to the heart of the Niger Delta. What began with a single MBBS program has grown into a comprehensive medical university with multiple colleges and research centers.\n\nToday, BMU stands as a testament to what focused investment in education can achieve - producing skilled healthcare professionals who serve their communities with excellence and compassion.`,
    intro_image_caption: 'Campus Development Gallery',
    intro_image: null,
    intro_images: [],
    stats: [
      { value: '7+', label: 'Years of Excellence' },
      { value: '3,500+', label: 'Students Trained' },
      { value: '50+', label: 'Degree Programs' },
    ],
    future_title: 'Looking Ahead',
    future_content: `As we look to the future, BMU remains committed to expanding our impact. Plans are underway for new specialized colleges, enhanced research facilities, and strengthened international partnerships that will position us among Africa's top medical institutions.`,
    future_quote: '"The best way to predict the future is to create it." - We are building tomorrow\'s healthcare, today.',
    timeline_events: [
      { year: '2018', title: 'Foundation Established', description: 'Bayelsa Medical University was established by the Bayelsa State Government...', icon_name: 'Building2', order: 1 },
      { year: '2019', title: 'First Academic Session Begins', description: 'BMU admitted its first cohort of students into the MBBS program...', icon_name: 'GraduationCap', order: 2 },
      { year: '2020', title: 'NUC Accreditation', description: 'Received full accreditation from the National Universities Commission...', icon_name: 'Award', order: 3 },
      { year: '2021', title: 'Teaching Hospital Partnership', description: 'Established formal partnership with the Federal Medical Centre, Yenagoa...', icon_name: 'Users', order: 4 },
      { year: '2022', title: 'Research Centers Launch', description: 'Launched the Center for Malaria Research and Center for Non-Communicable Diseases...', icon_name: 'Globe', order: 5 },
      { year: '2023', title: 'Postgraduate Programs', description: 'Introduced Master of Public Health (MPH) and other postgraduate programs...', icon_name: 'Calendar', order: 6 },
      { year: '2024', title: 'International Recognition', description: 'BMU achieved recognition from the World Health Organization...', icon_name: 'Award', order: 7 },
      { year: '2025', title: 'Campus Expansion', description: 'Completed Phase II of campus development, including new research laboratories...', icon_name: 'Building2', order: 8 },
    ],
  }));
};

export const fetchVisionMissionPage = async (): Promise<VisionMissionPageData> => {
  return fetchWithFallback('/public/vision-mission-page', () => ({
    hero_content: 'Guided by a compelling vision and driven by a transformative mission, we are shaping the future of healthcare in Africa.',
    mission_content: 'To provide world-class education in medical and health sciences, conduct cutting-edge research addressing regional health challenges, and deliver compassionate healthcare services that improve the quality of life for communities in the Niger Delta and beyond.',
    vision_content: 'To be the leading medical university in Africa, recognized globally for excellence in healthcare education, research innovation, and community health transformation.',
    meta_description: '',
    strategic_pillars: [
      { icon_name: 'Lightbulb', title: 'Excellence in Education', description: 'Delivering world-class medical education through innovative teaching methods, modern facilities, and experienced faculty.', order: 1 },
      { icon_name: 'Heart', title: 'Compassionate Care', description: 'Instilling values of empathy and patient-centered care in every graduate who serves our communities.', order: 2 },
      { icon_name: 'Compass', title: 'Research Innovation', description: 'Advancing medical knowledge through cutting-edge research addressing regional and global health challenges.', order: 3 },
      { icon_name: 'Target', title: 'Community Impact', description: 'Transforming healthcare delivery in the Niger Delta through service, outreach, and partnership.', order: 4 },
    ],
    core_values: [
      { title: 'Integrity', description: 'Upholding the highest ethical standards in all our dealings', order: 1 },
      { title: 'Excellence', description: 'Pursuing the highest quality in education, research, and service', order: 2 },
      { title: 'Innovation', description: 'Embracing new ideas and technologies to advance healthcare', order: 3 },
      { title: 'Compassion', description: 'Putting patients and communities first in everything we do', order: 4 },
      { title: 'Collaboration', description: 'Working together across disciplines and with our communities', order: 5 },
      { title: 'Accountability', description: 'Taking responsibility for our actions and their outcomes', order: 6 },
    ],
  }));
};

export const fetchGovernancePage = async (): Promise<GovernancePageData> => {
  return fetchWithFallback('/public/governance-page', () => ({
    hero_content: 'Transparent, accountable, and effective governance structures that ensure the highest standards of institutional leadership and academic excellence.',
    meta_description: '',
    governing_bodies: [
      { title: 'University Council', role: 'Supreme Governing Body', description: 'The highest decision-making body responsible for the overall policy, governance, and strategic direction of the university.', responsibilities: ['Approve major policies', 'Oversee financial management', 'Appoint key officials', 'Ensure institutional accountability'], icon_name: 'Building2', color: '#1E1E1E', order: 1 },
      { title: 'University Senate', role: 'Academic Authority', description: 'The highest academic body responsible for academic standards, curriculum development, and research oversight.', responsibilities: ['Academic policy formulation', 'Curriculum approval', 'Research standards', 'Student discipline (academic)'], icon_name: 'Users', color: '#A51C30', order: 2 },
      { title: 'Management Board', role: 'Executive Body', description: 'The day-to-day administrative leadership team implementing policies and managing university operations.', responsibilities: ['Operational management', 'Resource allocation', 'Staff administration', 'Implementation of policies'], icon_name: 'Gavel', color: '#1E1E1E', order: 3 },
    ],
    committees: [
      { name: 'Finance & General Purposes Committee', focus: 'Financial oversight and resource management', order: 1 },
      { name: 'Appointments & Promotions Committee', focus: 'Staff appointments and career progression', order: 2 },
      { name: 'Tender Board', focus: 'Procurement and contract approvals', order: 3 },
      { name: 'Academic Planning Committee', focus: 'Strategic academic development', order: 4 },
      { name: 'Research Ethics Committee', focus: 'Research ethics and compliance', order: 5 },
      { name: 'Quality Assurance Committee', focus: 'Quality standards and accreditation', order: 6 },
    ],
    policies: [
      { title: 'Academic Integrity Policy', description: 'Maintaining highest standards in research and teaching', order: 1 },
      { title: 'Anti-Corruption Policy', description: 'Zero tolerance for corruption in all university dealings', order: 2 },
      { title: 'Gender Policy', description: 'Promoting gender equality and inclusion across all levels', order: 3 },
      { title: 'Environmental Sustainability Policy', description: 'Commitment to eco-friendly campus operations', order: 4 },
      { title: 'Student Code of Conduct', description: 'Guidelines for ethical student behavior', order: 5 },
      { title: 'Staff Welfare Policy', description: 'Ensuring staff wellbeing and professional development', order: 6 },
    ],
  }));
};

export const fetchAnnouncements = async (): Promise<AnnouncementData[]> => {
  return fetchWithFallback('/public/announcements', () => []);
};

export const fetchLeadership = async (): Promise<LeadershipProfile[]> => {
  return fetchWithFallback('/public/leadership', () => [...mockLeadership]);
};

export const fetchLeadershipById = async (id: string | number): Promise<LeadershipProfile | undefined> => {
  const mock = () => mockLeadership.find(l => l.id === parseInt(id as string));
  return fetchWithFallback(`/public/leadership/${id}`, mock);
};

export const fetchHeroSlides = async (): Promise<HeroSlideData[]> => {
  return fetchWithFallback('/public/hero-slides', () => [...mockHeroSlides], undefined, true);
};

export const fetchTestimonials = async (): Promise<TestimonialData[]> => {
  return fetchWithFallback('/public/testimonials', () => [...mockTestimonials]);
};

export const fetchPublicDocuments = async (category?: string): Promise<PublicDocumentData[]> => {
  const mock = () => {
    let docs = [...mockPublicDocuments];
    if (category) docs = docs.filter(d => d.category === category);
    return docs;
  };
  const params = category ? { category } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/public-documents', mock, params, true);
};

export const fetchFundingOrganizations = async (): Promise<FundingOrganizationData[]> => {
  return fetchWithFallback('/public/funding-organizations', () => [...mockFundingOrganizations], undefined, true);
};

export const fetchFundedProjects = async (params?: { organization?: number; year?: number; status?: string }): Promise<FundedProjectData[]> => {
  const mock = () => {
    let items = [...mockFundedProjects];
    if (params?.organization) items = items.filter(p => p.organization_id === params.organization);
    if (params?.year) items = items.filter(p => p.year === params.year);
    if (params?.status) items = items.filter(p => p.status === params.status);
    return items;
  };
  return fetchWithFallback('/public/funded-projects', mock, params as unknown as Record<string, unknown> | undefined, true);
};

export const fetchFundedProjectById = async (id: number): Promise<FundedProjectData | null> => {
  const mock = () => mockFundedProjects.find(p => p.id === id) || null;
  return fetchWithFallback(`/public/funded-projects/${id}`, mock);
};

export const fetchFundingStats = async (): Promise<FundingStatsData> => {
  return fetchWithFallback('/public/funding-stats', () => ({ ...mockFundingStats }));
};

export const fetchAcademicCalendar = async (): Promise<AcademicEventData[]> => {
  return fetchWithFallback('/public/academic-calendar', () => [...mockAcademicEvents], undefined, true);
};

export const fetchAdmissionRequirements = async (category?: string): Promise<AdmissionRequirementData[]> => {
  const url = category ? `/public/admission-requirements?category=${category}` : '/public/admission-requirements';
  return fetchWithFallback(url, () => {
    let items = [...mockAdmissionRequirements];
    if (category) items = items.filter(r => r.category === category);
    return items;
  }, undefined, true);
};

export const fetchImportantDates = async (): Promise<ImportantDateData[]> => {
  return fetchWithFallback('/public/important-dates', () => [...mockImportantDates], undefined, true);
};

export const fetchBooks = async (): Promise<BookData[]> => {
  return fetchWithFallback('/public/library/books', () => [...mockBooks], undefined, true);
};

export const fetchDigitalResources = async (): Promise<DigitalResourceData[]> => {
  return fetchWithFallback('/public/library/digital-resources', () => [...mockDigitalResources], undefined, true);
};

export const fetchLibraryServices = async (): Promise<LibraryServiceData[]> => {
  return fetchWithFallback('/public/library/services', () => [...mockLibraryServices], undefined, true);
};

export const fetchLibraryStats = async (): Promise<LibraryStatData[]> => {
  return fetchWithFallback('/public/library/stats', () => [...mockLibraryStats], undefined, true);
};

export const fetchLibraryHours = async (): Promise<LibraryHourData[]> => {
  return fetchWithFallback('/public/library/hours', () => [...mockLibraryHours], undefined, true);
};

export const fetchLibraryGuidelines = async (): Promise<LibraryGuidelineData[]> => {
  return fetchWithFallback('/public/library/guidelines', () => [...mockLibraryGuidelines], undefined, true);
};

export const fetchDeadlines = async (): Promise<DeadlineData[]> => {
  return fetchWithFallback('/public/deadlines', () => [...mockDeadlines], undefined, true);
};

export const fetchExchangePrograms = async (): Promise<ExchangeProgramData[]> => {
  return fetchWithFallback('/public/exchange-programs', () => [...mockExchangePrograms], undefined, true);
};

export const fetchStudentSupportServices = async (): Promise<StudentSupportServiceData[]> => {
  return fetchWithFallback('/public/student-support-services', () => [...mockSupportServices], undefined, true);
};

export const fetchJobs = async (): Promise<JobPostingData[]> => {
  return fetchWithFallback('/public/jobs', () => [...mockJobPostings], undefined, true);
};

export const fetchCPDCourses = async (): Promise<CPDCourseData[]> => {
  return fetchWithFallback('/public/cpd-courses', () => [...mockCPDCourses], undefined, true);
};

export const fetchImpactPrograms = async (programType?: string): Promise<ImpactProgramData[]> => {
  const mock = () => {
    let items = [...mockImpactPrograms];
    if (programType) items = items.filter(p => p.program_type === programType);
    return items;
  };
  const params = programType ? { program_type: programType } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/impact-programs', mock, params, true);
};

export const fetchPublicationById = async (id: string): Promise<PublicationData | null> => {
  const all = await fetchPublications();
  return all.find((p: PublicationData) => p.slug === id || String(p.id) === id) || null;
};

export const fetchSearchResults = async (query: string, limit: number = 20): Promise<SearchResponseData> => {
  return fetchWithFallback(
    `/public/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    () => ({
      query,
      total_results: 4,
      results: [
        { id: 1, title: 'Search Result 1', type: 'publication', slug: null, description: 'Example result for: ' + query, url: '#', image: null, metadata: null },
        { id: 2, title: 'Search Result 2', type: 'program', slug: null, description: 'Another result for: ' + query, url: '#', image: null, metadata: null },
      ],
      authors_count: 1,
      publications_count: 1,
      programs_count: 1,
      news_count: 1,
    }),
    undefined,
    false
  );
};

export const submitContactEnquiry = async (data: { name: string; email: string; subject: string; message: string }) => {
  const response = await apiClient.post('/public/contact', data);
  return response.data;
};

export interface AcademicRecordPayload {
  institution: string;
  qualification: string;
  year_of_completion: number;
  grade?: string;
  subjects?: { subject: string; grade: string }[];
}

export const submitApplication = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  program_id: number;
  student_type: string;
  academic_records?: AcademicRecordPayload[];
}): Promise<ApplicationData> => {
  const response = await apiClient.post('/public/applications', data);
  return response.data;
};

export const uploadApplicationDocument = async (
  applicationId: string,
  documentType: string,
  file: File
): Promise<{ id: number; name: string; file_url: string; status: string }> => {
  const formData = new FormData();
  formData.append('document_type', documentType);
  formData.append('file', file);
  const response = await apiClient.post(`/public/applications/${applicationId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const checkApplicationStatus = async (applicationId: string): Promise<ApplicationData> => {
  return fetchWithFallback(
    `/public/applications/${applicationId}/status`,
    () => mockApplications.find(a => a.id === applicationId) || null,
    undefined,
    false
  );
};

export const fetchUniversityRankings = async (entryType?: string): Promise<UniversityRankingData[]> => {
  const mock = () => {
    let items = [...mockUniversityRankings];
    if (entryType) items = items.filter(r => r.entry_type === entryType);
    return items;
  };
  const params = entryType ? { entry_type: entryType } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/university-rankings', mock, params, true);
};

export const fetchNonAcademicStaff = async (category?: string): Promise<NonAcademicStaffData[]> => {
  const mock = () => {
    let staff = [...mockNonAcademicStaff];
    if (category) staff = staff.filter(s => s.category === category);
    return staff;
  };
  const params = category ? { category } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/non-academic-staff', mock, params, true);
};

export const fetchNonAcademicStaffById = async (id: string | number): Promise<NonAcademicStaffData | undefined> => {
  const mock = () => mockNonAcademicStaff.find(s => s.id === parseInt(id as string));
  return fetchWithFallback(`/public/non-academic-staff/${id}`, mock);
};

export const fetchPeopleStats = async (): Promise<PeopleStatsData> => {
  return fetchWithFallback('/public/people-stats', () => ({ ...mockPeopleStats }));
};

export const fetchCTAStats = async (): Promise<CTAStatsData> => {
  return fetchWithFallback('/public/cta-stats', () => ({ ...mockCTAStats }));
};

export const fetchPartners = async (): Promise<PartnerData[]> => {
  return fetchWithFallback('/public/partners', () => [...mockPartners], undefined, true);
};

export const fetchKeyMetrics = async (category?: string): Promise<KeyMetricData[]> => {
  const mock = () => {
    let items = [...mockKeyMetrics];
    if (category) items = items.filter(m => m.category === category);
    return items;
  };
  const params = category ? { category } as unknown as Record<string, unknown> : undefined;
  return fetchWithFallback('/public/key-metrics', mock, params, true);
};

export const fetchSDGMetrics = async (): Promise<Record<string, SDGData>> => {
  return fetchWithFallback('/public/sdg-metrics', () => ({ ...mockSDGMetrics }));
};

interface FetchNewsParams {
  limit?: number;
}

export const fetchNews = async (params: FetchNewsParams = {}): Promise<NewsItem[]> => {
  const mock = () => {
    let news = [...mockNews];
    if (params.limit) news = news.slice(0, params.limit);
    return news;
  };
  return fetchWithFallback('/public/news', mock, params as unknown as Record<string, unknown>);
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsItem | undefined> => {
  const mock = () => mockNews.find(n => n.slug === slug);
  return fetchWithFallback(`/public/news/${slug}`, mock);
};

export const fetchResearchCenters = async (): Promise<ResearchCenter[]> => {
  const data = await fetchWithFallback('/public/research-development', () => [...mockResearchCenters]);
  return data.length > 0 ? data : [...mockResearchCenters];
};

interface HomeStats {
  researchPapers: number;
  students: number;
  faculty: number;
  partners: number;
}

export const fetchHomeStats = async (): Promise<HomeStats> => {
  const mock = () => ({
    researchPapers: 1247,
    students: 3500,
    faculty: 450,
    partners: 28
  });
  const raw = await fetchWithFallback<Record<string, unknown>>('/public/home-stats', mock);
  return {
    researchPapers: (raw.research_papers ?? raw.researchPapers ?? 0) as number,
    students: (raw.students ?? 0) as number,
    faculty: (raw.faculty ?? 0) as number,
    partners: (raw.partners ?? 0) as number,
  };
};

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string;
}

interface FetchEventsParams {
  limit?: number;
}

export const fetchEvents = async (params: FetchEventsParams = {}): Promise<EventItem[]> => {
  const mock = () => {
    const events: EventItem[] = [
      { id: 1, title: "Admission Deadline for Undergraduate Programs", date: "2025-06-30", location: "Online", type: "Deadline" },
      { id: 2, title: "International Conference on Tropical Medicine", date: "2025-07-15", location: "BMU Campus, Yenagoa", type: "Conference" },
      { id: 3, title: "CPD Workshop: Advanced Biostatistics", date: "2025-05-20", location: "Virtual", type: "Workshop" }
    ];
    if (params.limit) return events.slice(0, params.limit);
    return events;
  };
  return fetchWithFallback('/public/events', mock, params as unknown as Record<string, unknown>);
};

export const fetchInternationalPartners = async (): Promise<InternationalPartnerData[]> => {
  return fetchWithFallback(
    '/public/international-partners',
    mockInternationalPartners,
    undefined,
    true
  );
};

export const fetchAllInternationalPartners = async (): Promise<InternationalPartnerData[]> => {
  return fetchWithFallback(
    '/public/international-partners',
    mockInternationalPartners,
    undefined,
    true
  );
};

const mapPublication = (raw: Record<string, unknown>): PublicationData => ({
  id: raw.id as number,
  title: raw.title as string,
  authors: (raw.authors_list as string[]) || [],
  journal: (raw.journal_name as string) || '',
  year: raw.year as number,
  type: raw.publication_type as string,
  doi: raw.doi as string | undefined,
  citations: (raw.citations as number) || 0,
  category: (raw.category as string) || '',
  abstract: raw.abstract as string | undefined,
  keywords: raw.keywords ? (raw.keywords as string).split(',').map((k: string) => k.trim()) : undefined,
  volume: raw.volume as string | undefined,
  issue: raw.issue as string | undefined,
  pages: raw.pages as string | undefined,
});

export const submitGrantApplication = async (data: GrantApplicationSubmitData): Promise<GrantApplicationData> => {
  try {
    const response = await apiClient.post('/public/grant-applications', data);
    return response.data;
  } catch {
    const mockId = Math.floor(Math.random() * 10000);
    return {
      id: mockId,
      grant_id: data.grant_id,
      grant_title: '',
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_phone: data.applicant_phone || '',
      proposal_title: data.proposal_title,
      proposal_summary: data.proposal_summary,
      proposed_budget: data.proposed_budget || null,
      duration_months: data.duration_months || null,
      status: 'pending',
      status_display: 'Pending Review',
      reviewer_notes: '',
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
    };
  }
};

export const getGrantApplicationStatus = async (applicationId: number): Promise<GrantApplicationData> => {
  try {
    const response = await apiClient.get(`/public/grant-applications/${applicationId}`);
    return response.data;
  } catch {
    throw new Error('Application not found');
  }
};

export const fetchAllEvents = async (): Promise<EventData[]> => {
  try {
    const response = await apiClient.get('/public/events');
    const items = response.data?.items || response.data;
    if (items && Array.isArray(items) && items.length > 0) {
      return items;
    }
    return mockEvents;
  } catch {
    return mockEvents;
  }
};

export const registerForEvent = async (data: EventRegistrationInput): Promise<EventRegistrationData> => {
  try {
    const response = await apiClient.post('/public/event-registrations', data);
    return response.data;
  } catch {
    return {
      id: Math.floor(Math.random() * 10000),
      event_id: data.event_id,
      name: data.name,
      email: data.email,
      status: 'registered',
      status_display: 'Registered',
      amount_paid: null,
      payment_status: 'completed',
      payment_status_display: 'Completed',
      payment_reference: '',
      paid_at: null,
      registered_at: new Date().toISOString(),
    };
  }
};

export const initializeEventPayment = async (data: PaymentInitializeInput): Promise<PaymentInitializeResponse> => {
  try {
    const response = await apiClient.post('/public/event-registrations/initialize-payment', data);
    return response.data;
  } catch {
    return {
      authorization_url: '',
      access_code: 'demo_access_code',
      reference: `EVT-DEMO-${Date.now()}`,
      registration_id: Math.floor(Math.random() * 10000),
    };
  }
};

export const verifyEventPayment = async (reference: string): Promise<PaymentVerifyResponse> => {
  try {
    const response = await apiClient.get('/public/event-registrations/verify-payment', { params: { reference } });
    return response.data;
  } catch {
    return {
      status: 'success',
      message: 'Payment verified (demo mode)',
      registration: {
        id: Math.floor(Math.random() * 10000),
        event_id: 0,
        name: '',
        email: '',
        status: 'registered',
        status_display: 'Registered',
        amount_paid: 0,
        payment_status: 'completed',
        payment_status_display: 'Completed',
        payment_reference: reference,
        paid_at: new Date().toISOString(),
        registered_at: new Date().toISOString(),
      },
    };
  }
};

export const fetchGalleryImages = async (): Promise<GalleryImageData[]> => {
  try {
    const response = await apiClient.get('/public/gallery');
    const data = response.data?.items || response.data;
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return mockGalleryImages;
  } catch {
    return mockGalleryImages;
  }
};

export const downloadPublicDocument = (docId: number): void => {
  const url = `/api/public/public-documents/${docId}/download`;
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadGalleryImage = (imageId: number, title: string): void => {
  const url = `/api/public/gallery/${imageId}/download`;
  const link = document.createElement('a');
  link.href = url;
  link.download = title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const fetchResearchGrants = async (): Promise<GrantData[]> => {
  return fetchWithFallback(
    '/public/research-grants',
    mockResearchGrants,
    undefined,
    true
  );
};

export const fetchPublications = async (): Promise<PublicationData[]> => {
  try {
    const response = await apiClient.get('/public/publications');
    let data = response.data;
    if (data && Array.isArray(data.items)) {
      data = data.items;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapPublication);
    }
  } catch {
    // fall through to mock
  }
  return mockPublications;
};

export const fetchCampusFeatures = async (sectionKey?: string): Promise<CampusFeatureData[]> => {
  try {
    const response = await apiClient.get('/public/campus-features', { params: { section_key: sectionKey } });
    let data = response.data;
    if (data && Array.isArray(data.items)) {
      data = data.items;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  if (sectionKey) {
    return mockCampusFeatures.filter((f) => f.section_key === sectionKey);
  }
  return mockCampusFeatures;
};

export const fetchCampusStats = async (): Promise<CampusStatData[]> => {
  try {
    const response = await apiClient.get('/public/campus-stats');
    let data = response.data;
    if (data && Array.isArray(data.items)) {
      data = data.items;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  return mockCampusStats;
};

export const fetchCampusTestimonials = async (): Promise<CampusTestimonialData[]> => {
  try {
    const response = await apiClient.get('/public/campus-testimonials');
    let data = response.data;
    if (data && Array.isArray(data.items)) {
      data = data.items;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  return mockCampusTestimonials;
};

export const fetchCampusContact = async (): Promise<CampusContactInfoData | null> => {
  try {
    const response = await apiClient.get('/public/campus-contact');
    const data = response.data;
    if (data && typeof data === 'object' && data.id) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  return mockCampusContactInfo;
};

export const fetchCampusImages = async (): Promise<CampusImageData[]> => {
  try {
    const response = await apiClient.get('/public/campus-images');
    let data = response.data;
    if (data && Array.isArray(data.items)) {
      data = data.items;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  return mockCampusImages;
};

export const fetchCampusVideo = async (): Promise<CampusVideoData | null> => {
  try {
    const response = await apiClient.get('/public/campus-video');
    const data = response.data;
    if (data && typeof data === 'object' && data.id) {
      return data;
    }
  } catch {
    // fall through to mock
  }
  return mockCampusVideo;
};

export interface AvailableCourse {
  id: number;
  code: string;
  title: string;
  credit_units: number;
  level: number;
  course_type: string;
  semester: string;
  capacity: number;
  enrolled_count: number;
  available_slots: number;
  has_prerequisites_met: boolean;
  has_conflict: boolean;
  is_selected: boolean;
}

export interface RegistrationCourseItem {
  id: number;
  course_id: number;
  course_code: string;
  course_title: string;
  credit_units: number;
  is_compulsory: boolean;
  approval_status: string;
  rejection_reason: string;
}

export interface CurrentRegistration {
  id: number;
  academic_year: string;
  semester: string;
  level: number;
  status: string;
  total_credit_units: number;
  remarks: string;
  courses: RegistrationCourseItem[];
}

// ============================================================================
// Navigation & Menu API
// ============================================================================

export interface MenuItemData {
  id: number;
  label: string;
  url: string;
  is_external: boolean;
  parent_id: number | null;
  location: string;
  icon: string;
  description: string;
  column: number;
  display_order: number;
  children: MenuItemData[];
}

export interface UtilityLinkData {
  id: number;
  label: string;
  url: string;
  display_order: number;
}

export interface FacultyCustomLinkData {
  id: number;
  label: string;
  url: string;
  display_order: number;
}

export interface PageSectionData {
  id: number;
  page_key: string;
  section_key: string;
  content_type: string;
  title: string;
  subtitle: string;
  data: Record<string, unknown>;
  display_order: number;
}

export interface PortalDefinitionData {
  id: number;
  title: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  audience: string;
  features: Record<string, unknown>;
  display_order: number;
}

export interface CentrePageData {
  id: number;
  slug: string;
  slug_display: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  extra_data: Record<string, unknown>;
}

export interface ArchivedContentData {
  id: number;
  content_type: string;
  content_type_display: string;
  title: string;
  description: string;
  original_date: string;
  category: string;
  original_url: string;
  file_url: string;
  file_size: string;
  archived_by: string;
  display_order: number;
}

export interface InstitutePageData {
  id: number;
  name: string;
  focus: string;
  director: string;
  projects_count: number;
  description: string;
  display_order: number;
}

export const fetchPageSections = async (pageKey: string): Promise<PageSectionData[]> => {
  return fetchWithFallback(`/public/page-sections/${pageKey}`, () => [] as PageSectionData[]);
};

export const fetchPortalDefinitions = async (): Promise<PortalDefinitionData[]> => {
  return fetchWithFallback('/public/portal-definitions', () => [] as PortalDefinitionData[]);
};

export const fetchCentrePages = async (): Promise<CentrePageData[]> => {
  return fetchWithFallback('/public/centre-pages', () => [] as CentrePageData[]);
};

export const fetchCentrePage = async (slug: string): Promise<CentrePageData | null> => {
  return fetchWithFallback(`/public/centre-pages/${slug}`, () => null);
};

export const fetchArchivedContent = async (contentType?: string): Promise<ArchivedContentData[]> => {
  const url = contentType
    ? `/public/archived-content?content_type=${contentType}`
    : '/public/archived-content';
  return fetchWithFallback(url, () => [] as ArchivedContentData[]);
};

export const fetchInstitutePages = async (): Promise<InstitutePageData[]> => {
  return fetchWithFallback('/public/institute-pages', () => [] as InstitutePageData[]);
};

export const fetchMenuItems = async (location?: string): Promise<MenuItemData[]> => {
  const params: Record<string, string> = {};
  if (location) params.location = location;
  return fetchWithFallback('/public/menu-items', () => [] as MenuItemData[], params as unknown as Record<string, unknown>);
};

export const fetchUtilityLinks = async (): Promise<UtilityLinkData[]> => {
  return fetchWithFallback('/public/utility-links', () => [] as UtilityLinkData[]);
};

export const registrationApi = {
  getAvailableCourses: async (): Promise<AvailableCourse[]> => {
    const res = await apiClient.get('/auth/student/registration/available-courses');
    return res.data;
  },

  getCurrent: async (): Promise<CurrentRegistration | null> => {
    try {
      const res = await apiClient.get('/auth/student/registration/current');
      return res.data;
    } catch {
      return null;
    }
  },

  init: async (): Promise<CurrentRegistration> => {
    const res = await apiClient.post('/auth/student/registration/init');
    return res.data;
  },

  addCourse: async (courseId: number): Promise<{ message: string; total_units: number }> => {
    const res = await apiClient.post('/auth/student/registration/add-course', { course_id: courseId });
    return res.data;
  },

  removeCourse: async (courseId: number): Promise<{ message: string; total_units: number }> => {
    const res = await apiClient.post('/auth/student/registration/remove-course', { course_id: courseId });
    return res.data;
  },

  submit: async (): Promise<{ message: string; status: string }> => {
    const res = await apiClient.post('/auth/student/registration/submit');
    return res.data;
  },

  listAll: async (): Promise<CurrentRegistration[]> => {
    const res = await apiClient.get('/auth/student/registrations');
    return res.data;
  },
};

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
    role_display: string;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_image?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (data: RegisterPayload): Promise<LoginResponse> => {
    const res = await apiClient.post('/v1/auth/register/', data);
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/profile');
    return res.data;
  },

  updateProfile: async (data: ProfileUpdatePayload) => {
    const res = await apiClient.put('/v1/auth/profile/update/', data);
    return res.data;
  },

  changePassword: async (old_password: string, new_password: string) => {
    const res = await apiClient.post('/v1/auth/password/change/', {
      old_password,
      new_password,
    });
    return res.data;
  },

  requestPasswordReset: async (email: string) => {
    const res = await apiClient.post('/v1/auth/password/reset/', { email });
    return res.data;
  },

  resetPasswordConfirm: async (uid: string, token: string, new_password: string) => {
    const res = await apiClient.post('/v1/auth/password/reset/confirm/', {
      uid,
      token,
      new_password,
    });
    return res.data;
  },
};

export interface CourseResult {
  id: number;
  student_id: number;
  student_name: string;
  matric_number: string;
  course_id: number;
  course_code: string;
  course_title: string;
  credit_units: number;
  assignment_score: number | null;
  exam_score: number | null;
  total_score: number | null;
  grade: string;
  grade_point: number | null;
  result_status: string;
  attendance_percentage: number | null;
}

export interface SemesterResult {
  session: string;
  semester: string;
  level: number;
  gpa: number;
  cgpa: number;
  academic_status: string;
  is_published: boolean;
  courses: CourseResult[];
  carryover: CourseResult[];
}

export interface LecturerCourse {
  id: number;
  code: string;
  title: string;
  credit_units: number;
}

export interface GradeEntry {
  student_id: number;
  assignment_score: number | null;
  exam_score: number | null;
  attendance_percentage: number | null;
}

export interface GradeUploadPayload {
  session: string;
  semester: string;
  course_id: number;
  scores: GradeEntry[];
}

export const resultsApi = {
  getDetail: async (): Promise<SemesterResult[]> => {
    const res = await apiClient.get('/auth/student/results/detail');
    return res.data;
  },
};

export interface PendingResult {
  student_course_id: number;
  student_name: string;
  matric_number: string;
  course_code: string;
  course_title: string;
  assignment_score: number | null;
  exam_score: number | null;
  total_score: number | null;
  grade: string;
}

export const approvalApi = {
  getHodPending: async (session: string, semester: string, courseId?: number): Promise<PendingResult[]> => {
    const params: Record<string, string> = { session, semester };
    if (courseId) params.course_id = String(courseId);
    const res = await apiClient.get('/auth/hod/pending-results', { params });
    return res.data;
  },
  hodApprove: async (studentCourseIds: number[], rejectionReason = ''): Promise<{ approved: number; message: string }> => {
    const res = await apiClient.post('/auth/hod/approve-results', { student_course_ids: studentCourseIds, rejection_reason: rejectionReason });
    return res.data;
  },
  getDeanPending: async (session: string, semester: string, courseId?: number): Promise<PendingResult[]> => {
    const params: Record<string, string> = { session, semester };
    if (courseId) params.course_id = String(courseId);
    const res = await apiClient.get('/auth/dean/pending-results', { params });
    return res.data;
  },
  deanApprove: async (studentCourseIds: number[]): Promise<{ approved: number; message: string }> => {
    const res = await apiClient.post('/auth/dean/approve-results', { student_course_ids: studentCourseIds });
    return res.data;
  },
  getSenatePending: async (session: string, semester: string, courseId?: number): Promise<PendingResult[]> => {
    const params: Record<string, string> = { session, semester };
    if (courseId) params.course_id = String(courseId);
    const res = await apiClient.get('/auth/admin/pending-senate-results', { params });
    return res.data;
  },
  senateApprove: async (studentCourseIds: number[]): Promise<{ approved: number; message: string }> => {
    const res = await apiClient.post('/auth/admin/senate-approve-results', { student_course_ids: studentCourseIds });
    return res.data;
  },
  batchPublish: async (session: string, semester: string, studentIds?: number[]): Promise<{ published: number; message: string }> => {
    const res = await apiClient.post('/auth/admin/batch-publish-results', { session, semester, student_ids: studentIds });
    return res.data;
  },
};

export const lecturerApi = {
  getCourses: async (session: string, semester: string): Promise<LecturerCourse[]> => {
    const res = await apiClient.get('/auth/lecturer/courses', { params: { session, semester } });
    return res.data;
  },
  getCourseStudents: async (session: string, semester: string, courseId: number): Promise<CourseResult[]> => {
    const res = await apiClient.get('/auth/lecturer/courses/students', { params: { session, semester, course_id: courseId } });
    return res.data;
  },
  saveGrades: async (payload: GradeUploadPayload): Promise<{ saved: number; message: string }> => {
    const res = await apiClient.post('/auth/lecturer/grades/save', payload);
    return res.data;
  },
  submitGrades: async (payload: GradeUploadPayload): Promise<{ submitted: number; message: string }> => {
    const res = await apiClient.post('/auth/lecturer/grades/submit', payload);
    return res.data;
  },
};

export { apiClient };

// ============================================================================
// CHAT ADMIN API
// ============================================================================

export interface ChatConversation {
  id: number;
  session_id: string;
  visitor_name: string;
  visitor_email: string;
  status: string;
  is_active: boolean;
  agent_assigned_id: number | null;
  agent_assigned_name: string;
  created_at: string;
  updated_at: string;
  last_message: string;
  message_count: number;
}

export interface ChatConversationDetail extends ChatConversation {
  agent_assigned_at: string | null;
  messages: Array<{
    id: number;
    role: string;
    content: string;
    created_at: string;
  }>;
}

export interface ChatConversationStats {
  total: number;
  active: number;
  agent_handling: number;
  ended: number;
  unassigned: number;
}

export interface ChatAutoResponseEntry {
  id: number;
  trigger_keywords: string;
  question_pattern: string;
  response_text: string;
  category: string;
  category_display: string;
  priority: number;
  is_active: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export const chatAdminApi = {
  getConversations: async (status?: string): Promise<ChatConversation[]> => {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    const res = await apiClient.get('/chat/conversations', { params });
    return res.data;
  },

  getConversationStats: async (): Promise<ChatConversationStats> => {
    const res = await apiClient.get('/chat/conversations/stats');
    return res.data;
  },

  getConversationDetail: async (id: number): Promise<ChatConversationDetail> => {
    const res = await apiClient.get(`/chat/conversations/${id}`);
    return res.data;
  },

  joinConversation: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const res = await apiClient.post(`/chat/conversations/${id}/join`);
    return res.data;
  },

  leaveConversation: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const res = await apiClient.post(`/chat/conversations/${id}/leave`);
    return res.data;
  },

  endConversation: async (id: number): Promise<{ ok: boolean; message: string }> => {
    const res = await apiClient.post(`/chat/conversations/${id}/end`);
    return res.data;
  },

  sendMessage: async (id: number, content: string): Promise<{ ok: boolean; message: { id: number; role: string; content: string; created_at: string } }> => {
    const res = await apiClient.post(`/chat/conversations/${id}/send`, { content });
    return res.data;
  },

  toggleAgentStatus: async (isOnline: boolean): Promise<{ ok: boolean; is_online: boolean }> => {
    const res = await apiClient.post('/chat/agent-status', { is_online: isOnline });
    return res.data;
  },

  getAutoResponses: async (category?: string): Promise<ChatAutoResponseEntry[]> => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    const res = await apiClient.get('/chat/auto-responses', { params });
    return res.data;
  },

  createAutoResponse: async (data: { trigger_keywords: string; question_pattern?: string; response_text: string; category?: string; priority?: number; is_active?: boolean }): Promise<ChatAutoResponseEntry> => {
    const res = await apiClient.post('/chat/auto-responses', data);
    return res.data;
  },

  updateAutoResponse: async (id: number, data: { trigger_keywords: string; question_pattern?: string; response_text: string; category?: string; priority?: number; is_active?: boolean }): Promise<ChatAutoResponseEntry> => {
    const res = await apiClient.put(`/chat/auto-responses/${id}`, data);
    return res.data;
  },

  deleteAutoResponse: async (id: number): Promise<{ ok: boolean }> => {
    const res = await apiClient.delete(`/chat/auto-responses/${id}`);
    return res.data;
  },
};
