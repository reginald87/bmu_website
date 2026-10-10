import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
 const innovationPillars = (sections?.find(s => s.section_key === 'innovation_pillars')?.data as typeof fallbackPillars) || fallbackPillars;
 const facilities = (sections?.find(s => s.section_key === 'facilities')?.data as typeof fallbackFacilities) || fallbackFacilities;
 const partners = (sections?.find(s => s.section_key === 'partners')?.data as typeof fallbackPartners) || fallbackPartners;
 return (
 <>
 <Helmet>
 <title>Innovation & Technology Centre | Bayelsa Medical University</title>
 <meta name="description" content="Innovation & Technology Centre at BMU - Where healthcare meets technology" />
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
 <span className="text-white font-medium">Innovation Centre</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Innovation & Technology <span className="text-primary-600">Centre</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Where Healthcare Meets Technology
 </p>
 </motion.div>
 </div>
 </section>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>About the Centre</h2>
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
 <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-ink-900)' }}>Innovation Pillars</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {innovationPillars.map((pillar) => (
 <div key={pillar.title} className="card p-6">
 <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-ink-900)' }}>
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
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Our Facilities</h2>
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
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Partnerships & Collaboration</h2>
 <p className="text-gray-600 mb-4">
 We collaborate with technology companies, healthcare organizations, and academic 
 institutions to accelerate innovation. Our partners include:
 </p>
 <div className="flex flex-wrap gap-3">
 {partners.map((partner: string) => (
 <span 
 key={partner} 
 className="px-4 py-2 bg-ink-900/8 text-sm font-medium"
 style={{ color: 'var(--color-ink-900)' }}
 >
 {partner}
 </span>
 ))}
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: innovation@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Yenagoa Campus - Innovation Hub</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Impact Stats</h3>
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

 <div className="card p-6" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 8%, transparent)' }}>
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Get Involved</h3>
 <p className="text-gray-600 text-sm mb-4">
 Partner with us, join our innovation challenges, or access our facilities.
 </p>
 <button 
 className="w-full py-3 text-white font-semibold hover:opacity-90 transition"
 style={{ backgroundColor: 'var(--color-ink-900)' }}
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
