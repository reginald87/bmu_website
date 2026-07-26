import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { ArrowUp, ArrowRight, AlertTriangle, XCircle, CheckCircle, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

const decisionIcons: Record<string, React.ReactNode> = {
  promoted: <ArrowUp className="w-8 h-8 text-green-600" />,
  referred: <ArrowRight className="w-8 h-8 text-yellow-600" />,
  probation: <AlertTriangle className="w-8 h-8 text-orange-600" />,
  withdrawn: <XCircle className="w-8 h-8 text-red-600" />,
};

const decisionColors: Record<string, string> = {
  promoted: 'bg-green-50 border-green-200 text-green-800',
  referred: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  probation: 'bg-orange-50 border-orange-200 text-orange-800',
  withdrawn: 'bg-red-50 border-red-200 text-red-800',
};

export const StudentProgression = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/auth/student/progression')
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/portals" replace />;
  }

  return (
    <>
      <Helmet><title>Academic Progression - Bayelsa Medical University</title></Helmet>
      <div>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data ? (
            <div className="bg-white p-8 text-center shadow-sm border border-gray-100">
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">No Progression Record</h2>
              <p className="text-sm text-gray-500">Your progression has not been evaluated yet for the current session.</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className={`p-6 border-2 mb-6 ${decisionColors[data.decision] || 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {decisionIcons[data.decision] || <CheckCircle className="w-8 h-8" />}
                  <div>
                    <h2 className="text-xl font-bold capitalize">{data.decision}</h2>
                    <p className="text-sm opacity-80">{data.reason || 'No additional reason provided'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#A51C30]" />
                    <span className="text-xs text-gray-500 font-medium">GPA</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{data.gpa?.toFixed(2) || '-'}</div>
                </div>
                <div className="bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#1E1E1E]" />
                    <span className="text-xs text-gray-500 font-medium">CGPA</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{data.cgpa?.toFixed(2) || '-'}</div>
                </div>
                <div className="bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#4A90D9]" />
                    <span className="text-xs text-gray-500 font-medium">Carryover Units</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{data.carryover_units || 0}</div>
                </div>
                <div className="bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#50C878]" />
                    <span className="text-xs text-gray-500 font-medium">Total Units</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{data.total_units || 0}</div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Progression Details</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">Session</td>
                      <td className="py-2 font-medium text-right">{data.session}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">From Level</td>
                      <td className="py-2 font-medium text-right">{data.from_level || '-'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">To Level</td>
                      <td className="py-2 font-medium text-right">{data.to_level || '-'}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">Matric Number</td>
                      <td className="py-2 font-medium text-right">{data.matric_number || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-500">Status</td>
                      <td className="py-2 font-medium text-right">
                        {data.is_reviewed ? (
                          <span className="text-green-600">Reviewed</span>
                        ) : (
                          <span className="text-yellow-600">Pending Review</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </>
  );
};
