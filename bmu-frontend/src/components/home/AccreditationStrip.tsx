import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Award, BadgeCheck, CheckCircle2, Microscope, Pill, type LucideIcon } from 'lucide-react';
import { useUniversityRankings } from '../../services/apiHooks';
import type { UniversityRankingData } from '../../services/mockData';

const iconByBody: Record<string, LucideIcon> = {
  NUC: Shield,
  MDCN: Award,
  NMCN: BadgeCheck,
  MLSCN: Microscope,
  PCN: Pill,
};

const fallbackAccreditations: UniversityRankingData[] = [
  { id: 0, entry_type: 'accreditation', title: 'NUC Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NUC', body_full_name: 'National Universities Commission', status: 'Full Accreditation', validity: '2020 - Present', accredited_programs: 'All Undergraduate Programs,All Postgraduate Programs', display_order: 1, is_active: true, logo_url: null },
  { id: 0, entry_type: 'accreditation', title: 'MDCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'MDCN', body_full_name: 'Medical & Dental Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'MBBS (Medicine & Surgery)', display_order: 2, is_active: true, logo_url: null },
  { id: 0, entry_type: 'accreditation', title: 'NMCN Accreditation', description: '', rank: '', year: '', source: '', accrediting_body: 'NMCN', body_full_name: 'Nursing & Midwifery Council of Nigeria', status: 'Full Accreditation', validity: '2019 - Present', accredited_programs: 'B.NSc Nursing Science,Post-Basic Nursing', display_order: 3, is_active: true, logo_url: null },
];

export const AccreditationStrip = () => {
  const { t } = useTranslation();
  const { data: apiData, isLoading } = useUniversityRankings('accreditation');

  const accreditations = !isLoading && apiData && apiData.length > 0
    ? apiData
    : fallbackAccreditations;

  return (
    <section className="relative py-20 bg-[#1E1E1E] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="inline-block text-sm font-bold tracking-[0.25em] uppercase text-[#A51C30] mb-3">
            {t('home.accreditation.subtitle', 'Our Standards')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.accreditation.title', 'Recognized & Accredited By')}
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            Bayelsa Medical University meets the highest standards of academic excellence 
            and professional accreditation in Nigeria
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accreditations.map((acc, index) => {
            const Icon = iconByBody[acc.accrediting_body] || Shield;
            return (
              <motion.div
                key={acc.accrediting_body || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] hover:border-[#A51C30]/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A51C30] to-[#c4254a] flex items-center justify-center shadow-lg shadow-[#A51C30]/20 group-hover:scale-110 transition-transform duration-300">
                      {acc.logo_url ? (
                        <img src={acc.logo_url} alt={acc.accrediting_body} className="w-10 h-10 object-contain" />
                      ) : (
                        <Icon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {acc.accrediting_body}
                      </h3>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-5">
                    {acc.body_full_name}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      {acc.status}
                    </span>
                    {acc.validity && (
                      <span className="text-xs text-gray-500 font-medium">
                        {acc.validity}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#A51C30]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
