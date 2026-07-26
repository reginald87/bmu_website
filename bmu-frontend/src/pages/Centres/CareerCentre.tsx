import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { usePageSections } from '../../services/apiHooks';

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
 const services = (sections?.find(s => s.section_key === 'services')?.data as any[] || fallbackServices);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);
 return (
 <>
 <Helmet>
 <title>BMU Career Centre | BMU</title>
 <meta name="description" content="BMU Career Centre - Your gateway to professional success in healthcare" />
 </Helmet>

 <div className="bg-[#1E1E1E] text-white py-16">
 <div className="container-custom">
 <motion.h1 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-4xl md:text-5xl font-bold mb-4"
 >
 BMU Career Centre
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-xl text-white/80"
 >
 Your Gateway to Professional Success
 </motion.p>
 </div>
 </div>

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
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>About the Career Centre</h2>
 <p className="text-gray-600 mb-4">
 The BMU Career Centre is committed to preparing students and graduates for successful 
 careers in healthcare. We bridge the gap between academic training and professional practice 
 through comprehensive career services and industry partnerships.
 </p>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Our Services</h2>
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
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: career@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Location: Student Affairs Building</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Office Hours</h3>
 <p className="text-gray-600">Monday - Friday</p>
 <p className="text-gray-600">9:00 AM - 5:00 PM</p>
 <p className="text-gray-600 mt-2 text-sm">Walk-ins welcome</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Upcoming Events</h3>
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
