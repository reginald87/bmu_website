import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Building2, 
  Users, 
  ArrowRight,
  Award,
  Microscope,
  Stethoscope,
  FlaskConical,
  HeartPulse,
  Activity,
  type LucideIcon
} from 'lucide-react';
import { usePageSections } from '../../services/apiHooks';

interface AcademicUnit {
  name: string;
  programs: string;
  icon: LucideIcon;
  color: string;
  link: string;
  standalone?: boolean;
}

interface QuickLink {
  title: string;
  desc: string;
  icon: LucideIcon;
  link: string;
}

interface Stat {
  value: string;
  label: string;
}

const fallbackUnits = [
 {
 name: 'College of Medicine',
 programs: 'MBBS, B.Sc Anatomy, B.Sc Physiology, B.Sc Biochemistry',
 icon: GraduationCap,
 color: '#1E1E1E',
 link: '/colleges/college-of-medicine'
 },
 {
 name: 'Faculty of Basic Medical Sciences',
 programs: 'B.Sc Anatomy, B.Sc Physiology, B.Sc Biochemistry',
 icon: Microscope,
 color: '#1E1E1E',
 link: '/academics/faculties/faculty-of-basic-medical-sciences'
 },
{
  name: 'Faculty of Basic Clinical Sciences',
  programs: 'Anatomical Pathology',
  icon: Activity,
  color: '#1E1E1E',
  link: '/academics/faculties/faculty-of-basic-clinical-sciences',
  standalone: true
  },
  {
  name: 'Faculty of Clinical Sciences',
  programs: 'MBBS Medicine & Surgery',
  icon: Stethoscope,
  color: '#1E1E1E',
  link: '/academics/faculties/faculty-of-clinical-sciences'
  },
  {
  name: 'Faculty of Dentistry',
  programs: 'BDS Dental Surgery',
  icon: Stethoscope,
  color: '#1E1E1E',
  link: '/academics/faculties/faculty-of-dentistry',
  standalone: true
  },
  {
  name: 'Faculty of Health Sciences',
  programs: 'B.NSc Nursing, BMLS, Radiography, Physiotherapy, Optometry, Public Health',
  icon: HeartPulse,
  color: '#A51C30',
  link: '/academics/faculties/faculty-of-health-sciences',
  standalone: true
  },
  {
  name: 'Faculty of Pharmaceutical Sciences',
  programs: 'Pharm.D Pharmacy',
  icon: Award,
  color: '#1E1E1E',
  link: '/academics/faculties/faculty-of-pharmaceutical-sciences',
  standalone: true
  },
  {
  name: 'Faculty of Science',
  programs: 'B.Sc Biology, Chemistry, Microbiology, Physics, Mathematics, Statistics, Computer Science',
  icon: FlaskConical,
  color: '#1E1E1E',
  link: '/academics/faculties/faculty-of-science',
  standalone: true
  }
];

const fallbackQuickLinks = [
 { title: 'Academic Programs', desc: 'Browse all degree programs', icon: GraduationCap, link: '/academics/programs' },
 { title: 'Faculties & Schools', desc: 'Explore our academic units', icon: Building2, link: '/academics/faculties' },
 { title: 'Academic Calendar', desc: 'View important dates', icon: Calendar, link: '/academics/calendar' },
 { title: 'University Library', desc: 'Access resources & databases', icon: BookOpen, link: '/academics/library' },
 { title: 'Admissions', desc: 'How to apply', icon: Users, link: '/academics/admissions' },
 { title: 'Research', desc: 'Research opportunities', icon: Award, link: '/research' }
];

const fallbackStats = [
 { value: '24', label: 'Degree Programs' },
 { value: '7', label: 'Faculties' },
 { value: '25', label: 'Departments' },
 { value: '3,900', label: 'Students' }
];

export const Academics = () => {
 const { data: sections } = usePageSections('academics');
  const academicUnits = (sections?.find(s => s.section_key === 'academic_units')?.data as AcademicUnit[] || fallbackUnits);
  const collegeUnits = academicUnits.filter(u => !u.standalone);
  const standaloneUnits = academicUnits.filter(u => u.standalone);
  const quickLinks = (sections?.find(s => s.section_key === 'quick_links')?.data as QuickLink[] || fallbackQuickLinks);
  const stats = (sections?.find(s => s.section_key === 'stats')?.data as Stat[] || fallbackStats);

  const renderUnitCard = (unit: AcademicUnit, index: number) => (
    <motion.div
      key={unit.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={unit.link}
        className="block bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${unit.color}15` }}
          >
            <unit.icon className="w-7 h-7" style={{ color: unit.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-title text-gray-900 mb-1">{unit.name}</h3>
            <p className="text-body text-gray-600">{unit.programs}</p>
            <div className="mt-3 flex items-center gap-1 text-sm font-medium" style={{ color: unit.color }}>
              Learn More <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

 return (
 <>
 <Helmet>
 <title>Academics | Bayelsa Medical University</title>
 <meta name="description" content="Explore academic programs at Bayelsa Medical University. Undergraduate and postgraduate degrees in medicine, nursing, pharmacy, allied health sciences, and public health." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white font-medium">Academics</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Academic <span className="text-[#A51C30]">Excellence</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 World-class healthcare education combining rigorous academic training with 
 hands-on clinical experience. Discover programs that prepare you for a 
 rewarding career in medicine and health sciences.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {stats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

{/* Academic Units */}
  <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="container-custom">
  <div className="text-center mb-12">
  <h2 className="text-headline text-gray-900 mb-4">Academic Units</h2>
  <p className="text-lead text-gray-600 max-w-2xl mx-auto">
  The College of Medicine houses the Faculty of Basic Medical Sciences and the Faculty of Clinical Sciences, while the University's other faculties operate as standalone units with their own departments.
  </p>
  </div>

  {collegeUnits.length > 0 && (
  <>
  <h3 className="text-title text-gray-900 mb-6">Within the College of Medicine</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
  {collegeUnits.map((unit, index) => renderUnitCard(unit, index))}
  </div>
  </>
  )}

  {standaloneUnits.length > 0 && (
  <>
  <h3 className="text-title text-gray-900 mb-6">Standalone Faculties</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {standaloneUnits.map((unit, index) => renderUnitCard(unit, index))}
  </div>
  </>
  )}
  </div>
  </section>

 {/* Quick Links */}
 <section className="py-20">
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-gray-900 mb-4">Academic Resources</h2>
 <p className="text-lead text-gray-600 max-w-2xl mx-auto">
 Quick access to essential academic information and services
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {quickLinks.map((link, index) => (
 <motion.div
 key={link.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 >
 <Link 
 to={link.link}
 className="block h-full bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <link.icon className="w-8 h-8 text-[#A51C30] mb-4" />
 <h3 className="text-title text-gray-900 mb-1">{link.title}</h3>
 <p className="text-body text-gray-600">{link.desc}</p>
 </Link>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">
 Start Your <span className="text-[#A51C30]">Journey</span>
 </h2>
 <p className="text-lead text-white/80 mb-6">
 Join thousands of students pursuing excellence in healthcare education. 
 Explore our programs and apply to become part of the BMU community.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/academics/programs"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Explore Programs
 </Link>
 <Link 
 to="/apply"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
 >
 Apply Now
 </Link>
 </div>
 </div>

 <div className="bg-white/10 backdrop-blur-sm p-8">
 <h3 className="text-title text-white mb-6">Why Study at BMU?</h3>
 <div className="space-y-4">
 {[
 'Modern teaching hospitals and laboratories',
 'Experienced faculty with clinical expertise',
 'Strong industry partnerships',
 'Research opportunities from year one',
 'Student support and mentorship programs'
 ].map((item, index) => (
 <div key={index} className="flex items-start gap-3">
 <Award className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
 <p className="text-white/80">{item}</p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

