import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  ArrowRight,
  Mail,
  Phone,
  Loader2,
  Download,
  type LucideIcon
} from 'lucide-react';
import { useApplicationStatus } from '../../services/apiHooks';
import { downloadAdmissionDocument, type AdmissionDocumentKind } from '../../services/api';



interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
  icon: LucideIcon;
}

const statusConfig: Record<string, StatusStyle> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', label: 'Draft', icon: FileText },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Submitted', icon: FileText },
  under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Under Review', icon: Clock },
  interview: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: 'Interview', icon: Clock },
  waitlisted: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Waitlisted', icon: Clock },
  accepted: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Accepted', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Not Accepted', icon: AlertCircle },
};

const defaultStatusStyle: StatusStyle = statusConfig.draft;

export const ApplicationStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || '');
  const [downloadingDoc, setDownloadingDoc] = useState<AdmissionDocumentKind | null>(null);
  const [documentError, setDocumentError] = useState('');
  const applicationId = id || searchId;
  const { data: application, isLoading, isError } = useApplicationStatus(applicationId || '');

  const handleSearch = () => {
    if (searchId) {
      navigate(`/apply/status/${searchId.toUpperCase()}`);
    }
  };

  const handleDocumentDownload = async (kind: AdmissionDocumentKind) => {
    if (!application?.public_id) return;
    setDocumentError('');
    setDownloadingDoc(kind);
    try {
      await downloadAdmissionDocument(application.public_id, kind, { public: true });
    } catch (err) {
      setDocumentError(err instanceof Error ? err.message : 'Unable to download this document right now.');
    } finally {
      setDownloadingDoc(null);
    }
  };

  const getStatusColor = (status: string): StatusStyle =>
    statusConfig[status] || defaultStatusStyle;

  const isPaid = application?.payment_status === 'paid' || application?.payment_status === 'completed';

  return (
    <>
      <Helmet>
        <title>Application Status | Bayelsa Medical University</title>
        <meta name="description" content="Check the status of your BMU application. Track your application progress from submission to final decision." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen pt-28 pb-12">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900 mb-2">
              Check Application Status
            </h1>
            <p className="text-gray-600">
              Enter your application ID to track your application progress
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white shadow-sm p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter Application ID (e.g., BMU123456)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchId}
                className="px-6 py-3 bg-ink-900 text-white font-medium hover:bg-ink-900/90 disabled:opacity-50 transition flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check Status
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white shadow-sm p-12 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Checking application status...</p>
            </div>
          ) : isError || !application ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-sm p-8 text-center"
            >
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Application Not Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find an application with ID <strong>{searchId}</strong>. 
                Please check the ID and try again.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Need help?</p>
                <div className="flex justify-center gap-4">
                  <a href="tel:+2348031110020" className="flex items-center gap-1 text-ink-900 hover:underline">
                    <Phone className="w-4 h-4" />
                    +234 803 111 0020
                  </a>
                  <a href="mailto:admissions@bmu.edu.ng" className="flex items-center gap-1 text-ink-900 hover:underline">
                    <Mail className="w-4 h-4" />
                    admissions@bmu.edu.ng
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Header */}
              <div className={`bg-white shadow-sm p-6 border-l-4 ${getStatusColor(application.status).border}`}>
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Application ID</div>
                    <div className="text-2xl font-bold text-gray-900">{application.id}</div>
                  </div>
                  {(application.status_display || application.status) && (
                    <div className={`px-4 py-2 ${getStatusColor(application.status).bg} ${getStatusColor(application.status).text} flex items-center gap-2`}>
                      {(() => {
                        const StatusIcon = getStatusColor(application.status).icon;
                        return <StatusIcon className="w-5 h-5" />;
                      })()}
                      <span className="font-medium">{application.status_display || getStatusColor(application.status).label}</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  {application.first_name && (
                    <div>
                      <div className="text-sm text-gray-500">Applicant</div>
                      <div className="font-medium text-gray-900">{application.first_name} {application.last_name}</div>
                    </div>
                  )}
                  {application.email && (
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{application.email}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500">Submitted</div>
                    <div className="font-medium text-gray-900">{application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">Program</div>
                    <div className="font-medium text-gray-900">{application.program}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Student Type</div>
                    <div className="font-medium text-gray-900">{application.student_type === 'INTL' ? 'International' : 'Local'}</div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Progress</h2>
                <div className="w-full bg-gray-200 h-4">
                  <div
                    className="bg-primary-600 h-4 transition-all duration-500"
                    style={{ width: `${application.progress_percentage || 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{application.progress_percentage || 0}% complete</p>
              </div>

              {/* Payment Status */}
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h2>
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {isPaid ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                  <span className="font-medium capitalize">{application.payment_status || 'pending'}</span>
                </div>
              </div>

              {/* Admission documents — only for accepted applications */}
              {application.status === 'accepted' && (
                <div className="bg-white shadow-sm p-6 border-l-4 border-green-500">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Congratulations on your Admission</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Your screening success letter and the statutory declaration form are now available.
                    Download, print and present both at matriculation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleDocumentDownload('success-letter')}
                      disabled={downloadingDoc !== null}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-ink-900 text-white font-medium hover:bg-ink-900/90 disabled:opacity-60 transition"
                    >
                      {downloadingDoc === 'success-letter' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Screening Success Letter
                    </button>
                    <button
                      onClick={() => handleDocumentDownload('oath-form')}
                      disabled={downloadingDoc !== null}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-ink-900 text-ink-900 font-medium hover:bg-ink-900 hover:text-white disabled:opacity-60 transition"
                    >
                      {downloadingDoc === 'oath-form' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Statutory Declaration Form
                    </button>
                  </div>
                  {documentError && (
                    <p className="mt-3 text-sm text-red-600">{documentError}</p>
                  )}
                </div>
              )}

              {/* Documents / portal link */}
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Documents</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Sign in to the applicant portal to view your submitted application and download your payment receipt.
                </p>
                <Link
                  to="/portals/applicant"
                  className="inline-flex items-center gap-2 px-4 py-2 border hover:bg-gray-50 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Applicant Portal</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="mb-4">Can't find your application?</p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white shadow-sm transition"
            >
              <Mail className="w-4 h-4" />
              Contact Admissions Office
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

