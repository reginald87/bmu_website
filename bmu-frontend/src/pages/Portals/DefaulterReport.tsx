import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Download, Search } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface Defaulter {
  student_id: number;
  student_name: string;
  matric_number: string;
  level: number;
  outstanding_amount: number;
}

export const DefaulterReport = () => {
  const { isAuthenticated, user } = useAuth();
  const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
  const [session, setSession] = useState('2024/2025');
  const [semester, setSemester] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !['admin', 'staff'].includes(user?.role || '')) return;
    void (async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/auth/admin/defaulter-report?session=${session}&semester=${semester}`);
        setDefaulters(res.data);
      } catch {
        setDefaulters([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session, semester, isAuthenticated, user?.role]);

  const exportCSV = () => {
    const rows = [['S/N', 'Name', 'Matric Number', 'Level', 'Total Amount'].join(',')];
    defaulters.forEach((d, i) => {
      rows.push([i + 1, d.student_name, d.matric_number, d.level, d.outstanding_amount].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `defaulters_${session}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || !['admin', 'staff'].includes(user?.role || '')) {
    return <Navigate to="/portals" replace />;
  }

  const totalOutstanding = defaulters.reduce((sum, d) => sum + d.outstanding_amount, 0);

  return (
    <>
      <Helmet><title>Defaulter Report | Bayelsa Medical University</title></Helmet>
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
                <option value="">All</option><option>First</option><option>Second</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={exportCSV} disabled={defaulters.length === 0} className="px-4 py-2 bg-ink-900 text-white text-sm font-medium hover:bg-ink-900/90 transition disabled:opacity-50 flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              <div className="bg-white p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Search className="w-5 h-5" />
                  <span>{defaulters.length} defaulter(s)</span>
                </div>
                <div className="text-lg font-bold text-primary-600">₦{totalOutstanding.toLocaleString()}</div>
              </div>

              {defaulters.length === 0 ? (
                <div className="bg-white p-12 text-center shadow-sm border border-gray-100">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-lg font-bold text-gray-900 mb-2">No Defaulters</h2>
                  <p className="text-sm text-gray-500">All students have cleared their fees for this session.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {defaulters.map(d => (
                      <div key={d.student_id} className="bg-white shadow-sm border border-gray-100 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{d.student_name}</h3>
                          <p className="text-sm text-gray-500">{d.matric_number} · Level {d.level}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary-600">₦{d.outstanding_amount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
      </div>
    </>
  );
};
