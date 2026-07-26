import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bell, LogOut, Users, Mail, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  stats: Stat[];
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  notifications?: Array<{ title: string; desc: string; time: string; type: 'warning' | 'info' | 'success' }>;
  importantDates?: Array<{ label: string; date: string }>;
  hideHelp?: boolean;
}

export const DashboardLayout = ({
  title, subtitle, icon: Icon, stats, children,
  sidebar, notifications, importantDates, hideHelp,
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Helmet><title>{title} - Bayelsa Medical University</title></Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1E1E1E] text-white">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">{title}</h1>
                  {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 transition relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition">
                  <Users className="w-5 h-5" />
                  <span className="hidden md:inline">{user?.full_name}</span>
                </button>
                <button onClick={logout} className="p-2 hover:bg-white/10 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
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
            <div className="lg:col-span-2 space-y-8">{children}</div>
            <div className="space-y-6">
              {notifications && (
                <div className="bg-white shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[#A51C30]" />
                    <h2 className="font-bold text-gray-900">Notifications</h2>
                  </div>
                  <div className="space-y-4">
                    {notifications.map((n, i) => (
                      <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                        <span className={`inline-block px-2 py-1 text-xs font-medium mb-2 ${n.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : n.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {n.type === 'warning' ? 'Action Required' : n.type === 'success' ? 'Achievement' : 'Info'}
                        </span>
                        <h3 className="font-medium text-gray-900 text-sm">{n.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{n.desc}</p>
                        <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {importantDates && (
                <div className="bg-white shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#A51C30]" />
                    <h2 className="font-bold text-gray-900">Important Dates</h2>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {importantDates.map((d, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="text-gray-600">{d.label}</span>
                        <span className="font-medium">{d.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!hideHelp && (
                <div className="bg-[#1E1E1E] p-4 text-white">
                  <h2 className="font-bold mb-2">Need Help?</h2>
                  <p className="text-sm text-white/80 mb-4">Contact IT support for assistance</p>
                  <div className="space-y-2 text-sm">
                    <a href="mailto:it@bmu.edu.ng" className="flex items-center gap-2 hover:text-[#A51C30] transition">
                      <Mail className="w-4 h-4" /> it@bmu.edu.ng
                    </a>
                  </div>
                </div>
              )}
              {sidebar}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
