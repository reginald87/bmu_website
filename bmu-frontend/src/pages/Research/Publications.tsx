import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  BookOpen, 
  Award, 
  ArrowUpRight,
  Search,
  Filter,
  Calendar,
  Users
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePublications, usePageSections } from '../../services/apiHooks';

const fallbackStats = [
  { value: '200+', label: 'Publications', icon: FileText },
  { value: '1,500+', label: 'Total Citations', icon: Award },
  { value: '45', label: 'H-Index', icon: BookOpen },
  { value: '50+', label: 'Active Researchers', icon: Users }
];

export const Publications = () => {
  const { data: publications = [] } = usePublications();
  const { data: sections } = usePageSections('research/publications');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);

  const categories = useMemo(() => {
    const cats = [...new Set(publications.map(p => p.category).filter(Boolean))] as string[];
    return ['All', ...cats];
  }, [publications]);

  const filteredPublications = publications.filter(pub => {
  const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
  const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
  return matchesCategory && matchesSearch;
  });

 return (
 <>
 <Helmet>
 <title>Publications | Bayelsa Medical University</title>
 <meta name="description" content="Explore BMU's research publications in peer-reviewed journals, conferences, and books covering malaria, NCDs, environmental health, and medical education." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <Link to="/research" className="hover:text-white transition">Research</Link>
 <span>/</span>
 <span className="text-white font-medium">Publications</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Research <span className="text-[#A51C30]">Publications</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Discover our contributions to medical knowledge through peer-reviewed journals, 
 conference proceedings, and academic books.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {stats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <stat.icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Publications List */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 {/* Search and Filter */}
 <div className="mb-12 space-y-4">
 <div className="flex flex-col md:flex-row gap-4">
 <div className="relative flex-1">
 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 placeholder="Search publications..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
 />
 </div>
 <div className="flex items-center gap-2">
 <Filter className="w-5 h-5 text-gray-400" />
 <span className="text-gray-600">Filter:</span>
 </div>
 </div>

 <div className="flex flex-wrap gap-2">
 {categories.map((category) => (
 <button
 key={category}
 onClick={() => setSelectedCategory(category)}
 className={`px-4 py-2 text-sm font-medium transition ${
 selectedCategory === category
 ? 'bg-[#1E1E1E] text-white'
 : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
 }`}
 >
 {category}
 </button>
 ))}
 </div>
 </div>

 {/* Publications Grid */}
 <div className="space-y-6">
 {filteredPublications.map((pub, index) => (
 <motion.div
 key={pub.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.05 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex flex-col lg:flex-row lg:items-start gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
 <span className="px-2 py-1 bg-[#A51C30]/10 text-[#A51C30] text-xs font-medium">
 {pub.category}
 </span>
 <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
 {pub.type}
 </span>
 <span className="flex items-center gap-1 text-xs text-gray-500">
 <Calendar className="w-3 h-3" />
 {pub.year}
 </span>
 </div>

 <h3 className="text-title text-gray-900 mb-2 hover:text-[#1E1E1E] transition">
 {pub.title}
 </h3>

 <p className="text-body text-gray-600 mb-2">
 {pub.authors.join(', ')}
 </p>

 <p className="text-small text-gray-500 italic mb-3">
 {pub.journal}
 {pub.doi && (
 <span className="ml-2">
 DOI: <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#1E1E1E] hover:underline">{pub.doi}</a>
 </span>
 )}
 </p>

 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1 text-sm text-gray-600">
 <Award className="w-4 h-4" />
 {pub.citations} citations
 </span>
 </div>
 </div>

 <div className="flex lg:flex-col gap-2">
 <Link
 to={`/research/publications/${pub.id}`}
 className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:bg-[#1E1E1E]/90 transition"
 >
 View Paper
 <ArrowUpRight className="w-4 h-4" />
 </Link>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {filteredPublications.length === 0 && (
 <div className="text-center py-12">
 <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
 <p className="text-gray-500">No publications found matching your criteria.</p>
 </div>
 )}
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="container-custom text-center">
 <h2 className="text-headline text-white mb-4">
 Research with <span className="text-[#A51C30]">BMU</span>
 </h2>
 <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
 Join our research community and contribute to advancing medical knowledge 
 in the Niger Delta region.
 </p>
 <div className="flex flex-wrap justify-center gap-4">
 <a 
 href="mailto:research@bmu.edu.ng"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Collaborate with Us
 </a>
 </div>
 </div>
 </section>
 </>
 );
};
