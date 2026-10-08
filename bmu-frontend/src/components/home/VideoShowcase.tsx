import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useCampusVideo } from '../../services/apiHooks';

export const VideoShowcase = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: video } = useCampusVideo();

  const hasVideo = video && ((video.video_type === 'url' && video.embed_url) || (video.video_type === 'upload' && video.video_file));

  const renderVideoPlayer = () => {
    if (!hasVideo) {
      return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-600 text-lg">Campus Tour Preview</span>
        </div>
      );
    }

    if (video.video_type === 'url' && video.embed_url) {
      return (
        <iframe
          src={`${video.embed_url}?autoplay=1&mute=1`}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={video.title}
        />
      );
    }

    if (video.video_type === 'upload' && video.video_file) {
      return (
        <video
          src={video.video_file}
          className="w-full h-full object-cover"
          controls
          autoPlay
          muted
          poster={video.thumbnail || undefined}
        />
      );
    }

    return null;
  };

  return (
    <section className="py-24 bg-ink-900 text-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-primary-600">
            Campus Life
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            {t('home.video.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl">
            {t('home.video.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-4xl mx-auto aspect-video bg-black overflow-hidden group cursor-pointer"
          onClick={() => hasVideo && setIsPlaying(!isPlaying)}
        >
          {isPlaying && hasVideo ? (
            <div className="w-full h-full">
              {renderVideoPlayer()}
              <button
                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white font-semibold transition-colors rounded"
              >
                <Pause className="w-4 h-4" />
                {t('home.video.play')}
              </button>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {video?.thumbnail ? (
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-lg">Campus Tour Preview</span>
                </div>
              )}
              {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary-600/90 flex items-center justify-center hover:bg-primary-600 transition-colors group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-lg font-semibold">{video?.title || 'Experience Our Campus'}</p>
                <p className="text-sm text-gray-300 mt-1">{video?.description || 'Take a virtual tour of BMU\'s state-of-the-art facilities'}</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};
