import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ArrowRight,
  Building2,
  Microscope,
  HeartHandshake,
  Cpu,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { useUniversityProjects } from '../../services/apiHooks';

const categoryMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  infrastructure: { label: 'Infrastructure', icon: Building2, color: 'var(--color-ink-900)' },
  research: { label: 'Research', icon: Microscope, color: 'var(--color-primary-600)' },
  community: { label: 'Community & Outreach', icon: HeartHandshake, color: 'var(--color-primary-600)' },
  technology: { label: 'Technology & Digital', icon: Cpu, color: 'var(--color-ink-900)' },
  academic: { label: 'Academic & Student', icon: GraduationCap, color: 'var(--color-primary-600)' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ongoing: { label: 'Ongoing', color: '#2563EB' },
  completed: { label: 'Completed', color: '#16A34A' },
  proposed: { label: 'Proposed', color: '#F59E0B' },
};

export const UniversityProjects = () => {
  const { data: projects = [], isLoading } = useUniversityProjects();

  const featured = projects.filter(p => p.is_featured);
  const categories = [...new Set(projects.map(p => p.category))];
  const ongoingCount = projects.filter(p => p.status === 'ongoing').length;

  const stats = [
    { value: String(projects.length), label: 'Flagship Projects', icon: Briefcase },
    { value: String(ongoingCount), label: 'Currently Ongoing', icon: Cpu },
    { value: String(categories.length), label: 'Impact Areas', icon: Building2 },
    { value: '8', label: 'Communities Reached', icon: HeartHandshake },
  ];

  return (
    <>
      <Helmet>
        <title>University Projects | Bayelsa Medical University</title>
        <meta name="description" content="Explore the flagship projects of Bayelsa Medical University — infrastructure, research, technology and community initiatives shaping healthcare in the Niger Delta." />
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
              <span className="text-white font-medium">University Projects</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-primary-600" />
              <span className="text-small font-semibold text-primary-600 uppercase tracking-wide">Building a Legacy</span>
            </div>
            <h1 className="text-display text-white mb-6">
              University <span className="text-primary-600">Projects</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              From state-of-the-art teaching hospitals and smart campuses to community outreach and
              breakthrough research — explore the projects BMU is delivering to transform healthcare
              education and the lives of people in the Niger Delta.
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

      {/* Featured projects */}
      {featured.length > 0 && !isLoading && (
        <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-headline text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-lead text-gray-600 max-w-2xl mx-auto">
                Signature initiatives defining the university's growth and impact
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.slice(0, 2).map((project, index) => {
                const meta = categoryMeta[project.category] || { label: project.category, icon: Briefcase, color: 'var(--color-ink-900)' };
                const MetaIcon = meta.icon;
                const status = statusConfig[project.status] || statusConfig.ongoing;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/research/university-projects/${project.id}`}
                      className="block h-full bg-white shadow-sm border border-gray-100 overflow-hidden group transition-shadow hover:shadow-md"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
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
                        <h3 className="text-title text-gray-900 mb-2">{project.title}</h3>
                        {project.subtitle && <p className="text-sm text-gray-500 mb-3">{project.subtitle}</p>}
                        <p className="text-body text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{project.year ? `Since ${project.year}` : project.lead_unit}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition group-hover:gap-2">
                            View Project <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All projects */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">All Projects</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Discover the full portfolio of projects undertaken by the university
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500">No university projects found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const meta = categoryMeta[project.category] || { label: project.category, icon: Briefcase, color: 'var(--color-ink-900)' };
                const MetaIcon = meta.icon;
                const status = statusConfig[project.status] || statusConfig.ongoing;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1 }}
                  >
                    <Link
                      to={`/research/university-projects/${project.id}`}
                      className="block h-full bg-white shadow-sm border border-gray-100 overflow-hidden group transition-shadow hover:shadow-md"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
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
                        <h3 className="text-title text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-body text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{project.year ? `Since ${project.year}` : project.lead_unit}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition group-hover:gap-2">
                            View Project <ArrowRight className="w-4 h-4" />
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
    </>
  );
};