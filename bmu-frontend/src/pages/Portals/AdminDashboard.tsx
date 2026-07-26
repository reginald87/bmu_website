import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import {
  Users, GraduationCap, Briefcase, FileText, Calendar,
  Bell, User, BookOpen, Clock, Building,
  Activity, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

interface AdminData {
  total_users: number;
  total_students: number;
  total_faculty: number;
  total_staff: number;
  total_applications: number;
  pending_applications: number;
  total_events: number;
  total_news: number;
  total_programs: number;
  total_colleges: number;
  recent_applications: Array<{ id: number; name: string; program: string; status: string; submitted_at: string | null }>;
  recent_enquiries: Array<{ id: number; name: string; subject: string; status: string; created_at: string }>;
}

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
    resolved: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/auth/admin/dashboard')
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (!isAuthenticated || !['admin', 'staff'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.total_users ?? 0, icon: Users, color: '#1E1E1E' },
    { label: 'Students', value: data?.total_students ?? 0, icon: GraduationCap, color: '#A51C30' },
    { label: 'Faculty', value: data?.total_faculty ?? 0, icon: Briefcase, color: '#1E1E1E' },
    { label: 'Staff', value: data?.total_staff ?? 0, icon: User, color: '#A51C30' },
    { label: 'Applications', value: data?.total_applications ?? 0, icon: FileText, color: '#1E1E1E' },
    { label: 'Pending Apps', value: data?.pending_applications ?? 0, icon: Clock, color: '#A51C30' },
    { label: 'Events', value: data?.total_events ?? 0, icon: Calendar, color: '#1E1E1E' },
    { label: 'News', value: data?.total_news ?? 0, icon: Bell, color: '#A51C30' },
    { label: 'Programs', value: data?.total_programs ?? 0, icon: BookOpen, color: '#1E1E1E' },
    { label: 'Colleges', value: data?.total_colleges ?? 0, icon: Building, color: '#A51C30' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Bayelsa Medical University</title>
      </Helmet>

      <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Recent Applications</h2>
                <span className="text-xs text-gray-500">{data?.recent_applications?.length || 0} total</span>
              </div>
              <div className="divide-y">
                {(data?.recent_applications?.length ? data.recent_applications : [
                  { id: 0, name: 'No applications yet', program: '', status: '', submitted_at: null }
                ]).map((app) => (
                  <div key={app.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.program}</p>
                    </div>
                    <div className="text-right">
                      {app.status && (
                        <span className={`inline-block px-2 py-1 text-xs font-medium ${statusBadge(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      )}
                      {app.submitted_at && (
                        <p className="text-xs text-gray-400 mt-1">{new Date(app.submitted_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Recent Enquiries</h2>
                <span className="text-xs text-gray-500">{data?.recent_enquiries?.length || 0} total</span>
              </div>
              <div className="divide-y">
                {(data?.recent_enquiries?.length ? data.recent_enquiries : [
                  { id: 0, name: 'No enquiries yet', subject: '', status: '', created_at: '' }
                ]).map((enq) => (
                  <div key={enq.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{enq.name}</p>
                      <p className="text-xs text-gray-500">{enq.subject}</p>
                    </div>
                    <div className="text-right">
                      {enq.status && (
                        <span className={`inline-block px-2 py-1 text-xs font-medium ${statusBadge(enq.status)}`}>
                          {enq.status}
                        </span>
                      )}
                      {enq.created_at && (
                        <p className="text-xs text-gray-400 mt-1">{new Date(enq.created_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-sm text-gray-500 mb-4">Manage your university from the Django admin panel</p>
            <div className="flex flex-wrap gap-3">
              <a href="/admin/" className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:bg-[#1E1E1E]/90 transition">Django Admin</a>
              <a href="/api/docs" className="px-4 py-2 border border-[#1E1E1E] text-[#1E1E1E] text-sm font-medium hover:bg-gray-50 transition">API Docs</a>
              <a href="/portals/admin/analytics" className="px-4 py-2 bg-[#A51C30] text-white text-sm font-medium hover:bg-[#A51C30]/90 transition flex items-center gap-2">
                <Activity className="w-4 h-4" /> Analytics Dashboard
              </a>
              <a href="/portals/admin/defaulter-report" className="px-4 py-2 bg-[#A51C30] text-white text-sm font-medium hover:bg-[#A51C30]/90 transition flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Defaulter Report
              </a>
            </div>
          </div>
      </div>
    </>
  );
};
