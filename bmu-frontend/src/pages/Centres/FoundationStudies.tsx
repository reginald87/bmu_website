import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

const fallbackPathways = [
 {
 name: 'Pre-Medicine Pathway',
 duration: '1 Year',
 subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
 leadsTo: 'MBBS Program',
 },
 {
 name: 'Pre-Nursing Pathway',
 duration: '1 Year',
 subjects: ['Biology', 'Chemistry', 'Health Sciences'],
 leadsTo: 'B.Sc Nursing',
 },
 {
 name: 'Pre-Allied Health Pathway',
 duration: '1 Year',
 subjects: ['Biology', 'Chemistry', 'Anatomy'],
 leadsTo: 'Allied Health Programs',
 },
 {
 name: 'English Enhancement',
 duration: '6-12 Months',
 subjects: ['Academic Writing', 'Medical English', 'Communication'],
 leadsTo: 'All Programs',
 },
];

export const FoundationStudies = () => {
 const { data: sections } = usePageSections('centres/foundation');
 const pathways = (sections?.find(s => s.section_key === 'pathways')?.data as any[] || fallbackPathways);
 return (
 <>
 <Helmet>
 <title>Centre for Foundation Studies | Bayelsa Medical University</title>
 <meta name="description" content="Centre for Foundation Studies at BMU - Preparing students for success in medical education" />
 </Helmet>

 <div className="bg-[#1E1E1E] text-white py-16">
 <div className="container-custom">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl md:text-5xl font-bold mb-4"
 >
 Centre for Foundation Studies
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-xl text-white/80"
 >
 Building Strong Foundations for Medical Excellence
 </motion.p>
 </div>
 </div>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>About the Centre</h2>
 <p className="text-gray-600 mb-4">
 The Centre for Foundation Studies provides comprehensive preparatory programs designed 
 to equip students with the academic foundation and skills necessary for success in 
 medical and health sciences education at BMU.
 </p>
 <p className="text-gray-600">
 Whether you are a direct entry student, international applicant, or seeking to 
 strengthen your academic background, our foundation programs ensure you are 
 fully prepared for the rigors of university-level healthcare education.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Foundation Pathways</h2>
 <div className="space-y-4">
 {pathways.map((pathway) => (
 <div key={pathway.name} className="card p-6">
 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
 <h3 className="font-bold text-lg" style={{ color: '#1E1E1E' }}>{pathway.name}</h3>
 <span className="text-sm font-medium px-3 py-1 bg-gray-100">
 {pathway.duration}
 </span>
 </div>
 <p className="text-gray-600 text-sm mb-2">
 <strong>Subjects:</strong> {pathway.subjects.join(', ')}
 </p>
 <p className="text-[#00a651] text-sm">
 Leads to: {pathway.leadsTo}
 </p>
 </div>
 ))}
 </div>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Admission Requirements</h2>
 <ul className="space-y-2 text-gray-600 list-disc list-inside">
 <li>5 O'level credits including English, Mathematics, Biology, Chemistry</li>
 <li>UTME score of 180+ (for Pre-Medicine pathway)</li>
 <li>International students: Equivalent qualifications accepted</li>
 <li>English proficiency test for non-native speakers</li>
 </ul>
 <Link 
 to="/apply"
 className="inline-block mt-6 px-6 py-3 text-white font-semibold hover:opacity-90 transition"
 style={{ backgroundColor: '#00a651' }}
 >
 Apply for Foundation Program
 </Link>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: foundation@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Yenagoa Campus</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Quick Facts</h3>
 <ul className="space-y-2 text-gray-600">
 <li>4 Foundation Pathways</li>
 <li>Small Class Sizes (30 max)</li>
 <li>Modern Teaching Labs</li>
 <li>95% Progression Rate</li>
 </ul>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Important Dates</h3>
 <ul className="space-y-3 text-sm text-gray-600">
 <li className="flex justify-between">
 <span>Application Opens</span>
 <span className="font-medium">Jan 1</span>
 </li>
 <li className="flex justify-between">
 <span>Application Deadline</span>
 <span className="font-medium">Aug 31</span>
 </li>
 <li className="flex justify-between">
 <span>Program Starts</span>
 <span className="font-medium">Oct 1</span>
 </li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
