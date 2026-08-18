import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import {
  fetchHomeStats,
  fetchNews,
  fetchNewsBySlug,
  fetchEvents,
  fetchAllEvents,
  fetchColleges,
  fetchFaculty,
  fetchFacultyById,
  fetchFaculties,
  fetchPrograms,
  fetchProgramBySlug,
  fetchSDGMetrics,
  fetchResearchCenters,
  fetchPublications,
  fetchResearchGrants,
  fetchLeadership,
  fetchPeopleStats,
  fetchCTAStats,
  fetchPartners,
  fetchNonAcademicStaff,
  fetchNonAcademicStaffById,
  fetchInternationalPartners,
  fetchAllInternationalPartners,
  fetchKeyMetrics,
  fetchFundingOrganizations,
  fetchFundedProjects,
  fetchFundingStats,
  submitContactEnquiry,
  submitApplication,
  checkApplicationStatus,
  fetchAcademicCalendar,
  fetchAdmissionRequirements,
  fetchImportantDates,
  fetchBooks,
  fetchDigitalResources,
  fetchLibraryServices,
  fetchLibraryStats,
  fetchLibraryHours,
  fetchLibraryGuidelines,
  fetchDeadlines,
  fetchExchangePrograms,
  fetchStudentSupportServices,
  fetchCampusStats,
  fetchCampusTestimonials,
  fetchCampusContact,
  fetchCampusImages,
  fetchCampusVideo,
  fetchContactInfo,
  fetchJobs,
  fetchCPDCourses,
  fetchImpactPrograms,
  fetchHeroSlides,
  fetchPageContent,
  fetchGalleryImages,
  fetchCampusFeatures,
  fetchPublicationById,
  fetchSearchResults,
  fetchTestimonials,
  fetchLeadershipById,
  fetchUniversityRankings,
  fetchPublicDocuments,
  fetchAboutPage,
  fetchHistoryPage,
  fetchVisionMissionPage,
  fetchGovernancePage,
  fetchAnnouncements,
  fetchMenuItems,
  fetchUtilityLinks,
  fetchPageSections,
  fetchAlumni,
  fetchAlumniCount,
  fetchPortalDefinitions,
  fetchCentrePages,
  fetchCentrePage,
  fetchArchivedContent,
  fetchInstitutePages,
  registerForEvent,
  initializeEventPayment,
  verifyEventPayment,
  submitGrantApplication,
} from './api';

export function useHomeStats() {
  return useQuery({
    queryKey: ['homeStats'],
    queryFn: fetchHomeStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => fetchNews(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: () => fetchNewsBySlug(slug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAllEvents() {
  return useQuery({
    queryKey: ['allEvents'],
    queryFn: fetchAllEvents,
    staleTime: 10 * 60 * 1000,
  });
}

export function useColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: fetchColleges,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFaculty() {
  return useQuery({
    queryKey: ['faculty'],
    queryFn: () => fetchFaculty(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFacultyById(id: number) {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: () => fetchFacultyById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: fetchFaculties,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => fetchPrograms(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProgramBySlug(slug: string) {
  return useQuery({
    queryKey: ['programs', slug],
    queryFn: () => fetchProgramBySlug(slug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSDGMetrics() {
  return useQuery({
    queryKey: ['sdgMetrics'],
    queryFn: fetchSDGMetrics,
    staleTime: 10 * 60 * 1000,
  });
}

export function useResearchCenters() {
  return useQuery({
    queryKey: ['researchCenters'],
    queryFn: fetchResearchCenters,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublications() {
  return useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications,
    staleTime: 10 * 60 * 1000,
  });
}

export function useResearchGrants() {
  return useQuery({
    queryKey: ['researchGrants'],
    queryFn: fetchResearchGrants,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLeadership() {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: fetchLeadership,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLeadershipById(id: string | number) {
  return useQuery({
    queryKey: ['leadership', id],
    queryFn: () => fetchLeadershipById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePeopleStats() {
  return useQuery({
    queryKey: ['peopleStats'],
    queryFn: fetchPeopleStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCTAStats() {
  return useQuery({
    queryKey: ['ctaStats'],
    queryFn: fetchCTAStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: fetchPartners,
    staleTime: 10 * 60 * 1000,
  });
}

export function useNonAcademicStaff() {
  return useQuery({
    queryKey: ['nonAcademicStaff'],
    queryFn: () => fetchNonAcademicStaff(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useNonAcademicStaffById(id: string | number) {
  return useQuery({
    queryKey: ['nonAcademicStaff', id],
    queryFn: () => fetchNonAcademicStaffById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useInternationalPartners() {
  return useQuery({
    queryKey: ['internationalPartners'],
    queryFn: fetchInternationalPartners,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAllInternationalPartners() {
  return useQuery({
    queryKey: ['allInternationalPartners'],
    queryFn: fetchAllInternationalPartners,
    staleTime: 10 * 60 * 1000,
  });
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ['heroSlides'],
    queryFn: fetchHeroSlides,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePageContent(pageSection: string) {
  return useQuery({
    queryKey: ['pageContent', pageSection],
    queryFn: () => fetchPageContent(pageSection),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAboutPage() {
  return useQuery({
    queryKey: ['aboutPage'],
    queryFn: fetchAboutPage,
    staleTime: 10 * 60 * 1000,
  });
}

export function useHistoryPage() {
  return useQuery({
    queryKey: ['historyPage'],
    queryFn: fetchHistoryPage,
    staleTime: 10 * 60 * 1000,
  });
}

export function useVisionMissionPage() {
  return useQuery({
    queryKey: ['visionMissionPage'],
    queryFn: fetchVisionMissionPage,
    staleTime: 10 * 60 * 1000,
  });
}

export function useGovernancePage() {
  return useQuery({
    queryKey: ['governancePage'],
    queryFn: fetchGovernancePage,
    staleTime: 10 * 60 * 1000,
  });
}

export function useGalleryImages() {
  return useQuery({
    queryKey: ['galleryImages'],
    queryFn: fetchGalleryImages,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusFeatures(sectionKey?: string) {
  return useQuery({
    queryKey: ['campusFeatures', sectionKey],
    queryFn: () => fetchCampusFeatures(sectionKey),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchResults(query: string) {
  return useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => fetchSearchResults(query),
    staleTime: 0,
    enabled: query.length >= 2,
  });
}

export function usePublicationById(id: string) {
  return useQuery({
    queryKey: ['publication', id],
    queryFn: () => fetchPublicationById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useEventRegistration() {
  return useMutation({
    mutationFn: registerForEvent,
  });
}

export function useInitializePayment() {
  return useMutation({
    mutationFn: initializeEventPayment,
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (reference: string) => verifyEventPayment(reference),
  });
}

export function useSubmitGrantApplication() {
  return useMutation({
    mutationFn: submitGrantApplication,
  });
}

export function useKeyMetrics() {
  return useQuery({
    queryKey: ['keyMetrics'],
    queryFn: () => fetchKeyMetrics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFundingOrganizations() {
  return useQuery({
    queryKey: ['fundingOrganizations'],
    queryFn: fetchFundingOrganizations,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFundedProjects() {
  return useQuery({
    queryKey: ['fundedProjects'],
    queryFn: () => fetchFundedProjects(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFundingStats() {
  return useQuery({
    queryKey: ['fundingStats'],
    queryFn: fetchFundingStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSubmitContactEnquiry() {
  return useMutation({
    mutationFn: submitContactEnquiry,
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: submitApplication,
  });
}

export function useApplicationStatus(applicationId: string) {
  return useQuery({
    queryKey: ['applicationStatus', applicationId],
    queryFn: () => checkApplicationStatus(applicationId),
    staleTime: 30 * 1000,
    enabled: applicationId.length > 0,
  });
}

export function useAcademicCalendar() {
  return useQuery({
    queryKey: ['academicCalendar'],
    queryFn: fetchAcademicCalendar,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAdmissionRequirements() {
  return useQuery({
    queryKey: ['admissionRequirements'],
    queryFn: () => fetchAdmissionRequirements(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useImportantDates() {
  return useQuery({
    queryKey: ['importantDates'],
    queryFn: fetchImportantDates,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDigitalResources() {
  return useQuery({
    queryKey: ['digitalResources'],
    queryFn: fetchDigitalResources,
    staleTime: 10 * 60 * 1000,
  });
}

export function useExchangePrograms() {
  return useQuery({
    queryKey: ['exchangePrograms'],
    queryFn: fetchExchangePrograms,
    staleTime: 10 * 60 * 1000,
  });
}

export function useStudentSupportServices() {
  return useQuery({
    queryKey: ['studentSupportServices'],
    queryFn: fetchStudentSupportServices,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUniversityRankings(entryType?: string) {
  return useQuery({
    queryKey: ['universityRankings', entryType],
    queryFn: () => fetchUniversityRankings(entryType),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicDocuments(category?: string) {
  return useQuery({
    queryKey: ['publicDocuments', category],
    queryFn: () => fetchPublicDocuments(category),
    staleTime: 10 * 60 * 1000,
  });
}

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCPDCourses() {
  return useQuery({
    queryKey: ['cpdCourses'],
    queryFn: fetchCPDCourses,
    staleTime: 10 * 60 * 1000,
  });
}

export function useImpactPrograms(programType?: string) {
  return useQuery({
    queryKey: ['impactPrograms', programType],
    queryFn: () => fetchImpactPrograms(programType),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusStats() {
  return useQuery({
    queryKey: ['campusStats'],
    queryFn: fetchCampusStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusTestimonials() {
  return useQuery({
    queryKey: ['campusTestimonials'],
    queryFn: fetchCampusTestimonials,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusContact() {
  return useQuery({
    queryKey: ['campusContact'],
    queryFn: fetchCampusContact,
    staleTime: 10 * 60 * 1000,
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: fetchContactInfo,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusImages() {
  return useQuery({
    queryKey: ['campusImages'],
    queryFn: fetchCampusImages,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCampusVideo() {
  return useQuery({
    queryKey: ['campusVideo'],
    queryFn: fetchCampusVideo,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLibraryServices() {
  return useQuery({
    queryKey: ['libraryServices'],
    queryFn: fetchLibraryServices,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLibraryStats() {
  return useQuery({
    queryKey: ['libraryStats'],
    queryFn: fetchLibraryStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLibraryHours() {
  return useQuery({
    queryKey: ['libraryHours'],
    queryFn: fetchLibraryHours,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLibraryGuidelines() {
  return useQuery({
    queryKey: ['libraryGuidelines'],
    queryFn: fetchLibraryGuidelines,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDeadlines() {
  return useQuery({
    queryKey: ['deadlines'],
    queryFn: fetchDeadlines,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: fetchAnnouncements,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenuItems(location?: string) {
  return useQuery({
    queryKey: ['menuItems', location],
    queryFn: () => fetchMenuItems(location),
    staleTime: 30 * 60 * 1000,
  });
}

export function useUtilityLinks() {
  return useQuery({
    queryKey: ['utilityLinks'],
    queryFn: fetchUtilityLinks,
    staleTime: 30 * 60 * 1000,
  });
}

export function usePageSections(pageKey: string) {
  return useQuery({
    queryKey: ['pageSections', pageKey],
    queryFn: () => fetchPageSections(pageKey),
    staleTime: 30 * 60 * 1000,
  });
}

export function useAlumni(limit = 6) {
  return useQuery({
    queryKey: ['alumni', limit],
    queryFn: () => fetchAlumni(limit),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAlumniCount() {
  return useQuery({
    queryKey: ['alumniCount'],
    queryFn: fetchAlumniCount,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePortalDefinitions() {
  return useQuery({
    queryKey: ['portalDefinitions'],
    queryFn: fetchPortalDefinitions,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCentrePages() {
  return useQuery({
    queryKey: ['centrePages'],
    queryFn: fetchCentrePages,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCentrePage(slug: string) {
  return useQuery({
    queryKey: ['centrePage', slug],
    queryFn: () => fetchCentrePage(slug),
    staleTime: 30 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useArchivedContent(contentType?: string) {
  return useQuery({
    queryKey: ['archivedContent', contentType],
    queryFn: () => fetchArchivedContent(contentType),
    staleTime: 30 * 60 * 1000,
  });
}

export function useInstitutePages() {
  return useQuery({
    queryKey: ['institutePages'],
    queryFn: fetchInstitutePages,
    staleTime: 30 * 60 * 1000,
  });
}
