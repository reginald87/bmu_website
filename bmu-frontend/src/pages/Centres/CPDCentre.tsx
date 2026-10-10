import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';
import { ALLOW_API_MOCKS } from '../../services/api';

const fallbackCpdPrograms = [
 {
 category: 'Clinical Skills',
 courses: [
 'Advanced Life Support (ALS)',
 'Basic Life Support (BLS)',
 'Emergency Medicine Updates',
 'Surgical Skills Workshop',
 ],
 },
 {
 category: 'Nursing & Midwifery',
 courses: [
 'Neonatal Care Excellence',
 'Midwifery Emergency Skills',
 'Infection Control & Prevention',
 'Patient Safety & Quality Care',
 ],
 },
 {
 category: 'Public Health',
 courses: [
 'Epidemiology & Disease Surveillance',
 'Health Promotion Strategies',
 'Community Health Programs',
 'Global Health Challenges',
 ],
 },
 {
 category: 'Healthcare Management',
 courses: [
 'Hospital Administration',
 'Healthcare Quality Management',
 'Medical Ethics & Law',
 'Leadership in Healthcare',
 ],
 },
];

export const CPDCentre = () => {
 const { data: sections } = usePageSections('centres/cpd');
 const cpdPrograms = (sections?.find(s => s.section_key === 'cpd_programs')?.data as typeof fallbackCpdPrograms) ?? (ALLOW_API_MOCKS ? fallbackCpdPrograms : []);
 return (
 <>
 <Helmet>
 <title>CPD Centre | Bayelsa Medical University</title>
 <meta name="description" content="Continuing Professional Development Centre at BMU - Lifelong learning for healthcare professionals" />
 </Helmet>

 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div
 className="absolute inset-0 opacity-5"
 style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }}
 />
 <div className="container-custom relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 >
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white font-medium">CPD Centre</span>
 </div>
 <h1 className="text-display text-white mb-6">
 CPD <span className="text-primary-600">Centre</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Continuing Professional Development for Healthcare Excellence
 </p>
 </motion.div>
 </div>
 </section>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>About CPD Centre</h2>
 <p className="text-gray-600 mb-4">
 The Continuing Professional Development (CPD) Centre at Bayelsa Medical University 
 is committed to supporting healthcare professionals in maintaining and enhancing their 
 knowledge, skills, and competence throughout their careers.
 </p>
 <p className="text-gray-600">
 Our programs are designed to meet the professional development requirements of 
 doctors, nurses, pharmacists, and allied health professionals, ensuring they stay 
 current with evolving healthcare practices.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-ink-900)' }}>CPD Programs</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {cpdPrograms.map((category) => (
 <div key={category.category} className="card p-6">
 <h3 className="font-bold text-lg mb-4" style={{ color: '#00a651' }}>
 {category.category}
 </h3>
 <ul className="space-y-2">
 {category.courses.map((course) => (
 <li key={course} className="text-gray-600 text-sm flex items-start gap-2">
 <span style={{ color: '#00a651' }}>•</span>
 {course}
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Certification & Accreditation</h2>
 <p className="text-gray-600 mb-4">
 All CPD programs are accredited by relevant professional bodies including the 
 Medical and Dental Council of Nigeria (MDCN), Nursing and Midwifery Council of Nigeria (NMCN), 
 and the West African College of Physicians.
 </p>
 <div className="flex flex-wrap gap-3">
 <span className="px-3 py-1 bg-gray-100 text-sm text-gray-600">MDCN Accredited</span>
 <span className="px-3 py-1 bg-gray-100 text-sm text-gray-600">NMCN Approved</span>
 <span className="px-3 py-1 bg-gray-100 text-sm text-gray-600">CME Credits</span>
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Contact CPD Centre</h3>
 <p className="text-gray-600 mb-2">Email: cpd@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Sampou Campus</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Why Choose BMU CPD?</h3>
 <ul className="space-y-2 text-gray-600 text-sm">
 <li>Expert faculty & practitioners</li>
 <li>Hands-on training approach</li>
 <li>Flexible learning schedules</li>
 <li>Nationally recognized certificates</li>
 <li>Online & in-person options</li>
 </ul>
 </div>

 <div className="card p-6" style={{ backgroundColor: '#00a65115' }}>
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Register for CPD</h3>
 <p className="text-gray-600 text-sm mb-4">
 Browse our current program calendar and register for upcoming courses.
 </p>
 <Link 
 to="/cpd/register"
 className="block w-full py-3 text-center text-white font-semibold hover:opacity-90 transition"
 style={{ backgroundColor: '#00a651' }}
 >
 View CPD Calendar
 </Link>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
