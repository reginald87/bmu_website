import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getLucideIcon } from '../../lib/icons';

interface QuickLinkCard {
  to: string;
  title: string;
  description?: string;
  titleKey?: string;
  descKey?: string;
  icon: string;
  image?: string;
}

export const QuickLinks = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: unknown }> }) => {
  const { t } = useTranslation();

  const fallbackCards: QuickLinkCard[] = [
    {
      to: '/academics',
      title: t('home.quickLinks.academics'),
      description: t('home.quickLinks.academicsDesc'),
      icon: 'GraduationCap',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    },
    {
      to: '/colleges',
      title: t('home.quickLinks.colleges'),
      description: t('home.quickLinks.collegesDesc'),
      icon: 'Building2',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    },
    {
      to: '/research',
      title: t('home.quickLinks.research'),
      description: t('home.quickLinks.researchDesc'),
      icon: 'Microscope',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    },
  ];

  const rawCards = (homeSections?.find(s => s.section_key === 'quick_links')?.data as typeof fallbackCards) || fallbackCards;

  const cards = rawCards.map((card) => ({
    to: card.to,
    image: card.image,
    icon: card.icon,
    title: card.title ?? (card.titleKey ? t(card.titleKey) : ''),
    description: card.description ?? (card.descKey ? t(card.descKey) : ''),
  }));

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-primary-600">
            {t('nav.quickLinks', 'Quick Links')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-ink-900">
            {t('home.quickLinks.title')}
          </h2>
          <p className="text-gray-800 max-w-2xl">
            Discover excellence in medical education and healthcare innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon ? getLucideIcon(card.icon as string) : ArrowRight;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={card.to}
                  className="group block relative h-[400px] overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div className="w-14 h-14 bg-primary-600 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:underline transition-all">
                      {card.title}
                    </h3>

                    <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                      {card.description}
                    </p>

                    <div className="flex items-center gap-2 text-white group-hover:underline transition-all">
                      <span className="text-sm font-semibold">Learn More</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
