import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  DollarSign, CheckCircle, AlertCircle, ChevronRight,
  Wallet, FileText, Shield, Download, Search, Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

interface BursaryData {
  pending_verifications: number;
  total_collections: number;
  defaulters_count: number;
  pending_scholarships: number;
  recent_payments: Array<{ id: number; student: string; amount: number; method: string; reference: string; date: string; status: string }>;
}

interface PendingScholarship {
  id: number;
  student: number;
  student_name?: string;
  session: string;
  scholarship_body: string;
  amount: number;
  reference: string;
  status: string;
  notes: string;
  created_at: string;
}

export const BursaryDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<BursaryData | null>(null);
  const [pendingScholarships, setPendingScholarships] = useState<PendingScholarship[]>([]);
  const [_isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    Promise.all([
      apiClient.get('/auth/bursary/dashboard'),
      apiClient.get('/auth/bursary/pending-scholarships'),
    ])
      .then(([d, ps]) => {
        setData(d.data);
        setPendingScholarships(ps.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const handleScholarshipAction = async (recordId: number, action: 'verify' | 'reject') => {
    setProcessingId(recordId);
    setMessage(null);
    try {
      await apiClient.post('/auth/bursary/verify-scholarship', {
        record_id: recordId,
        action,
        notes: `${action === 'verify' ? 'Verified' : 'Rejected'} by bursary`,
      });
      setMessage({ type: 'success', text: `Scholarship ${action === 'verify' ? 'verified' : 'rejected'} successfully` });
      setPendingScholarships(prev => prev.filter(s => s.id !== recordId));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || err.response?.data?.detail || 'Action failed' });
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthenticated || !['bursary', 'admin', 'staff'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  const stats = [
    { label: 'Pending Verifications', value: data?.pending_verifications ?? 0, icon: Search, color: '#A51C30' },
    { label: 'Total Collections', value: `₦${(data?.total_collections ?? 0).toLocaleString()}`, icon: DollarSign, color: '#1E1E1E' },
    { label: 'Defaulters', value: data?.defaulters_count ?? 0, icon: AlertCircle, color: '#A51C30' },
    { label: 'Pending Scholarships', value: data?.pending_scholarships ?? 0, icon: Shield, color: '#1E1E1E' },
  ];

  return (
    <DashboardLayout
      title="Bursary Dashboard"
      subtitle="Financial Management | Bayelsa Medical University"
      icon={Wallet}
      stats={stats}
      notifications={[
        { title: 'Scholarship Verifications', desc: `${data?.pending_scholarships ?? 0} scholarships pending review`, time: 'Current', type: 'warning' },
        { title: 'Payment Reconciliation', desc: `${data?.pending_verifications ?? 0} pending payment verifications`, time: 'Today', type: 'info' },
        { title: 'New Session Setup', desc: 'Configure fee structures for next session', time: '1 week', type: 'info' },
      ]}
      importantDates={[
        { label: 'Fee Payment Deadline', date: 'Mar 10' },
        { label: 'Scholarship Disbursement', date: 'Mar 20' },
        { label: 'End of Session', date: 'Jun 30' },
      ]}
      sidebar={
        message ? (
          <div className={`p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <AlertCircle className="w-4 h-4 inline mr-1" />}
            {message.text}
          </div>
        ) : null
      }
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Defaulter Report', desc: 'View and export fee defaulters', link: '/portals/admin/defaulter-report', icon: AlertCircle },
            { title: 'Fee Structures', desc: 'Manage fee types and structures', link: '#', icon: FileText },
            { title: 'Payment Logs', desc: 'View all payment transactions', link: '#', icon: DollarSign },
            { title: 'Financial Reports', desc: 'Revenue and collection reports', link: '#', icon: Download },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={item.link} className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-[#1E1E1E] transition group">
                <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E1E1E]/20 transition">
                  <item.icon className="w-6 h-6 text-[#1E1E1E]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1E1E1E] transition">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E1E1E] transition" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {pendingScholarships.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Scholarship Verifications</h2>
          <div className="bg-white shadow-sm border border-gray-100">
            {pendingScholarships.map((s, i) => (
              <div key={s.id} className={`p-4 ${i !== pendingScholarships.length - 1 ? 'border-b' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">Reference: {s.reference}</p>
                    <p className="text-xs text-gray-500">{s.scholarship_body} · ₦{s.amount.toLocaleString()} · {s.session}</p>
                    <p className="text-xs text-gray-400 mt-1">Student ID: {s.student} · {s.notes && `Note: ${s.notes}`}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleScholarshipAction(s.id, 'verify')} disabled={processingId === s.id}
                      className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1">
                      {processingId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      Verify
                    </button>
                    <button onClick={() => handleScholarshipAction(s.id, 'reject')} disabled={processingId === s.id}
                      className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1">
                      {processingId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertCircle className="w-3 h-3" />}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Payments</h2>
        <div className="bg-white shadow-sm border border-gray-100">
          {data?.recent_payments && data.recent_payments.length > 0 ? data.recent_payments.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between p-4 ${i !== (data?.recent_payments.length ?? 0) - 1 ? 'border-b' : ''}`}>
              <div>
                <p className="font-medium text-gray-900 text-sm">{p.student}</p>
                <p className="text-xs text-gray-500">{p.method} · {p.reference?.slice(0, 20)}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">₦{p.amount.toLocaleString()}</div>
                <span className={`inline-block px-2 py-0.5 text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-gray-500 text-sm">No recent payments</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
