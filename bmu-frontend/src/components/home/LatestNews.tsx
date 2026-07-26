import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { NewsItem } from '../../services/mockData';

interface LatestNewsProps {
  news: NewsItem[];
}

export const LatestNews = ({ news }: LatestNewsProps) => {
  const { t } = useTranslation();
  const displayNews = news.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-headline mb-2">{t('home.latestNews.title')}</h2>
            <p className="text-gray-600 text-body">{t('home.latestNews.subtitle')}</p>
          </div>
          <Link 
            to="/news" 
            className="text-[#9f4a83] font-semibold hover:text-[#80fc08] transition hidden md:block"
          >
            {t('home.latestNews.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group"
            >
              <div 
                className="h-48 bg-gray-200 flex items-center justify-center"
                style={{ backgroundColor: '#00336615' }}
              >
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span 
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ backgroundColor: '#00a65120', color: '#00a651' }}
                  >
                    {item.category}
                  </span>
                  <span className="text-small text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-title mb-3 group-hover:text-[#80fc08] transition" style={{ color: '#9f4a83' }}>
                  <Link to={`/news/${item.slug}`}>{item.title}</Link>
                </h3>
                <p className="text-gray-600 text-body line-clamp-2">{item.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-small text-gray-500">By {item.author}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link 
            to="/news" 
            className="inline-block px-6 py-3 border-2 rounded-lg font-semibold transition"
            style={{ borderColor: '#9f4a83', color: '#9f4a83' }}
          >
            {t('home.latestNews.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};
