import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ChatWidget } from './components/chat/ChatWidget';
import { PageSkeleton } from './components/common/LoadingSkeleton';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// i18n
import './i18n';

const lazyNamed = (name: string, loader: () => Promise<Record<string, ComponentType>>) =>
  lazy(() => loader().then((m) => ({ default: m[name] })));

// Layouts
const MainLayout = lazyNamed('MainLayout', () => import('./layouts/MainLayout'));
const CollegeLayout = lazyNamed('CollegeLayout', () => import('./layouts/CollegeLayout'));
const StudentLayout = lazyNamed('StudentLayout', () => import('./layouts/StudentLayout'));
const LecturerLayout = lazyNamed('LecturerLayout', () => import('./layouts/LecturerLayout'));
const HODLayout = lazyNamed('HODLayout', () => import('./layouts/HODLayout'));
const DeanLayout = lazyNamed('DeanLayout', () => import('./layouts/DeanLayout'));
const AdminLayout = lazyNamed('AdminLayout', () => import('./layouts/AdminLayout'));

// Pages - Public
const Home = lazyNamed('Home', () => import('./pages/Home'));
const About = lazyNamed('About', () => import('./pages/About/About'));
const History = lazyNamed('History', () => import('./pages/About/History'));
const Leadership = lazyNamed('Leadership', () => import('./pages/About/Leadership'));
const LeaderProfile = lazyNamed('LeaderProfile', () => import('./pages/About/LeaderProfile'));
const Rankings = lazyNamed('Rankings', () => import('./pages/About/Rankings'));
const Contact = lazyNamed('Contact', () => import('./pages/About/Contact'));
const VisionMission = lazyNamed('VisionMission', () => import('./pages/About/VisionMission'));
const Governance = lazyNamed('Governance', () => import('./pages/About/Governance'));
const CampusLife = lazyNamed('CampusLife', () => import('./pages/About/CampusLife'));
const Staff = lazyNamed('Staff', () => import('./pages/About/Staff'));
const PublicDocuments = lazyNamed('PublicDocuments', () => import('./pages/About/PublicDocuments'));
const People = lazyNamed('People', () => import('./pages/About/People'));
const StaffProfile = lazyNamed('StaffProfile', () => import('./pages/About/StaffProfile'));
const Academics = lazyNamed('Academics', () => import('./pages/Academics/Academics'));
const Programs = lazyNamed('Programs', () => import('./pages/Academics/Programs'));
const ProgramDetail = lazyNamed('ProgramDetail', () => import('./pages/Academics/ProgramDetail'));
const AcademicCalendar = lazyNamed('AcademicCalendar', () => import('./pages/Academics/AcademicCalendar'));
const Faculties = lazyNamed('Faculties', () => import('./pages/Academics/Faculties'));
const Faculty = lazyNamed('Faculty', () => import('./pages/Academics/Faculty'));
const Admissions = lazyNamed('Admissions', () => import('./pages/Academics/Admissions'));
const Library = lazyNamed('Library', () => import('./pages/Academics/Library'));
const Colleges = lazyNamed('Colleges', () => import('./pages/Colleges/Colleges'));
const CollegeDetail = lazyNamed('CollegeDetail', () => import('./pages/Academics/CollegeDetail'));
const FacultyDetail = lazyNamed('FacultyDetail', () => import('./pages/Academics/FacultyDetail'));
const DepartmentDetail = lazyNamed('DepartmentDetail', () => import('./pages/Academics/DepartmentDetail'));
const AcademicUnits = lazyNamed('AcademicUnits', () => import('./pages/Academics/AcademicUnits'));
const Research = lazyNamed('Research', () => import('./pages/Research/Research'));
const ResearchAndDevelopment = lazyNamed('ResearchAndDevelopment', () => import('./pages/Research/ResearchAndDevelopment'));
const Publications = lazyNamed('Publications', () => import('./pages/Research/Publications'));
const PublicationDetail = lazyNamed('PublicationDetail', () => import('./pages/Research/PublicationDetail'));
const ResearchDetail = lazyNamed('ResearchDetail', () => import('./pages/Research/ResearchDetail'));
const ResearchFunding = lazyNamed('ResearchFunding', () => import('./pages/Research/ResearchFunding'));
const Collaborations = lazyNamed('Collaborations', () => import('./pages/Research/Collaborations'));
const FacultyDirectory = lazyNamed('FacultyDirectory', () => import('./pages/Research/FacultyDirectory'));
const FacultyProfile = lazyNamed('FacultyProfile', () => import('./pages/Research/FacultyProfile'));
const Impact = lazyNamed('Impact', () => import('./pages/Impact/Impact'));
const SDGDashboard = lazyNamed('SDGDashboard', () => import('./pages/Impact/SDGDashboard'));
const ExternalPartners = lazyNamed('ExternalPartners', () => import('./pages/Impact/ExternalPartners'));
const FundedProjectDetail = lazyNamed('FundedProjectDetail', () => import('./pages/Impact/FundedProjectDetail'));
const Community = lazyNamed('Community', () => import('./pages/Impact/Community'));
const Sustainability = lazyNamed('Sustainability', () => import('./pages/Impact/Sustainability'));
const Health = lazyNamed('Health', () => import('./pages/Impact/Health'));
const International = lazyNamed('International', () => import('./pages/International/International'));
const Partnerships = lazyNamed('Partnerships', () => import('./pages/International/Partnerships'));
const Exchange = lazyNamed('Exchange', () => import('./pages/International/Exchange'));
const InternationalStudents = lazyNamed('InternationalStudents', () => import('./pages/International/InternationalStudents'));
const Visitors = lazyNamed('Visitors', () => import('./pages/International/Visitors'));
const Gallery = lazyNamed('Gallery', () => import('./pages/Gallery/Gallery'));
const Apply = lazyNamed('Apply', () => import('./pages/Apply/Apply'));
const ApplicationPortal = lazyNamed('ApplicationPortal', () => import('./pages/Apply/ApplicationPortal'));
const ApplicationStatus = lazyNamed('ApplicationStatus', () => import('./pages/Apply/ApplicationStatus'));
const News = lazyNamed('News', () => import('./pages/News/News'));
const NewsDetail = lazyNamed('NewsDetail', () => import('./pages/News/NewsDetail'));
const Announcements = lazyNamed('Announcements', () => import('./pages/News/Announcements'));
const PressReleases = lazyNamed('PressReleases', () => import('./pages/News/PressReleases'));
const Events = lazyNamed('Events', () => import('./pages/Events/Events'));
const EventDetail = lazyNamed('EventDetail', () => import('./pages/Events/EventDetail'));
const EventCalendar = lazyNamed('EventCalendar', () => import('./pages/Events/EventCalendar'));
const PastEvents = lazyNamed('PastEvents', () => import('./pages/Events/PastEvents'));
const Search = lazyNamed('Search', () => import('./pages/Search/Search'));
const NotFound = lazyNamed('NotFound', () => import('./pages/NotFound'));

// Institutes & Centres
const ForeignLanguages = lazyNamed('ForeignLanguages', () => import('./pages/Institutes/ForeignLanguages'));
const ResearchInstitutes = lazyNamed('ResearchInstitutes', () => import('./pages/Institutes/ResearchInstitutes'));
const CareerCentre = lazyNamed('CareerCentre', () => import('./pages/Centres/CareerCentre'));
const JobBoard = lazyNamed('JobBoard', () => import('./pages/Careers/JobBoard'));
const FoundationStudies = lazyNamed('FoundationStudies', () => import('./pages/Centres/FoundationStudies'));
const CPDCentre = lazyNamed('CPDCentre', () => import('./pages/Centres/CPDCentre'));
const InnovationCentre = lazyNamed('InnovationCentre', () => import('./pages/Centres/InnovationCentre'));

// Archive & Other
const ArchivePage = lazyNamed('ArchivePage', () => import('./pages/Archive/Archive'));
const SiteAnnouncements = lazyNamed('SiteAnnouncements', () => import('./pages/More/Announcements'));

// Pages - Portals
const HODApproval = lazyNamed('HODApproval', () => import('./pages/Portals/ApprovalPages'));
const DeanApproval = lazyNamed('DeanApproval', () => import('./pages/Portals/ApprovalPages'));
const SenateApproval = lazyNamed('SenateApproval', () => import('./pages/Portals/ApprovalPages'));
const StudentPortal = lazyNamed('StudentPortal', () => import('./pages/Portals/StudentPortal'));
const CourseRegistration = lazyNamed('CourseRegistration', () => import('./pages/Portals/CourseRegistration'));
const ResultViewer = lazyNamed('ResultViewer', () => import('./pages/Portals/ResultViewer'));
const LecturerGradeEntry = lazyNamed('LecturerGradeEntry', () => import('./pages/Portals/LecturerGradeEntry'));
const LecturerPortal = lazyNamed('LecturerPortal', () => import('./pages/Portals/LecturerPortal'));
const BatchPublish = lazyNamed('BatchPublish', () => import('./pages/Portals/BatchPublish'));
const AlumniPortal = lazyNamed('AlumniPortal', () => import('./pages/Portals/AlumniPortal'));
const CPDPlatform = lazyNamed('CPDPlatform', () => import('./pages/Portals/CPDPlatform'));
const ApplicantPortal = lazyNamed('ApplicantPortal', () => import('./pages/Portals/ApplicantPortal'));
const Portals = lazyNamed('Portals', () => import('./pages/Portals/Portals'));
const AdminDashboard = lazyNamed('AdminDashboard', () => import('./pages/Portals/AdminDashboard'));
const AnalyticsDashboard = lazyNamed('AnalyticsDashboard', () => import('./pages/Portals/AnalyticsDashboard'));
const AgentChat = lazyNamed('AgentChat', () => import('./pages/Portals/AgentChat'));
const StudentProgression = lazyNamed('StudentProgression', () => import('./pages/Portals/StudentProgression'));
const QRAttendanceScanner = lazyNamed('QRAttendanceScanner', () => import('./pages/Portals/QRAttendanceScanner'));
const FeePayment = lazyNamed('FeePayment', () => import('./pages/Portals/FeePayment'));
const DefaulterReport = lazyNamed('DefaulterReport', () => import('./pages/Portals/DefaulterReport'));
const HODDashboard = lazyNamed('HODDashboard', () => import('./pages/Portals/HODDashboard'));
const DeanDashboard = lazyNamed('DeanDashboard', () => import('./pages/Portals/DeanDashboard'));
const VCDashboard = lazyNamed('VCDashboard', () => import('./pages/Portals/VCDashboard'));
const RegistrarDashboard = lazyNamed('RegistrarDashboard', () => import('./pages/Portals/RegistrarDashboard'));
const UniversalLogin = lazyNamed('UniversalLogin', () => import('./pages/Portals/UniversalLogin'));
const BursaryDashboard = lazyNamed('BursaryDashboard', () => import('./pages/Portals/BursaryDashboard'));

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    {/* Main site routes with MainLayout (public header + footer) */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Home />} />
                      <Route path="about" element={<About />} />
                      <Route path="about/history" element={<History />} />
                      <Route path="about/leadership" element={<Leadership />} />
                      <Route path="about/leadership/:leaderId" element={<LeaderProfile />} />
                      <Route path="about/rankings" element={<Rankings />} />
                      <Route path="about/vision-mission" element={<VisionMission />} />
                      <Route path="about/governance" element={<Governance />} />
                      <Route path="/about/campus" element={<CampusLife />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="about/staff" element={<Staff />} />
                      <Route path="about/documents" element={<PublicDocuments />} />
                      <Route path="about/staff/:id" element={<StaffProfile />} />
                      <Route path="people" element={<People />} />
                      <Route path="contact" element={<Contact />} />

                      <Route path="academics" element={<Academics />} />
                      <Route path="academics/programs" element={<Programs />} />
                      <Route path="academics/programs/:slug" element={<ProgramDetail />} />
                      <Route path="academics/calendar" element={<AcademicCalendar />} />
                      <Route path="academics/colleges" element={<Colleges />} />
                      <Route path="academics/faculties" element={<Faculties />} />
                      <Route path="academics/faculty" element={<Faculty />} />
                      <Route path="academics/faculty/:id" element={<FacultyProfile />} />
                      <Route path="academics/faculties/:slug" element={<FacultyDetail />} />
                      <Route path="academics/departments" element={<AcademicUnits />} />
                      <Route path="departments/:slug" element={<DepartmentDetail />} />
                      <Route path="academics/admissions" element={<Admissions />} />
                      <Route path="academics/library" element={<Library />} />
                      <Route path="academic-units" element={<AcademicUnits />} />
                      <Route path="colleges" element={<Colleges />} />
                      <Route path="faculties/:slug" element={<FacultyDetail />} />

                      <Route path="research" element={<Research />} />
                      <Route path="research/centers" element={<ResearchAndDevelopment />} />
                      <Route path="research/publications" element={<Publications />} />
                      <Route path="research/publications/:id" element={<PublicationDetail />} />
                      <Route path="research/projects/:id" element={<ResearchDetail />} />
                      <Route path="research/funding" element={<ResearchFunding />} />
                      <Route path="research/collaborations" element={<Collaborations />} />
                      <Route path="research/faculty" element={<FacultyDirectory />} />
                      <Route path="research/faculty/:id" element={<FacultyProfile />} />

                      <Route path="impact" element={<Impact />} />
                      <Route path="impact/sdg-dashboard" element={<SDGDashboard />} />
                      <Route path="impact/community" element={<Community />} />
                      <Route path="impact/sustainability" element={<Sustainability />} />
                      <Route path="impact/health" element={<Health />} />
                      <Route path="impact/external-partners" element={<ExternalPartners />} />
                      <Route path="impact/external-partners/:projectId" element={<FundedProjectDetail />} />

                      <Route path="international" element={<International />} />
                      <Route path="international/partnerships" element={<Partnerships />} />
                      <Route path="international/exchange" element={<Exchange />} />
                      <Route path="international/students" element={<InternationalStudents />} />
                      <Route path="international/visitors" element={<Visitors />} />

                      <Route path="apply" element={<Apply />} />
                      <Route path="apply/portal" element={<ApplicationPortal />} />
                      <Route path="apply/status/:id" element={<ApplicationStatus />} />

                      <Route path="news" element={<News />} />
                      <Route path="news/:slug" element={<NewsDetail />} />
                      <Route path="news/announcements" element={<Announcements />} />
                      <Route path="news/press-releases" element={<PressReleases />} />

                      <Route path="events" element={<Events />} />
                      <Route path="events/:slug" element={<EventDetail />} />
                      <Route path="events/calendar" element={<EventCalendar />} />
                      <Route path="events/past" element={<PastEvents />} />

                      <Route path="institutes/foreign-languages" element={<ForeignLanguages />} />
                      <Route path="institutes/research" element={<ResearchInstitutes />} />

                      <Route path="archive" element={<ArchivePage />} />
                      <Route path="announcements" element={<SiteAnnouncements />} />

                      <Route path="centres/career" element={<CareerCentre />} />
                      <Route path="careers/jobs" element={<JobBoard />} />
                      <Route path="centres/foundation-studies" element={<FoundationStudies />} />
                      <Route path="centres/cpd" element={<CPDCentre />} />
                      <Route path="centres/innovation" element={<InnovationCentre />} />

                      <Route path="colleges/:collegeSlug" element={<CollegeLayout />}>
                        <Route index element={<CollegeDetail />} />
                        <Route path="programs" element={<div>College Programs</div>} />
                        <Route path="faculty" element={<div>College Faculty</div>} />
                        <Route path="research" element={<div>College Research</div>} />
                      </Route>

                      {/* Portal routes (non-student) */}
                      <Route path="portals/login" element={<UniversalLogin />} />
                      <Route path="portals" element={<Portals />} />
                      <Route path="portals/applicant" element={<ApplicantPortal />} />
                      <Route path="portals/alumni" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniPortal /></ProtectedRoute>} />
                      <Route path="portals/cpd" element={<CPDPlatform />} />
                      <Route path="portals/senate/approve-results" element={<ProtectedRoute allowedRoles={['admin','staff']}><SenateApproval /></ProtectedRoute>} />
                      <Route path="portals/vc" element={<ProtectedRoute allowedRoles={['vc','admin','staff','faculty']}><VCDashboard /></ProtectedRoute>} />
                      <Route path="portals/registrar" element={<ProtectedRoute allowedRoles={['registrar','admin','staff']}><RegistrarDashboard /></ProtectedRoute>} />
                      <Route path="portals/bursary" element={<ProtectedRoute allowedRoles={['bursary','admin','staff']}><BursaryDashboard /></ProtectedRoute>} />

                      <Route path="alumni-portal" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniPortal /></ProtectedRoute>} />
                      <Route path="search" element={<Search />} />
                    </Route>

                    {/* Lecturer routes */}
                    <Route path="portals/lecturer" element={<ProtectedRoute allowedRoles={['faculty','staff','admin']}><LecturerLayout /></ProtectedRoute>}>
                      <Route index element={<LecturerPortal />} />
                      <Route path="grade-entry" element={<LecturerGradeEntry />} />
                    </Route>

                    {/* HOD routes */}
                    <Route path="portals/hod" element={<ProtectedRoute allowedRoles={['hod','faculty','staff','admin']}><HODLayout /></ProtectedRoute>}>
                      <Route index element={<HODDashboard />} />
                      <Route path="approve-results" element={<HODApproval />} />
                    </Route>

                    {/* Dean routes */}
                    <Route path="portals/dean" element={<ProtectedRoute allowedRoles={['dean','faculty','staff','admin']}><DeanLayout /></ProtectedRoute>}>
                      <Route index element={<DeanDashboard />} />
                      <Route path="approve-results" element={<DeanApproval />} />
                    </Route>

                    {/* Admin routes */}
                    <Route path="portals/admin" element={<ProtectedRoute allowedRoles={['admin','staff']}><AdminLayout /></ProtectedRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="analytics" element={<AnalyticsDashboard />} />
                      <Route path="batch-publish" element={<BatchPublish />} />
                      <Route path="defaulter-report" element={<DefaulterReport />} />
                      <Route path="chat" element={<AgentChat />} />
                    </Route>

                    {/* Student routes - own layout, no public header/footer */}
                    <Route path="portals/student" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<StudentPortal />} />
                      <Route path="course-registration" element={<CourseRegistration />} />
                      <Route path="results" element={<ResultViewer />} />
                      <Route path="progression" element={<StudentProgression />} />
                      <Route path="attendance" element={<QRAttendanceScanner />} />
                      <Route path="fees" element={<FeePayment />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <ChatWidget />
              </ErrorBoundary>
            </BrowserRouter>
            <ToastContainer position="top-right" autoClose={5000} />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
