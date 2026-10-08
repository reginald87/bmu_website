import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  GraduationCap, Bell, User, LogOut, Menu, X,
  Globe, CheckSquare
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';

const navItems = [
  { label: 'Dashboard', icon: Globe, link: '/portals/dean' },
  { label: 'Approve Results', icon: CheckSquare, link: '/portals/dean/approve-results' },
];

export const DeanLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Helmet>
        <title>Dean Portal - Bayelsa Medical University</title>
      </Helmet>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed top-[73px] left-0 z-40 h-[calc(100vh-73px)] w-64 bg-ink-900 text-white
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{user?.full_name || user?.first_name}</p>
              <p className="text-xs text-white/60 truncate">Dean</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <Link
                key={item.label}
                to={item.link}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition ${
                  isActive
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col lg:ml-64">
        <div className="bg-ink-900 text-white fixed top-0 left-0 right-0 z-50 h-[73px]">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 hover:bg-white/10 transition">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center hidden sm:flex">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-base sm:text-lg">Dean Portal</h1>
                  <p className="text-xs text-white/70 hidden sm:block">Bayelsa Medical University</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 hover:bg-white/10 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition">
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.full_name || user?.first_name}</span>
              </button>
              <button onClick={logout} className="p-2 hover:bg-white/10 transition" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-[73px]">
          <div className="px-4 lg:px-8 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
