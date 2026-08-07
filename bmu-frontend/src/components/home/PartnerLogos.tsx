import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, HeartPulse, Microscope, Landmark, Briefcase, Building2 } from 'lucide-react';
import { usePartners } from '../../services/apiHooks';

const fallbackPartners = [
  { name: 'World Health Organization', abbr: 'WHO', color: '#0093D5', icon: Globe, description: 'Global health partnership for disease prevention and health promotion' },
  { name: 'Bill & Melinda Gates Foundation', abbr: 'GATES', color: '#00A651', icon: HeartPulse, description: 'Supporting innovative healthcare solutions and medical research' },
  { name: 'National Institutes of Health', abbr: 'NIH', color: '#20558A', icon: Microscope, description: 'Collaborative biomedical research and clinical trials' },
  { name: 'United Nations Development Programme', abbr: 'UNDP', color: '#0066B3', icon: Landmark, description: 'Sustainable development goals and capacity building' },
  { name: 'African Development Bank', abbr: 'AfDB', color: '#FF6600', icon: Briefcase, description: 'Infrastructure development and educational funding support' },
];

function abbr(name: string): string {
  return name.split(' ').filter(w => w[0]?.match(/[A-Z]/)).map(w => w[0]).join('').slice(0, 5) || name.slice(0, 3).toUpperCase();
}

function randomColor(i: number): string {
  const colors = ['#0093D5', '#00A651', '#20558A', '#0066B3', '#FF6600', '#A51C30', '#E67E22', '#8E44AD'];
  return colors[i % colors.length];
}

export const PartnerLogos = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: any }> }) => {
  const { t } = useTranslation();
  const { data: apiPartners } = usePartners();

  const partnerData = (homeSections?.find(s => s.section_key === 'partners')?.data as any[] || fallbackPartners);

  const partners: { name: string; abbr: string; color: string; icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; logoUrl: string | null; description: string }[] = apiPartners && apiPartners.length > 0
    ? apiPartners.map((p, i) => ({
        name: p.name,
        abbr: abbr(p.name),
        color: randomColor(i),
        logoUrl: p.logo_url,
        description: p.description || '',
      }))
    : partnerData.map(p => ({
        name: p.name,
        abbr: p.abbr,
        color: p.color,
        icon: p.icon,
        logoUrl: null,
        description: p.description,
      }));

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-[#A51C30]">
            Global Network
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-[#1E1E1E]">
            {t('home.partnerLogos.title', 'Strategic Partners')}
          </h2>
          <p className="text-gray-800 max-w-2xl">
            Collaborating with world-leading organizations to advance healthcare education and research
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 p-6"
            >
              <div className="flex flex-col items-center text-center">
                {partner.logoUrl ? (
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center mb-4" style={{ backgroundColor: `${partner.color}15` }}>
                    {partner.icon ? (
                      <partner.icon className="w-8 h-8" style={{ color: partner.color }} />
                    ) : (
                      <Building2 className="w-8 h-8" style={{ color: partner.color }} />
                    )}
                  </div>
                )}

                <div className="text-xl font-bold mb-2" style={{ color: partner.color }}>
                  {partner.abbr}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/research/collaborations"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#A51C30] text-[#A51C30] font-semibold hover:bg-[#A51C30] hover:text-white transition-colors"
          >
            View All Partnerships
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
