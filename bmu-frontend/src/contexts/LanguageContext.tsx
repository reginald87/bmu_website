import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'am' | 'om';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome to BMU',
    apply: 'Apply Now',
    about: 'About',
    academics: 'Academics',
    colleges: 'Colleges',
    research: 'Research',
  },
  am: {
    welcome: 'እንኩዋን ወደ ቢኤምዩ በደህና መጡ',
    apply: 'አሁን ያመልክቱ',
    about: 'ስለ',
    academics: 'ትምህርት',
    colleges: 'ኮሌጆች',
    research: 'ጥናት',
  },
  om: {
    welcome: 'Baga BMU dhuftan',
    apply: 'Amma Iyyaa',
    about: 'Waaee',
    academics: 'Barsiisuu',
    colleges: 'Kolleejjii',
    research: 'Qorannoo',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
