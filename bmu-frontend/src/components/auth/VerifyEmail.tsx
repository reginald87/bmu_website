import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/api';

type State = 'verifying' | 'success' | 'error';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    if (!uid || !token) {
      // Defer so the initial render isn't followed by a synchronous setState
      const timer = setTimeout(() => {
        setState('error');
        setMessage('This verification link is incomplete.');
      }, 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;

    apiClient
      .get('/v1/auth/verify-email/', { params: { uid, token } })
      .then(() => {
        if (cancelled) return;
        setState('success');
        setMessage('Your email has been verified. You can now sign in.');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err as { response?: { data?: { error?: string } } };
        setState('error');
        setMessage(e?.response?.data?.error || 'This verification link is invalid or has expired.');
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[180px] pb-12 px-4">
      <Helmet>
        <title>Verify Email | Bayelsa Medical University</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-8 text-center"
      >
        {state === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[#A51C30] mx-auto animate-spin" />
            <p className="text-gray-600">Verifying your email address…</p>
          </div>
        )}

        {state === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h1 className="text-xl font-bold text-gray-900">Email verified</h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/portals/login')}
              className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold text-gray-900">Verification failed</h1>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/portals/login')}
              className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
