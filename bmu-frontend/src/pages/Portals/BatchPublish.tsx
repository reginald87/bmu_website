import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  GraduationCap, Loader2, CheckCircle, Send, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { approvalApi } from '../../services/api';

export const BatchPublish = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [session] = useState('2024/2025');
  const [semester] = useState('First');
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ published: number; message: string } | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setResult(null);
    try {
      const res = await approvalApi.batchPublish(session, semester);
      setResult(res);
      toast.success(res.message);
    } catch {
      toast.error('Batch publish failed');
    } finally {
      setPublishing(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/portals/student', { replace: true });
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Batch Publish Results | Bayelsa Medical University</title>
      </Helmet>

      <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-white p-8 border border-gray-100 shadow-sm text-center">
            <GraduationCap className="w-16 h-16 mx-auto text-ink-900 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Publish Semester Results</h2>
            <p className="text-gray-500 mb-6">
              This will compute GPA and CGPA for all students with senate-approved results.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">This action cannot be undone.</p>
                  <p>Only results that have been senate-approved will be published.</p>
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-green-50 border border-green-200 p-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">{result.message}</span>
                </div>
              </div>
            )}

            <button onClick={handlePublish} disabled={publishing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-ink-900 text-white font-semibold hover:bg-ink-900/90 transition disabled:opacity-50">
              {publishing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</>
              ) : (
                <><Send className="w-5 h-5" /> Publish Results</>
              )}
            </button>
          </motion.div>
      </div>
    </>
  );
};
