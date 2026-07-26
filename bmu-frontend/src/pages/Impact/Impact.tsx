import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
 Globe, 
 Users, 
 Leaf, 
 Heart, 
 Target,
 ArrowRight,
 TrendingUp,
 GraduationCap,
 HeartPulse,
 TreePine,
 Building
} from 'lucide-react';
import { usePageSections } from '../../services/apiHooks';

const fallbackImpactAreas = [
 {
 title: 'SDG Alignment',
 description: 'BMU actively contributes to 12 of the 17 UN Sustainable Development Goals through research, education, and community engagement.',
 icon: Globe,
 link: '/impact/sdg-dashboard',
 color: '#1E1E1E',
 stat: '12/17 SDGs',
 image: '/images/impact/sdgs.jpg'
 },
 {
 title: 'Community Health',
 description: 'Free medical camps, health screenings, and wellness programs serving over 50,000 community members annually.',
 icon: HeartPulse,
 link: '/impact/community',
 color: '#A51C30',
 stat: '50,000+ Served',
 image: '/images/impact/health.jpg'
 },
 {
 title: 'Environmental Sustainability',
 description: 'Green campus initiatives, waste management programs, and renewable energy projects reducing our carbon footprint.',
 icon: TreePine,
 link: '/impact/sustainability',
 color: '#A51C30',
 stat: '40% Carbon Reduction',
 image: '/images/impact/sustainability.jpg'
 }
];

const fallbackStats = [
 { value: '50,000+', label: 'Community Members Served', icon: Users },
 { value: '200+', label: 'Health Outreach Programs', icon: Heart },
 { value: '15,000+', label: 'Students Educated', icon: GraduationCap },
 { value: '12/17', label: 'UN SDGs Addressed', icon: Target }
];

const fallbackHighlights = [
 {
 title: 'Free Medical Outreach',
 description: 'Monthly health camps providing free consultations, medications, and surgeries to underserved communities.',
 impact: '12,000 patients treated annually'
 },
 {
 title: 'Scholarship Programs',
 description: 'Financial aid for students from low-income families, with over ₦500 million in scholarships awarded.',
 impact: '800+ students supported'
 },
 {
 title: 'Green Campus Initiative',
 description: 'Solar power installation, rainwater harvesting, and zero-waste programs across all campuses.',
 impact: '40% reduction in carbon emissions'
 },
 {
 title: 'Skills Training',
 description: 'Vocational training programs for youth and women in healthcare support services.',
 impact: '2,500 graduates employed'
 }
];

export const Impact = () => {
 const { data: sections } = usePageSections('impact');
 const impactAreas = (sections?.find(s => s.section_key === 'impact_areas')?.data as any[] || fallbackImpactAreas);
 const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);
 const highlights = (sections?.find(s => s.section_key === 'highlights')?.data as any[] || fallbackHighlights);

 return (
 <>
 <Helmet>
 <title>Our Impact | Bayelsa Medical University</title>
 <meta name="description" content="Discover how BMU is making a difference in healthcare, education, and community development across the Niger Delta and beyond." />
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
 <span className="text-white font-medium">Impact</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Our <span className="text-[#A51C30]">Impact</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Transforming lives through healthcare excellence, education, and sustainable community development in the Niger Delta.
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

 {/* Impact Areas */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Impact Areas</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Explore how we're making a difference across multiple dimensions
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {impactAreas.map((area, index) => (
 <motion.div
 key={area.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link 
 to={area.link}
 className="block bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow h-full"
 >
 <div className="h-48 bg-gray-200 relative">
 <div 
 className="absolute inset-0 flex items-center justify-center"
 style={{ backgroundColor: `${area.color}15` }}
 >
 <area.icon className="w-16 h-16" style={{ color: area.color }} />
 </div>
 </div>
 <div className="p-6">
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-title text-gray-900">{area.title}</h3>
 <span 
 className="px-3 py-1 text-xs font-medium"
 style={{ backgroundColor: `${area.color}15`, color: area.color }}
 >
 {area.stat}
 </span>
 </div>
 <p className="text-body text-gray-600 mb-4">{area.description}</p>
 <span 
 className="inline-flex items-center gap-1 text-sm font-medium"
 style={{ color: area.color }}
 >
 Learn More <ArrowRight className="w-4 h-4" />
 </span>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Highlights Grid */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Impact Highlights</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Key initiatives driving positive change in our communities
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {highlights.map((item, index) => (
 <motion.div
 key={item.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100"
 >
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 bg-[#A51C30]/20 flex items-center justify-center flex-shrink-0">
 <TrendingUp className="w-6 h-6 text-[#A51C30]" />
 </div>
 <div className="flex-1">
 <h3 className="text-title text-gray-900 mb-2">{item.title}</h3>
 <p className="text-body text-gray-600 mb-3">{item.description}</p>
 <p className="text-small font-semibold text-[#1E1E1E]">{item.impact}</p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom text-center">
 <h2 className="text-headline text-white mb-4">Partner With Us</h2>
 <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
 Join us in making a lasting impact. Partner with BMU on research, community programs, or sustainability initiatives.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <Link 
 to="/contact"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Contact Us
 </Link>
 <Link 
 to="/research/collaborations"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
 >
 Research Partnerships
 </Link>
 </div>
 </div>
 </section>
 </>
 );
};

