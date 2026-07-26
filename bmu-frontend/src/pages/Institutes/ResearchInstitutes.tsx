import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInstitutePages } from '../../services/apiHooks';

const fallbackInstitutes = [
  {
    id: 1,
    name: 'Institute of Tropical Medicine',
    focus: 'Malaria, Neglected Tropical Diseases',
    director: 'Prof. John Okonkwo',
    projects_count: 12,
  },
  {
    id: 2,
    name: 'Institute of Maternal & Child Health',
    focus: 'Maternal mortality, Child nutrition',
    director: 'Dr. Adaeze Nwosu',
    projects_count: 8,
  },
  {
    id: 3,
    name: 'Institute of Public Health & Epidemiology',
    focus: 'Disease surveillance, Health policy',
    director: 'Prof. Grace Ebi',
    projects_count: 15,
  },
  {
    id: 4,
    name: 'Institute of Biomedical Research',
    focus: 'Genomics, Drug discovery',
    director: 'Prof. Michael Ibrahim',
    projects_count: 10,
  },
];

export const ResearchInstitutes = () => {
  const { data: apiInstitutes } = useInstitutePages();
  const institutes = (apiInstitutes && apiInstitutes.length > 0 ? apiInstitutes : fallbackInstitutes);

  return (
 <>
 <Helmet>
 <title>Research Institutes | BMU</title>
 <meta name="description" content="Research Institutes at Bayelsa Medical University - Advancing healthcare through research" />
 </Helmet>

 <section className="pt-[140px] pb-12 bg-[#1E1E1E]">
 <div className="container-custom">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative z-10"
 >
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <span className="text-white">Research Institutes</span>
 </div>

 <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
 Research Institutes
 </h1>
 <p className="text-xl text-white/80">
 Driving Innovation in Healthcare Research
 </p>
 </motion.div>
 </div>
 </section>

 <div className="container-custom py-12">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-8">
 <section className="card p-6">
 <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Overview</h2>
 <p className="text-gray-600 mb-4">
 Our Research Institutes are dedicated to solving critical health challenges facing 
 Nigeria and the African continent. From tropical diseases to maternal health, 
 our interdisciplinary teams work to translate research into impactful healthcare solutions.
 </p>
 </section>

 <section>
 <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Our Institutes</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {institutes.map((institute) => (
      <div key={institute.id} className="card p-6">
        <h3 className="font-bold text-lg mb-2" style={{ color: '#1E1E1E' }}>
          {institute.name}
        </h3>
        <p className="text-sm text-[#00a651] mb-2">{institute.focus}</p>
        <p className="text-gray-600 text-sm mb-2">Director: {institute.director}</p>
        <p className="text-gray-500 text-sm">{institute.projects_count} Active Projects</p>
 <Link 
 to={`/institutes/research/${institute.id}`}
 className="inline-block mt-4 text-sm font-semibold text-[#00a651] hover:underline"
 >
 Learn More →
 </Link>
 </div>
 ))}
 </div>
 </section>
 </div>

 <div className="space-y-6">
 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Research Impact</h3>
 <ul className="space-y-3 text-gray-600">
 <li className="flex justify-between"><span>Active Projects</span><span className="font-bold">45+</span></li>
 <li className="flex justify-between"><span>Publications (2024)</span><span className="font-bold">127</span></li>
 <li className="flex justify-between"><span>Research Grants</span><span className="font-bold">₦2.1B</span></li>
 <li className="flex justify-between"><span>PhD Researchers</span><span className="font-bold">89</span></li>
 </ul>
 </div>

 <div className="card p-6">
 <h3 className="font-bold mb-4" style={{ color: '#1E1E1E' }}>Funding Partners</h3>
 <div className="space-y-2 text-sm text-gray-600">
 <p>WHO</p>
 <p>NIH/NIAID</p>
 <p>Bill & Melinda Gates Foundation</p>
 <p>European Union</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </>
 );
};
