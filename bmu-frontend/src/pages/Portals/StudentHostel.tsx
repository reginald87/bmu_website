import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Home, BedDouble, Building2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface Allocation {
  id: number;
  hostel_name: string;
  room_number: string;
  bed_space: string;
  status: string;
  status_display: string;
  requested_at: string | null;
  allocated_at: string | null;
}

interface HostelData {
  session: string;
  allocation: Allocation | null;
}

const HOSTELS = [
  'Male Hostel - Yenagoa Campus',
  'Female Hostel - Yenagoa Campus',
  'Male Hostel - Sampou Campus',
  'Female Hostel - Sampou Campus',
];

export const StudentHostel = () => {
  const { user } = useAuth();
  const [data, setData] = useState<HostelData | null>(null);
  const [hostel, setHostel] = useState(HOSTELS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = () => {
    if (user?.role !== 'student') return;
    apiClient.get('/auth/student/hostel')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await apiClient.post('/auth/student/hostel/request', { hostel_name: hostel });
      if (res.data?.error) {
        setMessage({ type: 'error', text: res.data.error });
      } else {
        setMessage({ type: 'success', text: res.data?.message || 'Hostel request submitted' });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; detail?: string } } };
      setMessage({ type: 'error', text: e?.response?.data?.error || e?.response?.data?.detail || 'Failed to submit request' });
    } finally {
      setSubmitting(false);
      load();
    }
  };

  const handleCancel = async () => {
    if (!data?.allocation) return;
    try {
      await apiClient.post(`/auth/student/hostel/${data.allocation.id}/cancel`);
      setMessage({ type: 'success', text: 'Hostel request cancelled' });
    } catch {
      setMessage({ type: 'error', text: 'Unable to cancel request' });
    }
    load();
  };

  const allocation = data?.allocation;

  return (
    <>
      <Helmet>
        <title>Hostel | Student Portal - BMU</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hostel Accommodation</h1>
        <p className="text-sm text-gray-500 mt-1">{data ? `Session: ${data.session}` : 'Loading...'}</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#A51C30] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current allocation */}
          <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
            <div className="flex items-center gap-3 mb-6">
              <Home className="w-6 h-6 text-[#A51C30]" />
              <h3 className="font-bold text-gray-900">My Allocation</h3>
            </div>
            {allocation ? (
              <div className="space-y-3">
                <div className="p-4 border border-gray-100 flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">{allocation.hostel_name}</div>
                    <div className="text-sm text-gray-500">
                      Room {allocation.room_number || '—'} · Bed {allocation.bed_space || '—'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-semibold px-3 py-1 ${allocation.status === 'allocated' ? 'bg-green-50 text-green-700' : allocation.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {allocation.status_display}
                  </span>
                </div>
                {allocation.status === 'pending' && (
                  <button
                    onClick={handleCancel}
                    className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-red-400 hover:text-red-600 transition"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BedDouble className="w-12 h-12 text-[#A51C30]/40 mx-auto mb-4" />
                <p className="text-gray-600 mb-1">No hostel allocation for this session.</p>
                <p className="text-xs text-gray-400">Submit a request below and Student Affairs will allocate a bed space.</p>
              </div>
            )}
          </div>

          {/* Request form */}
          <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
            <h3 className="font-bold text-gray-900 mb-4">Request Accommodation</h3>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hostel</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  disabled={!!allocation && ['pending', 'allocated'].includes(allocation.status)}
                  className="w-full px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-[#A51C30] focus:border-transparent outline-none transition text-sm disabled:bg-gray-50 disabled:text-gray-400"
                >
                  {HOSTELS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting || (!!allocation && ['pending', 'allocated'].includes(allocation.status))}
                className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#A51C30] transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Home className="w-5 h-5" />}
                Submit Request
              </button>
              <p className="text-xs text-gray-500 text-center">
                Hostel fees are paid annually. Allocation is subject to availability and Student Affairs approval.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};