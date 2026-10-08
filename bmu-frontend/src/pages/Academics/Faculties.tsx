import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Microscope, HeartPulse, Activity, Stethoscope, School, ChevronRight, Loader2, Building2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FacultyData {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  college_id: number | null;
  college_name: string | null;
  college_slug: string | null;
  leadership_name: string;
  department_count: number;
  is_standalone: boolean;
}

interface CollegeGroup {
  id: number | string;
  name: string;
  slug: string;
  color: string;
  faculties: FacultyData[];
}

const standaloneColor = 'var(--color-ink-900)';

const fallbackColleges: CollegeGroup[] = [
  {
    id: 1, name: 'College of Medicine', slug: 'college-of-medicine',
    color: 'var(--color-ink-900)',
    faculties: [
      { id: 1, name: 'Faculty of Basic Medical Sciences', slug: 'faculty-of-basic-medical-sciences', code: 'FBMS', description: 'Foundational medical sciences — human anatomy, human physiology and biochemistry.', department_count: 3, college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: 'Dr. Theodore Allison', is_standalone: false },
      { id: 2, name: 'Faculty of Clinical Sciences', slug: 'faculty-of-clinical-sciences', code: 'FCLS', description: 'Clinical education culminating in the six-year MBBS degree.', department_count: 1, college_id: 1, college_name: 'College of Medicine', college_slug: 'college-of-medicine', leadership_name: 'Prof. Isaac J. Abasi', is_standalone: false },
    ]
  },
];

const fallbackStandalone: FacultyData[] = [
  { id: 3, name: 'Faculty of Basic Clinical Sciences', slug: 'faculty-of-basic-clinical-sciences', code: 'FBCS', description: 'Basic clinical disciplines including anatomical pathology.', department_count: 1, college_id: null, college_name: null, college_slug: null, leadership_name: 'Dr. Frederick Allison', is_standalone: true },
  { id: 4, name: 'Faculty of Dentistry', slug: 'faculty-of-dentistry', code: 'FDEN', description: 'Six-year BDS programme in oral and maxillofacial care.', department_count: 1, college_id: null, college_name: null, college_slug: null, leadership_name: '', is_standalone: true },
  { id: 5, name: 'Faculty of Health Sciences', slug: 'faculty-of-health-sciences', code: 'FHSS', description: 'Eleven departments delivering professional health programmes.', department_count: 11, college_id: null, college_name: null, college_slug: null, leadership_name: 'Dr. (Mrs) Gift Cornelius Timighe', is_standalone: true },
  { id: 6, name: 'Faculty of Pharmaceutical Sciences', slug: 'faculty-of-pharmaceutical-sciences', code: 'FPHS', description: 'Six-year Doctor of Pharmacy (Pharm.D) programme.', department_count: 1, college_id: null, college_name: null, college_slug: null, leadership_name: 'Prof. Ebiowei S. F. Orubu', is_standalone: true },
  { id: 7, name: 'Faculty of Science', slug: 'faculty-of-science', code: 'FSCI', description: 'Seven departments in the biological, physical and mathematical sciences.', department_count: 7, college_id: null, college_name: null, college_slug: null, leadership_name: 'Prof. Iniobong Reuben Inyang', is_standalone: true },
];

const iconMap: { [key: string]: React.ElementType } = {
  'Faculty of Basic Medical Sciences': Microscope,
  'Faculty of Basic Clinical Sciences': Activity,
  'Faculty of Clinical Sciences': Stethoscope,
  'Faculty of Dentistry': Stethoscope,
  'Faculty of Health Sciences': HeartPulse,
  'Faculty of Pharmaceutical Sciences': BookOpen,
  'Faculty of Science': BookOpen,
};

export const Faculties = () => {
  const { data: faculties = [], isLoading: loadingFaculties } = useQuery<FacultyData[]>({
    queryKey: ['faculties-list'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/public/faculties');
        const result = response.data;
        const items = result?.items || result || [];
        if (Array.isArray(items) && items.length > 0) {
          return items as FacultyData[];
        }
        return [...fallbackColleges.flatMap(c => c.faculties), ...fallbackStandalone];
      } catch {
        return [...fallbackColleges.flatMap(c => c.faculties), ...fallbackStandalone];
      }
    },
  });

  const { data: colleges = [], isLoading: loadingColleges } = useQuery<CollegeGroup[]>({
    queryKey: ['faculties'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/public/colleges');
        const result = response.data;
        const items = result?.items || result || [];
        if (Array.isArray(items) && items.length > 0) {
          return items as CollegeGroup[];
        }
        return fallbackColleges;
      } catch {
        return fallbackColleges;
      }
    },
  });

  const groupedByCollege: CollegeGroup[] = colleges.length > 0
    ? colleges.map(c => ({
        ...c,
        faculties: faculties.filter(f => f.college_id === c.id),
      })).filter(c => c.faculties.length > 0)
    : fallbackColleges;

  const standaloneFaculties: FacultyData[] = faculties.filter(f => f.is_standalone);

  const isLoading = loadingFaculties || loadingColleges;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-ink-900 animate-spin" />
      </div>
    );
  }

  const totalCollegeFaculties = groupedByCollege.reduce((acc, c) => acc + c.faculties.length, 0);
  const totalFaculties = totalCollegeFaculties + standaloneFaculties.length;

  return (
    <>
      <Helmet>
        <title>Faculties & Schools | Bayelsa Medical University</title>
        <meta name="description" content="Discover our world-class academic faculties dedicated to excellence in healthcare education." />
      </Helmet>

      <section className="relative pt-[180px] pb-20 overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/academics" className="hover:text-white transition">Academics</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Faculties</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-primary-600">Faculties</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Explore our academic faculties — both within colleges and as standalone units — each dedicated to excellence in healthcare education and research.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          {groupedByCollege.length === 0 && standaloneFaculties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No faculties available yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {groupedByCollege.map((college, collegeIndex) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: collegeIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{ backgroundColor: college.color || 'var(--color-ink-900)' }}
                    >
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-headline text-gray-900">{college.name}</h2>
                      <Link
                        to={`/colleges/${college.slug}`}
                        className="text-small text-ink-900 hover:underline"
                      >
                        View College Details →
                      </Link>
                    </div>
                  </div>

                  {college.faculties && college.faculties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {college.faculties.map((faculty, facultyIndex) => {
                        const Icon = iconMap[faculty.name] || BookOpen;
                        const color = college.color || 'var(--color-ink-900)';
                        return (
                          <motion.div
                            key={faculty.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: facultyIndex * 0.05 }}
                            className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow group"
                          >
                            <div className="p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className="w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-105"
                                  style={{ backgroundColor: `${color}15` }}
                                >
                                  <Icon className="w-7 h-7" style={{ color }} />
                                </div>
                                <div
                                  className="w-10 h-10 flex items-center justify-center text-white font-bold text-xs"
                                  style={{ backgroundColor: color }}
                                >
                                  {faculty.code || faculty.name.charAt(0)}
                                </div>
                              </div>
                              <h3 className="text-title text-gray-900 mb-2">{faculty.name}</h3>
                              <p className="text-body text-gray-600 mb-4 line-clamp-2">
                                {faculty.description || `Part of ${college.name}, offering specialized programs.`}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-small text-gray-500">
                                  {faculty.department_count || 0} Departments
                                </span>
                                <Link
                                  to={`/academics/faculties/${faculty.slug}`}
                                  className="inline-flex items-center gap-2 text-ink-900 font-medium hover:gap-3 transition-all"
                                >
                                  Explore
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No faculties listed for this college yet.</p>
                  )}
                </motion.div>
              ))}

              {standaloneFaculties.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      style={{ backgroundColor: standaloneColor }}
                    >
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-headline text-gray-900">Standalone Faculties</h2>
                      <p className="text-small text-gray-500">
                        Independent academic units with dedicated departments
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {standaloneFaculties.map((faculty, facultyIndex) => {
                      const Icon = iconMap[faculty.name] || BookOpen;
                      return (
                        <motion.div
                          key={faculty.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: facultyIndex * 0.05 }}
                          className="bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow group"
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div
                                className="w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-105"
                                style={{ backgroundColor: `${standaloneColor}15` }}
                              >
                                <Icon className="w-7 h-7" style={{ color: standaloneColor }} />
                              </div>
                              <div
                                className="w-10 h-10 flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: standaloneColor }}
                              >
                                {faculty.code || faculty.name.charAt(0)}
                              </div>
                            </div>
                            <h3 className="text-title text-gray-900 mb-2">{faculty.name}</h3>
                            <p className="text-body text-gray-600 mb-4 line-clamp-2">
                              {faculty.description || 'Standalone faculty offering specialized programs.'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-small text-gray-500">
                                {faculty.department_count || 0} Departments
                              </span>
                              <Link
                                to={`/academics/faculties/${faculty.slug}`}
                                className="inline-flex items-center gap-2 text-ink-900 font-medium hover:gap-3 transition-all"
                              >
                                Explore
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: groupedByCollege.length.toString(), label: 'Colleges & Schools', icon: Building2 },
              { value: totalFaculties.toString(), label: 'Faculties', icon: GraduationCap },
              { value: '390', label: 'Faculty Members', icon: Users },
              { value: '24', label: 'Degree Programs', icon: BookOpen },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-stat text-ink-900 mb-1">{stat.value}</div>
                <p className="text-gray-600 text-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};