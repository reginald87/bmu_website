import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, TrendingUp, ChevronRight,
  Award, BarChart3, Activity, AlertTriangle, University, Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

interface VCData {
  total_students: number;
  total_faculty: number;
  total_staff: number;
  total_programs: number;
  average_gpa: number;
  graduation_rate: number;
  colleges: Array<{ name: string; students: number }>;
  recent_publications: number;
}

export const VCDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<VCData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.get('/auth/vc/dashboard')
      .then(res => setData(res.data))
      .catch(() => {});
  }, [isAuthenticated]);

  if (!isAuthenticated || !['admin', 'staff', 'vc', 'faculty'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  const stats = [
    { label: 'Total Students', value: data?.total_students?.toLocaleString() ?? 0, icon: Users, color: 'var(--color-primary-600)' },
    { label: 'Faculty', value: data?.total_faculty ?? 0, icon: GraduationCap, color: 'var(--color-ink-900)' },
    { label: 'Staff', value: data?.total_staff ?? 0, icon: Users, color: 'var(--color-primary-600)' },
    { label: 'Programs', value: data?.total_programs ?? 0, icon: BookOpen, color: 'var(--color-ink-900)' },
    { label: 'Avg GPA', value: data?.average_gpa?.toFixed(2) ?? '—', icon: TrendingUp, color: 'var(--color-primary-600)' },
    { label: 'Graduation Rate', value: data?.graduation_rate ? `${data.graduation_rate}%` : '—', icon: Award, color: 'var(--color-ink-900)' },
  ];

  return (
    <DashboardLayout
      title="VC Dashboard"
      subtitle="Vice Chancellor's Office | Bayelsa Medical University"
      icon={University}
      stats={stats}
      hideHelp
      notifications={[
        { title: 'Senate Meeting', desc: 'Results approval senate meeting scheduled for Friday', time: '1 day ago', type: 'info' },
        { title: 'Graduation Ceremony', desc: 'Planning committee meeting next week', time: '3 days ago', type: 'info' },
        { title: 'Research Publication Milestone', desc: `${data?.recent_publications || 0} publications this quarter`, time: '1 week ago', type: 'success' },
      ]}
      importantDates={[
        { label: 'Senate Approval', date: 'Apr 05' },
        { label: 'Results Published', date: 'Apr 20' },
        { label: 'New Session Begins', date: 'Sep 15' },
      ]}
      sidebar={
        <div className="bg-ink-900 p-4 text-white">
          <h2 className="font-bold mb-2">Quick Stats</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/80">Publications</span>
              <span className="font-bold text-white">{data?.recent_publications || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Graduation Rate</span>
              <span className="font-bold text-white">{data?.graduation_rate || 0}%</span>
            </div>
          </div>
        </div>
      }
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Analytics Dashboard', desc: 'University-wide academic analytics', link: '/portals/admin/analytics', icon: BarChart3 },
            { title: 'Batch Publish', desc: 'Publish senate-approved results', link: '/portals/admin/batch-publish', icon: Activity },
            { title: 'Graduation List', desc: 'View eligible graduates', link: '#', icon: Award },
            { title: 'Defaulter Report', desc: 'Fee defaulters overview', link: '/portals/admin/defaulter-report', icon: AlertTriangle },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={item.link} className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-ink-900 transition group">
                <div className="w-12 h-12 bg-ink-900/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ink-900/20 transition">
                  <item.icon className="w-6 h-6 text-ink-900" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-ink-900 transition">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-ink-900 transition" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Colleges</h2>
        <div className="bg-white shadow-sm border border-gray-100">
          {data?.colleges.map((c, i) => (
            <div key={c.name} className={`flex items-center justify-between p-4 ${i !== (data?.colleges.length ?? 0) - 1 ? 'border-b' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">{c.students.toLocaleString()} students</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
