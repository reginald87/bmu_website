import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, Bell, GraduationCap, Calendar, Info, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAnnouncements } from '../../services/apiHooks';

const typeIcons: Record<string, React.ElementType> = {
  alert: Bell,
  admission: GraduationCap,
  event: Calendar,
  general: Info,
};

const typeColors: Record<string, string> = {
  alert: '#DC2626',
  admission: '#2563EB',
  event: '#7C3AED',
  general: 'var(--color-ink-900)',
};

const typeLabels: Record<string, string> = {
  alert: 'Alert',
  admission: 'Admission / Recruitment',
  event: 'Event',
  general: 'General',
};

export const SiteAnnouncements = () => {
  const { data: announcements = [] } = useAnnouncements();

  return (
    <>
      <Helmet>
        <title>Announcements | Bayelsa Medical University</title>
        <meta name="description" content="Official announcements and advertisements from Bayelsa Medical University" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Announcements</span>
            </div>
            <h1 className="text-display text-white mb-6">
              <span className="text-primary-600">Announcements</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Official notices, admissions information, and important updates from Bayelsa Medical University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* List */}
      <section className="py-16">
        <div className="container-custom">
          {announcements.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No announcements at this time.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {announcements.map((a) => {
                const Icon = typeIcons[a.announcement_type] || Megaphone;
                const color = typeColors[a.announcement_type] || 'var(--color-ink-900)';
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border border-gray-200 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {a.image && (
                        <div className="md:w-48 shrink-0">
                          <img loading="lazy" decoding="async" src={a.image} alt={a.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white mb-3"
                          style={{ backgroundColor: color }}
                        >
                          <Icon size={12} />
                          {typeLabels[a.announcement_type]}
                        </div>
                        <h3 className="text-title text-gray-900 mb-2">{a.title}</h3>
                        {a.content && (
                          <p className="text-gray-600 text-body mb-3 whitespace-pre-line">{a.content}</p>
                        )}
                        {a.link_url && (
                          <a
                            href={a.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold transition"
                            style={{ color }}
                          >
                            {a.link_text || 'Learn More'} <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
