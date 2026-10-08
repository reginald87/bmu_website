import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Microscope,
  Heart,
  Baby,
  Activity,
  Brain,
  Leaf,
  Users,
  Award,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResearchCenters } from '../../services/apiHooks';
import type { ResearchCenter } from '../../services/mockData';

const iconMap: Record<string, React.ElementType> = {
  malaria: Microscope,
  'non-communicable': Heart,
  maternal: Baby,
  infectious: Activity,
  neuroscience: Brain,
  neuro: Brain,
  environmental: Leaf,
  environment: Leaf,
};

const colors = ['var(--color-ink-900)', 'var(--color-primary-600)'];

function getCenterIcon(center: ResearchCenter): React.ElementType {
  const slug = center.slug.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (slug.includes(key)) return icon;
  }
  return Microscope;
}

export const ResearchCenters = () => {
  const { data: centers, isLoading } = useResearchCenters();

  const totalActiveStudies = centers?.reduce((sum, c) => sum + (c.ongoing_projects_count || 0), 0) ?? 0;
  const totalPublications = centers?.reduce((sum, c) => sum + (c.total_publications || 0), 0) ?? 0;
  const centerCount = centers?.length ?? 0;

  return (
    <>
      <Helmet>
        <title>Research Centers | Bayelsa Medical University</title>
        <meta name="description" content="Explore BMU's specialized research centers focusing on malaria, non-communicable diseases, maternal health, infectious diseases, and environmental health in the Niger Delta." />
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
              <span className="text-white font-medium">Research Centers</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Research <span className="text-primary-600">Centers</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              World-class research facilities addressing the health challenges of the
              Niger Delta region and contributing to global medical knowledge.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Centers Grid */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : !centers || centers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No research centers found.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {centers.map((center, index) => {
              const Icon = getCenterIcon(center);
              const color = colors[index % colors.length];
              const focusAreas = center.research_areas?.split(',').map(s => s.trim()).filter(Boolean) ?? [];

              return (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-16 h-16 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-8 h-8" style={{ color }} />
                    </div>
                    <div>
                      <h3 className="text-title text-gray-900 mb-1">{center.name}</h3>
                      {center.code && (
                        <p className="text-small text-gray-500">{center.code}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-body text-gray-600 mb-6">{center.description}</p>

                  {focusAreas.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-small font-semibold text-gray-900 mb-3">Research Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm"
                          style={{
                            backgroundColor: `${color}15`,
                            color
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-stat-sm" style={{ color }}>{center.ongoing_projects_count}</div>
                        <p className="text-xs text-gray-500">Active Studies</p>
                      </div>
                      <div className="text-center">
                        <div className="text-stat-sm" style={{ color }}>{center.total_publications}</div>
                        <p className="text-xs text-gray-500">Publications</p>
                      </div>
                      <div className="text-center">
                        <div className="text-stat-sm" style={{ color }}>{center.completed_projects_count}</div>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                    <Link
                      to={`/research/centers/${center.slug}`}
                      className="inline-flex items-center gap-2 font-medium transition-colors hover:gap-3"
                      style={{ color }}
                    >
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: String(centerCount), label: 'Research Centers' },
              { value: String(totalActiveStudies), label: 'Active Studies' },
              { value: `${totalPublications}+`, label: 'Publications' },
              { value: '25', label: 'Research Partners' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-stat text-ink-900 mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities CTA */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-primary-600)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-headline text-white mb-4">
                Research <span className="text-primary-600">Facilities</span>
              </h2>
              <p className="text-lead text-white/90 mb-6">
                Our research centers are equipped with state-of-the-art laboratories,
                clinical research units, and data analysis centers to support cutting-edge research.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/research/faculty"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold hover:bg-primary-600 transition"
                >
                  <Users className="w-5 h-5" />
                  Meet Our Researchers
                </Link>
                <Link
                  to="/research/funding"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-primary-600 transition"
                >
                  <Award className="w-5 h-5" />
                  Research Grants
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                'PCR Laboratory',
                'Clinical Trial Unit',
                'Biosafety Level 3 Lab',
                'Data Analytics Center',
                'Specimen Repository',
                'Field Research Stations'
              ].map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm p-4 text-center"
                >
                  <Microscope className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-white text-body">{facility}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
