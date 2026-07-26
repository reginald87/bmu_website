import { Helmet } from 'react-helmet-async';
import { useParams, Link, Navigate } from 'react-router-dom';
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
 Clock,
 GraduationCap,
 ArrowRight,
 BookOpen,
 Award,
 CheckCircle,
 Calendar,
 DollarSign,
 FileText,
 Building2,
 MapPin,
 ChevronRight,
 Star,
 Briefcase,
 Loader2
} from 'lucide-react';
import { useProgramBySlug } from '../../services/apiHooks';

interface Program {
 id: string;
 name: string;
 degree: string;
 duration: string;
 description: string;
 longDescription: string;
 requirements: string[];
 careerPaths: string[];
 icon: React.ElementType;
 color: string;
 category: 'undergraduate' | 'postgraduate' | 'professional';
 tuition: string;
 intake: string;
 accreditation: string[];
 curriculum: {
  year: string;
  courses: string[];
 }[];
 facilities: string[];
 highlights: string[];
}

const iconMap: Record<string, React.ElementType> = {
 Stethoscope, Heart, Microscope, Scan, Brain, Activity, Globe, Bone, BookOpen, Award,
};

const transformDetail = (src: any): Program => ({
 id: src.slug,
 name: src.title,
 degree: src.degree || '',
 duration: src.duration,
 description: src.description || '',
 longDescription: src.overview || src.description || '',
 requirements: (src.requirements || '').split('.').filter(Boolean).map((r: string) => r.trim()),
 careerPaths: (src.career_opportunities || '').split(',').filter(Boolean).map((c: string) => c.trim()),
 icon: iconMap[src.icon] || Stethoscope,
 color: src.color || '#1E1E1E',
 category: (src.category === 'postgraduate' || src.level === 'masters' || src.level === 'phd') ? 'postgraduate' : 'undergraduate',
 tuition: src.tuition_per_year_local ? `₦${Number(src.tuition_per_year_local).toLocaleString()} per session` : src.tuition_fee_local ? `₦${Number(src.tuition_fee_local).toLocaleString()}` : 'Contact for fees',
 intake: src.intake || 'September/October',
 accreditation: (src.accreditations || []).map((a: any) => a.body_name + (a.body_acronym ? ` (${a.body_acronym})` : '')),
 curriculum: (src.curriculum_years || []).map((y: any) => ({ year: y.year_label, courses: (y.courses || []).map((c: any) => c.name) })),
 facilities: (src.facilities || []).map((f: any) => f.name),
 highlights: (src.highlights || []).map((h: any) => h.text),
});

const fallbackPrograms: Record<string, Program> = {
 'mbbs-medicine-surgery': {
  id: 'mbbs-medicine-surgery', name: 'Medicine and Surgery', degree: 'MBBS', duration: '6 years',
  description: 'Comprehensive medical training combining pre-clinical sciences with extensive clinical rotations.',
  longDescription: 'The MBBS program at Bayelsa Medical University is designed to produce competent, compassionate, and ethical medical professionals.',
  requirements: ["5 O'Level credits including English, Maths, Biology, Chemistry, Physics", 'UTME score of 200+', 'Post-UTME screening'],
  careerPaths: ['Medical Doctor', 'Surgeon', 'Medical Researcher', 'Public Health Officer'],
  icon: Stethoscope, color: '#1E1E1E', category: 'undergraduate',
  tuition: '₦2,500,000 per session', intake: 'September/October',
  accreditation: ['Medical and Dental Council of Nigeria (MDCN)', 'National Universities Commission (NUC)'],
  curriculum: [
   { year: 'Year 1 (Pre-Med)', courses: ['General Chemistry', 'Physics', 'Biology', 'Anatomy Introduction'] },
   { year: 'Year 2 (Anatomy & Physiology)', courses: ['Human Anatomy I & II', 'Physiology I & II', 'Biochemistry', 'Histology'] },
   { year: 'Year 3 (Pathology)', courses: ['General Pathology', 'Microbiology', 'Pharmacology I', 'Community Medicine'] },
   { year: 'Year 4-6 (Clinical)', courses: ['Internal Medicine', 'Surgery', 'Obstetrics & Gynecology', 'Pediatrics'] },
  ],
  facilities: ['Modern Anatomy Lab', 'Clinical Skills Center', 'Simulation Lab', 'University Teaching Hospital'],
  highlights: ['International exchange opportunities', 'Research internships', 'Clinical rotations abroad'],
 },
 'bsc-radiography': {
  id: 'bsc-radiography', name: 'Radiography', degree: 'BSc', duration: '5 years',
  description: 'Professional training in medical imaging including X-ray, CT, MRI, and ultrasound.',
  longDescription: 'This program provides comprehensive education in medical imaging technologies.',
  requirements: ["5 O'Level credits including English, Maths, Biology, Chemistry, Physics", 'UTME score of 180+', 'Physical fitness assessment'],
  careerPaths: ['Radiographer', 'MRI Technologist', 'Radiation Therapist', 'Imaging Specialist'],
  icon: Scan, color: '#1E1E1E', category: 'undergraduate',
  tuition: '₦2,000,000 per session', intake: 'September/October',
  accreditation: ['Radiographers Registration Board of Nigeria (RRBN)', 'NUC'],
  curriculum: [
   { year: 'Year 1', courses: ['Physics for Radiography', 'Anatomy', 'Physiology', 'Patient Care'] },
   { year: 'Year 2', courses: ['Radiation Physics', 'Radiographic Techniques', 'Image Processing', 'Radiation Protection'] },
   { year: 'Year 3', courses: ['CT & MRI Imaging', 'Ultrasound Basics', 'Nuclear Medicine', 'Sectional Anatomy'] },
   { year: 'Year 4-5', courses: ['Advanced Imaging', 'Radiation Therapy', 'PACS & Informatics', 'Clinical Internship'] },
  ],
  facilities: ['Digital X-Ray Suite', 'CT/MRI Center', 'Ultrasound Lab'],
  highlights: ['State-of-the-art imaging equipment', 'Clinical rotations in major hospitals', 'Radiation safety certification'],
 },
 'msc-public-health': {
  id: 'msc-public-health', name: 'Public Health', degree: 'MSc', duration: '2 years',
  description: 'Advanced training in public health leadership, epidemiology, and health policy.',
  longDescription: 'The MSc Public Health program prepares professionals for leadership roles in public health.',
  requirements: ['First degree in health or related field', 'Minimum Second Class Lower', 'Relevant work experience'],
  careerPaths: ['Public Health Director', 'Health Policy Advisor', 'Research Coordinator', 'NGO Leader'],
  icon: Globe, color: '#A51C30', category: 'postgraduate',
  tuition: '₦3,500,000 total', intake: 'January/September',
  accreditation: ['Public Health Society of Nigeria', 'NUC'],
  curriculum: [
   { year: 'Year 1', courses: ['Advanced Epidemiology', 'Biostatistics II', 'Health Systems Analysis', 'Research Design'] },
   { year: 'Year 2', courses: ['Program Evaluation', 'Health Economics', 'Policy Analysis', 'Dissertation'] },
  ],
  facilities: ['Graduate Research Center', 'Health Policy Institute'],
  highlights: ['Research mentorship', 'International faculty', 'Policy engagement opportunities'],
 },
};

export const ProgramDetail = () => {
 const { slug } = useParams<{ slug: string }>();
 const { data: apiProgram, isLoading } = useProgramBySlug(slug || '');

 if (isLoading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-[#1E1E1E] animate-spin" />
   </div>
  );
 }

 let program: Program | undefined;
 if (apiProgram && apiProgram.slug === slug) {
  program = transformDetail(apiProgram);
 }
 if (!program) {
  program = fallbackPrograms[slug || ''];
 }

 if (!program) {
  return <Navigate to="/academics/programs" replace />;
 }

 const Icon = program.icon;

 return (
  <>
  <Helmet>
  <title>{program.name} ({program.degree}) | Bayelsa Medical University</title>
  <meta name="description" content={`${program.description} Apply for ${program.degree} in ${program.name} at Bayelsa Medical University.`} />
  </Helmet>

  {/* Hero Section */}
  <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: program.color }}>
  <div className="absolute inset-0 opacity-10" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
  }} />

  <div className="container-custom relative z-10">
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="flex items-center gap-2 text-white/70 text-sm mb-6"
  >
  <Link to="/" className="hover:text-white transition">Home</Link>
  <ChevronRight className="w-4 h-4" />
  <Link to="/academics" className="hover:text-white transition">Academics</Link>
  <ChevronRight className="w-4 h-4" />
  <Link to="/academics/programs" className="hover:text-white transition">Programs</Link>
  <ChevronRight className="w-4 h-4" />
  <span className="text-white font-medium">{program.name}</span>
  </motion.div>

  <div className="grid lg:grid-cols-2 gap-12 items-center">
  <motion.div
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  >
  <div className="flex items-center gap-3 mb-4">
  <span className="px-4 py-1.5 bg-white/20 text-white text-sm font-medium uppercase tracking-wide">
  {program.category}
  </span>
  <span className="flex items-center gap-1 text-white/80 text-sm">
  <Clock className="w-4 h-4" />
  {program.duration}
  </span>
  </div>

  <h1 className="text-display text-white mb-4">
  {program.name}
  </h1>
  <p className="text-xl text-white/90 mb-6 leading-relaxed">
  {program.degree} &bull; {program.description}
  </p>

  <div className="flex flex-wrap gap-4">
  <Link
  to="/apply"
  className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold transition hover:bg-white/90"
  style={{ color: program.color }}
  >
  Apply Now
  <ArrowRight className="w-5 h-5" />
  </Link>
  <Link
  to="/academics/admissions"
  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white/10 transition"
  >
  Admission Requirements
  </Link>
  </div>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="hidden lg:flex justify-center"
  >
  <div className="w-64 h-64 bg-white/20 flex items-center justify-center">
  <Icon className="w-32 h-32 text-white" />
  </div>
  </motion.div>
  </div>
  </div>
  </section>

  {/* Quick Info Bar */}
  <section className="bg-white border-b">
  <div className="container-custom py-6">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  <div className="flex items-center gap-3">
  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${program.color}15` }}>
  <Clock className="w-6 h-6" style={{ color: program.color }} />
  </div>
  <div>
  <p className="text-sm text-gray-700">Duration</p>
  <p className="font-semibold text-gray-900">{program.duration}</p>
  </div>
  </div>
  <div className="flex items-center gap-3">
  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${program.color}15` }}>
  <DollarSign className="w-6 h-6" style={{ color: program.color }} />
  </div>
  <div>
  <p className="text-sm text-gray-700">Tuition</p>
  <p className="font-semibold text-gray-900">{program.tuition}</p>
  </div>
  </div>
  <div className="flex items-center gap-3">
  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${program.color}15` }}>
  <Calendar className="w-6 h-6" style={{ color: program.color }} />
  </div>
  <div>
  <p className="text-sm text-gray-700">Intake</p>
  <p className="font-semibold text-gray-900">{program.intake}</p>
  </div>
  </div>
  <div className="flex items-center gap-3">
  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: `${program.color}15` }}>
  <Award className="w-6 h-6" style={{ color: program.color }} />
  </div>
  <div>
  <p className="text-sm text-gray-700">Degree</p>
  <p className="font-semibold text-gray-900">{program.degree}</p>
  </div>
  </div>
  </div>
  </div>
  </section>

  {/* Main Content */}
  <section className="py-16 bg-gray-50">
  <div className="container-custom">
  <div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-8">
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-8 shadow-sm"
  >
  <h2 className="text-headline text-gray-900 mb-4">About the Program</h2>
  <p className="text-body text-gray-700 leading-relaxed mb-6">
  {program.longDescription}
  </p>

  <div className="grid sm:grid-cols-2 gap-4">
  {program.highlights.map((highlight, index) => (
  <div key={index} className="flex items-start gap-3">
  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${program.color}15` }}>
  <Star className="w-3 h-3" style={{ color: program.color }} />
  </div>
  <span className="text-sm text-gray-700">{highlight}</span>
  </div>
  ))}
  </div>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-8 shadow-sm"
  >
  <h2 className="text-headline text-gray-900 mb-6">Program Curriculum</h2>
  <div className="space-y-6">
  {program.curriculum.map((year, index) => (
  <div key={index} className="border-l-4 pl-6 pb-6" style={{ borderColor: program.color }}>
  <h3 className="text-lg font-bold text-gray-900 mb-3">{year.year}</h3>
  <ul className="grid sm:grid-cols-2 gap-2">
  {year.courses.map((course, idx) => (
  <li key={idx} className="flex items-center gap-2 text-sm text-gray-800">
  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: program.color }} />
  {course}
  </li>
  ))}
  </ul>
  </div>
  ))}
  </div>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-8 shadow-sm"
  >
  <h2 className="text-headline text-gray-900 mb-6">Admission Requirements</h2>
  <ul className="space-y-4">
  {program.requirements.map((req, index) => (
  <li key={index} className="flex items-start gap-4">
  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${program.color}15` }}>
  <span className="text-sm font-bold" style={{ color: program.color }}>{index + 1}</span>
  </div>
  <span className="text-gray-700 pt-1">{req}</span>
  </li>
  ))}
  </ul>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-8 shadow-sm"
  >
  <h2 className="text-headline text-gray-900 mb-6">Career Opportunities</h2>
  <div className="flex flex-wrap gap-3">
  {program.careerPaths.map((career, index) => (
  <span
  key={index}
  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
  style={{ backgroundColor: `${program.color}15`, color: program.color }}
  >
  <Briefcase className="w-4 h-4" />
  {career}
  </span>
  ))}
  </div>
  </motion.div>
  </div>

  <div className="space-y-6">
  <motion.div
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  className="bg-white p-6 shadow-sm"
  >
  <h3 className="text-title text-gray-900 mb-4 flex items-center gap-2">
  <Award className="w-5 h-5" style={{ color: program.color }} />
  Accreditation
  </h3>
  <ul className="space-y-3">
  {program.accreditation.map((acc, index) => (
  <li key={index} className="flex items-start gap-2 text-sm text-gray-800">
  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: program.color }} />
  {acc}
  </li>
  ))}
  </ul>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  className="bg-white p-6 shadow-sm"
  >
  <h3 className="text-title text-gray-900 mb-4 flex items-center gap-2">
  <Building2 className="w-5 h-5" style={{ color: program.color }} />
  Facilities
  </h3>
  <ul className="space-y-3">
  {program.facilities.map((facility, index) => (
  <li key={index} className="flex items-start gap-2 text-sm text-gray-800">
  <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ backgroundColor: program.color }} />
  {facility}
  </li>
  ))}
  </ul>
  </motion.div>

  <motion.div
  initial={{ opacity: 0, x: 20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  className="p-6 text-white"
  style={{ backgroundColor: program.color }}
  >
  <h3 className="text-lg font-bold mb-2">Need More Information?</h3>
  <p className="text-white/80 text-sm mb-4">
  Contact our admissions office for detailed guidance about this program.
  </p>
  <Link
  to="/contact"
  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-sm font-semibold transition hover:bg-white/90"
  style={{ color: program.color }}
  >
  <MapPin className="w-4 h-4" />
  Contact Us
  </Link>
  </motion.div>
  </div>
  </div>
  </div>
  </section>

  <section className="py-20" style={{ backgroundColor: program.color }}>
  <div className="container-custom text-center">
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  >
  <h2 className="text-headline text-white mb-4">
  Ready to Start Your Journey?
  </h2>
  <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
  Applications are now open for the {program.intake} intake. Take the first step toward a rewarding career in {program.name.toLowerCase()}.
  </p>
  <div className="flex flex-wrap justify-center gap-4">
  <Link
  to="/apply"
  className="px-8 py-4 bg-white font-bold transition hover:bg-white/90 inline-flex items-center gap-2"
  style={{ color: program.color }}
  >
  <FileText className="w-5 h-5" />
  Apply Now
  </Link>
  <Link
  to="/academics/admissions"
  className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white/10 transition inline-flex items-center gap-2"
  >
  <BookOpen className="w-5 h-5" />
  View Admission Guide
  </Link>
  </div>
  </motion.div>
  </div>
  </section>
  </>
  );
};
