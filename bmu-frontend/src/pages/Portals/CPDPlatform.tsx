import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  LogOut,
  CheckCircle,
  Download,
  Star,
  Search,
  Filter,
  Mail,
  Lock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCPDCourses } from '../../services/apiHooks';

// Mock CPD user data
const cpdUserData = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@email.com',
  profession: 'Medical Doctor',
  licenseNumber: 'MD-2018-4521',
  specialization: 'Internal Medicine',
  institution: 'Federal Medical Centre, Yenagoa',
  totalHours: 48,
  requiredHours: 50,
  completedCourses: 12,
  inProgressCourses: 3,
  certificates: 8,
  memberSince: '2023-01-15'
};

// Mock enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: 'Advanced Cardiac Life Support (ACLS)',
    category: 'Clinical Skills',
    progress: 75,
    totalModules: 8,
    completedModules: 6,
    hours: 16,
    nextSession: '2024-12-20',
    status: 'in-progress',
    image: '/cpd/acls.jpg'
  },
  {
    id: 2,
    title: 'Infection Control in Healthcare Settings',
    category: 'Public Health',
    progress: 30,
    totalModules: 6,
    completedModules: 2,
    hours: 8,
    nextSession: '2024-12-18',
    status: 'in-progress',
    image: '/cpd/infection-control.jpg'
  },
  {
    id: 3,
    title: 'Medical Ethics and Professionalism',
    category: 'Healthcare Management',
    progress: 0,
    totalModules: 4,
    completedModules: 0,
    hours: 6,
    nextSession: '2025-01-05',
    status: 'not-started',
    image: '/cpd/ethics.jpg'
  }
];

// Mock completed courses
const completedCourses = [
  {
    id: 4,
    title: 'Basic Life Support (BLS) Certification',
    category: 'Clinical Skills',
    completedDate: '2024-10-15',
    hours: 8,
    certificateId: 'BLS-2024-1047',
    rating: 5,
    image: '/cpd/bls.jpg'
  },
  {
    id: 5,
    title: 'Emergency Medicine Updates 2024',
    category: 'Clinical Skills',
    completedDate: '2024-09-20',
    hours: 12,
    certificateId: 'EMU-2024-0892',
    rating: 4,
    image: '/cpd/emergency.jpg'
  }
];

const CPDLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; detail?: string } } };
      setError(e?.response?.data?.message || e?.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] pt-[140px] pb-12 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">CPD Platform</h1>
            <p className="text-white/80 mt-2">Login to access your professional development courses</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Email / License Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none transition"
                    placeholder="Enter your email or license number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-800 space-y-3">
              <p>Don't have an account? <button className="text-[#1E1E1E] font-semibold hover:underline">Register here</button></p>
              <p><button className="hover:underline">Forgot password?</button></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// CPD Dashboard Component
const CPDDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'certificates'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cpdUser = {
    ...cpdUserData,
    name: user?.full_name || cpdUserData.name,
    email: user?.email || cpdUserData.email,
  };

  const { data: courses, isLoading } = useCPDCourses();
  const progressPercentage = (cpdUserData.totalHours / cpdUserData.requiredHours) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-[140px]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1E1E1E] flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CPD Platform</h1>
                <p className="text-sm text-gray-800">{cpdUser.name} • {cpdUserData.profession}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-800">License: {cpdUserData.licenseNumber}</p>
                <p className="text-xs text-gray-700">{cpdUserData.institution}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <div className="flex gap-1">
            {['overview', 'courses', 'certificates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition ${ activeTab === tab ? 'border-[#1E1E1E] text-[#1E1E1E]' : 'border-transparent text-gray-800 hover:text-gray-900' }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#1E1E1E]" />
                    </div>
                    <span className="text-sm text-gray-700">CPD Hours</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{cpdUserData.totalHours}</p>
                  <p className="text-sm text-gray-800">of {cpdUserData.requiredHours} required hours</p>
                  <div className="mt-3 h-2 bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-[#1E1E1E] transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-50 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#A51C30]" />
                    </div>
                    <span className="text-sm text-gray-700">Courses</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{cpdUserData.completedCourses}</p>
                  <p className="text-sm text-gray-800">{cpdUserData.inProgressCourses} in progress</p>
                </div>

                <div className="bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-50 flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#A51C30]" />
                    </div>
                    <span className="text-sm text-gray-700">Certificates</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{cpdUserData.certificates}</p>
                  <p className="text-sm text-gray-800">Verified by BMU</p>
                </div>

                <div className="bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-50 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-700">Compliance</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{progressPercentage.toFixed(0)}%</p>
                  <p className="text-sm text-gray-800">On track for renewal</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">My Enrolled Courses</h2>
                </div>
                <div className="divide-y">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="p-6 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-800">{course.category} • {course.hours} hours</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 overflow-hidden max-w-[200px]">
                            <div
                              className="h-full bg-[#1E1E1E]"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-800">{course.progress}%</span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:opacity-90 transition">
                        {course.progress === 0 ? 'Start' : 'Continue'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Completed */}
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Recently Completed</h2>
                </div>
                <div className="divide-y">
                  {completedCourses.map((course) => (
                    <div key={course.id} className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-800">
                          Completed {course.completedDate} • {course.hours} hours • Certificate #{course.certificateId}
                        </p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">
                        <Download className="w-4 h-4" />
                        Certificate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Search & Filter */}
              <div className="bg-white p-4 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#1E1E1E]"
                    >
                      <option value="all">All Categories</option>
                      <option value="clinical">Clinical Skills</option>
                      <option value="nursing">Nursing & Midwifery</option>
                      <option value="public-health">Public Health</option>
                      <option value="management">Healthcare Management</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50">
                      <Filter className="w-5 h-5" />
                      <span className="hidden sm:inline">Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Available Courses Grid */}
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#1E1E1E] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(courses ?? []).map((course) => (
                    <div key={course.id} className="bg-white shadow-sm overflow-hidden transition">
                      <div className="h-40 bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/50" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[#1E1E1E] bg-blue-50 px-2 py-1">{course.category_display}</span>
                          <span className="text-xs text-gray-700">{course.delivery_mode_display}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-800 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration_hours} hours
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {course.credit_hours} credits
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-xs text-gray-700">Starts {course.start_date}</p>
                            <p className="text-xs text-gray-700">{course.instructor_name}</p>
                          </div>
                          <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:opacity-90 transition">
                            Enroll (₦{course.fee_local.toLocaleString()})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white shadow-sm p-8"
            >
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Certificates</h2>
                <p className="text-gray-800 max-w-md mx-auto mb-8">
                  Download and share your verified CPD certificates. All certificates are accredited by MDCN and NMCN.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map((course) => (
                  <div key={course.id} className="border p-6 flex items-center gap-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-800">Certificate #{course.certificateId}</p>
                      <p className="text-sm text-gray-700">Issued {course.completedDate}</p>
                      <p className="text-sm text-gray-700">{course.hours} CPD Hours</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:opacity-90 transition">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const CPDPlatform = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Helmet>
        <title>CPD Platform - Bayelsa Medical University</title>
        <meta name="description" content="Continuing Professional Development platform for healthcare professionals. Access accredited courses and earn CME credits." />
      </Helmet>

      {isAuthenticated && user?.role === 'faculty' ? (
        <CPDDashboard />
      ) : (
        <CPDLogin />
      )}
    </>
  );
};

