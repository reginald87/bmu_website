import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Image as ImageIcon, Calendar, User, Download, Expand } from 'lucide-react';
import { useGalleryImages } from '../../services/apiHooks';
import { downloadGalleryImage } from '../../services/api';
import { GalleryLightbox } from '../../components/GalleryLightbox';

export const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: images = [], isLoading, error } = useGalleryImages();

  const categories = ['all', ...Array.from(new Set(images.filter(img => img.category).map(img => img.category) as string[]))];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-ink-900 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-4">Failed to load gallery images. Please try again later.</p>
          <Link to="/" className="text-ink-900 font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gallery | Bayelsa Medical University</title>
        <meta name="description" content="Explore photos and videos from Bayelsa Medical University events, campus life, and academic activities." />
      </Helmet>

      <section className="relative pt-[180px] pb-20 overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Gallery</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Photo <span className="text-primary-600">Gallery</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Explore moments from our campus life, academic events, ceremonies, and student activities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-ink-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'All Photos' : category}
                </button>
              ))}
            </div>
          )}

          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Photos will appear here once they are uploaded to the gallery.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white overflow-hidden shadow-sm transition-all cursor-zoom-in"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img loading="lazy" decoding="async"
                      src={image.thumbnail_url || image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                        title="View image"
                      >
                        <Expand className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadGalleryImage(image.id, image.title); }}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                        title="Download image"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-xs text-white/80 line-clamp-2">{image.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                        {image.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(image.event_date).toLocaleDateString()}
                          </span>
                        )}
                        {image.photographer && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {image.photographer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {image.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-ink-900 text-white text-xs">
                        {image.category}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <GalleryLightbox
        images={filteredImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default Gallery;
