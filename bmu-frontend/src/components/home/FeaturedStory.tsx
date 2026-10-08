import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getLucideIcon } from '../../lib/icons';

export const FeaturedStory = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: unknown }> }) => {
  const { t } = useTranslation();

  const fallbackHighlights = [
    {
      icon: 'GraduationCap',
      stat: '15,000+',
      label: 'Students Enrolled',
    },
    {
      icon: 'Microscope',
      stat: '500+',
      label: 'Research Publications',
    },
    {
      icon: 'Heart',
      stat: '98%',
      label: 'Graduate Employment Rate',
    },
  ];

  const highlights = (homeSections?.find(s => s.section_key === 'featured_story_highlights')?.data as typeof fallbackHighlights || fallbackHighlights);

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
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-primary-600">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-ink-900 leading-[1.15]">
              {t('home.featured.title')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t('home.featured.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('home.featured.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about/leadership"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-600 hover:text-white transition-colors"
              >
                {t('nav.people_leadership')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {highlights.map((item) => {
                const Icon = getLucideIcon(item.icon as string);
                return (
                  <div
                    key={item.label}
                    className="bg-gray-50 p-6 text-center hover:bg-primary-600 group transition-colors duration-300"
                  >
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white mx-auto mb-3 transition-colors" />
                    <div className="text-3xl font-bold text-ink-900 group-hover:text-white transition-colors">
                      {item.stat}
                    </div>
                    <div className="text-sm text-gray-500 group-hover:text-white/80 mt-1 transition-colors">
                      {item.label}
                    </div>
                  </div>
                );
              })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
