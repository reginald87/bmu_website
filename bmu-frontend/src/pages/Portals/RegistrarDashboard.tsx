import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  Users, ChevronRight, BarChart3, Award, Calendar, ClipboardList, FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

interface RegistrarData {
  enrolled_students: number;
  active_sessions: number;
  pending_registrations: number;
  completed_registrations: number;
  programs: Array<{ name: string; students: number }>;
  recent_registrations: Array<{ student: string; program: string; date: string; status: string }>;
}

export const RegistrarDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<RegistrarData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.get('/auth/registrar/dashboard')
      .then(res => setData(res.data))
      .catch(() => {});
  }, [isAuthenticated]);

  if (!isAuthenticated || !['admin', 'staff', 'registrar'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  const stats = [
    { label: 'Enrolled Students', value: data?.enrolled_students?.toLocaleString() ?? 0, icon: Users, color: '#A51C30' },
    { label: 'Active Sessions', value: data?.active_sessions ?? 0, icon: Calendar, color: '#1E1E1E' },
    { label: 'Pending Registrations', value: data?.pending_registrations ?? 0, icon: ClipboardList, color: '#A51C30' },
    { label: 'Completed Registrations', value: data?.completed_registrations ?? 0, icon: FileText, color: '#1E1E1E' },
  ];

  return (
    <DashboardLayout
      title="Registrar Dashboard"
      subtitle="Office of the Registrar | Bayelsa Medical University"
      icon={ClipboardList}
      stats={stats}
      notifications={[
        { title: 'Pending Registrations', desc: `${data?.pending_registrations || 0} students awaiting registration approval`, time: 'Today', type: 'warning' },
        { title: 'Completed Registrations', desc: `${data?.completed_registrations || 0} registrations fully processed`, time: 'Current', type: 'success' },
      ]}
      importantDates={[
        { label: 'Registration Deadline', date: 'Feb 28' },
        { label: 'Late Registration Closes', date: 'Mar 10' },
        { label: 'Transcript Processing', date: '5-7 days' },
      ]}
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Analytics Dashboard', desc: 'Academic analytics overview', link: '/portals/admin/analytics', icon: BarChart3 },
            { title: 'Batch Publish', desc: 'Publish approved results', link: '/portals/admin/batch-publish', icon: Award },
            { title: 'Defaulter Report', desc: 'Fee defaulters report', link: '/portals/admin/defaulter-report', icon: FileText },
            { title: 'Graduation List', desc: 'Review eligible graduates', link: '#', icon: Award },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={item.link} className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-[#1E1E1E] transition group">
                <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E1E1E]/20 transition">
                  <item.icon className="w-6 h-6 text-[#1E1E1E]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#1E1E1E] transition">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E1E1E] transition" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Program Enrollment</h2>
        <div className="bg-white shadow-sm border border-gray-100">
          {data?.programs.map((p, i) => (
            <div key={p.name} className={`flex items-center justify-between p-4 ${i !== (data?.programs.length ?? 0) - 1 ? 'border-b' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#A51C30]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#A51C30]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">{p.students.toLocaleString()} students</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Registrations</h2>
        <div className="bg-white shadow-sm border border-gray-100">
          {data?.recent_registrations.map((r, i) => (
            <div key={i} className={`flex items-center justify-between p-4 ${i !== (data?.recent_registrations.length ?? 0) - 1 ? 'border-b' : ''}`}>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{r.student}</h3>
                <p className="text-xs text-gray-500">{r.program}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 text-xs font-medium ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {r.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
