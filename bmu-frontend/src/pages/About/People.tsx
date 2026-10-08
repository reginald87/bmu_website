import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Briefcase, Crown, ArrowRight, Award, BookOpen, Phone, Loader2 } from 'lucide-react';
import { usePeopleStats } from '../../services/apiHooks';

export const People = () => {
 const { data: stats, isLoading } = usePeopleStats();
 return (
 <>
 <Helmet>
 <title>People | Bayelsa Medical University</title>
 <meta name="description" content="Meet the people of Bayelsa Medical University - our leadership, faculty, and staff dedicated to healthcare excellence." />
 </Helmet>

 {/* Hero Section */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div className="absolute inset-0 opacity-10" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 >
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white font-medium">People</span>
 </div>

 <h1 className="text-display text-white mb-6">
 Our <span className="text-primary-600">People</span>
 </h1>
 <p className="text-lead text-white/80 max-w-3xl">
 The dedicated professionals who make Bayelsa Medical University a center of excellence in healthcare education and research.
 </p>
 </motion.div>
 </div>
 </section>

  {/* Stats Section */}
  <section className="py-12 -mt-10 relative z-10">
    <div className="container-custom">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-ink-900 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="bg-white p-6 border border-gray-100 text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 6%, transparent)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--color-ink-900)' }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-600)' }}>
              {stats?.total_personnel ?? 400}+
            </div>
            <div className="text-sm font-semibold text-gray-900">Total Personnel</div>
            <div className="text-xs text-gray-500 mt-1">Committed professionals</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 border border-gray-100 text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 6%, transparent)' }}>
              <Award className="w-6 h-6" style={{ color: 'var(--color-ink-900)' }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-600)' }}>
              85%
            </div>
            <div className="text-sm font-semibold text-gray-900">PhD Holders</div>
            <div className="text-xs text-gray-500 mt-1">Among faculty members</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 border border-gray-100 text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 6%, transparent)' }}>
              <BookOpen className="w-6 h-6" style={{ color: 'var(--color-ink-900)' }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-600)' }}>
              {stats?.department_count ?? 12}
            </div>
            <div className="text-sm font-semibold text-gray-900">Departments</div>
            <div className="text-xs text-gray-500 mt-1">Across all divisions</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 border border-gray-100 text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 6%, transparent)' }}>
              <Phone className="w-6 h-6" style={{ color: 'var(--color-ink-900)' }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-600)' }}>
              24/7
            </div>
            <div className="text-sm font-semibold text-gray-900">Support</div>
            <div className="text-xs text-gray-500 mt-1">Always available</div>
          </motion.div>
        </div>
      )}
    </div>
  </section>

  {/* Categories Section */}
  <section className="py-16">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-sm font-semibold tracking-wider uppercase" style={{ color: 'var(--color-primary-600)' }}>
          Explore Our Community
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--color-ink-900)' }}>
          Meet Our Team
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the passionate individuals across leadership, faculty, and staff who drive our mission forward.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {([
          { id: 'leadership', title: 'Leadership', description: 'Meet our visionary executive team leading Bayelsa Medical University towards excellence in healthcare education and research.', icon: Crown, count: `${stats?.leadership_count ?? 12}`, link: '/about/leadership', color: 'var(--color-ink-900)', bgColor: 'color-mix(in srgb, var(--color-ink-900) 6%, transparent)' },
          { id: 'faculty', title: 'Faculty', description: 'Our distinguished academic staff comprising world-class educators, researchers, and clinicians dedicated to shaping the next generation of healthcare professionals.', icon: GraduationCap, count: `${stats?.faculty_count ?? 150}+`, link: '/academics/faculty', color: 'var(--color-primary-600)', bgColor: 'color-mix(in srgb, var(--color-primary-600) 6%, transparent)' },
          { id: 'staff', title: 'Staff Directory', description: 'The dedicated administrative and support professionals who ensure smooth operations across all university departments and services.', icon: Briefcase, count: `${stats?.staff_count ?? 200}+`, link: '/about/staff', color: 'var(--color-primary-600)', bgColor: 'color-mix(in srgb, var(--color-primary-600) 8%, transparent)' },
        ] as const).map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Link
                to={category.link}
                className="group block h-full bg-white border border-gray-100 overflow-hidden transition-all duration-300"
              >
                {/* Header with icon */}
                <div className="h-32 relative overflow-hidden" style={{ backgroundColor: category.bgColor }}>
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${category.color.replace('#', '')}' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h20v20H0V0zm10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 37a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm20 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-20 h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  {/* Count badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 text-sm font-bold bg-white" style={{ color: category.color }}>
                    {category.count}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-ink-900 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: category.color }}>
                    Explore {category.title}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>

 {/* Featured Section - Quick Links */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Join Us CTA */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="bg-white p-8 border border-gray-100"
 >
 <div className="flex items-start gap-4">
 <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)' }}>
 <Users className="w-7 h-7" style={{ color: 'var(--color-ink-900)' }} />
 </div>
 <div>
 <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Team</h3>
 <p className="text-gray-600 text-sm mb-4">
 We're always looking for talented individuals who share our passion for healthcare excellence. Explore career opportunities at BMU.
 </p>
 <Link
 to="/careers"
 className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all"
 style={{ backgroundColor: 'var(--color-ink-900)', color: 'white' }}
 >
 View Open Positions
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </motion.div>

 {/* Contact CTA */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="bg-white p-8 border border-gray-100"
 >
 <div className="flex items-start gap-4">
 <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 6%, transparent)' }}>
 <Phone className="w-7 h-7" style={{ color: 'var(--color-primary-600)' }} />
 </div>
 <div>
 <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Directory</h3>
 <p className="text-gray-600 text-sm mb-4">
 Need to get in touch? Find contact information for all departments and personnel across the university.
 </p>
 <Link
 to="/contact"
 className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-all border-2"
 style={{ borderColor: 'var(--color-primary-600)', color: 'var(--color-primary-600)' }}
 >
 Contact Us
 <ArrowRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 </>
 );
};

export default People;
