import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageSquare,
  Calendar,
  LogOut,
  Bell,
  Plus,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ArrowRight,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';



const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Draft', icon: FileText },
  submitted: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Submitted', icon: CheckCircle },
  under_review: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Under Review', icon: Clock },
  revision_requested: { color: 'text-red-600', bg: 'bg-red-100', label: 'Revision Requested', icon: AlertCircle },
  interview: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Interview Scheduled', icon: Calendar },
  accepted: { color: 'text-green-600', bg: 'bg-green-100', label: 'Accepted', icon: CheckCircle },
  rejected: { color: 'text-red-600', bg: 'bg-red-100', label: 'Not Admitted', icon: AlertCircle },
  waitlisted: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Waitlisted', icon: Clock }
};

const ApplicantLogin = () => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerData, setRegisterData] = useState({ first_name: '', last_name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          confirm_password: password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          role: 'applicant',
        });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; detail?: string } } };
      setError(e?.response?.data?.message || e?.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[140px] bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] flex items-center justify-center p-4">
      <Helmet>
        <title>Applicant Login | Bayelsa Medical University</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Applicant Portal</h1>
          <p className="text-white/80 mt-2">Bayelsa Medical University</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 font-medium text-center transition ${ activeTab === 'login' ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' : 'text-gray-700 hover:text-gray-900' }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 font-medium text-center transition ${ activeTab === 'register' ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' : 'text-gray-700 hover:text-gray-900' }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="border-gray-300 text-[#1E1E1E] focus:ring-[#1E1E1E]" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-[#1E1E1E] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={registerData.first_name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={registerData.last_name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="+234 801 234 5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 border-gray-300 text-[#1E1E1E] focus:ring-[#1E1E1E]" required />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the <a href="#" className="text-[#1E1E1E] hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-[#1E1E1E] hover:underline">Privacy Policy</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
          Need help? <a href="mailto:admissions@bmu.edu.ng" className="text-[#1E1E1E] hover:underline">Contact Admissions</a>
        </div>
      </motion.div>
    </div>
  );
};

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'messages'>('overview');
  const [applications, setApplications] = useState<any[]>([]);
  const [hasPendingApp, setHasPendingApp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [replacingDoc, setReplacingDoc] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const application = selectedApplication
    ? applications.find(app => app.id === selectedApplication)
    : applications[0];

  const canEdit = application?.status === 'draft' || application?.status === 'revision_requested';

  const startEditing = () => {
    setEditForm({
      firstName: application?.firstName || '',
      lastName: application?.lastName || '',
      email: application?.email || '',
      phone: application?.phone || '',
      dateOfBirth: application?.dateOfBirth || '',
      address: application?.address || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const saveEditing = async () => {
    if (!application) return;
    setSaving(true);
    try {
      const res = await apiClient.patch(`/v1/admissions/applications/${application.id}/update/`, {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        date_of_birth: editForm.dateOfBirth,
        address: editForm.address,
      });
      if (res.status === 200) {
        setApplications(prev => prev.map(a => a.id === application.id ? { ...a, ...editForm, firstName: editForm.firstName, lastName: editForm.lastName, email: editForm.email, phone: editForm.phone, dateOfBirth: editForm.dateOfBirth, address: editForm.address } : a));
        setIsEditing(false);
        setEditForm({});
      }
    } catch (err) {
      console.error('Failed to save application', err);
    } finally {
      setSaving(false);
    }
  };

  const replaceDocument = async (docIndex: number, file: File) => {
    if (!application) return;
    const doc = application.documents[docIndex];
    if (!doc || !doc.id) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.patch(`/v1/admissions/applications/${application.id}/documents/${doc.id}/replace/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200) {
        setApplications(prev => prev.map(a => {
          if (a.id !== application.id) return a;
          const newDocs = [...a.documents];
          newDocs[docIndex] = { ...newDocs[docIndex], status: 'pending', uploadDate: new Date().toISOString() };
          return { ...a, documents: newDocs };
        }));
        setReplacingDoc(null);
      }
    } catch (err) {
      console.error('Failed to replace document', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Fetch both applications list and check for existing draft
    Promise.all([
      apiClient.get('/v1/admissions/applications/list'),
      apiClient.get('/v1/admissions/applications/user/pending')
    ])
      .then(([applicationsRes, pendingRes]) => {
        let apiApps = [];
        if (applicationsRes.data?.length) {
          // Convert API data to match frontend application structure
          apiApps = applicationsRes.data.map((app: Record<string, unknown>) => ({
            id: app.id as string,
            program: app.program_title as string || '',
            programLevel: '',
            status: app.status as string || 'draft',
            submittedDate: app.submitted_at as string || '',
            lastUpdated: app.updated_at as string || '',
            progress: app.progress_percentage as number || 0,
            firstName: app.first_name as string || '',
            lastName: app.last_name as string || '',
            email: app.email as string || '',
            phone: app.phone as string || '',
            dateOfBirth: app.date_of_birth as string || '',
            gender: app.gender_display as string || '',
            studentType: app.student_type_display as string || '',
            address: app.address as string || '',
            academicRecords: (app.academic_records as any[]) || [],
            steps: ((app.steps || []) as any[]).map((s: any) => ({
              name: s.name_display || s.name,
              status: s.status,
              date: s.completed_at,
              decision: s.decision,
            })),
            documents: ((app.documents || []) as any[]).map((d: any) => ({
              id: d.id,
              name: d.name_display || d.name,
              status: d.status,
              uploadDate: d.uploaded_at,
              file: d.file,
            })),
            messages: ((app.messages || []) as any[]).map((m: any) => ({
              id: m.id,
              type: m.type,
              from: m.from_name,
              date: m.created_at,
              text: m.text,
            })),
          }));
          setApplications(apiApps);
        }
        
        // Check if user has a pending application (for "Resume" button)
        const hasPending = pendingRes.data && pendingRes.data.length > 0;
        if (hasPending) {
          setHasPendingApp(true);
        }
      })
      .catch((err) => console.error('Failed to load applications', err));
  }, []);

  return (
    <div className="min-h-screen pt-[140px] bg-gray-50">
      <Helmet>
        <title>Applicant Dashboard | Bayelsa Medical University</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] text-white">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Applicant Portal</h1>
                  <p className="text-sm text-white/70">{user?.email || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#A51C30]"></span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start New Application CTA */}
            <Link
              to="/apply/portal"
              className="block w-full p-4 bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] text-white transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Start New Application</p>
                  <p className="text-sm text-white/80">Begin your BMU journey</p>
                </div>
              </div>
            </Link>

            {/* Profile Card */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#1E1E1E]/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-[#1E1E1E]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`}</h2>
                  <p className="text-sm text-gray-500">Applicant</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email || ''}</span>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">My Applications</h3>
                <Link
                  to="/apply/portal"
                  className="flex items-center gap-1 text-sm text-[#1E1E1E] hover:underline"
                >
                  <Plus className="w-4 h-4" /> New
                </Link>
              </div>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No applications yet</p>
                ) : applications.map((app) => {
                  const config = statusConfig[app.status] || statusConfig.draft;
                  const Icon = config.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApplication(app.id)}
                      className={`w-full text-left p-3 transition ${ selectedApplication === app.id || (!selectedApplication && app === applications[0]) ? 'bg-[#1E1E1E]/10 border border-[#1E1E1E]/20' : 'hover:bg-gray-50' }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{app.program || 'Untitled'}</p>
                          <p className="text-xs text-gray-500">{app.id}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/apply/portal" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                  <Plus className="w-5 h-5 text-[#1E1E1E]" />
                  <span className="text-sm">Start Application</span>
                </Link>
                {(applications.some(app => app.status === 'draft') || hasPendingApp) && (
                  <Link to="/apply/portal" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition bg-[#A51C30]/10">
                    <div className="w-5 h-5 rounded-full bg-[#A51C30] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E1E1E]">Resume Application</span>
                  </Link>
                )}
                <Link to="/academics/admissions" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                  <FileText className="w-5 h-5 text-[#A51C30]" />
                  <span className="text-sm">Requirements</span>
                </Link>
                <Link to="/academics/admissions" className="flex items-center gap-3 p-3 hover:bg-gray-50 transition">
                  <MessageSquare className="w-5 h-5 text-[#A51C30]" />
                  <span className="text-sm">FAQs</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Application Header */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{application?.program}</h2>
                    <span className={`px-3 py-1 text-sm font-medium ${statusConfig[application?.status || 'draft'].bg} ${statusConfig[application?.status || 'draft'].color}`}>
                      {statusConfig[application?.status || 'draft'].label}
                    </span>
                  </div>
                  <p className="text-gray-600">Application ID: <span className="font-mono text-[#1E1E1E]">{application?.id}</span></p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div>
                    <span className="block text-gray-400">Submitted</span>
                    <span className="font-medium text-gray-900">{application?.submittedDate}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div>
                    <span className="block text-gray-400">Last Updated</span>
                    <span className="font-medium text-gray-900">{application?.lastUpdated}</span>
                  </div>
                </div>
                {canEdit && !isEditing && (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Application
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Application Progress</h3>
                <span className="text-2xl font-bold text-[#1E1E1E]">{application?.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] transition-all duration-500"
                  style={{ width: `${application?.progress}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm border border-gray-100">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 font-medium text-center transition ${ activeTab === 'overview' ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' : 'text-gray-500 hover:text-gray-700' }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 py-4 font-medium text-center transition ${ activeTab === 'documents' ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' : 'text-gray-500 hover:text-gray-700' }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 py-4 font-medium text-center transition ${ activeTab === 'messages' ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' : 'text-gray-500 hover:text-gray-700' }`}
                >
                  Messages ({application?.messages.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Personal Information</h4>
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveEditing}
                              disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition text-sm"
                            >
                              <Save className="w-4 h-4" />
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Full Name</p>
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editForm.firstName}
                                onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 text-sm"
                                placeholder="First name"
                              />
                              <input
                                type="text"
                                value={editForm.lastName}
                                onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 text-sm"
                                placeholder="Last name"
                              />
                            </div>
                          ) : (
                            <p className="font-medium text-gray-900">{application?.firstName} {application?.lastName}</p>
                          )}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Email</p>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm"
                            />
                          ) : (
                            <p className="font-medium text-gray-900">{application?.email}</p>
                          )}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Phone</p>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm"
                            />
                          ) : (
                            <p className="font-medium text-gray-900">{application?.phone}</p>
                          )}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editForm.dateOfBirth}
                              onChange={e => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm"
                            />
                          ) : (
                            <p className="font-medium text-gray-900">{application?.dateOfBirth}</p>
                          )}
                        </div>
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium text-gray-900">{application?.gender}</p>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <p className="text-sm text-gray-500">Student Type</p>
                          <p className="font-medium text-gray-900">{application?.studentType}</p>
                        </div>
                        <div className="p-4 bg-gray-50 md:col-span-2">
                          <p className="text-sm text-gray-500">Address</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.address}
                              onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 text-sm"
                            />
                          ) : (
                            <p className="font-medium text-gray-900">{application?.address}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Academic Records */}
                    {application?.academicRecords && application.academicRecords.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Academic Records</h4>
                        <div className="space-y-3">
                          {application.academicRecords.map((rec: any, i: number) => (
                            <div key={i} className="p-4 bg-gray-50 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{rec.institution_name}</p>
                                <p className="text-sm text-gray-500">{rec.type} — {rec.year_of_completion}</p>
                              </div>
                              <span className="text-sm text-gray-600 capitalize">{rec.grade || rec.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress Steps */}
                    {application?.steps && application.steps.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Application Steps</h4>
                        <div className="space-y-4">
                          {application?.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${ step.status === 'completed' ? 'bg-green-100 text-green-600' : step.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400' }`}>
                                {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                 step.status === 'in_progress' ? <Clock className="w-5 h-5" /> :
                                 <div className="w-5 h-5 border-2 border-current" />}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${ step.status === 'completed' || step.status === 'in_progress' ? 'text-gray-900' : 'text-gray-400' }`}>
                                  {step.name}
                                </p>
                                {step.date && (
                                  <p className="text-sm text-gray-500">Completed on {step.date}</p>
                                )}
                                {step.status === 'in_progress' && (
                                  <p className="text-sm text-blue-600">In Progress</p>
                                )}
                                {(step as any).decision && (
                                  <p className={`text-sm font-medium ${ (step as any).decision === 'Accepted' ? 'text-green-600' : 'text-red-600' }`}>
                                    Decision: {(step as any).decision}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Required Documents</h4>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90 transition">
                        <Upload className="w-4 h-4" />
                        Upload Document
                      </button>
                    </div>
                    <div className="space-y-3">
                    {application?.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 flex items-center justify-center ${ doc.status === 'verified' ? 'bg-green-100' : doc.status === 'under_review' ? 'bg-yellow-100' : 'bg-gray-100' }`}>
                              <FileText className={`w-5 h-5 ${ doc.status === 'verified' ? 'text-green-600' : doc.status === 'under_review' ? 'text-yellow-600' : 'text-gray-600' }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">
                                Uploaded on {doc.uploadDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium ${ doc.status === 'verified' ? 'bg-green-100 text-green-600' : doc.status === 'under_review' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600' }`}>
                              {doc.status === 'verified' ? 'Verified' :
                               doc.status === 'under_review' ? 'Under Review' :
                               'Pending'}
                            </span>
                            {canEdit && (
                              <div>
                                {replacingDoc === index ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      className="text-xs w-32"
                                      onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) replaceDocument(index, file);
                                      }}
                                    />
                                    <button onClick={() => setReplacingDoc(null)} className="text-gray-500 hover:text-gray-700">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setReplacingDoc(index)}
                                    className="text-sm text-[#1E1E1E] hover:underline"
                                  >
                                    Replace
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {application?.messages.map((message) => (
                      <div key={message.id} className={`p-4 ${ message.type === 'success' ? 'bg-green-50 border border-green-200' : message.type === 'action' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200' }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${ message.type === 'success' ? 'bg-green-100 text-green-600' : message.type === 'action' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600' }`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                             message.type === 'action' ? <AlertCircle className="w-4 h-4" /> :
                             <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{message.from}</p>
                              <p className="text-sm text-gray-500">{message.date}</p>
                            </div>
                            <p className="text-gray-700">{message.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
              <p className="text-white/80 mb-4">Our admissions team is here to help you with your application.</p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:admissions@bmu.edu.ng" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 transition">
                  <Mail className="w-4 h-4" />
                  <span>admissions@bmu.edu.ng</span>
                </a>
                <a href="tel:+2348031110020" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 transition">
                  <Phone className="w-4 h-4" />
                  <span>+234 803 111 0020</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ApplicantPortal = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated || user?.role !== 'applicant' ? (
        <ApplicantLogin key="login" />
      ) : (
        <ApplicantDashboard key="dashboard" />
      )}
    </AnimatePresence>
  );
};

