import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle, Star, TrendingUp, Globe, BookOpen, Users, type LucideIcon } from 'lucide-react';
import { useUniversityRankings, useKeyMetrics } from '../../services/apiHooks';

interface Ranking {
  category: string;
  rank: string;
  year: string;
  source: string;
}

interface Accreditation {
  body: string;
  fullName: string;
  status: string;
  year: string;
  programs: string[];
}

const fallbackRankings: Ranking[] = [
  { category: 'Best Medical University in Nigeria', rank: 'Top 5', year: '2024', source: 'Nigerian Universities Ranking' },
  { category: 'Research Output in Health Sciences', rank: 'Top 10', year: '2024', source: 'Scimago Institutions Rankings' },
  { category: 'Community Impact Index', rank: '#1', year: '2024', source: 'Nigerian Education Innovation Hub' },
  { category: 'Student Satisfaction', rank: '4.5/5', year: '2024', source: 'National Student Survey' },
];

const fallbackAccreditations: Accreditation[] = [
  {
    body: 'NUC',
    fullName: 'National Universities Commission',
    status: 'Full Accreditation',
    year: '2020 - Present',
    programs: ['All Undergraduate Programs', 'All Postgraduate Programs'],
  },
  {
    body: 'MDCN',
    fullName: 'Medical & Dental Council of Nigeria',
    status: 'Full Accreditation',
    year: '2019 - Present',
    programs: ['MBBS (Medicine & Surgery)'],
  },
  {
    body: 'NMCN',
    fullName: 'Nursing & Midwifery Council of Nigeria',
    status: 'Full Accreditation',
    year: '2019 - Present',
    programs: ['B.NSc Nursing Science', 'Post-Basic Nursing'],
  },
  {
    body: 'MLSCN',
    fullName: 'Medical Laboratory Science Council of Nigeria',
    status: 'Full Accreditation',
    year: '2020 - Present',
    programs: ['BMLS Medical Laboratory Science'],
  },
  {
    body: 'PCN',
    fullName: 'Pharmacy Council of Nigeria',
    status: 'Provisional Accreditation',
    year: '2023 - Present',
    programs: ['Doctor of Pharmacy (Pharm.D)'],
  },
];

const fallbackAchievements = [
  { year: '2024', title: 'WHO Grant Recipient', description: 'Received $500,000 grant for malaria research in the Niger Delta' },
  { year: '2024', title: 'Best Teaching Hospital Partnership', description: 'Awarded by the Association of Medical Schools in Africa' },
  { year: '2023', title: 'Innovation in Medical Education', description: 'Recognized for pioneering simulation-based learning' },
  { year: '2023', title: 'Community Health Champion', description: 'Award for free medical outreach programs reaching 10,000+ residents' },
  { year: '2022', title: 'Research Excellence Award', description: 'Highest number of publications per faculty in Nigerian medical schools' },
  { year: '2021', title: 'SDG Champion Institution', description: 'Recognized for contributions to SDG 3 (Good Health & Well-being)' },
];

const iconMap: Record<string, LucideIcon> = {
  BookOpen, TrendingUp, Star, Globe, Users, CheckCircle, Award, Shield,
};

const fallbackKeyMetrics = [
  { label: 'Research Publications', value: '1,247+', icon: BookOpen },
  { label: 'Citations', value: '8,500+', icon: TrendingUp },
  { label: 'h-Index', value: '28', icon: Star },
  { label: 'International Partnerships', value: '15+', icon: Globe },
  { label: 'Faculty with PhD', value: '78%', icon: Users },
  { label: 'Licensure Exam Pass Rate', value: '94%', icon: CheckCircle },
];

export const Rankings = () => {
  const { data: apiData, isLoading } = useUniversityRankings();
  const { data: apiMetrics, isLoading: metricsLoading } = useKeyMetrics();

  const keyMetrics = !metricsLoading && apiMetrics && apiMetrics.length > 0
    ? apiMetrics.map(m => ({
        label: m.label,
        value: m.value,
        icon: iconMap[m.icon_name] || Star,
      }))
    : fallbackKeyMetrics;

  const rankings: Ranking[] = !isLoading && apiData
    ? apiData.filter(r => r.entry_type === 'ranking').map(r => ({
        category: r.title,
        rank: r.rank,
        year: r.year,
        source: r.source,
      }))
    : fallbackRankings;

  const accreditations: Accreditation[] = !isLoading && apiData
    ? apiData.filter(r => r.entry_type === 'accreditation').map(r => ({
        body: r.accrediting_body,
        fullName: r.body_full_name,
        status: r.status,
        year: r.validity,
        programs: r.accredited_programs ? r.accredited_programs.split(',').map(p => p.trim()) : [],
      }))
    : fallbackAccreditations;

  const achievements = !isLoading && apiData
    ? apiData.filter(r => r.entry_type === 'achievement').map(r => ({
        year: r.year,
        title: r.title,
        description: r.description,
      }))
    : fallbackAchievements;

  return (
    <>
      <Helmet>
        <title>Rankings & Accreditations | Bayelsa Medical University</title>
        <meta name="description" content="Discover BMU's rankings, accreditations from NUC, MDCN, and other bodies, research achievements, and key performance metrics." />
      </Helmet>

      {/* Hero - pt-[180px] to clear fixed navbar */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Rankings</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Rankings & <span className="text-primary-600">Recognition</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              BMU's commitment to excellence is reflected in our rankings, accreditations, 
              and the recognition we receive from national and international bodies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rankings */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">University Rankings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our standing among Nigerian and African medical institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rankings.map((ranking, index) => (
              <motion.div
                key={ranking.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-6"
              >
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-ink-900)' }}>
                  <span className="text-title text-white">{ranking.rank}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-subtitle text-gray-900 mb-1">{ranking.category}</h3>
                  <p className="text-sm text-gray-600">{ranking.source} • {ranking.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accreditations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              BMU is fully accredited by all relevant professional and regulatory bodies in Nigeria
            </p>
          </div>

          <div className="space-y-4">
            {accreditations.map((acc, index) => (
              <motion.div
                key={acc.body}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)' }}>
                      <Shield className="w-7 h-7" style={{ color: 'var(--color-ink-900)' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-title text-gray-900">{acc.body}</h3>
                        <span 
                          className="px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: acc.status === 'Full Accreditation' ? 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)' : '#ffd70020', color: acc.status === 'Full Accreditation' ? 'var(--color-ink-900)' : '#b8860b' }}
                        >
                          {acc.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{acc.fullName}</p>
                      <p className="text-xs text-gray-500 mt-1">Valid: {acc.year}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {acc.programs.map((program) => (
                      <span 
                        key={program}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Awards & Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognition of our excellence in education, research, and community service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)' }}>
                    <Award className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
                  </div>
                </div>
                <div className="flex-1 pb-6 border-b border-gray-200 last:border-0">
                  <span 
                    className="inline-block px-2 py-1 text-xs font-semibold mb-2"
                    style={{ backgroundColor: 'var(--color-ink-900)', color: 'white' }}
                  >
                    {achievement.year}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-12 border-t" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-headline text-gray-900 mb-6">Commitment to Quality</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Bayelsa Medical University maintains rigorous quality assurance standards across all programs. 
              Our Quality Assurance Unit conducts regular program reviews, student assessments, and 
              stakeholder feedback surveys to ensure continuous improvement in teaching, research, and service delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-white border" style={{ borderColor: '#e5e4e7' }}>Annual Program Reviews</span>
              <span className="px-4 py-2 bg-white border" style={{ borderColor: '#e5e4e7' }}>External Examiner System</span>
              <span className="px-4 py-2 bg-white border" style={{ borderColor: '#e5e4e7' }}>Student Feedback Integration</span>
              <span className="px-4 py-2 bg-white border" style={{ borderColor: '#e5e4e7' }}>ISO Standards Alignment</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
