import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Microscope,
  BookOpen,
  Award,
  Users,
  ArrowRight,
  Globe,
  TrendingUp,
  Lightbulb,
  FlaskConical,
  Target,
  Heart,
  Baby,
  Leaf,
  Loader2
} from 'lucide-react';
import { useResearchCenters, useFaculty, useFundedProjects, usePageSections } from '../../services/apiHooks';

const areaIconMap: Record<string, React.ElementType> = {
  malaria: Microscope,
  'non-communicable': Heart,
  maternal: Baby,
  infectious: FlaskConical,
  neuroscience: TrendingUp,
  neuro: TrendingUp,
  environmental: Leaf,
  environment: Leaf,
  genomics: Microscope,
  health: Heart,
};

const fallbackHighlights = [
  {
    title: 'Research Centers',
    description: '6 specialized centers focusing on regional health challenges',
    icon: Target,
    link: '/research/centers'
  },
  {
    title: 'Publications',
    description: 'Peer-reviewed research in leading medical journals',
    icon: BookOpen,
    link: '/research/publications'
  },
  {
    title: 'Funding',
    description: 'Grants and partnerships supporting innovative research',
    icon: Award,
    link: '/research/funding'
  },
  {
    title: 'Collaborations',
    description: 'Global partnerships with leading institutions',
    icon: Globe,
    link: '/research/collaborations'
  }
];

export const Research = () => {
  const { data: centers, isLoading: centersLoading } = useResearchCenters();
  const { data: faculty } = useFaculty();
  const { data: fundedProjects } = useFundedProjects();
  const { data: sections } = usePageSections('research');

  const totalPublications = centers?.reduce((s, c) => s + (c.total_publications || 0), 0) ?? 0;
  const totalActiveStudies = centers?.reduce((s, c) => s + (c.ongoing_projects_count || 0), 0) ?? 0;
  const researcherCount = faculty?.length ?? 0;

  const totalFunding = fundedProjects?.reduce((s, p) => {
    const amt = p.amount || 0;
    return s + amt;
  }, 0) ?? 0;

  const fallbackImpactMetrics = [
    { metric: '1,500+', label: 'Citations in peer-reviewed journals', color: '#1E1E1E' },
    { metric: '45', label: 'H-Index score', color: '#A51C30' },
    { metric: '25', label: 'International research partners', color: '#A51C30' },
    { metric: `₦${(totalFunding / 1_000_000).toFixed(0)}M+`, label: 'Active research grants', color: '#1E1E1E' }
  ];

  const fallbackOpportunities = [
    'Postgraduate research programs',
    'Research assistant positions',
    'Collaborative research projects',
    'Visiting researcher program',
    'Industry research partnerships'
  ];

  const fallbackStats = [
    { value: `${totalPublications}+`, label: 'Publications', icon: BookOpen },
    { value: String(totalActiveStudies), label: 'Active Studies', icon: FlaskConical },
    { value: '25', label: 'Research Partners', icon: Globe },
    { value: String(researcherCount), label: 'Researchers', icon: Users }
  ];

  const items = (sections?.find(s => s.section_key === 'highlights')?.data as typeof fallbackHighlights) || fallbackHighlights;
  const impactMetrics = (sections?.find(s => s.section_key === 'impact_metrics')?.data as typeof fallbackImpactMetrics) || fallbackImpactMetrics;
  const opportunities = (sections?.find(s => s.section_key === 'opportunities')?.data as typeof fallbackOpportunities) || fallbackOpportunities;
  const stats = (sections?.find(s => s.section_key === 'stats')?.data as typeof fallbackStats) || fallbackStats;

  const researchAreas = (centers ?? []).map(c => {
    const slug = c.slug.toLowerCase();
    let Icon: React.ElementType = Microscope;
    for (const [key, icon] of Object.entries(areaIconMap)) {
      if (slug.includes(key)) { Icon = icon; break; }
    }
    return {
      name: c.name,
      description: c.description,
      icon: Icon,
      stats: `${c.total_publications}+ Publications`,
      link: `/research/centers/${c.slug}`
    };
  });

  const statsLoading = centersLoading;

  return (
    <>
      <Helmet>
        <title>Research | Bayelsa Medical University</title>
        <meta name="description" content="Explore research at BMU: malaria, NCDs, maternal health, environmental health. 200+ publications, 6 research centers, global collaborations." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Research</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Research <span className="text-[#A51C30]">Excellence</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Advancing medical knowledge through innovative research addressing the health
              challenges of the Niger Delta and contributing to global healthcare solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          {statsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#A51C30]" />
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Research Focus Areas</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Addressing critical health challenges through specialized research centers
            </p>
          </div>

          {centersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#A51C30]" />
            </div>
          ) : researchAreas.length === 0 ? (
            <p className="text-center text-gray-500">No research areas found.</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={area.link}
                  className="block bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
                      <area.icon className="w-7 h-7 text-[#1E1E1E]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-title text-gray-900">{area.name}</h3>
                        <span className="text-xs text-[#A51C30] font-medium">{area.stats}</span>
                      </div>
                      <p className="text-body text-gray-600 mb-3">{area.description}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#1E1E1E] hover:text-[#A51C30] transition">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Explore Research</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Discover our research infrastructure, publications, and partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.link}
                  className="block h-full bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
                >
                  <item.icon className="w-8 h-8 text-[#A51C30] mb-4" />
                  <h3 className="text-title text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-body text-gray-600">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-[#A51C30]" />
                <span className="text-small font-semibold text-[#A51C30] uppercase tracking-wide">Featured Research</span>
              </div>
              <h2 className="text-headline text-gray-900 mb-4">
                Artemisinin Resistance Surveillance Network
              </h2>
              <p className="text-body text-gray-600 mb-6">
                Our flagship malaria research project monitoring drug resistance patterns across
                the Niger Delta. This WHO-funded study has provided critical data informing
                national malaria treatment guidelines and contributing to global resistance mapping efforts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/research/publications"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"
                >
                  <BookOpen className="w-5 h-5" />
                  View Publications
                </Link>
                <Link
                  to="/research/centers"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1E1E1E] text-[#1E1E1E] font-semibold hover:bg-[#1E1E1E] hover:text-white transition"
                >
                  <Microscope className="w-5 h-5" />
                  Research Centers
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h3 className="text-title text-gray-900 mb-6">Research Impact</h3>
              <div className="space-y-6">
                {impactMetrics.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <span className="text-stat-sm font-bold" style={{ color: item.color }}>{item.metric}</span>
                    </div>
                    <p className="text-body text-gray-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-[#A51C30]" />
                <span className="text-small font-semibold text-[#A51C30] uppercase tracking-wide">Get Involved</span>
              </div>
              <h2 className="text-headline text-white mb-4">
                Join Our Research <span className="text-[#A51C30]">Community</span>
              </h2>
              <p className="text-lead text-white/80 mb-6">
                Whether you're a student, researcher, or industry partner, there are many ways
                to contribute to our mission of advancing healthcare through research.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/research/funding"
                  className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
                >
                  Research Grants
                </Link>
                <Link
                  to="/research/faculty"
                  className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
                >
                  Meet Researchers
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8">
              <h3 className="text-title text-white mb-6">Research Opportunities</h3>
              <div className="space-y-4">
                {opportunities.map((item, index) => (
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
