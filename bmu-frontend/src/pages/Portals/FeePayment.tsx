import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Loader, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface FeeStructureItem {
  fee_type: string;
  category: string;
  amount: number;
}

interface FeeStructure {
  id: number;
  session: string;
  level: number;
  semester: string;
  is_indigene: boolean;
  total_amount: number;
  max_installments: number;
  items: FeeStructureItem[];
}

interface FeeStatus {
  is_clear: boolean;
  outstanding_total: number;
  installment_due: number;
  structure: FeeStructure | null;
}

interface FeePayment {
  id: number;
  fee_type_label: string;
  session: string;
  semester: string;
  amount: number;
  status: string;
  status_display: string;
  payment_method: string;
  payment_reference: string;
  paid_at: string | null;
  created_at: string;
}

export const FeePayment = () => {
  const { isAuthenticated, user } = useAuth();
  const [feeStatus, setFeeStatus] = useState<FeeStatus | null>(null);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [gateway, setGateway] = useState('paystack');
  const [installment, setInstallment] = useState('full');
  const now = new Date();
  const currentYear = now.getFullYear();
  const [session, setSession] = useState(now.getMonth() < 8 ? `${currentYear - 1}/${currentYear}` : `${currentYear}/${currentYear + 1}`);
  const [semester, setSemester] = useState(now.getMonth() < 8 ? 'First' : 'Second');
  const [isLoading, setIsLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') return;
    setIsLoading(true);
    Promise.all([
      apiClient.get(`/auth/student/fee-status?session=${session}&semester=${semester}`),
      apiClient.get(`/auth/student/fees?session=${session}&semester=${semester}`),
    ])
      .then(([fs, pmts]) => {
        setFeeStatus(fs.data);
        setPayments(pmts.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [session, semester, isAuthenticated, user?.role]);

  const handlePay = async () => {
    setPaying(true);
    setMessage(null);
    try {
      const res = await apiClient.post('/auth/student/payment/initialize', {
        fee_type_id: 1,
        session,
        semester,
        gateway,
        installment,
      });
      const data = res.data;
      if (gateway === 'remita') {
        setMessage({ type: 'success', text: `RRR generated: ${data.rrr}. Please complete payment via Remita.` });
      } else {
        if (data.authorization_url) {
          window.location.href = data.authorization_url;
        } else {
          setMessage({ type: 'success', text: `Payment initialized (ref: ${data.order_id}). Verify after payment.` });
        }
      }
      const fsRes = await apiClient.get(`/auth/student/fee-status?session=${session}&semester=${semester}`);
      setFeeStatus(fsRes.data);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string; detail?: string } } };
      setMessage({ type: 'error', text: e.response?.data?.error || e.response?.data?.detail || 'Payment failed' });
    } finally {
      setPaying(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    try {
      await apiClient.post('/auth/student/payment/verify', {
        reference: ref,
        gateway: 'remita',
      });
      setMessage({ type: 'success', text: 'Payment verified successfully!' });
      const fsRes = await apiClient.get(`/auth/student/fee-status?session=${session}&semester=${semester}`);
      setFeeStatus(fsRes.data);
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } } };
      setMessage({ type: 'error', text: e.response?.data?.error || 'Verification failed' });
    }
  };

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/portals" replace />;
  }

  const outstanding_total = feeStatus?.outstanding_total ?? 0;
  const is_clear = feeStatus?.is_clear ?? true;
  const structure = feeStatus?.structure;

  return (
    <>
      <Helmet><title>Fee Payment | Bayelsa Medical University</title></Helmet>
      <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Session</label>
              <select value={session} onChange={e => setSession(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>2024/2025</option><option>2023/2024</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Semester</label>
              <select value={semester} onChange={e => setSemester(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>First</option><option>Second</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#A51C30]" /> Fee Structure
                </h2>

                {structure && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 text-sm">
                    <div className="font-medium text-gray-900">Level {structure.level} · {structure.semester} Semester</div>
                    <div className="text-xs text-gray-500">{structure.is_indigene ? 'Indigene' : 'Non-Indigene'} · {structure.session}</div>
                    <div className="text-xs text-gray-500">Max {structure.max_installments} installments</div>
                  </div>
                )}

                {is_clear ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">All fees cleared</p>
                    <p className="text-sm text-gray-400 mt-1">No outstanding balance for this session.</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {structure?.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.fee_type}</div>
                          <div className="text-xs text-gray-500">{item.category}</div>
                        </div>
                        <div className="text-lg font-bold text-[#A51C30]">₦{item.amount.toLocaleString()}</div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-300">
                      <div className="font-bold text-gray-900">Total</div>
                      <div className="text-lg font-bold text-[#A51C30]">₦{outstanding_total.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 text-sm">
                      <div className="font-medium text-blue-900">Installment Due (1 of {structure?.max_installments || 2})</div>
                      <div className="font-bold text-blue-700">₦{feeStatus?.installment_due?.toLocaleString() ?? 0}</div>
                    </div>
                  </div>
                )}

                {!is_clear && structure && (
                  <div className="mt-6 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Payment Plan</label>
                      <select value={installment} onChange={e => setInstallment(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white w-full">
                        <option value="full">Pay Full Amount (₦{outstanding_total.toLocaleString()})</option>
                        <option value="first">First Installment (₦{feeStatus?.installment_due?.toLocaleString() ?? 0})</option>
                        <option value="second">Second Installment (₦{feeStatus?.installment_due?.toLocaleString() ?? 0})</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Payment Gateway</label>
                      <select value={gateway} onChange={e => setGateway(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white w-full">
                        <option value="paystack">Paystack (Card)</option>
                        <option value="remita">Remita (Bank/Transfer)</option>
                      </select>
                    </div>
                    <button onClick={handlePay} disabled={paying} className="w-full py-3 bg-[#A51C30] text-white font-medium hover:bg-[#A51C30]/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                      {paying ? <Loader className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                      {paying ? 'Processing...' : `Pay with ${gateway === 'paystack' ? 'Paystack' : 'Remita'}`}
                    </button>
                  </div>
                )}

                {message && (
                  <div className={`mt-4 p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <AlertCircle className="w-4 h-4 inline mr-1" />}
                    {message.text}
                  </div>
                )}
              </div>

              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#1E1E1E]" /> Payment History
                </h2>
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No payment history</p>
                ) : (
                  <div className="space-y-2">
                    {payments.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-gray-100">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{p.fee_type_label}</div>
                          <div className="text-xs text-gray-500">{p.session} {p.semester} · {p.payment_method || '-'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">₦{p.amount.toLocaleString()}</div>
                          <span className={`text-xs px-1.5 py-0.5 ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {p.status_display}
                          </span>
                          {p.payment_reference && p.status === 'pending' && p.payment_method === 'remita' && (
                            <button onClick={() => verifyPayment(p.payment_reference)} className="block text-xs text-blue-600 underline mt-1">Verify</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </>
  );
};
