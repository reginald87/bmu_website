import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, GraduationCap, Calendar, Info, Megaphone, ArrowRight } from 'lucide-react';
import { useAnnouncements } from '../../services/apiHooks';

const typeIcons: Record<string, React.ElementType> = {
  alert: Bell,
  admission: GraduationCap,
  event: Calendar,
  general: Info,
};

const typeLabels: Record<string, string> = {
  alert: 'Important Notice',
  admission: 'Admissions',
  event: 'Upcoming Event',
  general: 'Announcement',
};

export const AnnouncementModal = () => {
  const { data: announcements } = useAnnouncements();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  useEffect(() => {
    if (!announcements?.length) return;
    const dismissed = sessionStorage.getItem('bmu_announcement_dismissed');
    if (dismissed === 'true') return;
    const timer = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(timer);
  }, [announcements]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setDismissedId(announcements?.[0]?.id ?? null);
    sessionStorage.setItem('bmu_announcement_dismissed', 'true');
  }, [announcements]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleClose]);

  if (!announcements?.length) return null;

  const announcement = announcements[0];
  if (dismissedId === announcement.id) return null;

  const Icon = typeIcons[announcement.announcement_type] || Megaphone;
  const label = typeLabels[announcement.announcement_type] || 'Announcement';
  const publishedDate = announcement.created_at
    ? new Date(announcement.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          <motion.div
            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_25px_80px_-12px_rgba(0,0,0,0.5)] border border-black/5"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <button
              onClick={handleClose}
              aria-label="Close announcement"
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-primary-600 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {announcement.image ? (
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1420] via-transparent to-transparent" />
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '42vh', minHeight: 180 }}
                />
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg">
                    <Icon size={14} />
                    {label}
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-between px-6 pt-8 pb-6 bg-gradient-to-br from-primary-600 to-primary-800">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 flex items-center justify-center rounded-full bg-white/15 text-white">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                      Official Notice
                    </p>
                    <h3 className="text-white font-bold text-sm">{label}</h3>
                  </div>
                </div>
                <Megaphone className="w-20 h-20 text-white/10 absolute -right-3 -bottom-5" />
              </div>
            )}

            <div className="px-6 sm:px-8 py-6 overflow-y-auto max-h-[calc(90vh-42vh)]">
              <h2
                id="announcement-title"
                className="text-2xl font-bold text-ink-900 leading-snug mb-2"
              >
                {announcement.title}
              </h2>

              {publishedDate && (
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">
                  Published {publishedDate}
                </p>
              )}

              {announcement.content && (
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line mb-6">
                  {announcement.content}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {announcement.link_url && (
                  <a
                    href={announcement.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    {announcement.link_text || 'Learn More'}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                )}
                <button
                  onClick={handleClose}
                  className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-3.5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                Bayelsa Medical University
              </p>
              <p className="text-[11px] text-gray-400">
                {new Date().getFullYear()} &copy; All rights reserved
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
