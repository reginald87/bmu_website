import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Send, CheckCircle } from 'lucide-react';

export const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

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
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-white/10"
              >
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="font-medium text-white">
                  {t('home.newsletter.success', 'Thanks for subscribing!')}
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('home.newsletter.placeholder', 'Enter your email')}
                    required
                    className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 font-semibold flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        {t('home.newsletter.subscribe', 'Subscribe')}
                      </span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
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
