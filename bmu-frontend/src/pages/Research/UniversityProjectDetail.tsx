import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  ListChecks,
} from 'lucide-react';
import { useUniversityProject } from '../../services/apiHooks';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  ongoing: { color: '#2563EB', icon: Clock, label: 'Ongoing' },
  completed: { color: '#16A34A', icon: CheckCircle, label: 'Completed' },
  proposed: { color: '#F59E0B', icon: Briefcase, label: 'Proposed' },
};

const categoryLabels: Record<string, string> = {
  infrastructure: 'Infrastructure',
  research: 'Research',
  community: 'Community & Outreach',
  technology: 'Technology & Digital',
  academic: 'Academic & Student',
};

const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

export const UniversityProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const id = Number(projectId);

  const { data: project, isLoading } = useUniversityProject(id);

  if (isLoading) {
    return (
      <section className="pt-[180px] pb-20 min-h-screen">
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
      <section className="pt-[180px] pb-20 min-h-screen">
        <div className="container-custom text-center py-20">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">Project not found.</p>
          <Link to="/research/university-projects" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to University Projects
          </Link>
        </div>
      </section>
    );
  }

  const status = statusConfig[project.status] || statusConfig.ongoing;
  const StatusIcon = status.icon;
  const embedUrl = getEmbedUrl(project.video_url);
  const galleryImages = project.gallery_images || [];

  const formatAmount = (amount: number | null) => {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>{project.title} | Bayelsa Medical University</title>
        <meta name="description" content={project.description.slice(0, 160)} />
      </Helmet>

      <section className="pt-[180px] pb-20">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <span>/</span>
            <Link to="/research" className="hover:text-primary-600 transition">Research</Link>
            <span>/</span>
            <Link to="/research/university-projects" className="hover:text-primary-600 transition">University Projects</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{project.title}</span>
          </div>

          {/* Back link */}
          <Link
            to="/research/university-projects"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to University Projects
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: status.color }}>
                <StatusIcon size={14} />
                {status.label}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-ink-900/8 text-ink-900">
                {categoryLabels[project.category] || project.category}
              </span>
              <span className="text-sm text-gray-500">{project.year ? `Since ${project.year}` : project.lead_unit}</span>
            </div>
            <h1 className="text-display text-gray-900 mb-6">{project.title}</h1>
            {project.subtitle && <p className="text-lead text-gray-600 max-w-3xl mb-8">{project.subtitle}</p>}
          </motion.div>

          {/* Cover image / video */}
          {embedUrl ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="relative aspect-video bg-ink-900 mb-10">
                <iframe
                  src={embedUrl}
                  title={project.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ) : project.image ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <img src={project.image} alt={project.title} className="w-full aspect-video object-cover mb-10" />
            </motion.div>
          ) : null}

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Building2 size={16} />
                Lead Unit
              </div>
              <p className="font-semibold text-gray-900">{project.lead_unit || '—'}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <DollarSign size={16} />
                Budget
              </div>
              <p className="font-semibold text-gray-900">{formatAmount(project.budget)}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={16} />
                Started
              </div>
              <p className="font-semibold text-gray-900">{project.year || '—'}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CheckCircle size={16} />
                Completion
              </div>
              <p className="font-semibold text-gray-900">{project.completion_date || (project.status === 'completed' ? 'Completed' : '—')}</p>
            </div>
          </div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-headline text-gray-900 mb-4">About This Project</h2>
            <p className="text-gray-700 leading-relaxed mb-10 whitespace-pre-line">{project.description}</p>
          </motion.div>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-headline text-gray-900 mb-6">Project Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {project.highlights.map((highlight, i) => (
                  <div key={i} className="p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <ListChecks className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-headline text-gray-900 mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((img, i) => (
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
        </div>
      </section>
    </>
  );
};