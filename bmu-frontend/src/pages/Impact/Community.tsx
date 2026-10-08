import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Heart,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  Stethoscope,
  GraduationCap,
  HandHeart,
  Clock,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useImpactPrograms } from '../../services/apiHooks';

const programIcons = [Stethoscope, GraduationCap, Users, HandHeart];

const upcomingEvents = [
  {
    title: 'Free Eye Screening Camp',
    date: 'January 25, 2025',
    location: 'Amassoma Community Center',
    time: '9:00 AM - 4:00 PM'
  },
  {
    title: 'Diabetes Awareness Workshop',
    date: 'February 8, 2025',
    location: 'BMU Conference Hall',
    time: '10:00 AM - 2:00 PM'
  },
  {
    title: 'Women\'s Health Fair',
    date: 'February 15, 2025',
    location: 'Yenagoa Stadium',
    time: '8:00 AM - 6:00 PM'
  }
];

const impactStats = [
  { value: '50,000+', label: 'Community Members Served' },
  { value: '200+', label: 'Outreach Programs' },
  { value: '35', label: 'Partner Communities' },
  { value: '500+', label: 'Volunteers' }
];

export const Community = () => {
  const { data: programs, isLoading } = useImpactPrograms('community_health');

  return (
    <>
      <Helmet>
        <title>Community Outreach | Bayelsa Medical University</title>
        <meta name="description" content="BMU's community outreach programs including free medical camps, health education, and wellness initiatives serving the Niger Delta region." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#A51C30' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/impact" className="hover:text-white transition">Impact</Link>
              <span>/</span>
              <span className="text-white font-medium">Community Outreach</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Community <span className="text-[#A51C30]">Outreach</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Bringing quality healthcare and education to underserved communities across the Niger Delta through free medical camps, health education, and wellness programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Heart className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
                <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Our Community Programs</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Comprehensive outreach initiatives serving the healthcare needs of our communities
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#A51C30] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(programs ?? []).map((program, index) => {
                const Icon = programIcons[index % programIcons.length];
                const statsEntries = Object.entries(program.stats);
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-8 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-[#A51C30]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-title text-gray-900 mb-2">{program.title}</h3>
                        <p className="text-body text-gray-600">{program.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50">
                      {statsEntries.slice(0, 2).map(([key, val]) => (
                        <div key={key} className="text-center">
                          <div className="text-stat-sm text-[#1E1E1E]">{val.toLocaleString()}</div>
                          <p className="text-xs text-gray-500">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                      ))}
                    </div>

                    {program.partners.length > 0 && (
                      <div>
                        <p className="text-small font-semibold text-gray-700 mb-2">Partner Communities</p>
                        <div className="flex flex-wrap gap-2">
                          {program.partners.map((partner, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#A51C30]/10 text-[#A51C30]"
                            >
                              <MapPin className="w-3 h-3" />
                              {partner}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Join us at our upcoming community health events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#A51C30]/20 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#A51C30]" />
                </div>
                <h3 className="text-title text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2 text-body text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#A51C30]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A51C30]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A51C30]" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-headline text-white mb-4">Get Involved</h2>
              <p className="text-lead text-white/80 mb-6">
                Join our community outreach efforts as a volunteer, partner organization, or sponsor. Together, we can make a greater impact.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
                >
                  Volunteer With Us <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/impact/sustainability"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur p-8">
              <h3 className="text-title text-white mb-4">Ways to Support</h3>
              <ul className="space-y-3">
                {[
                  'Volunteer as a medical professional or student',
                  'Donate medical supplies or equipment',
                  'Sponsor a community health program',
                  'Partner as a community organization'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white/80">
                    <div className="w-6 h-6 bg-[#A51C30] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#1E1E1E]">{idx + 1}</span>
                    </div>
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
