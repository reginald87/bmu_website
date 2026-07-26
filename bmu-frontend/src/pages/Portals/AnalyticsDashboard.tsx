import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

const COLORS = ['#A51C30', '#1E1E1E', '#4A90D9', '#50C878', '#F5A623', '#D0021B'];

export const AnalyticsDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [session, setSession] = useState('2024/2025');
  const [overview, setOverview] = useState<any>(null);
  const [programPerf, setProgramPerf] = useState<any[]>([]);
  const [gradeDist, setGradeDist] = useState<any[]>([]);
  const [semester, setSemester] = useState('First');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    Promise.all([
      apiClient.get(`/auth/admin/analytics/overview?session=${session}`),
      apiClient.get(`/auth/admin/analytics/program-performance?session=${session}`),
      apiClient.get(`/auth/admin/analytics/grade-distribution?session=${session}&semester=${semester}`),
    ])
      .then(([o, p, g]) => {
        setOverview(o.data);
        setProgramPerf(p.data);
        setGradeDist(g.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [session, semester]);

  if (!isAuthenticated || !['admin', 'staff', 'faculty'].includes(user?.role || '')) {
    return <Navigate to="/portals" replace />;
  }

  const gradeCounts = gradeDist.reduce((acc: Record<string, number>, curr: any) => {
    acc[curr.grade] = (acc[curr.grade] || 0) + curr.count;
    return acc;
  }, {} as Record<string, number>);
  const gradePieData = Object.entries(gradeCounts).map(([grade, count]) => ({ name: grade, value: count }));

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Bayelsa Medical University</title>
      </Helmet>
      <div>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Session</label>
              <select value={session} onChange={e => setSession(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>2024/2025</option>
                <option>2023/2024</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Semester</label>
              <select value={semester} onChange={e => setSemester(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>First</option>
                <option>Second</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {overview && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-[#A51C30]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{overview.total_students}</div>
                    <div className="text-xs text-gray-500">Total Students</div>
                  </div>
                  <div className="bg-white p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-[#1E1E1E]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{overview.total_results}</div>
                    <div className="text-xs text-gray-500">Published Results</div>
                  </div>
                  <div className="bg-white p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#4A90D9]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{overview.average_gpa}</div>
                    <div className="text-xs text-gray-500">Avg GPA</div>
                  </div>
                  <div className="bg-white p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-[#50C878]" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{overview.average_cgpa}</div>
                    <div className="text-xs text-gray-500">Avg CGPA</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-900 mb-4">Program Performance</h2>
                  {programPerf.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={programPerf}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="degree" fontSize={11} />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="avg_cgpa" fill="#A51C30" name="Avg CGPA" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avg_gpa" fill="#4A90D9" name="Avg GPA" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No data available</p>
                  )}
                  <div className="mt-3 space-y-2">
                    {programPerf.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50">
                        <span className="font-medium text-gray-700">{p.program} ({p.degree})</span>
                        <span className="text-gray-500">{p.student_count} students · CGPA {p.avg_cgpa}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="font-bold text-gray-900 mb-4">Grade Distribution</h2>
                  {gradePieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={gradePieData} cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                          {gradePieData.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No grade data for this semester</p>
                  )}
                </div>
              </div>

              {overview && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4">Academic Status Distribution</h2>
                    <div className="space-y-3">
                      {overview.status_distribution?.map((s: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">{s.academic_status || 'Unknown'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-100 h-2 rounded">
                              <div className="bg-[#A51C30] h-2 rounded" style={{ width: `${(s.count / overview.total_students) * 100}%` }} />
                            </div>
                            <span className="text-sm text-gray-500 w-8 text-right">{s.count}</span>
                          </div>
                        </div>
                      ))}
                      {(!overview.status_distribution || overview.status_distribution.length === 0) && (
                        <p className="text-sm text-gray-400 text-center py-4">No data</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4">Progression Decisions</h2>
                    <div className="space-y-3">
                      {overview.progression_distribution?.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">{p.decision}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-100 h-2 rounded">
                              <div className="bg-[#1E1E1E] h-2 rounded" style={{ width: `${(p.count / Math.max(...overview.progression_distribution.map((x: any) => x.count))) * 100}%` }} />
                            </div>
                            <span className="text-sm text-gray-500 w-8 text-right">{p.count}</span>
                          </div>
                        </div>
                      ))}
                      {(!overview.progression_distribution || overview.progression_distribution.length === 0) && (
                        <p className="text-sm text-gray-400 text-center py-4">No progression data</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-2">Quick Links</h2>
                <div className="flex flex-wrap gap-3">
                  <a href="/portals/admin" className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:bg-[#1E1E1E]/90 transition">Admin Dashboard</a>
                  <a href="/portals/admin/batch-publish" className="px-4 py-2 border border-[#1E1E1E] text-[#1E1E1E] text-sm font-medium hover:bg-gray-50 transition">Batch Publish</a>
                </div>
              </div>
            </>
          )}
      </div>
    </>
  );
};
