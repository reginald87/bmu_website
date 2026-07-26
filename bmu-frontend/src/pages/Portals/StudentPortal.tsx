import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, FileText, Calendar, Bell, Clock,
  Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

interface DashboardData {
  total_courses: number;
  current_gpa: number | null;
  current_cgpa: number | null;
  total_fees_paid: number;
  pending_fees: number;
  upcoming_events: Array<{ id: number; title: string; event_date: string; location: string; event_type: string }>;
  recent_results: Array<{ session: string; semester: string; level: string; gpa: number; cgpa: number; academic_status: string; is_published: boolean }>;
  enrolled_courses: Array<{ id: number; course_code: string; course_title: string; credit_units: number; total_score: number | null; grade: string; attendance_percentage: number | null }>;
  links?: Array<{ title: string; description: string; link: string }>;
  notifications?: Array<{ title: string; message: string; date: string; type: string }>;
}

const defaultPortalLinks = [
  { title: 'Course Registration', description: 'Register courses for current semester', link: '/portals/student/course-registration' },
  { title: 'Results', description: 'View academic results and transcripts', link: '/portals/student/results' },
  { title: 'Progression', description: 'View academic progression status', link: '/portals/student/progression' },
  { title: 'Attendance', description: 'Scan QR code to mark attendance', link: '/portals/student/attendance' },
  { title: 'Fee Payment', description: 'Pay tuition and other fees', link: '/portals/student/fees' },
  { title: 'Hostel', description: 'Apply for accommodation', link: '#' },
  { title: 'Clearance', description: 'Complete semester clearance', link: '#' },
  { title: 'Profile', description: 'Update personal information', link: '#' }
];

export const StudentPortal = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiClient.get('/auth/student/dashboard')
      .then((res) => setDashboard(res.data))
      .catch(() => setDashboard(null));
  }, []);

  return (
    <>
      {/* Student Info Bar */}
      <div className="bg-white border rounded shadow-sm mb-6">
        <div className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Matric:</span>
            <span className="font-semibold text-[#1E1E1E]">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Level:</span>
            <span className="font-semibold">{dashboard?.recent_results?.[0]?.level || '--'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Session:</span>
            <span className="font-semibold">{dashboard?.recent_results?.[0]?.session || '--'}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current GPA', value: dashboard?.current_gpa != null ? dashboard.current_gpa.toFixed(2) : 'N/A', icon: Award, color: '#A51C30' },
          { label: 'CGPA', value: dashboard?.current_cgpa != null ? dashboard.current_cgpa.toFixed(2) : 'N/A', icon: TrendingUp, color: '#1E1E1E' },
          { label: 'Courses', value: String(dashboard?.total_courses ?? '--'), icon: BookOpen, color: '#A51C30' },
          { label: 'Fees Paid', value: `₦${dashboard?.total_fees_paid?.toLocaleString() || '0'}`, icon: FileText, color: '#1E1E1E' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 sm:p-6 shadow-sm border border-gray-100 rounded"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Access + Events */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(dashboard?.links || defaultPortalLinks).map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.link}
                    className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-[#1E1E1E] transition group rounded"
                  >
                    <div className="w-12 h-12 bg-[#1E1E1E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E1E1E]/20 transition rounded">
                      <BookOpen className="w-6 h-6 text-[#1E1E1E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#1E1E1E] transition truncate">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1E1E1E] transition flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="bg-white shadow-sm border border-gray-100 rounded">
              {dashboard && dashboard.upcoming_events.length > 0 ? dashboard.upcoming_events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-4 p-4 ${index !== dashboard.upcoming_events.length - 1 ? 'border-b' : ''}`}
                >
                  <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0 rounded">
                    <Calendar className="w-6 h-6 text-[#A51C30]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{event.location}{event.event_type ? ` \u2022 ${event.event_type}` : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-[#1E1E1E]">{event.event_date ? new Date(event.event_date).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No upcoming events at this time
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#A51C30]" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              {dashboard?.notifications && dashboard.notifications.length > 0 ? dashboard.notifications.map((notification, index) => (
                <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className={`inline-block px-2 py-1 text-xs font-medium mb-2 ${ notification.type === 'success' ? 'bg-green-100 text-green-700' : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700' }`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                </div>
              )) : (
                <>
                  {[
                    { title: 'Course Registration Open', message: 'Registration for 2024/2025 second semester is now open', date: '2 hours ago', type: 'info' },
                    { title: 'Exam Timetable Released', message: 'Second semester examination timetable is now available', date: '1 day ago', type: 'success' },
                    { title: 'Fee Payment Reminder', message: 'Please complete your tuition payment before deadline', date: '3 days ago', type: 'warning' }
                  ].map((notification, index) => (
                    <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className={`inline-block px-2 py-1 text-xs font-medium mb-2 ${ notification.type === 'success' ? 'bg-green-100 text-green-700' : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700' }`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white shadow-sm border border-gray-100 p-4 rounded">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#A51C30]" />
              <h2 className="font-bold text-gray-900">Important Dates</h2>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Registration Deadline</span>
                <span className="font-medium">Feb 28</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Fee Payment</span>
                <span className="font-medium">Mar 10</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Exams Begin</span>
                <span className="font-medium">Mar 15</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Results Release</span>
                <span className="font-medium">Apr 20</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="bg-[#1E1E1E] p-4 text-white rounded">
            <h2 className="font-bold mb-2">Need Help?</h2>
            <p className="text-sm text-white/80 mb-4">Contact student support for assistance</p>
            <div className="space-y-2 text-sm">
              <a href="tel:+2348031110020" className="flex items-center gap-2 hover:text-[#A51C30] transition">
                <span>📞</span> +234 803 111 0020
              </a>
              <a href="mailto:student@bmu.edu.ng" className="flex items-center gap-2 hover:text-[#A51C30] transition">
                <span>✉️</span> student@bmu.edu.ng
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
