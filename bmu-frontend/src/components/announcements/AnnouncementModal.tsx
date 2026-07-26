import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Megaphone, GraduationCap, Calendar, Info } from 'lucide-react';
import { useAnnouncements } from '../../services/apiHooks';
import type { AnnouncementData } from '../../services/mockData';

const typeIcons: Record<string, React.ElementType> = {
  alert: Bell,
  admission: GraduationCap,
  event: Calendar,
  general: Info,
};

const typeColors: Record<string, string> = {
  alert: '#DC2626',
  admission: '#2563EB',
  event: '#7C3AED',
  general: '#1E1E1E',
};

export const AnnouncementModal = () => {
  const { data: announcements } = useAnnouncements();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  useEffect(() => {
    if (!announcements?.length) return;
    const dismissed = sessionStorage.getItem('bmu_announcement_dismissed');
    if (dismissed === 'true') return;
    setIsOpen(true);
  }, [announcements]);

  if (!announcements?.length) return null;

  const announcement = announcements[0];
  if (dismissedId === announcement.id) return null;

  const Icon = typeIcons[announcement.announcement_type] || Megaphone;
  const color = typeColors[announcement.announcement_type] || '#1E1E1E';

  const handleClose = () => {
    setIsOpen(false);
    setDismissedId(announcement.id);
    sessionStorage.setItem('bmu_announcement_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />
          <motion.div
            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            {announcement.image && (
              <div className="overflow-hidden">
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '50vh' }}
                />
              </div>
            )}

            <div className="p-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white mb-4"
                style={{ backgroundColor: color }}
              >
                <Icon size={14} />
                {announcement.announcement_type.charAt(0).toUpperCase() + announcement.announcement_type.slice(1)}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">{announcement.title}</h2>

              {announcement.content && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {announcement.content}
                </p>
              )}

              {announcement.link_url && (
                <a
                  href={announcement.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2.5 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: color }}
                >
                  {announcement.link_text || 'Learn More'}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
