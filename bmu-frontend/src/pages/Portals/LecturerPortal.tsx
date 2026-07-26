import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import {
  BookOpen, ChevronRight,
  FileSpreadsheet, CheckSquare, Award, Bell, Clock, Mail
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { lecturerApi, type LecturerCourse } from '../../services/api';

const portalLinks = [
  {
    title: 'Grade Entry',
    description: 'Enter and manage student scores for your courses',
    link: '/portals/lecturer/grade-entry',
    icon: FileSpreadsheet,
  },
  {
    title: 'Results Approval',
    description: 'Review and approve submitted results (HOD/Dean/Senate)',
    link: '#',
    icon: CheckSquare,
  },
  {
    title: 'My Courses',
    description: 'View your assigned course schedule',
    link: '#',
    icon: BookOpen,
  },
];

export const LecturerPortal = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<LecturerCourse[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !['faculty', 'staff', 'admin'].includes(user?.role || '')) {
      return;
    }
    lecturerApi.getCourses('2024/2025', 'First')
      .then(setCourses)
      .catch(() => {});
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !['faculty', 'staff', 'admin'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  return (
      <div>
        <Helmet>
          <title>Lecturer Portal - Bayelsa Medical University</title>
        </Helmet>
        {/* Lecturer Info Bar */}
        <div className="bg-white border-b mb-6">
          <div className="py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Role:</span>
                <span className="font-semibold text-[#1E1E1E]">{user?.role_display || user?.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Assigned Courses:</span>
                <span className="font-semibold">{courses.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Session:</span>
                <span className="font-semibold">2024/2025 | First Semester</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#A51C30]/20">
                  <BookOpen className="w-5 h-5 text-[#A51C30]" />
                </div>
                <span className="text-sm text-gray-500">My Courses</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1E1E1E]/20">
                  <FileSpreadsheet className="w-5 h-5 text-[#1E1E1E]" />
                </div>
                <span className="text-sm text-gray-500">Pending Approvals</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">—</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#A51C30]/20">
                  <Award className="w-5 h-5 text-[#A51C30]" />
                </div>
                <span className="text-sm text-gray-500">Current Session</span>
              </div>
              <div className="text-xl font-bold text-gray-900">2024/2025</div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Access */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portalLinks.map((link, index) => (
                  <motion.div key={link.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}>
                    <Link to={link.link}
                      className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-[#1E1E1E] transition group">
                      <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E1E1E]/20 transition">
                        <link.icon className="w-6 h-6 text-[#1E1E1E]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#1E1E1E] transition">{link.title}</h3>
                        <p className="text-sm text-gray-500">{link.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E1E1E] transition" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Assigned Courses */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Assigned Courses</h2>
                <div className="bg-white shadow-sm border border-gray-100">
                  {courses.length > 0 ? courses.map((c, i) => (
                    <div key={c.id} className={`flex items-center gap-4 p-4 ${i !== courses.length - 1 ? 'border-b' : ''}`}>
                      <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-[#1E1E1E]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{c.code} - {c.title}</h3>
                        <p className="text-sm text-gray-500">{c.credit_units} credit units</p>
                      </div>
                      <Link to="/portals/lecturer/grade-entry"
                        className="px-3 py-1.5 text-sm font-medium bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 transition">
                        Enter Grades
                      </Link>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No courses assigned for the current session/semester.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-[#A51C30]" />
                  <h2 className="font-bold text-gray-900">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="pb-4 border-b last:border-0 last:pb-0">
                    <span className="inline-block px-2 py-1 text-xs font-medium mb-2 bg-blue-100 text-blue-700">Info</span>
                    <h3 className="font-medium text-gray-900 text-sm">Grade Entry Open</h3>
                    <p className="text-sm text-gray-500 mt-1">Grade entry for 2024/2025 first semester is now open.</p>
                    <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#A51C30]" />
                  <h2 className="font-bold text-gray-900">Important Dates</h2>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Grade Entry Deadline</span>
                    <span className="font-medium">Mar 10</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">HOD Approval</span>
                    <span className="font-medium">Mar 15</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Results Published</span>
                    <span className="font-medium">Apr 20</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1E1E1E] p-4 text-white">
                <h2 className="font-bold mb-2">Need Help?</h2>
                <p className="text-sm text-white/80 mb-4">Contact IT support for assistance</p>
                <div className="space-y-2 text-sm">
                  <a href="mailto:it@bmu.edu.ng" className="flex items-center gap-2 hover:text-[#A51C30] transition">
                    <Mail className="w-4 h-4" /> it@bmu.edu.ng
                  </a>
                </div>
              </div>
            </div>
          </div>
      </div>
  );
};
