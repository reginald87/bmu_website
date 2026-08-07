import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Building2, CheckCircle, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { useNonAcademicStaffById } from '../../services/apiHooks';

export const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { data: staff, isLoading } = useNonAcademicStaffById(id || '');

  if (isLoading) {
    return (
      <section className="pt-[140px] min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!staff) {
    return <Navigate to="/about/staff" replace />;
  }

  const responsibilities = staff.responsibilities ? staff.responsibilities.split('\n').filter(r => r.trim()) : [];
  const initials = staff.full_name.split(' ').map(n => n[0]).join('');

  return (
    <>
      <Helmet>
        <title>{staff.full_name} - Staff Profile | Bayelsa Medical University</title>
        <meta name="description" content={`${staff.full_name} - ${staff.job_title} at Bayelsa Medical University`} />
      </Helmet>

      <section className="pt-[140px] pb-12" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <Link to="/about/staff" className="hover:text-white transition">Staff Directory</Link>
              <span>/</span>
              <span className="text-white">{staff.full_name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-40 h-40 md:w-48 md:h-48 overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0 border-4 border-white/30">
                {staff.photo_url ? (
                  <img src={staff.photo_url} alt={staff.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white text-4xl md:text-5xl font-bold">{initials}</div>
                )}
              </div>

              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl md:text-4xl font-bold">{staff.full_name}</h1>
                  {staff.employee_id && (
                    <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-0.5 rounded">#{staff.employee_id}</span>
                  )}
                </div>
                <p className="text-xl text-white/90 mb-1">{staff.job_title}</p>
                <p className="text-white/70 mb-4">{staff.department_name || staff.college_name}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#A51C30]" />
                    <span className="text-white/90">{staff.category_display}</span>
                  </div>
                  {staff.employment_type && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/90">•</span>
                      <span className="text-white/90">{staff.employment_type}</span>
                    </div>
                  )}
                  {staff.office_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A51C30]" />
                      <span className="text-white/90">{staff.office_location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <Link to="/about/staff" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1E1E1E] transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Staff Directory
          </Link>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                {staff.qualifications && <p className="text-gray-700 leading-relaxed mb-6">{staff.qualifications}</p>}

                {responsibilities.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                    <ul className="space-y-3 mb-8">
                      {responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {staff.research_interests && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#1E1E1E]" />
                      Research Interests
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{staff.research_interests}</p>
                  </div>
                )}

                {staff.publications && staff.publications.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#1E1E1E]" />
                      Publications
                    </h2>
                    <div className="space-y-4">
                      {staff.publications.map((pub, i) => (
                        <div key={i} className="border-l-4 border-[#A51C30] pl-4 py-2">
                          <h4 className="font-semibold text-gray-900">{pub.title}</h4>
                          <p className="text-sm text-gray-600">
                            {pub.journal} • {pub.year}
                            {pub.citations !== undefined && ` • ${pub.citations} citations`}
                          </p>
                          {pub.doi && (
                            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1E1E1E] hover:underline inline-flex items-center gap-1 mt-1">
                              DOI: {pub.doi} <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${staff.email}`} className="text-gray-900 hover:text-[#1E1E1E] transition">{staff.email}</a>
                    </div>
                  </div>
                  {staff.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${staff.phone}`} className="text-gray-900 hover:text-[#1E1E1E] transition">{staff.phone}</a>
                      </div>
                    </div>
                  )}
                  {staff.office_location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Office</p>
                        <p className="text-gray-900">{staff.office_location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-900">{staff.department_name || 'N/A'}</p>
                    </div>
                  </div>
                  {staff.college_name && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">College</p>
                        <p className="text-gray-900">{staff.college_name}</p>
                      </div>
                    </div>
                  )}
                  {staff.date_joined && (
                    <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Staff since</p>
                        <p className="text-gray-900">{staff.date_joined}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StaffProfile;
