import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Calendar, 
  Users, 
  BookOpen, 
  Award,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  Quote,
  FileDown
} from 'lucide-react';
import { useState } from 'react';
import { usePublicationById } from '../../services/apiHooks';

export const PublicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  
  const { data: publication, isLoading } = usePublicationById(id || '');

  if (isLoading) {
    return (
      <div className="pt-[180px] pb-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#A51C30] border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!publication) {
  return <Navigate to="/research/publications" replace />;
  }

 const handleDownload = () => {
 // Simulate download
 alert('Downloading PDF... (This would download the actual PDF file)');
 };

 const handleCopyCitation = () => {
 const citation = `${publication.authors.join(', ')} (${publication.year}). ${publication.title}. ${publication.journal}. ${publication.doi ? `https://doi.org/${publication.doi}` : ''}`;
 navigator.clipboard.writeText(citation);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const handleShare = () => {
 if (navigator.share) {
 navigator.share({
 title: publication.title,
 text: publication.abstract?.substring(0, 100) + '...',
 url: window.location.href
 });
 } else {
 navigator.clipboard.writeText(window.location.href);
 alert('Link copied to clipboard!');
 }
 };

 return (
 <>
 <Helmet>
 <title>{publication.title} | Bayelsa Medical University</title>
 <meta name="description" content={publication.abstract?.substring(0, 160)} />
 </Helmet>

 {/* Hero Section */}
 <section className="pt-[180px] pb-12" style={{ backgroundColor: '#1E1E1E' }}>
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
 <Link to="/research" className="hover:text-white transition">Research</Link>
 <span>/</span>
 <Link to="/research/publications" className="hover:text-white transition">Publications</Link>
 <span>/</span>
 <span className="text-white">View</span>
 </div>

 {/* Back Link */}
 <Link
 to="/research/publications"
 className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
 >
 <ArrowLeft className="w-4 h-4" />
 Back to Publications
 </Link>

 {/* Publication Type Badge */}
 <div className="flex items-center gap-3 mb-4">
 <span className="px-3 py-1 bg-[#A51C30] text-[#1E1E1E] text-sm font-semibold">
 {publication.type === 'journal' ? 'Journal Article' : publication.type}
 </span>
 <span className="px-3 py-1 bg-white/20 text-white text-sm">
 {publication.category}
 </span>
 </div>

 {/* Title */}
 <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
 {publication.title}
 </h1>

 {/* Authors */}
 <div className="flex flex-wrap items-center gap-2 text-white/90 mb-4">
 <Users className="w-5 h-5" />
 {publication.authors.map((author, index) => (
 <span key={author}>
 <Link to={`/research/faculty/${author.toLowerCase().replace(/[^a-z]/g, '-')}`} className="hover:text-[#A51C30] transition">
 {author}
 </Link>
 {index < publication.authors.length - 1 && <span className="text-white/50">, </span>}
 </span>
 ))}
 </div>

 {/* Journal Info */}
 <div className="flex flex-wrap items-center gap-6 text-white/80">
 <div className="flex items-center gap-2">
 <BookOpen className="w-5 h-5" />
 <span className="font-medium">{publication.journal}</span>
 </div>
 <div className="flex items-center gap-2">
 <Calendar className="w-5 h-5" />
 <span>{publication.year}</span>
 </div>
 {publication.volume && (
 <span className="px-3 py-1 bg-white/10 text-sm">
 Vol. {publication.volume}{publication.issue && `, Issue ${publication.issue}`}
 </span>
 )}
 </div>
 </motion.div>
 </div>
 </section>

 {/* Action Bar */}
 <div className="bg-white border-b sticky top-[70px] z-30">
 <div className="container-custom py-4">
 <div className="flex flex-wrap items-center gap-3">
 {/* Download Button */}
 <button
 onClick={handleDownload}
 className="flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
 >
 <FileDown className="w-5 h-5" />
 Download PDF
 {publication.downloadCount && (
 <span className="ml-2 text-sm bg-white/20 px-2 py-0.5 ">
 {publication.downloadCount} downloads
 </span>
 )}
 </button>

 {/* Copy Citation */}
 <button
 onClick={handleCopyCitation}
 className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
 >
 <Quote className="w-5 h-5" />
 {copied ? 'Copied!' : 'Copy Citation'}
 </button>

 {/* Share */}
 <button
 onClick={handleShare}
 className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
 >
 <Share2 className="w-5 h-5" />
 Share
 </button>

 {/* Bookmark */}
 <button
 className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
 >
 <Bookmark className="w-5 h-5" />
 Save
 </button>

 {/* DOI Link */}
 {publication.doi && (
 <a
 href={`https://doi.org/${publication.doi}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-2 px-4 py-3 border border-[#1E1E1E] text-[#1E1E1E] font-medium hover:bg-[#1E1E1E]/5 transition ml-auto"
 >
 <ExternalLink className="w-5 h-5" />
 View on Publisher Site
 </a>
 )}
 </div>
 </div>
 </div>

 {/* Content */}
 <section className="py-12 bg-gray-50">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Main Content */}
 <div className="lg:col-span-2">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="bg-white p-8 shadow-sm"
 >
 {/* Abstract */}
 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
 <FileText className="w-5 h-5 text-[#1E1E1E]" />
 Abstract
 </h2>
 <p className="text-gray-700 leading-relaxed mb-8">
 {publication.abstract || 'Abstract not available for this publication.'}
 </p>

 {/* Keywords */}
 {publication.keywords && publication.keywords.length > 0 && (
 <div className="mb-8">
 <h3 className="text-sm font-semibold text-gray-900 mb-3">Keywords</h3>
 <div className="flex flex-wrap gap-2">
 {publication.keywords.map(keyword => (
 <span
 key={keyword}
 className="px-3 py-1 bg-gray-100 text-gray-700 text-sm"
 >
 {keyword}
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Metrics */}
 <div className="border-t pt-6">
 <h3 className="text-sm font-semibold text-gray-900 mb-4">Publication Metrics</h3>
 <div className="grid grid-cols-3 gap-4">
 <div className="text-center p-4 bg-gray-50 ">
 <Award className="w-6 h-6 text-[#1E1E1E] mx-auto mb-2" />
 <div className="text-2xl font-bold text-gray-900">{publication.citations}</div>
 <div className="text-sm text-gray-600">Citations</div>
 </div>
 <div className="text-center p-4 bg-gray-50 ">
 <Download className="w-6 h-6 text-[#1E1E1E] mx-auto mb-2" />
 <div className="text-2xl font-bold text-gray-900">{publication.downloadCount || 0}</div>
 <div className="text-sm text-gray-600">Downloads</div>
 </div>
 <div className="text-center p-4 bg-gray-50 ">
 <Calendar className="w-6 h-6 text-[#1E1E1E] mx-auto mb-2" />
 <div className="text-2xl font-bold text-gray-900">{publication.year}</div>
 <div className="text-sm text-gray-600">Published</div>
 </div>
 </div>
 </div>
 </motion.div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 {/* Publication Details */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 }}
 className="bg-white p-6 shadow-sm"
 >
 <h3 className="text-lg font-bold text-gray-900 mb-4">Publication Details</h3>
 
 <div className="space-y-4 text-sm">
 {publication.doi && (
 <div>
 <span className="text-gray-500 block mb-1">DOI</span>
 <div className="flex items-center gap-2">
 <span className="text-[#1E1E1E] font-medium">{publication.doi}</span>
 <button
 onClick={() => {
 navigator.clipboard.writeText(publication.doi!);
 alert('DOI copied!');
 }}
 className="p-1 hover:bg-gray-100 "
 >
 <Copy className="w-4 h-4 text-gray-400" />
 </button>
 </div>
 </div>
 )}
 
 <div>
 <span className="text-gray-500 block mb-1">Journal</span>
 <span className="text-gray-900 font-medium">{publication.journal}</span>
 </div>
 
 <div>
 <span className="text-gray-500 block mb-1">Publication Year</span>
 <span className="text-gray-900 font-medium">{publication.year}</span>
 </div>
 
 {publication.volume && (
 <div>
 <span className="text-gray-500 block mb-1">Volume</span>
 <span className="text-gray-900 font-medium">{publication.volume}</span>
 </div>
 )}
 
 {publication.issue && (
 <div>
 <span className="text-gray-500 block mb-1">Issue</span>
 <span className="text-gray-900 font-medium">{publication.issue}</span>
 </div>
 )}
 
 {publication.pages && (
 <div>
 <span className="text-gray-500 block mb-1">Pages</span>
 <span className="text-gray-900 font-medium">{publication.pages}</span>
 </div>
 )}
 
 <div>
 <span className="text-gray-500 block mb-1">Type</span>
 <span className="text-gray-900 font-medium capitalize">{publication.type}</span>
 </div>
 
 <div>
 <span className="text-gray-500 block mb-1">Category</span>
 <span className="text-gray-900 font-medium">{publication.category}</span>
 </div>
 </div>
 </motion.div>

 {/* Authors */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.3 }}
 className="bg-white p-6 shadow-sm"
 >
 <h3 className="text-lg font-bold text-gray-900 mb-4">Authors</h3>
 <div className="space-y-3">
 {publication.authors.map(author => (
 <Link
 key={author}
 to={`/research/faculty/${author.toLowerCase().replace(/[^a-z]/g, '-')}`}
 className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition"
 >
 <div className="w-10 h-10 bg-[#1E1E1E] flex items-center justify-center text-white font-medium text-sm">
 {author.split(' ').map(n => n[0]).join('')}
 </div>
 <span className="text-gray-900 font-medium">{author}</span>
 </Link>
 ))}
 </div>
 </motion.div>

 {/* Citation Preview */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.4 }}
 className="bg-[#1E1E1E] p-6 text-white"
 >
 <h3 className="text-lg font-bold mb-3">How to Cite</h3>
 <p className="text-white/80 text-sm leading-relaxed mb-4">
 {publication.authors.join(', ')} ({publication.year}). {publication.title}. <em>{publication.journal}</em>.
 {publication.doi && ` https://doi.org/${publication.doi}`}
 </p>
 <button
 onClick={handleCopyCitation}
 className="w-full py-2 bg-white/20 text-sm font-medium hover:bg-white/30 transition"
 >
 {copied ? 'Copied!' : 'Copy Citation'}
 </button>
 </motion.div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

export default PublicationDetail;
