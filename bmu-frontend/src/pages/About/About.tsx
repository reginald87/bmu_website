import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, BookOpen, Globe, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAboutPage } from '../../services/apiHooks';
import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, typeof Award> = {
  Award, Heart, Lightbulb, Globe,
  Excellence: Award, Compassion: Heart, Innovation: Lightbulb, Impact: Globe,
};

const fallbackCoreValues = [
  { icon: Award, title: 'Excellence', description: 'We pursue the highest standards in teaching, research, and healthcare delivery.' },
  { icon: Heart, title: 'Compassion', description: 'We put patients and communities at the center of everything we do.' },
  { icon: Lightbulb, title: 'Innovation', description: 'We embrace new ideas and technologies to advance medical science.' },
  { icon: Globe, title: 'Impact', description: 'We are committed to improving health outcomes in the Niger Delta and beyond.' },
];

const fallbackStats = [
  { value: '2018', label: 'Founded', suffix: '' },
  { value: '6', label: 'Colleges & Schools', suffix: '' },
  { value: '50+', label: 'Degree Programs', suffix: '' },
  { value: '3,500+', label: 'Students', suffix: '' },
];

const resolveIcon = (name?: string) => {
  if (!name) return Award;
  return (LucideIcons as any)[name] || Award;
};

export const About = () => {
  const { data: pageData } = useAboutPage();

  const heroContent = pageData?.hero_content || 'Nigeria\'s premier institution for healthcare education, dedicated to training the next generation of medical professionals and advancing health outcomes in the Niger Delta region.';

  const quickStats = useMemo(() => {
    if (pageData?.stats?.length) {
      return pageData.stats.map(s => ({ value: s.value, label: s.label, suffix: s.suffix }));
    }
    return fallbackStats;
  }, [pageData]);

  const coreValues = useMemo(() => {
    if (pageData?.core_values?.length) {
      return pageData.core_values.map(v => ({
        icon: iconMap[v.icon_name] || resolveIcon(v.icon_name),
        title: v.title,
        description: v.description,
      }));
    }
    return fallbackCoreValues;
  }, [pageData]);

  return (
    <>
      <Helmet>
        <title>About Us | Bayelsa Medical University</title>
        <meta name="description" content="Bayelsa Medical University (BMU) is a premier institution dedicated to excellence in healthcare education, research, and community service in Nigeria." />
      </Helmet>

      {/* Hero Section - pt-[140px] to clear fixed navbar */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">About Us</span>
            </div>
            <h1 className="text-display text-white mb-6">
              About Bayelsa<br />
              <span className="text-[#A51C30]">Medical University</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {heroContent}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-stat" style={{ color: '#A51C30' }}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600 text-body mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#A51C3020' }}>
                  <Target className="w-6 h-6" style={{ color: '#A51C30' }} />
                </div>
                <h2 className="text-title text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To provide world-class education in medical and health sciences, conduct cutting-edge research 
                addressing regional health challenges, and deliver compassionate healthcare services that 
                improve the quality of life for communities in the Niger Delta and beyond.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#1E1E1E20' }}>
                  <Eye className="w-6 h-6" style={{ color: '#1E1E1E' }} />
                </div>
                <h2 className="text-title text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To be the leading medical university in Africa, recognized globally for excellence in 
                healthcare education, research innovation, and community health transformation. We aspire 
                to be the institution of choice for aspiring medical professionals across the continent.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-body max-w-2xl mx-auto">
              The principles that guide everything we do at BMU
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#A51C3020' }}>
                    <Icon className="w-6 h-6" style={{ color: '#1E1E1E' }} />
                  </div>
                  <h3 className="text-subtitle text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-body">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose BMU */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-headline text-gray-900 mb-6">
                Why Choose Bayelsa Medical University?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A51C3020' }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#A51C30' }} />
                  </div>
                  <div>
                    <h4 className="text-subtitle text-gray-900">Comprehensive Programs</h4>
                    <p className="text-gray-600 text-body">From MBBS to specialized postgraduate degrees across 6 colleges</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1E1E1E20' }}>
                    <Users className="w-4 h-4" style={{ color: '#1E1E1E' }} />
                  </div>
                  <div>
                    <h4 className="text-subtitle text-gray-900">Expert Faculty</h4>
                    <p className="text-gray-600 text-body">Learn from leading medical professionals and researchers</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A51C3020' }}>
                    <Award className="w-4 h-4" style={{ color: '#1E1E1E' }} />
                  </div>
                  <div>
                    <h4 className="text-subtitle text-gray-900">Full Accreditation</h4>
                    <p className="text-gray-600 text-body">Recognized by NUC, MDCN, and all relevant professional bodies</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="text-white/90 mb-6">
                Whether you are a prospective student, researcher, or healthcare partner, 
                there is a place for you at BMU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/apply" 
                  className="px-6 py-3 bg-white text-[#1E1E1E] font-semibold text-center hover:bg-gray-100 transition"
                >
                  Apply Now
                </Link>
                <Link 
                  to="/about/leadership" 
                  className="px-6 py-3 border-2 border-white text-white font-semibold text-center hover:bg-white/10 transition"
                >
                  Meet Our Leadership
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-t" style={{ borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore More About BMU</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/about/history" 
              className="p-4 border text-center hover:border-[#A51C30] hover:text-[#A51C30] transition"
              style={{ borderColor: '#e5e4e7' }}
            >
              Our History
            </Link>
            <Link 
              to="/about/leadership" 
              className="p-4 border text-center hover:border-[#A51C30] hover:text-[#A51C30] transition"
              style={{ borderColor: '#e5e4e7' }}
            >
              Leadership
            </Link>
            <Link 
              to="/about/rankings" 
              className="p-4 border text-center hover:border-[#A51C30] hover:text-[#A51C30] transition"
              style={{ borderColor: '#e5e4e7' }}
            >
              Rankings & Awards
            </Link>
            <Link 
              to="/about/contact" 
              className="p-4 border text-center hover:border-[#A51C30] hover:text-[#A51C30] transition"
              style={{ borderColor: '#e5e4e7' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
