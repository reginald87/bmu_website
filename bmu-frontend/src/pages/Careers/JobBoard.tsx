import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Calendar,
  CheckCircle,
  Send,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Upload,
  Loader2
} from 'lucide-react';
import { useJobs } from '../../services/apiHooks';
import type { JobPostingData } from '../../services/mockData';

const formatSalary = (min: number | null, max: number | null) => {
  if (min === null && max === null) return 'Negotiable';
  const fmt = (n: number) => '₦' + n.toLocaleString('en-US');
  if (min !== null && max !== null) return `${fmt(min)} - ${fmt(max)}/year`;
  if (min !== null) return `From ${fmt(min)}/year`;
  return `Up to ${fmt(max as number)}/year`;
};

const ApplicationModal = ({ job, isOpen, onClose }: { job: JobPostingData | null; isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        qualification: '',
        experience: '',
        coverLetter: '',
        resume: null
      });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-ink-900 to-primary-600 p-6 text-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
                  <p className="text-white/80 mt-1">{job.department}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 hover:bg-white/20 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">Thank you for applying. We will review your application and contact you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                          placeholder="+234 800 000 0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification *</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                        placeholder="e.g., Ph.D in Anatomy, M.Sc Nursing"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
                        placeholder="e.g., 5 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        required
                        rows={4}
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent resize-none"
                        placeholder="Tell us why you're the best candidate for this position..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV *</label>
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-ink-900 transition">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Drag and drop your resume here, or click to browse</p>
                      <p className="text-xs text-gray-400">PDF, DOCX up to 5MB</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    {formData.resume && (
                      <p className="text-sm text-ink-900 mt-2">Selected: {formData.resume.name}</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-ink-900 text-white font-medium hover:bg-ink-900/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedJob, setSelectedJob] = useState<JobPostingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobs, isLoading } = useJobs();

  const departments = ['All', ...Array.from(new Set((jobs ?? []).map(job => job.department)))];
  const jobTypes = ['All', ...Array.from(new Set((jobs ?? []).map(job => job.job_type_display)))];

  const filteredJobs = (jobs ?? []).filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesJobType = selectedJobType === 'All' || job.job_type_display === selectedJobType;
    return matchesSearch && matchesDepartment && matchesJobType;
  });

  const openApplication = (job: JobPostingData) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Job Board | Bayelsa Medical University</title>
        <meta name="description" content="Explore career opportunities at Bayelsa Medical University. Join our team of dedicated professionals in healthcare education." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-[180px] pb-16" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/centres/career" className="hover:text-white transition">Career Centre</Link>
              <span>/</span>
              <span className="text-white">Job Board</span>
            </div>

            <h1 className="text-display text-white mb-4">
              Join Our <span className="text-primary-600">Team</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl mx-auto">
              Discover exciting career opportunities at Bayelsa Medical University. 
              Be part of our mission to transform healthcare education.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search job titles, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
              />
            </div>

            <div className="md:w-48">
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="md:w-64">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:ring-2 focus:ring-ink-900 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredJobs.length} of {(jobs ?? []).length} open positions
          </p>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="py-24 bg-white">
          <div className="container-custom">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-ink-900" />
              <p className="mt-4 text-gray-600">Loading job listings...</p>
            </div>
          </div>
        </section>
      )}

      {/* Job Listings */}
      {!isLoading && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="space-y-6">
              {filteredJobs.map((job, index) => {
                const reqs = job.requirements.split('\n').filter(Boolean);
                const resps = job.responsibilities.split('\n').filter(Boolean);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 p-6 transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-ink-900 font-medium">{job.department}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium">
                            {job.is_open ? 'Open' : 'Closed'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.job_type_display}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatSalary(job.salary_min, job.salary_max)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Deadline: {job.application_deadline}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {reqs.slice(0, 3).map((req, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                              {req}
                            </span>
                          ))}
                          {reqs.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                              +{reqs.length - 3} more
                            </span>
                          )}
                        </div>

                        {resps.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Responsibilities</p>
                            <div className="flex flex-wrap gap-2">
                              {resps.slice(0, 2).map((resp, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm">
                                  {resp}
                                </span>
                              ))}
                              {resps.length > 2 && (
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm">
                                  +{resps.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Benefits:</span> {job.benefits}
                        </p>
                      </div>

                      <div className="flex lg:flex-col items-center lg:items-stretch gap-3 lg:w-48">
                        <button
                          onClick={() => openApplication(job)}
                          className="flex-1 lg:w-full py-3 px-6 bg-ink-900 text-white font-medium hover:bg-ink-900/90 transition flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why Join Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join BMU?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be part of a dynamic community dedicated to excellence in healthcare education and research.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: 'Professional Growth',
                desc: 'Continuous learning opportunities and career advancement programs'
              },
              {
                icon: CheckCircle,
                title: 'Great Benefits',
                desc: 'Competitive salary, health insurance, and work-life balance'
              },
              {
                icon: Clock,
                title: 'Impactful Work',
                desc: 'Make a difference in healthcare education and community health'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-ink-900/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-ink-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ApplicationModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default JobBoard;
