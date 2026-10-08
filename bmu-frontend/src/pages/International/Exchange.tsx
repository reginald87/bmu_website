import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Plane,
  GraduationCap,
  Calendar,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Home,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExchangePrograms, usePageSections } from '../../services/apiHooks';

const fallbackRequirements = [
  'Minimum GPA of 3.0',
  'Good academic standing',
  'English proficiency (IELTS 6.5 or equivalent)',
  'Recommendation from faculty advisor',
  'Valid passport and visa eligibility',
  'Health insurance coverage'
];

const fallbackProcessSteps = [
  { step: 1, title: 'Information Session', description: 'Attend mandatory pre-application briefing' },
  { step: 2, title: 'Online Application', description: 'Submit application with required documents' },
  { step: 3, title: 'Interview', description: 'Panel interview with selection committee' },
  { step: 4, title: 'Nomination', description: 'Selected students nominated to partner institution' },
  { step: 5, title: 'Visa & Travel', description: 'Apply for visa and arrange travel logistics' },
  { step: 6, title: 'Pre-Departure', description: 'Attend orientation and finalize preparations' }
];

const fallbackUpcomingDeadlines = [
  { program: 'Fall Semester Exchange 2025', deadline: 'March 15, 2025', status: 'Open' },
  { program: 'Summer Research 2025', deadline: 'January 31, 2025', status: 'Open' },
  { program: 'Spring Semester Exchange 2026', deadline: 'September 30, 2025', status: 'Upcoming' }
];

export const Exchange = () => {
  const { data: programs, isLoading } = useExchangePrograms();
  const { data: sections = [] } = usePageSections('exchange');

  const getSection = (key: string) => sections.find(s => s.section_key === key);
  const reqData = getSection('requirements')?.data;
  const requirements = Array.isArray(reqData) && reqData.length ? reqData : fallbackRequirements;
  const procData = getSection('process_steps')?.data;
  const processSteps = Array.isArray(procData) && procData.length ? procData : fallbackProcessSteps;
  const dlData = getSection('upcoming_deadlines')?.data;
  const upcomingDeadlines = Array.isArray(dlData) && dlData.length ? dlData : fallbackUpcomingDeadlines;

 return (
  <>
  <Helmet>
  <title>Student Exchange Programs | Bayelsa Medical University</title>
  <meta name="description" content="Explore BMU's student exchange programs and study abroad opportunities with partner institutions worldwide." />
  </Helmet>

  {/* Hero */}
  <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
  <div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  }} />

  <div className="container-custom relative z-10">
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
  <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
  <Link to="/international" className="hover:text-white transition">International</Link>
  <span>/</span>
  <span className="text-white font-medium">Exchange Programs</span>
  </div>
  <h1 className="text-display text-white mb-6">
  Student <span className="text-[#A51C30]">Exchange</span>
  </h1>
  <p className="text-lead text-white/80 max-w-2xl">
  Broaden your horizons through study abroad opportunities at our partner institutions 
  across 25+ countries. Experience different cultures, healthcare systems, and academic environments.
  </p>
  </motion.div>
  </div>
  </section>

  {/* Exchange Programs */}
  <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="container-custom">
  <div className="text-center mb-12">
  <h2 className="text-headline text-gray-900 mb-4">Exchange Opportunities</h2>
  <p className="text-lead text-gray-600 max-w-2xl mx-auto">
  Choose from various exchange programs designed to enhance your academic and professional development
  </p>
  </div>

  {isLoading ? (
  <div className="flex justify-center py-20">
  <Loader2 className="w-12 h-12 text-[#A51C30] animate-spin" />
  </div>
  ) : (
  <div className="space-y-8">
  {(programs ?? []).map((program, index) => (
  <motion.div
  key={program.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="bg-white p-8 shadow-sm border border-gray-100"
  >
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
  <div className="flex items-center gap-3 mb-4">
  <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center">
  <Plane className="w-6 h-6 text-[#A51C30]" />
  </div>
  <h3 className="text-title text-gray-900">{program.title}</h3>
  </div>

  <div className="flex flex-wrap gap-3 mb-4">
  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700">
  {program.program_type_display}
  </span>
  <span className={`px-3 py-1 text-xs font-medium ${program.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
  {program.status_display}
  </span>
  </div>

  <p className="text-body text-gray-600 mb-6">{program.description}</p>

  <div className="flex flex-wrap gap-4 mb-6">
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100">
  <GraduationCap className="w-4 h-4 text-[#A51C30]" />
  <span className="text-small">{program.partner.name}</span>
  </div>
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100">
  <MapPin className="w-4 h-4 text-[#A51C30]" />
  <span className="text-small">{program.partner.country}</span>
  </div>
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100">
  <Clock className="w-4 h-4 text-[#A51C30]" />
  <span className="text-small">{program.duration_weeks} weeks</span>
  </div>
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100">
  <Users className="w-4 h-4 text-[#A51C30]" />
  <span className="text-small">{program.available_slots} / {program.total_slots} slots available</span>
  </div>
  </div>

  {program.application_deadline && (
  <div className="flex items-center gap-2 mb-4 text-sm text-[#A51C30] font-medium">
  <Calendar className="w-4 h-4" />
  <span>Apply by: {new Date(program.application_deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
  </div>
  )}

  <div className="mb-4">
  <h4 className="font-semibold text-gray-900 mb-2">Eligibility</h4>
  <ul className="list-disc list-inside text-body text-gray-600 space-y-1">
  {program.eligibility_criteria.map((criteria, idx) => (
  <li key={idx}>{criteria}</li>
  ))}
  </ul>
  </div>
  </div>

  <div className="bg-gray-50 p-6">
  <h4 className="font-semibold text-gray-900 mb-4">Program Benefits</h4>
  <ul className="space-y-3 mb-6">
  {program.benefits.map((benefit, idx) => (
  <li key={idx} className="flex items-start gap-2">
  <CheckCircle className="w-4 h-4 text-[#A51C30] flex-shrink-0 mt-0.5" />
  <span className="text-body text-gray-600">{benefit}</span>
  </li>
  ))}
  </ul>

  <h4 className="font-semibold text-gray-900 mb-3">Costs</h4>
  <div className="space-y-2">
  {Object.entries(program.costs).map(([key, value]) => (
  <div key={key} className="flex justify-between text-sm">
  <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
  <span className="text-gray-900 font-medium">{value}</span>
  </div>
  ))}
  </div>

  {program.contact_email && (
  <div className="mt-4 pt-4 border-t border-gray-200">
  <p className="text-xs text-gray-500">Contact: {program.contact_email}</p>
  </div>
  )}
  </div>
  </div>
  </motion.div>
  ))}
  </div>
  )}
  </div>
  </section>

  {/* Application Process */}
  <section className="py-20">
  <div className="container-custom">
  <div className="text-center mb-12">
  <h2 className="text-headline text-gray-900 mb-4">Application Process</h2>
  <p className="text-lead text-gray-600 max-w-2xl mx-auto">
  Follow these steps to apply for exchange programs
  </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {processSteps.map((item, index) => (
  <motion.div
  key={item.step}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="bg-white p-6 shadow-sm border border-gray-100"
  >
  <div className="flex items-center gap-4 mb-4">
  <div className="w-12 h-12 bg-[#1E1E1E] flex items-center justify-center text-white font-bold">
  {item.step}
  </div>
  <h3 className="text-title text-gray-900">{item.title}</h3>
  </div>
  <p className="text-body text-gray-600">{item.description}</p>
  </motion.div>
  ))}
  </div>
  </div>
  </section>

  {/* Requirements & Deadlines */}
  <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="container-custom">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  <div>
  <h2 className="text-headline text-gray-900 mb-6">Eligibility Requirements</h2>
  <ul className="space-y-4">
  {requirements.map((req, idx) => (
  <motion.li
  key={idx}
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ delay: idx * 0.1 }}
  className="flex items-start gap-3"
  >
  <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
  <span className="text-body text-gray-700">{req}</span>
  </motion.li>
  ))}
  </ul>
  </div>

  <div>
  <h2 className="text-headline text-gray-900 mb-6">Upcoming Deadlines</h2>
  <div className="space-y-4">
  {upcomingDeadlines.map((item, idx) => (
  <motion.div
  key={item.program}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: idx * 0.1 }}
  className="bg-white p-6 shadow-sm border border-gray-100"
  >
  <div className="flex items-center justify-between mb-2">
  <h3 className="font-semibold text-gray-900">{item.program}</h3>
  <span className={`px-3 py-1 text-xs font-medium ${item.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
  {item.status}
  </span>
  </div>
  <p className="text-small text-gray-600">Application Deadline: {item.deadline}</p>
  </motion.div>
  ))}
  </div>
  </div>
  </div>
  </div>
  </section>

  {/* Funding Info */}
  <section className="py-20">
  <div className="container-custom">
  <div className="bg-white p-8 shadow-sm border border-gray-100">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div>
  <h2 className="text-headline text-gray-900 mb-4">Funding & Support</h2>
  <p className="text-body text-gray-600 mb-6">
  Various funding options are available to support your exchange experience, 
  including scholarships, grants, and travel stipends.
  </p>
  <ul className="space-y-3 mb-6">
  <li className="flex items-center gap-3">
  <DollarSign className="w-5 h-5 text-[#A51C30]" />
  <span className="text-body text-gray-700">Exchange scholarships available</span>
  </li>
  <li className="flex items-center gap-3">
  <Home className="w-5 h-5 text-[#A51C30]" />
  <span className="text-body text-gray-700">Housing assistance provided</span>
  </li>
  <li className="flex items-center gap-3">
  <BookOpen className="w-5 h-5 text-[#A51C30]" />
  <span className="text-body text-gray-700">Academic advising throughout</span>
  </li>
  </ul>
  </div>
  <div className="flex flex-wrap gap-4">
  <Link 
  to="/contact"
  className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E1E1E] text-white font-bold hover:bg-[#1E1E1E]/90 transition"
  >
  Apply Now <ArrowRight className="w-5 h-5" />
  </Link>
  <Link 
  to="/academics/admissions"
  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#1E1E1E] text-[#1E1E1E] font-bold hover:bg-[#1E1E1E] hover:text-white transition"
  >
  Learn More
  </Link>
  </div>
  </div>
  </div>
  </div>
  </section>
  </>
 );
};
