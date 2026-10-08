import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';

interface PasswordResetProps {
 portal: 'student' | 'alumni' | 'cpd';
 onBack: () => void;
}

const apiErrorMessage = (err: unknown, fallback: string): string => {
 const e = err as {
   response?: { data?: { error?: string; message?: string; detail?: string } };
 };
 return (
   e?.response?.data?.error ||
   e?.response?.data?.message ||
   e?.response?.data?.detail ||
   fallback
 );
};

export const PasswordReset = ({ portal, onBack }: PasswordResetProps) => {
 const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
 const [email, setEmail] = useState('');
 const [code, setCode] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const portalTitles = {
 student: 'Student Portal',
 alumni: 'Alumni Portal',
 cpd: 'CPD Platform'
 };

 const portalColors = {
 student: '#1E1E1E',
 alumni: '#A51C30',
 cpd: '#1E1E1E'
 };

 const handleEmailSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);

 if (!email.includes('@')) {
   setError('Please enter a valid email address');
   return;
 }

 setIsLoading(true);
 try {
   await authApi.requestPasswordReset(email);
   setStep('code');
 } catch (err) {
   setError(apiErrorMessage(err, 'Could not send the reset code. Please try again.'));
 } finally {
   setIsLoading(false);
 }
 };

 const handleCodeSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);

 if (code.length !== 6) {
   setError('Please enter the 6-digit verification code');
   return;
 }

 // The code is verified together with the new password
 setStep('password');
 };

 const handlePasswordSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError(null);

 if (password.length < 8) {
   setError('Password must be at least 8 characters long');
   return;
 }

 if (password !== confirmPassword) {
   setError('Passwords do not match');
   return;
 }

 setIsLoading(true);
 try {
   await authApi.confirmPasswordReset(email, code, password, confirmPassword);
   setStep('success');
 } catch (err) {
   const message = apiErrorMessage(err, 'Could not reset the password. Please try again.');
   setError(message);
   // Invalid/expired code — send the user back to re-enter it
   if (message.toLowerCase().includes('code')) {
     setCode('');
     setStep('code');
   }
 } finally {
   setIsLoading(false);
 }
 };

 return (
 <>
 <Helmet>
 <title>Reset Password - {portalTitles[portal]}</title>
 <meta name="description" content={`Reset your ${portalTitles[portal]} password`} />
 </Helmet>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="min-h-screen bg-gray-50 pt-[180px] pb-12 px-4"
 >
 <div className="max-w-md mx-auto">
 <div className="bg-white p-8">
 {/* Back Button */}
 <button
 onClick={onBack}
 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6"
 >
 <ArrowLeft className="w-4 h-4" />
 <span className="text-sm">Back to login</span>
 </button>

 {/* Header */}
 <div className="text-center mb-8">
 <div
 className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
 style={{ backgroundColor: `${portalColors[portal]}15` }}
 >
 <Lock className="w-8 h-8" style={{ color: portalColors[portal] }} />
 </div>
 <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
 <p className="text-gray-600 mt-2">
 {step === 'email' && 'Enter your email to receive a verification code'}
 {step === 'code' && 'Enter the 6-digit code sent to your email'}
 {step === 'password' && 'Create a new password for your account'}
 {step === 'success' && 'Your password has been reset successfully'}
 </p>
 </div>

 {/* Error Message */}
 {error && (
 <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-center gap-3">
 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
 <p className="text-sm text-red-700">{error}</p>
 </div>
 )}

 {/* Step 1: Email */}
 {step === 'email' && (
 <form onSubmit={handleEmailSubmit} className="space-y-6">
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
 className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
 style={{ '--tw-ring-color': portalColors[portal] } as React.CSSProperties}
 placeholder="Enter your email"
 required
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="w-full py-3 text-white font-semibold transition disabled:opacity-50"
 style={{ backgroundColor: portalColors[portal] }}
 >
 {isLoading ? 'Sending...' : 'Send Verification Code'}
 </button>
 </form>
 )}

 {/* Step 2: Verification Code */}
 {step === 'code' && (
 <form onSubmit={handleCodeSubmit} className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Verification Code
 </label>
 <input
 type="text"
 value={code}
 onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
 className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-center text-2xl tracking-widest"
 style={{ '--tw-ring-color': portalColors[portal] } as React.CSSProperties}
 placeholder="000000"
 maxLength={6}
 required
 />
 <p className="mt-2 text-sm text-gray-500 text-center">
 Didn't receive it?{' '}
 <button
 type="button"
 onClick={() => setStep('email')}
 className="font-medium hover:underline"
 style={{ color: portalColors[portal] }}
 >
 Resend code
 </button>
 </p>
 </div>

 <button
 type="submit"
 disabled={isLoading || code.length !== 6}
 className="w-full py-3 text-white font-semibold transition disabled:opacity-50"
 style={{ backgroundColor: portalColors[portal] }}
 >
 {isLoading ? 'Verifying...' : 'Verify Code'}
 </button>
 </form>
 )}

 {/* Step 3: New Password */}
 {step === 'password' && (
 <form onSubmit={handlePasswordSubmit} className="space-y-6">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 New Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
 style={{ '--tw-ring-color': portalColors[portal] } as React.CSSProperties}
 placeholder="Enter new password"
 minLength={8}
 required
 />
 </div>
 <p className="mt-1 text-xs text-gray-500">
 Must be at least 8 characters long
 </p>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Confirm Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="password"
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
 style={{ '--tw-ring-color': portalColors[portal] } as React.CSSProperties}
 placeholder="Confirm new password"
 required
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="w-full py-3 text-white font-semibold transition disabled:opacity-50"
 style={{ backgroundColor: portalColors[portal] }}
 >
 {isLoading ? 'Resetting...' : 'Reset Password'}
 </button>
 </form>
 )}

 {/* Step 4: Success */}
 {step === 'success' && (
 <div className="text-center space-y-6">
 <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto">
 <CheckCircle className="w-8 h-8 text-green-600" />
 </div>

 <div>
 <h2 className="text-xl font-bold text-gray-900 mb-2">
 Password Reset Successful!
 </h2>
 <p className="text-gray-600">
 Your password has been reset. You can now log in with your new password.
 </p>
 </div>

 <button
 onClick={onBack}
 className="w-full py-3 text-white font-semibold transition"
 style={{ backgroundColor: portalColors[portal] }}
 >
 Go to Login
 </button>
 </div>
 )}
 </div>
 </div>
 </motion.div>
 </>
 );
};
