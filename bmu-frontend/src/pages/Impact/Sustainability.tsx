import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Leaf,
  Recycle,
  Sun,
  Droplets,
  Wind,
  TreePine,
  TrendingUp,
  Award,
  Users,
  Target,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImpactPrograms } from '../../services/apiHooks';

const carbonTargets = [
  { year: '2020', baseline: '100%', reduction: '0%' },
  { year: '2024', baseline: '60%', reduction: '40%' },
  { year: '2028', baseline: '35%', reduction: '65%' },
  { year: '2035', baseline: '15%', reduction: '85%' },
  { year: '2040', baseline: '0%', reduction: '100%' }
];

const researchAreas = [
  'Climate change health impacts in the Niger Delta',
  'Renewable energy solutions for healthcare facilities',
  'Environmental health monitoring systems',
  'Sustainable agriculture and nutrition',
  'Waste-to-energy technologies',
  'Coastal ecosystem preservation'
];

const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  trees_planted: TreePine,
  waste_recycled_kg: Recycle,
  energy_saved_kwh: Sun,
  participants: Users,
};

const statLabels: Record<string, string> = {
  trees_planted: 'Trees Planted',
  waste_recycled_kg: 'Waste Recycled (kg)',
  energy_saved_kwh: 'Energy Saved (kWh)',
  participants: 'Participants',
};

export const Sustainability = () => {
  const { data: programs, isLoading } = useImpactPrograms('environment');
  const program = programs?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#A51C30]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sustainability - Bayelsa Medical University</title>
        <meta name="description" content="BMU's sustainability initiatives including renewable energy, water conservation, waste management, and carbon neutrality roadmap." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#A51C30' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/impact" className="hover:text-white transition">Impact</Link>
              <span>/</span>
              <span className="text-white font-medium">Sustainability</span>
            </div>
            <h1 className="text-display text-white mb-6">
              {program?.title ?? 'Sustainable'} <span className="text-white">Future</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {program?.subtitle ?? 'Committed to carbon neutrality by 2040 through renewable energy, conservation, and innovative green initiatives across our campuses.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {program?.stats && Object.entries(program.stats).map(([key, value], index) => {
              const Icon = statIcons[key] ?? Leaf;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
                  <div className="text-stat text-[#1E1E1E] mb-1">{value.toLocaleString()}</div>
                  <p className="text-gray-600 text-body">{statLabels[key] ?? key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Carbon Neutrality Roadmap */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Carbon Neutrality Roadmap</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Our ambitious plan to achieve net-zero carbon emissions by 2040
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#A51C30]/30 hidden lg:block" />

            <div className="space-y-12">
              {carbonTargets.map((target, index) => (
                <motion.div
                  key={target.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white p-6 shadow-sm border border-gray-100 inline-block">
                      <div className="text-stat-sm text-[#1E1E1E]">{target.year}</div>
                      <p className="text-gray-600">{target.reduction} reduction target</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#A51C30] flex items-center justify-center flex-shrink-0 z-10">
                    <Target className="w-6 h-6 text-[#1E1E1E]" />
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {program?.description && (
        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-headline text-gray-900 mb-6">About This Initiative</h2>
              <p className="text-body text-gray-600 leading-relaxed">{program.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Objectives */}
      {program?.objectives && program.objectives.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-headline text-gray-900 mb-4">Objectives</h2>
              <p className="text-lead text-gray-600 max-w-2xl mx-auto">
                Our key goals for environmental sustainability
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {program.objectives.map((obj, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white shadow-sm border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-[#A51C30]/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#A51C30]" />
                    </div>
                    <span className="text-body text-gray-700 pt-2">{obj}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Research & Achievements */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-headline text-gray-900 mb-6">Sustainability Research</h2>
              <p className="text-body text-gray-600 mb-8">
                Our research programs focus on environmental health, climate adaptation, and sustainable development in the Niger Delta region.
              </p>
              <ul className="space-y-3">
                {researchAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
                    <span className="text-body text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-headline text-gray-900 mb-6">Achievements & Recognition</h2>
              <div className="space-y-4">
                {program?.achievements && program.achievements.length > 0 ? (
                  program.achievements.map((achievement, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white shadow-sm border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-[#A51C30]/20 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-[#A51C30]" />
                      </div>
                      <p className="text-body text-gray-700">{achievement}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-body text-gray-500">No achievements listed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      {program?.partners && program.partners.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-headline text-gray-900 mb-4">Our Partners</h2>
              <p className="text-lead text-gray-600 max-w-2xl mx-auto">
                Collaborating with leading organizations to drive environmental change
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {program.partners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 shadow-sm border border-gray-100 text-center"
                >
                  <div className="w-14 h-14 bg-[#A51C30]/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#A51C30]" />
                  </div>
                  <p className="text-body text-gray-700 font-medium">{partner}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Get Involved CTA */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom text-center">
          <h2 className="text-headline text-white mb-4">Join Our Green Mission</h2>
          <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
            Partner with us in building a sustainable future. Whether through research collaboration, green initiatives, or student programs, every contribution counts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
            >
              Partner With Us
            </Link>
            <Link 
              to="/research/funding"
              className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
            >
              Research Grants
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
