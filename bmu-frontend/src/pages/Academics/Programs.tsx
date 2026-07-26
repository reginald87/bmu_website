import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
 Stethoscope, 
 Heart, 
 Microscope, 
 Scan,
 Brain,
 Activity,
 Globe,
 Bone,
 BookOpen,
 Award,
 Clock,
 GraduationCap,
 ArrowRight,
 Loader2
} from 'lucide-react';
import { usePrograms, usePageSections } from '../../services/apiHooks';

interface Program {
 id: string;
 name: string;
 degree: string;
 duration: string;
 description: string;
 requirements: string[];
 careerPaths: string[];
 icon: React.ElementType;
 color: string;
 category: 'undergraduate' | 'postgraduate' | 'professional';
}

const iconMap: Record<string, React.ElementType> = {
 Stethoscope, Heart, Microscope, Scan, Brain, Activity, Globe, Bone, BookOpen, Award,
};

const fallbackPrograms: Program[] = [
 { id: 'mbbs-medicine-surgery', name: 'Medicine and Surgery', degree: 'MBBS', duration: '6 years', description: 'Comprehensive medical training combining pre-clinical sciences with extensive clinical rotations.', requirements: ['5 O\'Level credits including English, Maths, Biology, Chemistry, Physics', 'UTME score of 200+', 'Post-UTME screening'], careerPaths: ['Medical Doctor', 'Surgeon', 'Medical Researcher', 'Public Health Officer'], icon: Stethoscope, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bnsc-nursing-science', name: 'Nursing Science', degree: 'B.NSc', duration: '5 years', description: 'Professional nursing education with emphasis on clinical competence and patient care.', requirements: ['5 O\'Level credits including English, Maths, Biology, Chemistry, Physics', 'UTME score of 180+', 'Physical and mental fitness'], careerPaths: ['Registered Nurse', 'Nurse Practitioner', 'Nurse Educator', 'Healthcare Administrator'], icon: Heart, color: '#A51C30', category: 'undergraduate' },
 { id: 'bmls-medical-laboratory-science', name: 'Medical Laboratory Science', degree: 'BMLS', duration: '5 years', description: 'Training in diagnostic laboratory procedures, clinical chemistry, hematology, and microbiology.', requirements: ['5 O\'Level credits including English, Maths, Biology, Chemistry, Physics', 'UTME score of 180+', 'Laboratory aptitude test'], careerPaths: ['Medical Lab Scientist', 'Research Scientist', 'Quality Control Analyst', 'Lab Manager'], icon: Microscope, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-radiography', name: 'Radiography', degree: 'BSc', duration: '5 years', description: 'Professional training in medical imaging including X-ray, CT, MRI, and ultrasound.', requirements: ['5 O\'Level credits including English, Maths, Biology, Chemistry, Physics', 'UTME score of 180+', 'Physical fitness assessment'], careerPaths: ['Radiographer', 'MRI Technologist', 'Radiation Therapist', 'Imaging Specialist'], icon: Scan, color: '#A51C30', category: 'undergraduate' },
 { id: 'msc-public-health', name: 'Public Health', degree: 'MSc', duration: '2 years', description: 'Advanced training in public health leadership, epidemiology, and health policy.', requirements: ['First degree in health or related field', 'Minimum Second Class Lower', 'Relevant work experience preferred'], careerPaths: ['Public Health Director', 'Health Policy Advisor', 'Research Coordinator', 'NGO Leader'], icon: Globe, color: '#A51C30', category: 'postgraduate' },
];

const transformProgram = (src: any): Program => ({
 id: src.slug,
 name: src.title,
 degree: src.degree || '',
 duration: src.duration,
 description: src.description || '',
 requirements: (src.requirements || '').split('.').filter(Boolean).map((r: string) => r.trim()),
 careerPaths: (src.career_opportunities || '').split(',').filter(Boolean).map((c: string) => c.trim()),
 icon: iconMap[src.icon] || Stethoscope,
 color: src.color || '#1E1E1E',
 category: (src.category === 'postgraduate' || src.level === 'masters' || src.level === 'phd') ? 'postgraduate' : 'undergraduate',
});

const fallbackStats = [
 { value: '50+', label: 'Degree Programs', icon: BookOpen },
 { value: '6', label: 'Academic Units', icon: GraduationCap },
 { value: '15:1', label: 'Student-Faculty Ratio', icon: Award },
 { value: '95%', label: 'Employment Rate', icon: ArrowRight }
];

export const Programs = () => {
 const { data: apiPrograms, isLoading } = usePrograms();
 const { data: sections } = usePageSections('programs');
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);

 const programs: Program[] = (() => {
  if (apiPrograms && Array.isArray(apiPrograms) && apiPrograms.length > 0) {
   return apiPrograms.map(transformProgram);
  }
  return fallbackPrograms;
 })();

 if (isLoading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-[#1E1E1E] animate-spin" />
   </div>
  );
 }

 return (
 <>
 <Helmet>
 <title>Programs | Bayelsa Medical University</title>
 <meta name="description" content="Explore BMU's academic programs in medicine, nursing, pharmacy, allied health sciences, and public health. Undergraduate and postgraduate options available." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <Link to="/academics" className="hover:text-white transition">Academics</Link>
 <span>/</span>
 <span className="text-white font-medium">Programs</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Academic <span className="text-[#A51C30]">Programs</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Discover world-class healthcare education programs designed to train the next 
 generation of medical professionals and researchers.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {stats.map((stat, index) => (
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

 {/* Programs Grid */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Our Programs</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Undergraduate and postgraduate programs designed for excellence in healthcare education
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {programs.map((program, index) => (
 <motion.div
 key={program.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow"
 >
 <div className="p-8">
 <div className="flex items-start gap-4 mb-6">
 <div 
 className="w-16 h-16 flex items-center justify-center flex-shrink-0"
 style={{ backgroundColor: `${program.color}15` }}
 >
 <program.icon className="w-8 h-8" style={{ color: program.color }} />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span 
 className="px-3 py-1 text-xs font-medium"
 style={{ backgroundColor: `${program.color}15`, color: program.color }}
 >
 {program.category}
 </span>
 <span className="flex items-center gap-1 text-small text-gray-500">
 <Clock className="w-3 h-3" />
 {program.duration}
 </span>
 </div>
 <h3 className="text-title text-gray-900">{program.name}</h3>
 <p className="text-small font-semibold" style={{ color: program.color }}>{program.degree}</p>
 </div>
 </div>

 <p className="text-body text-gray-600 mb-6">{program.description}</p>

 <div className="space-y-4 mb-6">
 <div>
 <h4 className="text-small font-semibold text-gray-900 mb-2">Admission Requirements</h4>
 <ul className="space-y-1">
 {program.requirements.map((req, idx) => (
 <li key={idx} className="text-small text-gray-600 flex items-start gap-2">
 <span className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ backgroundColor: program.color }} />
 {req}
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="text-small font-semibold text-gray-900 mb-2">Career Opportunities</h4>
 <div className="flex flex-wrap gap-2">
 {program.careerPaths.map((career, idx) => (
 <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs">
 {career}
 </span>
 ))}
 </div>
 </div>
 </div>

 <Link 
 to={`/academics/programs/${program.id}`}
 className="inline-flex items-center gap-2 font-medium transition-colors hover:gap-3"
 style={{ color: program.color }}
 >
 View Program Details
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom text-center">
 <h2 className="text-headline text-white mb-4">Ready to Apply?</h2>
 <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
 Take the first step towards a rewarding career in healthcare. 
 Check admission requirements and start your application.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link 
 to="/academics/admissions"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Admission Requirements
 </Link>
 <Link 
 to="/apply"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Apply Now
 </Link>
 </div>
 </div>
 </section>
 </>
 );
};

