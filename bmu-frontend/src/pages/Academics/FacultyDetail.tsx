import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  ArrowRight, 
  Target,
  Eye,
  ChevronRight,
  Building
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface Department {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  leadership_name: string;
  staff_count: number;
}

interface FacultyData {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  mission_statement: string | null;
  vision_statement: string | null;
  college_id: number | null;
  college_name: string | null;
  leadership_name: string;
  leadership_title: string;
  dean_photo: string | null;
  department_count: number;
  program_count: number;
  staff_count: number;
  student_count: number;
  departments: Department[];
}

interface RawDepartment {
  id: number;
  name: string;
  slug: string;
  code?: string | null;
  description?: string;
  leadership_name?: string;
  hod_name?: string;
  staff_count?: number;
}

interface RawFacultyItem {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  mission_statement?: string | null;
  vision_statement?: string | null;
  college_id?: number | null;
  college_name?: string | null;
  collegeSlug?: string;
  college?: string;
  leadership_name?: string;
  leadership_title?: string;
  dean_name?: string;
  dean_title?: string;
  dean_photo?: string | null;
  department_count?: number;
  program_count?: number;
  staff_count?: number;
  student_count?: number;
  departments?: RawDepartment[];
  faculties?: RawFacultyItem[];
}

interface FallbackFaculty {
  collegeSlug: string;
  collegeName: string;
  collegeColor: string;
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  dean_name: string;
  department_count: number;
  departments: FallbackDepartment[];
}

interface FallbackDepartment {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  staff_count: number;
  hod_name: string;
}

const fallbackFaculties: FallbackFaculty[] = [
  {
    collegeSlug: '', collegeName: '', collegeColor: '#1E1E1E',
    id: 14, name: 'Science', slug: 'science', code: 'SCI',
    description: 'Faculty of Science offering programs in biological, physical, and mathematical sciences.',
    dean_name: 'Prof. Samuel Abasi', department_count: 4,
    departments: [
      { id: 19, name: 'Biological Sciences', slug: 'biological-sciences', code: 'BIO', description: 'Study of living organisms.', staff_count: 12, hod_name: 'Prof. Samuel Abasi' },
      { id: 20, name: 'Chemistry', slug: 'chemistry', code: 'CHM', description: 'Study of chemical processes.', staff_count: 8, hod_name: 'Dr. Ebi Robinson' },
      { id: 21, name: 'Physics', slug: 'physics', code: 'PHY', description: 'Study of matter and energy.', staff_count: 6, hod_name: 'Dr. Godwin Ikorite' },
      { id: 22, name: 'Mathematics', slug: 'mathematics', code: 'MTH', description: 'Study of mathematical theory and applications.', staff_count: 5, hod_name: 'Dr. Ngozi Eze' },
    ]
  },
  {
    collegeSlug: 'medicine', collegeName: 'College of Medicine', collegeColor: '#1E1E1E',
    id: 1, name: 'Basic Medical Sciences', slug: 'basic-medical-sciences', code: 'BMS',
    description: 'Foundation medical sciences including anatomy, physiology, and biochemistry.',
    dean_name: 'Prof. Godwin Ikorite', department_count: 6,
    departments: [
      { id: 1, name: 'Anatomy', slug: 'anatomy', code: 'ANT', description: 'Study of human body structure.', staff_count: 10, hod_name: 'Prof. Godwin Ikorite' },
      { id: 2, name: 'Physiology', slug: 'physiology', code: 'PHY', description: 'Study of body functions.', staff_count: 8, hod_name: 'Dr. Blessing Amadi' },
      { id: 3, name: 'Biochemistry', slug: 'biochemistry', code: 'BCH', description: 'Study of chemical processes in living organisms.', staff_count: 7, hod_name: 'Dr. Michael Ogu' },
    ]
  },
  {
    collegeSlug: 'medicine', collegeName: 'College of Medicine', collegeColor: '#1E1E1E',
    id: 2, name: 'Clinical Sciences', slug: 'clinical-sciences', code: 'CLS',
    description: 'Clinical training and patient care education.',
    dean_name: 'Dr. Jane Owei', department_count: 8,
    departments: [
      { id: 4, name: 'Internal Medicine', slug: 'internal-medicine', code: 'IMD', description: 'Adult medical care.', staff_count: 15, hod_name: 'Prof. Jane Owei' },
      { id: 5, name: 'Paediatrics', slug: 'paediatrics', code: 'PED', description: 'Child healthcare.', staff_count: 10, hod_name: 'Dr. Adaeze Nwosu' },
      { id: 6, name: 'Obstetrics & Gynaecology', slug: 'obstetrics-gynaecology', code: 'OBG', description: 'Women\'s health and childbirth.', staff_count: 12, hod_name: 'Dr. Faith George' },
    ]
  },
  {
    collegeSlug: 'medicine', collegeName: 'College of Medicine', collegeColor: '#1E1E1E',
    id: 3, name: 'Community Medicine', slug: 'community-medicine', code: 'COM',
    description: 'Public health and community healthcare education.',
    dean_name: 'Prof. Michael Ogu', department_count: 4,
    departments: [
      { id: 7, name: 'Public Health', slug: 'public-health', code: 'PBH', description: 'Population health and disease prevention.', staff_count: 6, hod_name: 'Dr. Ngozi Eze' },
    ]
  },
  {
    collegeSlug: 'allied-health', collegeName: 'School of Allied Health Sciences', collegeColor: '#A51C30',
    id: 4, name: 'Medical Laboratory Science', slug: 'medical-lab-science', code: 'MLS',
    description: 'Training medical laboratory scientists.',
    dean_name: 'Dr. Richard Peters', department_count: 4,
    departments: [
      { id: 8, name: 'Haematology', slug: 'haematology', code: 'HAE', description: 'Study of blood disorders.', staff_count: 5, hod_name: 'Dr. Richard Peters' },
      { id: 9, name: 'Medical Microbiology', slug: 'medical-microbiology', code: 'MMB', description: 'Study of disease-causing microorganisms.', staff_count: 6, hod_name: 'Dr. Sarah Wodi' },
    ]
  },
  {
    collegeSlug: 'allied-health', collegeName: 'School of Allied Health Sciences', collegeColor: '#A51C30',
    id: 5, name: 'Radiography', slug: 'radiography', code: 'RAD',
    description: 'Training radiographers and imaging specialists.',
    dean_name: 'Dr. Sarah Wodi', department_count: 3,
    departments: [
      { id: 10, name: 'Diagnostic Imaging', slug: 'diagnostic-imaging', code: 'DIM', description: 'Medical imaging techniques.', staff_count: 4, hod_name: 'Dr. Sarah Wodi' },
    ]
  },
  {
    collegeSlug: 'allied-health', collegeName: 'School of Allied Health Sciences', collegeColor: '#A51C30',
    id: 6, name: 'Physiotherapy', slug: 'physiotherapy', code: 'PHT',
    description: 'Training physiotherapists.',
    dean_name: 'Dr. Ebi Robinson', department_count: 2,
    departments: [
      { id: 11, name: 'General Physiotherapy', slug: 'general-physiotherapy', code: 'GPT', description: 'Physical rehabilitation.', staff_count: 3, hod_name: 'Dr. Ebi Robinson' },
    ]
  },
  {
    collegeSlug: 'nursing', collegeName: 'School of Nursing', collegeColor: '#1E1E1E',
    id: 7, name: 'Nursing', slug: 'nursing-dept', code: 'NUR',
    description: 'Training professional nurses.',
    dean_name: 'Prof. Helen Douglas', department_count: 4,
    departments: [
      { id: 12, name: 'General Nursing', slug: 'general-nursing', code: 'GNR', description: 'Comprehensive nursing care.', staff_count: 10, hod_name: 'Prof. Helen Douglas' },
      { id: 13, name: 'Psychiatric Nursing', slug: 'psychiatric-nursing', code: 'PSN', description: 'Mental health nursing.', staff_count: 4, hod_name: 'Dr. Faith George' },
    ]
  },
  {
    collegeSlug: 'nursing', collegeName: 'School of Nursing', collegeColor: '#1E1E1E',
    id: 8, name: 'Midwifery', slug: 'midwifery', code: 'MID',
    description: 'Training skilled midwives.',
    dean_name: 'Dr. Faith George', department_count: 2,
    departments: [
      { id: 14, name: 'General Midwifery', slug: 'general-midwifery', code: 'GMD', description: 'Maternal and newborn care.', staff_count: 5, hod_name: 'Dr. Faith George' },
    ]
  },
  {
    collegeSlug: 'postgraduate', collegeName: 'School of Postgraduate Studies', collegeColor: '#A51C30',
    id: 9, name: 'Postgraduate Programs', slug: 'postgraduate-programs', code: 'PGS',
    description: 'Advanced degrees and research training.',
    dean_name: 'Prof. Michael Ogu', department_count: 0,
    departments: []
  },
  {
    collegeSlug: 'public-health', collegeName: 'Institute of Public Health', collegeColor: '#1E1E1E',
    id: 10, name: 'Epidemiology', slug: 'epidemiology', code: 'EPI',
    description: 'Study of disease patterns and population health.',
    dean_name: 'Prof. Chioma Amadi', department_count: 3,
    departments: [
      { id: 15, name: 'Disease Surveillance', slug: 'disease-surveillance', code: 'DSV', description: 'Monitoring disease patterns.', staff_count: 4, hod_name: 'Prof. Chioma Amadi' },
      { id: 16, name: 'Field Epidemiology', slug: 'field-epidemiology', code: 'FEP', description: 'Outbreak investigation.', staff_count: 3, hod_name: 'Dr. Ngozi Eze' },
    ]
  },
  {
    collegeSlug: 'public-health', collegeName: 'Institute of Public Health', collegeColor: '#1E1E1E',
    id: 11, name: 'Health Policy', slug: 'health-policy', code: 'HPL',
    description: 'Health policy and management education.',
    dean_name: 'Dr. Emmanuel Akpan', department_count: 3,
    departments: [
      { id: 17, name: 'Health Administration', slug: 'health-administration', code: 'HAD', description: 'Healthcare management.', staff_count: 3, hod_name: 'Dr. Emmanuel Akpan' },
    ]
  },
  {
    collegeSlug: 'public-health', collegeName: 'Institute of Public Health', collegeColor: '#1E1E1E',
    id: 12, name: 'Biostatistics', slug: 'biostatistics', code: 'BIO',
    description: 'Statistical methods for health research.',
    dean_name: 'Dr. Ngozi Eze', department_count: 2,
    departments: [
      { id: 18, name: 'Health Statistics', slug: 'health-statistics', code: 'HST', description: 'Health data analysis.', staff_count: 2, hod_name: 'Dr. Ngozi Eze' },
    ]
  },
  {
    collegeSlug: 'cpd', collegeName: 'Continuing Professional Development (CPD)', collegeColor: '#A51C30',
    id: 13, name: 'Professional Development', slug: 'professional-development', code: 'CPD',
    description: 'Lifelong learning for healthcare professionals.',
    dean_name: 'Dr. Peter Iruo', department_count: 0,
    departments: []
  },
];

function mapFallbackToFacultyData(fb: FallbackFaculty): FacultyData {
  return {
    id: fb.id,
    name: fb.name,
    slug: fb.slug,
    code: fb.code,
    description: fb.description,
    mission_statement: null,
    vision_statement: null,
    college_id: null,
    college_name: fb.collegeName,
    leadership_name: fb.dean_name,
    leadership_title: 'Dean',
    dean_photo: null,
    department_count: fb.department_count,
    program_count: 0,
    staff_count: fb.departments.reduce((sum, d) => sum + (d.staff_count || 0), 0),
    student_count: 0,
    departments: fb.departments.map(d => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      code: d.code,
      description: d.description,
      leadership_name: d.hod_name,
      staff_count: d.staff_count,
    })),
  };
}

function findFacultyInData(data: unknown, collegeSlug: string | null, slug: string): FacultyData | null {
  const items = Array.isArray(data)
    ? (data as RawFacultyItem[])
    : (data as { items?: RawFacultyItem[] }).items;
  if (!Array.isArray(items)) return null;

  const tryFind = (list: RawFacultyItem[], cs: string | null, s: string) => {
    let candidates = list;
    if (cs) {
      candidates = list.filter((item) =>
        item.collegeSlug === cs || item.college_name === cs || item.college === cs
      );
    }
    return candidates.find((item) => item.slug === s);
  };

  const found = tryFind(items, collegeSlug, slug);
  if (found && found.name) {
    return {
      id: found.id,
      name: found.name,
      slug: found.slug,
      code: found.code ?? null,
      description: found.description ?? '',
      mission_statement: found.mission_statement ?? null,
      vision_statement: found.vision_statement ?? null,
      college_id: found.college_id ?? null,
      college_name: found.college_name ?? null,
       leadership_name: found.leadership_name ?? found.dean_name ?? '',
       leadership_title: found.leadership_title ?? found.dean_title ?? 'Dean',
       dean_photo: found.dean_photo ?? null,
      department_count: found.department_count ?? found.departments?.length ?? 0,
      program_count: found.program_count ?? 0,
      staff_count: found.staff_count ?? (found.departments ?? []).reduce((s: number, d: RawDepartment) => s + (d.staff_count ?? 0), 0),
      student_count: found.student_count ?? 0,
      departments: (found.departments ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        code: d.code ?? null,
        description: d.description ?? '',
        leadership_name: d.leadership_name ?? d.hod_name ?? '',
        staff_count: d.staff_count ?? 0,
      })),
    };
  }

  for (const college of items) {
    if (college.faculties && Array.isArray(college.faculties)) {
      if (collegeSlug && college.slug !== collegeSlug) continue;
      const inner = college.faculties.find((f) => f.slug === slug);
      if (inner) {
        return {
          id: inner.id,
          name: inner.name,
          slug: inner.slug,
          code: inner.code ?? null,
          description: inner.description ?? '',
          mission_statement: inner.mission_statement ?? null,
          vision_statement: inner.vision_statement ?? null,
          college_id: college.id ?? null,
          college_name: college.name ?? null,
           leadership_name: inner.leadership_name ?? inner.dean_name ?? '',
           leadership_title: inner.leadership_title ?? inner.dean_title ?? 'Dean',
           dean_photo: inner.dean_photo ?? null,
          department_count: inner.department_count ?? inner.departments?.length ?? 0,
          program_count: inner.program_count ?? 0,
          staff_count: inner.staff_count ?? (inner.departments ?? []).reduce((s: number, d: RawDepartment) => s + (d.staff_count ?? 0), 0),
          student_count: inner.student_count ?? 0,
          departments: (inner.departments ?? []).map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            code: d.code ?? null,
            description: d.description ?? '',
            leadership_name: d.leadership_name ?? d.hod_name ?? '',
            staff_count: d.staff_count ?? 0,
          })),
        };
      }
    }
  }

  return null;
}

export const FacultyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const collegeSlug = searchParams.get('college');
  const effectiveCollegeSlug = collegeSlug && collegeSlug !== 'null' && collegeSlug !== 'undefined' ? collegeSlug : null;

  const { data: faculty, isLoading, error } = useQuery<FacultyData | null>({
    queryKey: ['faculty', slug, effectiveCollegeSlug],
    queryFn: async () => {
      if (!slug) return null;

      try {
        const response = await apiClient.get(`/public/faculties/${slug}`);
        if (response.data && response.data.name) {
          return response.data as FacultyData;
        }
      } catch {
        // fall through
      }

      try {
        const response = await apiClient.get('/public/colleges');
        const found = findFacultyInData(response.data, effectiveCollegeSlug, slug);
        if (found) return found;
      } catch {
        // fall through to fallback
      }

      let fallback = [...fallbackFaculties];
      if (effectiveCollegeSlug) {
        fallback = fallback.filter(f => f.collegeSlug === effectiveCollegeSlug);
      }
      const fb = fallback.find(f => f.slug === slug);
      return fb ? mapFallbackToFacultyData(fb) : null;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-[#1E1E1E]"></div>
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Faculty Not Found</h2>
          <p className="text-gray-600 mb-4">The faculty you're looking for doesn't exist.</p>
          <Link to="/academics/faculties" className="text-[#1E1E1E] font-medium hover:underline">
            Back to Faculties
          </Link>
        </div>
      </div>
    );
  }

  const facultyStats = [
    faculty.department_count ? { value: faculty.department_count, label: 'Departments' } : null,
    faculty.program_count ? { value: faculty.program_count, label: 'Programs' } : null,
    faculty.staff_count ? { value: faculty.staff_count, label: 'Faculty Members' } : null,
    faculty.student_count ? { value: faculty.student_count, label: 'Students' } : null,
  ].filter(Boolean) as { value: number; label: string }[];

  return (
    <>
      <Helmet>
        <title>{faculty.name} | Bayelsa Medical University</title>
        <meta name="description" content={faculty.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-[140px] pb-20 overflow-hidden bg-[#1E1E1E]">
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
              {faculty.college_name && (
                <>
                  <Link to={`/colleges/${faculty.college_id}`} className="hover:text-white transition">
                    {faculty.college_name}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-white font-medium">{faculty.name}</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {faculty.code && (
                  <span className="inline-block px-3 py-1 bg-[#A51C30] text-[#1E1E1E] text-sm font-semibold mb-4">
                    {faculty.code}
                  </span>
                )}
                <h1 className="text-display text-white mb-6">
                  {faculty.name}
                </h1>
                <p className="text-lead text-white/80 max-w-2xl">
                  {faculty.description}
                </p>
              </div>

              {/* Dean Card */}
              {faculty.leadership_name && (
                <div className="bg-white/10 backdrop-blur-sm p-6 text-center">
                  {faculty.dean_photo ? (
                    <img src={faculty.dean_photo} alt={faculty.leadership_name} className="w-28 h-28 object-cover mx-auto" />
                  ) : (
                    <div className="w-28 h-28 bg-white/20 flex items-center justify-center mx-auto">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <p className="text-white/60 text-sm mt-4">{faculty.leadership_title}</p>
                  <p className="text-white font-bold text-lg mt-1">{faculty.leadership_name}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faculty.mission_statement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#1E1E1E]" />
                  </div>
                  <h3 className="text-title text-gray-900">Our Mission</h3>
                </div>
                <p className="text-body text-gray-600">{faculty.mission_statement}</p>
              </motion.div>
            )}

            {faculty.vision_statement && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-[#A51C30]" />
                  </div>
                  <h3 className="text-title text-gray-900">Our Vision</h3>
                </div>
                <p className="text-body text-gray-600">{faculty.vision_statement}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      {facultyStats.length > 0 && (
      <section className="py-12 border-y bg-white" style={{ borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {facultyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Departments */}
      {faculty.departments.length > 0 && (
        <section className="py-20 bg-[#f8f9fa]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-headline text-gray-900 mb-4">Departments</h2>
              <p className="text-lead text-gray-600 max-w-2xl mx-auto">
                Academic departments within {faculty.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/departments/${dept.slug}`}
                    className="block bg-white p-6 shadow-sm border border-gray-100 transition-shadow h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
                        <Building className="w-7 h-7 text-[#1E1E1E]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-title text-gray-900 mb-1">{dept.name}</h3>
                        {dept.code && (
                          <span className="text-small text-gray-500">{dept.code}</span>
                        )}
                        {dept.leadership_name && (
                          <p className="text-small text-gray-500 mt-1">
                            Head: {dept.leadership_name}
                          </p>
                        )}
                        <p className="text-body text-gray-600 mt-2 line-clamp-2">
                          {dept.description || `${dept.staff_count} staff members`}
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[#1E1E1E]">
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
      <section className="py-16 bg-[#1E1E1E]">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-headline text-white mb-4">
              Programs at {faculty.name}
            </h2>
            <p className="text-lead text-white/80 mb-6 max-w-2xl mx-auto">
              Discover undergraduate and postgraduate programs offered by our departments.
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
