import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { CollegeLayout } from './layouts/CollegeLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { LecturerLayout } from './layouts/LecturerLayout';
import { HODLayout } from './layouts/HODLayout';
import { DeanLayout } from './layouts/DeanLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ChatWidget } from './components/chat/ChatWidget';

// Pages - Public
import { Home } from './pages/Home';
import { About } from './pages/About/About';
import { History } from './pages/About/History';
import { Leadership } from './pages/About/Leadership';
import { LeaderProfile } from './pages/About/LeaderProfile';
import { Rankings } from './pages/About/Rankings';
import { Contact } from './pages/About/Contact';
import { VisionMission } from './pages/About/VisionMission';
import { Governance } from './pages/About/Governance';
import { CampusLife } from './pages/About/CampusLife';
import { Staff } from './pages/About/Staff';
import { PublicDocuments } from './pages/About/PublicDocuments';
import { People } from './pages/About/People';
import { StaffProfile } from './pages/About/StaffProfile';
import { Academics } from './pages/Academics/Academics';
import { Programs } from './pages/Academics/Programs';
import { ProgramDetail } from './pages/Academics/ProgramDetail';
import { AcademicCalendar } from './pages/Academics/AcademicCalendar';
import { Faculties } from './pages/Academics/Faculties';
import { Faculty } from './pages/Academics/Faculty';
import { Admissions } from './pages/Academics/Admissions';
import { Library } from './pages/Academics/Library';
import { Colleges } from './pages/Colleges/Colleges';
import { CollegeDetail } from './pages/Academics/CollegeDetail';
import { FacultyDetail } from './pages/Academics/FacultyDetail';
import { DepartmentDetail } from './pages/Academics/DepartmentDetail';
import { AcademicUnits } from './pages/Academics/AcademicUnits';
import { Research } from './pages/Research/Research';
import { ResearchAndDevelopment } from './pages/Research/ResearchAndDevelopment';
import { Publications } from './pages/Research/Publications';
import { PublicationDetail } from './pages/Research/PublicationDetail';
import { ResearchDetail } from './pages/Research/ResearchDetail';
import { ResearchFunding } from './pages/Research/ResearchFunding';
import { Collaborations } from './pages/Research/Collaborations';
import { FacultyDirectory } from './pages/Research/FacultyDirectory';
import { FacultyProfile } from './pages/Research/FacultyProfile';
import { Impact } from './pages/Impact/Impact';
import { SDGDashboard } from './pages/Impact/SDGDashboard';
import { ExternalPartners } from './pages/Impact/ExternalPartners';
import { FundedProjectDetail } from './pages/Impact/FundedProjectDetail';
import { Community } from './pages/Impact/Community';
import { Sustainability } from './pages/Impact/Sustainability';
import { Health } from './pages/Impact/Health';
import { International } from './pages/International/International';
import { Partnerships } from './pages/International/Partnerships';
import { Exchange } from './pages/International/Exchange';
import { InternationalStudents } from './pages/International/InternationalStudents';
import { Visitors } from './pages/International/Visitors';
import { Gallery } from './pages/Gallery/Gallery';
import { Apply } from './pages/Apply/Apply';
import { ApplicationPortal } from './pages/Apply/ApplicationPortal';
import { ApplicationStatus } from './pages/Apply/ApplicationStatus';
import { News } from './pages/News/News';
import { NewsDetail } from './pages/News/NewsDetail';
import { Announcements } from './pages/News/Announcements';
import { PressReleases } from './pages/News/PressReleases';
import { Events } from './pages/Events/Events';
import { EventDetail } from './pages/Events/EventDetail';
import { EventCalendar } from './pages/Events/EventCalendar';
import { PastEvents } from './pages/Events/PastEvents';
import { Search } from './pages/Search/Search';
import { NotFound } from './pages/NotFound';

// Institutes & Centres
import { ForeignLanguages } from './pages/Institutes/ForeignLanguages';
import { ResearchInstitutes } from './pages/Institutes/ResearchInstitutes';
import { CareerCentre } from './pages/Centres/CareerCentre';
import { JobBoard } from './pages/Careers/JobBoard';
import { FoundationStudies } from './pages/Centres/FoundationStudies';
import { CPDCentre } from './pages/Centres/CPDCentre';
import { InnovationCentre } from './pages/Centres/InnovationCentre';

// Archive & Other
import { ArchivePage } from './pages/Archive/Archive';
import { SiteAnnouncements } from './pages/More/Announcements';

// Pages - Portals
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { StudentPortal } from './pages/Portals/StudentPortal';
import { CourseRegistration } from './pages/Portals/CourseRegistration';
import { ResultViewer } from './pages/Portals/ResultViewer';
import { LecturerGradeEntry } from './pages/Portals/LecturerGradeEntry';
import { LecturerPortal } from './pages/Portals/LecturerPortal';
import { HODApproval, DeanApproval, SenateApproval } from './pages/Portals/ApprovalPages';
import { BatchPublish } from './pages/Portals/BatchPublish';
import { AlumniPortal } from './pages/Portals/AlumniPortal';
import { CPDPlatform } from './pages/Portals/CPDPlatform';
import { ApplicantPortal } from './pages/Portals/ApplicantPortal';
import { Portals } from './pages/Portals/Portals';
import { AdminDashboard } from './pages/Portals/AdminDashboard';
import { AnalyticsDashboard } from './pages/Portals/AnalyticsDashboard';
import { AgentChat } from './pages/Portals/AgentChat';
import { StudentProgression } from './pages/Portals/StudentProgression';
import { QRAttendanceScanner } from './pages/Portals/QRAttendanceScanner';
import { FeePayment } from './pages/Portals/FeePayment';
import { DefaulterReport } from './pages/Portals/DefaulterReport';
import { HODDashboard } from './pages/Portals/HODDashboard';
import { DeanDashboard } from './pages/Portals/DeanDashboard';
import { VCDashboard } from './pages/Portals/VCDashboard';
import { RegistrarDashboard } from './pages/Portals/RegistrarDashboard';
import { UniversalLogin } from './pages/Portals/UniversalLogin';
import { BursaryDashboard } from './pages/Portals/BursaryDashboard';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// i18n
import './i18n';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <ErrorBoundary>
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
