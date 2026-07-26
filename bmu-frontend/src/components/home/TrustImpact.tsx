import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Award, BadgeCheck, CheckCircle2, type LucideIcon } from 'lucide-react';
import { useUniversityRankings } from '../../services/apiHooks';
import type { UniversityRankingData } from '../../services/mockData';

interface TrustStats {
  researchPapers: number;
  students: number;
  faculty: number;
  partners: number;
}

interface TrustImpactProps {
  stats?: TrustStats;
  statsLoading?: boolean;
}

const iconByBody: Record<string, LucideIcon> = {
  NUC: Shield,
  MDCN: Award,
  NMCN: BadgeCheck,
};

const fallbackAccreditations: UniversityRankingData[] = [
  { id: 0, entry_type: 'accreditation', title: 'NUC Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NUC', body_full_name: 'National Universities Commission', status: 'Full Accreditation', validity: '2020 - Present', accredited_programs: 'All Undergraduate Programs,All Postgraduate Programs', display_order: 1, is_active: true, logo_url: null },
  { id: 0, entry_type: 'accreditation', title: 'MDCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'MDCN', body_full_name: 'Medical & Dental Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'MBBS (Medicine & Surgery)', display_order: 2, is_active: true, logo_url: null },
  { id: 0, entry_type: 'accreditation', title: 'NMCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NMCN', body_full_name: 'Nursing & Midwifery Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'B.NSc Nursing Science,Post-Basic Nursing', display_order: 3, is_active: true, logo_url: null },
];

export const TrustImpact = ({ stats, statsLoading }: TrustImpactProps) => {
  const { t } = useTranslation();
  const { data: apiData, isLoading } = useUniversityRankings('accreditation');

  const accreditations = !isLoading && apiData && apiData.length > 0
    ? apiData
    : fallbackAccreditations;

  const counters = stats ?? { researchPapers: 1247, students: 3500, faculty: 450, partners: 28 };

  const statItems = [
    { key: 'researchPapers' as const, label: t('home.stats.researchPapers'), value: counters.researchPapers, suffix: '+' },
    { key: 'students' as const, label: t('home.stats.students'), value: counters.students, suffix: '+' },
    { key: 'faculty' as const, label: t('home.stats.faculty'), value: counters.faculty, suffix: '+' },
    { key: 'partners' as const, label: t('home.stats.partners'), value: counters.partners, suffix: '' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#A51C30]">
              {t('home.accreditation.subtitle', 'Our Standards')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-[#1E1E1E] leading-[1.15]">
              {t('home.accreditation.title', 'Recognized & Accredited By')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Bayelsa Medical University meets the highest standards of academic excellence and professional accreditation in Nigeria.
            </p>

            <div className="flex flex-wrap gap-3">
              {accreditations.slice(0, 3).map((acc) => {
                const Icon = iconByBody[acc.accrediting_body] || Shield;
                return (
                  <div key={acc.accrediting_body} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200">
                    {acc.logo_url ? (
                      <img src={acc.logo_url} alt={acc.accrediting_body} className="w-6 h-6 object-contain" />
                    ) : (
                      <Icon className="w-5 h-5 text-[#A51C30]" />
                    )}
                    <span className="text-sm font-semibold text-[#1E1E1E]">{acc.accrediting_body}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {statItems.map((item) => (
              <div
                key={item.key}
                className="bg-gray-50 p-6 text-center hover:bg-[#A51C30] group transition-colors duration-300"
              >
                <div className="text-3xl font-bold text-[#1E1E1E] group-hover:text-white transition-colors">
                  {statsLoading ? '—' : item.value.toLocaleString()}{item.suffix}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-white/80 mt-1 transition-colors">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {accreditations.map((acc, index) => {
            const Icon = iconByBody[acc.accrediting_body] || Shield;
            return (
              <div key={acc.accrediting_body || index} className="bg-white p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                    {acc.logo_url ? (
                      <img src={acc.logo_url} alt={acc.accrediting_body} className="w-10 h-10 object-contain" />
                    ) : (
                      <Icon className="w-7 h-7 text-[#A51C30]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[#1E1E1E]">{acc.accrediting_body}</h3>
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{acc.body_full_name}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-[#A51C30]/10 text-[#A51C30]">
                      <BadgeCheck className="w-3 h-3" />
                      {acc.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
