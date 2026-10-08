import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon,
  X,
  FileText,
  Calendar,
  Users,
  BookOpen,
  ChevronRight,
  Filter,
  Loader2,
  type LucideIcon
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearchResults } from '../../services/apiHooks';

const typeIcons: Record<string, LucideIcon> = {
  page: FileText,
  event: Calendar,
  news: BookOpen,
  portal: Users
};

const categories = ['All', 'About', 'Academics', 'Admissions', 'Research', 'Events', 'News', 'Portals', 'Contact'];

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: searchData, isLoading } = useSearchResults(searchQuery);

  // Update URL params
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const allResults = searchData?.results ?? [];
  const results = selectedCategory === 'All'
    ? allResults
    : allResults.filter(item => item.type.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <Helmet>
        <title>Search | Bayelsa Medical University</title>
        <meta name="description" content="Search for programs, news, events, and information about Bayelsa Medical University." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] text-white">
          <div className="container-custom py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Search</h1>

              {/* Search Input */}
              <div className="max-w-2xl relative">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for programs, news, events, pages..."
                  className="w-full pl-16 pr-14 py-4 text-gray-900 text-lg focus:ring-4 focus:ring-white/30"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch} aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom py-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-gray-400 mr-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#1E1E1E] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Status */}
          {searchQuery && (
            <div className="mb-6 text-gray-600">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </div>
              ) : (
                <span>
                  Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
            </div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {!searchQuery ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-3">
                  {['Admissions', 'Programs', 'Research', 'Events', 'Student Portal', 'Contact'].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-white text-gray-600 hover:text-[#1E1E1E] transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Browse by Category</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Academics', path: '/academics', desc: 'Programs & courses' },
                    { label: 'Research', path: '/research', desc: 'Research centers & publications' },
                    { label: 'About', path: '/about', desc: 'University information' },
                    { label: 'News & Events', path: '/news', desc: 'Latest updates & happenings' }
                  ].map(item => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="p-4 bg-white transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#1E1E1E] transition">
                            {item.label}
                          </span>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1E1E1E] transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {results.map((result, index) => {
                  const Icon = typeIcons[result.type] || FileText;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={result.url}
                        className="block p-6 bg-white shadow-sm transition group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E1E1E]/20 transition">
                            <Icon className="w-6 h-6 text-[#1E1E1E]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 uppercase tracking-wide">
                                {result.type}
                              </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#1E1E1E] transition line-clamp-1">
                              {result.title}
                            </h3>
                            <p className="text-gray-600 mt-1 line-clamp-2">
                              {result.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-sm text-[#1E1E1E]">
                              <span className="font-medium">View</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 max-w-md mx-auto"
              >
                <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find anything matching "{searchQuery}". Try different keywords or browse by category.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 text-[#1E1E1E] font-medium hover:bg-[#1E1E1E]/10 transition"
                  >
                    Clear Search
                  </button>
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
                  >
                    Contact Support
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
