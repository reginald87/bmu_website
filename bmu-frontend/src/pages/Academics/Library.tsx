import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
	BookOpen, 
	Search, 
	Laptop, 
	Clock, 
	MapPin, 
	Phone, 
	Mail, 
	Users,
	Database,
	Globe,
	FileText,
	Wifi,
	Printer,
	Coffee,
	Loader2
} from 'lucide-react';
import { useBooks, useDigitalResources, useLibraryServices, useLibraryStats, useLibraryHours, useLibraryGuidelines } from '../../services/apiHooks';

const iconMap: Record<string, React.ElementType> = {
	BookOpen, Search, Laptop, Clock, MapPin, Phone, Mail, Users,
	Database, Globe, FileText, Wifi, Printer, Coffee,
};

export const Library = () => {
	const { data: books, isLoading: booksLoading } = useBooks();
	const { data: digitalResources, isLoading: digitalLoading } = useDigitalResources();
	const { data: services } = useLibraryServices();
	const { data: stats } = useLibraryStats();
	const { data: openingHours } = useLibraryHours();
	const { data: guidelines } = useLibraryGuidelines();

	const [bookSearch, setBookSearch] = useState('');
	const [digitalSearch, setDigitalSearch] = useState('');

	const filteredBooks = (books ?? []).filter(book =>
		book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
		book.authors.toLowerCase().includes(bookSearch.toLowerCase())
	);

	const filteredDigital = (digitalResources ?? []).filter(d =>
		d.name.toLowerCase().includes(digitalSearch.toLowerCase()) ||
		d.description.toLowerCase().includes(digitalSearch.toLowerCase())
	);

	return (
	<>
 <Helmet>
 <title>Library | Bayelsa Medical University</title>
 <meta name="description" content="Explore BMU's modern library with extensive print and digital collections, study spaces, research databases, and 24/7 digital access." />
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
 <Link to="/academics" className="hover:text-white transition">Academics</Link>
 <span>/</span>
 <span className="text-white font-medium">Library</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Dr. <span className="text-[#A51C30]">Nabo</span> Graham-Douglas <span className="text-[#A51C30]">Library</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Your gateway to knowledge and research. Access world-class medical and academic 
 resources in a modern, comfortable learning environment.
 </p>
 </motion.div>
 </div>
 </section>

  {/* Stats */}
  <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
  <div className="container-custom">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {(stats ?? []).map((stat, index) => (
  <motion.div
  key={stat.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="text-center"
  >
  <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
  <p className="text-gray-600 text-body">{stat.label}</p>
  </motion.div>
  ))}
  </div>
  </div>
  </section>

 {/* Services */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-16">
 <h2 className="text-headline text-gray-900 mb-4">Library Services</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Comprehensive services to support your academic journey
 </p>
 </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {(services ?? []).map((service, index) => {
  const Icon = iconMap[service.icon] || BookOpen;
  return (
  <motion.div
  key={service.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="bg-white p-8 shadow-sm border border-gray-100 transition-shadow"
  >
  <div className="w-14 h-14 bg-[#1E1E1E]/10 flex items-center justify-center mb-6">
  <Icon className="w-7 h-7 text-[#1E1E1E]" />
  </div>
  <h3 className="text-title text-gray-900 mb-3">{service.title}</h3>
  <p className="text-body text-gray-600">{service.description}</p>
  </motion.div>
  );
  })}
 </div>
 </div>
 </section>

  {/* Book Collection */}
  <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="container-custom">
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="text-center mb-12"
  >
  <div className="flex items-center justify-center gap-3 mb-4">
  <BookOpen className="w-8 h-8 text-[#A51C30]" />
  <h2 className="text-headline text-gray-900">Book Collection</h2>
  </div>
  <p className="text-body text-gray-600 max-w-2xl mx-auto">
  Explore our extensive collection of medical textbooks, references, and academic resources.
  </p>
  </motion.div>

  <div className="max-w-md mx-auto mb-10">
  <div className="flex gap-2">
  <input 
  type="text" 
  placeholder="Search by title or author..."
  value={bookSearch}
  onChange={(e) => setBookSearch(e.target.value)}
  className="flex-1 px-4 py-3 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
  />
  </div>
  </div>

  {booksLoading ? (
  <div className="flex items-center justify-center py-16">
  <Loader2 className="w-10 h-10 text-[#A51C30] animate-spin" />
  </div>
  ) : (
  <>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredBooks.map((book) => (
  <motion.div
  key={book.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-6 border border-gray-100 hover:shadow-md transition"
  >
  <div className="flex items-start gap-3 mb-3">
  <BookOpen className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-1" />
  <h3 className="font-semibold text-gray-900">{book.title}</h3>
  </div>
  <p className="text-small text-gray-500 mb-2">by {book.authors}</p>
  <p className="text-small text-gray-600 mb-3 line-clamp-2">{book.description}</p>
  <div className="flex flex-wrap gap-2">
  {book.publication_year && (
  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600">{book.publication_year}</span>
  )}
  {book.isbn && (
  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-500">ISBN: {book.isbn}</span>
  )}
  <span className="px-2 py-1 bg-[#A51C30]/10 text-xs text-[#A51C30]">{book.resource_type}</span>
  </div>
  </motion.div>
  ))}
  </div>
  {!booksLoading && filteredBooks.length === 0 && (
  <p className="text-body text-gray-500 text-center py-12">No books found matching your search.</p>
  )}
  </>
  )}
  </div>
  </section>

  {/* Digital Resources */}
  <section className="py-20">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <div className="flex items-center gap-3 mb-6">
 <Database className="w-8 h-8 text-[#A51C30]" />
 <h2 className="text-headline text-gray-900">Digital Resources</h2>
 </div>
 <p className="text-body text-gray-600 mb-8">
 Access thousands of medical and academic databases from anywhere, anytime. 
 Our digital collection includes peer-reviewed journals, e-books, and 
 specialized medical resources.
 </p>

  <div className="mb-6">
  <div className="flex gap-2">
  <input 
  type="text" 
  placeholder="Search digital resources..."
  value={digitalSearch}
  onChange={(e) => setDigitalSearch(e.target.value)}
  className="flex-1 px-4 py-3 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
  />
  </div>
  </div>

  {digitalLoading ? (
  <div className="flex items-center justify-center py-12">
  <Loader2 className="w-8 h-8 text-[#A51C30] animate-spin" />
  </div>
  ) : (
  <div className="space-y-4">
  {filteredDigital.map((db) => (
  <a
  key={db.id}
  href={db.url}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-start gap-4 p-4 bg-white border border-gray-100 hover:border-[#A51C30]/30 transition group"
  >
  <div className="w-10 h-10 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
  <Globe className="w-5 h-5 text-[#A51C30]" />
  </div>
  <div>
  <h4 className="font-semibold text-gray-900 group-hover:text-[#A51C30] transition">{db.name}</h4>
  <p className="text-small text-gray-600">{db.description}</p>
  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600">
  {db.resource_type}
  </span>
  </div>
  </a>
  ))}
  {!digitalLoading && filteredDigital.length === 0 && (
  <p className="text-body text-gray-500 text-center py-8">No digital resources found.</p>
  )}
  </div>
  )}
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="space-y-8"
 >
 {/* Opening Hours */}
 <div className="bg-white p-8 shadow-sm border border-gray-100">
 <div className="flex items-center gap-3 mb-6">
 <Clock className="w-6 h-6 text-[#1E1E1E]" />
 <h3 className="text-title text-gray-900">Opening Hours</h3>
 </div>
  <div className="space-y-4">
  {(openingHours ?? []).map((item) => (
  <div key={item.id} className="flex justify-between items-center py-2">
  <span className="text-body text-gray-700">{item.day}</span>
  <span className="text-body font-medium text-[#1E1E1E]">{item.hours}</span>
  </div>
  ))}
 </div>
 </div>

 {/* Contact Info */}
 <div className="bg-[#1E1E1E] p-8">
 <h3 className="text-title text-white mb-6">Contact Information</h3>
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <MapPin className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <p className="text-white/80">University Library Complex, Main Campus, Yenagoa</p>
 </div>
 <div className="flex items-start gap-3">
 <Phone className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <p className="text-white/80">+234 803 111 0022</p>
 </div>
 <div className="flex items-start gap-3">
 <Mail className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <p className="text-white/80">library@bmu.edu.ng</p>
 </div>
 </div>
 </div>

 {/* Quick Search */}
 <div className="bg-[#f8f9fa] p-8 border border-gray-100">
 <div className="flex items-center gap-3 mb-4">
 <Search className="w-6 h-6 text-[#A51C30]" />
 <h3 className="text-title text-gray-900">Search Catalog</h3>
 </div>
 <p className="text-body text-gray-600 mb-4">
 Search for books, journals, and digital resources in our collection.
 </p>
 <div className="flex gap-2">
  <input 
  type="text" 
  placeholder="Search books..."
  value={bookSearch}
  onChange={(e) => setBookSearch(e.target.value)}
  className="flex-1 px-4 py-3 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
  />
 <button className="px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition">
 Search
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* Library Guidelines */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <h2 className="text-headline text-gray-900 mb-8 text-center">Library Guidelines</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {(guidelines ?? []).map((guideline) => (
  <motion.div
  key={guideline.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-6 border border-gray-100"
  >
  <FileText className="w-6 h-6 text-[#A51C30] mb-3" />
  <h4 className="font-semibold text-gray-900 mb-2">{guideline.title}</h4>
  <p className="text-small text-gray-600">{guideline.text}</p>
  </motion.div>
  ))}
 </div>
 </div>
 </section>
 </>
 );
};
