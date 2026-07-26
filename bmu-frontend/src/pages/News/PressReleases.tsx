import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 FileText,
 Calendar,
 Download,
 Share2,
 ExternalLink,
 ChevronRight,
 Search,
 Newspaper,
 Quote
} from 'lucide-react';

interface PressReleaseItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  featured: boolean;
  featuredQuote?: string;
  quoteAuthor?: string;
  pdfUrl: string;
  tags: string[];
  relatedImages: number;
}

const fallbackPressReleases = [
 {
 id: 1,
 slug: 'bmu-signs-mou-with-international-health-partners',
 title: 'BMU Signs MoU with International Health Partners',
 excerpt: 'Bayelsa Medical University has signed a Memorandum of Understanding with leading international health organizations to enhance medical research and training capabilities.',
 content: 'Bayelsa Medical University (BMU) has entered into strategic partnerships with three international health organizations...',
 date: '2024-11-12',
 author: 'Public Relations Office',
 category: 'Partnership',
 featured: true,
 featuredQuote: 'This partnership represents a significant milestone in our journey to become a globally recognized center of medical excellence.',
 quoteAuthor: 'Prof. Osahon Enabulele, Vice Chancellor',
 pdfUrl: '#',
 tags: ['Partnership', 'International', 'Research'],
 relatedImages: 3
 },
 {
 id: 2,
 slug: 'bmu-receives-nuc-accreditation-for-new-programs',
 title: 'BMU Receives NUC Accreditation for New Programs',
 excerpt: 'The National Universities Commission has granted full accreditation to five new postgraduate programs at Bayelsa Medical University.',
 content: 'Following a rigorous evaluation process, the National Universities Commission (NUC) has granted full accreditation...',
 date: '2024-11-08',
 author: 'Academic Affairs',
 category: 'Accreditation',
 featured: false,
 pdfUrl: '#',
 tags: ['Accreditation', 'Academic', 'NUC'],
 relatedImages: 2
 },
 {
 id: 3,
 slug: 'groundbreaking-research-malaria-treatment',
 title: 'Groundbreaking Research on Malaria Treatment',
 excerpt: 'BMU researchers develop novel approach to malaria treatment showing promising results in clinical trials.',
 content: 'A team of researchers at the BMU Research Centre for Tropical Diseases has made a significant breakthrough...',
 date: '2024-11-05',
 author: 'Research Office',
 category: 'Research',
 featured: false,
 pdfUrl: '#',
 tags: ['Research', 'Malaria', 'Healthcare'],
 relatedImages: 4
 },
 {
 id: 4,
 slug: 'new-state-of-the-art-teaching-hospital-completed',
 title: 'New State-of-the-Art Teaching Hospital Completed',
 excerpt: 'Bayelsa Medical University unveils its new 500-bed teaching hospital equipped with modern medical technology.',
 content: 'The new Bayelsa Medical University Teaching Hospital represents a major investment in healthcare infrastructure...',
 date: '2024-10-30',
 author: 'Administration',
 category: 'Infrastructure',
 featured: false,
 pdfUrl: '#',
 tags: ['Infrastructure', 'Hospital', 'Healthcare'],
 relatedImages: 5
 },
 {
 id: 5,
 slug: 'bmu-ranks-top-10-medical-universities-nigeria',
 title: 'BMU Ranks Among Top 10 Medical Universities in Nigeria',
 excerpt: 'Latest national rankings place Bayelsa Medical University among the top medical institutions in the country.',
 content: 'In the recently released national university rankings by the Nigerian Universities Ranking Commission...',
 date: '2024-10-25',
 author: 'Public Relations Office',
 category: 'Ranking',
 featured: false,
 pdfUrl: '#',
 tags: ['Ranking', 'Achievement', 'Recognition'],
 relatedImages: 2
 },
 {
 id: 6,
 slug: 'bmu-alumna-wins-international-medical-award',
 title: 'BMU Alumna Wins International Medical Award',
 excerpt: 'Dr. Sarah Okonkwo, Class of 2019, receives prestigious international award for contributions to rural healthcare.',
 content: 'Dr. Sarah Okonkwo, an alumna of Bayelsa Medical University, has been honored with the International Rural Healthcare Award...',
 date: '2024-10-20',
 author: 'Alumni Relations',
 category: 'Alumni',
 featured: false,
 pdfUrl: '#',
 tags: ['Alumni', 'Award', 'Recognition'],
 relatedImages: 3
 }
];

const categories = [
 { id: 'all', label: 'All Press Releases' },
 { id: 'Partnership', label: 'Partnerships' },
 { id: 'Accreditation', label: 'Accreditation' },
 { id: 'Research', label: 'Research' },
 { id: 'Infrastructure', label: 'Infrastructure' },
 { id: 'Ranking', label: 'Rankings' },
 { id: 'Alumni', label: 'Alumni' }
];

export const PressReleases = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: pressReleasesData = fallbackPressReleases } = useQuery<PressReleaseItem[]>({
  queryKey: ['pressReleases'],
  queryFn: async () => {
    try {
      const response = await apiClient.get('/public/press-releases/');
      const items = response.data?.items || response.data;
      if (Array.isArray(items) && items.length > 0) {
        return items.map((item: Record<string, unknown>) => ({
          id: item.id as number,
          slug: item.slug as string,
          title: item.title as string,
          excerpt: (item.excerpt || '') as string,
          content: (item.content || '') as string,
          date: item.published_at ? (item.published_at as string).split('T')[0] : '',
          author: (item.author || 'Public Relations Office') as string,
          category: (item.category_display || item.category || 'General') as string,
          featured: (item.is_featured as boolean) || false,
          pdfUrl: '#',
          tags: [(item.category as string) || 'General'],
          relatedImages: 0,
        }));
      }
    } catch {
      // fall through
    }
    return fallbackPressReleases;
   },
  });

 // Filter press releases
 const filteredReleases = (pressReleasesData || []).filter(release => {
  const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  release.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
  return matchesSearch && matchesCategory;
 });

 const featuredRelease = filteredReleases.find(r => r.featured);
 const regularReleases = filteredReleases.filter(r => !r.featured || selectedCategory !== 'all' || searchQuery !== '');

 return (
  <><Helmet><title>Press Releases - Bayelsa Medical University</title><meta name="description"content="Official press releases and media statements from Bayelsa Medical University."/></Helmet><div className="min-h-screen bg-gray-50">
  {/* Hero */}
  <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}><div className="absolute inset-0 opacity-5" style={{
   backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="hover:text-white transition">Home</Link><span>/</span><Link to="/news" className="hover:text-white transition">News</Link><span>/</span><span className="text-white font-medium">Press Releases</span></div><h1 className="text-display text-white mb-6">
  Press <span className="text-[#A51C30]">Releases</span></h1><p className="text-lead text-white/80 max-w-2xl">
  Official statements, news, and media resources from Bayelsa Medical University
  </p></motion.div></div></section>

  {/* Search & Filter Bar */}
  <div className="bg-white border-b sticky top-[140px] z-30"><div className="container-custom py-6"><div className="flex flex-col md:flex-row gap-4">
  {/* Search */}
  <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input
  type="text" value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search press releases..." className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"/></div>

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
  {/* Featured Press Release */}
  {featuredRelease && selectedCategory === 'all' && searchQuery === '' && (
   <motion.section
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   className="mb-12"><h2 className="text-xl font-bold text-gray-900 mb-6">Featured Press Release</h2><div className="bg-white overflow-hidden"><div className="grid md:grid-cols-2"><div className="bg-gray-200 min-h-[300px] flex items-center justify-center"><div className="text-center p-8"><Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4"/><p className="text-gray-500">Press Release Image</p></div></div><div className="p-8 flex flex-col justify-center"><span className="inline-block px-3 py-1 text-sm font-medium bg-[#1E1E1E]/10 text-[#1E1E1E] mb-4 w-fit">
   {featuredRelease.category}
   </span><h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
   {featuredRelease.title}
   </h3><p className="text-lg text-gray-600 mb-6">
   {featuredRelease.excerpt}
   </p>

   {featuredRelease.featuredQuote && (
   <blockquote className="border-l-4 border-[#1E1E1E] pl-4 my-6"><Quote className="w-6 h-6 text-[#1E1E1E]/30 mb-2"/><p className="text-gray-700 italic">"{featuredRelease.featuredQuote}"</p><footer className="mt-2 text-sm text-gray-500">— {featuredRelease.quoteAuthor}</footer></blockquote>
   )}

   <div className="flex items-center gap-4 text-sm text-gray-500 mb-6"><span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {featuredRelease.date}
   </span><span className="flex items-center gap-2"><FileText className="w-4 h-4"/> {featuredRelease.author}
   </span></div><div className="flex flex-wrap gap-3"><Link
   to={`/news/${featuredRelease.slug}`}
   className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition">
   Read Full Release <ChevronRight className="w-5 h-5"/></Link><a
   href={featuredRelease.pdfUrl}
   className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"><Download className="w-5 h-5"/> Download PDF
   </a></div></div></div></div></motion.section>
  )}

  {/* Press Releases Grid */}
  <section><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-gray-900">
  {selectedCategory === 'all' && searchQuery === '' ? 'All Press Releases' : 'Press Releases'}
  </h2><span className="text-sm text-gray-500">
  {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''}
  </span></div>

  {regularReleases.length > 0 ? (
   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
   {regularReleases.map((release, index) => (
    <motion.article
    key={release.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white overflow-hidden shadow-sm transition group"><div className="bg-gray-200 h-48 flex items-center justify-center"><FileText className="w-12 h-12 text-gray-400"/></div><div className="p-6"><div className="flex items-center justify-between mb-3"><span className="text-xs px-2 py-1 font-medium bg-[#1E1E1E]/10 text-[#1E1E1E]">
    {release.category}
    </span><span className="text-xs text-gray-400">{release.date}</span></div><h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1E1E1E] transition line-clamp-2">
    {release.title}
    </h3><p className="text-gray-600 text-sm mb-4 line-clamp-3">
    {release.excerpt}
    </p><div className="flex flex-wrap gap-1 mb-4">
    {release.tags.slice(0, 3).map((tag: string) => (
     <span key={tag} className="text-xs text-gray-500">#{tag}</span>
    ))}
    </div><div className="flex items-center justify-between pt-4 border-t"><Link
     to={`/news/${release.slug}`}
    className="text-[#1E1E1E] font-medium text-sm flex items-center gap-1 hover:underline">
    Read More <ChevronRight className="w-4 h-4"/></Link><div className="flex gap-2"><a
    href={release.pdfUrl}
    className="p-2 hover:bg-gray-100 transition" title="Download PDF"><Download className="w-4 h-4 text-gray-500"/></a><button
    className="p-2 hover:bg-gray-100 transition" title="Share"><Share2 className="w-4 h-4 text-gray-500"/></button></div></div></div></motion.article>
   ))}
   </div>
  ) : (
   <div className="text-center py-16"><Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h3 className="text-xl font-medium text-gray-900 mb-2">No press releases found</h3><p className="text-gray-500">Try adjusting your search or filters.</p></div>
  )}
  </section>

  {/* Media Resources */}
  <section className="mt-16"><h2 className="text-2xl font-bold text-gray-900 mb-8">Media Resources</h2><div className="grid md:grid-cols-3 gap-8"><div className="bg-white p-6 shadow-sm"><div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center mb-4"><FileText className="w-6 h-6 text-[#1E1E1E]"/></div><h3 className="font-bold text-lg text-gray-900 mb-2">Media Kit</h3><p className="text-gray-600 text-sm mb-4">Download our official media kit including logos, brand guidelines, and high-resolution images.</p><a href="#" className="text-[#1E1E1E] font-medium text-sm flex items-center gap-1 hover:underline">
  Download Media Kit <Download className="w-4 h-4"/></a></div><div className="bg-white p-6 shadow-sm"><div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center mb-4"><ExternalLink className="w-6 h-6 text-[#A51C30]"/></div><h3 className="font-bold text-lg text-gray-900 mb-2">Contact Media Relations</h3><p className="text-gray-600 text-sm mb-4">For press inquiries, interview requests, and media partnerships.</p><a href="mailto:media@bmu.edu.ng" className="text-[#A51C30] font-medium text-sm flex items-center gap-1 hover:underline">
  media@bmu.edu.ng <ExternalLink className="w-4 h-4"/></a></div><div className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-6 text-white"><div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-4"><Share2 className="w-6 h-6"/></div><h3 className="font-bold text-lg mb-2">Follow BMU News</h3><p className="text-white/80 text-sm mb-4">Stay updated with the latest news and announcements from BMU.</p><div className="flex gap-3"><a href="#" className="w-8 h-8 bg-white/20 flex items-center justify-center text-sm hover:bg-white/30 transition">f</a><a href="#" className="w-8 h-8 bg-white/20 flex items-center justify-center text-sm hover:bg-white/30 transition">X</a><a href="#" className="w-8 h-8 bg-white/20 flex items-center justify-center text-sm hover:bg-white/30 transition">in</a></div></div></div></section>

  {/* Quick Links */}
  <section className="mt-16 bg-white p-8 shadow-sm"><h2 className="text-xl font-bold text-gray-900 mb-6">Related Pages</h2><div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4"><Link to="/news" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition group"><Newspaper className="w-5 h-5 text-[#1E1E1E]"/><span className="font-medium text-gray-700 group-hover:text-[#1E1E1E] transition">All News</span></Link><Link to="/news/announcements" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition group"><FileText className="w-5 h-5 text-[#1E1E1E]"/><span className="font-medium text-gray-700 group-hover:text-[#1E1E1E] transition">Announcements</span></Link><Link to="/events" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition group"><Calendar className="w-5 h-5 text-[#1E1E1E]"/><span className="font-medium text-gray-700 group-hover:text-[#1E1E1E] transition">Events</span></Link><Link to="/about/leadership" className="flex items-center gap-3 p-4 hover:bg-gray-50 transition group"><ExternalLink className="w-5 h-5 text-[#1E1E1E]"/><span className="font-medium text-gray-700 group-hover:text-[#1E1E1E] transition">Leadership</span></Link></div></section></div></div></>
 );
};
