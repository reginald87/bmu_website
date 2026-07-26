import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, DollarSign, User, Building2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFundedProjectById } from '../../services/api';
import type { FundedProjectData } from '../../services/mockData';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  ongoing: { color: '#2563EB', icon: Clock, label: 'Ongoing' },
  completed: { color: '#16A34A', icon: CheckCircle, label: 'Completed' },
  suspended: { color: '#DC2626', icon: AlertCircle, label: 'Suspended' },
};

export const FundedProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const id = Number(projectId);

  const { data: project, isLoading } = useQuery({
    queryKey: ['fundedProject', id],
    queryFn: () => fetchFundedProjectById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="pt-[140px] pb-20 min-h-screen">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200" />
            <div className="h-6 w-96 bg-gray-200" />
            <div className="h-64 bg-gray-200" />
            <div className="h-4 w-full bg-gray-200" />
            <div className="h-4 w-3/4 bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="pt-[140px] pb-20 min-h-screen">
        <div className="container-custom text-center py-20">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">Project not found.</p>
          <Link to="/impact/external-partners" className="text-[#A51C30] hover:underline mt-4 inline-block">
            Back to External Partners
          </Link>
        </div>
      </section>
    );
  }

  const status = statusConfig[project.status] || statusConfig.ongoing;
  const StatusIcon = status.icon;
  const galleryImages = project.gallery_images || [];
  const allImages = [
    ...(project.image ? [{ image: project.image, caption: project.title, order: -1 }] : []),
    ...galleryImages,
  ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>{project.title} - Bayelsa Medical University</title>
        <meta name="description" content={project.description.slice(0, 160)} />
      </Helmet>

      <section className="pt-[140px] pb-20">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#A51C30] transition">Home</Link>
            <span>/</span>
            <Link to="/impact" className="hover:text-[#A51C30] transition">Impact</Link>
            <span>/</span>
            <Link to="/impact/external-partners" className="hover:text-[#A51C30] transition">External Partners</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{project.title}</span>
          </div>

          {/* Back link */}
          <Link
            to="/impact/external-partners"
            className="inline-flex items-center gap-2 text-sm text-[#A51C30] hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to External Partners
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: status.color }}>
                <StatusIcon size={14} />
                {status.label}
              </div>
              <span className="text-sm text-gray-500">{project.year}</span>
            </div>
            <h1 className="text-display text-gray-900 mb-6">{project.title}</h1>
          </motion.div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Building2 size={16} />
                Organization
              </div>
              <p className="font-semibold text-gray-900">{project.organization_name}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign size={16} />
                Funding Amount
              </div>
              <p className="font-semibold text-gray-900">{formatAmount(project.amount)}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={16} />
                Year
              </div>
              <p className="font-semibold text-gray-900">{project.year}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <User size={16} />
                Principal Investigator
              </div>
              <p className="font-semibold text-gray-900">{project.principal_investigator || '—'}</p>
            </div>
          </div>

          {/* Gallery */}
          {allImages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-headline text-gray-900 mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {allImages.map((img, i) => (
                  <div key={i} className="overflow-hidden border border-gray-200">
                    <img src={img.image} alt={img.caption} className="w-full aspect-video object-cover" />
                    {img.caption && (
                      <p className="text-center text-sm text-gray-500 py-2 px-3">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-headline text-gray-900 mb-4">About This Project</h2>
            <p className="text-gray-700 leading-relaxed mb-10 whitespace-pre-line">{project.description}</p>
          </motion.div>

          {/* Impact */}
          {project.impact && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-headline text-gray-900 mb-4">Impact & Outcomes</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.impact}</p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};
