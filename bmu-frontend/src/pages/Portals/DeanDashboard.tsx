import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import {
  BookOpen, Users, UserCheck, ChevronRight,
  CheckSquare, BarChart3, Building, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface DeanData {
  total_students: number;
  total_departments: number;
  total_lecturers: number;
  pending_approvals: number;
  faculty: string;
  departments: Array<{ name: string; students: number; lecturers: number }>;
  recent_approvals: Array<{ department: string; course: string; count: number }>;
}

export const DeanDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<DeanData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient.get('/auth/dean/dashboard')
      .then(res => setData(res.data))
      .catch(() => {});
  }, [isAuthenticated]);

  if (!isAuthenticated || !['faculty', 'staff', 'admin', 'dean'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  const stats = [
    { label: 'Students', value: data?.total_students ?? 0, icon: Users, color: '#A51C30' },
    { label: 'Departments', value: data?.total_departments ?? 0, icon: Building, color: '#1E1E1E' },
    { label: 'Lecturers', value: data?.total_lecturers ?? 0, icon: UserCheck, color: '#A51C30' },
    { label: 'Pending Approvals', value: data?.pending_approvals ?? 0, icon: AlertCircle, color: '#1E1E1E' },
  ];

  return (
    <>
      <Helmet><title>Dean Dashboard | Bayelsa Medical University</title></Helmet>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{data?.faculty || 'Faculty'} Dashboard</h1>
        <p className="text-sm text-gray-500">Bayelsa Medical University</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Approve Results', desc: 'Review HOD-approved results', link: '/portals/dean/approve-results', icon: CheckSquare },
                { title: 'Faculty Reports', desc: 'Faculty performance analytics', link: '/portals/admin/analytics', icon: BarChart3 },
                { title: 'Department Overview', desc: 'View all departments under faculty', link: '#', icon: Building },
                { title: 'Batch Publish', desc: 'Publish approved results', link: '/portals/admin/batch-publish', icon: BookOpen },
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Departments</h2>
            <div className="bg-white shadow-sm border border-gray-100">
              {data?.departments.map((d, i) => (
                <div key={d.name} className={`flex items-center justify-between p-4 ${i !== (data?.departments.length ?? 0) - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#A51C30]/10 flex items-center justify-center">
                      <Building className="w-5 h-5 text-[#A51C30]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{d.name}</h3>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-gray-500">{d.students} students</span>
                    <span className="text-gray-500">{d.lecturers} lecturers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-[#A51C30]" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Results Awaiting Approval', desc: 'HOD-approved results from 2 departments pending your review', time: '5 hours ago', type: 'warning' },
                { title: 'Faculty Board Meeting', desc: 'Scheduled for Friday at 2pm in the faculty boardroom', time: '2 days ago', type: 'info' },
              ].map((n, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <span className={`inline-block px-2 py-1 text-xs font-medium mb-2 ${n.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    {n.type === 'warning' ? 'Action Required' : 'Info'}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm">{n.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{n.desc}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#A51C30]" />
              <h2 className="font-bold text-gray-900">Important Dates</h2>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Dean Approval Deadline', date: 'Mar 20' },
                { label: 'Senate Review', date: 'Apr 05' },
                { label: 'Results Published', date: 'Apr 20' },
              ].map((d, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-gray-600">{d.label}</span>
                  <span className="font-medium">{d.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1E1E1E] p-4 text-white">
            <h2 className="font-bold mb-2">Need Help?</h2>
            <p className="text-sm text-white/80 mb-4">Contact IT support for assistance</p>
            <div className="space-y-2 text-sm">
              <a href="mailto:it@bmu.edu.ng" className="flex items-center gap-2 hover:text-[#A51C30] transition">
                <span>✉️</span> it@bmu.edu.ng
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
