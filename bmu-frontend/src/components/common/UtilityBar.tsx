import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useMenuItems } from '../../services/apiHooks';

export const UtilityBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: utilityMenuItems = [] } = useMenuItems('utility');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="hidden lg:fixed lg:block inset-x-0 top-0 z-50 bg-ink-900 text-white text-xs">
      <div className="container-custom">
        <div className="flex items-center justify-between h-9">
          <div className="flex items-center gap-0">
            {utilityMenuItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target={item.is_external ? '_blank' : undefined}
                rel={item.is_external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1 px-3 py-1 text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-r border-white/10 last:border-r-0"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />

            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  placeholder={t('search')}
                  autoFocus
                  className="w-48 px-2 py-1 text-xs text-gray-900 bg-white border-0 outline-none"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-gray-300 hover:text-white transition-colors"
                aria-label={t('nav.utility_toggleSearch')}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('search')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};