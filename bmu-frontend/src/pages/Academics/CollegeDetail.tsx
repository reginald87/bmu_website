import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  ArrowRight,
  Target,
  Eye,
  ChevronRight
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface College {
  id: number;
  name: string;
  slug: string;
  description: string;
  overview_content: string;
  mission_statement: string;
  vision_statement: string;
  provost_id: number | null;
  provost_name: string;
  provost_title: string;
  provost_photo: string | null;
  director_name: string;
  established_year: number;
  faculty_count: number;
  student_count: number;
  primary_color: string;
  secondary_color: string;
  banner_image: string | null;
}

interface Faculty {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  leadership_name: string;
  leadership_title: string;
  department_count: number;
  departments: Array<{
    id: number;
    name: string;
    slug: string;
    code: string | null;
  }>;
}

interface HierarchyData {
  college: College;
  faculties: Faculty[];
}

const fallbackColleges = [
  {
    id: 1, name: 'College of Medicine', slug: 'medicine',
    fullName: 'Flagship medical college', color: '#1E1E1E',
    description: 'The College of Medicine is the flagship college of BMU...',
    faculty_count: 3, department_count: 12,
    provost_name: 'Prof. Emmanuel Ekanem',
    faculties: [
      { id: 1, name: 'Basic Medical Sciences', slug: 'basic-medical-sciences', code: 'BMS', description: 'Foundation medical sciences...', department_count: 6, dean_name: 'Prof. Godwin Ikorite' },
      { id: 2, name: 'Clinical Sciences', slug: 'clinical-sciences', code: 'CLS', description: 'Clinical training...', department_count: 8, dean_name: 'Dr. Jane Owei' },
      { id: 3, name: 'Community Medicine', slug: 'community-medicine', code: 'COM', description: 'Public health...', department_count: 4, dean_name: 'Prof. Michael Ogu' },
    ]
  },
  {
    id: 2, name: 'School of Allied Health Sciences', slug: 'allied-health',
    color: '#A51C30',
    description: 'Training professionals in medical laboratory science...',
    faculty_count: 3, department_count: 9, provost_name: 'Dr. Grace Ebi',
    faculties: [
      { id: 4, name: 'Medical Laboratory Science', slug: 'medical-lab-science', code: 'MLS', description: 'Training medical laboratory scientists...', department_count: 4, dean_name: 'Dr. Richard Peters' },
      { id: 5, name: 'Radiography', slug: 'radiography', code: 'RAD', description: 'Training radiographers...', department_count: 3, dean_name: 'Dr. Sarah Wodi' },
      { id: 6, name: 'Physiotherapy', slug: 'physiotherapy', code: 'PHT', description: 'Training physiotherapists...', department_count: 2, dean_name: 'Dr. Ebi Robinson' },
    ]
  },
  {
    id: 3, name: 'School of Nursing', slug: 'nursing',
    color: '#1E1E1E',
    description: 'Producing compassionate nursing professionals...',
    faculty_count: 2, department_count: 6, provost_name: 'Prof. Helen Douglas',
    faculties: [
      { id: 7, name: 'Nursing', slug: 'nursing-dept', code: 'NUR', description: 'Training professional nurses...', department_count: 4, dean_name: 'Prof. Helen Douglas' },
      { id: 8, name: 'Midwifery', slug: 'midwifery', code: 'MID', description: 'Training midwives...', department_count: 2, dean_name: 'Dr. Faith George' },
    ]
  },
  {
    id: 4, name: 'School of Postgraduate Studies', slug: 'postgraduate',
    color: '#A51C30',
    description: 'Advanced training and research...',
    faculty_count: 1, department_count: 0,
    faculties: [
      { id: 9, name: 'Postgraduate Programs', slug: 'postgraduate-programs', code: 'PGS', description: 'Advanced degrees...', department_count: 0, dean_name: 'Prof. Michael Ogu' },
    ]
  },
  {
    id: 5, name: 'Institute of Public Health', slug: 'public-health',
    color: '#1E1E1E',
    description: 'Focusing on population health...',
    faculty_count: 3, department_count: 8, provost_name: 'Prof. Chioma Amadi',
    faculties: [
      { id: 10, name: 'Epidemiology', slug: 'epidemiology', code: 'EPI', description: 'Disease patterns...', department_count: 3, dean_name: 'Prof. Chioma Amadi' },
      { id: 11, name: 'Health Policy', slug: 'health-policy', code: 'HPL', description: 'Health policy...', department_count: 3, dean_name: 'Dr. Emmanuel Akpan' },
      { id: 12, name: 'Biostatistics', slug: 'biostatistics', code: 'BIO', description: 'Statistical methods...', department_count: 2, dean_name: 'Dr. Ngozi Eze' },
    ]
  },
  {
    id: 6, name: 'Continuing Professional Development (CPD)', slug: 'cpd',
    color: '#A51C30',
    description: 'Lifelong learning for medical professionals...',
    faculty_count: 0, department_count: 0,
    faculties: [
      { id: 13, name: 'Professional Development', slug: 'professional-development', code: 'CPD', description: 'Lifelong learning...', department_count: 0, dean_name: 'Dr. Peter Iruo' },
    ]
  },
];

function mapItemToHierarchy(item: Record<string, unknown>): HierarchyData {
  return {
    college: {
      id: item.id as number,
      name: item.name as string,
      slug: item.slug as string,
      description: (item.description as string) || '',
      overview_content: (item.overview_content as string) || '',
      mission_statement: (item.mission_statement as string) || '',
      vision_statement: (item.vision_statement as string) || '',
      provost_id: (item.provost_id as number) ?? null,
      provost_name: (item.provost_name as string) || '',
      provost_title: (item.provost_title as string) || '',
      provost_photo: (item.provost_photo as string) ?? null,
      director_name: (item.director_name as string) || '',
      established_year: (item.established_year as number) || 0,
      faculty_count: (item.faculty_count as number) || 0,
      student_count: (item.student_count as number) || 0,
      primary_color: (item.primary_color as string) || (item.color as string) || '#1E1E1E',
      secondary_color: (item.secondary_color as string) || '',
      banner_image: (item.banner_image as string) ?? null,
    },
    faculties: ((item.faculties as Array<Record<string, unknown>>) || []).map(f => ({
      id: f.id as number,
      name: f.name as string,
      slug: f.slug as string,
      code: (f.code as string) ?? null,
      description: (f.description as string) || '',
      leadership_name: (f.leadership_name as string) || (f.dean_name as string) || '',
      leadership_title: (f.leadership_title as string) || '',
      department_count: (f.department_count as number) || 0,
      departments: ((f.departments as Array<Record<string, unknown>>) || []).map(d => ({
        id: d.id as number,
        name: d.name as string,
        slug: d.slug as string,
        code: (d.code as string) ?? null,
      })),
    })),
  };
}

export const CollegeDetail = () => {
  const { collegeSlug } = useParams<{ collegeSlug: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['college', collegeSlug],
    queryFn: async (): Promise<HierarchyData> => {
      if (!collegeSlug) throw new Error('College not found');

      // Fetch college detail and hierarchy in parallel
      try {
        const [collegeResp, hierarchyResp] = await Promise.all([
          apiClient.get(`/public/colleges/${collegeSlug}`),
          apiClient.get(`/public/colleges/${collegeSlug}/hierarchy`).catch(() => null),
        ]);

        const collegeData = collegeResp.data;
        if (collegeData && collegeData.id) {
          const hierarchy = hierarchyResp?.data;
          return {
            college: {
              id: collegeData.id,
              name: collegeData.name,
              slug: collegeData.slug,
              description: collegeData.description || '',
              overview_content: collegeData.overview_content || '',
              mission_statement: collegeData.mission_statement || '',
              vision_statement: collegeData.vision_statement || '',
              provost_id: collegeData.provost_id ?? null,
              provost_name: collegeData.leadership_name || '',
              provost_title: collegeData.leadership_title || '',
              provost_photo: collegeData.provost_photo ?? null,
              director_name: collegeData.director_name || '',
              established_year: collegeData.established_year || 0,
              faculty_count: collegeData.faculty_count || 0,
              student_count: collegeData.student_count || 0,
              primary_color: collegeData.primary_color || '#1E1E1E',
              secondary_color: collegeData.secondary_color || '',
              banner_image: collegeData.banner_image ?? collegeData.preview_image ?? null,
            },
            faculties: hierarchy?.faculties || [],
          };
        }
      } catch {
        // Fall through
      }

      // Fallback to list endpoint and find by slug
      try {
        const response = await apiClient.get('/public/colleges');
        const items: unknown = response.data?.items || response.data;
        if (Array.isArray(items)) {
          const found = items.find((item: Record<string, unknown>) => item.slug === collegeSlug);
          if (found) {
            if (found.college) {
              return found as unknown as HierarchyData;
            }
            return mapItemToHierarchy(found as Record<string, unknown>);
          }
        }
      } catch {
        // API unavailable — fall through to fallback
      }

      const found = fallbackColleges.find(c => c.slug === collegeSlug);
      if (found) {
        return mapItemToHierarchy(found as unknown as Record<string, unknown>);
      }

      throw new Error('College not found');
    },
    enabled: !!collegeSlug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-[#1E1E1E]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
          <p className="text-gray-600 mb-4">The college you're looking for doesn't exist.</p>
          <Link to="/academics" className="text-[#1E1E1E] font-medium hover:underline">
            Back to Academics
          </Link>
        </div>
      </div>
    );
  }

  const { college, faculties } = data;
  const primaryColor = college.primary_color || '#1E1E1E';

  return (
    <>
      <Helmet>
        <title>{college.name} - Bayelsa Medical University</title>
        <meta name="description" content={college.description} />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative pt-[140px] pb-20 overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/academics" className="hover:text-white transition">Academics</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{college.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h1 className="text-display text-white mb-6">
                  {college.name}
                </h1>
                <p className="text-lead text-white/80 max-w-2xl">
                  {college.description}
                </p>
              </div>

              {/* Provost Card */}
              {college.provost_name && (
                <div className="bg-white/10 backdrop-blur-sm p-6 text-center">
                  {college.provost_photo ? (
                    <img src={college.provost_photo} alt={college.provost_name} className="w-28 h-28 object-cover mx-auto" />
                  ) : (
                    <div className="w-28 h-28 bg-white/20 flex items-center justify-center mx-auto">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <p className="text-white/60 text-sm mt-4">{college.provost_title}</p>
                  <Link
                    to={college.provost_id ? `/leadership/${college.provost_id}` : '#'}
                    className="text-white font-bold text-lg hover:underline block mt-1"
                  >
                    {college.provost_name}
                  </Link>
                  {college.director_name && (
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <p className="text-white/60 text-sm">Director</p>
                      <p className="text-white font-medium">{college.director_name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      {college.overview_content && (
        <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <h2 className="text-headline text-gray-900 mb-6">Overview</h2>
              <p className="text-lead text-gray-600">{college.overview_content}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {college.mission_statement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Target className="w-6 h-6" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-title text-gray-900">Our Mission</h3>
                </div>
                <p className="text-body text-gray-600">{college.mission_statement}</p>
              </motion.div>
            )}

            {college.vision_statement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Eye className="w-6 h-6" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-title text-gray-900">Our Vision</h3>
                </div>
                <p className="text-body text-gray-600">{college.vision_statement}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: college.established_year, label: 'Established' },
              { value: college.faculty_count, label: 'Faculty Members' },
              { value: college.student_count, label: 'Students' },
              { value: faculties.length, label: 'Faculties & Schools' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-stat mb-1" style={{ color: primaryColor }}>{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculties */}
      {faculties.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-headline text-gray-900 mb-4">Faculties & Schools</h2>
              <p className="text-lead text-gray-600 max-w-2xl mx-auto">
                Academic units within {college.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculties.map((faculty, index) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/academics/faculties/${faculty.slug}?college=${college.slug}`}
                    className="block bg-white p-6 shadow-sm border border-gray-100 transition-shadow h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Building2 className="w-7 h-7" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-title text-gray-900 mb-1">{faculty.name}</h3>
                        {faculty.code && (
                          <span className="text-small text-gray-500">{faculty.code}</span>
                        )}
                        <p className="text-body text-gray-600 mt-2 line-clamp-2">
                          {faculty.description || `${faculty.department_count} departments`}
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-sm font-medium" style={{ color: primaryColor }}>
                          Explore <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: primaryColor }}>
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-headline text-white mb-4">
              Explore Programs at {college.name}
            </h2>
            <p className="text-lead text-white/80 mb-6 max-w-2xl mx-auto">
              Discover undergraduate and postgraduate programs designed to prepare you for a successful career in healthcare.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/academics/programs"
                className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
              >
                Browse Programs
              </Link>
              <Link
                to="/apply"
                className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
