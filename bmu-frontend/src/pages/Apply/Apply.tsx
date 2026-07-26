import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  GraduationCap,
  ArrowRight,
  Calendar,
  FileText,
  DollarSign,
  HelpCircle,
  CheckCircle,
  Clock,
  Users,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

const fallbackSteps = [
  {
    step: 1,
    title: 'Choose Program',
    description: 'Select from undergraduate, postgraduate, or certificate programs',
    icon: GraduationCap
  },
  {
    step: 2,
    title: 'Complete Application',
    description: 'Fill out the online application form with your details',
    icon: FileText
  },
  {
    step: 3,
    title: 'Pay Fee',
    description: 'Pay the non-refundable application fee',
    icon: DollarSign
  },
  {
    step: 4,
    title: 'Upload Documents',
    description: 'Submit required academic and identification documents',
    icon: FileText
  },
  {
    step: 5,
    title: 'Await Decision',
    description: 'Receive admission decision within 4-6 weeks',
    icon: Clock
  }
];

const fallbackDeadlines = [
  { program: 'Undergraduate (Fall 2025)', deadline: 'June 30, 2025', status: 'Open' },
  { program: 'Postgraduate (Fall 2025)', deadline: 'July 15, 2025', status: 'Open' },
  { program: 'PhD Programs (Fall 2025)', deadline: 'May 31, 2025', status: 'Closing Soon' },
  { program: 'Certificate Courses', deadline: 'Rolling', status: 'Open' }
];

const fallbackRequirements = [
  'Completed secondary education (or equivalent) for undergraduate',
  'Bachelor\'s degree for postgraduate programs',
  'Minimum GPA requirements vary by program',
  'English proficiency for international students',
  'Valid identification documents',
  'Application fee payment'
];

const fallbackStats = [
  { value: '4-6', label: 'Weeks Processing', icon: Clock },
  { value: '₦10,000', label: 'Local App Fee', icon: DollarSign },
  { value: '$50', label: 'Intl App Fee', icon: Globe },
  { value: '85%', label: 'Acceptance Rate', icon: Users }
];

export const Apply = () => {
  const { data: sections } = usePageSections('apply');
  const applicationSteps = (sections?.find(s => s.section_key === 'application_steps')?.data as any[] || fallbackSteps);
  const upcomingDeadlines = (sections?.find(s => s.section_key === 'deadlines')?.data as any[] || fallbackDeadlines);
  const requirements = (sections?.find(s => s.section_key === 'requirements')?.data as any[] || fallbackRequirements);
  const stats = (sections?.find(s => s.section_key === 'stats')?.data as any[] || fallbackStats);

  return (
    <>
      <Helmet>
        <title>Apply | Bayelsa Medical University</title>
        <meta name="description" content="Apply to Bayelsa Medical University. Start your journey in healthcare education with our undergraduate, postgraduate, and professional programs." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-display text-white mb-6">
              Apply to <span className="text-[#A51C30]">BMU</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl mb-8">
              Begin your journey toward a rewarding career in healthcare. 
              Join thousands of students who have chosen Bayelsa Medical University 
              for their professional education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/portals/applicant"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
              >
                Apply Now - Login / Register <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/portals/applicant"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
              >
                Check Application Status
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
                <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">How to Apply</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to complete your application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {applicationSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-6 shadow-sm border border-gray-100 h-full">
                  <div className="w-12 h-12 bg-[#1E1E1E] flex items-center justify-center text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <item.icon className="w-6 h-6 text-[#A51C30] mb-3" />
                  <h3 className="text-title text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-body text-gray-600">{item.description}</p>
                </div>
                {index < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Deadlines */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-headline text-gray-900 mb-6">General Requirements</h2>
              <ul className="space-y-4">
                {requirements.map((req, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
                    <span className="text-body text-gray-700">{req}</span>
                  </motion.li>
                ))}
              </ul>
              <Link 
                to="/academics/admissions"
                className="inline-flex items-center gap-2 mt-6 text-[#1E1E1E] font-medium hover:underline"
              >
                View detailed requirements <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <h2 className="text-headline text-gray-900 mb-6">Application Deadlines</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((item, idx) => (
                  <motion.div
                    key={item.program}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.program}</h3>
                      <span className={`px-3 py-1 text-xs font-medium ${ item.status === 'Open' ? 'bg-green-100 text-green-700' : item.status === 'Closing Soon' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700' }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-small text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {item.deadline}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
        <div className="container-custom text-center">
          <h2 className="text-headline text-white mb-4">Ready to Begin?</h2>
          <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
            Start your application today and take the first step toward your healthcare career.
            Our admissions team is here to help you through every step.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/apply/portal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#A51C30] transition"
            >
              <HelpCircle className="w-5 h-5" />
              Get Help
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};


