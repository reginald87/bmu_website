import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  Megaphone,
  ChevronRight,
  Search,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface Announcement {
  id: number;
  slug: string;
  title: string;
  content: string;
  priority: string;
  category: string;
  author: string;
  date: string;
  expiryDate: string;
  pinned: boolean;
  tags: string[];
}

const fallbackAnnouncements: Announcement[] = [
  {
    id: 1,
    slug: '2024-2025-academic-calendar-released',
    title: '2024/2025 Academic Calendar Released',
    content: 'The Academic Calendar for the 2024/2025 session has been approved by the Senate and is now available for all students and staff. Please note important dates for registration, examinations, and holidays.',
    priority: 'high',
    category: 'Academic',
    author: 'Registrar\'s Office',
    date: '2024-11-10',
    expiryDate: '2024-12-31',
    pinned: true,
    tags: ['Academic', 'Calendar', 'Important']
  },
  {
    id: 2,
    slug: 'late-registration-extension',
    title: 'Extension of Late Registration Period',
    content: 'Due to ongoing system upgrades, the late registration period has been extended by one week. Students who have not completed their registration are advised to do so immediately.',
    priority: 'high',
    category: 'Registration',
    author: 'Student Affairs',
    date: '2024-11-08',
    expiryDate: '2024-11-20',
    pinned: true,
    tags: ['Registration', 'Deadline', 'Students']
  },
  {
    id: 3,
    slug: 'new-library-hours',
    title: 'New Library Operating Hours',
    content: 'Effective November 15, 2024, the University Library will operate on extended hours during the examination period. The library will now be open from 7:00 AM to 11:00 PM on weekdays.',
    priority: 'medium',
    category: 'Facilities',
    author: 'Library Services',
    date: '2024-11-05',
    expiryDate: '2024-12-15',
    pinned: false,
    tags: ['Library', 'Facilities', 'Hours']
  },
  {
    id: 4,
    slug: 'hostel-allocation-results',
    title: 'Hostel Accommodation Allocation Results',
    content: 'The results for the 2024/2025 hostel accommodation allocation are now available. Students can check their status through the student portal. Unsuccessful applicants may apply for the waiting list.',
    priority: 'high',
    category: 'Accommodation',
    author: 'Student Affairs',
    date: '2024-11-03',
    expiryDate: '2024-11-30',
    pinned: false,
    tags: ['Hostel', 'Accommodation', 'Housing']
  },
  {
    id: 5,
    slug: 'faculty-recruitment-2024',
    title: 'Faculty Recruitment Exercise 2024',
    content: 'BMU is inviting applications from qualified candidates for various academic positions across all colleges. Interested applicants should visit the careers page for detailed requirements and application procedures.',
    priority: 'medium',
    category: 'Careers',
    author: 'Human Resources',
    date: '2024-10-28',
    expiryDate: '2024-12-15',
    pinned: false,
    tags: ['Careers', 'Faculty', 'Jobs']
  },
  {
    id: 6,
    slug: 'maintenance-power-outage',
    title: 'Scheduled Maintenance - Power Outage',
    content: 'Please be informed that there will be a scheduled power outage on November 20, 2024, from 10:00 AM to 2:00 PM due to electrical system maintenance. Essential services will be on backup power.',
    priority: 'high',
    category: 'Facilities',
    author: 'Facilities Management',
    date: '2024-11-01',
    expiryDate: '2024-11-20',
    pinned: false,
    tags: ['Maintenance', 'Power', 'Facilities']
  },
  {
    id: 7,
    slug: 'scholarship-opportunities-2024',
    title: '2024/2025 Scholarship Opportunities',
    content: 'Several scholarship opportunities are now open for eligible students. These include merit-based scholarships, needs-based grants, and external funding opportunities. Application deadline: December 1, 2024.',
    priority: 'medium',
    category: 'Financial Aid',
    author: 'Bursary Department',
    date: '2024-10-25',
    expiryDate: '2024-12-01',
    pinned: false,
    tags: ['Scholarships', 'Financial Aid', 'Students']
  },
  {
    id: 8,
    slug: 'covid-19-safety-update',
    title: 'COVID-19 Safety Protocols Update',
    content: 'Following recent health advisories, all students and staff are reminded to maintain COVID-19 safety protocols including regular hand washing, mask-wearing in crowded areas, and staying home when feeling unwell.',
    priority: 'medium',
    category: 'Health',
    author: 'University Health Services',
    date: '2024-10-20',
    expiryDate: '2025-01-31',
    pinned: false,
    tags: ['Health', 'COVID-19', 'Safety']
  }
];

const categories = [
  { id: 'all', label: 'All Announcements' },
  { id: 'Academic', label: 'Academic' },
  { id: 'Registration', label: 'Registration' },
  { id: 'Facilities', label: 'Facilities' },
  { id: 'Accommodation', label: 'Accommodation' },
  { id: 'Careers', label: 'Careers' },
  { id: 'Financial Aid', label: 'Financial Aid' },
  { id: 'Health', label: 'Health' }
];

const priorityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  high: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Info },
  low: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle }
};

export const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: announcements = fallbackAnnouncements } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/public/announcements/');
        const items = response.data?.items || response.data;
        if (Array.isArray(items) && items.length > 0) {
          return items.map((item: Record<string, unknown>) => ({
            id: item.id as number,
            slug: item.slug as string,
            title: item.title as string,
            content: (item.content || '') as string,
            priority: 'medium' as string,
            category: (item.category_display || item.category || 'General') as string,
            author: (item.author || 'BMU Administration') as string,
            date: item.published_at ? (item.published_at as string).split('T')[0] : '',
            expiryDate: '',
            pinned: (item.is_featured as boolean) || false,
            tags: [item.category as string].filter(Boolean),
          }));
        }
      } catch {
        // fall through
      }
      return fallbackAnnouncements;
    },
  });

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.pinned);

  return (
  <><Helmet><title>Official Announcements - Bayelsa Medical University</title><meta name="description"content="Official announcements for students, staff, and the BMU community."/></Helmet><div className="min-h-screen bg-gray-50">
  {/* Hero */}
  <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}><div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="text-white transition">Home</Link><span>/</span><Link to="/news" className="text-white transition">News</Link><span>/</span><span className="text-white font-medium">Announcements</span></div><h1 className="text-display text-white mb-6">
  Official <span className="text-[#A51C30]">Announcements</span></h1><p className="text-lead text-white/80 max-w-2xl">
  Important notices and updates for the BMU community
  </p></motion.div></div></section>

  {/* Search & Filter Bar */}
  <div className="bg-white border-b sticky top-[140px] z-30"><div className="container-custom py-6"><div className="flex flex-col md:flex-row gap-4">
  {/* Search */}
  <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input
  type="text" value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search announcements..." className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"/></div>

  {/* Category Filter */}
  <div className="flex items-center gap-2"><select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent">
  {categories.map(cat => (
  <option key={cat.id} value={cat.id}>{cat.label}</option>
  ))}
  </select></div></div></div></div>

  {/* Main Content */}
  <div className="container-custom py-12">
  {/* Pinned Announcements */}
  {pinnedAnnouncements.length > 0 && selectedCategory === 'all' && searchQuery === '' && (
  <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-12"><div className="flex items-center gap-2 mb-6"><Bell className="w-5 h-5 text-[#1E1E1E]"/><h2 className="text-xl font-bold text-gray-900">Important Announcements</h2></div><div className="grid md:grid-cols-2 gap-6">
  {pinnedAnnouncements.map((announcement) => {
  return (
  <div
  key={announcement.id}
  className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] p-6 text-white relative overflow-hidden"><div className="absolute top-4 right-4"><Bell className="w-5 h-5 text-white/60"/></div><div className="flex items-center gap-2 mb-3"><span className={`px-2 py-1 text-xs font-medium ${priorityConfig[announcement.priority].bg} ${priorityConfig[announcement.priority].color}`}>
  {announcement.priority.toUpperCase()}
  </span><span className="text-xs text-white/60">{announcement.category}</span></div><h3 className="font-bold text-xl mb-2">{announcement.title}</h3><p className="text-white/80 text-sm line-clamp-2 mb-4">{announcement.content}</p><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-white/60"><Calendar className="w-4 h-4"/>
  {announcement.date}
  </div><Link
   to={`/news/${announcement.slug}`}
   className="flex items-center gap-1 text-sm font-medium text-white underline">
   Read More <ChevronRight className="w-4 h-4"/></Link></div></div>
  );
  })}
  </div></motion.section>
  )}

  {/* All Announcements */}
  <section><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-900">
  {selectedCategory === 'all' && searchQuery === '' ? 'All Announcements' : 'Announcements'}
  </h2><span className="text-sm text-gray-500">
  {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
  </span></div>

  {regularAnnouncements.length > 0 ? (
  <div className="space-y-4">
  {regularAnnouncements.map((announcement, index) => {
  const PriorityIcon = priorityConfig[announcement.priority].icon;
  return (
  <motion.article
  key={announcement.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
  className="bg-white p-6 shadow-sm transition group"><div className="flex items-start gap-4"><div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${priorityConfig[announcement.priority].bg}`}><PriorityIcon className={`w-6 h-6 ${priorityConfig[announcement.priority].color}`} /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-2"><span className={`px-2 py-0.5 text-xs font-medium ${priorityConfig[announcement.priority].bg} ${priorityConfig[announcement.priority].color}`}>
  {announcement.priority.toUpperCase()}
  </span><span className="text-xs text-gray-400">{announcement.category}</span></div><h3 className="font-bold text-lg text-gray-900 group-hover:text-[#1E1E1E] transition line-clamp-1">
  {announcement.title}
  </h3><p className="text-gray-600 mt-1 line-clamp-2">{announcement.content}</p><div className="mt-3 flex items-center gap-4 text-sm text-gray-400"><span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {announcement.date}
  </span><span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Valid until {announcement.expiryDate}
  </span></div><div className="mt-3 flex flex-wrap gap-2">
  {announcement.tags.map((tag: string) => (
  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
  {tag}
  </span>
  ))}
  </div></div><Link
   to={`/news/${announcement.slug}`}
   className="self-center p-2 bg-gray-100 transition"><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E1E1E] transition"/></Link></div></motion.article>
  );
  })}
  </div>
  ) : (
  <div className="text-center py-16"><Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h3 className="text-xl font-medium text-gray-900 mb-2">No announcements found</h3><p className="text-gray-500">Try adjusting your search or filters.</p></div>
  )}
  </section>

  {/* Quick Links */}
  <section className="mt-16 grid md:grid-cols-3 gap-6"><Link
  to="/news" className="bg-white p-6 shadow-sm transition group"><div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center mb-4 group-hover:bg-[#1E1E1E]/20 transition"><Bell className="w-6 h-6 text-[#1E1E1E]"/></div><h3 className="font-bold text-lg text-gray-900 mb-2">All News</h3><p className="text-gray-600 text-sm mb-4">View all news, articles, and updates from BMU.</p><span className="text-[#1E1E1E] font-medium flex items-center gap-1">
  View News <ArrowRight className="w-4 h-4"/></span></Link><Link
  to="/news/press-releases" className="bg-white p-6 shadow-sm transition group"><div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center mb-4 group-hover:bg-[#A51C30]/20 transition"><Megaphone className="w-6 h-6 text-[#A51C30]"/></div><h3 className="font-bold text-lg text-gray-900 mb-2">Press Releases</h3><p className="text-gray-600 text-sm mb-4">Official statements and press releases from the university.</p><span className="text-[#A51C30] font-medium flex items-center gap-1">
  View Press Releases <ArrowRight className="w-4 h-4"/></span></Link><div className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-6 text-white"><div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-4"><Info className="w-6 h-6"/></div><h3 className="font-bold text-lg mb-2">Need Help?</h3><p className="text-white/80 text-sm mb-4">Have questions about an announcement? Contact the relevant department.</p><a
  href="mailto:info@bmu.edu.ng" className="text-[#A51C30] font-medium flex items-center gap-1 underline">
  Contact Us <ArrowRight className="w-4 h-4"/></a></div></section></div></div></>
  );
};
