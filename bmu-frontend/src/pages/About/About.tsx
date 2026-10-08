import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, BookOpen, HeartHandshake, Shield, ClipboardCheck, Sparkles, BadgeCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAboutPage } from '../../services/apiHooks';
import { useMemo } from 'react';
import { iconMap as iconRegistry } from '../../lib/icons';

const fallbackCoreValues = [
  { icon: HeartHandshake, title: 'Service', description: 'We believe that delivering excellent service to humanity is also serving God.' },
  { icon: Shield, title: 'Integrity', description: 'We are committed to upholding the truth and intellectual honesty in all our endeavors.' },
  { icon: Heart, title: 'Compassion', description: 'We show kindness and care towards our students, staff, and patients.' },
  { icon: Target, title: 'Dedication', description: 'We are dedicated to engaging in innovative medical science practices that will translate into improved quality of life for people.' },
  { icon: ClipboardCheck, title: 'Accountability', description: 'We are accountable for all our everyday decisions and actions to our institution, stakeholders, and society in general.' },
  { icon: Users, title: 'Collaboration', description: 'We value teamwork and support for each other in every way possible to achieve the University\'s purpose.' },
  { icon: Sparkles, title: 'Passion', description: 'We demonstrate uncommon enthusiasm and commitment to our work, students, staff, and patients.' },
];

const fallbackStats = [
  { value: '2019', label: 'Established', suffix: '' },
  { value: '2,148', label: 'Students', suffix: '' },
  { value: '7', label: 'Faculties', suffix: '' },
  { value: '25', label: 'Departments', suffix: '' },
];

const fallbackMission = 'BMU advances healthcare through quality education, evidence-based research, and compassionate service. We train competent professionals, foster innovation, and partner with communities to improve health outcomes locally and globally.';

const fallbackVision = 'To be a leading African medical university recognized globally for excellence in health education, research, innovation, and community impact.';

const fallbackWhyChoose = [
  { icon: BookOpen, title: 'Cutting-Edge Learning, Real-World Impact', description: 'At Bayelsa Medical University, our modern labs, world-class faculty, and hands-on training prepare students to lead in healthcare, science, and research \u2014 right from the heart of the Niger Delta.' },
  { icon: Heart, title: 'Excellence Rooted in Purpose', description: "We don't just teach medicine \u2014 we nurture purpose. BMU offers a student-centered education that empowers you to serve, innovate, and make a lasting difference in your community and beyond." },
  { icon: BadgeCheck, title: 'Affordable Quality, Global Standards', description: 'BMU combines affordability with international best practices, giving you access to quality education, clinical exposure, and global career opportunities \u2014 all within a supportive learning environment.' },
  { icon: Award, title: 'Academic Excellence', description: "At BMU, academic excellence isn't just a goal \u2014 it's our culture. With experienced faculty, rigorous programs, and a commitment to innovation, we equip students to excel locally and compete globally." },
];

const resolveIcon = (name?: string): LucideIcon => {
  if (!name) return Award;
  return iconRegistry[name] || Award;
};

export const About = () => {
  const { data: pageData } = useAboutPage();

  const heroContent = pageData?.hero_content || 'Bayelsa Medical University is a beacon of excellence in medical education, research, and compassionate care, committed to developing the next generation of healthcare leaders and innovators.';

  const quickStats = useMemo(() => {
    if (pageData?.stats?.length) {
      return pageData.stats.map(s => ({ value: s.value, label: s.label, suffix: s.suffix }));
    }
    return fallbackStats;
  }, [pageData]);

  const coreValues = useMemo(() => {
    if (pageData?.core_values?.length) {
      return pageData.core_values.map(v => ({
        icon: iconRegistry[v.icon_name] || resolveIcon(v.icon_name),
        title: v.title,
        description: v.description,
      }));
    }
    return fallbackCoreValues;
  }, [pageData]);

  const missionContent = pageData?.mission_content || fallbackMission;
  const visionContent = pageData?.vision_content || fallbackVision;

  const whyChoose = useMemo(() => {
    if (pageData?.why_choose?.length) {
      return pageData.why_choose.map(w => ({
        icon: resolveIcon(w.icon_name),
        title: w.title,
        description: w.description,
      }));
    }
    return fallbackWhyChoose;
  }, [pageData]);

  return (
    <>
      <Helmet>
        <title>About Us | Bayelsa Medical University</title>
        <meta name="description" content="Bayelsa Medical University (BMU) is a premier institution dedicated to excellence in healthcare education, research, and community service in Nigeria." />
      </Helmet>

      {/* Hero Section - pt-[180px] to clear fixed navbar */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
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
                {missionContent}
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
                {visionContent}
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
                {whyChoose.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div className="flex gap-4" key={index}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: index % 2 === 0 ? '#A51C3020' : '#1E1E1E20' }}>
                        <Icon className="w-4 h-4" style={{ color: index % 2 === 0 ? '#A51C30' : '#1E1E1E' }} />
                      </div>
                      <div>
                        <h4 className="text-subtitle text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 text-body">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
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
