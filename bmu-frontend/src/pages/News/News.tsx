import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Newspaper,
  Megaphone,
  FileText
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  type: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  tags: string[];
}

const fallbackNews: NewsArticle[] = [
  {
    id: 1,
    slug: 'bmu-hosts-international-medical-conference-2024',
    title: 'BMU Hosts International Medical Conference 2024',
    excerpt: 'Over 500 healthcare professionals from 30 countries gathered at Bayelsa Medical University for the annual International Medical Conference focusing on emerging infectious diseases.',
    category: 'Event',
    type: 'news',
    author: 'Dr. Sarah Okonkwo',
    date: '2024-11-15',
    readTime: '5 min',
    image: '/news/conference-2024.jpg',
    featured: true,
    tags: ['Conference', 'Healthcare', 'International']
  },
  {
    id: 2,
    slug: 'new-research-center-for-tropical-diseases-opens',
    title: 'New Research Center for Tropical Diseases Opens',
    excerpt: 'BMU officially opens its state-of-the-art Tropical Disease Research Center, equipped with advanced laboratory facilities to combat malaria, dengue, and other tropical illnesses.',
    category: 'Research',
    type: 'news',
    author: 'Prof. John Ebieri',
    date: '2024-11-10',
    readTime: '4 min',
    image: '/news/research-center.jpg',
    featured: false,
    tags: ['Research', 'Facilities', 'Tropical Medicine']
  },
  {
    id: 3,
    slug: 'bmu-students-win-national-medical-quiz-competition',
    title: 'BMU Students Win National Medical Quiz Competition',
    excerpt: 'A team of five medical students from BMU emerged victorious at the 2024 National Medical Quiz Championship, beating 47 other universities.',
    category: 'Achievement',
    type: 'news',
    author: 'James Dappa',
    date: '2024-11-05',
    readTime: '3 min',
    image: '/news/quiz-winners.jpg',
    featured: false,
    tags: ['Students', 'Achievement', 'Competition']
  },
  {
    id: 4,
    slug: 'partnership-with-johns-hopkins-university-announced',
    title: 'Partnership with Johns Hopkins University Announced',
    excerpt: 'BMU signs historic partnership agreement with Johns Hopkins University for faculty exchange, joint research, and student mobility programs.',
    category: 'Partnership',
    type: 'news',
    author: 'Vice Chancellor Office',
    date: '2024-10-28',
    readTime: '6 min',
    image: '/news/partnership.jpg',
    featured: false,
    tags: ['Partnership', 'International', 'Academics']
  },
  {
    id: 5,
    slug: 'bmu-launches-scholarship-program-for-indigent-students',
    title: 'BMU Launches Scholarship Program for Indigent Students',
    excerpt: 'The Bayelsa State Government partners with BMU to provide full scholarships to 100 deserving students from economically disadvantaged backgrounds.',
    category: 'Announcement',
    type: 'news',
    author: 'Financial Aid Office',
    date: '2024-10-20',
    readTime: '4 min',
    image: '/news/scholarship.jpg',
    featured: false,
    tags: ['Scholarship', 'Financial Aid', 'Community']
  },
  {
    id: 6,
    slug: '2024-2025-academic-session-commences',
    title: '2024/2025 Academic Session Commences',
    excerpt: 'BMU welcomes over 1,200 new students across various programs as the new academic session begins with orientation activities.',
    category: 'Academic',
    type: 'news',
    author: 'Registrar Office',
    date: '2024-10-15',
    readTime: '3 min',
    image: '/news/matriculation.jpg',
    featured: false,
    tags: ['Academic', 'Students', 'Matriculation']
  },
  {
    id: 7,
    slug: 'bmu-receives-nuc-accreditation-for-three-new-programs',
    title: 'BMU Receives NUC Accreditation for Three New Programs',
    excerpt: 'The National Universities Commission grants full accreditation to BMU\'s new programs in Public Health, Medical Laboratory Science, and Pharmacy.',
    category: 'Accreditation',
    type: 'announcement',
    author: 'Academic Office',
    date: '2024-10-10',
    readTime: '4 min',
    image: '/news/accreditation.jpg',
    featured: false,
    tags: ['Accreditation', 'Programs', 'NUC']
  },
  {
    id: 8,
    slug: 'covid-19-vaccination-drive-reaches-10000-milestone',
    title: 'COVID-19 Vaccination Drive Reaches 10,000 Milestone',
    excerpt: 'BMU\'s community health initiative successfully vaccinates 10,000 residents of Bayelsa State against COVID-19.',
    category: 'Community',
    type: 'press',
    author: 'Community Health Center',
    date: '2024-10-05',
    readTime: '3 min',
    image: '/news/vaccination.jpg',
    featured: false,
    tags: ['Community', 'Health', 'COVID-19']
  }
];

const categories = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'Event', label: 'Events', icon: Calendar },
  { id: 'Research', label: 'Research', icon: TrendingUp },
  { id: 'Achievement', label: 'Achievements', icon: User },
  { id: 'Announcement', label: 'Announcements', icon: Megaphone },
  { id: 'Partnership', label: 'Partnerships', icon: ArrowRight }
];

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  news: { label: 'News', color: 'text-blue-600', bg: 'bg-blue-100' },
  announcement: { label: 'Announcement', color: 'text-purple-600', bg: 'bg-purple-100' },
  press: { label: 'Press Release', color: 'text-green-600', bg: 'bg-green-100' }
};

export const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeTab = searchParams.get('type') || 'all';

  const { data: newsArticles } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/public/news');
        const items = response.data?.items || response.data;
        if (Array.isArray(items) && items.length > 0) {
          return items.map((item: Record<string, unknown>): NewsArticle => ({
            id: Number(item.id),
            slug: String(item.slug || ''),
            title: String(item.title || ''),
            excerpt: String(item.excerpt || ''),
            category: (item as any).category_display || String(item.category || ''),
            type: (item as any).type || 'news',
            author: String(item.author || ''),
            date: (item as any).published_at ? (item as any).published_at.split('T')[0] : '',
            readTime: '3 min',
            image: (item as any).featured_image || '',
            featured: !!(item as any).is_featured,
            tags: [],
          }));
        }
        return fallbackNews;
      } catch {
        return fallbackNews;
      }
    },
    initialData: fallbackNews,
  });

  // Filter articles
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesType = activeTab === 'all' || article.type === activeTab;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredArticle = newsArticles.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured || activeTab !== 'all' || selectedCategory !== 'all');

  const setTab = (tab: string) => {
    if (tab === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', tab);
    }
    setSearchParams(searchParams);
  };

  return (
    <><Helmet><title>Latest News | Bayelsa Medical University</title><meta name="description"content="Stay updated with the latest news, announcements, and achievements from Bayelsa Medical University."/></Helmet><div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}><div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="hover:text-white transition">Home</Link><span>/</span><span className="text-white font-medium">News</span></div><h1 className="text-display text-white mb-6">
        Latest <span className="text-[#A51C30]">News</span></h1><p className="text-lead text-white/80 max-w-2xl">
        Stay updated with the latest happenings, achievements, and announcements from Bayelsa Medical University.
        </p></motion.div></div></section>

      {/* Search & Filter Bar */}
      <div className="bg-white border-b sticky top-[140px] z-30"><div className="container-custom py-6"><div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/><input
          type="text" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news articles..." className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"/></div>

        {/* Category Filter */}
        <div className="flex items-center gap-2"><Filter className="w-5 h-5 text-gray-400"/><select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent">
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select></div></div>

        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'all', label: 'All Articles', icon: Newspaper },
            { id: 'news', label: 'News', icon: FileText },
            { id: 'announcement', label: 'Announcements', icon: Megaphone },
            { id: 'press', label: 'Press Releases', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 transition ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E1E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              ><Icon className="w-4 h-4"/>
                {tab.label}
              </button>
            );
          })}
        </div></div></div>

      {/* Main Content */}
      <div className="container-custom py-12">
        {/* Featured Article */}
        {featuredArticle && activeTab === 'all' && selectedCategory === 'all' && searchQuery === '' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"><h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2><Link
            to={`/news/${featuredArticle.slug}`}
            className="group block bg-white overflow-hidden transition"><div className="grid md:grid-cols-2"><div className="bg-gray-200 min-h-[300px] flex items-center justify-center"><div className="text-center p-8"><Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4"/><p className="text-gray-500">Article Image</p></div></div><div className="p-8 flex flex-col justify-center"><div className="flex items-center gap-3 mb-4"><span className={`px-3 py-1 text-sm font-medium ${typeLabels[featuredArticle.type].bg} ${typeLabels[featuredArticle.type].color}`}>
              {typeLabels[featuredArticle.type].label}
            </span><span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600">
              {featuredArticle.category}
            </span></div><h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#1E1E1E] transition">
              {featuredArticle.title}
            </h3><p className="text-lg text-gray-600 mb-6">
              {featuredArticle.excerpt}
            </p><div className="flex items-center gap-6 text-sm text-gray-500"><div className="flex items-center gap-2"><User className="w-4 h-4"/>
              {featuredArticle.author}
            </div><div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>
              {featuredArticle.date}
            </div><div className="flex items-center gap-2"><Clock className="w-4 h-4"/>
              {featuredArticle.readTime}
            </div></div></div></div></Link></motion.section>
        )}

        {/* Articles Grid */}
        <section><h2 className="text-2xl font-bold text-gray-900 mb-6">
          {activeTab === 'all' && selectedCategory === 'all' ? 'Recent Articles' : 'Articles'}
        </h2>

        {regularArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white overflow-hidden shadow-sm transition group"><Link to={`/news/${article.slug}`}><div className="bg-gray-200 h-48 flex items-center justify-center"><Newspaper className="w-12 h-12 text-gray-400"/></div><div className="p-6"><div className="flex items-center gap-2 mb-3"><span className={`text-xs px-2 py-1 font-medium ${typeLabels[article.type].bg} ${typeLabels[article.type].color}`}>
                  {typeLabels[article.type].label}
                </span><span className="text-xs text-gray-500">{article.category}</span></div><h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#1E1E1E] transition line-clamp-2">
                  {article.title}
                </h3><p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p><div className="flex items-center justify-between text-sm text-gray-500"><span>{article.date}</span><span className="flex items-center gap-1 text-[#1E1E1E]">
                  Read <ChevronRight className="w-4 h-4"/></span></div></div></Link></motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16"><Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3><p className="text-gray-500">Try adjusting your search or filters.</p></div>
        )}
        </section>

        {/* Pagination */}
        {regularArticles.length > 0 && (
          <div className="flex justify-center mt-12"><div className="flex items-center gap-2"><button className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"disabled>
            Previous
          </button><button className="px-4 py-2 bg-[#1E1E1E] text-white">1</button><button className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50">2</button><button className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50">3</button><span className="px-2">...</span><button className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50">
            Next
          </button></div></div>
        )}

        {/* Newsletter Subscription */}
        <section className="mt-16"><div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] p-8 md:p-12 text-white"><div className="max-w-2xl mx-auto text-center"><h3 className="text-2xl md:text-3xl font-bold mb-4">
          Stay Updated with BMU News
        </h3><p className="text-white/80 mb-6">
          Subscribe to our newsletter to receive the latest news, announcements, and updates directly in your inbox.
        </p><div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"><input
          type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-[#A51C30]"/><button className="px-6 py-3 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition">
          Subscribe
        </button></div></div></div></section></div></div></>
  );
};
