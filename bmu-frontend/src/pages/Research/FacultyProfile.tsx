import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, BookOpen, FileText, Users, ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { useFacultyById } from '../../services/apiHooks';

export const FacultyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const raw = useFacultyById(id ? parseInt(id) : 0);
  const { data: faculty, isLoading } = raw;

  if (isLoading) {
    return (
      <section className="relative pt-[180px] pb-16 overflow-hidden min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!faculty) {
    return (
      <>
        <Helmet>
          <title>Faculty Not Found | Bayelsa Medical University</title>
        </Helmet>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Faculty Member Not Found</h1>
          <Link to="/academics/faculty" className="text-ink-900 hover:underline">
            Return to Faculty Directory
          </Link>
        </div>
      </>
    );
  }

  const initials = `${faculty.firstName?.[0] || ''}${faculty.lastName?.[0] || ''}`;

  return (
    <>
      <Helmet>
        <title>{faculty.firstName} {faculty.lastName} | Faculty Profile | Bayelsa Medical University</title>
        <meta name="description" content={`${faculty.positionDisplay || faculty.position} at ${faculty.college || 'BMU'}. View profile, research, publications.`} />
      </Helmet>

      <section className="relative pt-[180px] pb-16 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/academics/faculty" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to Faculty Directory
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-1 flex-shrink-0">
                {faculty.profileImage ? (
                  <img loading="lazy" decoding="async" src={faculty.profileImage} alt={`${faculty.firstName} ${faculty.lastName}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-gray-400">{initials}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {faculty.title} {faculty.firstName} {faculty.lastName}
                </h1>
                <p className="text-xl text-primary-600 font-medium mb-1">{faculty.positionDisplay || faculty.position}</p>
                <p className="text-white/80 mb-4">{faculty.department}{faculty.college ? ` • ${faculty.college}` : ''}</p>

                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${faculty.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  {faculty.orcidId && (
                    <a href={faculty.orcidId.startsWith('http') ? faculty.orcidId : `https://orcid.org/${faculty.orcidId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <Globe className="w-4 h-4" />
                      ORCID
                    </a>
                  )}
                  {faculty.googleScholarUrl && (
                    <a href={faculty.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <ExternalLink className="w-4 h-4" />
                      Google Scholar
                    </a>
                  )}
                  {faculty.researchgateUrl && (
                    <a href={faculty.researchgateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <ExternalLink className="w-4 h-4" />
                      ResearchGate
                    </a>
                  )}
                  {faculty.customLinks?.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <ExternalLink className="w-4 h-4" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              {faculty.bio && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-ink-900" />
                    Biography
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{faculty.bio}</p>
                </div>
              )}

              {faculty.researchInterests && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-ink-900" />
                    Research Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {faculty.researchInterests.split(',').map((interest, i) => (
                      <span key={i} className="px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 12.5%, transparent)', color: 'var(--color-primary-600)' }}>
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {faculty.publications && faculty.publications.length > 0 && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-ink-900" />
                    Selected Publications
                  </h2>
                  <div className="space-y-4">
                    {faculty.publications.map((pub, i) => (
                      <div key={i} className="border-l-4 border-primary-600 pl-4 py-2">
                        <h4 className="font-semibold text-gray-900">{pub.title}</h4>
                        <p className="text-sm text-gray-600">
                          {pub.journal} • {pub.year}
                          {pub.citations !== undefined && ` • ${pub.citations} citations`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${faculty.email}`} className="text-ink-900 hover:underline">{faculty.email}</a>
                    </div>
                  </div>
                </div>
              </div>

              {(faculty.orcidId || faculty.googleScholarUrl || faculty.researchgateUrl || (faculty.customLinks?.length ?? 0) > 0) && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Research Profiles</h3>
                  <div className="space-y-3">
                    {faculty.orcidId && (
                      <a href={faculty.orcidId.startsWith('http') ? faculty.orcidId : `https://orcid.org/${faculty.orcidId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">ORCID</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.googleScholarUrl && (
                      <a href={faculty.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Google Scholar</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.researchgateUrl && (
                      <a href={faculty.researchgateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">ResearchGate</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.customLinks?.map((link) => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">{link.label}</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {faculty.citations > 0 && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Research Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50">
                      <p className="text-2xl font-bold text-ink-900">{faculty.citations}</p>
                      <p className="text-sm text-gray-500">Citations</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50">
                      <p className="text-2xl font-bold text-ink-900">{faculty.hIndex}</p>
                      <p className="text-sm text-gray-500">h-Index</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FacultyProfile;
