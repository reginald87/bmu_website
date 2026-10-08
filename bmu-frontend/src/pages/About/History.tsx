import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Award, Globe } from 'lucide-react';
import { useHistoryPage } from '../../services/apiHooks';
import { useMemo } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const fallbackTimelineEvents: TimelineEvent[] = [
  {
    year: '2018',
    title: 'Establishment',
    description: 'BMU was established via the Bayelsa Medical University Law enacted by the Bayelsa State House of Assembly, beginning with two pioneer faculties: Basic Medical Sciences and Clinical Sciences (MBBS programme).',
    icon: Building2,
  },
  {
    year: '2019',
    title: 'University Founded',
    description: 'BMU admitted its first students with foundational programs in Medicine and Nursing to address regional healthcare needs, and secured full accreditation from the National Universities Commission (NUC) for its MBBS programme.',
    icon: GraduationCap,
  },
  {
    year: '2021',
    title: 'Expansion and Growth',
    description: 'The university expanded to include new faculties such as Pharmaceutical Sciences, Dentistry, Health Sciences, and Sciences, alongside accelerated development of the permanent campus along Imgbi Road.',
    icon: Award,
  },
  {
    year: '2023',
    title: 'Campus Expansion',
    description: 'Opened a state-of-the-art teaching hospital and advanced research laboratories, including VR/AR-equipped medical simulation labs, modern lecture halls, and student hostels.',
    icon: Building2,
  },
  {
    year: '2024',
    title: 'Academic Growth',
    description: 'Launched the postgraduate school and several new specialty programs, attracting international students and further strengthening research capacity.',
    icon: GraduationCap,
  },
  {
    year: '2025',
    title: 'Global Recognition',
    description: 'Forged key partnerships with leading global universities and established a high-fidelity simulation lab, positioning BMU among Nigeria\'s fastest-growing medical universities.',
    icon: Globe,
  },
];

const titleIconMap: Record<string, React.ElementType> = {
  'Establishment': Building2,
  'University Founded': GraduationCap,
  'Expansion and Growth': Award,
  'Campus Expansion': Building2,
  'Academic Growth': GraduationCap,
  'Global Recognition': Globe,
};

export const History = () => {
  const { data: pageData } = useHistoryPage();

  const heroContent = pageData?.hero_content || 'Bayelsa Medical University (BMU) was established to address critical healthcare manpower shortages in the Niger Delta region and Nigeria at large, growing into one of Nigeria\'s fastest-growing medical universities.';
  const introTitle = pageData?.intro_title || 'About the Bayelsa Medical University';
  const introParagraphs = pageData?.intro_content ? pageData.intro_content.split('\n\n').filter(Boolean) : [];
  const introImageCaption = pageData?.intro_image_caption || 'BMU Campus Development';
  const introImage = pageData?.intro_image || null;
  const introImages = pageData?.intro_images || [];
  const stats = pageData?.stats || [];
  const futureTitle = pageData?.future_title || 'Looking Ahead';
  const futureContent = pageData?.future_content || '';
  const futureQuote = pageData?.future_quote || '';

  const timelineEvents = useMemo(() => {
    if (pageData?.timeline_events?.length) {
      return pageData.timeline_events.map(e => ({
        ...e,
        icon: titleIconMap[e.title] || Building2,
      }));
    }
    return fallbackTimelineEvents;
  }, [pageData]);

  return (
    <>
      <Helmet>
        <title>Our History | Bayelsa Medical University</title>
        <meta name="description" content="Explore the journey of Bayelsa Medical University from its establishment in 2018 to becoming a leading medical institution in Nigeria." />
      </Helmet>

      {/* Hero - pt-[140px] to clear fixed navbar */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Our History</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-[#A51C30]">History</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {heroContent}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-headline text-gray-900 mb-6">{introTitle}</h2>
              {introParagraphs.map((para, i) => (
                <p key={i} className={`text-gray-700 text-body ${i < introParagraphs.length - 1 ? 'mb-4' : 'leading-relaxed'}`}>
                  {para}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {introImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {introImages.map((img) => (
                    <div key={img.order} className="bg-gray-100 overflow-hidden">
                      <img src={img.image} alt={img.caption} className="w-full aspect-video object-cover" />
                      {img.caption && (
                        <p className="text-center text-sm text-gray-500 py-2">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : introImage ? (
                <div className="w-full overflow-hidden">
                  <img src={introImage} alt={introImageCaption} className="w-full h-[480px] object-cover object-top" />
                </div>
              ) : (
                <div className="bg-gray-100 aspect-video flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Building2 className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-medium">{introImageCaption}</p>
                    <p className="text-sm">Historical photos and milestones</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Journey Through Time</h2>
            <p className="text-gray-600 text-body max-w-2xl mx-auto">
              Key milestones that have shaped BMU into the institution it is today
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 md:-translate-x-1/2" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={event.year + event.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1 md:text-right pl-12 md:pl-0 md:pr-12">
                      <div className={`bg-white p-6 shadow-sm border border-gray-100 ${isLeft ? 'md:mr-0' : 'md:ml-0'}`}>
                        <span 
                          className="inline-block px-3 py-1 text-sm font-bold mb-3"
                          style={{ backgroundColor: '#A51C3020', color: '#A51C30' }}
                        >
                          {event.year}
                        </span>
                        <h3 className="text-title text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-body">{event.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 border-4 border-white md:-translate-x-1/2" style={{ backgroundColor: '#A51C30' }} />

                    {/* Icon side */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Present Day */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-stat mb-2">{stat.value}</div>
                  <div className="text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-12 border-t" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-title text-gray-900 mb-4">{futureTitle}</h2>
            {futureContent && (
              <p className="text-gray-700 leading-relaxed mb-6">{futureContent}</p>
            )}
            {futureQuote && (
              <p className="text-gray-600 italic">{futureQuote}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
