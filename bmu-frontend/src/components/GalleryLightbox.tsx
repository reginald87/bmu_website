import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Download, MapPin, User, X } from 'lucide-react';
import { downloadGalleryImage } from '../services/api';
import type { GalleryImageData } from '../services/mockData';

interface GalleryLightboxProps {
  images: GalleryImageData[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export const GalleryLightbox = ({ images, index, onClose, onNavigate }: GalleryLightboxProps) => {
  const image = index !== null ? images[index] : null;

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (index === null || images.length === 0) return;
      onNavigate((index + dir + images.length) % images.length);
    },
    [index, images.length, onNavigate],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, navigate, onClose]);

  if (!image) return null;

  const meta: { icon: typeof Calendar; label: string }[] = [];
  if (image.location) meta.push({ icon: MapPin, label: image.location });
  if (image.event_date) meta.push({ icon: Calendar, label: new Date(image.event_date).toLocaleDateString() });
  if (image.photographer) meta.push({ icon: User, label: image.photographer });

  return (
    <AnimatePresence>
      <motion.div
        key="gallery-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col select-none"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={image.title}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <span className="text-white/60 text-sm tracking-widest tabular-nums">
            {(index ?? 0) + 1} <span className="opacity-50">/ {images.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadGalleryImage(image.id, image.title);
              }}
              className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          className="relative flex-1 flex items-center justify-center min-h-0 px-12 sm:px-24"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={image.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              src={image.image_url}
              alt={image.title}
              draggable={false}
              className="max-h-full max-w-full object-contain shadow-2xl"
            />
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1);
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors backdrop-blur-sm"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1);
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors backdrop-blur-sm"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="px-4 sm:px-6 pt-4 pb-6 sm:pb-8" onClick={(e) => e.stopPropagation()}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3 rounded-full border border-white/20 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              <span className="text-white/60 text-xs uppercase tracking-widest">{image.category || 'Gallery'}</span>
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">{image.title}</h3>
            {image.description && <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">{image.description}</p>}
            {meta.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/50 text-xs sm:text-sm">
                {meta.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span key={item.label} className="inline-flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};