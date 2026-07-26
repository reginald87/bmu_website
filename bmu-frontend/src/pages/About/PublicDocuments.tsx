import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Download, ExternalLink, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { usePublicDocuments } from '../../services/apiHooks';
import { downloadPublicDocument } from '../../services/api';

interface FallbackDoc {
  id: number;
  title: string;
  description: string;
  type: string;
  size: string;
  date: string;
  category: string;
}

const fallbackDocuments: FallbackDoc[] = [
  { id: 1, title: 'University Prospectus 2024-2025', description: 'Complete guide to programs, admissions, and campus life.', type: 'PDF', size: '8.5 MB', date: 'January 2024', category: 'Academic' },
  { id: 2, title: 'Annual Report 2023', description: 'Financial and operational report for the 2023 academic year.', type: 'PDF', size: '4.2 MB', date: 'March 2024', category: 'Financial' },
  { id: 3, title: 'Research Ethics Guidelines', description: 'Guidelines for conducting ethical research at BMU.', type: 'PDF', size: '1.8 MB', date: 'Updated 2024', category: 'Research' },
  { id: 4, title: 'Student Handbook', description: 'Rules, regulations, and guidelines for students.', type: 'PDF', size: '3.5 MB', date: 'August 2024', category: 'Student' },
  { id: 5, title: 'Staff Policy Manual', description: 'Employment policies, benefits, and procedures.', type: 'PDF', size: '2.9 MB', date: 'July 2024', category: 'Staff' },
  { id: 6, title: 'Strategic Plan 2024-2030', description: 'University strategic vision and development goals.', type: 'PDF', size: '5.1 MB', date: 'December 2023', category: 'Strategic' },
];

const typeDisplay: Record<string, string> = { pdf: 'PDF', doc: 'Word', docx: 'Word', xls: 'Excel', xlsx: 'Excel', ppt: 'PPT', pptx: 'PPT' };

const quickLinks = [
  { label: 'Academic Calendar', to: '/academics/calendar' },
  { label: 'Library Resources', to: '/academics/library' },
  { label: 'News & Announcements', to: '/news' },
  { label: 'Upcoming Events', to: '/events' },
];

export const PublicDocuments = () => {
  const { data: apiDocs, isLoading } = usePublicDocuments();

  const usingApiData = apiDocs && Array.isArray(apiDocs) && apiDocs.length > 0;

  const documents = (() => {
    if (usingApiData) {
      return apiDocs.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description || '',
        type: typeDisplay[d.document_type] || d.document_type.toUpperCase(),
        size: '',
        date: d.published_at ? new Date(d.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '',
        category: d.category ? d.category.charAt(0).toUpperCase() + d.category.slice(1) : '',
      }));
    }
    return fallbackDocuments;
  })();

  return (
    <>
      <Helmet>
        <title>Public Documents | Bayelsa Medical University</title>
        <meta name="description" content="Access public documents, reports, and resources from Bayelsa Medical University." />
      </Helmet>

      <section className="pt-[140px] pb-12 bg-[#1E1E1E]">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white">Public Documents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Public Documents</h1>
            <p className="text-xl text-white/80 max-w-2xl">Access official university documents, reports, and resources.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#1E1E1E] animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No documents available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white shadow-sm p-6 transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-[#A51C30]/10">
                          <FileText className="w-6 h-6 text-[#A51C30]" />
                        </div>
                        <span className="text-xs font-medium text-[#A51C30] bg-[#A51C30]/10 px-3 py-1">
                          {doc.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {doc.date}
                        </span>
                        <span>{doc.type}{doc.size ? ` • ${doc.size}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => downloadPublicDocument(doc.id)}
                          className="flex items-center gap-2 text-[#A51C30] font-medium hover:text-[#1E1E1E] transition"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => window.open(`/api/public/public-documents/${doc.id}/download?view=1`, '_blank')}
                          className="flex items-center gap-2 text-gray-600 font-medium hover:text-[#1E1E1E] transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="flex items-center justify-between text-gray-600 hover:text-[#A51C30] transition">
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#A51C30] to-[#1E1E1E] shadow-sm p-6 text-white">
                <h3 className="font-semibold mb-2">Need a specific document?</h3>
                <p className="text-white/80 text-sm mb-4">Can't find what you're looking for? Contact our office for assistance.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-white font-medium hover:underline">
                  <ExternalLink className="w-4 h-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicDocuments;
