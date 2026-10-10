import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  MapPin,
  Users,
  Search,
 Play,
 FileText,
 Image as ImageIcon,
 ArrowLeft
} from 'lucide-react';
import { apiClient, ALLOW_API_MOCKS } from '../../services/api';

interface PastEvent {
 id: number;
 slug: string;
 title: string;
 description: string;
 date: string;
 time: string;
 location: string;
 category: string;
 attendees: number;
 hasVideo: boolean;
 hasPhotos: boolean;
 hasDocuments: boolean;
}

const fallbackPastEvents: PastEvent[] = [
 {
 id: 1,
 slug: 'international-medical-conference-2023',
 title: 'International Medical Conference 2023',
 description: 'Over 400 healthcare professionals gathered to discuss tropical diseases and global health challenges.',
 date: '2023-11-15',
 time: '9:00 AM - 5:00 PM',
 location: 'BMU Main Auditorium',
 category: 'Academic',
 attendees: 450,
 hasVideo: true,
 hasPhotos: true,
 hasDocuments: true
 },
 {
 id: 2,
 slug: 'matriculation-ceremony-2023',
 title: '2023/2024 Matriculation Ceremony',
 description: 'Official welcome ceremony for 1,000+ new students entering the university.',
 date: '2023-11-20',
 time: '10:00 AM - 1:00 PM',
 location: 'Convocation Arena',
 category: 'Academic',
 attendees: 2500,
 hasVideo: true,
 hasPhotos: true,
 hasDocuments: false
 },
 {
 id: 3,
 slug: 'research-excellence-awards-2023',
 title: 'Research Excellence Awards 2023',
 description: 'Annual celebration recognizing outstanding research contributions by faculty and students.',
 date: '2023-10-25',
 time: '4:00 PM - 7:00 PM',
 location: 'University Grand Hall',
 category: 'Research',
 attendees: 300,
 hasVideo: true,
 hasPhotos: true,
 hasDocuments: true
 },
 {
 id: 4,
 slug: 'community-health-fair-2023',
 title: 'Community Health Fair 2023',
 description: 'Free health screening and education program serving 2,000+ community members.',
 date: '2023-09-30',
 time: '8:00 AM - 6:00 PM',
 location: 'Yenagoa Community Center',
 category: 'Community',
 attendees: 2000,
 hasVideo: false,
 hasPhotos: true,
 hasDocuments: false
 },
 {
 id: 5,
 slug: 'alumni-reunion-2023',
 title: 'Alumni Reunion Gala 2023',
 description: 'Annual gathering of BMU alumni with networking and awards ceremony.',
 date: '2023-12-15',
 time: '6:00 PM - 11:00 PM',
 location: 'Rivers State Banquet Hall',
 category: 'Alumni',
 attendees: 600,
 hasVideo: true,
 hasPhotos: true,
 hasDocuments: false
 },
 {
 id: 6,
 slug: 'health-leadership-summit-2023',
 title: 'Healthcare Leadership Summit 2023',
 description: 'Workshop series for healthcare administrators and emerging leaders.',
 date: '2023-08-20',
 time: '9:00 AM - 4:00 PM',
 location: 'College of Health Sciences',
 category: 'Professional',
 attendees: 200,
 hasVideo: true,
 hasPhotos: false,
 hasDocuments: true
 }
];

const categories = [
 { id: 'all', label: 'All Categories' },
 { id: 'Academic', label: 'Academic' },
 { id: 'Research', label: 'Research' },
 { id: 'Community', label: 'Community' },
 { id: 'Professional', label: 'Professional' },
 { id: 'Alumni', label: 'Alumni' }
];

const years = ['All Years', '2023', '2022', '2021', '2020'];

export const PastEvents = () => {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('all');
 const [selectedYear, setSelectedYear] = useState('All Years');

  const { data: pastEvents = ALLOW_API_MOCKS ? fallbackPastEvents : [] } = useQuery<PastEvent[]>({
   queryKey: ['pastEvents'],
   queryFn: async () => {
    try {
     const response = await apiClient.get('/public/past-events');
     const items = response.data?.items || response.data;
     if (Array.isArray(items) && items.length > 0) {
       return items.map((item: Record<string, unknown>) => ({
         id: item.id as number,
         slug: item.slug as string,
         title: item.title as string,
         description: (item.description || '') as string,
         date: (item.event_date as string || '').split('T')[0],
         time: [item.start_time, item.end_time].filter(Boolean).join(' - ') || 'All day',
         location: (item.location || '') as string,
         category: (item.category_display || item.category || 'General') as string,
         attendees: (item.registered_count as number) || 0,
         hasVideo: false,
         hasPhotos: false,
         hasDocuments: false,
       }));
     }
    } catch {
     // fall through
    }
    return ALLOW_API_MOCKS ? fallbackPastEvents : [];
   },
  });

 const filteredEvents = pastEvents.filter(event => {
  const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  event.description.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
  const matchesYear = selectedYear === 'All Years' || event.date.includes(selectedYear);
  return matchesSearch && matchesCategory && matchesYear;
 });

 return (
  <><Helmet><title>Past Events Archive | Bayelsa Medical University</title><meta name="description"content="Browse our archive of past conferences, workshops, ceremonies, and community programs."/></Helmet><div className="min-h-screen bg-gray-50">
  {/* Hero */}
  <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}><div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="hover:text-white transition">Home</Link><span>/</span><Link to="/events" className="hover:text-white transition">Events</Link><span>/</span><span className="text-white font-medium">Past Events</span></div><Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"><ArrowLeft className="w-4 h-4"/> Back to Events
  </Link><h1 className="text-display text-white mb-6">
  Past Events <span className="text-primary-600">Archive</span></h1><p className="text-lead text-white/80 max-w-2xl">
  Browse through our archive of past conferences, workshops, and ceremonies
  </p></motion.div></div></section>

  {/* Filters */}
  <div className="bg-white border-b sticky top-[140px] z-30"><div className="container-custom py-6"><div className="flex flex-col md:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input
  type="text" value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search past events..." className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900"/></div><select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900">
  {categories.map(cat => (
  <option key={cat.id} value={cat.id}>{cat.label}</option>
  ))}
  </select><select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900">
  {years.map(year => (
  <option key={year} value={year}>{year}</option>
  ))}
  </select></div></div></div>

  {/* Events Grid */}
  <div className="container-custom py-12">
  {filteredEvents.length > 0 ? (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredEvents.map((event, index) => (
  <motion.article
  key={event.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  className="bg-white overflow-hidden shadow-sm transition group"><div className="bg-gray-200 h-48 flex items-center justify-center relative"><Calendar className="w-12 h-12 text-gray-400"/><div className="absolute top-4 right-4 flex gap-2">
  {event.hasVideo && (
  <span className="w-8 h-8 bg-black/50 flex items-center justify-center" title="Video Available"><Play className="w-4 h-4 text-white"/></span>
  )}
  {event.hasPhotos && (
  <span className="w-8 h-8 bg-black/50 flex items-center justify-center" title="Photos Available"><ImageIcon className="w-4 h-4 text-white"/></span>
  )}
  </div></div><div className="p-6"><span className="text-xs px-2 py-1 font-medium bg-gray-100 text-gray-600">
  {event.category}
  </span><h3 className="font-bold text-lg text-gray-900 mt-3 mb-2 group-hover:text-ink-900 transition line-clamp-2">
  {event.title}
  </h3><p className="text-gray-600 text-sm mb-4 line-clamp-2">
  {event.description}
  </p><div className="space-y-1 text-sm text-gray-500 mb-4"><div className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {event.date}
  </div><div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {event.location}
  </div><div className="flex items-center gap-2"><Users className="w-4 h-4"/> {event.attendees} attendees
  </div></div><div className="flex flex-wrap gap-2">
  {event.hasVideo && (
  <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition"><Play className="w-3 h-3"/> Watch
  </button>
  )}
  {event.hasPhotos && (
  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition"><ImageIcon className="w-3 h-3"/> Photos
  </button>
  )}
  {event.hasDocuments && (
  <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 text-sm hover:bg-green-100 transition"><FileText className="w-3 h-3"/> Materials
  </button>
  )}
  </div></div></motion.article>
  ))}
  </div>
  ) : (
  <div className="text-center py-16"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3><p className="text-gray-500">Try adjusting your search or filters.</p></div>
  )}
  </div></div></>
 );
};
