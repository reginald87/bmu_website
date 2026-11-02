import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, FileText, Calendar, Bell, Clock,
  Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface FeeStructureItem {
  fee_type: string;
  category: string;
  amount: number;
}

interface FeeStructure {
  id: number;
  session: string;
  level: number;
  semester: string;
  is_indigene: boolean;
  total_amount: number;
  max_installments: number;
  items: FeeStructureItem[];
}

interface DashboardData {
  total_courses: number;
  current_gpa: number | null;
  current_cgpa: number | null;
  total_fees_paid: number;
  pending_fees: number;
  amount_due: number;
  fee_structure: FeeStructure | null;
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
  { title: 'Hostel', description: 'Apply for accommodation', link: '/portals/student/hostel' },
  { title: 'Clearance', description: 'Complete semester clearance', link: '/portals/student/clearance' },
  { title: 'Profile', description: 'Update personal information', link: '/portals/student/profile' }
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
            <span className="font-semibold text-ink-900">{user?.email || 'N/A'}</span>
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
          { label: 'Current GPA', value: dashboard?.current_gpa != null ? dashboard.current_gpa.toFixed(2) : 'N/A', icon: Award, color: 'var(--color-primary-600)' },
          { label: 'CGPA', value: dashboard?.current_cgpa != null ? dashboard.current_cgpa.toFixed(2) : 'N/A', icon: TrendingUp, color: 'var(--color-ink-900)' },
          { label: 'Courses', value: String(dashboard?.total_courses ?? '--'), icon: BookOpen, color: 'var(--color-primary-600)' },
          { label: 'Fees Paid', value: `₦${dashboard?.total_fees_paid?.toLocaleString() || '0'}`, icon: FileText, color: 'var(--color-ink-900)' },
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

      {/* Fee Balance */}
      {dashboard && (dashboard.amount_due > 0 || dashboard.fee_structure) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white shadow-sm border border-gray-100 rounded p-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Fee Balance</h2>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Amount Due:</span>{' '}
              <span className="font-bold text-primary-600">₦{dashboard.amount_due.toLocaleString()}</span>
            </p>
            {dashboard.fee_structure ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">Fee Breakdown</h3>
                  <span className="text-xs text-gray-400">{dashboard.fee_structure.session}</span>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-ink-900/10 text-ink-900 rounded">
                    {dashboard.fee_structure.is_indigene ? 'Indigene' : 'Non-Indigene'}
                  </span>
                </div>
                {dashboard.fee_structure.items.length > 0 ? (
                  <div className="space-y-1">
                    {dashboard.fee_structure.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.fee_type}</span>
                        <span className="font-medium text-gray-900">₦{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-sm pt-2 mt-1 border-t">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-gray-900">₦{dashboard.fee_structure.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No fee components published yet.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No fee structure available for this session.</p>
            )}
          </div>
          <div className="flex md:flex-col gap-3 md:w-40 flex-shrink-0">
            <div className="flex-1 p-3 bg-gray-50 rounded">
              <p className="text-xs font-medium text-gray-600">Paid</p>
              <p className="text-lg font-bold text-green-700">₦{dashboard.total_fees_paid.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded">
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-lg font-bold text-primary-600">₦{dashboard.pending_fees.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

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
                    className="flex items-start gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-ink-900 transition group rounded"
                  >
                    <div className="w-12 h-12 bg-ink-900/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ink-900/20 transition rounded">
                      <BookOpen className="w-6 h-6 text-ink-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-ink-900 transition truncate">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-ink-900 transition flex-shrink-0" />
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
                  <div className="w-12 h-12 bg-primary-600/10 flex items-center justify-center flex-shrink-0 rounded">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{event.location}{event.event_type ? ` \u2022 ${event.event_type}` : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-ink-900">{event.event_date ? new Date(event.event_date).toLocaleDateString() : ''}</p>
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
              <Bell className="w-5 h-5 text-primary-600" />
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
              <Clock className="w-5 h-5 text-primary-600" />
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
          <div className="bg-ink-900 p-4 text-white rounded">
            <h2 className="font-bold mb-2">Need Help?</h2>
            <p className="text-sm text-white/80 mb-4">Contact student support for assistance</p>
            <div className="space-y-2 text-sm">
              <a href="tel:+2348031110020" className="flex items-center gap-2 hover:text-primary-600 transition">
                <span>📞</span> +234 803 111 0020
              </a>
              <a href="mailto:student@bmu.edu.ng" className="flex items-center gap-2 hover:text-primary-600 transition">
                <span>✉️</span> student@bmu.edu.ng
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
