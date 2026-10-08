import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUp, Newspaper, Calendar, ExternalLink, GraduationCap } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedStory } from '../components/home/FeaturedStory';
import { StatsCounter } from '../components/home/StatsCounter';
import { NewsTicker } from '../components/home/NewsTicker';
import { QuickLinks } from '../components/home/QuickLinks';
import { UpcomingEvents } from '../components/home/UpcomingEvents';
import { SDGSnapshot } from '../components/home/SDGSnapshot';
import { Testimonials } from '../components/home/Testimonials';
import { ResearchSpotlight } from '../components/home/ResearchSpotlight';
import { PartnerLogos } from '../components/home/PartnerLogos';
import { useCTAStats, usePageSections } from '../services/apiHooks';
import { CTABanner } from '../components/home/CTABanner';
import { CollegePreview } from '../components/home/CollegePreview';
import { CampusLife } from '../components/home/CampusLife';
import { VideoShowcase } from '../components/home/VideoShowcase';
import { AccreditationStrip } from '../components/home/AccreditationStrip';
import { AlumniAchievements } from '../components/home/AlumniAchievements';
import { NewsletterSignup } from '../components/home/NewsletterSignup';
import { StickySectionNav } from '../components/home/StickySectionNav';
import { fetchHomeStats, fetchNews, fetchAllEvents, fetchColleges } from '../services/api';

const fallbackSections = [
  { id: 'hero', label: 'Welcome' },
  { id: 'mission', label: 'Our Mission' },
  { id: 'trust', label: 'Trust & Impact' },
  { id: 'colleges', label: 'Colleges' },
  { id: 'research-news', label: 'Research & News' },
  { id: 'experience', label: 'Experience' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'partners', label: 'Partners' },
];

const useScrollSpy = (sectionIds: string[], offset = 200) => {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -40% 0px`, threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeId;
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

const MobileQuickBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={visible ? { y: 0 } : { y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden"
    >
      <div className="flex items-center justify-around py-2 px-2">
        <Link to="/apply" className="flex flex-col items-center gap-0.5 px-3 py-1">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          <span className="text-[10px] font-medium text-primary-600">Apply</span>
        </Link>
        <Link to="/academics/programs" className="flex flex-col items-center gap-0.5 px-3 py-1">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Programs</span>
        </Link>
        <Link to="/events" className="flex flex-col items-center gap-0.5 px-3 py-1">
          <Newspaper className="w-5 h-5 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Events</span>
        </Link>
        <Link to="/portals" className="flex flex-col items-center gap-0.5 px-3 py-1">
          <ExternalLink className="w-5 h-5 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">Portals</span>
        </Link>
      </div>
    </motion.div>
  );
};

export const Home = () => {
  const { t } = useTranslation();
  const { data: homeSections } = usePageSections('home');
  const navSections = (homeSections?.find(s => s.section_key === 'nav_sections')?.data as typeof fallbackSections || fallbackSections);
  const activeSection = useScrollSpy(navSections.map((s) => s.id));

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['homeStats'],
    queryFn: fetchHomeStats
  });

  const { data: news } = useQuery({
    queryKey: ['latestNews'],
    queryFn: () => fetchNews({ limit: 6 })
  });

  const { data: events } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: () => fetchAllEvents()
  });

  const { data: colleges } = useQuery({
    queryKey: ['colleges'],
    queryFn: fetchColleges
  });

  const ctaStats = useCTAStats();

  return (
    <div className="pb-16 lg:pb-0">
      <Helmet>
        <title>Bayelsa Medical University | Advancing Medical Education</title>
      </Helmet>
      <StickySectionNav sections={navSections} activeSection={activeSection} />
      <MobileQuickBar />
      <ScrollToTop />

      <NewsTicker news={news || []} />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── FEATURED MISSION STORY ── */}
      <section id="mission">
        <FeaturedStory sections={homeSections} />
      </section>

      {/* ── QUICK LINKS ── */}
      <QuickLinks sections={homeSections} />

      {/* ── TRUST & IMPACT ── */}
      <section id="trust">
        <AccreditationStrip />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <StatsCounter stats={stats} isLoading={statsLoading} />
        </motion.div>
      </section>

      {/* ── COLLEGES ── */}
      <section id="colleges">
        <CollegePreview colleges={colleges || []} />
      </section>

      {/* ── RESEARCH + NEWS ── */}
      <section id="research-news" className="bg-gray-50">
        <div className="container-custom py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-primary-600">
              {t('home.spotlight.title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-ink-900">
              {t('home.researchSpotlight.title')} & {t('home.latestNews.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {t('home.spotlight.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <ResearchSpotlight compact />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-ink-900">{t('home.latestNews.title')}</h3>
                  <Link to="/news" className="text-sm font-semibold text-primary-600 hover:underline">
                    {t('home.latestNews.viewAll')} →
                  </Link>
                </div>
                <div className="space-y-4">
                  {(news || []).slice(0, 4).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={`/news/${item.slug}`}
                        className="group flex items-start gap-3 p-3 -mx-3 rounded hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-primary-600/10 rounded">
                          <Newspaper className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.publishedAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </Link>
                      {idx < (news || []).slice(0, 4).length - 1 && (
                        <div className="border-b border-gray-100 mx-3" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <CTABanner stats={ctaStats?.data} />

      {/* ── CAMPUS VIDEO SHOWCASE ── */}
      <VideoShowcase />

      {/* ── EXPERIENCE BMU ── */}
      <section id="experience">
        <CampusLife />
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <UpcomingEvents events={events || []} />
              </div>
              <div>
                <SDGSnapshot sections={homeSections} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALUMNI + TESTIMONIALS ── */}
      <section id="alumni">
        <AlumniAchievements sections={homeSections} />
        <Testimonials sections={homeSections} />
      </section>

      {/* ── PARTNERS ── */}
      <section id="partners">
        <PartnerLogos sections={homeSections} />
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterSignup />
    </div>
  );
};
