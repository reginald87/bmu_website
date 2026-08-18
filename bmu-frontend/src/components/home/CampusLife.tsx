import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCampusStats, useCampusImages } from '../../services/apiHooks';

const fallbackStats = [
  { id: 1, label: 'Students', value: '3,500+' },
  { id: 2, label: 'Student Organizations', value: '50+' },
  { id: 3, label: 'Campus Size', value: '200+ Acres' },
  { id: 4, label: 'Residential Halls', value: '6' },
];

const fallbackImages = [
  { id: 1, title: 'BMU Main Campus', caption: 'The entrance to Bayelsa Medical University', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop', display_order: 1 },
  { id: 2, title: 'University Library', caption: 'A modern library with extensive medical collections', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop', display_order: 2 },
  { id: 3, title: 'Medical Laboratory', caption: 'State-of-the-art laboratory facilities', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop', display_order: 3 },
  { id: 4, title: 'Campus Garden', caption: 'Lush green spaces for relaxation and study', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop', display_order: 4 },
];

export const CampusLife = () => {
  const { data: stats = [] } = useCampusStats();
  const { data: campusImages = [] } = useCampusImages();

  const displayStats = stats.length ? stats.slice(0, 4) : fallbackStats;
  const images = campusImages.length ? campusImages : fallbackImages;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-16"
        >
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#A51C30]">
            Campus Life
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[#1E1E1E]">
            Life at BMU
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            More than just academics — discover a vibrant community where learning meets life, friendships flourish, and future leaders are shaped.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.id ?? stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gray-50 p-6 text-center group hover:bg-[#A51C30] transition-colors duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#1E1E1E] group-hover:text-white transition-colors">{stat.value}</div>
              <div className="text-sm text-gray-500 group-hover:text-white/80 mt-1 transition-colors">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 relative h-80 md:h-96 overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={images[activeIndex]?.image}
                  alt={images[activeIndex]?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white text-lg font-bold">{images[activeIndex]?.title}</h4>
                  {images[activeIndex]?.caption && (
                    <p className="text-white/80 text-sm mt-1">{images[activeIndex].caption}</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === activeIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Experience BMU</h3>
            <p className="text-gray-600 text-sm mb-5">From residential halls to student organizations, discover everything our campus has to offer.</p>
            <Link
              to="/about/campus"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all bg-[#1E1E1E] text-white hover:bg-[#A51C30]"
            >
              Explore Campus Life
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
