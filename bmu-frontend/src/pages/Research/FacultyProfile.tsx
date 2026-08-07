import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, BookOpen, FileText, Users, ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { useFacultyById } from '../../services/apiHooks';

interface CustomLink {
  id: number;
  label: string;
  url: string;
  display_order: number;
}

interface FacultyData {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  position: string;
  position_display: string;
  department: string | null;
  college: string | null;
  email: string | null;
  profile_image: string | null;
  bio: string;
  research_interests: string;
  orcid_id: string | null;
  google_scholar_url: string | null;
  researchgate_url: string | null;
  citations: number;
  h_index: number;
  i10_index: number;
  publications: { title: string; year: number; journal: string; citations: number }[];
  custom_links: CustomLink[];
}

export const FacultyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const raw = useFacultyById(id ? parseInt(id) : 0);
  const { data: _faculty, isLoading } = raw;

  const faculty = _faculty as unknown as FacultyData | undefined;

  if (isLoading) {
    return (
      <section className="relative pt-[140px] pb-16 overflow-hidden min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1E1E1E' }}>
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
          <Link to="/academics/faculty" className="text-[#1E1E1E] hover:underline">
            Return to Faculty Directory
          </Link>
        </div>
      </>
    );
  }

  const initials = `${faculty.first_name?.[0] || ''}${faculty.last_name?.[0] || ''}`;

  return (
    <>
      <Helmet>
        <title>{faculty.first_name} {faculty.last_name} | Faculty Profile | Bayelsa Medical University</title>
        <meta name="description" content={`${faculty.position_display} at ${faculty.college || 'BMU'}. View profile, research, publications.`} />
      </Helmet>

      <section className="relative pt-[140px] pb-16 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
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
                {faculty.profile_image ? (
                  <img src={faculty.profile_image} alt={`${faculty.first_name} ${faculty.last_name}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-gray-400">{initials}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {faculty.title} {faculty.first_name} {faculty.last_name}
                </h1>
                <p className="text-xl text-[#A51C30] font-medium mb-1">{faculty.position_display}</p>
                <p className="text-white/80 mb-4">{faculty.department}{faculty.college ? ` • ${faculty.college}` : ''}</p>

                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${faculty.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  {faculty.orcid_id && (
                    <a href={`https://orcid.org/${faculty.orcid_id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <Globe className="w-4 h-4" />
                      ORCID
                    </a>
                  )}
                  {faculty.google_scholar_url && (
                    <a href={faculty.google_scholar_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <ExternalLink className="w-4 h-4" />
                      Google Scholar
                    </a>
                  )}
                  {faculty.researchgate_url && (
                    <a href={faculty.researchgate_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition">
                      <ExternalLink className="w-4 h-4" />
                      ResearchGate
                    </a>
                  )}
                  {faculty.custom_links?.map((link) => (
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
                    <Users className="w-5 h-5 text-[#1E1E1E]" />
                    Biography
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{faculty.bio}</p>
                </div>
              )}

              {faculty.research_interests && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1E1E1E]" />
                    Research Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {faculty.research_interests.split(',').map((interest, i) => (
                      <span key={i} className="px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: '#A51C3020', color: '#A51C30' }}>
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {faculty.publications && faculty.publications.length > 0 && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1E1E1E]" />
                    Selected Publications
                  </h2>
                  <div className="space-y-4">
                    {faculty.publications.map((pub, i) => (
                      <div key={i} className="border-l-4 border-[#A51C30] pl-4 py-2">
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
                      <a href={`mailto:${faculty.email}`} className="text-[#1E1E1E] hover:underline">{faculty.email}</a>
                    </div>
                  </div>
                </div>
              </div>

              {(faculty.orcid_id || faculty.google_scholar_url || faculty.researchgate_url || faculty.custom_links?.length > 0) && (
                <div className="bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Research Profiles</h3>
                  <div className="space-y-3">
                    {faculty.orcid_id && (
                      <a href={`https://orcid.org/${faculty.orcid_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-[#A51C30] transition">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">ORCID</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.google_scholar_url && (
                      <a href={faculty.google_scholar_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-[#A51C30] transition">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Google Scholar</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.researchgate_url && (
                      <a href={faculty.researchgate_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-[#A51C30] transition">
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">ResearchGate</span>
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </a>
                    )}
                    {faculty.custom_links?.map((link) => (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-[#A51C30] transition">
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
                      <p className="text-2xl font-bold text-[#1E1E1E]">{faculty.citations}</p>
                      <p className="text-sm text-gray-500">Citations</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50">
                      <p className="text-2xl font-bold text-[#1E1E1E]">{faculty.h_index}</p>
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
