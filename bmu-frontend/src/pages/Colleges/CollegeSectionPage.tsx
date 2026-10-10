import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import {
  Loader2,
  ChevronRight,
  BookOpen,
  Users,
  FlaskConical,
  ArrowRight,
  Building2,
  MapPin,
  Award,
  GraduationCap,
} from 'lucide-react';

interface CollegeSubPageProps {
  section: 'programs' | 'faculty' | 'research';
}

interface DepartmentNode {
  id: number;
  name: string;
  slug: string;
  code?: string;
}

interface FacultyNode {
  id: number;
  name: string;
  slug: string;
  code?: string;
  leadership_name?: string;
  leadership_title?: string;
  department_count?: number;
  departments?: DepartmentNode[];
}

interface CollegeDetailData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  overview_content?: string;
  mission_statement?: string;
  vision_statement?: string;
  faculty_count?: number;
  program_count?: number;
  department_count?: number;
}

interface HierarchyData {
  college: { id: number; name: string; slug: string };
  faculties: FacultyNode[];
}

interface ProgramItem {
  id: number;
  title: string;
  slug: string;
  degree?: string;
  level?: string;
  category?: string;
  duration?: string;
  description?: string;
}

const SECTION_META = {
  programs: { title: 'Programmes', icon: BookOpen },
  faculty: { title: 'Faculties & Departments', icon: Users },
  research: { title: 'Research', icon: FlaskConical },
};

export const CollegeSectionPage = ({ section }: CollegeSubPageProps) => {
  const { collegeSlug } = useParams<{ collegeSlug: string }>();
  const meta = SECTION_META[section];

  const collegeQuery = useQuery({
    queryKey: ['college', collegeSlug],
    queryFn: async (): Promise<CollegeDetailData | null> => {
      if (!collegeSlug) return null;
      const response = await apiClient.get(`/public/colleges/${collegeSlug}`);
      if (response.data?.id) return response.data;
      return null;
    },
    enabled: !!collegeSlug,
  });

  const hierarchyQuery = useQuery({
    queryKey: ['college-hierarchy', collegeSlug],
    queryFn: async (): Promise<HierarchyData | null> => {
      if (!collegeSlug) return null;
      const response = await apiClient
        .get(`/public/colleges/${collegeSlug}/hierarchy`)
        .catch(() => null);
      return response?.data ?? null;
    },
    enabled: !!collegeSlug,
  });

  const college = collegeQuery.data;
  const hierarchy = hierarchyQuery.data;

  const programsQuery = useQuery({
    queryKey: ['college-programs', college?.id],
    queryFn: async (): Promise<ProgramItem[]> => {
      if (!college?.id) return [];
      const response = await apiClient.get('/public/programs', { params: { college_id: college.id } });
      const data = response.data;
      return (data?.items || data || []) as ProgramItem[];
    },
    enabled: section === 'programs' && !!college?.id,
  });

  const isLoading = collegeQuery.isLoading || hierarchyQuery.isLoading || programsQuery.isLoading;

  const coreText = college?.description || college?.overview_content || '';

  const breadcrumb = (
    <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
      <Link to="/" className="hover:text-white transition">Home</Link>
      <span>/</span>
      <Link to="/academics/colleges" className="hover:text-white transition">Colleges</Link>
      <span>/</span>
      <Link to={`/colleges/${collegeSlug}`} className="hover:text-white transition capitalize">
        {collegeSlug?.replace(/-/g, ' ')}
      </Link>
      <span>/</span>
      <span className="text-white font-medium">{meta.title}</span>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{meta.title} | {college?.name || 'College'} | Bayelsa Medical University</title>
        <meta name="description" content={`Explore ${meta.title.toLowerCase()} at ${college?.name || 'Bayelsa Medical University'}.`} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {breadcrumb}
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-16 h-16 bg-white/10 items-center justify-center shrink-0">
                <meta.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest text-primary-600 font-semibold mb-2">{college?.name}</p>
                <h1 className="text-display text-white mb-4">{meta.title}</h1>
                <p className="text-lead text-white/80 max-w-2xl">
                  {coreText}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick sub-nav */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="container-custom flex items-center gap-1 overflow-x-auto">
          {(['programs', 'faculty', 'research'] as const).map((key) => {
            const active = key === section;
            const Icon = SECTION_META[key].icon;
            return (
              <Link
                key={key}
                to={`/colleges/${collegeSlug}/${key}`}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  active ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-ink-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {SECTION_META[key].title}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <section className="py-14">
        <div className="container-custom">
          {isLoading && !college && !hierarchy ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-ink-900 animate-spin" />
            </div>
          ) : (
            <>
              {section === 'programs' && (
                <div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {programsQuery.data && programsQuery.data.length > 0 ? (
                      programsQuery.data.map((program) => (
                        <Link
                          key={program.id}
                          to={`/academics/programs/${program.slug}`}
                          className="group bg-white shadow-sm p-6 hover:shadow-md transition"
                        >
                          <div className="w-12 h-12 bg-primary-600/10 flex items-center justify-center mb-4">
                            <GraduationCap className="w-6 h-6 text-primary-600" />
                          </div>
                          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition">
                            {program.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {[program.degree, program.duration, program.level].filter(Boolean).join(' • ') || 'Undergraduate Programme'}
                          </p>
                          {program.description && (
                            <p className="text-sm text-gray-600 mt-3 line-clamp-3">{program.description}</p>
                          )}
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-600 col-span-full bg-white shadow-sm p-8">
                        Programme details are currently being published for this college.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {section === 'faculty' && (
                <div>
                  {hierarchy?.faculties && hierarchy.faculties.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {hierarchy.faculties.map((faculty) => (
                        <div key={faculty.id} className="bg-white shadow-sm p-6">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary-600/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{faculty.name}</h3>
                                {faculty.leadership_name && (
                                  <p className="text-sm text-gray-500">
                                    {faculty.leadership_title}: {faculty.leadership_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Link
                              to={`/academics/faculties/${faculty.slug}`}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium whitespace-nowrap"
                            >
                              View Faculty
                            </Link>
                          </div>
                          {faculty.departments && faculty.departments.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Departments</p>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {faculty.departments.map((dept) => (
                                  <Link
                                    key={dept.id}
                                    to={`/departments/${dept.slug}`}
                                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                    {dept.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white shadow-sm p-8 flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5 text-gray-400" />
                      Faculty information is being published for this college.
                    </div>
                  )}
                </div>
              )}

              {section === 'research' && (
                <div>
                  {(college?.overview_content || college?.mission_statement || college?.vision_statement) && (
                    <div className="space-y-6 mb-10">
                      <div className="space-y-5">
                        {[
                          { label: 'Research Overview', body: college?.overview_content },
                          { label: 'Mission', body: college?.mission_statement },
                          { label: 'Vision', body: college?.vision_statement },
                        ]
                          .filter((c) => c.body)
                          .map((c) => (
                            <div key={c.label} className="bg-white shadow-sm p-6">
                              <h2 className="text-lg font-bold text-gray-900 mb-2">{c.label}</h2>
                              <p className="text-gray-600 leading-relaxed">{c.body}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-ink-900 text-white p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-6 h-6 text-primary-600" />
                      <h2 className="text-xl font-bold">Research Across the University</h2>
                    </div>
                    <p className="text-white/80 mb-6">
                      Research at Bayelsa Medical University is delivered through our faculties,
                      research institutes and innovation centres. Explore university-wide projects,
                      publications and funding opportunities.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/research"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-ink-900 font-semibold hover:bg-white/90 transition"
                      >
                        Research Overview <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/research/publications"
                        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white font-semibold hover:bg-white/10 transition"
                      >
                        Publications
                      </Link>
                      <Link
                        to="/research/funding"
                        className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white font-semibold hover:bg-white/10 transition"
                      >
                        Research Funding
                      </Link>
                    </div>
                  </div>

                  {hierarchy?.faculties && hierarchy.faculties.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        Faculties in this College
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {hierarchy.faculties.map((faculty) => (
                          <Link
                            key={faculty.id}
                            to={`/academics/faculties/${faculty.slug}`}
                            className="px-5 py-3 bg-white shadow-sm font-medium text-gray-700 hover:text-primary-600 transition"
                          >
                            {faculty.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};