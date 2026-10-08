import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, BookOpen, Award, ExternalLink, GraduationCap, Quote } from 'lucide-react';
import { useFaculty } from '../../services/apiHooks';

const positionGradients: Record<string, string> = {
  professor: 'from-[#1E1E1E] to-[#A51C30]',
  associate_professor: 'from-[#2a2a3d] to-[#7a1a28]',
  senior_lecturer: 'from-[#1a2a3a] to-[#A51C30]',
  lecturer: 'from-[#1E1E1E] to-[#5a1018]',
  assistant_lecturer: 'from-[#2a1a2a] to-[#7a1018]',
  visiting_professor: 'from-[#1a1a2e] to-[#A51C30]',
};

const formatPosition = (pos: string) =>
  pos.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const Faculty = () => {
  const { data: apiFaculty, isLoading } = useFaculty();

  const allFaculty = useMemo(() => apiFaculty || [], [apiFaculty]);

  const colleges = useMemo(() => {
    const set = new Set(allFaculty.map(f => f.college).filter(Boolean));
    return ['All Colleges', ...Array.from(set)];
  }, [allFaculty]);

  const departments = useMemo(() => {
    const set = new Set(allFaculty.map(f => f.department).filter(Boolean));
    return ['All Departments', ...Array.from(set)];
  }, [allFaculty]);

  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  const filteredFaculty = useMemo(() => {
    return allFaculty.filter(f => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        `${f.firstName} ${f.lastName}`.toLowerCase().includes(q) ||
        f.department?.toLowerCase().includes(q) ||
        f.college?.toLowerCase().includes(q) ||
        f.position.toLowerCase().includes(q);
      const matchesCollege = collegeFilter === 'All Colleges' || f.college === collegeFilter;
      const matchesDepartment = departmentFilter === 'All Departments' || f.department === departmentFilter;
      return matchesSearch && matchesCollege && matchesDepartment;
    });
  }, [allFaculty, searchTerm, collegeFilter, departmentFilter]);

  return (
    <>
      <Helmet>
        <title>Faculty Directory | Bayelsa Medical University</title>
        <meta name="description" content="Meet our distinguished faculty members at Bayelsa Medical University. World-class educators and researchers dedicated to healthcare excellence." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/academics" className="hover:text-white transition">Academics</Link>
              <span>/</span>
              <span className="text-white font-medium">Faculty</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-[#A51C30]">Faculty</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Meet our distinguished educators and researchers dedicated to advancing healthcare education and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: allFaculty.length ? `${allFaculty.length}` : '...', label: 'Faculty Members' },
              { value: allFaculty.length ? `${Math.round(allFaculty.filter(f => f.title && (f.title.includes('Professor') || f.title.includes('Dr.') || f.title.includes('Prof.'))).length / allFaculty.length * 100)}%` : '...', label: 'Doctoral Faculty' },
              { value: allFaculty.length ? `${allFaculty.reduce((s, f) => s + f.citations, 0)}+` : '...', label: 'Citations' },
              { value: departments.length > 1 ? `${departments.length - 1}` : '...', label: 'Departments' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold" style={{ color: '#A51C30' }}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] w-full sm:w-64"
                />
              </div>
              <select
                value={collegeFilter}
                onChange={e => setCollegeFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E]"
              >
                {colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E]"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#A51C30] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading faculty...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((faculty, index) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                >
                  <Link to={`/academics/faculty/${faculty.id}`} className="block">
                    <div className={`h-24 bg-gradient-to-r ${positionGradients[faculty.position] || 'from-[#1E1E1E] to-[#A51C30]'} relative`}>
                      <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 bg-white p-1">
                          {faculty.profileImage ? (
                            <img src={faculty.profileImage} alt={`${faculty.firstName} ${faculty.lastName}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-2xl font-bold text-gray-400">
                                {faculty.firstName.charAt(0)}{faculty.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-white/20 text-white rounded">
                          {formatPosition(faculty.position)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="pt-12 pb-6 px-6">
                    <div className="mb-4">
                      <Link to={`/academics/faculty/${faculty.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1E1E1E] transition-colors">
                          {faculty.firstName} {faculty.lastName}
                        </h3>
                      </Link>
                      <p className="text-sm font-medium" style={{ color: '#A51C30' }}>{faculty.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{faculty.department || faculty.college}</p>
                    </div>

                    {/* Bio preview */}
                    {faculty.bio && (
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{faculty.bio}</p>
                    )}

                    {/* Research interests as tags */}
                    {faculty.researchInterests && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {faculty.researchInterests.split(',').slice(0, 3).map((interest, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs"
                            style={{ backgroundColor: '#1E1E1E10', color: '#1E1E1E' }}
                          >
                            {interest.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{faculty.citations} citations</span>
                      </div>
                      {faculty.hIndex > 0 && (
                        <div className="flex items-center gap-1">
                          <Quote className="w-4 h-4" />
                          <span>h-index: {faculty.hIndex}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/academics/faculty/${faculty.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 font-medium transition-all"
                        style={{ backgroundColor: '#1E1E1E', color: 'white' }}
                      >
                        View Profile
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      {faculty.email && (
                        <a
                          href={`mailto:${faculty.email}`}
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
          )}
        </div>
      </section>

      {!isLoading && filteredFaculty.length === 0 && (
        <section className="py-16">
          <div className="container-custom text-center">
            <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No faculty members match your filters.</p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom text-center">
          <Award className="w-12 h-12 mx-auto mb-4" style={{ color: '#A51C30' }} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join Our Distinguished Faculty
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            We're always looking for talented educators and researchers passionate about advancing healthcare education.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all"
            style={{ backgroundColor: '#A51C30', color: '#1E1E1E' }}
          >
            View Career Opportunities
          </Link>
        </div>
      </section>
    </>
  );
};

export default Faculty;
