import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
 Building,
 Users,
 Calendar,
 MapPin,
 ArrowRight,
 CheckCircle,
 FileText,
 Globe,
 Phone,
 Mail,
 Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

const fallbackVisitorTypes = [
 {
 title: 'Academic Delegations',
 description: 'Official visits from university leadership, faculty, and administrative teams to explore partnership opportunities.',
 duration: '1-3 days',
 icon: Building
 },
 {
 title: 'Visiting Scholars',
 description: 'Individual faculty and researchers visiting for lectures, collaborative research, or sabbaticals.',
 duration: '1 week - 1 year',
 icon: Users
 },
 {
 title: 'Student Groups',
 description: 'Organized student visits from partner institutions for cultural exchange and educational tours.',
 duration: '1-2 weeks',
 icon: Globe
 },
 {
 title: 'Government Officials',
 description: 'Visits from ministry officials, education inspectors, and policymakers.',
 duration: '1-2 days',
 icon: Building
 }
];

const fallbackServices = [
 'Itinerary planning and logistics coordination',
 'Accommodation arrangements',
 'Campus tour and facility visits',
 'Meeting scheduling with relevant departments',
 'Cultural program arrangements',
 'Local transportation support',
 'Protocol and security arrangements',
 'Souvenir and documentation packages'
];

const fallbackRecentVisits = [
 {
 institution: 'Johns Hopkins Bloomberg School',
 country: 'USA',
 date: 'November 2024',
 purpose: 'Research Collaboration Discussion'
 },
 {
 institution: 'University of Cape Town',
 country: 'South Africa',
 date: 'October 2024',
 purpose: 'Student Exchange Agreement'
 },
 {
 institution: 'Kyushu University Delegation',
 country: 'Japan',
 date: 'September 2024',
 purpose: 'Academic Partnership'
 },
 {
 institution: 'WHO Nigeria Office',
 country: 'International',
 date: 'August 2024',
 purpose: 'Health Initiative Planning'
 }
];

const fallbackStats = [
 { value: '100+', label: 'Visits Per Year' },
 { value: '25+', label: 'Countries' },
 { value: '45', label: 'Partner Institutions' },
 { value: '30+', label: 'Visiting Scholars' }
];

export const Visitors = () => {
 const { data: sections } = usePageSections('international/visitors');
 const visitorTypes = (sections?.find(s => s.section_key === 'visitor_types')?.data as any[] || fallbackVisitorTypes);
 const services = (sections?.find(s => s.section_key === 'services')?.data as any[] || fallbackServices);
 const recentVisits = (sections?.find(s => s.section_key === 'recent_visits')?.data as any[] || fallbackRecentVisits);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);
 return (
 <>
 <Helmet>
 <title>Visitors & Delegations - Bayelsa Medical University</title>
 <meta name="description" content="Information for international visitors, academic delegations, and visiting scholars planning to visit Bayelsa Medical University." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/international" className="hover:text-white transition">International</Link>
 <span>/</span>
 <span className="text-white font-medium">Visitors & Delegations</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Visitors & <span className="text-[#A51C30]">Delegations</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Welcoming academic delegations, visiting scholars, and international partners to 
 Bayelsa Medical University for collaboration, exchange, and discovery.
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
 <Building className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Visitor Types */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Types of Visits</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 We welcome various types of visitors and tailor our services to meet your needs
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {visitorTypes.map((type, index) => (
 <motion.div
 key={type.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-8 shadow-sm border border-gray-100"
 >
 <div className="flex items-start gap-4">
 <div className="w-16 h-16 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
 <type.icon className="w-8 h-8 text-[#1E1E1E]" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
 <h3 className="text-title text-gray-900">{type.title}</h3>
 </div>
 <p className="text-body text-gray-600 mb-4">{type.description}</p>
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A51C30]/20 text-sm text-[#1E1E1E]">
 <Clock className="w-4 h-4" />
 {type.duration}
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Services */}
 <section className="py-20">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-gray-900 mb-6">Visitor Services</h2>
 <p className="text-body text-gray-600 mb-8">
 Our International Office provides comprehensive support to ensure your visit to BMU 
 is productive, comfortable, and memorable.
 </p>
 <ul className="space-y-4">
 {services.map((service, idx) => (
 <motion.li
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="flex items-start gap-3"
 >
 <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <span className="text-body text-gray-700">{service}</span>
 </motion.li>
 ))}
 </ul>
 </div>

 <div className="bg-white p-8 shadow-sm border border-gray-100">
 <h3 className="text-title text-gray-900 mb-6">Plan Your Visit</h3>
 <p className="text-body text-gray-600 mb-6">
 To arrange a visit, please contact us at least 4 weeks in advance with the following information:
 </p>
 <ul className="space-y-3 mb-8">
 <li className="flex items-center gap-3">
 <FileText className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">Institution/organization details</span>
 </li>
 <li className="flex items-center gap-3">
 <Users className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">Number of visitors</span>
 </li>
 <li className="flex items-center gap-3">
 <Calendar className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">Proposed dates</span>
 </li>
 <li className="flex items-center gap-3">
 <MapPin className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">Purpose of visit</span>
 </li>
 </ul>
 <Link 
 to="/contact"
 className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
 >
 Request a Visit <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* Recent Visits */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Recent Visits</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Some of our recent international visitors and delegations
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {recentVisits.map((visit, index) => (
 <motion.div
 key={visit.institution}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 flex items-start gap-4"
 >
 <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
 <Globe className="w-6 h-6 text-[#A51C30]" />
 </div>
 <div className="flex-1">
 <h3 className="text-title text-gray-900">{visit.institution}</h3>
 <div className="flex flex-wrap gap-3 mt-2 text-small text-gray-500">
 <span className="flex items-center gap-1">
 <MapPin className="w-3 h-3" /> {visit.country}
 </span>
 <span className="flex items-center gap-1">
 <Calendar className="w-3 h-3" /> {visit.date}
 </span>
 </div>
 <p className="text-small text-[#1E1E1E] mt-2">{visit.purpose}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Contact */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">Plan Your Visit Today</h2>
 <p className="text-lead text-white/80 mb-6">
 Whether you're planning an official delegation visit or an individual sabbatical, 
 our International Office is ready to assist you.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/contact"
 className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Contact Us <ArrowRight className="w-5 h-5" />
 </Link>
 <Link 
 to="/international/partnerships"
 className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Explore Partnerships
 </Link>
 </div>
 </div>
 <div className="bg-white/10 backdrop-blur p-8">
 <h3 className="text-title text-white mb-4">Protocol Office</h3>
 <div className="space-y-4">
 <div className="flex items-center gap-3 text-white/80">
 <Phone className="w-5 h-5" />
 <span>+234 803 111 0020</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <Mail className="w-5 h-5" />
 <span>protocol@bmu.edu.ng</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <MapPin className="w-5 h-5" />
 <span>Vice Chancellor's Office, BMU</span>
 </div>
 </div>
 <p className="text-white/60 text-sm mt-4">
 For official delegations and high-level visits, please contact our Protocol Office directly.
 </p>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};
