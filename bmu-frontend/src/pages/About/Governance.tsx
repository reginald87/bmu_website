import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Building2, Users, Gavel, FileText, Shield, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGovernancePage } from '../../services/apiHooks';
import { ALLOW_API_MOCKS } from '../../services/api';
import { useMemo } from 'react';
import { iconMap as iconRegistry } from '../../lib/icons';

const fallbackGovernanceBodies = [
  {
    title: 'University Council',
    role: 'Supreme Governing Body',
    description: 'The highest decision-making body responsible for the overall policy, governance, and strategic direction of the university.',
    responsibilities: ['Approve major policies', 'Oversee financial management', 'Appoint key officials', 'Ensure institutional accountability'],
    icon: Building2,
    color: 'var(--color-ink-900)',
  },
  {
    title: 'University Senate',
    role: 'Academic Authority',
    description: 'The highest academic body responsible for academic standards, curriculum development, and research oversight.',
    responsibilities: ['Academic policy formulation', 'Curriculum approval', 'Research standards', 'Student discipline (academic)'],
    icon: Users,
    color: 'var(--color-primary-600)',
  },
  {
    title: 'Management Board',
    role: 'Executive Body',
    description: 'The day-to-day administrative leadership team implementing policies and managing university operations.',
    responsibilities: ['Operational management', 'Resource allocation', 'Staff administration', 'Implementation of policies'],
    icon: Gavel,
    color: 'var(--color-ink-900)',
  },
];

const fallbackCommittees = [
  { name: 'Finance & General Purposes Committee', focus: 'Financial oversight and resource management' },
  { name: 'Appointments & Promotions Committee', focus: 'Staff appointments and career progression' },
  { name: 'Tender Board', focus: 'Procurement and contract approvals' },
  { name: 'Academic Planning Committee', focus: 'Strategic academic development' },
  { name: 'Research Ethics Committee', focus: 'Research ethics and compliance' },
  { name: 'Quality Assurance Committee', focus: 'Quality standards and accreditation' },
];

const fallbackPolicies = [
  { title: 'Academic Integrity Policy', description: 'Maintaining highest standards in research and teaching' },
  { title: 'Anti-Corruption Policy', description: 'Zero tolerance for corruption in all university dealings' },
  { title: 'Gender Policy', description: 'Promoting gender equality and inclusion across all levels' },
  { title: 'Environmental Sustainability Policy', description: 'Commitment to eco-friendly campus operations' },
  { title: 'Student Code of Conduct', description: 'Guidelines for ethical student behavior' },
  { title: 'Staff Welfare Policy', description: 'Ensuring staff wellbeing and professional development' },
];

const resolveIcon = (name?: string): LucideIcon => {
  if (!name) return Building2;
  return iconRegistry[name] || Building2;
};

export const Governance = () => {
  const { data: pageData } = useGovernancePage();

  const heroContent = pageData?.hero_content || 'Transparent, accountable, and effective governance structures that ensure the highest standards of institutional leadership and academic excellence.';

  const governanceBodies = useMemo(() => {
    if (pageData?.governing_bodies?.length) {
      return pageData.governing_bodies.map((body) => ({
        icon: resolveIcon(body.icon_name || undefined),
        title: body.title,
        role: body.role,
        description: body.description,
        responsibilities: body.responsibilities || [],
        color: body.color || 'var(--color-ink-900)',
      }));
    }
    return ALLOW_API_MOCKS ? fallbackGovernanceBodies : [];
  }, [pageData]);

  const committees = useMemo(() => {
    if (pageData?.committees?.length) {
      return pageData.committees;
    }
    return ALLOW_API_MOCKS ? fallbackCommittees : [];
  }, [pageData]);

  const policies = useMemo(() => {
    if (pageData?.policies?.length) {
      return pageData.policies;
    }
    return ALLOW_API_MOCKS ? fallbackPolicies : [];
  }, [pageData]);

  return (
    <>
      <Helmet>
        <title>Governance | Bayelsa Medical University</title>
        <meta name="description" content="Learn about BMU's governance structure including the University Council, Senate, and key administrative bodies ensuring transparent and effective leadership." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Governance</span>
            </div>
            <h1 className="text-display text-white mb-6">
              University <span className="text-primary-600">Governance</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              {heroContent}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Governance Overview */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Governance Structure</h2>
            <p className="text-gray-600">
              BMU operates under a robust governance framework that ensures transparency, 
              accountability, and excellence in decision-making at all levels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {governanceBodies.map((body, index) => {
              const Icon = body.icon;
              return (
                <motion.div
                  key={body.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white p-8 transition-shadow"
                >
                  <div 
                    className="w-16 h-16 flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${body.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: body.color }} />
                  </div>
                  <span 
                    className="inline-block px-3 py-1 text-xs font-semibold mb-3"
                    style={{ backgroundColor: `${body.color}15`, color: body.color }}
                  >
                    {body.role}
                  </span>
                  <h3 className="text-title text-gray-900 mb-3">{body.title}</h3>
                  <p className="text-gray-600 mb-4">{body.description}</p>
                  <ul className="space-y-2">
                    {body.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ backgroundColor: body.color }} />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organizational Chart Placeholder */}
      <section className="py-16">
        <div className="container-custom">
          <div className="bg-white p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-headline text-gray-900 mb-2">Governance Hierarchy</h2>
              <p className="text-gray-600 text-body">Overview of decision-making authority at BMU</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {/* Council */}
              <div className="w-full max-w-md bg-ink-900 text-white p-4 text-center">
                <h4 className="font-bold">University Council</h4>
                <p className="text-sm text-white/80">Supreme Authority</p>
              </div>
              <div className="h-8 w-0.5 bg-gray-300" />
              
              {/* Senate & Management */}
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
                <div className="flex-1 bg-primary-600 text-white p-4 text-center">
                  <h4 className="font-bold">University Senate</h4>
                  <p className="text-sm text-white/80">Academic Authority</p>
                </div>
                <div className="flex-1 bg-ink-900 text-white p-4 text-center">
                  <h4 className="font-bold">Management Board</h4>
                  <p className="text-sm text-white/80">Executive Authority</p>
                </div>
              </div>
              <div className="h-8 w-0.5 bg-gray-300" />
              
              {/* Operations */}
              <div className="w-full max-w-md bg-gray-100 p-4 text-center border-2 border-gray-200">
                <h4 className="font-bold text-gray-900">Colleges, Schools & Administrative Units</h4>
                <p className="text-sm text-gray-600">Operational Implementation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Committees */}
      <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Key Committees</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized committees that support effective governance and decision-making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {committees.map((committee, index) => (
              <motion.div
                key={committee.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-5 shadow-sm border border-gray-100 transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-ink-900) 8%, transparent)' }}>
                    <Shield className="w-5 h-5" style={{ color: 'var(--color-ink-900)' }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{committee.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{committee.focus}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Policies */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-headline text-gray-900 mb-4">Key Policies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Frameworks that guide our operations and ensure institutional integrity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white shadow-sm border border-gray-100 hover:border-primary-600 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 8%, transparent)' }}>
                  <FileText className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                  <p className="text-sm text-gray-600">{policy.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency & Accountability */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Transparency & Accountability</h2>
              <p className="text-lg text-white/80 mb-6">
                We are committed to operating with the highest standards of transparency. 
                Our governance practices ensure that every decision is made in the best interest 
                of our students, staff, and the communities we serve.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary-600" />
                  <span className="text-white">Fair and equitable policies</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <span className="text-white">Regular audits and compliance checks</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <span className="text-white">Public disclosure of key decisions</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8">
              <h3 className="text-title text-white mb-4">Key Governance Documents</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/80 hover:text-white cursor-pointer transition">
                  <FileText className="w-5 h-5" />
                  University Act & Statutes
                </li>
                <li className="flex items-center gap-3 text-white/80 hover:text-white cursor-pointer transition">
                  <FileText className="w-5 h-5" />
                  Council Terms of Reference
                </li>
                <li className="flex items-center gap-3 text-white/80 hover:text-white cursor-pointer transition">
                  <FileText className="w-5 h-5" />
                  Senate Standing Orders
                </li>
                <li className="flex items-center gap-3 text-white/80 hover:text-white cursor-pointer transition">
                  <FileText className="w-5 h-5" />
                  Financial Regulations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
