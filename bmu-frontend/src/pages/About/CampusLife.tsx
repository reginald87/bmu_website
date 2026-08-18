import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Quote, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  useCampusFeatures,
  useCampusStats,
  useCampusTestimonials,
  useCampusContact,
} from '../../services/apiHooks';
import { iconMap as iconRegistry } from '../../lib/icons';

const resolveIcon = (name?: string): LucideIcon => {
  if (!name) return Home;
  return iconRegistry[name] || Home;
};

const fallbackStats = [
  { id: 1, label: 'Students', value: '3,500+' },
  { id: 2, label: 'Student Organizations', value: '50+' },
  { id: 3, label: 'Campus Size', value: '200+ Acres' },
  { id: 4, label: 'Residential Halls', value: '6' },
  { id: 5, label: 'Dining Options', value: '4' },
  { id: 6, label: 'Sports Facilities', value: '8' },
];

const fallbackGallery = [
  { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', title: 'Main Campus Building', category: 'Architecture' },
  { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', title: 'Students in Library', category: 'Academic Life' },
  { src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', title: 'Medical Laboratory', category: 'Facilities' },
  { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', title: 'Sports Event', category: 'Student Life' },
  { src: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80', title: 'Graduation Ceremony', category: 'Events' },
  { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', title: 'Hospital Wing', category: 'Facilities' },
  { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', title: 'Student Discussion', category: 'Academic Life' },
  { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', title: 'Research Lab', category: 'Research' },
];

const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  housing: { title: 'Residential Life', subtitle: 'Your home away from home. Our residential halls provide a safe, comfortable, and inclusive living environment.' },
  dining: { title: 'Dining & Nutrition', subtitle: 'From local delicacies to international cuisine, our dining halls offer nutritious meals for every palate.' },
  wellness: { title: 'Health & Wellness', subtitle: 'Your well-being is our priority. Comprehensive health services and wellness programs support your mind, body, and spirit.' },
  organizations: { title: 'Student Organizations', subtitle: 'Join 50+ clubs and societies to pursue your passions, build leadership skills, and make lifelong friends.' },
  diversity: { title: 'Diversity & Inclusion', subtitle: 'We celebrate diversity and are committed to creating an inclusive environment where every student belongs.' },
  safety: { title: 'Safety & Security', subtitle: 'Your safety is paramount. We maintain a secure campus environment through comprehensive measures and 24/7 support.' },
};

const FeatureSection = ({ sectionKey, bgGray = false }: { sectionKey: string; bgGray?: boolean }) => {
  const { data: features = [] } = useCampusFeatures(sectionKey);
  if (!features.length) return null;
  const meta = SECTION_META[sectionKey];
    return (
      <section id={sectionKey} className={`py-16 scroll-mt-[180px] ${bgGray ? 'bg-[#f8f9fa]' : ''}`}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{meta?.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{meta?.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, i) => {
            const Icon = resolveIcon(item.icon ?? undefined);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow group"
              >
                <div className="h-1.5 bg-[#1E1E1E] group-hover:bg-[#A51C30] transition-colors" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 bg-[#1E1E1E]/10">
                      <Icon className="w-5 h-5 text-[#1E1E1E]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const CampusLife = () => {
  const { data: stats = [] } = useCampusStats();
  const { data: testimonials = [] } = useCampusTestimonials();
  const { data: contactInfo } = useCampusContact();
  const { data: tourFeatures = [] } = useCampusFeatures('virtual_tour');

  const heroContent = 'More than just academics — discover a vibrant community where learning meets life, friendships flourish, and future leaders are shaped.';

  const displayStats = stats.length ? stats : fallbackStats;

  return (
    <>
      <Helmet>
        <title>Campus Life | Bayelsa Medical University</title>
        <meta name="description" content="Experience vibrant campus life at BMU with world-class residential, dining, wellness, and recreational facilities designed for student success." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden bg-[#1E1E1E]">
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
              <span className="text-white font-medium">Campus Life</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Life at <span className="text-[#A51C30]">BMU</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">{heroContent}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b bg-[#f8f9fa]" style={{ borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {displayStats.map((stat, i) => (
              <motion.div
                key={stat.id ?? stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#A51C30]">{stat.value}</div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <FeatureSection sectionKey="housing" />
      <FeatureSection sectionKey="dining" bgGray />
      <FeatureSection sectionKey="wellness" />
      <FeatureSection sectionKey="organizations" bgGray />
      <FeatureSection sectionKey="diversity" />
      <FeatureSection sectionKey="safety" bgGray />

      {/* Virtual Tour */}
      {tourFeatures.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Campus</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Take a virtual tour of our beautiful campus from anywhere in the world.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tourFeatures.map((item, i) => {
                const Icon = resolveIcon(item.icon ?? undefined);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1E1E1E] p-6 text-center group cursor-pointer hover:-translate-y-1 transition-transform"
                  >
                    <div className="w-14 h-14 bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A51C30] transition-colors">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-[#1E1E1E]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider uppercase text-[#A51C30]">Student Voices</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">What Our Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-6 border border-white/10"
              >
                <Quote className="w-8 h-8 text-[#A51C30] mb-4 opacity-60" />
                <p className="text-white/80 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  {t.program && <p className="text-white/50 text-xs">{t.program}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold tracking-wider uppercase text-[#A51C30]">Visual Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-[#1E1E1E]">Campus Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the beauty and vibrancy of Bayelsa Medical University through our lens</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {fallbackGallery.map((photo, i) => (
              <motion.div
                key={photo.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative group break-inside-avoid overflow-hidden cursor-pointer"
              >
                <img src={photo.src} alt={photo.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ minHeight: i % 3 === 0 ? '320px' : i % 3 === 1 ? '240px' : '280px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A51C30]">{photo.category}</span>
                  <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/gallery" className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90">
              View Full Gallery
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact / Support */}
      {contactInfo && (
        <section className="py-16">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Life Support</h2>
              <p className="text-gray-600 mb-8">Our campus life team is here to help. Whether you have questions about housing, need wellness support, or want to join a club, we are just a call or visit away.</p>
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {contactInfo.address && (
                  <div className="flex items-start gap-3 p-4 bg-[#f8f9fa]">
                    <MapPin className="w-5 h-5 text-[#A51C30] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Address</p>
                      <p className="text-gray-600 text-sm">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-start gap-3 p-4 bg-[#f8f9fa]">
                    <Phone className="w-5 h-5 text-[#A51C30] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Phone</p>
                      <p className="text-gray-600 text-sm">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-start gap-3 p-4 bg-[#f8f9fa]">
                    <Mail className="w-5 h-5 text-[#A51C30] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Email</p>
                      <p className="text-gray-600 text-sm">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                {contactInfo.office_hours && (
                  <div className="flex items-start gap-3 p-4 bg-[#f8f9fa]">
                    <Clock className="w-5 h-5 text-[#A51C30] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Office Hours</p>
                      <p className="text-gray-600 text-sm">{contactInfo.office_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
