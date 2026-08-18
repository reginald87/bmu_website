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
import { type Program as ApiProgram } from '../../services/mockData';

interface ApiProgramSource extends ApiProgram {
  degree?: string;
  description?: string;
  career_opportunities?: string;
  icon?: string;
  color?: string;
  category?: string;
  level?: string;
}

interface ProgramStat {
  value: string;
  label: string;
  icon: React.ElementType;
}

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
 { id: 'mbbs', name: 'Medicine and Surgery', degree: 'MBBS', duration: '6 years', description: 'A comprehensive six-year programme that trains students in all aspects of medicine and surgery, producing competent medical doctors ready for residency training.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Medical Doctor', 'Surgeon', 'Public Health Specialist', 'Medical Researcher', 'Hospital Administrator'], icon: Stethoscope, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bnsc-nursing-science', name: 'Nursing Science', degree: 'B.NSc', duration: '5 years', description: 'A five-year professional nursing programme that prepares students for registered nursing practice across all healthcare settings.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Registered Nurse', 'Nurse Practitioner', 'Nurse Educator', 'Public Health Nurse', 'Healthcare Administrator'], icon: Heart, color: '#A51C30', category: 'undergraduate' },
 { id: 'bmls-medical-laboratory-science', name: 'Medical Laboratory Science', degree: 'BMLS', duration: '5 years', description: 'A five-year programme training students in diagnostic laboratory science including clinical chemistry, haematology and microbiology.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Medical Laboratory Scientist', 'Research Scientist', 'Laboratory Manager', 'Infection Control Specialist'], icon: Microscope, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-radiography-and-radiation-science', name: 'Radiography and Radiation Science', degree: 'BSc', duration: '4 years', description: 'A four-year programme in medical imaging and radiation science, covering X-ray, ultrasound, CT and MRI for diagnosis and therapy.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Radiographer', 'Radiation Therapist', 'Imaging Specialist', 'Healthcare Administrator'], icon: Scan, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-physiotherapy', name: 'Physiotherapy', degree: 'BSc', duration: '5 years', description: 'A five-year programme training physiotherapists to help patients recover function and mobility after injury or illness.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Physiotherapist', 'Sports Therapist', 'Rehabilitation Specialist', 'Clinical Educator'], icon: Activity, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-optometry', name: 'Optometry', degree: 'BSc', duration: '6 years', description: 'A six-year programme training optometrists in the examination, diagnosis and management of eye and vision disorders.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Optometrist', 'Vision Researcher', 'Optical Centre Manager', 'Public Eye Health Specialist'], icon: Scan, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-public-health', name: 'Public Health', degree: 'BSc', duration: '4 years', description: 'A four-year programme in population health, disease prevention, health promotion and health policy.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Public Health Officer', 'Health Educator', 'Epidemiologist', 'Policy Analyst', 'NGO Program Manager'], icon: Globe, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-community-health-science', name: 'Community Health Science', degree: 'BSc', duration: '5 years', description: 'A five-year programme training community health practitioners for primary healthcare delivery at community level.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Community Health Practitioner', 'Primary Healthcare Coordinator', 'Health Extension Specialist'], icon: Globe, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-dental-technology', name: 'Dental Technology', degree: 'BSc', duration: '4 years', description: 'A four-year programme training dental technologists in the design, fabrication and repair of dental prostheses and appliances.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Dental Technologist', 'Dental Laboratory Manager', 'Prosthodontic Technician'], icon: Bone, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-health-care-administration-and-hospital-management', name: 'Health Care Administration and Hospital Management', degree: 'BSc', duration: '4 years', description: 'A four-year programme preparing health managers and administrators to lead hospitals and health services efficiently.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Hospital Administrator', 'Health Services Manager', 'Health Policy Analyst', 'Medical Records Director'], icon: Heart, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-health-information-management', name: 'Health Information Management', degree: 'BSc', duration: '5 years', description: 'A five-year programme in the management of health data, medical records and health information systems.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Health Information Manager', 'Medical Records Officer', 'Health Informatics Specialist', 'Data Analyst'], icon: Globe, color: '#A51C30', category: 'undergraduate' },
 { id: 'bsc-human-nutrition-and-dietetics', name: 'Human Nutrition and Dietetics', degree: 'BSc', duration: '4 years', description: 'A four-year programme training nutritionists and dietitians in the science of nutrition and therapeutic dietetics.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Dietitian', 'Nutritionist', 'Public Health Nutritionist', 'Food Service Manager'], icon: Heart, color: '#A51C30', category: 'undergraduate' },
 { id: 'doctor-of-pharmacy', name: 'Pharmacy', degree: 'Pharm.D', duration: '6 years', description: 'A six-year Doctor of Pharmacy programme covering pharmaceutical sciences, clinical pharmacy and professional pharmacy practice.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Pharmacist', 'Clinical Pharmacist', 'Pharmaceutical Researcher', 'Drug Regulatory Affairs Officer'], icon: Award, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bds-dentistry', name: 'Dentistry', degree: 'BDS', duration: '6 years', description: 'A six-year Bachelor of Dental Surgery programme training dental surgeons in oral health care and maxillofacial surgery.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Dental Surgeon', 'Oral Health Specialist', 'Dental Public Health Officer', 'Dental Researcher'], icon: Stethoscope, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-human-anatomy', name: 'Human Anatomy', degree: 'BSc', duration: '4 years', description: 'A four-year programme focused on the structure of the human body, providing foundations for medical and health sciences careers.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Anatomist', 'Medical Illustrator', 'Forensic Scientist', 'Research Assistant', 'Lecturer'], icon: Bone, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-human-physiology', name: 'Human Physiology', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the study of body functions and regulatory mechanisms for research and academic careers.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Physiologist', 'Research Scientist', 'Lecturer', 'Pharmaceutical Researcher'], icon: Brain, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-biochemistry', name: 'Biochemistry', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the chemistry of life, covering metabolic processes, molecular biology and clinical biochemistry.', requirements: ["Five O'level credits in English Language, Mathematics, Biology, Chemistry and Physics", 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Biochemist', 'Research Scientist', 'Laboratory Analyst', 'Pharmaceutical Researcher', 'Quality Control Officer'], icon: Microscope, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-biology', name: 'Biology', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the biological sciences covering the structure, function and diversity of living organisms.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant science subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Biologist', 'Research Scientist', 'Environmental Officer', 'Science Educator', 'Lab Technician'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-chemistry', name: 'Chemistry', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the composition, structure and properties of matter and the reactions that transform it.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant science subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Chemist', 'Analytical Chemist', 'Quality Control Analyst', 'Industrial Chemist', 'Science Educator'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-computer-science', name: 'Computer Science', degree: 'BSc', duration: '4 years', description: 'A four-year programme in computing, covering algorithms, programming, software development and information systems.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Software Developer', 'Systems Analyst', 'IT Consultant', 'Data Scientist', 'Network Administrator'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-mathematics', name: 'Mathematics', degree: 'BSc', duration: '4 years', description: 'A four-year programme in pure and applied mathematics, developing strong analytical and problem-solving skills.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Mathematician', 'Statistician', 'Actuary', 'Data Analyst', 'Mathematics Educator'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-microbiology', name: 'Microbiology', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the study of microorganisms and their roles in health, disease, industry and the environment.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant science subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Microbiologist', 'Laboratory Scientist', 'Quality Control Analyst', 'Food Safety Officer', 'Research Scientist'], icon: Microscope, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-physics-with-electronics', name: 'Physics with Electronics', degree: 'BSc', duration: '4 years', description: 'A four-year programme in physics with emphasis on electronics, instrumentation and applied technology.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant science subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Physicist', 'Electronics Engineer', 'Instrumentation Specialist', 'Research Scientist', 'ICT Officer'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
 { id: 'bsc-statistics', name: 'Statistics', degree: 'BSc', duration: '4 years', description: 'A four-year programme in the collection, analysis and interpretation of data for informed decision-making.', requirements: ['Five O\'level credits in English Language, Mathematics and three other relevant subjects', 'UTME with appropriate subject combination', 'Post-UTME screening'], careerPaths: ['Statistician', 'Data Analyst', 'Biostatistician', 'Survey Methodologist', 'Actuarial Analyst'], icon: BookOpen, color: '#1E1E1E', category: 'undergraduate' },
];

const transformProgram = (src: ApiProgramSource): Program => ({
 id: src.slug,
 name: src.title,
 degree: src.degree || '',
 duration: src.duration,
 description: src.description || '',
 requirements: (src.requirements || '').split('.').filter(Boolean).map((r: string) => r.trim()),
 careerPaths: (src.career_opportunities || '').split(',').filter(Boolean).map((c: string) => c.trim()),
 icon: iconMap[src.icon || ''] || Stethoscope,
 color: src.color || '#1E1E1E',
 category: (src.category === 'postgraduate' || src.level === 'masters' || src.level === 'phd') ? 'postgraduate' : 'undergraduate',
});

const fallbackStats = [
 { value: '24', label: 'Degree Programs', icon: BookOpen },
 { value: '7', label: 'Academic Units', icon: GraduationCap },
 { value: '25', label: 'Departments', icon: Award },
 { value: '95%', label: 'Employment Rate', icon: ArrowRight }
];

export const Programs = () => {
 const { data: apiPrograms, isLoading } = usePrograms();
 const { data: sections } = usePageSections('programs');
  const stats = (sections?.find(s => s.section_key === 'stats')?.data as ProgramStat[] || fallbackStats);

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

