import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  ChevronRight,
  School,
  Loader2,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useColleges } from '../../services/apiHooks';

interface College {
  id: number;
  slug: string;
  name: string;
  fullName?: string;
  description: string;
  color: string;
  faculty_count: number;
  department_count: number;
  faculty_members_count: number;
  provost_name?: string;
  provost_photo?: string | null;
}

const fallbackColleges: College[] = [
  {
    id: 1, slug: 'college-of-medicine', name: 'College of Medicine',
    fullName: 'Faculty of Basic Medical Sciences & Faculty of Clinical Sciences',
    description: 'The College of Medicine is the flagship college of Bayelsa Medical University, housing the Faculty of Basic Medical Sciences and the Faculty of Clinical Sciences. The University\'s other faculties — Basic Clinical Sciences, Dentistry, Health Sciences, Pharmaceutical Sciences and Science — operate as standalone faculties with their own departments.',
    color: 'var(--color-ink-900)', faculty_count: 2, department_count: 4, faculty_members_count: 108, provost_name: 'Prof. Philip Eyimina'
  }
];

interface ApiCollege {
  id: number;
  slug: string;
  name: string;
  fullName?: string;
  description: string;
  color?: string;
  primary_color?: string;
  primaryColor?: string;
  faculty_count?: number;
  facultyCount?: number;
  department_count?: number;
  departmentCount?: number;
  faculty_members_count?: number;
  facultyMembersCount?: number;
  provost_name?: string;
  deanName?: string;
  leadership_name?: string;
  provost_photo?: string | null;
}

function transformCollege(src: ApiCollege): College {
  return {
    id: src.id,
    slug: src.slug,
    name: src.name,
    fullName: src.fullName,
    description: src.description,
    color: src.color || src.primary_color || src.primaryColor || 'var(--color-ink-900)',
    faculty_count: src.faculty_count ?? src.facultyCount ?? src.faculty_count ?? 0,
    department_count: src.department_count ?? src.departmentCount ?? 0,
    faculty_members_count: src.faculty_members_count ?? src.facultyMembersCount ?? 0,
    provost_name: src.provost_name ?? src.deanName ?? src.leadership_name ?? undefined,
    provost_photo: src.provost_photo ?? null,
  };
}

export const Colleges = () => {
  const { data: apiColleges, isLoading, error } = useColleges();

  const colleges: College[] = (() => {
    if (apiColleges && Array.isArray(apiColleges) && apiColleges.length > 0) {
      return apiColleges.map(transformCollege);
    }
    return fallbackColleges;
  })();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-ink-900 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'An error occurred'}</p>
          <Link to="/academics" className="text-ink-900 font-medium hover:underline">
            Back to Academics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Colleges & Schools | Bayelsa Medical University</title>
        <meta name="description" content="Explore BMU's academic colleges and schools." />
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
              <span className="text-white font-medium">Colleges</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Our <span className="text-primary-600">Colleges</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {colleges.length > 0 
                ? `Discover our ${colleges.length} academic colleges offering comprehensive healthcare education.`
                : 'Academic colleges and schools offering comprehensive healthcare education.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-b bg-white" style={{ borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: colleges.length.toString(), label: 'Colleges', icon: Building2 },
              { value: colleges.reduce((acc, c) => acc + (c.faculty_count || 0), 0).toString(), label: 'Faculties', icon: GraduationCap },
              { value: colleges.reduce((acc, c) => acc + (c.department_count || 0), 0).toString(), label: 'Departments', icon: BookOpen },
              { value: colleges.reduce((acc, c) => acc + (c.faculty_members_count || 0), 0).toString() + '+', label: 'Faculty Members', icon: Users }
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

      <section className="py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Our Colleges & Schools</h2>
            <p className="text-lead text-gray-600 max-w-2xl mx-auto">
              Specialized academic units dedicated to excellence in healthcare education
            </p>
          </div>

          {colleges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No colleges available yet.</p>
              <p className="text-sm text-gray-500">
                Colleges will appear here once they are created in the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {colleges.map((college, index) => (
                <motion.div
                  key={college.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={`/colleges/${college.slug}`}
                    className="block bg-white shadow-sm border border-gray-100 overflow-hidden transition-shadow"
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div 
                          className="w-16 h-16 flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${college.color || 'var(--color-ink-900)'}15` }}
                        >
                          <School className="w-8 h-8" style={{ color: college.color || 'var(--color-ink-900)' }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-title text-gray-900">{college.name}</h3>
                          {college.fullName && (
                            <p className="text-small text-gray-500">{college.fullName}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-body text-gray-600 mb-6">
                        {college.description || 'Explore our academic programs and research opportunities.'}
                      </p>

                      <div className="mb-6">
                        <h4 className="text-small font-semibold text-gray-900 mb-2">Academic Units</h4>
                        <div className="flex flex-wrap gap-2">
                          <span 
                            className="px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: `${college.color || 'var(--color-ink-900)'}15`, color: college.color || 'var(--color-ink-900)' }}
                          >
                            {college.faculty_count || 0} Faculties
                          </span>
                          <span 
                            className="px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: `${college.color || 'var(--color-ink-900)'}15`, color: college.color || 'var(--color-ink-900)' }}
                          >
                            {college.department_count || 0} Departments
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        {college.provost_name && (
                          <div className="flex items-center gap-3">
                            {college.provost_photo ? (
                              <img loading="lazy" decoding="async" src={college.provost_photo} alt={college.provost_name} className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                                <Users className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-semibold text-ink-900">Provost</div>
                              <p className="text-xs text-gray-500">{college.provost_name}</p>
                            </div>
                          </div>
                        )}
                        <span 
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:gap-2 ml-auto"
                          style={{ color: college.color || 'var(--color-ink-900)' }}
                        >
                          Learn More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="container-custom text-center">
          <h2 className="text-headline text-white mb-4">Choose Your Path</h2>
          <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
            Explore our programs and find the right fit for your healthcare career aspirations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/academics/programs"
              className="px-8 py-4 bg-primary-600 text-ink-900 font-bold hover:bg-white transition"
            >
              View All Programs
            </Link>
            <Link 
              to="/apply"
              className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-ink-900 transition"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
