import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

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
 const cpdPrograms = (sections?.find(s => s.section_key === 'cpd_programs')?.data as any[] || fallbackCpdPrograms);
 return (
 <>
 <Helmet>
 <title>CPD Centre | BMU</title>
 <meta name="description" content="Continuing Professional Development Centre at BMU - Lifelong learning for healthcare professionals" />
 </Helmet>

 <div className="bg-[#1E1E1E] text-white py-16">
 <div className="container-custom">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl md:text-5xl font-bold mb-4"
 >
 CPD Centre
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-xl text-white/80"
 >
 Continuing Professional Development for Healthcare Excellence
 </motion.p>
 </div>
 </div>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>About CPD Centre</h2>
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
 <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E1E1E' }}>CPD Programs</h2>
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
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Certification & Accreditation</h2>
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
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Contact CPD Centre</h3>
 <p className="text-gray-600 mb-2">Email: cpd@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Sampou Campus</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Why Choose BMU CPD?</h3>
 <ul className="space-y-2 text-gray-600 text-sm">
 <li>Expert faculty & practitioners</li>
 <li>Hands-on training approach</li>
 <li>Flexible learning schedules</li>
 <li>Nationally recognized certificates</li>
 <li>Online & in-person options</li>
 </ul>
 </div>

 <div className="card p-6" style={{ backgroundColor: '#00a65115' }}>
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Register for CPD</h3>
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
