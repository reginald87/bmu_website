import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
 code: string;
 label: string;
 flag: string;
}

const languages: Language[] = [
 { code: 'en', label: 'English', flag: '🇬🇧' },
 { code: 'fr', label: 'Français', flag: '🇫🇷' },
 { code: 'es', label: 'Español', flag: '🇪🇸' },
 { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
 { code: 'zh', label: '中文', flag: '🇨🇳' },
 { code: 'ar', label: 'العربية', flag: '🇸🇦' },
 { code: 'pt', label: 'Português', flag: '🇵🇹' },
 { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
 { code: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
 { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
];

export const LanguageToggle = () => {
 const { i18n } = useTranslation();
 const [isOpen, setIsOpen] = useState(false);

 const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

 const handleLanguageChange = (code: string) => {
 i18n.changeLanguage(code);
 setIsOpen(false);
 };

 return (
 <div className="relative">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition text-sm"
 >
 <span className="text-lg">{currentLang.flag}</span>
 <span className="hidden md:inline text-gray-700">{currentLang.label}</span>
 <svg
 className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </button>

 {isOpen && (
 <>
 <div
 className="fixed inset-0 z-40"
 onClick={() => setIsOpen(false)}
 />
 <div className="absolute right-0 mt-2 w-56 bg-white border z-50 max-h-80 overflow-y-auto">
 <div className="py-2">
 {languages.map((lang) => (
 <button
 key={lang.code}
 onClick={() => handleLanguageChange(lang.code)}
 className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition ${
 i18n.language === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
 }`}
 >
 <span className="text-xl">{lang.flag}</span>
 <span className="flex-1">{lang.label}</span>
 {i18n.language === lang.code && (
 <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
 </svg>
 )}
 </button>
 ))}
 </div>
 </div>
 </>
 )}
 </div>
 );
};
