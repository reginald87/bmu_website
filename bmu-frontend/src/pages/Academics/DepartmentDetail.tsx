import { useQuery } from '@tanstack/react-query';
import { apiClient, ALLOW_API_MOCKS } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
 Users, 
 ArrowRight, 
 GraduationCap,
 ChevronRight,
 Microscope
} from 'lucide-react';

interface StaffMember {
 id: number;
 full_name: string;
 email: string;
 profile_image: string | null;
 position: string;
 title: string;
 specialization: string | null;
 publications_count: number;
}

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
  leadership_title: string;
  hod_photo: string | null;
  staff_count: number;
  student_count: number;
  program_count: number;
  publications_count: number;
  staff: StaffMember[];
}

const fallbackDepartments = [
  {
    id: 1, name: 'Anatomical Pathology', slug: 'anatomical-pathology', code: 'ANP',
    description: 'Study of the structural and functional changes caused by disease, forming the basis of clinical diagnosis.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Basic Clinical Sciences', faculty_slug: 'faculty-of-basic-clinical-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 2, name: 'Biochemistry', slug: 'biochemistry', code: 'BCH',
    description: 'The study of the chemical processes within and relating to living organisms, essential to understanding health and disease.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine'
  },
  {
    id: 3, name: 'Human Anatomy', slug: 'human-anatomy', code: 'ANA',
    description: 'The study of the structure of the human body, providing the foundation for clinical practice.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine'
  },
  {
    id: 4, name: 'Human Physiology', slug: 'human-physiology', code: 'PSL',
    description: 'The study of how the human body functions, from cells to organ systems.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Basic Medical Sciences', faculty_slug: 'faculty-of-basic-medical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine'
  },
  {
    id: 5, name: 'Medicine & Surgery', slug: 'medicine-surgery', code: 'MES',
    description: 'The flagship department training medical doctors through the MBBS programme with comprehensive clinical education.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Clinical Sciences', faculty_slug: 'faculty-of-clinical-sciences',
    college_name: 'College of Medicine', college_slug: 'college-of-medicine'
  },
  {
    id: 6, name: 'Dental Surgery', slug: 'dental-surgery', code: 'DTS',
    description: 'Training dental surgeons in the prevention, diagnosis and treatment of oral diseases.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Dentistry', faculty_slug: 'faculty-of-dentistry',
    college_name: null, college_slug: null
  },
  {
    id: 7, name: 'Community Health', slug: 'community-health', code: 'CMH',
    description: 'Training community health professionals to deliver primary healthcare and promote public health at community level.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 8, name: 'Dental Technology', slug: 'dental-technology', code: 'DTL',
    description: 'Training dental technologists in the design and fabrication of dental prostheses and appliances.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 9, name: 'Health Care Administration and Hospital Management', slug: 'health-care-administration-and-hospital-management', code: 'HCA',
    description: 'Preparing health administrators to manage hospitals and health services efficiently and effectively.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 10, name: 'Health Information Management', slug: 'health-information-management', code: 'HIM',
    description: 'Training professionals in the management of health information, medical records and health informatics.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 11, name: 'Human Nutrition and Dietetics', slug: 'human-nutrition-and-dietetics', code: 'HND',
    description: 'Training nutritionists and dietitians to promote health through diet and manage nutrition-related diseases.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 12, name: 'Medical Laboratory Science', slug: 'medical-laboratory-science', code: 'MLS',
    description: 'Training medical laboratory scientists in diagnostic testing for disease prevention, diagnosis and treatment.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 13, name: 'Nursing Science', slug: 'nursing-science', code: 'NUR',
    description: 'Training professional nurses in evidence-based, compassionate patient care across all healthcare settings.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 14, name: 'Optometry', slug: 'optometry', code: 'OPT',
    description: 'Training optometrists in the examination, diagnosis and management of visual and eye health disorders.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 15, name: 'Physiotherapy', slug: 'physiotherapy', code: 'PHT',
    description: 'Training physiotherapists to restore function and mobility through physical therapy and rehabilitation.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 16, name: 'Public Health', slug: 'public-health', code: 'PUB',
    description: 'Training public health professionals in disease prevention, health promotion and population health.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 17, name: 'Radiography and Radiation Science', slug: 'radiography-and-radiation-science', code: 'RAD',
    description: 'Training radiographers in medical imaging and radiation sciences for diagnostic and therapeutic purposes.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Health Sciences', faculty_slug: 'faculty-of-health-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 18, name: 'Pharmacy', slug: 'pharmacy', code: 'PHA',
    description: 'Training pharmacists in drug formulation, dispensing and clinical pharmacy through the Pharm.D programme.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Pharmaceutical Sciences', faculty_slug: 'faculty-of-pharmaceutical-sciences',
    college_name: null, college_slug: null
  },
  {
    id: 19, name: 'Biology', slug: 'biology', code: 'BIO',
    description: 'The study of living organisms, their structure, function, growth and evolution.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 20, name: 'Chemistry', slug: 'chemistry', code: 'CHM',
    description: 'The study of the composition, structure and properties of matter and the changes it undergoes.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 21, name: 'Computer Science', slug: 'computer-science', code: 'CSE',
    description: 'The study of computation, algorithms, programming and information systems.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 22, name: 'Mathematics', slug: 'mathematics', code: 'MTH',
    description: 'The study of quantity, structure, space and change through abstract reasoning.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 23, name: 'Microbiology', slug: 'microbiology', code: 'MCB',
    description: 'The study of microorganisms and their applications in health, industry and the environment.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 24, name: 'Physics with Electronics', slug: 'physics-with-electronics', code: 'PHY',
    description: 'The study of matter, energy and their interactions, with emphasis on electronics and instrumentation.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
  {
    id: 25, name: 'Statistics', slug: 'statistics', code: 'STA',
    description: 'The science of collecting, analysing and interpreting data to inform decision-making.',
    staff_count: 5, student_count: 0, program_count: 0, publications_count: 0, hod_name: '',
    faculty_name: 'Faculty of Science', faculty_slug: 'faculty-of-science',
    college_name: null, college_slug: null
  },
];

const mapFallbackToDepartment = (fb: typeof fallbackDepartments[number]): DepartmentData => ({
  id: fb.id,
  name: fb.name,
  slug: fb.slug,
  code: fb.code,
  description: fb.description,
  faculty_id: null,
  faculty_name: fb.faculty_name,
  faculty_slug: fb.faculty_slug,
  college_id: fb.college_slug ? fb.id : null,
  college_name: fb.college_name,
  college_slug: fb.college_slug,
  leadership_name: fb.hod_name,
  leadership_title: 'Head of Department',
  hod_photo: null,
  staff_count: fb.staff_count,
  student_count: fb.student_count ?? 0,
  program_count: fb.program_count ?? 0,
  publications_count: fb.publications_count ?? 0,
  staff: [],
});

export const DepartmentDetail = () => {
 const { slug } = useParams<{ slug: string }>();

  const { data: department, isLoading, error } = useQuery<DepartmentData | null>({
   queryKey: ['department', slug],
   queryFn: async () => {
     if (!slug) return null;

     try {
       const response = await apiClient.get(`/public/departments/${slug}`);
       if (response.data && response.data.name) {
         return {
           id: response.data.id,
           name: response.data.name,
           slug: response.data.slug,
           code: response.data.code ?? null,
           description: response.data.description || '',
          faculty_id: response.data.faculty_id ?? null,
            faculty_name: response.data.faculty_name || null,
            faculty_slug: response.data.faculty_slug || null,
            college_id: response.data.college_id,
            college_name: response.data.college_name,
            college_slug: response.data.college_slug || null,
           leadership_name: response.data.leadership_name || '',
           leadership_title: response.data.leadership_title || '',
hod_photo: response.data.hod_photo ?? null,
            staff_count: response.data.staff_count || 0,
            student_count: response.data.student_count || 0,
            program_count: response.data.program_count || 0,
            publications_count: response.data.publications_count || 0,
            staff: response.data.staff || [],
         };
       }
     } catch {
       // fall through
     }

     const found = ALLOW_API_MOCKS ? fallbackDepartments.find(d => d.slug === slug) : undefined;
     return found ? mapFallbackToDepartment(found) : null;
   },
   enabled: !!slug,
  });

 if (isLoading) {
  return (
  <div className="min-h-screen flex items-center justify-center">
  <div className="animate-spin h-12 w-12 border-b-2 border-ink-900"></div>
  </div>
  );
 }

 if (error || !department) {
  return (
  <div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
  <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
  <p className="text-gray-600 mb-4">The department you're looking for doesn't exist.</p>
  <Link to="/academics" className="text-ink-900 font-medium hover:underline">
  Back to Academics
  </Link>
  </div>
  </div>
  );
 }

  const departmentStats = [
   department.staff_count ? { value: department.staff_count, label: 'Staff Members' } : null,
   department.program_count ? { value: department.program_count, label: 'Programs' } : null,
   department.student_count ? { value: department.student_count, label: 'Students' } : null,
   department.publications_count ? { value: department.publications_count, label: 'Publications' } : null,
  ].filter(Boolean) as { value: number; label: string }[];

 return (
  <>
  <Helmet>
 <title>{department.name} | Bayelsa Medical University</title>
 <meta name="description" content={department.description} />
 </Helmet>

 {/* Hero Section */}
 <section className="relative pt-[180px] pb-20 overflow-hidden bg-ink-900">
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div 
 initial={{ opacity: 0, y: 30 }} 
 animate={{ opacity: 1, y: 0 }} 
 transition={{ duration: 0.6 }}
 >
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <ChevronRight className="w-4 h-4" />
 <Link to="/academics" className="hover:text-white transition">Academics</Link>
 <ChevronRight className="w-4 h-4" />
  {department.faculty_slug ? (
  <>
  <Link to={department.college_slug ? `/academics/faculties/${department.faculty_slug}?college=${department.college_slug}` : `/academics/faculties/${department.faculty_slug}`} className="hover:text-white transition">
  {department.faculty_name}
  </Link>
  <ChevronRight className="w-4 h-4" />
  </>
  ) : (
  <>
  <Link to={`/academics/colleges/${department.college_slug}`} className="hover:text-white transition">
  {department.college_name}
  </Link>
  <ChevronRight className="w-4 h-4" />
  </>
  )}
 <span className="text-white font-medium">{department.name}</span>
 </div>
 
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 <div className="lg:col-span-2">
 {department.code && (
 <span className="inline-block px-3 py-1 bg-primary-600 text-ink-900 text-sm font-semibold mb-4">
 {department.code}
 </span>
 )}
 <h1 className="text-display text-white mb-6">
 {department.name}
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 {department.description}
 </p>
 </div>

  {/* HOD Card */}
  {department.leadership_name && (
  <div className="bg-white/10 backdrop-blur-sm p-6 text-center">
  {department.hod_photo ? (
    <img loading="lazy" decoding="async" src={department.hod_photo} alt={department.leadership_name} className="w-28 h-28 object-cover mx-auto" />
  ) : (
  <div className="w-28 h-28 bg-white/20 flex items-center justify-center mx-auto">
  <Users className="w-12 h-12 text-white" />
  </div>
  )}
  <p className="text-white/60 text-sm mt-4">{department.leadership_title}</p>
  <p className="text-white font-bold text-lg mt-1">{department.leadership_name}</p>
  </div>
  )}
 </div>
 </motion.div>
 </div>
 </section>

  {/* Stats */}
  {departmentStats.length > 0 && (
  <section className="py-12 border-y bg-white" style={{ borderColor: '#e5e4e7' }}>
  <div className="container-custom">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {departmentStats.map((stat, index) => (
  <motion.div
  key={index}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="text-center"
  >
  <div className="text-stat text-ink-900 mb-1">{stat.value}</div>
  <p className="text-gray-600 text-body">{stat.label}</p>
  </motion.div>
  ))}
  </div>
  </div>
  </section>
  )}

 {/* Staff Section */}
 {department.staff.length > 0 && (
 <section className="py-20 bg-[#f8f9fa]">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Our Staff</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Meet the dedicated faculty and staff of {department.name}
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {department.staff.map((member, index) => (
 <motion.div
 key={member.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex items-start gap-4">
 <div className="w-16 h-16 bg-ink-900/10 flex items-center justify-center flex-shrink-0">
 {member.profile_image ? (
 <img loading="lazy" decoding="async" 
 src={member.profile_image} 
 alt={member.full_name}
 className="w-full h-full object-cover"
 />
 ) : (
 <Users className="w-8 h-8 text-ink-900" />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-title text-gray-900 mb-1 truncate">{member.full_name}</h3>
 <p className="text-small text-ink-900 font-medium">{member.title} {member.position}</p>
 {member.specialization && (
 <p className="text-small text-gray-500 mt-1">{member.specialization}</p>
 )}
 <div className="flex items-center gap-4 mt-3">
 {member.publications_count > 0 && (
 <span className="text-small text-gray-500">
 {member.publications_count} publications
 </span>
 )}
 <Link 
 to={`/about/leadership/${member.id}`}
 className="text-small text-ink-900 font-medium hover:underline"
 >
 View Profile
 </Link>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* Research & Programs */}
 <section className="py-20 bg-white">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-ink-900/5 p-8"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="w-12 h-12 bg-ink-900 flex items-center justify-center">
 <Microscope className="w-6 h-6 text-white" />
 </div>
 <h3 className="text-title text-gray-900">Research Focus</h3>
 </div>
 <p className="text-body text-gray-600 mb-4">
 Our department is actively engaged in cutting-edge research across multiple domains, 
 contributing to advancements in medical science and healthcare delivery.
 </p>
 <Link 
 to="/research"
 className="inline-flex items-center gap-2 text-ink-900 font-medium hover:gap-3 transition-all"
 >
 View Research <ArrowRight className="w-4 h-4" />
 </Link>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="bg-primary-600/5 p-8"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="w-12 h-12 bg-primary-600 flex items-center justify-center">
 <GraduationCap className="w-6 h-6 text-white" />
 </div>
 <h3 className="text-title text-gray-900">Academic Programs</h3>
 </div>
 <p className="text-body text-gray-600 mb-4">
 We offer comprehensive undergraduate and postgraduate programs designed to 
 prepare the next generation of healthcare professionals.
 </p>
 <Link 
 to="/academics/programs"
 className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
 >
 Browse Programs <ArrowRight className="w-4 h-4" />
 </Link>
 </motion.div>
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16 bg-ink-900">
 <div className="container-custom">
 <div className="text-center">
 <h2 className="text-headline text-white mb-4">
 Join {department.name}
 </h2>
 <p className="text-lead text-white/80 mb-6 max-w-2xl mx-auto">
 Explore our programs and become part of a community dedicated to excellence in healthcare education.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link 
 to="/academics/programs"
 className="px-8 py-4 bg-primary-600 text-ink-900 font-bold hover:bg-white transition"
 >
 Browse Programs
 </Link>
 <Link 
 to="/apply"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-ink-900 transition"
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
