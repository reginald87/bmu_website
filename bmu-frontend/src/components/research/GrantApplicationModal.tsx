import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSubmitGrantApplication } from '../../services/apiHooks';
import type { GrantData } from '../../services/mockData';

interface Props {
  grant: GrantData;
  onClose: () => void;
}

export const GrantApplicationModal = ({ grant, onClose }: Props) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalSummary, setProposalSummary] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [durationMonths, setDurationMonths] = useState('');
  const mutation = useSubmitGrantApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync({
      grant_id: grant.id,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applicant_phone: applicantPhone,
      proposal_title: proposalTitle,
      proposal_summary: proposalSummary,
      proposed_budget: proposedBudget ? Number(proposedBudget) : undefined,
      duration_months: durationMonths ? Number(durationMonths) : undefined,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl z-10"
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-title text-gray-900">Apply for Grant</h2>
              <p className="text-small text-gray-500 mt-1">{grant.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 transition" aria-label="Close">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {mutation.isSuccess ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-title text-gray-900 mb-2">Application Submitted</h3>
              <p className="text-body text-gray-600 mb-6">
                Your application has been received. You will be notified via email once it has been reviewed.
              </p>
              <p className="text-small text-gray-500">
                Application ID: <span className="font-mono font-medium text-gray-900">{mutation.data.id}</span>
              </p>
            </div>
          ) : mutation.isError ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-title text-gray-900 mb-2">Submission Failed</h3>
              <p className="text-body text-gray-600 mb-6">
                Something went wrong. Please try again or contact the research office.
              </p>
              <button
                onClick={() => mutation.reset()}
                className="px-6 py-2 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-small font-semibold text-gray-900 mb-1">Full Name *</label>
                <input
                  type="text" required value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-semibold text-gray-900 mb-1">Email *</label>
                  <input
                    type="email" required value={applicantEmail}
                    onChange={e => setApplicantEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-gray-900 mb-1">Phone</label>
                  <input
                    type="tel" value={applicantPhone}
                    onChange={e => setApplicantPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-semibold text-gray-900 mb-1">Proposal Title *</label>
                <input
                  type="text" required value={proposalTitle}
                  onChange={e => setProposalTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-gray-900 mb-1">Proposal Summary *</label>
                <textarea
                  required rows={5} value={proposalSummary}
                  onChange={e => setProposalSummary(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-semibold text-gray-900 mb-1">
                    Proposed Budget (NGN)
                  </label>
                  <input
                    type="number" value={proposedBudget}
                    onChange={e => setProposedBudget(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-gray-900 mb-1">
                    Duration (months)
                  </label>
                  <input
                    type="number" value={durationMonths}
                    onChange={e => setDurationMonths(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#1E1E1E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="submit" disabled={mutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition disabled:opacity-60"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {mutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button" onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GrantApplicationModal;
