import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Handshake, 
  Building2, 
  GraduationCap, 
  Award,
  Users,
  Microscope,
  Plane
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInternationalPartners, usePageSections } from '../../services/apiHooks';

interface Partner {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  collaborations: string[];
  logo?: string;
}

const fallbackStats = [
 { value: '25+', label: 'Active Partnerships', icon: Handshake },
 { value: '12', label: 'Countries', icon: Globe },
 { value: '50+', label: 'Joint Projects', icon: Microscope },
 { value: '100+', label: 'Exchange Students', icon: Plane }
];

const fallbackBenefits = [
 { title: 'Research Collaboration', desc: 'Access to international research networks and joint grant applications', icon: Microscope },
 { title: 'Student Exchange', desc: 'Opportunities for students to study abroad and gain international exposure', icon: GraduationCap },
 { title: 'Faculty Development', desc: 'Training programs, sabbaticals, and collaborative teaching', icon: Users },
 { title: 'Resource Sharing', desc: 'Access to specialized equipment, databases, and facilities', icon: Building2 }
];

export const Collaborations = () => {
  const { data: partners = [] } = useInternationalPartners();
  const { data: sections } = usePageSections('research/collaborations');

  const fallbackWhyPartner = [
    'Access to the Niger Delta research context',
    'Collaboration with leading African medical university',
    'Student and faculty exchange opportunities',
    'Joint grant applications and funding',
    'Shared research infrastructure'
  ];

  const stats = (sections?.find(s => s.section_key === 'stats')?.data as typeof fallbackStats) || fallbackStats;
  const benefits = (sections?.find(s => s.section_key === 'benefits')?.data as typeof fallbackBenefits) || fallbackBenefits;
  const whyPartner = (sections?.find(s => s.section_key === 'why_partner')?.data as typeof fallbackWhyPartner) || fallbackWhyPartner;

  const internationalPartners: Partner[] = partners
    .filter(p => p.country !== 'Nigeria')
    .map(p => ({
      id: p.slug,
      name: p.name,
      location: p.city ? `${p.city}, ${p.country}` : p.country,
      type: p.partner_type_display,
      description: p.description,
      collaborations: p.focus_areas,
    }));

  const localPartners: Partner[] = partners
    .filter(p => p.country === 'Nigeria')
    .map(p => ({
      id: p.slug,
      name: p.name,
      location: p.city ? `${p.city}, ${p.country}` : p.country,
      type: p.partner_type_display,
      description: p.description,
      collaborations: p.focus_areas,
    }));

  return (
  <>
  <Helmet>
  <title>Research Collaborations | Bayelsa Medical University</title>
  <meta name="description" content="Explore BMU's partnerships with international institutions, UN agencies, teaching hospitals, and research organizations advancing healthcare in the Niger Delta." />
  </Helmet>

 {/* Hero */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <Link to="/research" className="hover:text-white transition">Research</Link>
 <span>/</span>
 <span className="text-white font-medium">Collaborations</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Research <span className="text-primary-600">Collaborations</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Building global partnerships to advance healthcare research, education, 
 and innovation in the Niger Delta region.
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
 <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
 <div className="text-stat text-ink-900 mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Benefits */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Partnership Benefits</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Our collaborations create opportunities for students, faculty, and researchers
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {benefits.map((benefit, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="w-14 h-14 bg-ink-900/10 flex items-center justify-center mb-4">
 <benefit.icon className="w-7 h-7 text-ink-900" />
 </div>
 <h3 className="text-title text-gray-900 mb-2">{benefit.title}</h3>
 <p className="text-body text-gray-600">{benefit.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* International Partners */}
 <section className="py-20">
 <div className="container-custom">
 <div className="flex items-center gap-3 mb-12">
 <Globe className="w-8 h-8 text-primary-600" />
 <h2 className="text-headline text-gray-900">International Partners</h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {internationalPartners.map((partner, index) => (
 <motion.div
 key={partner.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <span className="px-3 py-1 bg-ink-900/10 text-ink-900 text-xs font-medium">
 {partner.type}
 </span>
 <h3 className="text-title text-gray-900 mt-2">{partner.name}</h3>
 <p className="text-small text-gray-500">{partner.location}</p>
 </div>
 </div>

 <p className="text-body text-gray-600 mb-4">{partner.description}</p>

 <div>
 <h4 className="text-small font-semibold text-gray-900 mb-2">Key Collaborations</h4>
 <div className="flex flex-wrap gap-2">
 {partner.collaborations.map((collab, idx) => (
 <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm">
 {collab}
 </span>
 ))}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Local Partners */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="flex items-center gap-3 mb-12">
 <Building2 className="w-8 h-8 text-ink-900" />
 <h2 className="text-headline text-gray-900">Local & Regional Partners</h2>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {localPartners.map((partner, index) => (
 <motion.div
 key={partner.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex items-start justify-between mb-4">
 <div>
 <span className="px-3 py-1 bg-primary-600/10 text-primary-600 text-xs font-medium">
 {partner.type}
 </span>
 <h3 className="text-title text-gray-900 mt-2">{partner.name}</h3>
 <p className="text-small text-gray-500">{partner.location}</p>
 </div>
 </div>

 <p className="text-body text-gray-600 mb-4">{partner.description}</p>

 <div>
 <h4 className="text-small font-semibold text-gray-900 mb-2">Key Collaborations</h4>
 <div className="flex flex-wrap gap-2">
 {partner.collaborations.map((collab, idx) => (
 <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm">
 {collab}
 </span>
 ))}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: 'var(--color-primary-600)' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">
 Partner with <span className="text-primary-600">BMU</span>
 </h2>
 <p className="text-lead text-white/90 mb-6">
 We are always looking for new partnerships to expand our impact. 
 Whether you're an academic institution, research organization, or healthcare provider, 
 let's explore how we can work together.
 </p>
 <div className="flex flex-wrap gap-4">
 <a 
 href="mailto:research@bmu.edu.ng"
 className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold hover:bg-primary-600 transition"
 >
 <Handshake className="w-5 h-5" />
 Propose Collaboration
 </a>
 <Link 
 to="/research/funding"
 className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-primary-600 transition"
 >
 <Award className="w-5 h-5" />
 Research Grants
 </Link>
 </div>
 </div>

 <div className="bg-white/10 backdrop-blur-sm p-8">
 <h3 className="text-title text-white mb-6">Why Partner with BMU?</h3>
 <div className="space-y-4">
 {whyPartner.map((item, index) => (
 <div key={index} className="flex items-start gap-3">
 <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
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
