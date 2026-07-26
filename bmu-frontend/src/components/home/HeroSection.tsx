import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, GraduationCap, ArrowRight } from 'lucide-react';
import { useHeroSlides } from '../../services/apiHooks';

interface SlideData {
  title: string;
  subtitle: string;
  description: string | null;
  backgroundImage: string | null;
  overlayColor: string | null;
  textColor: string | null;
  contentPosition: string | null;
  cta: { primary: string; secondary: string };
}

const fallbackSlides: SlideData[] = [
  {
    title: 'Advancing Healthcare Through Education',
    subtitle: "Nigeria's First Specialized Medical University — training the next generation of healthcare leaders for the Niger Delta and beyond",
    description: null,
    backgroundImage: null,
    overlayColor: null,
    textColor: null,
    contentPosition: null,
    cta: { primary: 'Explore Programs', secondary: 'Our Story' },
  },
  {
    title: 'Excellence in Medical Education',
    subtitle: 'Six specialized colleges and schools dedicated to world-class healthcare education, research, and clinical practice',
    description: null,
    backgroundImage: null,
    overlayColor: null,
    textColor: null,
    contentPosition: null,
    cta: { primary: 'View Colleges', secondary: 'Learn More' },
  },
  {
    title: 'Research for a Better World',
    subtitle: 'Solving pressing health challenges through cross-disciplinary collaboration, innovation, and community partnership',
    description: null,
    backgroundImage: null,
    overlayColor: null,
    textColor: null,
    contentPosition: null,
    cta: { primary: 'Our Research', secondary: 'International' },
  },
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: apiSlides } = useHeroSlides();

  const slides: SlideData[] = apiSlides && apiSlides.length > 0
    ? apiSlides.map(s => ({
        title: s.title,
        subtitle: s.subtitle || '',
        description: s.description || null,
        backgroundImage: s.background_image_url || null,
        overlayColor: s.overlay_color || null,
        textColor: s.text_color || null,
        contentPosition: s.content_position || null,
        cta: {
          primary: s.primary_cta_text || 'Learn More',
          secondary: s.secondary_cta_text || 'Learn More',
        },
      }))
    : fallbackSlides;

  const slideCount = slides.length;
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = slides[activeSlide];
  const alignClass = slide.contentPosition === 'center' ? 'text-center mx-auto' : slide.contentPosition === 'right' ? 'ml-auto text-right' : '';

  return (
    <>
      <Helmet>
        <title>Bayelsa Medical University — {slide?.title || 'Welcome'}</title>
        <meta name="description" content={slide?.subtitle || ''} />
      </Helmet>

      <section
        id="hero"
        className="relative min-h-[calc(85vh-80px)] lg:min-h-[calc(85vh-168px)] flex items-center text-white overflow-hidden pt-[80px] lg:pt-[168px]"
        style={{ backgroundColor: '#000000' }}
      >
        {slide.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url("${slide.backgroundImage}")` }}
          />
        )}
        <div className={`absolute inset-0 ${
          slide.overlayColor
            ? ''
            : slide.contentPosition === 'center'
            ? 'bg-gradient-to-b from-black/80 via-black/50 to-black/30'
            : slide.contentPosition === 'right'
            ? 'bg-gradient-to-l from-black/80 via-black/50 to-black/30'
            : 'bg-gradient-to-r from-black/80 via-black/50 to-black/30'
        }`} style={slide.overlayColor ? { backgroundColor: slide.overlayColor } : undefined} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom py-20 relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className={`max-w-3xl ${alignClass}`}
              style={{ color: slide.textColor || '#ffffff' }}
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-sm font-medium uppercase tracking-[0.2em]">
                <GraduationCap className="w-4 h-4" />
                Nigeria's Premier Medical University
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                {slide.title}
              </h1>

              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl" style={{ color: slide.textColor ? `${slide.textColor}cc` : 'rgba(255,255,255,0.8)' }}>
                {slide.subtitle}
              </p>

              <div className="mb-10 max-w-lg" style={{ marginLeft: slide.contentPosition === 'center' ? 'auto' : undefined, marginRight: slide.contentPosition === 'center' ? 'auto' : undefined }}>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#A51C30] transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                      }
                    }}
                    placeholder="Search programs, faculty, research..."
                    className="w-full pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#A51C30] transition-all"
                  />
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row gap-5 items-start ${slide.contentPosition === 'center' ? 'sm:items-center justify-center' : slide.contentPosition === 'right' ? 'sm:items-end justify-end' : 'sm:items-center'}`}>
                <Link
                  to={slide.cta.primary === 'Our Research' ? '/research' : slide.cta.primary === 'View Colleges' ? '/academics/colleges' : '/apply'}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#A51C30] text-white font-semibold hover:bg-[#8a1828] transition-colors"
                >
                  {slide.cta.primary}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to={slide.cta.secondary === 'Our Story' ? '/about' : slide.cta.secondary === 'Learn More' ? '/about' : '/international'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold hover:bg-white hover:text-[#1E1E1E] transition-colors"
                >
                  {slide.cta.secondary}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-10 left-0 right-0">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-0.5 transition-all duration-500 ${
                      idx === activeSlide ? 'w-12 bg-white' : 'w-6 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs text-white/40 font-mono tracking-widest">
                {String(activeSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
