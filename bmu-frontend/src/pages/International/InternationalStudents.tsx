import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
 Users,
 FileText,
 Home,
 DollarSign,
 Plane,
 CheckCircle,
 ArrowRight,
 GraduationCap,
 Calendar,
 MapPin,
 Phone,
 Mail,
 Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudentSupportServices } from '../../services/apiHooks';

const admissionSteps = [
 {
 step: 1,
 title: 'Choose Your Program',
 description: 'Explore our programs and select the right fit for your academic goals.',
 icon: GraduationCap
 },
 {
 step: 2,
 title: 'Submit Application',
 description: 'Complete online application with required documents and application fee.',
 icon: FileText
 },
 {
 step: 3,
 title: 'Document Evaluation',
 description: 'Academic credentials reviewed and verified by admissions committee.',
 icon: CheckCircle
 },
 {
 step: 4,
 title: 'Interview',
 description: 'Virtual interview with program coordinator (if required).',
 icon: Phone
 },
 {
 step: 5,
 title: 'Admission Decision',
 description: 'Receive official admission letter and enrollment package.',
 icon: Mail
 },
 {
 step: 6,
 title: 'Visa & Travel',
 description: 'Apply for student visa and arrange travel to Nigeria.',
 icon: Plane
 }
];

const requiredDocuments = [
 'Completed application form',
 'Secondary school certificate / Bachelor\'s degree transcript',
 'English proficiency test results (IELTS/TOEFL)',
 'Passport copy (minimum 6 months validity)',
 'Medical fitness certificate',
 'Recommendation letters (2)',
 'Statement of purpose',
 'Application fee payment receipt'
];

const faqs = [
 {
 question: 'What are the English language requirements?',
 answer: 'International students must demonstrate English proficiency through IELTS (minimum 6.5) or TOEFL iBT (minimum 80). Alternative qualifications may be considered on a case-by-case basis.'
 },
 {
 question: 'When should I apply?',
 answer: 'We recommend applying at least 6 months before your intended start date to allow time for visa processing and travel arrangements. Fall semester applications close June 30, Spring semester applications close November 30.'
 },
 {
 question: 'Are scholarships available for international students?',
 answer: 'Yes, BMU offers merit-based scholarships for outstanding international students. Awards range from 25% to 75% of tuition fees. Additional external scholarship opportunities are also available.'
 },
 {
 question: 'What is the cost of living?',
 answer: 'The estimated cost of living in Yenagoa is approximately $300-500 per month, covering accommodation, food, transportation, and personal expenses. On-campus housing is available at subsidized rates.'
 }
];

const studentStats = [
 { value: '500+', label: 'International Students' },
 { value: '45+', label: 'Countries Represented' },
 { value: '95%', label: 'Visa Success Rate' },
 { value: '85%', label: 'Student Satisfaction' }
];

export const InternationalStudents = () => {
 const { data: services, isLoading } = useStudentSupportServices();
 const internationalServices = services?.filter(s => s.service_type === 'international') ?? [];

 if (isLoading) {
  return (
   <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-8 h-8 animate-spin text-[#A51C30]" />
   </div>
  );
 }

 return (
  <>
  <Helmet>
  <title>International Students | Bayelsa Medical University</title>
  <meta name="description" content="Information for international students applying to BMU including admission requirements, support services, visa guidance, and campus life." />
  </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#A51C30' }}>
 <div className="absolute inset-0 opacity-10" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
  <Link to="/international" className="hover:text-white transition">International</Link>
  <span>/</span>
  <span className="text-white font-medium">International Students</span>
  </div>
  <h1 className="text-display text-white mb-6">
  Welcome <span className="text-white">International</span> Students
  </h1>
  <p className="text-lead text-white/80 max-w-2xl">
 Join our diverse community of students from over 45 countries. World-class healthcare 
 education in the heart of Nigeria's Niger Delta region.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {studentStats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <Users className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Admission Process */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Admission Process</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Follow these steps to begin your journey at BMU
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {admissionSteps.map((item, index) => (
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
 <item.icon className="w-6 h-6 text-[#A51C30]" />
 </div>
 <h3 className="text-title text-gray-900 mb-2">{item.title}</h3>
 <p className="text-body text-gray-600">{item.description}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Required Documents */}
 <section className="py-20">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
 <div>
 <h2 className="text-headline text-gray-900 mb-6">Required Documents</h2>
 <ul className="space-y-4">
 {requiredDocuments.map((doc, idx) => (
 <motion.li
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="flex items-start gap-3"
 >
 <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <span className="text-body text-gray-700">{doc}</span>
 </motion.li>
 ))}
 </ul>
 </div>

 <div className="bg-[#1E1E1E] p-8 text-white">
 <h3 className="text-title mb-4">Application Deadlines</h3>
 <div className="space-y-4 mb-8">
 <div className="flex justify-between items-center pb-4 border-b border-white/20">
 <span>Fall Semester (September)</span>
 <span className="font-semibold">June 30</span>
 </div>
 <div className="flex justify-between items-center pb-4 border-b border-white/20">
 <span>Spring Semester (January)</span>
 <span className="font-semibold">November 30</span>
 </div>
 <div className="flex justify-between items-center">
 <span>Summer Programs</span>
 <span className="font-semibold">March 31</span>
 </div>
 </div>
 <Link 
 to="/apply"
 className="inline-flex items-center gap-2 px-6 py-3 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Start Application <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* Support Services */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Support Services</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Comprehensive support to help you succeed at BMU
 </p>
 </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   {internationalServices.map((service, index) => (
   <motion.div
   key={service.id}
   initial={{ opacity: 0, y: 20 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true }}
   transition={{ delay: index * 0.1 }}
   className="bg-white p-6 shadow-sm border border-gray-100"
   >
   <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center mb-4">
   <FileText className="w-6 h-6 text-[#A51C30]" />
   </div>
   <h3 className="text-title text-gray-900 mb-2">{service.title}</h3>
   <p className="text-body text-gray-600">{service.short_description}</p>
   </motion.div>
   ))}
 </div>
 </div>
 </section>

 {/* FAQs */}
 <section className="py-20">
 <div className="container-custom">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-headline text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
 <div className="space-y-6">
 {faqs.map((faq, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100"
 >
 <h3 className="text-title text-gray-900 mb-3">{faq.question}</h3>
 <p className="text-body text-gray-600">{faq.answer}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Contact CTA */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">Ready to Apply?</h2>
 <p className="text-lead text-white/80 mb-6">
 Start your application today or contact our International Office for personalized guidance through the admission process.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/apply"
 className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Apply Now <ArrowRight className="w-5 h-5" />
 </Link>
 <Link 
 to="/contact"
 className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Contact Us
 </Link>
 </div>
 </div>
 <div className="bg-white/10 backdrop-blur p-8">
 <h3 className="text-title text-white mb-4">International Office</h3>
 <div className="space-y-4">
 <div className="flex items-center gap-3 text-white/80">
 <MapPin className="w-5 h-5" />
 <span>Bayelsa Medical University, Yenagoa, Nigeria</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <Mail className="w-5 h-5" />
 <span>international@bmu.edu.ng</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <Phone className="w-5 h-5" />
 <span>+234 803 111 0020</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};
