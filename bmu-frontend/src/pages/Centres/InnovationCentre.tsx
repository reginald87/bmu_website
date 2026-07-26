import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { usePageSections } from '../../services/apiHooks';

const fallbackPillars = [
 {
 title: 'Digital Health',
 description: 'Telemedicine platforms, health informatics, and AI-powered diagnostic tools',
 projects: 8,
 },
 {
 title: 'Medical Devices',
 description: 'Design and prototyping of low-cost medical equipment for resource-limited settings',
 projects: 5,
 },
 {
 title: 'Biotech & Genomics',
 description: 'Molecular diagnostics, genomic research, and personalized medicine initiatives',
 projects: 6,
 },
 {
 title: 'Health Entrepreneurship',
 description: 'Supporting healthcare startups and innovation-driven enterprises',
 projects: 12,
 },
];

const fallbackFacilities = [
 'Makerspace & Prototyping Lab',
 'Digital Health Innovation Lab',
 'Biotechnology Research Lab',
 'Co-working Spaces',
 'VR/AR Medical Training Suite',
 '3D Printing & Fabrication Lab',
];

const fallbackPartners = ['Microsoft', 'Google Health', 'IBM Research', 'NITDA', 'Tech startups'];

export const InnovationCentre = () => {
 const { data: sections } = usePageSections('centres/innovation');
 const innovationPillars = (sections?.find(s => s.section_key === 'innovation_pillars')?.data as any[] || fallbackPillars);
 const facilities = (sections?.find(s => s.section_key === 'facilities')?.data as any[] || fallbackFacilities);
 const partners = (sections?.find(s => s.section_key === 'partners')?.data as any[] || fallbackPartners);
 return (
 <>
 <Helmet>
 <title>Innovation & Technology Centre | Bayelsa Medical University</title>
 <meta name="description" content="Innovation & Technology Centre at BMU - Where healthcare meets technology" />
 </Helmet>

 <div className="bg-[#1E1E1E] text-white py-16">
 <div className="container-custom">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl md:text-5xl font-bold mb-4"
 >
 Innovation & Technology Centre
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-xl text-white/80"
 >
 Where Healthcare Meets Technology
 </motion.p>
 </div>
 </div>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>About the Centre</h2>
 <p className="text-gray-600 mb-4">
 The Innovation & Technology Centre (ITC) is BMU's hub for healthcare innovation, 
 bringing together researchers, technologists, entrepreneurs, and healthcare professionals 
 to develop solutions for Africa's health challenges.
 </p>
 <p className="text-gray-600">
 We foster an ecosystem of innovation through cutting-edge facilities, industry partnerships, 
 and interdisciplinary collaboration, driving the transformation of healthcare delivery in Nigeria 
 and beyond.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Innovation Pillars</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {innovationPillars.map((pillar) => (
 <div key={pillar.title} className="card p-6">
 <h3 className="font-bold text-lg mb-2" style={{ color: '#1E1E1E' }}>
 {pillar.title}
 </h3>
 <p className="text-gray-600 text-sm mb-3">{pillar.description}</p>
 <span className="text-sm font-medium" style={{ color: '#00a651' }}>
 {pillar.projects} Active Projects
 </span>
 </div>
 ))}
 </div>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Our Facilities</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {facilities.map((facility) => (
 <div key={facility} className="flex items-center gap-3 p-3 bg-gray-50 ">
 <span style={{ color: '#00a651' }}>◆</span>
 <span className="text-gray-700">{facility}</span>
 </div>
 ))}
 </div>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Partnerships & Collaboration</h2>
 <p className="text-gray-600 mb-4">
 We collaborate with technology companies, healthcare organizations, and academic 
 institutions to accelerate innovation. Our partners include:
 </p>
 <div className="flex flex-wrap gap-3">
 {partners.map((partner: string) => (
 <span 
 key={partner} 
 className="px-4 py-2 bg-[#1E1E1E15] text-sm font-medium"
 style={{ color: '#1E1E1E' }}
 >
 {partner}
 </span>
 ))}
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: innovation@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Yenagoa Campus - Innovation Hub</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Impact Stats</h3>
 <ul className="space-y-3 text-gray-600">
 <li className="flex justify-between">
 <span>Innovation Projects</span>
 <span className="font-bold">31</span>
 </li>
 <li className="flex justify-between">
 <span>Startups Supported</span>
 <span className="font-bold">15</span>
 </li>
 <li className="flex justify-between">
 <span>Patents Filed</span>
 <span className="font-bold">8</span>
 </li>
 <li className="flex justify-between">
 <span>Research Grants</span>
 <span className="font-bold">₦450M</span>
 </li>
 </ul>
 </div>

 <div className="card p-6" style={{ backgroundColor: '#1E1E1E15' }}>
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Get Involved</h3>
 <p className="text-gray-600 text-sm mb-4">
 Partner with us, join our innovation challenges, or access our facilities.
 </p>
 <button 
 className="w-full py-3 text-white font-semibold hover:opacity-90 transition"
 style={{ backgroundColor: '#1E1E1E' }}
 >
 Partner With Us
 </button>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
