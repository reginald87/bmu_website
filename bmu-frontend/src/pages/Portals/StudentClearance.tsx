import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface ClearanceItem {
  title: string;
  status: 'complete' | 'pending';
  detail: string;
}

interface ClearanceData {
  academic_year: string;
  semester: string;
  completed: number;
  total: number;
  items: ClearanceItem[];
}

export const StudentClearance = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ClearanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'student') return;
    apiClient.get('/auth/student/clearance')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  const percentage = data && data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Clearance | Student Portal - BMU</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Semester Clearance</h1>
        <p className="text-sm text-gray-500 mt-1">{data ? `${data.academic_year} - ${data.semester} semester` : 'Loading...'}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : !data ? (
        <div className="bg-white p-10 text-center shadow-sm border border-gray-100 rounded">
          <ShieldCheck className="w-12 h-12 text-primary-600/40 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load clearance status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
            <h3 className="font-bold text-gray-900 mb-4">Overall Progress</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f0f2" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none" stroke="#A51C30" strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`} strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
                    <div className="text-xs text-gray-500">{data.completed} of {data.total} cleared</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 shadow-sm border border-gray-100 rounded">
            <h3 className="font-bold text-gray-900 mb-4">Clearance Checklist</h3>
            <div className="space-y-3">
              {data.items.map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 border border-gray-100">
                  {item.status === 'complete' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.detail}</div>
                  </div>
                  <span className={`ml-auto text-xs font-medium px-2 py-1 ${item.status === 'complete' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.status === 'complete' ? 'Cleared' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
