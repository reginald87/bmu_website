import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavSection {
  id: string;
  label: string;
}

interface StickySectionNavProps {
  sections: NavSection[];
  activeSection: string;
}

export const StickySectionNav = ({ sections, activeSection }: StickySectionNavProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          <div className="flex flex-col items-end gap-1">
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  onClick={() => handleClick(section.id)}
                  className="group flex items-center gap-3 py-1.5 transition-all"
                  aria-label={`Navigate to ${section.label}`}
                >
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'opacity-100 mr-0'
                      : 'opacity-0 group-hover:opacity-60 mr-2'
                  } ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                    {section.label}
                  </span>
                  <div className={`transition-all duration-300 ${
                    isActive
                      ? 'w-3 h-3 bg-primary-600'
                      : 'w-2 h-2 bg-gray-300 group-hover:bg-gray-400'
                  }`} />
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
