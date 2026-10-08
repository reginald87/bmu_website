import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';

const routeMap: Record<string, string> = {
  student: '/portals/student',
  faculty: '/portals/lecturer',
  staff: '/portals/admin',
  admin: '/portals/admin',
  hod: '/portals/hod',
  dean: '/portals/dean',
  vc: '/portals/vc',
  registrar: '/portals/registrar',
  bursary: '/portals/bursary',
  applicant: '/portals/applicant',
  alumni: '/portals/alumni',
};

export const UniversalLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = routeMap[user.role] || '/portals/student';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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

  return (
    <>
      <Helmet>
        <title>Login | Bayelsa Medical University</title>
        <meta name="description" content="Secure universal login for all BMU portals." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] pt-[180px] pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white overflow-hidden">
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#A51C30] p-8 text-center">
              <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">BMU Portal</h1>
              <p className="text-white/80 mt-2">One account for all university portals</p>
            </div>

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
                    <input type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none transition"
                      placeholder="you@bmu.edu.ng" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    <input type="password" value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none transition"
                      placeholder="Enter your password" required />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition disabled:opacity-50">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link to="/portals/reset-password" className="text-sm text-[#A51C30] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 text-xs text-blue-700">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  Role-based access. You will be redirected to your dashboard after login.
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Need help? Contact <a href="mailto:it@bmu.edu.ng" className="text-[#1E1E1E] hover:underline">it@bmu.edu.ng</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
