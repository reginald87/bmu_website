import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
 Archive,
 Search,
 Calendar,
 FileText,
 Newspaper,
 ChevronRight,
 ExternalLink,
 Clock,
 Download,
 BookOpen,
 Building2,
 Briefcase,
 MessageSquare
} from 'lucide-react';
import { useArchivedContent } from '../../services/apiHooks';

// Types for archived items
interface ArchivedItem {
 id: string;
 type: 'news' | 'event' | 'announcement' | 'document' | 'job' | 'publication';
 title: string;
 description: string;
 date: string;
 category: string;
 originalUrl?: string;
 fileUrl?: string;
 fileSize?: string;
 archivedDate: string;
 archivedBy: string;
}

// Fallback archived data
const fallbackArchivedItems: ArchivedItem[] = [
 {
 id: '1',
 type: 'news',
 title: 'BMU Hosts International Medical Conference 2023',
 description: 'The annual international medical conference brought together healthcare professionals from across the globe to discuss emerging trends in medical education and research.',
 date: '2023-11-15',
 category: 'Events',
 originalUrl: '/news/bmu-hosts-international-medical-conference-2023',
 archivedDate: '2024-01-01',
 archivedBy: 'Admin'
 },
 {
 id: '2',
 type: 'event',
 title: '2023 Matriculation Ceremony',
 description: 'The matriculation ceremony for the 2023/2024 academic session was held at the university auditorium.',
 date: '2023-10-20',
 category: 'Ceremonies',
 originalUrl: '/events/2023-matriculation',
 archivedDate: '2024-01-15',
 archivedBy: 'Admin'
 },
 {
 id: '3',
 type: 'announcement',
 title: 'First Semester Examination Timetable 2023/2024',
 description: 'Official examination timetable for all departments. Students are advised to check their respective schedules.',
 date: '2023-12-01',
 category: 'Academic',
 archivedDate: '2024-02-01',
 archivedBy: 'Registrar'
 },
 {
 id: '4',
 type: 'document',
 title: '2023 Annual Report',
 description: 'Comprehensive annual report detailing university achievements, financial statements, and strategic goals.',
 date: '2023-12-31',
 category: 'Reports',
 fileUrl: '#',
 fileSize: '5.2 MB',
 archivedDate: '2024-02-15',
 archivedBy: 'Admin'
 },
 {
 id: '5',
 type: 'job',
 title: 'Senior Lecturer - Anatomy (2023)',
 description: 'Position for Senior Lecturer in the Department of Anatomy. Position has been filled.',
 date: '2023-09-01',
 category: 'Academic Staff',
 archivedDate: '2024-01-10',
 archivedBy: 'HR'
 },
 {
 id: '6',
 type: 'publication',
 title: 'Research on Tropical Diseases in the Niger Delta',
 description: 'Groundbreaking research publication by the Faculty of Basic Medical Sciences.',
 date: '2023-08-15',
 category: 'Research',
 fileUrl: '#',
 fileSize: '2.8 MB',
 archivedDate: '2024-03-01',
 archivedBy: 'Research Office'
 },
 {
 id: '7',
 type: 'news',
 title: 'New Medical Laboratory Complex Opening',
 description: 'The state-of-the-art medical laboratory complex was officially commissioned by the Governor.',
 date: '2023-07-20',
 category: 'Infrastructure',
 originalUrl: '/news/medical-laboratory-complex-opening',
 archivedDate: '2024-02-20',
 archivedBy: 'Admin'
 },
 {
 id: '8',
 type: 'announcement',
 title: '2023/2024 Academic Calendar',
 description: 'Full academic calendar including registration dates, semester schedules, and holidays.',
 date: '2023-08-01',
 category: 'Academic',
 fileUrl: '#',
 fileSize: '850 KB',
 archivedDate: '2024-03-15',
 archivedBy: 'Academic Office'
 },
 {
 id: '9',
 type: 'event',
 title: '2023 Convocation Ceremony',
 description: 'The 4th convocation ceremony where degrees were conferred upon graduating students.',
 date: '2023-11-25',
 category: 'Ceremonies',
 originalUrl: '/events/2023-convocation',
 archivedDate: '2024-01-20',
 archivedBy: 'Admin'
 },
 {
 id: '10',
 type: 'document',
 title: 'Student Handbook 2023/2024',
 description: 'Comprehensive guide for students covering academic policies, campus life, and resources.',
 date: '2023-09-15',
 category: 'Handbooks',
 fileUrl: '#',
 fileSize: '3.4 MB',
 archivedDate: '2024-02-28',
 archivedBy: 'Student Affairs'
 }
];

// Type icons and colors
const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
 news: { icon: Newspaper, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'News' },
 event: { icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Event' },
 announcement: { icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Announcement' },
 document: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Document' },
 job: { icon: Briefcase, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Job' },
 publication: { icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Publication' }
};

export const ArchivePage = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedType, setSelectedType] = useState<string>('All');
 const [selectedCategory, setSelectedCategory] = useState<string>('All');
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
 const [selectedItem, setSelectedItem] = useState<ArchivedItem | null>(null);

 const { data: apiArchived } = useArchivedContent();

 const archivedItems = (apiArchived && apiArchived.length > 0
   ? apiArchived.map((item) => ({
       id: String(item.id),
       type: item.content_type as ArchivedItem['type'],
       title: item.title,
       description: item.description,
       date: item.original_date,
       category: item.category,
       originalUrl: item.original_url || undefined,
       fileUrl: item.file_url || undefined,
       fileSize: item.file_size || undefined,
       archivedDate: item.original_date,
       archivedBy: item.archived_by,
     }))
   : fallbackArchivedItems
 );

 // Get unique categories
 const categories = Array.from(new Set(archivedItems.map(item => item.category)));

 // Filter items
 const filteredItems = archivedItems.filter(item => {
 const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
 item.description.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesType = selectedType === 'All' || item.type === selectedType;
 const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
 return matchesSearch && matchesType && matchesCategory;
 });

 // Sort by date (newest first)
 const sortedItems = [...filteredItems].sort((a, b) => 
 new Date(b.archivedDate).getTime() - new Date(a.archivedDate).getTime()
 );

 return (
 <>
 <Helmet>
 <title>Archive | Bayelsa Medical University</title>
 <meta name="description" content="Browse archived news, events, announcements, and documents from Bayelsa Medical University." />
 </Helmet>

 {/* Hero Section */}
 <section className="pt-[140px] pb-12" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="container-custom">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative z-10"
 >
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white">Archive</span>
 </div>

 <div className="flex items-center gap-4 mb-4">
 <div className="w-14 h-14 bg-white/20 flex items-center justify-center">
 <Archive className="w-7 h-7 text-white" />
 </div>
 <div>
 <h1 className="text-3xl md:text-4xl font-bold text-white">University Archive</h1>
 <p className="text-white/70 mt-1">Browse historical records, past events, and archived documents</p>
 </div>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Stats Bar */}
 <div className="bg-[#A51C30] py-4">
 <div className="container-custom">
 <div className="flex flex-wrap gap-8 text-sm">
 <div className="flex items-center gap-2">
 <FileText className="w-5 h-5 text-[#1E1E1E]" />
 <span className="font-semibold text-[#1E1E1E]">{archivedItems.length}</span>
 <span className="text-[#1E1E1E]/80">Total Items</span>
 </div>
 <div className="flex items-center gap-2">
 <Newspaper className="w-5 h-5 text-[#1E1E1E]" />
 <span className="font-semibold text-[#1E1E1E]">{archivedItems.filter(i => i.type === 'news').length}</span>
 <span className="text-[#1E1E1E]/80">News Articles</span>
 </div>
 <div className="flex items-center gap-2">
 <Calendar className="w-5 h-5 text-[#1E1E1E]" />
 <span className="font-semibold text-[#1E1E1E]">{archivedItems.filter(i => i.type === 'event').length}</span>
 <span className="text-[#1E1E1E]/80">Events</span>
 </div>
 <div className="flex items-center gap-2">
 <Building2 className="w-5 h-5 text-[#1E1E1E]" />
 <span className="font-semibold text-[#1E1E1E]">{categories.length}</span>
 <span className="text-[#1E1E1E]/80">Categories</span>
 </div>
 </div>
 </div>
 </div>

 {/* Filters & Search */}
 <section className="py-6 bg-white border-b sticky top-[70px] z-30">
 <div className="container-custom">
 <div className="flex flex-col lg:flex-row gap-4">
 {/* Search */}
 <div className="flex-1 relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 placeholder="Search archived items..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
 />
 </div>

 {/* Type Filter */}
 <div className="lg:w-48">
 <select
 value={selectedType}
 onChange={(e) => setSelectedType(e.target.value)}
 className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
 >
 <option value="All">All Types</option>
 <option value="news">News</option>
 <option value="event">Events</option>
 <option value="announcement">Announcements</option>
 <option value="document">Documents</option>
 <option value="job">Jobs</option>
 <option value="publication">Publications</option>
 </select>
 </div>

 {/* Category Filter */}
 <div className="lg:w-48">
 <select
 value={selectedCategory}
 onChange={(e) => setSelectedCategory(e.target.value)}
 className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
 >
 <option value="All">All Categories</option>
 {categories.map(cat => (
 <option key={cat} value={cat}>{cat}</option>
 ))}
 </select>
 </div>

 {/* View Toggle */}
 <div className="flex bg-gray-100 p-1">
 <button
 onClick={() => setViewMode('list')}
 className={`px-4 py-2 rounded-md text-sm font-medium transition ${
 viewMode === 'list' ? 'bg-white text-[#1E1E1E] shadow-sm' : 'text-gray-600'
 }`}
 >
 List
 </button>
 <button
 onClick={() => setViewMode('grid')}
 className={`px-4 py-2 rounded-md text-sm font-medium transition ${
 viewMode === 'grid' ? 'bg-white text-[#1E1E1E] shadow-sm' : 'text-gray-600'
 }`}
 >
 Grid
 </button>
 </div>
 </div>

 <p className="text-sm text-gray-600 mt-4">
 Showing {sortedItems.length} of {archivedItems.length} archived items
 </p>
 </div>
 </section>

 {/* Archive Items */}
 <section className="py-12 bg-gray-50 min-h-screen">
 <div className="container-custom">
 {viewMode === 'list' ? (
 <div className="space-y-4">
 {sortedItems.map((item, index) => {
 const config = typeConfig[item.type];
 const Icon = config.icon;
 
 return (
 <motion.div
 key={item.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 className="bg-white p-6 transition-shadow cursor-pointer"
 onClick={() => setSelectedItem(item)}
 >
 <div className="flex gap-4">
 {/* Type Icon */}
 <div className={`w-12 h-12 ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
 <Icon className={`w-6 h-6 ${config.color}`} />
 </div>

 {/* Content */}
 <div className="flex-1 min-w-0">
 <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
 <div>
 <span className={`inline-block px-2 py-1 text-xs font-medium ${config.bgColor} ${config.color} mb-2`}>
 {config.label}
 </span>
 <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
 </div>
 <div className="flex items-center gap-2 text-sm text-gray-500">
 <Clock className="w-4 h-4" />
 <span>Archived: {item.archivedDate}</span>
 </div>
 </div>

 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
 <span className="flex items-center gap-1">
 <Calendar className="w-4 h-4" />
 {item.date}
 </span>
 <span className="px-2 py-1 bg-gray-100 text-gray-700">
 {item.category}
 </span>
 {item.fileSize && (
 <span className="flex items-center gap-1">
 <FileText className="w-4 h-4" />
 {item.fileSize}
 </span>
 )}
 <span className="text-gray-400">by {item.archivedBy}</span>
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2">
 {item.fileUrl && (
 <button className="p-2 hover:bg-gray-100 transition" title="Download">
 <Download className="w-5 h-5 text-gray-600" />
 </button>
 )}
 {item.originalUrl && (
 <Link
 to={item.originalUrl}
 className="p-2 hover:bg-gray-100 transition"
 title="View Original"
 onClick={(e) => e.stopPropagation()}
 >
 <ExternalLink className="w-5 h-5 text-gray-600" />
 </Link>
 )}
 <ChevronRight className="w-5 h-5 text-gray-400" />
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {sortedItems.map((item, index) => {
 const config = typeConfig[item.type];
 const Icon = config.icon;

 return (
 <motion.div
 key={item.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 className="bg-white overflow-hidden transition-shadow cursor-pointer"
 onClick={() => setSelectedItem(item)}
 >
 <div className={`h-2 ${config.bgColor.replace('bg-', 'bg-').replace('100', '500')}`} />
 <div className="p-6">
 <div className="flex items-start justify-between mb-4">
 <div className={`w-10 h-10 ${config.bgColor} flex items-center justify-center`}>
 <Icon className={`w-5 h-5 ${config.color}`} />
 </div>
 <span className={`px-2 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}>
 {config.label}
 </span>
 </div>

 <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
 <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

 <div className="flex items-center justify-between text-sm text-gray-500">
 <span className="flex items-center gap-1">
 <Calendar className="w-4 h-4" />
 {item.date}
 </span>
 <span>{item.category}</span>
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 )}

 {sortedItems.length === 0 && (
 <div className="text-center py-16">
 <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
 <h3 className="text-xl font-semibold text-gray-900 mb-2">No archived items found</h3>
 <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
 </div>
 )}
 </div>
 </section>

 {/* Detail Modal */}
 {selectedItem && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
 onClick={() => setSelectedItem(null)}
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
 >
 <div className="sticky top-0 bg-white border-b p-6 z-10">
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 ${typeConfig[selectedItem.type].bgColor} flex items-center justify-center`}>
 {(() => {
 const Icon = typeConfig[selectedItem.type].icon;
 return <Icon className={`w-6 h-6 ${typeConfig[selectedItem.type].color}`} />;
 })()}
 </div>
 <div>
 <span className={`inline-block px-2 py-1 text-xs font-medium ${typeConfig[selectedItem.type].bgColor} ${typeConfig[selectedItem.type].color} mb-1`}>
 {typeConfig[selectedItem.type].label}
 </span>
 <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
 </div>
 </div>
 <button
 onClick={() => setSelectedItem(null)}
 className="p-2 hover:bg-gray-100 transition"
 >
 <span className="sr-only">Close</span>
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>

 <div className="p-6 space-y-6">
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
 <p className="text-gray-700">{selectedItem.description}</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-1">Original Date</h3>
 <p className="text-gray-600 flex items-center gap-2">
 <Calendar className="w-4 h-4" />
 {selectedItem.date}
 </p>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-1">Category</h3>
 <p className="text-gray-600">{selectedItem.category}</p>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-1">Archived Date</h3>
 <p className="text-gray-600 flex items-center gap-2">
 <Clock className="w-4 h-4" />
 {selectedItem.archivedDate}
 </p>
 </div>
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-1">Archived By</h3>
 <p className="text-gray-600">{selectedItem.archivedBy}</p>
 </div>
 {selectedItem.fileSize && (
 <div>
 <h3 className="text-sm font-semibold text-gray-900 mb-1">File Size</h3>
 <p className="text-gray-600 flex items-center gap-2">
 <FileText className="w-4 h-4" />
 {selectedItem.fileSize}
 </p>
 </div>
 )}
 </div>

 <div className="flex gap-3 pt-4 border-t">
 {selectedItem.fileUrl && (
 <button className="flex-1 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition flex items-center justify-center gap-2">
 <Download className="w-5 h-5" />
 Download File
 </button>
 )}
 {selectedItem.originalUrl && (
 <Link
 to={selectedItem.originalUrl}
 className="flex-1 py-3 border border-[#1E1E1E] text-[#1E1E1E] font-medium hover:bg-[#1E1E1E]/5 transition flex items-center justify-center gap-2"
 >
 <ExternalLink className="w-5 h-5" />
 View Original
 </Link>
 )}
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </>
 );
};

export default ArchivePage;
