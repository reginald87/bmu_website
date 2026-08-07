import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Award, 
  Target, 
  Clock, 
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useResearchGrants, usePageSections } from '../../services/apiHooks';
import type { GrantData } from '../../services/mockData';
import { GrantApplicationModal } from '../../components/research/GrantApplicationModal';

const statusMap: Record<string, 'open' | 'closing' | 'upcoming'> = {
  active: 'open',
  pending: 'upcoming',
};

function formatDeadline(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const ResearchFunding = () => {
  const { data: grants = [] } = useResearchGrants();
  const { data: sections } = usePageSections('research/funding');
  const [activeTab, setActiveTab] = useState<'opportunities' | 'past'>('opportunities');
  const [selectedGrant, setSelectedGrant] = useState<GrantData | null>(null);

  const fundingOpportunities = useMemo(
    () => grants.filter(g => g.status === 'active' || g.status === 'pending'),
    [grants]
  );

  const pastGrants = useMemo(
    () => grants.filter(g => g.status === 'completed'),
    [grants]
  );

  const fallbackApplicationSteps = [
    { step: 1, title: 'Review Guidelines', desc: 'Read the funding call and eligibility criteria carefully' },
    { step: 2, title: 'Prepare Proposal', desc: 'Develop your research proposal following the provided template' },
    { step: 3, title: 'Submit Application', desc: 'Submit through the online portal before the deadline' },
    { step: 4, title: 'Review Process', desc: 'Applications reviewed by expert panels, results within 6 weeks' }
  ];

  const applicationSteps = (sections?.find(s => s.section_key === 'application_steps')?.data as any[] || fallbackApplicationSteps);

  const stats = useMemo(() => {
    const activeGrants = grants.filter(g => g.status === 'active').length;
    const uniqueAgencies = new Set(grants.map(g => g.funding_agency)).size;
    const researchers = new Set(grants.map(g => g.principal_investigator).filter(Boolean)).size;
    return [
      { value: `${grants.length}+`, label: 'Active Grants', icon: DollarSign },
      { value: `${activeGrants}`, label: 'Active Projects', icon: Briefcase },
      { value: `${uniqueAgencies}`, label: 'Funding Partners', icon: Users },
      { value: `${researchers}+`, label: 'Researchers Funded', icon: Award },
    ];
  }, [grants]);

 return (
 <>
 <Helmet>
 <title>Research Funding | Bayelsa Medical University</title>
 <meta name="description" content="Explore research funding opportunities, grants, and partnerships at BMU. Apply for internal and external research funding to advance medical knowledge." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <Link to="/research" className="hover:text-white transition">Research</Link>
 <span>/</span>
 <span className="text-white font-medium">Research Funding</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Research <span className="text-[#A51C30]">Funding</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Access funding opportunities to support your research. BMU offers grants, 
 facilitates external funding, and supports researchers in securing resources.
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
 <stat.icon className="w-8 h-8 text-[#A51C30] mx-auto mb-2" />
 <div className="text-stat text-[#1E1E1E] mb-1">{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Main Content */}
 <section className="py-20" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 {/* Tabs */}
 <div className="flex gap-4 mb-8">
 <button
 onClick={() => setActiveTab('opportunities')}
 className={`px-6 py-3 font-medium transition ${
 activeTab === 'opportunities'
 ? 'bg-[#1E1E1E] text-white'
 : 'bg-white text-gray-600 hover:bg-gray-100'
 }`}
 >
 Funding Opportunities
 </button>
 <button
 onClick={() => setActiveTab('past')}
 className={`px-6 py-3 font-medium transition ${
 activeTab === 'past'
 ? 'bg-[#1E1E1E] text-white'
 : 'bg-white text-gray-600 hover:bg-gray-100'
 }`}
 >
 Awarded Grants
 </button>
 </div>

 {activeTab === 'opportunities' && (
 <div className="space-y-6">
  {fundingOpportunities.map((opp, index) => (
  <motion.div
  key={opp.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 transition-shadow"
 >
 <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
  <span className={`px-3 py-1 text-xs font-medium ${
  statusMap[opp.status] === 'open' ? 'bg-green-100 text-green-700' :
  statusMap[opp.status] === 'upcoming' ? 'bg-blue-100 text-blue-700' :
  'bg-gray-100 text-gray-600'
  }`}>
  {statusMap[opp.status] === 'open' ? 'Open' : statusMap[opp.status] === 'upcoming' ? 'Upcoming' : opp.status}
  </span>
 <span className="px-3 py-1 bg-[#A51C30]/10 text-[#A51C30] text-xs font-medium">
 {opp.category}
 </span>
 </div>
 <h3 className="text-title text-gray-900 mb-2">{opp.title}</h3>
 <p className="text-body text-gray-600">{opp.description}</p>
 </div>
 <div className="lg:text-right">
 <p className="text-stat-sm text-[#1E1E1E]">{opp.amount}</p>
 <p className="text-small text-gray-500">Award Range</p>
 </div>
 </div>

 <div className="flex flex-wrap gap-2 mb-4">
 {opp.eligibility.map((item, idx) => (
 <span key={idx} className="flex items-center gap-1 text-small text-gray-600">
 <CheckCircle className="w-3 h-3 text-[#A51C30]" />
 {item}
 </span>
 ))}
 </div>

 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
 <div className="flex items-center gap-2 text-gray-600">
 <Clock className="w-4 h-4" />
  <span className="text-small">Deadline: {formatDeadline(opp.deadline)}</span>
 </div>
  <button
  onClick={() => setSelectedGrant(opp)}
  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-medium hover:bg-[#1E1E1E]/90 transition"
  >
  Apply Now
  <ArrowRight className="w-4 h-4" />
  </button>
 </div>
 </motion.div>
 ))}
 </div>
 )}

 {activeTab === 'past' && (
 <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project Title</th>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Principal Investigator</th>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Funder</th>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Year</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
   {pastGrants.map((grant) => (
  <tr key={grant.id} className="hover:bg-gray-50">
  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{grant.title}</td>
  <td className="px-6 py-4 text-sm text-gray-600">{grant.principal_investigator || '-'}</td>
  <td className="px-6 py-4 text-sm text-gray-600">{grant.funding_agency}</td>
  <td className="px-6 py-4 text-sm text-[#1E1E1E] font-semibold">{grant.amount}</td>
  <td className="px-6 py-4 text-sm text-gray-600">{grant.year}</td>
  </tr>
  ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>
 </section>

 {/* How to Apply */}
 <section className="py-16" style={{ backgroundColor: '#A51C30' }}>
 <div className="container-custom">
 <div className="text-center mb-12">
 <h2 className="text-headline text-white mb-4">How to Apply</h2>
 <p className="text-lead text-white/90 max-w-2xl mx-auto">
 Follow these steps to apply for research funding at BMU
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {applicationSteps.map((item, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white/10 backdrop-blur-sm p-6 text-center"
 >
 <div className="w-12 h-12 bg-[#A51C30] flex items-center justify-center mx-auto mb-4">
 <span className="text-[#1E1E1E] font-bold text-lg">{item.step}</span>
 </div>
 <h3 className="text-title text-white mb-2">{item.title}</h3>
 <p className="text-body text-white/80">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Support */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-gray-900 mb-4">
 Research <span className="text-[#A51C30]">Support</span>
 </h2>
 <p className="text-lead text-gray-600 mb-6">
 Our Research Office provides comprehensive support for grant applications, 
 including proposal development, budget preparation, and compliance guidance.
 </p>
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <FileText className="w-6 h-6 text-[#1E1E1E] flex-shrink-0" />
 <div>
 <h4 className="font-semibold text-gray-900">Grant Writing Workshops</h4>
 <p className="text-body text-gray-600">Regular workshops on proposal writing and funding applications</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <TrendingUp className="w-6 h-6 text-[#1E1E1E] flex-shrink-0" />
 <div>
 <h4 className="font-semibold text-gray-900">Funding Database Access</h4>
 <p className="text-body text-gray-600">Access to international funding opportunities and grant databases</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <Users className="w-6 h-6 text-[#1E1E1E] flex-shrink-0" />
 <div>
 <h4 className="font-semibold text-gray-900">Collaboration Matching</h4>
 <p className="text-body text-gray-600">Connect with potential collaborators for multi-disciplinary projects</p>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-[#1E1E1E] p-8">
 <h3 className="text-title text-white mb-6">Contact Research Office</h3>
 <div className="space-y-4 text-white/80">
 <p className="flex items-center gap-2">
 <Target className="w-5 h-5 text-[#A51C30]" />
 research@bmu.edu.ng
 </p>
 <p className="flex items-center gap-2">
 <Clock className="w-5 h-5 text-[#A51C30]" />
 Mon-Fri: 8:00 AM - 4:00 PM
 </p>
 </div>
 <div className="mt-6 pt-6 border-t border-white/20">
 <p className="text-white/60 text-sm mb-4">Download application guidelines and templates</p>
 <Link 
 to="#"
 className="inline-flex items-center gap-2 px-6 py-3 bg-[#A51C30] text-[#1E1E1E] font-semibold hover:bg-white transition"
 >
 <FileText className="w-5 h-5" />
 Download Templates
 </Link>
 </div>
 </div>
 </div>
 </div>
  </section>

  {selectedGrant && (
    <GrantApplicationModal
      grant={selectedGrant}
      onClose={() => setSelectedGrant(null)}
    />
  )}
  </>
  );
};
