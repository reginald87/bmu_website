import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
 Globe, 
 Users, 
 BookOpen, 
 Plane,
 Building,
 MapPin,
 ArrowRight,
 Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

const fallbackQuickLinks = [
 {
 title: 'Global Partnerships',
 description: 'Strategic collaborations with universities and institutions worldwide for research and academic exchange.',
 icon: Handshake,
 link: '/international/partnerships',
 color: '#1E1E1E',
 stat: '45+ Partners'
 },
 {
 title: 'Student Exchange',
 description: 'Opportunities for BMU students to study abroad and for international students to experience education at BMU.',
 icon: Plane,
 link: '/international/exchange',
 color: '#A51C30',
 stat: '25+ Countries'
 },
 {
 title: 'International Students',
 description: 'Support services, admissions guidance, and resources for students from around the world.',
 icon: Users,
 link: '/international/students',
 color: '#A51C30',
 stat: '500+ Students'
 },
 {
 title: 'Visitors & Delegations',
 description: 'Hosting academic delegations, international scholars, and institutional visits.',
 icon: Building,
 link: '/international/visitors',
 color: '#1E1E1E',
 stat: '100+ Visits/Year'
 }
];

const fallbackPartnerCountries = [
 'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 
 'Netherlands', 'South Africa', 'Ghana', 'Kenya', 'India', 
 'China', 'Japan', 'Australia', 'Brazil', 'Egypt'
];

const fallbackStats = [
 { value: '45+', label: 'Partner Institutions', icon: Building },
 { value: '25+', label: 'Countries', icon: Globe },
 { value: '500+', label: 'International Students', icon: Users },
 { value: '120+', label: 'Exchange Students/Year', icon: Plane }
];

export const International = () => {
 const { data: sections } = usePageSections('international');
 const quickLinks = (sections?.find(s => s.section_key === 'quick_links')?.data as any[] || fallbackQuickLinks);
 const partnerCountries = (sections?.find(s => s.section_key === 'partner_countries')?.data as any[] || fallbackPartnerCountries);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);
 return (
 <>
 <Helmet>
 <title>International - Bayelsa Medical University</title>
 <meta name="description" content="Explore BMU's international partnerships, student exchange programs, and support for international students from around the world." />
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
 <span className="text-white font-medium">International</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Global <span className="text-[#A51C30]">Engagement</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Connecting Bayelsa Medical University to the world through strategic partnerships, 
 student exchanges, and international collaborations in healthcare education and research.
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
 <stat.icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Quick Links */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">International Opportunities</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Discover how BMU connects with the global academic community
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {quickLinks.map((item, index) => (
 <motion.div
 key={item.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link 
 to={item.link}
 className="block bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow"
 >
 <div className="p-8">
 <div className="flex items-start gap-4 mb-4">
 <div 
 className="w-16 h-16 flex items-center justify-center flex-shrink-0"
 style={{ backgroundColor: `${item.color}15` }}
 >
 <item.icon className="w-8 h-8" style={{ color: item.color }} />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <h3 className="text-title text-gray-900">{item.title}</h3>
 <span 
 className="px-3 py-1 text-xs font-medium"
 style={{ backgroundColor: `${item.color}15`, color: item.color }}
 >
 {item.stat}
 </span>
 </div>
 <p className="text-body text-gray-600">{item.description}</p>
 </div>
 </div>
 <div className="flex items-center gap-1 text-sm font-medium" style={{ color: item.color }}>
 Learn More <ArrowRight className="w-4 h-4" />
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Partner Countries */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Global Network</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Our partnerships span across 25+ countries on 5 continents
 </p>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
 {partnerCountries.map((country, index) => (
 <motion.div
 key={country}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.05 }}
 className="bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-2"
 >
 <MapPin className="w-4 h-4 text-[#A51C30]" />
 <span className="text-body text-gray-700">{country}</span>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom text-center">
 <h2 className="text-headline text-white mb-4">Connect With Us</h2>
 <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
 Whether you're a prospective international student, a partner institution, or planning a visit, 
 we're here to help you connect with BMU.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link 
 to="/international/students"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Apply as International Student
 </Link>
 <Link 
 to="/contact"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Contact International Office
 </Link>
 </div>
 </div>
 </section>
 </>
 );
};

