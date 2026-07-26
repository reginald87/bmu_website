import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, BookOpen, ArrowRight, Filter } from 'lucide-react';
import { useFaculty } from '../../services/apiHooks';

interface FacultyMember {
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
  citations: number;
  h_index: number;
}

const positionColors: Record<string, string> = {
  professor: '#A51C30',
  associate_professor: '#1E1E1E',
  senior_lecturer: '#2563EB',
  lecturer: '#059669',
  assistant_lecturer: '#7C3AED',
  visiting_professor: '#DC2626',
};

export const FacultyDirectory = () => {
  const { data: rawFaculty = [], isLoading } = useFaculty();
  const faculty = rawFaculty as unknown as FacultyMember[];
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');

  const positions = useMemo(() => {
    const set = new Set(faculty.map((f) => f.position));
    return Array.from(set);
  }, [faculty]);

  const filtered = useMemo(() => {
    return faculty.filter((f) => {
      const matchesSearch =
        !search ||
        f.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (f.department && f.department.toLowerCase().includes(search.toLowerCase())) ||
        (f.college && f.college.toLowerCase().includes(search.toLowerCase())) ||
        f.research_interests.toLowerCase().includes(search.toLowerCase());
      const matchesPosition = positionFilter === 'all' || f.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [faculty, search, positionFilter]);

  return (
    <>
      <Helmet>
        <title>Faculty Directory | Bayelsa Medical University</title>
        <meta name="description" content="Meet our distinguished faculty members at Bayelsa Medical University." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-16 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[#A51C30] font-semibold text-sm tracking-wider uppercase mb-3">Research</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Faculty Directory</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Meet our distinguished faculty members driving research and education at BMU.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16">
        <div className="container-custom">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, department, college, or research interests..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-[#A51C30] focus:ring-1 focus:ring-[#A51C30] outline-none transition"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 focus:border-[#A51C30] focus:ring-1 focus:ring-[#A51C30] outline-none transition appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            Showing {filtered.length} of {faculty.length} faculty members
          </p>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#A51C30] rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-500">Loading faculty...</p>
            </div>
          )}

          {/* Faculty Grid */}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No faculty members found matching your criteria.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((member, index) => {
              const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`;
              const color = positionColors[member.position] || '#A51C30';
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/research/faculty/${member.id}`}
                    className="block bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group h-full"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {member.profile_image ? (
                          <img
                            src={member.profile_image}
                            alt={member.full_name}
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
                            style={{ backgroundColor: color }}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-[#A51C30] transition truncate">
                            {member.title} {member.full_name}
                          </h3>
                          <p className="text-sm font-medium" style={{ color }}>
                            {member.position_display}
                          </p>
                          {member.department && (
                            <p className="text-sm text-gray-500 truncate">{member.department}</p>
                          )}
                          {member.college && (
                            <p className="text-sm text-gray-400 truncate">{member.college}</p>
                          )}
                        </div>
                      </div>

                      {member.research_interests && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {member.research_interests.split(',').slice(0, 3).map((interest, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                              {interest.trim()}
                            </span>
                          ))}
                          {member.research_interests.split(',').length > 3 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-400">
                              +{member.research_interests.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {member.citations > 0 && (
                            <span>{member.citations.toLocaleString()} citations</span>
                          )}
                          {member.h_index > 0 && (
                            <span>h-index: {member.h_index}</span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#A51C30] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FacultyDirectory;
