import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Mail,
  Phone,
  BookOpen,
  FileText,
  GraduationCap,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useLeadershipById, useLeadership } from '../../services/apiHooks';
import { useMemo } from 'react';

export const LeaderProfile = () => {
  const { leaderId } = useParams<{ leaderId: string }>();
  const navigate = useNavigate();

  const numericId = parseInt(leaderId || '', 10);
  const { data: apiLeader, isLoading } = useLeadershipById(isNaN(numericId) ? (leaderId || '') : numericId);
  const { data: allLeaders } = useLeadership();

  const leader = apiLeader;

  const allLeaderIds = useMemo(() => {
    if (!allLeaders) return [];
    return allLeaders.map(l => l.id);
  }, [allLeaders]);

  const currentIndex = allLeaderIds.indexOf(leader?.id || -1);
  const prevLeader = currentIndex > 0 ? allLeaderIds[currentIndex - 1] : null;
  const nextLeader = currentIndex < allLeaderIds.length - 1 ? allLeaderIds[currentIndex + 1] : null;

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

  if (!leader) {
    return (
      <>
        <Helmet>
          <title>Profile Not Found - Bayelsa Medical University</title>
        </Helmet>
        <section className="pt-[140px] min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
          <div className="container-custom text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-4">Profile Not Found</h1>
            <p className="text-white/70 mb-8">The leadership profile you're looking for does not exist.</p>
            <Link to="/about/leadership" className="inline-flex items-center gap-2 px-8 py-3 bg-[#A51C30] text-white font-semibold hover:bg-[#8a1828] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              View All Leadership
            </Link>
          </div>
        </section>
      </>
    );
  }

  const publications = leader.publications || [];
  const initials = leader.full_name.split(' ').map(n => n[0]).join('');
  const achievements = leader.achievements ? leader.achievements.split('\n').filter(a => a.trim()) : [];

  return (
    <>
      <Helmet>
        <title>{leader.full_name} - {leader.position_display} | Bayelsa Medical University</title>
        <meta name="description" content={`${leader.full_name} - ${leader.position_display}`} />
      </Helmet>

      <section className="pt-[140px] pb-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <Link to="/about/leadership" className="hover:text-white transition">Leadership</Link>
              <span>/</span>
              <span className="text-white">{leader.full_name}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-40 h-40 md:w-48 md:h-48 overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0 border-4 border-white/30">
                {leader.photo ? (
                  <img src={leader.photo} alt={leader.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white text-4xl md:text-5xl font-bold">{initials}</div>
                )}
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{leader.full_name}</h1>
                <p className="text-xl text-[#A51C30] font-medium mb-2">{leader.position_display}</p>
                {leader.specific_title && (
                  <p className="text-white/70 mb-3">{leader.specific_title}</p>
                )}
                {leader.qualifications && (
                  <div className="flex items-center gap-2 text-white/80 mb-3">
                    <GraduationCap className="w-5 h-5 text-[#A51C30]" />
                    <span>{leader.qualifications}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <Link to="/about/leadership" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1E1E1E] transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Leadership
          </Link>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{leader.biography}</p>
              </motion.div>

              {leader.research_interests && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1E1E1E]" />
                    Research Interests
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{leader.research_interests}</p>
                </motion.div>
              )}

              {achievements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#1E1E1E]" />
                    Key Achievements
                  </h2>
                  <ul className="space-y-3">
                    {achievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#A51C30] mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{a}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {publications.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1E1E1E]" />
                    Publications
                  </h2>
                  <div className="space-y-4">
                    {publications.map((pub, i) => (
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
                </motion.div>
              )}
            </div>

            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {leader.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${leader.email}`} className="text-gray-900 hover:text-[#1E1E1E] transition">{leader.email}</a>
                      </div>
                    </div>
                  )}
                  {leader.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#1E1E1E] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${leader.phone}`} className="text-gray-900 hover:text-[#1E1E1E] transition">{leader.phone}</a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {(prevLeader !== null || nextLeader !== null) && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="mt-6 space-y-3">
                  {prevLeader !== null && (
                    <button
                      onClick={() => navigate(`/about/leadership/${prevLeader}`)}
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 transition text-left flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Previous</p>
                        <p className="text-sm font-medium text-gray-900">
                          {allLeaders?.find(l => l.id === prevLeader)?.full_name || ''}
                        </p>
                      </div>
                    </button>
                  )}
                  {nextLeader !== null && (
                    <button
                      onClick={() => navigate(`/about/leadership/${nextLeader}`)}
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 transition text-right flex items-center gap-2 justify-between flex-row-reverse"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-600 rotate-180" />
                      <div>
                        <p className="text-xs text-gray-500">Next</p>
                        <p className="text-sm font-medium text-gray-900">
                          {allLeaders?.find(l => l.id === nextLeader)?.full_name || ''}
                        </p>
                      </div>
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LeaderProfile;
