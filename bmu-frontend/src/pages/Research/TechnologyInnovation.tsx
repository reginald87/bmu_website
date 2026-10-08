import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  ArrowRight,
  Cpu,
  Microscope,
  Stethoscope,
  HeartHandshake,
  Brain,
  Video,
  Loader2,
} from 'lucide-react';
import { useInnovationPrograms } from '../../services/apiHooks';

const typeMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  digital_health: { label: 'Digital Health', icon: Stethoscope, color: 'var(--color-primary-600)' },
  medical_devices: { label: 'Medical Devices', icon: Cpu, color: 'var(--color-ink-900)' },
  biotech: { label: 'Biotech & Genomics', icon: Microscope, color: 'var(--color-ink-900)' },
  ai_ml: { label: 'AI & Machine Learning', icon: Brain, color: 'var(--color-primary-600)' },
  telemedicine: { label: 'Telemedicine', icon: Video, color: 'var(--color-primary-600)' },
  health_entrepreneurship: { label: 'Health Entrepreneurship', icon: HeartHandshake, color: 'var(--color-ink-900)' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ongoing: { label: 'Ongoing', color: '#2563EB' },
  completed: { label: 'Completed', color: '#16A34A' },
  proposed: { label: 'Proposed', color: '#F59E0B' },
};

export const TechnologyInnovation = () => {
  const { data: programs = [], isLoading } = useInnovationPrograms();

  const featured = programs.find(p => p.is_featured) || programs[0];
  const totalProjects = programs.reduce((sum, p) => {
    const val = parseInt((p.stat_1_value || '').replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const stats = [
    { value: String(programs.length), label: 'Active Programmes', icon: Lightbulb },
    { value: `${totalProjects || '30+'}`, label: 'Projects & Pilots', icon: Cpu },
    { value: '2,500+', label: 'Users & Beneficiaries', icon: HeartHandshake },
    { value: '12', label: 'Industry Partners', icon: Microscope },
  ];

  return (
    <>
      <Helmet>
        <title>Technology & Innovation | Bayelsa Medical University</title>
        <meta name="description" content="Explore BMU's technology and innovation programmes — digital health, medical devices, biotech, AI and health entrepreneurship transforming healthcare delivery." />
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
              <span className="text-white font-medium">Technology & Innovation</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-primary-600" />
              <span className="text-small font-semibold text-primary-600 uppercase tracking-wide">Innovation-Driven ASPIRE Agenda</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Technology & <span className="text-primary-600">Innovation</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Where healthcare meets technology. BMU is transforming medical education, research and
              patient care through cutting-edge innovation programmes — from AI diagnostics and
              telemedicine to medical device prototyping and health-tech entrepreneurship.
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
                key={stat.label}
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

      {/* Programs grid */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Technological Innovation Programmes</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Discover the innovation programmes driving the future of healthcare in the Niger Delta
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : programs.length === 0 ? (
            <p className="text-center text-gray-500">No innovation programmes found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => {
                const meta = typeMeta[program.program_type] || { label: program.program_type, icon: Lightbulb, color: 'var(--color-ink-900)' };
                const MetaIcon = meta.icon;
                const status = statusConfig[program.status] || statusConfig.ongoing;
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1 }}
                  >
                    <Link
                      to={`/research/innovation/${program.id}`}
                      className="block h-full bg-white shadow-sm border border-gray-100 overflow-hidden group transition-shadow hover:shadow-md"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {program.cover_image ? (
                          <img
                            src={program.cover_image}
                            alt={program.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-ink-900">
                            <MetaIcon className="w-12 h-12 text-white/60" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: meta.color }}>
                            <MetaIcon size={14} />
                            {meta.label}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: status.color, color: '#fff' }}>
                          {status.label}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-title text-gray-900 mb-2">{program.title}</h3>
                        <p className="text-body text-gray-600 mb-4 line-clamp-3">{program.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{program.year ? `Since ${program.year}` : program.lead_unit}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition group-hover:gap-2">
                            Learn more <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured programme */}
      {featured && !isLoading && (
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative overflow-hidden">
                {featured.cover_image ? (
                  <img src={featured.cover_image} alt={featured.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center bg-ink-900">
                    <Lightbulb className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary-600" />
                  <span className="text-small font-semibold text-primary-600 uppercase tracking-wide">Featured Programme</span>
                </div>
                <h2 className="text-headline text-gray-900 mb-4">{featured.title}</h2>
                <p className="text-body text-gray-600 mb-4">{featured.subtitle}</p>
                <p className="text-body text-gray-600 mb-8">{featured.description}</p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[featured.stat_1_value, featured.stat_2_value, featured.stat_3_value].map((val, i) => (
                    <div key={i} className="p-4 border border-gray-200 text-center">
                      <div className="text-stat text-primary-600">{val || '—'}</div>
                      <p className="text-xs text-gray-500 mt-1">
                        {[featured.stat_1_label, featured.stat_2_label, featured.stat_3_label][i]}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/research/innovation/${featured.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white font-semibold hover:bg-ink-900/90 transition"
                >
                  Explore This Programme <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-6 h-6 text-primary-600" />
                <span className="text-small font-semibold text-primary-600 uppercase tracking-wide">Get Involved</span>
              </div>
              <h2 className="text-headline text-white mb-4">
                Partner with BMU on <span className="text-primary-600">Innovation</span>
              </h2>
              <p className="text-lead text-white/80 mb-6">
                Whether you're a student innovator, a technology company, or a development partner,
                there are many ways to collaborate with our innovation ecosystem.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to="/research/innovation"
                className="px-8 py-4 bg-primary-600 text-ink-900 font-bold hover:bg-white transition"
              >
                Explore Programmes
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-ink-900 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};