import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Mail, Phone, GraduationCap, Users, Building2, ExternalLink, BookOpen, UserPlus } from 'lucide-react';
import { useLeadership } from '../../services/apiHooks';

const execPositions = new Set(['vc', 'dvc_academic', 'dvc_admin', 'registrar']);
const keyPositions = new Set(['bursar', 'librarian', 'director']);
const deanPositions = new Set(['dean']);
const hodPositions = new Set(['hod']);

export function Leadership() {
  const { data: leaders } = useLeadership();

  const executiveLeadership = (leaders ?? []).filter(l => execPositions.has(l.position));
  const keyOffices = (leaders ?? []).filter(l => keyPositions.has(l.position));
  const collegeDeans = (leaders ?? []).filter(l => deanPositions.has(l.position));
  const headsOfDept = (leaders ?? []).filter(l => hodPositions.has(l.position));
  const assigned = new Set([...executiveLeadership, ...keyOffices, ...collegeDeans, ...headsOfDept].map(l => l.id));
  const otherLeadership = (leaders ?? []).filter(l => !assigned.has(l.id));

  const sectionConfig = [
    { title: 'Executive Leadership', icon: Award, data: executiveLeadership },
    { title: 'Key Administrative Offices', icon: Building2, data: keyOffices },
    { title: 'Deans of Faculty', icon: GraduationCap, data: collegeDeans },
    { title: 'Heads of Department', icon: BookOpen, data: headsOfDept },
    { title: 'Other Leadership Positions', icon: UserPlus, data: otherLeadership },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Leadership - Bayelsa Medical University</title>
        <meta name="description" content="Meet the leadership team of Bayelsa Medical University" />
      </Helmet>

      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Leadership</span>
            </div>
            <h1 className="text-display text-white mb-6">
              University <span className="text-[#A51C30]">Leadership</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Meet the dedicated team guiding BMU towards excellence in medical education, research, and community service.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-b" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: (leaders ?? []).length.toString() + '+', label: 'Leadership Team' },
              { value: '100%', label: 'Experienced Leaders' },
              { value: '6', label: 'Colleges & Schools' },
              { value: '25+', label: 'Years Combined Experience' },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: '#A51C30' }}>{stat.value}</div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-custom py-16 space-y-16">
        {sectionConfig.map(({ title, icon: SectionIcon, data }) => data.length > 0 && (
          <div key={title}>
            <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <SectionIcon className="w-6 h-6" style={{ color: '#A51C30' }} />
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                >
                  <Link to={`/about/leadership/${leader.id}`} className="block">
                    <div className="h-24 bg-gradient-to-r from-[#1E1E1E] to-[#A51C30] relative">
                      <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 bg-white p-1">
                          {leader.photo ? (
                            <img src={leader.photo} alt={leader.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-2xl font-bold text-gray-400">
                                {leader.full_name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="pt-12 pb-6 px-6">
                    <div className="mb-4">
                      <Link to={`/about/leadership/${leader.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1E1E1E] transition-colors">
                          {leader.full_name}
                        </h3>
                      </Link>
                      <p className="text-sm font-medium" style={{ color: '#A51C30' }}>{leader.specific_title || leader.position_display}</p>
                      {leader.qualifications && (
                        <p className="text-xs text-gray-500 mt-1">{leader.qualifications}</p>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{leader.biography}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                      {leader.email && (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {leader.email}</span>
                      )}
                      {leader.phone && (
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {leader.phone}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/about/leadership/${leader.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium transition-all"
                        style={{ backgroundColor: '#1E1E1E', color: 'white' }}
                      >
                        View Profile
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="p-2 border border-gray-200 hover:bg-gray-50 transition"
                          title="Send email"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {(!leaders || leaders.length === 0) && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Leadership information is being updated. Please check back later.</p>
          </div>
        )}
      </div>

      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom text-center">
          <Award className="w-12 h-12 mx-auto mb-4" style={{ color: '#A51C30' }} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Meet Our Leaders
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Our leadership team is committed to advancing medical education, research, and healthcare delivery in Nigeria and beyond.
          </p>
        </div>
      </section>
    </div>
  );
}
