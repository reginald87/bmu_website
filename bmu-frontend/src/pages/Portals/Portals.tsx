import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  GraduationCap,
  Users,
  Stethoscope,
  ArrowRight,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { usePortalDefinitions } from '../../services/apiHooks';

const iconMap: Record<string, React.ElementType> = {
  UserCircle,
  GraduationCap,
  Users,
  Stethoscope,
};

const fallbackPortals = [
  {
    id: 'applicant',
    title: 'Applicant Portal',
    description: 'Apply for admission, track application status, and manage your admission documents.',
    icon: 'UserCircle',
    to: '/portals/applicant',
    color: '#1E1E1E',
    audience: 'Prospective Students',
    features: ['Online Application', 'Document Upload', 'Application Tracking', 'Fee Payment']
  },
  {
    id: 'login',
    title: 'BMU Portal',
    description: 'Single sign-on for all roles — students, lecturers, HODs, deans, administrators, and bursary staff.',
    icon: 'GraduationCap',
    to: '/portals/login',
    color: '#A51C30',
    audience: 'All BMU Community',
    features: ['Single Login', 'Course Registration', 'Grade Management', 'Fee Payments']
  },
  {
    id: 'alumni',
    title: 'Alumni Portal',
    description: 'Connect with fellow graduates, access career resources, and stay updated.',
    icon: 'Users',
    to: '/portals/alumni',
    color: '#A51C30',
    audience: 'Graduates',
    features: ['Directory Access', 'Job Board', 'Networking', 'Transcript Requests']
  },
  {
    id: 'cpd',
    title: 'CPD Platform',
    description: 'Professional development courses, certifications, and CME credits for healthcare professionals.',
    icon: 'Stethoscope',
    to: '/portals/cpd',
    color: '#1E1E1E',
    audience: 'Healthcare Professionals',
    features: ['Online Courses', 'Certifications', 'CME Credits', 'Accredited Programs']
  }
];

export const Portals = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: apiPortals } = usePortalDefinitions();

  const portalList = (apiPortals && apiPortals.length > 0
    ? apiPortals.map((p) => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        icon: iconMap[p.icon] || UserCircle,
        to: p.url,
        color: p.color,
        audience: p.audience,
        features: Array.isArray(p.features) ? p.features.map(String) : [],
      }))
    : fallbackPortals.map((p) => ({
        ...p,
        icon: iconMap[p.icon] || UserCircle,
      }))
  );

  const handlePortalClick = (portalId: string, to: string) => {
    // If user is already authenticated and trying to access their portal
    if (isAuthenticated && user?.role === portalId) {
      navigate(to);
      return;
    }

    // Otherwise redirect to the portal's login page
    navigate(to);
  };

  return (
    <>
      <Helmet>
        <title>Portals | Bayelsa Medical University</title>
        <meta name="description" content="Access BMU portals for applicants, students, alumni, and healthcare professionals." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <span>/</span>
                <span className="text-white font-medium">Portals</span>
              </div>
              <h1 className="text-display text-white mb-6">
                Access Your <span className="text-[#A51C30]">Portal</span>
              </h1>
              <p className="text-lead text-white/80 max-w-2xl">
                Secure access points for all BMU stakeholders. Choose your portal below to login or register.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Security Notice */}
        <div className="bg-amber-100 border-b border-amber-200">
          <div className="container-custom py-4">
            <div className="flex items-center gap-3 text-amber-900">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                <span className="font-bold">Secure Access:</span> All portals require authentication.
                Please use your registered credentials to access your portal.
              </p>
            </div>
          </div>
        </div>

          {/* Student & Community Portals */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student & Community Portals</h2>
            <p className="text-gray-500 mb-8">Access portals for students, applicants, alumni, and professionals.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portalList.map((portal, index) => (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handlePortalClick(portal.id, portal.to)}
                  className="w-full text-left group bg-white shadow-sm transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-8" style={{ backgroundColor: portal.color + '15' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-16 h-16 flex items-center justify-center"
                        style={{ backgroundColor: portal.color }}
                      >
                        <portal.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center gap-2 text-gray-800 bg-white/90 px-3 py-1.5 border border-gray-200">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Secure</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{portal.title}</h2>
                    <p className="text-sm font-semibold text-gray-900">
                      {portal.audience}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-8 pt-6">
                    <p className="text-gray-900 mb-6 leading-relaxed">{portal.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {portal.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-900 border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                      <span
                        className="drop-shadow-sm"
                        style={{ color: portal.color === '#A51C30' ? '#1E1E1E' : portal.color }}
                      >
                        Access Portal
                      </span>
                      <ArrowRight
                        className="w-5 h-5"
                        style={{ color: portal.color === '#A51C30' ? '#1E1E1E' : portal.color }}
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Need Help Section */}
        <section className="bg-white border-t">
          <div className="container-custom py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Accessing Your Portal?</h2>
              <p className="text-gray-800 mb-8">
                If you're having trouble logging in or don't have an account yet, 
                our support team is here to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#1E1E1E' }}
                >
                  Contact Support
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold border-2 transition hover:bg-gray-50"
                  style={{ borderColor: '#1E1E1E', color: '#1E1E1E' }}
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

