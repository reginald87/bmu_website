import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Building2, Briefcase, ExternalLink, BadgeCheck, Calendar } from 'lucide-react';
import { useNonAcademicStaff } from '../../services/apiHooks';

const employmentTypeColors: Record<string, string> = {
  full_time: 'bg-emerald-100 text-emerald-800',
  part_time: 'bg-amber-100 text-amber-800',
  contract: 'bg-blue-100 text-blue-800',
  intern: 'bg-purple-100 text-purple-800',
};

interface StaffMember {
  id: string;
  name: string;
  title: string;
  department: string;
  division: string;
  email: string;
  phone: string;
  office: string;
  bio: string;
  responsibilities: string[];
  image?: string;
}

const fallbackStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Mr. James Okon',
    title: 'Director of Student Affairs',
    department: 'Student Services',
    division: 'Administration',
    email: 'j.okon@bmu.edu.ng',
    phone: '+234 803 222 0001',
    office: 'Admin Block, Room 301',
    bio: 'Mr. Okon has over 15 years of experience in student services and administration. He oversees all student welfare programs, counseling services, and student governance support.',
    responsibilities: [
      'Student welfare and counseling',
      'Student governance support',
      'Disciplinary matters',
      'Student activities coordination'
    ]
  },
  {
    id: '2',
    name: 'Mrs. Grace Ebi',
    title: 'Registrar',
    department: 'Academic Affairs',
    division: 'Administration',
    email: 'registrar@bmu.edu.ng',
    phone: '+234 803 222 0002',
    office: 'Senate Building, Room 105',
    bio: 'Mrs. Ebi manages all academic records, student registrations, and transcript processing. She ensures compliance with academic regulations and standards.',
    responsibilities: [
      'Academic records management',
      'Student registration',
      'Transcript processing',
      'Academic policy compliance'
    ]
  },
  {
    id: '3',
    name: 'Mr. Michael Douglas',
    title: 'Director of Finance',
    department: 'Finance & Accounts',
    division: 'Administration',
    email: 'finance@bmu.edu.ng',
    phone: '+234 803 222 0003',
    office: 'Finance Block, Room 201',
    bio: 'Mr. Douglas oversees all financial operations including budgeting, payroll, and financial reporting. He ensures transparency and accountability in university finances.',
    responsibilities: [
      'Budget planning and management',
      'Financial reporting',
      'Payroll administration',
      'Grants and funding management'
    ]
  },
  {
    id: '4',
    name: 'Mrs. Sarah Ibe',
    title: 'Director of HR',
    department: 'Human Resources',
    division: 'Administration',
    email: 'hr@bmu.edu.ng',
    phone: '+234 803 222 0004',
    office: 'Admin Block, Room 205',
    bio: 'Mrs. Ibe leads all human resource functions including recruitment, staff development, and employee relations. She is committed to building a world-class workforce.',
    responsibilities: [
      'Staff recruitment and onboarding',
      'Performance management',
      'Training and development',
      'Employee relations'
    ]
  },
  {
    id: '5',
    name: 'Mr. Emmanuel Akpan',
    title: 'Chief Librarian',
    department: 'University Library',
    division: 'Academic Support',
    email: 'library@bmu.edu.ng',
    phone: '+234 803 222 0005',
    office: 'Main Library, Floor 2',
    bio: 'Mr. Akpan manages the university library system including digital resources, archives, and information services. He champions information literacy across campus.',
    responsibilities: [
      'Library resource management',
      'Digital library services',
      'Information literacy programs',
      'Archives and special collections'
    ]
  },
  {
    id: '6',
    name: 'Mrs. Blessing Peters',
    title: 'Director of ICT',
    department: 'Information Technology',
    division: 'Academic Support',
    email: 'ict@bmu.edu.ng',
    phone: '+234 803 222 0006',
    office: 'ICT Center, Room 101',
    bio: 'Mrs. Peters leads the university IT infrastructure, e-learning platforms, and digital transformation initiatives. She ensures seamless technology integration.',
    responsibilities: [
      'IT infrastructure management',
      'E-learning platform support',
      'Network security',
      'Digital transformation'
    ]
  },
];

export const Staff = () => {
  const { data: apiStaff, isLoading } = useNonAcademicStaff();

  const allStaff = useMemo(() => {
    if (isLoading || !apiStaff) return [];
    return apiStaff;
  }, [apiStaff, isLoading]);

  const divisions = useMemo(() => {
    const set = new Set(allStaff.map(s => s.category_display).filter(Boolean));
    return ['All Divisions', ...Array.from(set)];
  }, [allStaff]);

  const departments = useMemo(() => {
    const set = new Set(allStaff.map(s => s.department_name).filter(Boolean));
    return ['All Departments', ...Array.from(set)];
  }, [allStaff]);

  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All Divisions');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  const filteredStaff = useMemo(() => {
    return allStaff.filter(s => {
      const matchesSearch = !searchTerm ||
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.department_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDivision = divisionFilter === 'All Divisions' || s.category_display === divisionFilter;
      const matchesDepartment = departmentFilter === 'All Departments' || s.department_name === departmentFilter;
      return matchesSearch && matchesDivision && matchesDepartment;
    });
  }, [allStaff, searchTerm, divisionFilter, departmentFilter]);

  return (
    <>
      <Helmet>
        <title>Staff Directory - Bayelsa Medical University</title>
        <meta name="description" content="Meet our dedicated administrative and support staff at Bayelsa Medical University." />
      </Helmet>

      {/* Hero */}
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
              <span className="text-white font-medium">Staff Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-[#A51C30]">Staff</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Meet the dedicated professionals who keep Bayelsa Medical University running smoothly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: allStaff.length ? `${allStaff.length}` : '...', label: 'Staff Members' },
              { value: departments.length > 1 ? `${departments.length - 1}` : '...', label: 'Departments' },
              { value: divisions.length > 1 ? `${divisions.length - 1}` : '...', label: 'Divisions' },
              { value: '24/7', label: 'Support Available' },
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
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] w-full sm:w-64"
                />
              </div>
              <select
                value={divisionFilter}
                onChange={e => setDivisionFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E1E1E]"
              >
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
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

      {/* Staff Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((staff, index) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
              >
                {/* Header with gradient */}
                <div className="h-20 bg-gradient-to-r from-[#A51C30] to-[#1E1E1E] relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 bg-white p-1">
                      {staff.photo_url ? (
                        <img src={staff.photo_url} alt={staff.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-400">
                            {staff.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {staff.employment_type && (
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${employmentTypeColors[staff.employment_type] || 'bg-gray-100 text-gray-700'}`}>
                        {staff.employment_type_display || staff.employment_type}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-10 pb-6 px-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1E1E1E] transition-colors">
                        {staff.full_name}
                      </h3>
                      {staff.employee_id && (
                        <span className="text-[10px] text-gray-400 font-mono">#{staff.employee_id}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#A51C30' }}>{staff.job_title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{staff.department_name || staff.college_name || 'University'}</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${staff.email}`} className="hover:text-[#1E1E1E] transition">
                        {staff.email}
                      </a>
                    </div>
                    {staff.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${staff.phone}`} className="hover:text-[#1E1E1E] transition">
                          {staff.phone}
                        </a>
                      </div>
                    )}
                    {staff.office_location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{staff.office_location}</span>
                      </div>
                    )}
                    {staff.date_joined && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Joined {staff.date_joined}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio preview */}
                  {staff.qualifications && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {staff.qualifications}
                    </p>
                  )}

                  {/* Responsibilities badges */}
                  {staff.responsibilities && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {staff.responsibilities.split('\n').filter(Boolean).slice(0, 2).map((r, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                          {r}
                        </span>
                      ))}
                      {staff.responsibilities.split('\n').filter(Boolean).length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{staff.responsibilities.split('\n').filter(Boolean).length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <Link
                    to={`/about/staff/${staff.id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 font-medium transition-all"
                    style={{ backgroundColor: '#1E1E1E10', color: '#1E1E1E' }}
                  >
                    View Profile
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!isLoading && filteredStaff.length === 0 && (
        <section className="py-16">
          <div className="container-custom text-center">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No staff members match your filters.</p>
          </div>
        </section>
      )}
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom text-center">
          <Briefcase className="w-12 h-12 mx-auto mb-4" style={{ color: '#A51C30' }} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            We're always looking for talented professionals to support our mission of healthcare excellence.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all"
            style={{ backgroundColor: '#A51C30', color: '#1E1E1E' }}
          >
            View Open Positions
          </Link>
        </div>
      </section>
    </>
  );
};

export default Staff;
