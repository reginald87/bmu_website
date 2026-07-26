import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
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
  college_id: number;
  college_name: string;
  college_slug: string | null;
  leadership_name: string;
  leadership_title: string;
  hod_photo: string | null;
  staff_count: number;
  staff: StaffMember[];
}

const fallbackDepartments = [
  {
    id: 1, name: 'Anatomy', slug: 'anatomy', code: 'ANT',
    description: 'Study of human body structure.',
    staff_count: 10, hod_name: 'Prof. Godwin Ikorite',
    faculty_name: 'Basic Medical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 2, name: 'Physiology', slug: 'physiology', code: 'PHY',
    description: 'Study of body functions.',
    staff_count: 8, hod_name: 'Dr. Blessing Amadi',
    faculty_name: 'Basic Medical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 3, name: 'Biochemistry', slug: 'biochemistry', code: 'BCH',
    description: 'Study of chemical processes in living organisms.',
    staff_count: 7, hod_name: 'Dr. Michael Ogu',
    faculty_name: 'Basic Medical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 4, name: 'Internal Medicine', slug: 'internal-medicine', code: 'IMD',
    description: 'Adult medical care.',
    staff_count: 15, hod_name: 'Prof. Jane Owei',
    faculty_name: 'Clinical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 5, name: 'Paediatrics', slug: 'paediatrics', code: 'PED',
    description: 'Child healthcare.',
    staff_count: 10, hod_name: 'Dr. Adaeze Nwosu',
    faculty_name: 'Clinical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 6, name: 'Obstetrics & Gynaecology', slug: 'obstetrics-gynaecology', code: 'OBG',
    description: 'Women\'s health and childbirth.',
    staff_count: 12, hod_name: 'Dr. Faith George',
    faculty_name: 'Clinical Sciences', college_name: 'College of Medicine'
  },
  {
    id: 7, name: 'Haematology', slug: 'haematology', code: 'HAE',
    description: 'Study of blood disorders.',
    staff_count: 5, hod_name: 'Dr. Richard Peters',
    faculty_name: 'Medical Laboratory Science', college_name: 'School of Allied Health Sciences'
  },
  {
    id: 8, name: 'Medical Microbiology', slug: 'medical-microbiology', code: 'MMB',
    description: 'Study of disease-causing microorganisms.',
    staff_count: 6, hod_name: 'Dr. Sarah Wodi',
    faculty_name: 'Medical Laboratory Science', college_name: 'School of Allied Health Sciences'
  },
  {
    id: 9, name: 'General Nursing', slug: 'general-nursing', code: 'GNR',
    description: 'Comprehensive nursing care.',
    staff_count: 10, hod_name: 'Prof. Helen Douglas',
    faculty_name: 'Nursing', college_name: 'School of Nursing'
  },
  {
    id: 10, name: 'General Midwifery', slug: 'general-midwifery', code: 'GMD',
    description: 'Maternal and newborn care.',
    staff_count: 5, hod_name: 'Dr. Faith George',
    faculty_name: 'Midwifery', college_name: 'School of Nursing'
  },
  {
    id: 11, name: 'Disease Surveillance', slug: 'disease-surveillance', code: 'DSV',
    description: 'Monitoring disease patterns.',
    staff_count: 4, hod_name: 'Prof. Chioma Amadi',
    faculty_name: 'Epidemiology', college_name: 'Institute of Public Health'
  },
  {
    id: 12, name: 'Health Statistics', slug: 'health-statistics', code: 'HST',
    description: 'Health data analysis.',
    staff_count: 2, hod_name: 'Dr. Ngozi Eze',
    faculty_name: 'Biostatistics', college_name: 'Institute of Public Health'
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
  faculty_slug: null,
  college_id: fb.id,
  college_name: fb.college_name,
  college_slug: null,
  leadership_name: fb.hod_name,
  leadership_title: 'Head of Department',
  hod_photo: null,
  staff_count: fb.staff_count,
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
           staff: response.data.staff || [],
         };
       }
     } catch {
       // fall through
     }

     const found = fallbackDepartments.find(d => d.slug === slug);
     return found ? mapFallbackToDepartment(found) : null;
   },
   enabled: !!slug,
  });

 if (isLoading) {
  return (
  <div className="min-h-screen flex items-center justify-center">
  <div className="animate-spin h-12 w-12 border-b-2 border-[#1E1E1E]"></div>
  </div>
  );
 }

 if (error || !department) {
  return (
  <div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
  <h2 className="text-2xl font-bold text-gray-900 mb-2">Department Not Found</h2>
  <p className="text-gray-600 mb-4">The department you're looking for doesn't exist.</p>
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
 <title>{department.name} - Bayelsa Medical University</title>
 <meta name="description" content={department.description} />
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
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <ChevronRight className="w-4 h-4" />
 <Link to="/academics" className="hover:text-white transition">Academics</Link>
 <ChevronRight className="w-4 h-4" />
  {department.faculty_slug ? (
  <>
  <Link to={`/academics/faculties/${department.faculty_slug}?college=${department.college_slug}`} className="hover:text-white transition">
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
 <span className="inline-block px-3 py-1 bg-[#A51C30] text-[#1E1E1E] text-sm font-semibold mb-4">
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
    <img src={department.hod_photo} alt={department.leadership_name} className="w-28 h-28 object-cover mx-auto" />
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
 <section className="py-12 border-y bg-white" style={{ borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {[
 { value: department.staff_count, label: 'Staff Members' },
 { value: '15+', label: 'Programs' },
 { value: '500+', label: 'Students' },
 { value: '50+', label: 'Publications/Year' },
 ].map((stat, index) => (
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
 <div className="w-16 h-16 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
 {member.profile_image ? (
 <img 
 src={member.profile_image} 
 alt={member.full_name}
 className="w-full h-full object-cover"
 />
 ) : (
 <Users className="w-8 h-8 text-[#1E1E1E]" />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-title text-gray-900 mb-1 truncate">{member.full_name}</h3>
 <p className="text-small text-[#1E1E1E] font-medium">{member.title} {member.position}</p>
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
 to={`/leadership/${member.id}`}
 className="text-small text-[#1E1E1E] font-medium hover:underline"
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
 className="bg-[#1E1E1E]/5 p-8"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="w-12 h-12 bg-[#1E1E1E] flex items-center justify-center">
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
 className="inline-flex items-center gap-2 text-[#1E1E1E] font-medium hover:gap-3 transition-all"
 >
 View Research <ArrowRight className="w-4 h-4" />
 </Link>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="bg-[#A51C30]/5 p-8"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="w-12 h-12 bg-[#A51C30] flex items-center justify-center">
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
 className="inline-flex items-center gap-2 text-[#A51C30] font-medium hover:gap-3 transition-all"
 >
 Browse Programs <ArrowRight className="w-4 h-4" />
 </Link>
 </motion.div>
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16 bg-[#1E1E1E]">
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
