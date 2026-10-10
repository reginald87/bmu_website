import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  FileText,
  Calendar,
  CreditCard,
  HelpCircle,
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Loader2,
  type LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmissionRequirements, useImportantDates, usePageSections } from '../../services/apiHooks';
import { ALLOW_API_MOCKS } from '../../services/api';

interface ApplicationStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const fallbackSteps = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Register on the BMU admission portal and create your applicant profile.',
    icon: Users
  },
  {
    step: 2,
    title: 'Fill Application',
    description: 'Complete the online application form with accurate academic and personal details.',
    icon: FileText
  },
  {
    step: 3,
    title: 'Upload Documents',
    description: 'Upload scanned copies of required documents including credentials and passport photo.',
    icon: CheckCircle
  },
  {
    step: 4,
    title: 'Pay Fee',
    description: 'Pay the non-refundable application fee through the secure payment gateway.',
    icon: CreditCard
  },
  {
    step: 5,
    title: 'Submit',
    description: 'Review and submit your application. Print the acknowledgment slip.',
    icon: CheckCircle
  },
  {
    step: 6,
    title: 'Screening',
    description: 'Attend the post-UTME screening on scheduled date with required documents.',
    icon: Calendar
  }
];

export const Admissions = () => {
  const { data: requirements, isLoading: reqLoading } = useAdmissionRequirements();
  const { data: importantDates, isLoading: datesLoading } = useImportantDates();
  const { data: sections } = usePageSections('admissions');
  const applicationSteps = (sections?.find(s => s.section_key === 'application_steps')?.data as ApplicationStep[]) ?? (ALLOW_API_MOCKS ? fallbackSteps : []);

  const undergradReqs = requirements?.filter(r => r.category === 'undergraduate') ?? [];
  const postgradReqs = requirements?.filter(r => r.category === 'postgraduate') ?? [];

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-primary-600';
      case 'upcoming': case 'extended': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'bg-primary-600/20 text-ink-900';
      case 'extended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateStr; }
  };

  return (
    <>
      <Helmet>
        <title>Admissions | Bayelsa Medical University</title>
        <meta name="description" content="Apply to Bayelsa Medical University. Learn about admission requirements, application process, important dates, and available programs." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/academics" className="hover:text-white transition">Academics</Link>
              <span>/</span>
              <span className="text-white font-medium">Admissions</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Join <span className="text-primary-600">BMU</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl mb-8">
              Begin your journey to becoming a healthcare professional. Explore our admission
              requirements and start your application today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-ink-900 font-bold hover:bg-white transition"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/academics/programs"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-ink-900 transition"
              >
                Explore Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-headline text-gray-900 mb-4">Application Process</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to complete your application to Bayelsa Medical University
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ink-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-title text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-body text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container-custom">
          {reqLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Undergraduate */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-8 h-8 text-primary-600" />
                <h2 className="text-headline text-gray-900">Undergraduate Requirements</h2>
              </div>

              <div className="space-y-6">
                {undergradReqs.length === 0 ? (
                  <p className="text-gray-500">No undergraduate requirements found.</p>
                ) : (
                undergradReqs.map((req) => (
                  <div key={req.id} className="bg-white p-6 border border-gray-100">
                    <h3 className="text-title text-ink-900 mb-4">{req.title}</h3>
                    <ul className="space-y-3">
                      {req.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-body text-gray-600">
                          <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
                )}
              </div>
            </motion.div>

            {/* Postgraduate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-ink-900" />
                <h2 className="text-headline text-gray-900">Postgraduate Requirements</h2>
              </div>

              <div className="space-y-6">
                {postgradReqs.length === 0 ? (
                  <p className="text-gray-500">No postgraduate requirements found.</p>
                ) : (
                postgradReqs.map((req) => (
                  <div key={req.id} className="bg-white p-6 border border-gray-100">
                    <h3 className="text-title text-ink-900 mb-4">{req.title}</h3>
                    <ul className="space-y-3">
                      {req.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-body text-gray-600">
                          <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
                )}
              </div>
            </motion.div>
          </div>
          )}
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
              <h2 className="text-headline text-gray-900">Important Dates</h2>
            </div>
            <p className="text-lead text-gray-600">Mark your calendar for these key admission dates</p>
          </div>

          {datesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : !importantDates || importantDates.length === 0 ? (
            <p className="text-center text-gray-500">No important dates found.</p>
          ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              {importantDates.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-6 ${index !== importantDates.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 ${statusColor(item.status)}`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.event}</h4>
                      <p className="text-body text-gray-600">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium ${statusBadge(item.status)}`}>
                    {item.status_display}
                  </span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-primary-600)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
                <h2 className="text-headline text-white">Need Help?</h2>
              </div>
              <p className="text-lead text-white/90 mb-6">
                Our admissions team is ready to assist you with any questions about the
                application process, requirements, or programs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold hover:bg-primary-600 transition"
                >
                  Contact Admissions
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+2348031110000"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold hover:bg-white hover:text-primary-600 transition"
                >
                  Call: +234 803 111 0000
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <h4 className="text-white font-semibold mb-2">Email</h4>
                <p className="text-white/80 text-body">admissions@bmu.edu.ng</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <h4 className="text-white font-semibold mb-2">Office Hours</h4>
                <p className="text-white/80 text-body">Mon-Fri: 8AM - 4PM</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <h4 className="text-white font-semibold mb-2">Location</h4>
                <p className="text-white/80 text-body">Admissions Office, Admin Block</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <h4 className="text-white font-semibold mb-2">Hotline</h4>
                <p className="text-white/80 text-body">+234 803 111 0000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
