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
    id: 1, name: 'Faculty of Basic Medical Sciences', slug: 'faculty-of-basic-medical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine', color: '#1E1E1E',
    departments: [
      { id: 2, name: 'Biochemistry', slug: 'biochemistry', code: 'BCH', description: 'The study of the chemical processes within and relating to living organisms, essential to understanding health and disease.', faculty_id: 1, faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: '', staff_count: 5, student_count: 0, is_standalone: false },
      { id: 3, name: 'Human Anatomy', slug: 'human-anatomy', code: 'ANA', description: 'The study of the structure of the human body, providing the foundation for clinical practice.', faculty_id: 1, faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: '', staff_count: 5, student_count: 0, is_standalone: false },
      { id: 4, name: 'Human Physiology', slug: 'human-physiology', code: 'PSL', description: 'The study of how the human body functions, from cells to organ systems.', faculty_id: 1, faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: '', staff_count: 5, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 2, name: 'Faculty of Basic Clinical Sciences', slug: 'faculty-of-basic-clinical-sciences',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 1, name: 'Anatomical Pathology', slug: 'anatomical-pathology', code: 'ANP', description: 'Study of the structural and functional changes caused by disease, forming the basis of clinical diagnosis.', faculty_id: 2, faculty_name: 'Faculty of Basic Clinical Sciences', faculty_slug: 'faculty-of-basic-clinical-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
    ]
  },
  {
    id: 3, name: 'Faculty of Clinical Sciences', slug: 'faculty-of-clinical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine', color: '#1E1E1E',
    departments: [
      { id: 5, name: 'Medicine & Surgery', slug: 'medicine-surgery', code: 'MES', description: 'The flagship department training medical doctors through the MBBS programme with comprehensive clinical education.', faculty_id: 3, faculty_name: 'Faculty of Clinical Sciences', faculty_slug: 'faculty-of-clinical-sciences', college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: '', staff_count: 5, student_count: 0, is_standalone: false },
    ]
  },
  {
    id: 4, name: 'Faculty of Dentistry', slug: 'faculty-of-dentistry',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 6, name: 'Dental Surgery', slug: 'dental-surgery', code: 'DTS', description: 'Training dental surgeons in the prevention, diagnosis and treatment of oral diseases.', faculty_id: 4, faculty_name: 'Faculty of Dentistry', faculty_slug: 'faculty-of-dentistry', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
    ]
  },
  {
    id: 5, name: 'Faculty of Health Sciences', slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 7, name: 'Community Health', slug: 'community-health', code: 'CMH', description: 'Training community health professionals to deliver primary healthcare and promote public health at community level.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 8, name: 'Dental Technology', slug: 'dental-technology', code: 'DTL', description: 'Training dental technologists in the design and fabrication of dental prostheses and appliances.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 9, name: 'Health Care Administration and Hospital Management', slug: 'health-care-administration-and-hospital-management', code: 'HCA', description: 'Preparing health administrators to manage hospitals and health services efficiently and effectively.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 10, name: 'Health Information Management', slug: 'health-information-management', code: 'HIM', description: 'Training professionals in the management of health information, medical records and health informatics.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 11, name: 'Human Nutrition and Dietetics', slug: 'human-nutrition-and-dietetics', code: 'HND', description: 'Training nutritionists and dietitians to promote health through diet and manage nutrition-related diseases.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 12, name: 'Medical Laboratory Science', slug: 'medical-laboratory-science', code: 'MLS', description: 'Training medical laboratory scientists in diagnostic testing for disease prevention, diagnosis and treatment.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 13, name: 'Nursing Science', slug: 'nursing-science', code: 'NUR', description: 'Training professional nurses in evidence-based, compassionate patient care across all healthcare settings.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 14, name: 'Optometry', slug: 'optometry', code: 'OPT', description: 'Training optometrists in the examination, diagnosis and management of visual and eye health disorders.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 15, name: 'Physiotherapy', slug: 'physiotherapy', code: 'PHT', description: 'Training physiotherapists to restore function and mobility through physical therapy and rehabilitation.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 16, name: 'Public Health', slug: 'public-health', code: 'PUB', description: 'Training public health professionals in disease prevention, health promotion and population health.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 17, name: 'Radiography and Radiation Science', slug: 'radiography-and-radiation-science', code: 'RAD', description: 'Training radiographers in medical imaging and radiation sciences for diagnostic and therapeutic purposes.', faculty_id: 5, faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
    ]
  },
  {
    id: 6, name: 'Faculty of Pharmaceutical Sciences', slug: 'faculty-of-pharmaceutical-sciences',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 18, name: 'Pharmacy', slug: 'pharmacy', code: 'PHA', description: 'Training pharmacists in drug formulation, dispensing and clinical pharmacy through the Pharm.D programme.', faculty_id: 6, faculty_name: 'Faculty of Pharmaceutical Sciences', faculty_slug: 'faculty-of-pharmaceutical-sciences', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
    ]
  },
  {
    id: 7, name: 'Faculty of Science', slug: 'faculty-of-science',
    college_name: null, college_slug: null, color: standaloneColor,
    departments: [
      { id: 19, name: 'Biology', slug: 'biology', code: 'BIO', description: 'The study of living organisms, their structure, function, growth and evolution.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 20, name: 'Chemistry', slug: 'chemistry', code: 'CHM', description: 'The study of the composition, structure and properties of matter and the changes it undergoes.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 21, name: 'Computer Science', slug: 'computer-science', code: 'CSE', description: 'The study of computation, algorithms, programming and information systems.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 22, name: 'Mathematics', slug: 'mathematics', code: 'MTH', description: 'The study of quantity, structure, space and change through abstract reasoning.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 23, name: 'Microbiology', slug: 'microbiology', code: 'MCB', description: 'The study of microorganisms and their applications in health, industry and the environment.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 24, name: 'Physics with Electronics', slug: 'physics-with-electronics', code: 'PHY', description: 'The study of matter, energy and their interactions, with emphasis on electronics and instrumentation.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
      { id: 25, name: 'Statistics', slug: 'statistics', code: 'STA', description: 'The science of collecting, analysing and interpreting data to inform decision-making.', faculty_id: 7, faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science', college_id: null, college_name: null, college_slug: null, leadership_name: '', staff_count: 5, student_count: 0, is_standalone: true },
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