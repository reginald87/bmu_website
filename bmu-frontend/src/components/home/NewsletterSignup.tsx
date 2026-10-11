import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { NewsletterForm } from '../common/NewsletterForm';

export const NewsletterSignup = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-ink-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {t('home.newsletter.title', 'Stay Updated with BMU')}
              </h3>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              {t('home.newsletter.description', 'Get the latest news, events, and admission updates delivered to your inbox.')}
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[400px]">
            <NewsletterForm
              variant="dark"
              source="home"
              placeholder={t('home.newsletter.placeholder', 'Enter your email')}
              buttonLabel={t('home.newsletter.subscribe', 'Subscribe')}
              successMessage={t('home.newsletter.success', 'Thanks for subscribing!')}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-xs mt-6"
        >
          {t('home.newsletter.privacy', 'We respect your privacy. Unsubscribe at any time.')}
        </motion.p>
      </div>
    </section>
  );
};
