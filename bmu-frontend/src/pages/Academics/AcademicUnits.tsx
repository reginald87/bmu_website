import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  School,
  LayoutGrid,
  Building2,
  GraduationCap,
  Users,
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface DepartmentData {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  faculty_id: number | null;
  faculty_name: string | null;
  faculty_slug: string | null;
  college_id: number | null;
  college_name: string | null;
  college_slug: string | null;
  leadership_name: string;
  staff_count: number;
  student_count: number;
  is_standalone: boolean;
}

interface GroupedFaculty {
  id: number | string;
  name: string;
  slug: string | null;
  college_name: string | null;
  college_slug: string | null;
  color: string;
  departments: DepartmentData[];
}

const standaloneColor = '#1E1E1E';

const fallbackGroups: GroupedFaculty[] = [
  {
    id: 1, name: 'Basic Medical Sciences', slug: 'basic-medical-sciences',
    college_name: 'College of Medicine', college_slug: 'medicine', color: '#1E1E1E',
    departments: [
      { id: 1, name: 'Anatomy', slug: 'anatomy', code: 'ANT', description: 'Study of human body structure.', faculty_id: 1, faculty_name: 'Basic Medical Sciences', faculty_slug: 'basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Prof. Godwin Ikorite', staff_count: 10, student_count: 0, is_standalone: false },
      { id: 2, name: 'Physiology', slug: 'physiology', code: 'PHY', description: 'Study of body functions.', faculty_id: 1, faculty_name: 'Basic Medical Sciences', faculty_slug: 'basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Dr. Blessing Amadi', staff_count: 8, student_count: 0, is_standalone: false },
      { id: 3, name: 'Biochemistry', slug: 'biochemistry', code: 'BCH', description: 'Study of chemical processes.', faculty_id: 1, faculty_name: 'Basic Medical Sciences', faculty_slug: 'basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Dr. Michael Ogu', staff_count: 7, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 2, name: 'Clinical Sciences', slug: 'clinical-sciences',
    college_name: 'College of Medicine', college_slug: 'medicine', color: '#1E1E1E',
    departments: [
      { id: 4, name: 'Internal Medicine', slug: 'internal-medicine', code: 'IMD', description: 'Adult medical care.', faculty_id: 2, faculty_name: 'Clinical Sciences', faculty_slug: 'clinical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Prof. Jane Owei', staff_count: 15, student_count: 0, is_standalone: false },
      { id: 5, name: 'Paediatrics', slug: 'paediatrics', code: 'PED', description: 'Child healthcare.', faculty_id: 2, faculty_name: 'Clinical Sciences', faculty_slug: 'clinical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Dr. Adaeze Nwosu', staff_count: 10, student_count: 0, is_standalone: false },
      { id: 6, name: 'Obstetrics & Gynaecology', slug: 'obstetrics-gynaecology', code: 'OBG', description: "Women's health and childbirth.", faculty_id: 2, faculty_name: 'Clinical Sciences', faculty_slug: 'clinical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'medicine', leadership_name: 'Dr. Faith George', staff_count: 12, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 3, name: 'Medical Laboratory Science', slug: 'medical-lab-science',
    college_name: 'School of Allied Health Sciences', college_slug: 'allied-health', color: '#A51C30',
    departments: [
      { id: 7, name: 'Haematology', slug: 'haematology', code: 'HAE', description: 'Study of blood disorders.', faculty_id: 3, faculty_name: 'Medical Laboratory Science', faculty_slug: 'medical-lab-science', college_id: 2, college_name: 'School of Allied Health Sciences', college_slug: 'allied-health', leadership_name: 'Dr. Richard Peters', staff_count: 5, student_count: 0, is_standalone: false },
      { id: 8, name: 'Medical Microbiology', slug: 'medical-microbiology', code: 'MMB', description: 'Study of disease-causing microorganisms.', faculty_id: 3, faculty_name: 'Medical Laboratory Science', faculty_slug: 'medical-lab-science', college_id: 2, college_name: 'School of Allied Health Sciences', college_slug: 'allied-health', leadership_name: 'Dr. Sarah Wodi', staff_count: 6, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 4, name: 'Nursing', slug: 'nursing-dept',
    college_name: 'School of Nursing', college_slug: 'nursing', color: '#1E1E1E',
    departments: [
      { id: 9, name: 'General Nursing', slug: 'general-nursing', code: 'GNR', description: 'Comprehensive nursing care.', faculty_id: 4, faculty_name: 'Nursing', faculty_slug: 'nursing-dept', college_id: 3, college_name: 'School of Nursing', college_slug: 'nursing', leadership_name: 'Prof. Helen Douglas', staff_count: 10, student_count: 0, is_standalone: false },
      { id: 10, name: 'Psychiatric Nursing', slug: 'psychiatric-nursing', code: 'PSN', description: 'Mental health nursing.', faculty_id: 4, faculty_name: 'Nursing', faculty_slug: 'nursing-dept', college_id: 3, college_name: 'School of Nursing', college_slug: 'nursing', leadership_name: 'Dr. Faith George', staff_count: 4, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 5, name: 'Midwifery', slug: 'midwifery',
    college_name: 'School of Nursing', college_slug: 'nursing', color: '#1E1E1E',
    departments: [
      { id: 11, name: 'General Midwifery', slug: 'general-midwifery', code: 'GMD', description: 'Maternal and newborn care.', faculty_id: 5, faculty_name: 'Midwifery', faculty_slug: 'midwifery', college_id: 3, college_name: 'School of Nursing', college_slug: 'nursing', leadership_name: 'Dr. Faith George', staff_count: 5, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 7, name: 'Epidemiology', slug: 'epidemiology',
    college_name: 'Institute of Public Health', college_slug: 'public-health', color: '#A51C30',
    departments: [
      { id: 12, name: 'Disease Surveillance', slug: 'disease-surveillance', code: 'DSV', description: 'Monitoring disease patterns.', faculty_id: 7, faculty_name: 'Epidemiology', faculty_slug: 'epidemiology', college_id: 5, college_name: 'Institute of Public Health', college_slug: 'public-health', leadership_name: 'Prof. Chioma Amadi', staff_count: 4, student_count: 0, is_standalone: false },
      { id: 13, name: 'Field Epidemiology', slug: 'field-epidemiology', code: 'FEP', description: 'Outbreak investigation.', faculty_id: 7, faculty_name: 'Epidemiology', faculty_slug: 'epidemiology', college_id: 5, college_name: 'Institute of Public Health', college_slug: 'public-health', leadership_name: 'Dr. Ngozi Eze', staff_count: 3, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 8, name: 'Health Policy', slug: 'health-policy',
    college_name: 'Institute of Public Health', college_slug: 'public-health', color: '#A51C30',
    departments: [
      { id: 17, name: 'Health Administration', slug: 'health-administration', code: 'HAD', description: 'Healthcare management.', faculty_id: 8, faculty_name: 'Health Policy', faculty_slug: 'health-policy', college_id: 5, college_name: 'Institute of Public Health', college_slug: 'public-health', leadership_name: 'Dr. Emmanuel Akpan', staff_count: 3, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 14, name: 'Science', slug: 'science',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 19, name: 'Biological Sciences', slug: 'biological-sciences', code: 'BIO', description: 'Study of living organisms.', faculty_id: 14, faculty_name: 'Science', faculty_slug: 'science', college_id: null, college_name: null, college_slug: null, leadership_name: 'Prof. Samuel Abasi', staff_count: 12, student_count: 0, is_standalone: true },
      { id: 20, name: 'Chemistry', slug: 'chemistry', code: 'CHM', description: 'Study of chemical processes.', faculty_id: 14, faculty_name: 'Science', faculty_slug: 'science', college_id: null, college_name: null, college_slug: null, leadership_name: 'Dr. Ebi Robinson', staff_count: 8, student_count: 0, is_standalone: true },
      { id: 21, name: 'Physics', slug: 'physics', code: 'PHY', description: 'Study of matter and energy.', faculty_id: 14, faculty_name: 'Science', faculty_slug: 'science', college_id: null, college_name: null, college_slug: null, leadership_name: 'Dr. Godwin Ikorite', staff_count: 6, student_count: 0, is_standalone: true },
      { id: 22, name: 'Mathematics', slug: 'mathematics', code: 'MTH', description: 'Study of mathematical theory.', faculty_id: 14, faculty_name: 'Science', faculty_slug: 'science', college_id: null, college_name: null, college_slug: null, leadership_name: 'Dr. Ngozi Eze', staff_count: 5, student_count: 0, is_standalone: true },
    ]
  },
];

export const AcademicUnits = () => {
  const { data: departments = [], isLoading, error } = useQuery<DepartmentData[]>({
    queryKey: ['academicUnits'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/public/departments');
        const result = response.data;
        const items: DepartmentData[] = result?.items || result || [];
        if (Array.isArray(items) && items.length > 0) return items;
        return fallbackGroups.flatMap(g => g.departments);
      } catch {
        return fallbackGroups.flatMap(g => g.departments);
      }
    },
  });

  const groups = groupDepartments(departments);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1E1E1E] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'An error occurred'}</p>
          <Link to="/academics" className="text-[#1E1E1E] font-medium hover:underline">
            Back to Academics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Departments | Bayelsa Medical University</title>
        <meta name="description" content="Explore all departments organized by faculties and colleges." />
      </Helmet>

      <section className="relative pt-[140px] pb-20 overflow-hidden bg-[#1E1E1E]">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/academics" className="hover:text-white transition">Academics</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Departments</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-[#A51C30]">Departments</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Discover all academic departments across our colleges and standalone faculties, each offering specialized programs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No departments available yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {groups.map((group, groupIndex) => (
                <motion.div
                  key={`${group.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.college_slug ? <School className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                      <p className="text-sm text-gray-500">
                        {group.college_name ? (
                          <Link to={`/colleges/${group.college_slug}`} className="hover:underline">
                            {group.college_name}
                          </Link>
                        ) : (
                          'Standalone Faculty'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.departments.map((dept, index) => (
                      <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow group"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div
                              className="w-12 h-12 flex items-center justify-center"
                              style={{ backgroundColor: `${group.color}15` }}
                            >
                              <LayoutGrid className="w-6 h-6" style={{ color: group.color }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                              {dept.code && (
                                <span className="text-xs text-gray-500">{dept.code}</span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {dept.description || `Department under ${group.name}.`}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {dept.staff_count || 0} Staff
                            </span>
                            <Link
                              to={`/departments/${dept.slug}`}
                              className="inline-flex items-center gap-1 text-sm text-[#1E1E1E] font-medium hover:gap-2 transition-all"
                            >
                              View
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: new Set(groups.filter(g => g.college_slug).map(g => g.college_slug)).size.toString(), label: 'Colleges', icon: Building2 },
              { value: groups.length.toString(), label: 'Faculties', icon: GraduationCap },
              { value: departments.length.toString(), label: 'Departments', icon: LayoutGrid },
              { value: departments.reduce((acc, d) => acc + (d.staff_count || 0), 0).toString() + '+', label: 'Academic Staff', icon: Users }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
                <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

function groupDepartments(departments: DepartmentData[]): GroupedFaculty[] {
  const map = new Map<string, GroupedFaculty>();

  for (const dept of departments) {
    const key = dept.faculty_id ? `faculty-${dept.faculty_id}` : `direct-${dept.id}`;
    if (!map.has(key)) {
      map.set(key, {
        id: dept.faculty_id || `direct-${dept.id}`,
        name: dept.faculty_name || dept.college_name || 'Other',
        slug: dept.faculty_slug,
        college_name: dept.college_name,
        college_slug: dept.college_slug,
        color: dept.is_standalone ? standaloneColor : (dept.college_id ? '#1E1E1E' : '#1E1E1E'),
        departments: [],
      });
    }
    map.get(key)!.departments.push(dept);
  }

  return Array.from(map.values());
}

export default AcademicUnits;