import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
 HeartPulse,
 Users,
 ArrowRight,
 Calendar,
 MapPin,
 Phone,
 Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImpactPrograms } from '../../services/apiHooks';

const upcomingCampaigns = [
 {
 title: 'Diabetes Screening Drive',
 date: 'February 1-15, 2025',
 location: 'Multiple Communities',
 description: 'Free blood sugar testing and diabetes education across 15 communities'
 },
 {
 title: 'Mental Health Awareness Week',
 date: 'March 10-16, 2025',
 location: 'BMU Campus & Communities',
 description: 'Workshops, counseling sessions, and community dialogues on mental wellness'
 },
 {
 title: 'Child Immunization Campaign',
 date: 'April 5-20, 2025',
 location: 'Rural Health Centers',
 description: 'Comprehensive vaccination program for children under 5 years'
 }
];

const partners = [
 'Bayelsa State Ministry of Health',
 'WHO Nigeria',
 'UNICEF',
 'National Primary Health Care Development Agency',
 'Local Government Health Departments'
];

const impactStats = [
 { value: '50,000+', label: 'Patients Served' },
 { value: '200+', label: 'Health Campaigns' },
 { value: '35', label: 'Partner Communities' },
 { value: '15', label: 'Health Programs' }
];

export const Health = () => {
  const { data: programs, isLoading } = useImpactPrograms('community_health');

  if (isLoading) {
   return (
    <section className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
     <Loader2 className="w-8 h-8 text-white animate-spin" />
    </section>
   );
  }

  return (
  <>
 <Helmet>
 <title>Health Initiatives - Bayelsa Medical University</title>
 <meta name="description" content="BMU's health initiatives including maternal health, mental health programs, chronic disease management, and infectious disease control in the Niger Delta." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/impact" className="hover:text-white transition">Impact</Link>
 <span>/</span>
 <span className="text-white font-medium">Health Initiatives</span>
 </div>
 <div className="flex items-center gap-4 mb-6">
 <div className="w-20 h-20 bg-white/20 flex items-center justify-center">
 <HeartPulse className="w-10 h-10 text-white" />
 </div>
 <div>
 <h1 className="text-display text-white">Health Initiatives</h1>
 </div>
 </div>
 <p className="text-lead text-white/80 max-w-2xl">
 Comprehensive health programs addressing critical healthcare needs in the Niger Delta through prevention, treatment, and community engagement.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {impactStats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <HeartPulse className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Health Programs */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Our Health Programs</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Targeted initiatives addressing the most pressing health challenges in our communities
 </p>
 </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {(programs ?? []).map((program, index) => (
  <motion.div
   key={program.id}
   initial={{ opacity: 0, y: 20 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true }}
   transition={{ delay: index * 0.1 }}
   className="bg-white p-8 shadow-sm border border-gray-100"
  >
   <div className="flex items-start gap-4 mb-6">
   <div className="w-16 h-16 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
    <HeartPulse className="w-8 h-8 text-[#1E1E1E]" />
   </div>
   <div className="flex-1">
    <h3 className="text-title text-gray-900 mb-2">{program.title}</h3>
    <p className="text-body text-gray-600">{program.subtitle || program.description}</p>
   </div>
   </div>

   <div className="flex items-center justify-between p-4 bg-gray-50 mb-6">
   {program.stats && Object.entries(program.stats).slice(0, 1).map(([label, value]) => (
    <div key={label}>
     <div className="text-stat-sm text-[#1E1E1E]">{value.toLocaleString()}+</div>
     <p className="text-xs text-gray-500">{label}</p>
    </div>
   ))}
   </div>

   <div>
   <p className="text-small font-semibold text-gray-700 mb-2">Objectives</p>
   <div className="flex flex-wrap gap-2">
    {(program.objectives ?? []).map((obj, idx) => (
    <span 
     key={idx}
     className="px-3 py-1 text-xs bg-[#A51C30]/20 text-[#1E1E1E] font-medium"
    >
     {obj}
    </span>
    ))}
   </div>
   </div>
  </motion.div>
  ))}
 </div>
 </div>
 </section>

 {/* Upcoming Campaigns */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Upcoming Health Campaigns</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Join us at our upcoming health awareness and screening events
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {upcomingCampaigns.map((campaign, index) => (
 <motion.div
 key={campaign.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100"
 >
 <div className="w-12 h-12 bg-[#A51C30]/20 flex items-center justify-center mb-4">
 <Calendar className="w-6 h-6 text-[#A51C30]" />
 </div>
 <h3 className="text-title text-gray-900 mb-2">{campaign.title}</h3>
 <p className="text-body text-gray-600 mb-4">{campaign.description}</p>
 <div className="space-y-2 text-small text-gray-500">
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4" />
 <span>{campaign.date}</span>
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="w-4 h-4" />
 <span>{campaign.location}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Partners */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Our Health Partners</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Collaborating with government agencies and international organizations
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {partners.map((partner, index) => (
 <motion.div
 key={partner}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-3"
 >
 <div className="w-10 h-10 bg-[#A51C30]/20 flex items-center justify-center flex-shrink-0">
 <Users className="w-5 h-5 text-[#A51C30]" />
 </div>
 <span className="text-body text-gray-700">{partner}</span>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Get Involved CTA */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">Support Our Health Mission</h2>
 <p className="text-lead text-white/80 mb-6">
 Partner with us to expand healthcare access. Whether through funding, medical supplies, or volunteer services, every contribution saves lives.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/contact"
 className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Partner With Us <ArrowRight className="w-5 h-5" />
 </Link>
 <Link 
 to="/impact/community"
 className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Volunteer Programs
 </Link>
 </div>
 </div>
 <div className="bg-white/10 backdrop-blur p-8">
 <h3 className="text-title text-white mb-4">Contact Health Initiatives</h3>
 <div className="space-y-4">
 <div className="flex items-center gap-3 text-white/80">
 <Phone className="w-5 h-5" />
 <span>+234 803 111 0010</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <MapPin className="w-5 h-5" />
 <span>BMU Community Health Center, Yenagoa</span>
 </div>
 <p className="text-white/60 text-sm mt-4">
 For inquiries about health programs, partnerships, or to request medical outreach in your community.
 </p>
 </div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};
