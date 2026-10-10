import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';
import { ALLOW_API_MOCKS } from '../../services/api';

const fallbackServices = [
 { title: 'Career Counseling', desc: 'One-on-one guidance for career planning and development' },
 { title: 'Job Placement', desc: 'Connect with employers in healthcare sector' },
 { title: 'CV & Interview Prep', desc: 'Professional resume writing and mock interviews' },
 { title: 'Internship Programs', desc: 'Access to clinical and research internships' },
 { title: 'Alumni Network', desc: 'Connect with successful BMU graduates' },
 { title: 'Career Workshops', desc: 'Regular workshops on career development' },
];

const fallbackStats = [
 { value: '85%', label: 'Employment Rate' },
 { value: '200+', label: 'Partner Employers' },
 { value: '1,500', label: 'Alumni Network' },
 { value: '50+', label: 'Annual Workshops' },
];

export const CareerCentre = () => {
 const { data: sections } = usePageSections('centres/career');
 const services = (sections?.find(s => s.section_key === 'services')?.data as typeof fallbackServices) ?? (ALLOW_API_MOCKS ? fallbackServices : []);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as typeof fallbackStats) ?? (ALLOW_API_MOCKS ? fallbackStats : []);
 return (
 <>
 <Helmet>
 <title>Career Centre | Bayelsa Medical University</title>
 <meta name="description" content="BMU Career Centre - Your gateway to professional success in healthcare" />
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
 <span className="text-white font-medium">Career Centre</span>
 </div>
 <h1 className="text-display text-white mb-6">
 BMU Career <span className="text-primary-600">Centre</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Your Gateway to Professional Success
 </p>
 </motion.div>
 </div>
 </section>

 <div className="container-custom py-12">
 {/* Stats */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
 {stats.map((stat) => (
 <div key={stat.label} className="card p-4 text-center">
 <div className="text-3xl font-bold text-[#00a651]">{stat.value}</div>
 <div className="text-sm text-gray-600">{stat.label}</div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>About the Career Centre</h2>
 <p className="text-gray-600 mb-4">
 The BMU Career Centre is committed to preparing students and graduates for successful 
 careers in healthcare. We bridge the gap between academic training and professional practice 
 through comprehensive career services and industry partnerships.
 </p>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-ink-900)' }}>Our Services</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {services.map((service) => (
 <div key={service.title} className="border-l-4 pl-4" style={{ borderColor: '#00a651' }}>
 <h3 className="font-bold mb-1">{service.title}</h3>
 <p className="text-gray-600 text-sm">{service.desc}</p>
 </div>
 ))}
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: career@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Location: Student Affairs Building</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Office Hours</h3>
 <p className="text-gray-600">Monday - Friday</p>
 <p className="text-gray-600">9:00 AM - 5:00 PM</p>
 <p className="text-gray-600 mt-2 text-sm">Walk-ins welcome</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Upcoming Events</h3>
 <ul className="space-y-3 text-sm text-gray-600">
 <li>Career Fair 2025 - March 15</li>
 <li>CV Writing Workshop - Feb 20</li>
 <li>Interview Skills - March 5</li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
