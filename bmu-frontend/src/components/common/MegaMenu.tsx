import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { megaGroups } from './megaMenuData';

export const MegaMenu = ({ type }: { type: string }) => {
  const { t } = useTranslation();
  const group = megaGroups[type];
  if (!group) return null;

  const FeatureIcon = group.feature.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-ink-900 text-white p-6 lg:p-8 flex flex-col justify-between rounded-lg">
        <div>
          <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
            <FeatureIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t(group.titleKey)}</h3>
          <p className="text-sm text-white/70 leading-relaxed">{t(group.feature.descKey)}</p>
        </div>
        <Link
          to={group.feature.to}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-primary-600 transition-colors"
        >
          {t('megaMenu.featured_cta')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {group.columns.map((column, idx) => (
          <div key={idx}>
            {column.headingKey && (
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                {t(column.headingKey)}
              </h4>
            )}
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.to + link.key}>
                  <Link
                    to={link.to}
                    className="text-gray-700 hover:text-primary-600 transition-colors text-sm font-medium"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
