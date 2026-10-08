import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
 Microscope, 
 ArrowLeft, 
 Award,
 ExternalLink,
 Target,
 TrendingUp,
 DollarSign,
 Clock,
 MapPin,
 CheckCircle
} from 'lucide-react';
import { useState } from 'react';

interface ResearchProject {
 id: string;
 title: string;
 description: string;
 category: string;
 status: 'ongoing' | 'completed' | 'proposed';
 startDate: string;
 endDate?: string;
 principalInvestigator: string;
 coInvestigators: string[];
 funding: string;
 budget: string;
 objectives: string[];
 outcomes: string[];
 publications: number;
 collaborators: string[];
 location: string;
}

const projects: ResearchProject[] = [
 {
 id: 'malaria-resistance-2024',
 title: 'Molecular Surveillance of Antimalarial Drug Resistance',
 description: 'Comprehensive study tracking drug-resistant malaria parasites in the Niger Delta through molecular surveillance and genomic analysis.',
 category: 'Malaria Research',
 status: 'ongoing',
 startDate: '2022-01-15',
 endDate: '2025-12-31',
 principalInvestigator: 'Prof. Ekanem Ekanem',
 coInvestigators: ['Dr. James Okonkwo', 'Dr. Chioma Amadi'],
 funding: 'Bill & Melinda Gates Foundation / NIH',
 budget: '$2.4 million',
 objectives: [
 'Establish molecular surveillance network',
 'Characterize genetic resistance markers',
 'Assess current treatment efficacy',
 'Inform national policy updates'
 ],
 outcomes: [
 '12 peer-reviewed publications',
 'Novel kelch13 mutations identified',
 'National guidelines revised',
 '45 technicians trained'
 ],
 publications: 12,
 collaborators: ['University of Oxford', 'WHO Nigeria', 'London School of Hygiene'],
 location: 'BMU Research Center, Yenagoa'
 },
 {
 id: 'ncd-prevention-2023',
 title: 'Community-Based NCD Prevention in Rural Bayelsa',
 description: 'Implementing hypertension and diabetes prevention interventions in underserved communities.',
 category: 'Non-Communicable Diseases',
 status: 'ongoing',
 startDate: '2023-03-01',
 endDate: '2026-02-28',
 principalInvestigator: 'Prof. Mercy Ogu',
 coInvestigators: ['Dr. Grace Ebi', 'Dr. Helen Douglas'],
 funding: 'NDDC / WHO',
 budget: '₦180 million',
 objectives: [
 'Determine NCD prevalence',
 'Develop screening tools',
 'Train community health workers',
 'Evaluate intervention effectiveness'
 ],
 outcomes: [
 '8 publications submitted',
 'Community screening model developed',
 'Primary care capacity built'
 ],
 publications: 8,
 collaborators: ['University of Ibadan', 'State Ministry of Health'],
 location: '15 rural communities, Bayelsa State'
 },
 {
 id: 'maternal-health-2022',
 title: 'Maternal Health Outcomes Improvement Program',
 description: 'Reducing maternal mortality through enhanced antenatal care and skilled birth attendance.',
 category: 'Maternal Health',
 status: 'completed',
 startDate: '2020-06-01',
 endDate: '2023-05-31',
 principalInvestigator: 'Prof. Chioma Amadi',
 coInvestigators: ['Dr. Helen Douglas', 'Dr. Peter Iruo'],
 funding: 'UNICEF / UNFPA',
 budget: '₦120 million',
 objectives: [
 'Increase ANC attendance',
 'Promote skilled birth attendance',
 'Reduce maternal complications',
 'Improve postnatal care'
 ],
 outcomes: [
 '34% increase in ANC attendance',
 'Maternal mortality reduced by 28%',
 '15 publications',
 'National policy impact'
 ],
 publications: 15,
 collaborators: ['UNICEF Nigeria', 'Federal Ministry of Health'],
 location: 'State-wide, Bayelsa'
 }
];

export const ResearchDetail = () => {
 const { id } = useParams<{ id: string }>();
 const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'outcomes'>('overview');
 
 const project = projects.find(p => p.id === id);

 if (!project) {
 return <Navigate to="/research" replace />;
 }

 const statusColors = {
 ongoing: 'bg-green-100 text-green-700',
 completed: 'bg-blue-100 text-blue-700',
 proposed: 'bg-yellow-100 text-yellow-700'
 };

 return (
 <>
 <Helmet>
 <title>{project.title} | Bayelsa Medical University</title>
 <meta name="description" content={project.description} />
 </Helmet>

 {/* Hero */}
 <section className="pt-[180px] pb-12" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div className="container-custom">
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <Link to="/research" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
 <ArrowLeft className="w-4 h-4" />
 Back to Research
 </Link>

 <div className="flex flex-wrap items-center gap-3 mb-4">
 <span className="px-3 py-1 bg-primary-600 text-ink-900 text-sm font-semibold">
 {project.category}
 </span>
 <span className={`px-3 py-1 text-sm font-medium capitalize ${statusColors[project.status]}`}>
 {project.status}
 </span>
 </div>

 <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
 {project.title}
 </h1>
 <p className="text-xl text-white/80 max-w-3xl">{project.description}</p>
 </motion.div>
 </div>
 </section>

 {/* Stats Bar */}
 <div className="bg-primary-600 py-4">
 <div className="container-custom">
 <div className="flex flex-wrap gap-8">
 <div className="flex items-center gap-2">
 <Clock className="w-5 h-5 text-ink-900" />
 <span className="font-semibold text-ink-900">{project.startDate}</span>
 <span className="text-ink-900/70">to {project.endDate || 'Ongoing'}</span>
 </div>
 <div className="flex items-center gap-2">
 <DollarSign className="w-5 h-5 text-ink-900" />
 <span className="font-semibold text-ink-900">{project.budget}</span>
 </div>
 <div className="flex items-center gap-2">
 <Award className="w-5 h-5 text-ink-900" />
 <span className="font-semibold text-ink-900">{project.publications}</span>
 <span className="text-ink-900/70">Publications</span>
 </div>
 <div className="flex items-center gap-2">
 <MapPin className="w-5 h-5 text-ink-900" />
 <span className="text-ink-900">{project.location}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Content */}
 <section className="py-12 bg-gray-50">
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Main */}
 <div className="lg:col-span-2">
 <motion.div className="bg-white p-8 shadow-sm">
 {/* Tabs */}
 <div className="flex border-b mb-6">
 {(['overview', 'objectives', 'outcomes'] as const).map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-6 py-3 font-medium capitalize transition ${
 activeTab === tab 
 ? 'text-ink-900 border-b-2 border-ink-900' 
 : 'text-gray-600 hover:text-gray-900'
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* Tab Content */}
 {activeTab === 'overview' && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
 <Microscope className="w-5 h-5 text-ink-900" />
 Project Overview
 </h3>
 <p className="text-gray-700 leading-relaxed">{project.description}</p>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-gray-50 ">
 <h4 className="font-semibold text-gray-900 mb-2">Principal Investigator</h4>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-ink-900 flex items-center justify-center text-white text-sm font-medium">
 {project.principalInvestigator.split(' ').map(n => n[0]).join('')}
 </div>
 <Link to={`/research/faculty/${project.principalInvestigator.toLowerCase().replace(/[^a-z]/g, '-')}`} className="text-ink-900 font-medium hover:underline">
 {project.principalInvestigator}
 </Link>
 </div>
 </div>
 <div className="p-4 bg-gray-50 ">
 <h4 className="font-semibold text-gray-900 mb-2">Funding Source</h4>
 <p className="text-gray-700">{project.funding}</p>
 </div>
 </div>

 <div>
 <h4 className="font-semibold text-gray-900 mb-3">Research Team</h4>
 <div className="flex flex-wrap gap-2">
 {project.coInvestigators.map(inv => (
 <Link
 key={inv}
 to={`/research/faculty/${inv.toLowerCase().replace(/[^a-z]/g, '-')}`}
 className="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
 >
 {inv}
 </Link>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'objectives' && (
 <div>
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
 <Target className="w-5 h-5 text-ink-900" />
 Research Objectives
 </h3>
 <ul className="space-y-3">
 {project.objectives.map((obj, i) => (
 <li key={i} className="flex items-start gap-3">
 <CheckCircle className="w-5 h-5 text-ink-900 mt-0.5 flex-shrink-0" />
 <span className="text-gray-700">{obj}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {activeTab === 'outcomes' && (
 <div>
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
 <TrendingUp className="w-5 h-5 text-ink-900" />
 Key Outcomes
 </h3>
 <ul className="space-y-3">
 {project.outcomes.map((out, i) => (
 <li key={i} className="flex items-start gap-3">
 <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
 <span className="text-gray-700">{out}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 </motion.div>
 </div>

 {/* Sidebar */}
 <div className="space-y-6">
 <motion.div className="bg-white p-6 shadow-sm">
 <h3 className="text-lg font-bold text-gray-900 mb-4">Collaborators</h3>
 <div className="space-y-3">
 {project.collaborators.map(org => (
 <div key={org} className="flex items-center gap-3">
 <ExternalLink className="w-4 h-4 text-gray-400" />
 <span className="text-gray-700">{org}</span>
 </div>
 ))}
 </div>
 </motion.div>

 <motion.div className="bg-ink-900 p-6 text-white">
 <h3 className="text-lg font-bold mb-4">Interested in Collaboration?</h3>
 <p className="text-white/80 text-sm mb-4">Contact our research office to explore partnership opportunities.</p>
 <a
 href="mailto:research@bmu.edu.ng"
 className="block w-full py-3 bg-white/20 text-center font-medium hover:bg-white/30 transition"
 >
 Contact Research Office
 </a>
 </motion.div>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

export default ResearchDetail;
