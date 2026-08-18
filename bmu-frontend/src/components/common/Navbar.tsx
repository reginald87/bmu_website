import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, University, GraduationCap, FlaskConical, Building2, Users, Globe, Newspaper, HeartHandshake, LogIn, BookOpen, Award, Briefcase, Link as LinkIcon } from 'lucide-react';
import { UtilityBar } from './UtilityBar';
import { MegaMenu } from './MegaMenu';
import { megaGroups, type MegaColumn } from './megaMenuData';
import { useMenuItems } from '../../services/apiHooks';
import type { MenuItemData } from '../../services/api';

const colors = {
  primary: '#A51C30',
  secondary: '#1E1E1E',
  accent: '#A51C30',
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  University,
  GraduationCap,
  FlaskConical,
  Building2,
  Users,
  Globe,
  Newspaper,
  HeartHandshake,
  LogIn,
  BookOpen,
  Award,
  Briefcase,
};

function getIcon(name: string) {
  return iconMap[name] || LinkIcon;
}

interface DynamicMegaGroup {
  key: string;
  label: string;
  url: string;
  description: string;
  icon: string;
  column1: { heading: string; links: MenuItemData[] };
  column2: { heading: string; links: MenuItemData[] };
}

interface NavItem {
  key: string;
  label: string;
  url: string;
  title: string;
  dynamic: boolean;
  links: MenuItemData[];
  columns: MegaColumn[];
}

function buildMegaGroups(items: MenuItemData[]): DynamicMegaGroup[] {
  return items
    .filter((item) => item.location === 'navbar')
    .sort((a, b) => a.display_order - b.display_order)
    .map((item) => {
      const children = (item.children || [])
        .filter((c) => c.location === 'navbar')
        .sort((a, b) => a.display_order - b.display_order);

      const col1Links = children.filter((c) => c.column === 1);
      const col2Links = children.filter((c) => c.column === 2);

      return {
        key: item.label.toLowerCase().replace(/[^a-z0-9]/g, ''),
        label: item.label,
        url: item.url,
        description: item.description,
        icon: item.icon,
        column1: { heading: '', links: col1Links },
        column2: { heading: '', links: col2Links },
      };
    });
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const { t } = useTranslation();
  const location = useLocation();
  const { data: menuItems = [] } = useMenuItems('navbar');

  const dynamicGroups = buildMegaGroups(menuItems);
  const isHomePage = location.pathname === '/';

  // Check if we have dynamic menu items; if not, fall back to static megaGroups
  const useDynamic = dynamicGroups.length > 0;
  const navOrder = useDynamic ? dynamicGroups.map((g) => g.key) : Object.keys(megaGroups);
  const portalsItem = useDynamic ? dynamicGroups.find((g) => g.label.toLowerCase() === 'portals') : null;
  const mainNavItems = useDynamic ? dynamicGroups.filter((g) => g.label.toLowerCase() !== 'portals') : [];

  const navItems: NavItem[] = useDynamic
    ? mainNavItems.map((g) => ({
        key: g.key,
        label: g.label,
        url: g.url,
        title: g.label,
        dynamic: true,
        links: [...g.column1.links, ...g.column2.links],
        columns: [],
      }))
    : navOrder.map((key) => {
        const group = megaGroups[key];
        return {
          key: group.key,
          label: t(group.labelKey),
          url: group.to,
          title: t(group.titleKey),
          dynamic: false,
          links: [],
          columns: group.columns,
        };
      });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIsMenuOpen(false);
      setActiveDropdown(null);
      setPortalsOpen(false);
      setOpenMobileGroup(null);
    });
    return () => cancelAnimationFrame(id);
  }, [location]);

  const navBgColor = isScrolled || !isHomePage ? 'bg-white' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100';

  const renderMegaMenuContent = (group: DynamicMegaGroup) => {
    const IconComponent = getIcon(group.icon);
    return (
      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0 bg-[#1E1E1E] p-6 text-white">
          <IconComponent size={32} className="mb-4 text-white/80" />
          <p className="text-sm text-white/70 leading-relaxed">{group.description || group.label}</p>
          <Link
            to={group.url}
            className="inline-block mt-4 text-sm font-semibold text-[#A51C30] hover:underline"
          >
            {t('megaMenu.explore')} {group.label} →
          </Link>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-8">
          {group.column1.links.length > 0 && (
            <div>
              {group.column1.heading && (
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
                  {group.column1.heading}
                </h3>
              )}
              <div className="space-y-2">
                {group.column1.links.map((link) => (
                  link.is_external ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-700 hover:text-[#A51C30] transition py-1.5 text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.id}
                      to={link.url}
                      className="block text-gray-700 hover:text-[#A51C30] transition py-1.5 text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
          {group.column2.links.length > 0 && (
            <div>
              {group.column2.heading && (
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
                  {group.column2.heading}
                </h3>
              )}
              <div className="space-y-2">
                {group.column2.links.map((link) => (
                  link.is_external ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-700 hover:text-[#A51C30] transition py-1.5 text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.id}
                      to={link.url}
                      className="block text-gray-700 hover:text-[#A51C30] transition py-1.5 text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <UtilityBar />

      {/* Main bar: logo + portals + apply */}
      <div className="fixed lg:top-9 top-0 w-full z-40 transition-all duration-300 bg-white shadow-sm">
        <div className="container-custom py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-4">
              <img src="/logo.png" alt="BMU Logo" className="h-14 w-14 object-contain" />
              <div className="flex flex-col">
                <span className={`font-bold text-lg md:text-xl transition-colors text-[#1E1E1E]`}>
                  {t('footer.universityName')} {t('footer.universitySuffix')}
                </span>
                <span className={`text-sm font-medium transition-colors text-gray-600`}>
                  {t('tagline')}
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-3">
              {/* Portals dropdown */}
              {portalsItem && (
                <div
                  className="relative"
                  onMouseEnter={() => setPortalsOpen(true)}
                  onMouseLeave={() => setPortalsOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#A51C30] transition-colors"
                    aria-haspopup="true"
                    aria-expanded={portalsOpen}
                  >
                    {portalsItem.label}
                    <ChevronDown size={16} className={`transition-transform ${portalsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`absolute right-0 top-full mt-3 w-[min(92vw,640px)] bg-white shadow-2xl border-t-4 border-[#A51C30] rounded-b-lg p-6 z-50 transition-all duration-200 ${
                      portalsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    {renderMegaMenuContent(portalsItem)}
                  </div>
                </div>
              )}

              <Link
                to="/apply"
                className="px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                {t('nav.applyNow')}
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 transition-colors"
              style={{
                backgroundColor: isScrolled || !isHomePage ? colors.primary : 'rgba(255,255,255,0.2)',
                color: 'white',
              }}
              aria-label={isMenuOpen ? t('nav.mobile_closeMenu') : t('nav.mobile_openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav with full-width mega panels */}
      <nav
        className={`hidden lg:block fixed lg:top-[124px] top-[88px] w-full z-30 transition-all duration-300 ${navBgColor}`}
        aria-label="Main navigation"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="container-custom">
          <ul className="flex items-center justify-between" role="menubar">
            {navItems.map((item) => {
              const key = item.key;
              const isActive = activeDropdown === key;
              const label = item.label;
              const url = item.url;
              return (
                <li
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(key)}
                  role="none"
                >
                  <Link
                    to={url}
                    onClick={() => setActiveDropdown(null)}
                    className={`flex items-center gap-1 px-2 py-3 text-sm font-medium transition-colors border-b-2 ${
                      isActive
                        ? 'text-[#A51C30] border-[#A51C30]'
                        : 'text-gray-700 border-transparent hover:text-[#A51C30]'
                    }`}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={isActive}
                  >
                    {label}
                    <ChevronDown size={15} className={`transition-transform ${isActive ? 'rotate-180' : ''}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Shared full-width mega panel */}
        <div
          className={`absolute left-0 right-0 top-full bg-white shadow-xl border-t-4 border-[#A51C30] z-20 transition-all duration-200 ${
            activeDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="container-custom py-8">
            {activeDropdown && (
              useDynamic ? (
                (() => {
                  const group = dynamicGroups.find((g) => g.key === activeDropdown);
                  if (!group) return null;
                  return renderMegaMenuContent(group);
                })()
              ) : (
                <MegaMenu type={activeDropdown} />
              )
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-30 bg-white transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '88px' }}
        id="mobile-menu"
      >
        <div className="container-custom py-6 h-full overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const key = item.key;
              const isOpen = openMobileGroup === key;
              const label = item.label;
              const url = item.url;
              const title = item.title;
              const allLinks = item.links;
              return (
                <div key={key} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setOpenMobileGroup(isOpen ? null : key)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="font-semibold text-gray-900 text-lg">{label}</span>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-4">
                      <Link
                        to={url}
                        className="block text-sm font-semibold text-[#A51C30] py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {title} →
                      </Link>
                      {item.dynamic ? (
                        <div className="space-y-1">
                          {allLinks.map((link) => (
                            link.is_external ? (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-gray-600 hover:text-[#A51C30] transition py-1.5 text-sm"
                              >
                                {link.label}
                              </a>
                            ) : (
                              <Link
                                key={link.id}
                                to={link.url}
                                className="block text-gray-600 hover:text-[#A51C30] transition py-1.5 text-sm"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {link.label}
                              </Link>
                            )
                          ))}
                        </div>
                      ) : (
                        item.columns.map((column, ci) => (
                          <div key={ci} className="mt-2">
                            {column.headingKey && (
                              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
                                {t(column.headingKey)}
                              </p>
                            )}
                            <div className="space-y-1">
                              {column.links.map((link) => (
                                <Link
                                  key={link.to + link.key}
                                  to={link.to}
                                  className="block text-gray-600 hover:text-[#A51C30] transition py-1.5 text-sm"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {t(link.key)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-bold text-[#A51C30] uppercase tracking-wide mb-3">{t('nav.quickLinks')}</h3>
            <div className="space-y-2">
              <Link to="/admissions" className="block text-gray-600 hover:text-[#A51C30] transition text-sm" onClick={() => setIsMenuOpen(false)}>
                {t('nav.academics_admissions')}
              </Link>
              <Link to="/portal" className="block text-gray-600 hover:text-[#A51C30] transition text-sm" onClick={() => setIsMenuOpen(false)}>
                {t('nav.portals_student')}
              </Link>
              <Link to="/staff" className="block text-gray-600 hover:text-[#A51C30] transition text-sm" onClick={() => setIsMenuOpen(false)}>
                {t('footer.resources_staffPortal')}
              </Link>
              <Link to="/library" className="block text-gray-600 hover:text-[#A51C30] transition text-sm" onClick={() => setIsMenuOpen(false)}>
                {t('footer.resources_eLibrary')}
              </Link>
            </div>
          </div>

          <Link
            to="/apply"
            className="block w-full text-center py-3 mt-4 font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setIsMenuOpen(false)}
          >
            {t('nav.applyNow')} →
          </Link>
        </div>
      </div>
    </>
  );
};
