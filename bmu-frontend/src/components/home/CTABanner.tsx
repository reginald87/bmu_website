import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CTABannerStats {
  undergraduate_programs: number;
  postgraduate_programs: number;
  research_centers: number;
  international_partners: number;
}

const fallbackStats: CTABannerStats = {
  undergraduate_programs: 20,
  postgraduate_programs: 15,
  research_centers: 8,
  international_partners: 28,
};

interface CTABannerProps {
  stats?: CTABannerStats;
}

const statLabels: Record<keyof CTABannerStats, string> = {
  undergraduate_programs: 'Undergraduate Programs',
  postgraduate_programs: 'Postgraduate Programs',
  research_centers: 'Research Centers',
  international_partners: 'International Partners',
};

export const CTABanner = ({ stats }: CTABannerProps) => {
  const { t } = useTranslation();
  const data = stats ?? fallbackStats;

  return (
    <section className="py-16" style={{ backgroundColor: 'var(--color-primary-600)' }}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t('home.ctaBanner.title')}
            </h2>
            <p className="text-white/90 text-lg">
              {t('home.ctaBanner.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/apply"
              className="px-8 py-4 bg-white text-primary-600 font-bold hover:bg-gray-100 transition text-center"
            >
              {t('home.ctaBanner.applyNow')}
            </Link>
            <Link
              to="/academics/programs"
              className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white/10 transition text-center"
            >
              {t('home.ctaBanner.explorePrograms')}
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-white/20">
          {(Object.keys(statLabels) as Array<keyof CTABannerStats>).map((key) => (
            <div key={key} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">
                {data[key]}{['undergraduate_programs', 'postgraduate_programs', 'international_partners'].includes(key) ? '+' : ''}
              </div>
              <div className="text-white/80 text-sm mt-1">{statLabels[key]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
