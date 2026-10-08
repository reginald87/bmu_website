import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Users,
  Lightbulb,
} from 'lucide-react';
import { useInnovationProgram } from '../../services/apiHooks';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  ongoing: { color: '#2563EB', icon: Clock, label: 'Ongoing' },
  completed: { color: '#16A34A', icon: CheckCircle, label: 'Completed' },
  proposed: { color: '#F59E0B', icon: Target, label: 'Proposed' },
};

const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
};

export const TechnologyInnovationDetail = () => {
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);

  const { data: program, isLoading } = useInnovationProgram(id);

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

  if (!program) {
    return (
      <section className="pt-[180px] pb-20 min-h-screen">
        <div className="container-custom text-center py-20">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">Programme not found.</p>
          <Link to="/research/innovation" className="text-[#A51C30] hover:underline mt-4 inline-block">
            Back to Technology & Innovation
          </Link>
        </div>
      </section>
    );
  }

  const status = statusConfig[program.status] || statusConfig.ongoing;
  const StatusIcon = status.icon;
  const embedUrl = getEmbedUrl(program.video_url);
  const galleryImages = program.gallery_images || [];
  const stats = [
    { label: program.stat_1_label, value: program.stat_1_value },
    { label: program.stat_2_label, value: program.stat_2_value },
    { label: program.stat_3_label, value: program.stat_3_value },
  ].filter(s => s.label || s.value);

  return (
    <>
      <Helmet>
        <title>{program.title} | Bayelsa Medical University</title>
        <meta name="description" content={program.description.slice(0, 160)} />
      </Helmet>

      <section className="pt-[180px] pb-20">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#A51C30] transition">Home</Link>
            <span>/</span>
            <Link to="/research" className="hover:text-[#A51C30] transition">Research</Link>
            <span>/</span>
            <Link to="/research/innovation" className="hover:text-[#A51C30] transition">Technology & Innovation</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{program.title}</span>
          </div>

          {/* Back link */}
          <Link
            to="/research/innovation"
            className="inline-flex items-center gap-2 text-sm text-[#A51C30] hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to Technology & Innovation
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: status.color }}>
                <StatusIcon size={14} />
                {status.label}
              </div>
              <span className="text-sm text-gray-500">{program.year ? `Since ${program.year}` : program.lead_unit}</span>
            </div>
            <h1 className="text-display text-gray-900 mb-6">{program.title}</h1>
            {program.subtitle && <p className="text-lead text-gray-600 max-w-3xl mb-8">{program.subtitle}</p>}
          </motion.div>

          {/* Cover image / video */}
          {embedUrl ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="relative aspect-video bg-[#1E1E1E] mb-10">
                <iframe
                  src={embedUrl}
                  title={program.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ) : program.cover_image ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <img src={program.cover_image} alt={program.title} className="w-full aspect-video object-cover mb-10" />
            </motion.div>
          ) : null}

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Building2 size={16} />
                Lead Unit
              </div>
              <p className="font-semibold text-gray-900">{program.lead_unit || '—'}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar size={16} />
                Started
              </div>
              <p className="font-semibold text-gray-900">{program.year || '—'}</p>
            </div>
            <div className="p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Users size={16} />
                Programme Type
              </div>
              <p className="font-semibold text-gray-900 capitalize">{program.program_type.replace(/_/g, ' ')}</p>
            </div>
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {stats.map((s) => (
                  <div key={s.label} className="p-5 text-center" style={{ backgroundColor: '#1E1E1E' }}>
                    <div className="text-stat text-[#A51C30] mb-1">{s.value || '—'}</div>
                    <p className="text-white/70 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="text-headline text-gray-900 mb-4">About This Programme</h2>
            <p className="text-gray-700 leading-relaxed mb-10 whitespace-pre-line">{program.description}</p>
          </motion.div>

          {/* Objectives + Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {program.objectives.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-title text-gray-900 mb-4">Objectives</h3>
                <ul className="space-y-3">
                  {program.objectives.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <Target className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {program.achievements.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="text-title text-gray-900 mb-4">Achievements</h3>
                <ul className="space-y-3">
                  {program.achievements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-[#A51C30] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-headline text-gray-900 mb-6">Programme Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

          {/* Partners */}
          {program.partners.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="text-headline text-gray-900 mb-6">Partners & Collaborators</h2>
              <div className="flex flex-wrap gap-3">
                {program.partners.map((partner) => (
                  <span
                    key={partner}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 text-[#1E1E1E]"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};