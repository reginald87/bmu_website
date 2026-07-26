import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Briefcase,
  Heart,
  Calendar,
  FileText,
  Bell,
  User,
  LogOut,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';

interface AlumniDashboardData {
  profile: { grad_year: string; program: string; current_role: string; organization: string; location: string; bio: string; phone: string };
  updates: Array<{ title: string; date: string; type: string }>;
  events: Array<{ title: string; date: string; location: string; type: string }>;
  featured: Array<{ name: string; role: string; organization: string; year: string }>;
  sections: Array<{ title: string; description: string; count: string | null; icon: any }>;
}

export const AlumniPortal = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [dashboard, setDashboard] = useState<AlumniDashboardData | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'alumni') {
      apiClient.get('/auth/alumni/dashboard')
        .then((res) => setDashboard(res.data))
        .catch(() => setDashboard(null));
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; detail?: string } } };
      setLoginError(e?.response?.data?.message || e?.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'alumni') {
    return (
      <>
        <Helmet>
          <title>Alumni Login - Bayelsa Medical University</title>
          <meta name="description" content="Login to BMU Alumni Portal to connect with fellow graduates and access alumni resources." />
        </Helmet>

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
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Alumni Portal</h1>
                <p className="text-white/80 mt-2">Sign in to connect with your alma mater</p>
              </div>

              {/* Form */}
              <div className="p-8">
                {loginError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {loginError}
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none transition"
                        placeholder="alumni@bmu.edu.ng"
                        required
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
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <a href="#" className="text-sm text-[#1E1E1E] hover:underline block">Forgot password?</a>
                  <p className="text-sm text-gray-800">
                    Need help? Contact <a href="mailto:alumni@bmu.edu.ng" className="text-[#1E1E1E] hover:underline">alumni@bmu.edu.ng</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Alumni Portal - Bayelsa Medical University</title>
        <meta name="description" content="BMU Alumni Portal - Connect with fellow graduates, access career resources, and stay involved with your alma mater." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] text-white">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">Alumni Portal</h1>
                  <p className="text-sm text-white/70">Class of {dashboard?.profile?.grad_year || '2019'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 transition relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#A51C30]"></span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user?.full_name || user?.first_name}</span>
                </button>
                <button onClick={logout} className="p-2 hover:bg-white/10 transition">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Quick Links */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-[#1E1E1E]/10 flex items-center justify-center text-2xl">
                    👩‍⚕️
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{user?.full_name || 'Dr. Sarah Johnson'}</h2>
                    <p className="text-sm text-[#A51C30]">{dashboard?.profile?.program || 'MBBS (Medicine & Surgery)'}</p>
                    <p className="text-xs text-gray-500">Class of {dashboard?.profile?.grad_year || '2019'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{dashboard?.profile?.current_role || 'Medical Officer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{dashboard?.profile?.location || 'Bayelsa, Nigeria'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email || 'alumni@bmu.edu.ng'}</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-[#1E1E1E] text-[#1E1E1E] font-medium hover:bg-[#1E1E1E] hover:text-white transition">
                  Edit Profile
                </button>
              </div>

              {/* Portal Sections */}
              <div className="bg-white shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 mb-4">Portal Sections</h3>
                <div className="space-y-2">
                  {(dashboard?.sections || [
                    { title: 'Alumni Directory', description: 'Connect with fellow graduates', count: '2,500+', icon: Users },
                    { title: 'Job Board', description: 'Career opportunities', count: '150', icon: Briefcase },
                    { title: 'Mentorship', description: 'Give back to students', count: '85', icon: Heart },
                    { title: 'Events', description: 'Reunions & networking', count: '12', icon: Calendar },
                    { title: 'Transcripts', description: 'Request documents', count: null, icon: FileText },
                    { title: 'Give Back', description: 'Support your alma mater', count: null, icon: Award }
                  ]).map((section) => (
                    <button
                      key={section.title}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition text-left group"
                    >
                      <div className="w-10 h-10 bg-[#1E1E1E]/10 flex items-center justify-center group-hover:bg-[#1E1E1E]/20 transition">
                        {section.icon ? <section.icon className="w-5 h-5 text-[#1E1E1E]" /> : <Users className="w-5 h-5 text-[#1E1E1E]" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{section.title}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </div>
                      {section.count && (
                        <span className="text-xs bg-[#A51C30]/20 text-[#1E1E1E] px-2 py-1 font-medium">
                          {section.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Updates & Events */}
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back, {user?.first_name || 'Dr. Sarah'}!</h2>
                <p className="text-gray-600">Stay connected with your alma mater and fellow alumni. There are new updates since your last visit.</p>
              </div>

              {/* Recent Updates */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Updates</h3>
                <div className="space-y-4">
                  {(dashboard?.updates || [
                    { title: '2024 Alumni Reunion Announced', date: '3 days ago', type: 'event' },
                    { title: 'New Job: Chief Medical Officer at LUTH', date: '1 week ago', type: 'job' },
                    { title: 'Mentorship Program Registration Open', date: '2 weeks ago', type: 'mentorship' }
                  ]).map((update, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${ update.type === 'event' ? 'bg-purple-100' : update.type === 'job' ? 'bg-blue-100' : 'bg-green-100' }`}>
                        {update.type === 'event' ? <Calendar className="w-4 h-4 text-purple-600" /> :
                         update.type === 'job' ? <Briefcase className="w-4 h-4 text-blue-600" /> :
                         <Heart className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{update.title}</p>
                        <p className="text-xs text-gray-500">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {(dashboard?.events || [
                    { title: 'Class of 2019 Reunion', date: 'December 15, 2024', location: 'BMU Campus', type: 'Reunion' },
                    { title: 'Healthcare Leaders Networking', date: 'November 20, 2024', location: 'Lagos', type: 'Networking' },
                    { title: 'Alumni Homecoming 2024', date: 'February 14, 2025', location: 'BMU Campus', type: 'Homecoming' }
                  ]).map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50">
                      <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-[#A51C30]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-[#1E1E1E]/10 text-[#1E1E1E] text-xs font-medium mb-1">
                          {event.type}
                        </span>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-[#1E1E1E] font-medium hover:underline">
                  View All Events
                </button>
              </div>
            </div>

            {/* Right Column - Featured & Networking */}
            <div className="space-y-6">
              {/* Featured Alumni */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Featured Alumni</h3>
                <div className="space-y-4">
                  {(dashboard?.featured || [
                    { name: 'Dr. Michael Brown', role: 'Surgeon', organization: 'Johns Hopkins', year: '2015' },
                    { name: 'Dr. Chioma Nwosu', role: 'Public Health Director', organization: 'WHO Nigeria', year: '2017' },
                    { name: 'Dr. James Peters', role: 'Medical Researcher', organization: 'NIH', year: '2016' }
                  ]).map((alumnus, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                        👨‍⚕️
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{alumnus.name}</p>
                        <p className="text-xs text-gray-500">{alumnus.role}</p>
                        <p className="text-xs text-[#A51C30]">{alumnus.organization}</p>
                      </div>
                      <span className="text-xs text-gray-400">'{alumnus.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Give Back CTA */}
              <div className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-6 text-white">
                <Award className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Give Back to BMU</h3>
                <p className="text-sm text-white/80 mb-4">Support the next generation of healthcare professionals through mentorship, donations, or career opportunities.</p>
                <button className="w-full py-2 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition">
                  Get Involved
                </button>
              </div>

              {/* Stay Connected */}
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Stay Connected</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                    <Globe className="w-5 h-5 text-[#1E1E1E]" />
                    <span className="text-sm">Alumni Website</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                    <Users className="w-5 h-5 text-[#A51C30]" />
                    <span className="text-sm">LinkedIn Group</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                    <Mail className="w-5 h-5 text-[#A51C30]" />
                    <span className="text-sm">Alumni Newsletter</span>
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-4">
                <h3 className="font-bold text-gray-900 mb-3">Alumni Office</h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:+2348031110020" className="flex items-center gap-2 text-gray-600 hover:text-[#1E1E1E] transition">
                    <Phone className="w-4 h-4" />
                    +234 803 111 0020
                  </a>
                  <a href="mailto:alumni@bmu.edu.ng" className="flex items-center gap-2 text-gray-600 hover:text-[#1E1E1E] transition">
                    <Mail className="w-4 h-4" />
                    alumni@bmu.edu.ng
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

