import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Users, GraduationCap, Globe } from 'lucide-react';

const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      countRef.current = Math.floor(progress * end);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const animatedValue = useCountUp(value, 2500);
  return <span>{animatedValue.toLocaleString()}</span>;
};

interface Stats {
  researchPapers: number;
  students: number;
  faculty: number;
  partners: number;
}

interface StatsCounterProps {
  stats?: Stats;
  isLoading?: boolean;
}

const statConfig = [
  { key: 'researchPapers' as const, icon: BookOpen, suffix: '+', gradient: 'from-primary-600 to-primary-500', bgGlow: 'bg-primary-600/5' },
  { key: 'students' as const, icon: GraduationCap, suffix: '+', gradient: 'from-ink-900 to-[#3a3a3a]', bgGlow: 'bg-ink-900/5' },
  { key: 'faculty' as const, icon: Users, suffix: '+', gradient: 'from-primary-600 to-primary-700', bgGlow: 'bg-primary-600/5' },
  { key: 'partners' as const, icon: Globe, suffix: '', gradient: 'from-ink-900 to-[#2a2a2a]', bgGlow: 'bg-ink-900/5' },
];

export const StatsCounter = ({ stats, isLoading }: StatsCounterProps) => {
  const { t } = useTranslation();
  const counters: Stats = stats ?? {
    researchPapers: 1247,
    students: 3500,
    faculty: 450,
    partners: 28
  };

  const labels = {
    researchPapers: t('home.stats.researchPapers'),
    students: t('home.stats.students'),
    faculty: t('home.stats.faculty'),
    partners: t('home.stats.partners'),
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 animate-pulse shadow-sm">
                <div className="h-14 w-14 mx-auto bg-gray-200 rounded-xl" />
                <div className="h-10 w-24 mx-auto bg-gray-200 mt-5 rounded" />
                <div className="h-4 w-28 mx-auto bg-gray-200 mt-3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statConfig.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`relative bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary-600/20 overflow-hidden`}>
                  <div className={`absolute inset-0 ${item.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="relative text-4xl md:text-5xl font-extrabold text-ink-900 tracking-tight">
                    <AnimatedNumber value={counters[item.key]} />
                    <span className="text-primary-600">{item.suffix}</span>
                  </div>

                  <div className="relative text-sm font-medium text-gray-500 mt-3 uppercase tracking-wider">
                    {labels[item.key]}
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
