import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Grid,
  ArrowRight
} from 'lucide-react';
import { useAllEvents } from '../../services/apiHooks';
import { EventRegistrationModal } from '../../components/events/EventRegistrationModal';
import type { EventData } from '../../services/mockData';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'academic', label: 'Academic' },
  { id: 'research', label: 'Research' },
  { id: 'community', label: 'Community' },
  { id: 'professional', label: 'Professional' },
  { id: 'alumni', label: 'Alumni' },
];

const typeIcons: Record<string, string> = {
  conference: '🎤',
  ceremony: '🎓',
  symposium: '🔬',
  workshop: '🛠️',
  outreach: '🏥',
  social: '🎉',
};

const formatTime = (start: string | null, end: string | null): string => {
  if (!start) return '';
  return end ? `${start} - ${end}` : start;
};

export const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [registeringEvent, setRegisteringEvent] = useState<EventData | null>(null);

  const { data: events = [] } = useAllEvents();

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvent = events.find(e => e.is_featured);
  const regularEvents = filteredEvents.filter(e =>
    !e.is_featured || selectedCategory !== 'all' || searchQuery !== ''
  );

  return (
    <>
      <Helmet>
        <title>Upcoming Events | Bayelsa Medical University</title>
        <meta name="description" content="Discover upcoming conferences, workshops, ceremonies, and community events at Bayelsa Medical University." />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="container-custom relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 text-sm mb-6">
                <Link to="/" className="text-white/60 hover:text-white transition">Home</Link>
                <span className="text-white/60">/</span>
                <span className="text-white font-medium">Events</span>
              </div>
              <h1 className="text-display text-white mb-6">
                Upcoming <span className="text-primary-600">Events</span>
              </h1>
              <p className="text-lead text-white/80 max-w-2xl">
                Join us for conferences, workshops, ceremonies, and community programs that advance healthcare education and research.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="bg-white border-b sticky top-[140px] z-30">
          <div className="container-custom py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition ${viewMode === 'grid' ? 'bg-ink-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition ${viewMode === 'list' ? 'bg-ink-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <CalendarIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          {featuredEvent && selectedCategory === 'all' && searchQuery === '' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Event</h2>
              <div className="bg-white overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gray-200 min-h-[300px] flex items-center justify-center">
                    <div className="text-center p-8">
                      <span className="text-6xl">{typeIcons[featuredEvent.event_type] || '📅'}</span>
                      {featuredEvent.featured_image ? (
                        <img loading="lazy" decoding="async" src={featuredEvent.featured_image} alt={featuredEvent.title} className="w-full h-full object-cover" />
                      ) : (
                        <p className="text-gray-500 mt-4">Event Image</p>
                      )}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-sm font-medium bg-ink-900/10 text-ink-900">
                        {featuredEvent.category_display}
                      </span>
                      {featuredEvent.registration_open && (
                        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-600">
                          Registration Open
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {featuredEvent.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {featuredEvent.description}
                    </p>
                    <div className="space-y-3 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-ink-900" />
                        <span>{featuredEvent.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-ink-900" />
                        <span>{formatTime(featuredEvent.start_time, featuredEvent.end_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-ink-900" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-ink-900" />
                        <span>
                          {featuredEvent.max_attendees
                            ? `${featuredEvent.registered_count} / ${featuredEvent.max_attendees} registered`
                            : `${featuredEvent.registered_count} registered`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link
                        to={`/events/${featuredEvent.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white font-semibold hover:bg-ink-900/90 transition"
                      >
                        View Details <ArrowRight className="w-5 h-5" />
                      </Link>
                      {featuredEvent.registration_open && (
                        <button
                          onClick={() => setRegisteringEvent(featuredEvent)}
                          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-ink-900 text-ink-900 font-semibold hover:bg-ink-900 hover:text-white transition"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedCategory === 'all' && searchQuery === '' ? 'All Events' : 'Events'}
            </h2>

            {regularEvents.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularEvents.map((event, index) => (
                    <motion.article
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white overflow-hidden shadow-sm transition group"
                    >
                      <Link to={`/events/${event.slug}`}>
                        <div className="bg-gray-200 h-48 flex items-center justify-center">
                          <span className="text-5xl">{typeIcons[event.event_type] || '📅'}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs px-2 py-1 font-medium bg-ink-900/10 text-ink-900">
                              {event.category_display}
                            </span>
                            {event.registration_open && (
                              <span className="text-xs px-2 py-1 font-medium bg-green-100 text-green-600">Open</span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-ink-900 transition line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {event.event_date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(event.start_time, event.end_time)}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {regularEvents.map((event, index) => (
                    <motion.article
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 shadow-sm transition group"
                    >
                      <Link to={`/events/${event.slug}`} className="flex gap-6">
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">{typeIcons[event.event_type] || '📅'}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 font-medium bg-ink-900/10 text-ink-900">
                              {event.category_display}
                            </span>
                            {event.registration_open && (
                              <span className="text-xs px-2 py-1 font-medium bg-green-100 text-green-600">
                                Registration Open
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-ink-900 transition">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> {event.event_date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {formatTime(event.start_time, event.end_time)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {event.location}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </section>

          <section className="mt-16 grid md:grid-cols-3 gap-8">
            <Link to="/events/calendar" className="bg-white p-6 shadow-sm transition group">
              <div className="w-12 h-12 bg-ink-900/10 flex items-center justify-center mb-4 group-hover:bg-ink-900/20 transition">
                <CalendarIcon className="w-6 h-6 text-ink-900" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Event Calendar</h3>
              <p className="text-gray-600 text-sm mb-4">View all events in a calendar format and plan your schedule.</p>
              <span className="text-ink-900 font-medium flex items-center gap-1">
                View Calendar <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/events/past" className="bg-white p-6 shadow-sm transition group">
              <div className="w-12 h-12 bg-primary-600/10 flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Past Events</h3>
              <p className="text-gray-600 text-sm mb-4">Browse through our archive of past conferences and programs.</p>
              <span className="text-primary-600 font-medium flex items-center gap-1">
                View Archive <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <div className="bg-gradient-to-br from-ink-900 to-primary-600 p-6 text-white">
              <div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Host an Event</h3>
              <p className="text-white/80 text-sm mb-4">Interested in hosting a conference or workshop at BMU?</p>
              <a href="mailto:events@bmu.edu.ng" className="text-white font-medium flex items-center gap-1 underline">
                Contact Us <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </div>
      </div>

      {registeringEvent && (
        <EventRegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
        />
      )}
    </>
  );
};
