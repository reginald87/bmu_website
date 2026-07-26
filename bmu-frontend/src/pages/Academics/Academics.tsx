import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
 GraduationCap, 
 BookOpen, 
 Calendar, 
 Building2, 
 Users, 
 ArrowRight,
 Award,
 Microscope,
 Stethoscope,
 FlaskConical,
 Heart
} from 'lucide-react';
import { usePageSections } from '../../services/apiHooks';

const fallbackUnits = [
 {
 name: 'College of Medicine',
 programs: 'MBBS, B.Sc Anatomy, B.Sc Physiology',
 icon: Stethoscope,
 color: '#1E1E1E',
 link: '/colleges/medicine'
 },
 {
 name: 'School of Nursing',
 programs: 'B.NSc Nursing, Post-Basic Nursing',
 icon: Heart,
 color: '#A51C30',
 link: '/colleges/nursing'
 },
 {
 name: 'School of Allied Health',
 programs: 'BMLS, Radiography, Physiotherapy',
 icon: Microscope,
 color: '#A51C30',
 link: '/colleges/allied-health'
 },
 {
 name: 'Institute of Public Health',
 programs: 'B.Sc Public Health, MPH, DrPH',
 icon: FlaskConical,
 color: '#1E1E1E',
 link: '/colleges/pharmacy'
 }
];

const fallbackQuickLinks = [
 { title: 'Academic Programs', desc: 'Browse all degree programs', icon: GraduationCap, link: '/academics/programs' },
 { title: 'Faculties & Schools', desc: 'Explore our academic units', icon: Building2, link: '/academics/faculties' },
 { title: 'Academic Calendar', desc: 'View important dates', icon: Calendar, link: '/academics/calendar' },
 { title: 'University Library', desc: 'Access resources & databases', icon: BookOpen, link: '/academics/library' },
 { title: 'Admissions', desc: 'How to apply', icon: Users, link: '/academics/admissions' },
 { title: 'Research', desc: 'Research opportunities', icon: Award, link: '/research' }
];

const fallbackStats = [
 { value: '50+', label: 'Degree Programs' },
 { value: '6', label: 'Academic Units' },
 { value: '200+', label: 'Faculty Members' },
 { value: '5000+', label: 'Students Enrolled' }
];

export const Academics = () => {
 const { data: sections } = usePageSections('academics');
 const academicUnits = (sections?.find(s => s.section_key === 'academic_units')?.data as any[] || fallbackUnits);
 const quickLinks = (sections?.find(s => s.section_key === 'quick_links')?.data as any[] || fallbackQuickLinks);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);

 return (
 <>
 <Helmet>
 <title>Academics - Bayelsa Medical University</title>
 <meta name="description" content="Explore academic programs at Bayelsa Medical University. Undergraduate and postgraduate degrees in medicine, nursing, pharmacy, allied health sciences, and public health." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white font-medium">Academics</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Academic <span className="text-[#A51C30]">Excellence</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 World-class healthcare education combining rigorous academic training with 
 hands-on clinical experience. Discover programs that prepare you for a 
 rewarding career in medicine and health sciences.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {stats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Academic Units */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Academic Units</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Specialized schools and institutes offering comprehensive healthcare education
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {academicUnits.map((unit, index) => (
 <motion.div
 key={unit.name}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link 
 to={unit.link}
 className="block bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex items-start gap-4">
 <div 
 className="w-14 h-14 flex items-center justify-center flex-shrink-0"
 style={{ backgroundColor: `${unit.color}15` }}
 >
 <unit.icon className="w-7 h-7" style={{ color: unit.color }} />
 </div>
 <div className="flex-1">
 <h3 className="text-title text-gray-900 mb-1">{unit.name}</h3>
 <p className="text-body text-gray-600">{unit.programs}</p>
 <div className="mt-3 flex items-center gap-1 text-sm font-medium" style={{ color: unit.color }}>
 Learn More <ArrowRight className="w-4 h-4" />
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Quick Links */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Academic Resources</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Quick access to essential academic information and services
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {quickLinks.map((link, index) => (
 <motion.div
 key={link.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link 
 to={link.link}
 className="block h-full bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <link.icon className="w-8 h-8 text-[#A51C30] mb-4" />
 <h3 className="text-title text-gray-900 mb-1">{link.title}</h3>
 <p className="text-body text-gray-600">{link.desc}</p>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">
 Start Your <span className="text-[#A51C30]">Journey</span>
 </h2>
 <p className="text-lead text-white/80 mb-6">
 Join thousands of students pursuing excellence in healthcare education. 
 Explore our programs and apply to become part of the BMU community.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/academics/programs"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Explore Programs
 </Link>
 <Link 
 to="/apply"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
 >
 Apply Now
 </Link>
 </div>
 </div>

 <div className="bg-white/10 backdrop-blur-sm p-8">
 <h3 className="text-title text-white mb-6">Why Study at BMU?</h3>
 <div className="space-y-4">
 {[
 'Modern teaching hospitals and laboratories',
 'Experienced faculty with clinical expertise',
 'Strong industry partnerships',
 'Research opportunities from year one',
 'Student support and mentorship programs'
 ].map((item, index) => (
 <div key={index} className="flex items-start gap-3">
 <Award className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <p className="text-white/80">{item}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

