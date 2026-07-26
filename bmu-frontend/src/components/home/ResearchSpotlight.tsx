import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useFundedProjects } from '../../services/apiHooks';

interface ResearchProject {
  id: number;
  title: string;
  description: string;
  principalInvestigator: string;
  funding: string;
  impact: string;
}

interface ResearchSpotlightProps {
  compact?: boolean;
}

const formatAmount = (amount: number): string => {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(0)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(0)}K`;
  return `₦${amount}`;
};

export const ResearchSpotlight = ({ compact }: ResearchSpotlightProps) => {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useFundedProjects();

  const featuredResearch: ResearchProject[] = projects
    ? projects.filter(p => p.impact).slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        principalInvestigator: p.principal_investigator || 'BMU Research Team',
        funding: `${formatAmount(p.amount)} (${p.organization_name})`,
        impact: p.impact || ''
      }))
    : [];

  if (isLoading) {
    const content = (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
    if (compact) return <div style={{ backgroundColor: '#1E1E1E' }} className="p-5 lg:p-6 h-full">{content}</div>;
    return (
      <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="container-custom">{content}</div>
      </section>
    );
  }

  const content = (
    <>
      {featuredResearch.length === 0 ? (
        <p className="text-white/60 text-center py-8">No research projects available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredResearch.map((project, index) => (
            <Link
              key={project.id}
              to={`/research/projects/${project.id}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white p-5 h-full transition-all duration-300 group-hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-[#A51C30]/10 flex items-center justify-center mb-3">
                  <span className="text-lg">🔬</span>
                </div>

                <h3 className="font-bold text-base mb-2 leading-snug text-[#1E1E1E] group-hover:text-[#A51C30] transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-1.5 text-xs mb-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">👤</span>
                    <span>{project.principalInvestigator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">💰</span>
                    <span className="truncate">{project.funding}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">📊</span>
                    <span className="truncate">{project.impact}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-[#A51C30] transition-all duration-300 group-hover:gap-2">
                  <span>Read full project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {!compact && (
        <div className="text-center mt-12">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#A51C30] text-white font-semibold hover:bg-[#8a1828] transition-colors"
          >
            {t('home.researchSpotlight.exploreAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </>
  );

  if (compact) return (
    <div style={{ backgroundColor: '#1E1E1E' }} className="p-5 lg:p-6 h-full">
      {content}
    </div>
  );

  return (
    <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="container-custom">
        {content}
      </div>
    </section>
  );
};
