import { useTranslation } from 'react-i18next';
import type { NewsItem } from '../../services/mockData';

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker = ({ news }: NewsTickerProps) => {
  const { t } = useTranslation();

  if (news.length === 0) {
    return (
      <div className="py-4 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-sm font-semibold text-white bg-[#A51C30]">
              {t('home.newsTicker.latest')}
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="whitespace-nowrap">
                {t('home.newsTicker.noNews')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 text-sm font-semibold text-white bg-[#A51C30]">
            {t('home.newsTicker.latest')}
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {news.map((item, index) => (
                <span key={item.id} className="mx-8">
                  <a href={`/news/${item.slug}`} className="hover:text-[#A51C30] transition">
                    {item.title}
                  </a>
                  <span className="text-gray-400 ml-2">({item.publishedAt})</span>
                  {index < news.length - 1 && <span className="mx-4 text-gray-300">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
