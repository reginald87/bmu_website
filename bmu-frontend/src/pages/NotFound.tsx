import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 Home,
 Search,
 ArrowLeft,
 HelpCircle,
 FileQuestion,
 MapPin
} from 'lucide-react';

const quickLinks = [
 { icon: Home, label: 'Home', path: '/', description: 'Return to homepage' },
 { icon: Search, label: 'Search', path: '/search', description: 'Search our website' },
 { icon: MapPin, label: 'Sitemap', path: '/about', description: 'Browse our sections' },
 { icon: HelpCircle, label: 'Contact', path: '/contact', description: 'Get assistance' }
];

const popularPages = [
 { label: 'Admissions', path: '/academics/admissions' },
 { label: 'Programs', path: '/academics/programs' },
 { label: 'Research', path: '/research' },
 { label: 'News', path: '/news' },
 { label: 'Events', path: '/events' },
 { label: 'Apply Now', path: '/portals/applicant' },
 { label: 'Student Portal', path: '/portals/student' },
 { label: 'About BMU', path: '/about' }
];

export const NotFound = () => {
 const location = useLocation();
 const attemptedPath = location.pathname;

 return (
 <>
 <Helmet>
 <title>404 - Page Not Found | Bayelsa Medical University</title>
 <meta name="description" content="The page you're looking for doesn't exist. Try our homepage or search for what you need." />
 <meta name="robots" content="noindex, follow" />
 </Helmet>

 <div className="min-h-screen bg-gray-50">
 {/* Hero Section */}
 <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-primary-600 text-white">
 <div className="container-custom py-20">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="text-center max-w-2xl mx-auto"
 >
 <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 mb-6">
 <FileQuestion className="w-12 h-12" />
 </div>
 <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
 <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
 <p className="text-lg text-white/80 mb-2">
 We couldn't find <code className="bg-white/20 px-2 py-1 text-sm">{attemptedPath}</code>
 </p>
 <p className="text-white/60">
 The page may have been moved, renamed, or may no longer exist.
 </p>
 </motion.div>
 </div>
 </div>

 {/* Main Content */}
 <div className="container-custom py-16">
 <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
 {/* Quick Links */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 }}
 >
 <h3 className="text-xl font-bold text-gray-900 mb-6">What would you like to do?</h3>
 <div className="space-y-3">
 {quickLinks.map((link) => (
 <Link
 key={link.label}
 to={link.path}
 className="flex items-center gap-4 p-4 bg-white shadow-sm transition group"
 >
 <div className="w-12 h-12 bg-ink-900/10 flex items-center justify-center group-hover:bg-ink-900/20 transition">
 <link.icon className="w-6 h-6 text-ink-900" />
 </div>
 <div className="flex-1">
 <span className="font-semibold text-gray-900 group-hover:text-ink-900 transition">
 {link.label}
 </span>
 <p className="text-sm text-gray-500">{link.description}</p>
 </div>
 <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-ink-900 -rotate-180 transition" />
 </Link>
 ))}
 </div>

 <button
 onClick={() => window.history.back()}
 className="mt-6 flex items-center gap-2 text-ink-900 font-medium hover:underline"
 >
 <ArrowLeft className="w-5 h-5" />
 Go back to previous page
 </button>
 </motion.div>

 {/* Popular Pages */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.3 }}
 >
 <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Pages</h3>
 <div className="bg-white shadow-sm p-6">
 <div className="grid grid-cols-2 gap-4">
 {popularPages.map((page) => (
 <Link
 key={page.label}
 to={page.path}
 className="group"
 >
 <div className="p-3 hover:bg-gray-50 transition">
 <span className="font-medium text-gray-700 group-hover:text-ink-900 transition">
 {page.label}
 </span>
 </div>
 </Link>
 ))}
 </div>
 </div>

 {/* Search Box */}
 <div className="mt-8 bg-gradient-to-r from-ink-900 to-primary-600 p-6 text-white">
 <h4 className="font-bold mb-3">Looking for something specific?</h4>
 <p className="text-white/80 text-sm mb-4">
 Try our search feature to find what you need across our website.
 </p>
 <Link
 to="/search"
 className="inline-flex items-center gap-2 px-4 py-2 bg-white text-ink-900 font-medium hover:bg-white/90 transition"
 >
 <Search className="w-4 h-4" />
 Search Website
 </Link>
 </div>
 </motion.div>
 </div>

 {/* Need Help Section */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="mt-16 text-center max-w-2xl mx-auto"
 >
 <h3 className="text-lg font-semibold text-gray-900 mb-2">Need further assistance?</h3>
 <p className="text-gray-600 mb-4">
 If you believe this is an error or need help finding something specific,
 please contact our support team.
 </p>
 <div className="flex justify-center gap-4">
 <a
 href="mailto:webmaster@bmu.edu.ng"
 className="text-ink-900 font-medium hover:underline"
 >
 webmaster@bmu.edu.ng
 </a>
 <span className="text-gray-300">|</span>
 <a
 href="tel:+2348031110000"
 className="text-ink-900 font-medium hover:underline"
 >
 +234 803 111 0000
 </a>
 </div>
 </motion.div>
 </div>
 </div>
 </>
 );
};
