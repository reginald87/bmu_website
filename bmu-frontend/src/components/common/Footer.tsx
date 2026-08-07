import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactInfo } from '../../services/apiHooks';

const colors = {
 primary: '#A51C30',
 secondary: '#1E1E1E',
 accent: '#A51C30',
};

export const Footer = () => {
 const { t } = useTranslation();
 const { data: contact } = useContactInfo();
 const currentYear = new Date().getFullYear();

 const quickLinks = [
 { to: '/about', label: t('nav.about') },
 { to: '/academics', label: t('nav.academics') },
 { to: '/research', label: t('nav.research') },
 { to: '/colleges', label: t('nav.colleges') },
 { to: '/apply', label: t('nav.apply') },
  { to: '/contact', label: t('footer.contactUs') },
 ];

 const resources = [
 { to: '/portals/login', label: t('footer.resources_studentPortal') },
 { to: '/staff-portal', label: t('footer.resources_staffPortal') },
 { to: '/library', label: t('footer.resources_eLibrary') },
 { to: '/cpd', label: t('footer.resources_cpdPlatform') },
 { to: '/news', label: t('nav.news') },
 ];

 const contactInfo = {
 address: contact?.address || t('footer.address'),
 phone: contact?.phone || t('footer.phone'),
 email: contact?.email || t('footer.email'),
 emergency: contact?.emergency_label || t('footer.emergency'),
 emergencyNumber: contact?.emergency_phone || t('footer.emergencyNumber'),
 };

 const socialLinks = [
 { name: t('footer.social_facebook'), href: '#', icon: 'f' },
 { name: t('footer.social_twitter'), href: '#', icon: 'X' },
 { name: t('footer.social_linkedin'), href: '#', icon: 'in' },
 { name: t('footer.social_instagram'), href: '#', icon: 'IG' },
 { name: t('footer.social_youtube'), href: '#', icon: 'YT' },
 ];

 return (
 <footer style={{ backgroundColor: colors.primary }} className="text-white mt-auto">
 <div className="container-custom py-12">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

 <div className="lg:col-span-1">
 <div className="flex items-center gap-3 mb-4">
 <img
 src="/logo.png"
 alt="BMU Logo"
 className="w-16 h-16 object-contain"
 />
 <div>
 <h3 className="font-bold text-lg">{t('footer.universityName')}</h3>
 <p className="text-sm opacity-80">{t('footer.universitySuffix')}</p>
 </div>
 </div>
 <p className="text-sm opacity-80 mb-4 leading-relaxed">
 {t('footer.description')}
 </p>
 <div className="flex gap-3">
 {socialLinks.map((social) => (
 <a
 key={social.name}
 href={social.href}
 className="w-9 h-9 flex items-center justify-center text-sm font-bold transition hover:scale-110"
 style={{ backgroundColor: colors.secondary }}
 aria-label={social.name}
 >
 {social.icon}
 </a>
 ))}
 </div>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-4" style={{ color: colors.accent }}>
 {t('footer.quickLinks')}
 </h4>
 <ul className="space-y-2">
 {quickLinks.map((link) => (
 <li key={link.to}>
 <Link
 to={link.to}
 className="text-sm opacity-80 hover:opacity-100 hover:text-white transition"
 >
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-4" style={{ color: colors.accent }}>
 {t('footer.resources')}
 </h4>
 <ul className="space-y-2">
 {resources.map((link) => (
 <li key={link.to}>
 <Link
 to={link.to}
 className="text-sm opacity-80 hover:opacity-100 hover:text-white transition"
 >
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="font-bold text-lg mb-4" style={{ color: colors.accent }}>
 {t('footer.contactUs')}
 </h4>
 <ul className="space-y-3 text-sm">
 <li className="flex items-start gap-3">
 <span style={{ color: colors.accent }}>📍</span>
 <span className="opacity-80">{contactInfo.address}</span>
 </li>
 <li className="flex items-center gap-3">
 <span style={{ color: colors.accent }}>📞</span>
 <span className="opacity-80">{contactInfo.phone}</span>
 </li>
 <li className="flex items-center gap-3">
 <span style={{ color: colors.accent }}>✉️</span>
 <a href={`mailto:${contactInfo.email}`} className="opacity-80 hover:opacity-100">
 {contactInfo.email}
 </a>
 </li>
 <li className="flex items-center gap-3">
 <span style={{ color: colors.accent }}>🚨</span>
 <span className="opacity-80">{contactInfo.emergency}: {contactInfo.emergencyNumber}</span>
 </li>
 </ul>
 </div>
 </div>

 <div className="mt-10 pt-8 border-t border-white/20">
 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
 <div>
 <h4 className="font-bold text-lg mb-1">{t('footer.newsletterTitle')}</h4>
 <p className="text-sm opacity-80">{t('footer.newsletterDescription')}</p>
 </div>
 <form className="flex gap-2 w-full md:w-auto">
 <input
 type="email"
 placeholder={t('footer.newsletterPlaceholder')}
 className="px-4 py-2 text-gray-800 w-full md:w-64"
 />
 <button
 type="submit"
 className="px-6 py-2 font-semibold transition hover:opacity-90"
 style={{ backgroundColor: colors.accent, color: colors.primary }}
 >
 {t('footer.newsletterSubscribe')}
 </button>
 </form>
 </div>
 </div>
 </div>

 <div style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} className="py-4">
 <div className="container-custom">
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
 <p className="opacity-60">
 {t('footer.copyright', { year: currentYear })}
 </p>
 <div className="flex gap-6 opacity-60">
 <Link to="/privacy" className="hover:opacity-100 transition">{t('footer.privacyPolicy')}</Link>
 <Link to="/terms" className="hover:opacity-100 transition">{t('footer.termsOfUse')}</Link>
 <Link to="/sitemap" className="hover:opacity-100 transition">{t('footer.sitemap')}</Link>
 </div>
 </div>
 </div>
 </div>
 </footer>
 );
};