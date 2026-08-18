import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Loader2, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { approvalApi, type PendingResult } from '../../services/api';

interface ApprovalConfig {
  title: string;
  subtitle: string;
  role: string;
  fetchPending: (session: string, semester: string) => Promise<PendingResult[]>;
  approve: (ids: number[], reason?: string) => Promise<{ approved: number; message: string }>;
  statusLabel: string;
  nextStatusLabel: string;
  showRejection?: boolean;
}

const CONFIGS: Record<string, ApprovalConfig> = {
  hod: {
    title: 'HOD Result Approval',
    subtitle: 'Review and approve submitted results',
    role: 'hod',
    fetchPending: (s, sem) => approvalApi.getHodPending(s, sem),
    approve: (ids, reason) => approvalApi.hodApprove(ids, reason || ''),
    statusLabel: 'Submitted',
    nextStatusLabel: 'HOD Approved',
    showRejection: true,
  },
  dean: {
    title: 'Dean Result Approval',
    subtitle: 'Review and approve HOD-approved results',
    role: 'dean',
    fetchPending: (s, sem) => approvalApi.getDeanPending(s, sem),
    approve: (ids) => approvalApi.deanApprove(ids),
    statusLabel: 'HOD Approved',
    nextStatusLabel: 'Dean Approved',
  },
  senate: {
    title: 'Senate Result Approval',
    subtitle: 'Final approval of dean-approved results',
    role: 'admin',
    fetchPending: (s, sem) => approvalApi.getSenatePending(s, sem),
    approve: (ids) => approvalApi.senateApprove(ids),
    statusLabel: 'Dean Approved',
    nextStatusLabel: 'Senate Approved',
  },
};

interface Props {
  stage: 'hod' | 'dean' | 'senate';
}

export const ResultApproval = ({ stage }: Props) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const config = CONFIGS[stage];

  const [pending, setPending] = useState<PendingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [approving, setApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [session] = useState('2024/2025');
  const [semester] = useState('First');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== config.role) {
      navigate('/portals/student', { replace: true });
      return;
    }
    loadPending();
  }, [isAuthenticated, user, config.role, navigate]);

  const loadPending = () => {
    setLoading(true);
    config.fetchPending(session, semester)
      .then(setPending)
      .catch(() => toast.error('Failed to load pending results'))
      .finally(() => setLoading(false));
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === pending.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pending.map(p => p.student_course_id)));
    }
  };

  const handleApprove = async () => {
    if (selected.size === 0) { toast.warning('Select at least one result'); return; }
    setApproving(true);
    try {
      const ids = Array.from(selected);
      const res = await config.approve(ids, showRejectInput ? rejectionReason : undefined);
      toast.success(res.message);
      setSelected(new Set());
      setShowRejectInput(false);
      setRejectionReason('');
      loadPending();
    } catch {
      toast.error('Approval failed');
    } finally {
      setApproving(false);
    }
  };

  if (!isAuthenticated || user?.role !== config.role) return null;

  return (
    <>
      <Helmet>
        <title>{config.title} | Bayelsa Medical University</title>
      </Helmet>

      <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : pending.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 text-center border border-gray-100">
              <CheckCircle className="w-16 h-16 mx-auto text-green-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">All Caught Up</h2>
              <p className="text-gray-500">No results pending {config.statusLabel.toLowerCase()} approval.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 shadow-sm">
              <div className="p-4 bg-gray-50 border-b flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selected.size === pending.length} onChange={toggleAll}
                    className="w-4 h-4 accent-[#1E1E1E]" />
                  Select All ({pending.length} pending)
                </label>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="w-10 px-2 py-3"></th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Matric No</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Student Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Course</th>
                      <th className="text-center px-3 py-3 font-semibold text-gray-700">CA</th>
                      <th className="text-center px-3 py-3 font-semibold text-gray-700">Exam</th>
                      <th className="text-center px-3 py-3 font-semibold text-gray-700">Total</th>
                      <th className="text-center px-3 py-3 font-semibold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((p) => (
                      <tr key={p.student_course_id} className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleSelect(p.student_course_id)}>
                        <td className="px-2 py-3 text-center">
                          <input type="checkbox" checked={selected.has(p.student_course_id)} readOnly
                            className="w-4 h-4 accent-[#1E1E1E]" />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.matric_number}</td>
                        <td className="px-4 py-3 text-gray-700">{p.student_name}</td>
                        <td className="px-4 py-3 text-gray-700">{p.course_code}</td>
                        <td className="px-3 py-3 text-center">{p.assignment_score?.toFixed(1) ?? '-'}</td>
                        <td className="px-3 py-3 text-center">{p.exam_score?.toFixed(1) ?? '-'}</td>
                        <td className="px-3 py-3 text-center font-medium">{p.total_score?.toFixed(1) ?? '-'}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-xs font-bold ${
                            p.grade === 'A' ? 'text-green-600 bg-green-50' :
                            p.grade === 'F' ? 'text-red-600 bg-red-50' :
                            'text-blue-600 bg-blue-50'
                          }`}>{p.grade || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-4 bg-gray-50 border-t flex items-center gap-3">
                <button onClick={handleApprove} disabled={approving || selected.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition disabled:opacity-50">
                  {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve Selected ({selected.size})
                </button>
                {config.showRejection && (
                  <button onClick={() => setShowRejectInput(!showRejectInput)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                )}
              </div>

              {showRejectInput && (
                <div className="px-4 py-3 border-t bg-red-50">
                  <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
                  <div className="flex gap-2">
                    <input type="text" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="flex-1 px-3 py-2 border border-red-200 focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                    <button onClick={handleApprove} disabled={approving || !rejectionReason.trim() || selected.size === 0}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
      </div>
    </>
  );
};
