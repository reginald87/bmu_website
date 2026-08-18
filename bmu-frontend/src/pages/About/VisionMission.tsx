import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb, ArrowRight, Award, Leaf, Users, Microscope, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVisionMissionPage } from '../../services/apiHooks';
import { useMemo } from 'react';

const fallbackStrategicPillars = [
  {
    icon: Award,
    title: 'Academic Excellence',
    description: 'Strengthening quality assurance, curriculum innovation, faculty development, and student engagement to deliver teaching and assessment aligned with global best practices.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Ensuring long-term financial and environmental sustainability through diversified revenue streams, entrepreneurship, and the integration of green technologies such as solar energy and energy-efficient systems.',
  },
  {
    icon: Users,
    title: 'Partnerships & Engagement',
    description: 'Building strong collaborations with local, national, and international institutions, and deepening community outreach to directly address the health needs of Bayelsa State, the Niger Delta, and beyond.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Technology',
    description: 'Integrating advanced technologies \u2014 Artificial Intelligence (AI), Virtual Reality (VR), the Internet of Things (IoT), and telemedicine \u2014 into education, research, and administration.',
  },
  {
    icon: Microscope,
    title: 'Research Excellence',
    description: 'Establishing Centers of Excellence and a Global Research Incubator and Accelerator Hub to nurture high-impact research, attract international scholars, and reward outstanding academic and scientific achievement.',
  },
  {
    icon: HeartHandshake,
    title: 'Empowerment & Welfare',
    description: 'Creating a supportive and safe environment that prioritizes the welfare, career development, and mentorship of students and staff, fostering a community that is motivated, proud, and committed to excellence.',
  },
];

const fallbackCoreValues = [
  { title: 'Service', description: 'We believe that delivering excellent service to humanity is also serving God.' },
  { title: 'Integrity', description: 'We are committed to upholding the truth and intellectual honesty in all our endeavors.' },
  { title: 'Compassion', description: 'We show kindness and care towards our students, staff, and patients.' },
  { title: 'Dedication', description: 'We are dedicated to engaging in innovative medical science practices that will translate into improved quality of life for people.' },
  { title: 'Accountability', description: 'We are accountable for all our everyday decisions and actions to our institution, stakeholders, and society in general.' },
  { title: 'Collaboration', description: 'We value teamwork and support for each other in every way possible to achieve the University\'s purpose.' },
  { title: 'Passion', description: 'We demonstrate uncommon enthusiasm and commitment to our work, students, staff, and patients.' },
];

const pillarIconMap: Record<string, typeof Lightbulb> = {
  Award, Leaf, Users, Lightbulb, Microscope, HeartHandshake,
  'Academic Excellence': Award,
  'Sustainability': Leaf,
  'Partnerships & Engagement': Users,
  'Innovation & Technology': Lightbulb,
  'Research Excellence': Microscope,
  'Empowerment & Welfare': HeartHandshake,
};

export const VisionMission = () => {
  const { data: pageData } = useVisionMissionPage();

  const pageDescription = pageData?.hero_content || 'Bayelsa Medical University advances healthcare through quality education, evidence-based research, and compassionate service, guided by a compelling vision and a transformative mission.';

  const visionContent = pageData?.vision_content || 'To be a leading African medical university recognized globally for excellence in health education, research, innovation, and community impact.';

  const missionContent = pageData?.mission_content || 'BMU advances healthcare through quality education, evidence-based research, and compassionate service. We train competent professionals, foster innovation, and partner with communities to improve health outcomes locally and globally.';

  const strategicPillars = useMemo(() => {
    if (pageData?.strategic_pillars?.length) {
      return pageData.strategic_pillars.map(p => ({
        icon: pillarIconMap[p.title] || pillarIconMap[p.icon_name] || Lightbulb,
        title: p.title,
        description: p.description,
      }));
    }
    return fallbackStrategicPillars;
  }, [pageData]);

  const coreValues = useMemo(() => {
    if (pageData?.core_values?.length) {
      return pageData.core_values;
    }
    return fallbackCoreValues;
  }, [pageData]);

  return (
    <>
      <Helmet>
        <title>Vision & Mission | Bayelsa Medical University</title>
        <meta name="description" content="Discover BMU's vision to be Africa's leading medical university and our mission to transform healthcare through education, research, and service." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Vision & Mission</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-[#A51C30]">Vision & Mission</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {pageDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 border-l-4 border-[#A51C30] transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 flex items-center justify-center" style={{ backgroundColor: '#A51C3020' }}>
                  <Target className="w-7 h-7" style={{ color: '#A51C30' }} />
                </div>
                <h2 className="text-title text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {missionContent}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">
                  "We exist to educate, to discover, and to heal."
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 border-l-4 border-[#1E1E1E] transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 flex items-center justify-center" style={{ backgroundColor: '#1E1E1E20' }}>
                  <Eye className="w-7 h-7" style={{ color: '#1E1E1E' }} />
                </div>
                <h2 className="text-title text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {visionContent}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">
                  "Shaping the future of healthcare in Africa, one graduate at a time."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Strategic Pillars</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six strategic pillars that guide our journey toward achieving our vision and mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 shadow-sm border border-gray-100 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#A51C3020' }}>
                      <Icon className="w-6 h-6" style={{ color: '#1E1E1E' }} />
                    </div>
                    <div>
                      <h3 className="text-subtitle text-gray-900 mb-2">{pillar.title}</h3>
                      <p className="text-gray-600 text-body">{pillar.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that define who we are and guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-5 shadow-sm border border-gray-100 hover:border-[#A51C30] transition-colors"
              >
                <h4 className="text-subtitle text-gray-900 mb-1">{value.title}</h4>
                <p className="text-body text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-headline text-white mb-4">Join Us in Our Mission</h2>
            <p className="text-lead text-white/80 mb-8">
              Whether you are a prospective student, researcher, or healthcare partner, 
              there is a place for you in our vision to transform healthcare in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/apply" 
                className="px-8 py-4 font-semibold text-center flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ backgroundColor: '#A51C30', color: '#1E1E1E' }}
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about/leadership" 
                className="px-8 py-4 font-semibold text-center border-2 border-white text-white hover:bg-white/10 transition"
              >
                Meet Our Leadership
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
