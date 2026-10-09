import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTestimonials } from '../../services/apiHooks';
import type { TestimonialData } from '../../services/mockData';

const fallbackTestimonials: TestimonialData[] = [
  { id: 1, name: 'Dr. Amara Okafor', role: 'MBBS Graduate, 2023', quote: 'BMU provided me with a solid foundation in medical sciences. The clinical exposure was exceptional.', photo_url: null },
  { id: 2, name: 'Nurse Blessing George', role: 'School of Nursing, 2023', quote: "The hands-on training at BMU's School of Nursing prepared me well for the challenges of modern healthcare.", photo_url: null },
  { id: 3, name: 'Mr. Emmanuel Douglas', role: 'MPH Candidate', quote: 'The public health program at BMU has given me the tools to make a real difference in community health.', photo_url: null },
];

export const Testimonials = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: unknown }> }) => {
  const { t } = useTranslation();
  const { data: apiData, isLoading } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonialsData = (homeSections?.find(s => s.section_key === 'testimonials')?.data as TestimonialData[] || fallbackTestimonials);

  const testimonials: TestimonialData[] = !isLoading && apiData && apiData.length > 0
    ? apiData
    : testimonialsData;

  const next = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-ink-900">
          {t('home.testimonials.title')}
        </h2>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 md:p-12 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  {testimonials[activeIndex].photo_url ? (
                    <img loading="lazy" decoding="async"
                      src={testimonials[activeIndex].photo_url ?? ''}
                      alt={testimonials[activeIndex].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 flex items-center justify-center text-4xl rounded-full">
                      👤
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonials[activeIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-xl font-semibold text-primary-600">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-3 transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
