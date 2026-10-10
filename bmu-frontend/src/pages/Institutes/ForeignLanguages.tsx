import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageSections } from '../../services/apiHooks';

const fallbackLanguages = [
 { lang: 'French', level: 'Beginner to Advanced', desc: 'Essential for West African medical practice' },
 { lang: 'Spanish', level: 'Beginner to Advanced', desc: 'Global medical communication' },
 { lang: 'German', level: 'Beginner to Advanced', desc: 'For medical studies in Germany' },
 { lang: 'English for Medical Purposes', level: 'Professional', desc: 'Academic writing & communication' },
];

export const ForeignLanguages = () => {
 const { data: sections } = usePageSections('institutes/languages');
 const languages = (sections?.find(s => s.section_key === 'language_programs')?.data as typeof fallbackLanguages) || fallbackLanguages;
 return (
 <>
 <Helmet>
 <title>Institute of Foreign Languages | Bayelsa Medical University</title>
 <meta name="description" content="Institute of Foreign Languages at Bayelsa Medical University - Learn French, Spanish, German and more" />
 </Helmet>

  <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
    <div className="container-custom relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <span className="text-white font-medium">Institute of Foreign Languages</span>
        </div>

        <h1 className="text-display text-white mb-6">
          Institute of <span className="text-primary-600">Foreign Languages</span>
        </h1>
        <p className="text-lead text-white/80 max-w-2xl">
          Opening Global Opportunities Through Language Proficiency
        </p>
      </motion.div>
    </div>
  </section>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>About the Institute</h2>
 <p className="text-gray-600 mb-4">
 The Institute of Foreign Languages at Bayelsa Medical University equips students and professionals 
 with language skills essential for international collaboration, medical tourism, and global healthcare practice.
 </p>
 <p className="text-gray-600">
 Whether you are preparing for international medical examinations, planning to study abroad, 
 or seeking to enhance your professional communication, our programs cater to all proficiency levels.
 </p>
 </section>

 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Programs Offered</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {languages.map((prog) => (
 <div key={prog.lang} className="p-4 border ">
 <h3 className="font-bold text-lg" style={{ color: 'var(--color-ink-900)' }}>{prog.lang}</h3>
 <p className="text-sm text-gray-500">{prog.level}</p>
 <p className="text-gray-600 text-sm mt-2">{prog.desc}</p>
 </div>
 ))}
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Contact Us</h3>
 <p className="text-gray-600 mb-2">Email: ifl@bmu.edu.ng</p>
 <p className="text-gray-600 mb-2">Phone: +234 xxx xxx xxxx</p>
 <p className="text-gray-600">Location: Yenagoa Campus</p>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: 'var(--color-ink-900)' }}>Quick Facts</h3>
 <ul className="space-y-2 text-gray-600">
 <li>8 Language Programs</li>
 <li>Native Speaking Instructors</li>
 <li>Online & In-Person Classes</li>
 <li>Certificate Programs</li>
 </ul>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
