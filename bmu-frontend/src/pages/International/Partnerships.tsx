import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Globe,
  Building,
  Microscope,
  GraduationCap,
  ArrowRight,
  Mail,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInternationalPartners, usePageSections } from '../../services/apiHooks';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Microscope, Building, Globe,
};

const fallbackPartnershipTypes = [
  {
    title: 'Academic Exchange',
    description: 'Student and faculty exchange programs, joint degree programs, and study abroad opportunities.',
    icon: 'GraduationCap',
    benefits: ['Student mobility', 'Faculty sabbaticals', 'Joint degrees', 'Credit transfer']
  },
  {
    title: 'Research Collaboration',
    description: 'Joint research projects, shared laboratories, and collaborative funding applications.',
    icon: 'Microscope',
    benefits: ['Joint publications', 'Shared facilities', 'Grant partnerships', 'Knowledge transfer']
  },
  {
    title: 'Institutional Partnerships',
    description: 'Strategic alliances with universities, hospitals, and healthcare organizations worldwide.',
    icon: 'Building',
    benefits: ['MOU agreements', 'Visiting scholars', 'Dual appointments', 'Resource sharing']
  }
];

const fallbackPartnershipBenefits = [
  'Access to international research networks',
  'Student exchange opportunities',
  'Joint degree program development',
  'Shared resources and facilities',
  'International faculty development',
  'Global health impact initiatives'
];

export const Partnerships = () => {
  const { data: partners } = useInternationalPartners();
  const { data: sections = [] } = usePageSections('partnerships');

  const getSection = (key: string) => sections.find(s => s.section_key === key);
  const typesData = getSection('partnership_types')?.data;
  const partnershipTypes = Array.isArray(typesData) && typesData.length ? typesData : fallbackPartnershipTypes;
  const benefitsData = getSection('partnership_benefits')?.data;
  const partnershipBenefits = Array.isArray(benefitsData) && benefitsData.length ? benefitsData : fallbackPartnershipBenefits;

  return (
  <>
  <Helmet>
  <title>Global Partnerships | Bayelsa Medical University</title>
  <meta name="description" content="BMU's strategic partnerships with leading universities and institutions worldwide for research, education, and academic exchange." />
  </Helmet>

  {/* Hero */}
  <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
  <div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  }} />
  
 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/international" className="hover:text-white transition">International</Link>
 <span>/</span>
 <span className="text-white font-medium">Partnerships</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Global <span className="text-[#A51C30]">Partnerships</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Strategic collaborations with leading universities and healthcare institutions worldwide 
 to advance medical education, research, and global health initiatives.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Partnership Types */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Partnership Opportunities</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Explore the various ways we collaborate with international institutions
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {partnershipTypes.map((type, index) => (
 <motion.div
 key={type.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-8 shadow-sm border border-gray-100"
 >
  <div className="w-16 h-16 bg-[#1E1E1E]/10 flex items-center justify-center mb-6">
  {(() => { const Icon = iconMap[type.icon] || GraduationCap; return <Icon className="w-8 h-8 text-[#1E1E1E]" />; })()}
  </div>
 <h3 className="text-title text-gray-900 mb-3">{type.title}</h3>
 <p className="text-body text-gray-600 mb-6">{type.description}</p>
 <div className="space-y-2">
 <p className="text-small font-semibold text-gray-700">Key Benefits:</p>
 <ul className="space-y-1">
  {type.benefits.map((benefit: string, idx: number) => (
 <li key={idx} className="flex items-center gap-2 text-body text-gray-600">
 <div className="w-1.5 h-1.5 bg-[#A51C30]" />
 <span>{benefit}</span>
 </li>
 ))}
 </ul>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Featured Partners */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Featured Partners</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Leading institutions we collaborate with around the world
 </p>
 </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {(partners ?? []).map((partner, index) => (
  <motion.div
  key={partner.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="bg-white p-6 shadow-sm border border-gray-100"
  >
  <div className="flex items-start gap-4">
  <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
  <Globe className="w-6 h-6 text-[#A51C30]" />
  </div>
  <div className="flex-1">
  <h3 className="text-title text-gray-900">{partner.name}</h3>
  <p className="text-small text-[#A51C30]">{partner.country}</p>
  <div className="mt-3 space-y-1">
  <p className="text-small text-gray-600"><span className="font-medium">Type:</span> {partner.partner_type_display}</p>
  <p className="text-small text-gray-600"><span className="font-medium">Focus:</span> {partner.focus_areas?.join(', ') || 'N/A'}</p>
  </div>
  </div>
  </div>
  </motion.div>
  ))}
  </div>
 </div>
 </section>

 {/* Benefits */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-gray-900 mb-6">Why Partner With BMU?</h2>
 <p className="text-body text-gray-600 mb-8">
 Join our network of international collaborators and benefit from shared expertise, 
 resources, and opportunities in healthcare education and research.
 </p>
 <ul className="space-y-4">
 {partnershipBenefits.map((benefit, idx) => (
 <motion.li
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="flex items-center gap-3"
 >
 <div className="w-8 h-8 bg-[#A51C30]/20 flex items-center justify-center flex-shrink-0">
 <span className="text-sm font-bold text-[#A51C30]">{idx + 1}</span>
 </div>
 <span className="text-body text-gray-700">{benefit}</span>
 </motion.li>
 ))}
 </ul>
 </div>

 <div className="bg-white p-8 shadow-sm border border-gray-100">
 <h3 className="text-title text-gray-900 mb-6">Become a Partner</h3>
 <p className="text-body text-gray-600 mb-6">
 Interested in establishing a partnership with Bayelsa Medical University? 
 Contact our International Office to discuss collaboration opportunities.
 </p>
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <Mail className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">international@bmu.edu.ng</span>
 </div>
 <div className="flex items-center gap-3">
 <Phone className="w-5 h-5 text-[#A51C30]" />
 <span className="text-body text-gray-700">+234 803 111 0020</span>
 </div>
 </div>
 <Link 
 to="/contact"
 className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
 >
 Contact Us <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="container-custom text-center">
 <h2 className="text-headline text-white mb-4">Explore Exchange Programs</h2>
 <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
 Discover opportunities for student and faculty exchange with our partner institutions worldwide.
 </p>
 <Link 
 to="/international/exchange"
 className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 View Exchange Programs <ArrowRight className="w-5 h-5" />
 </Link>
 </div>
 </section>
 </>
 );
};
