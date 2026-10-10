import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, BookOpen, GraduationCap, Microscope, HeartPulse, Globe, Library, type LucideIcon } from 'lucide-react';
import type { College } from '../../services/mockData';

interface CollegePreviewProps {
  colleges: College[];
}

const iconMap: Record<string, LucideIcon> = {
  GraduationCap, Microscope, HeartPulse, BookOpen, Globe, Library,
};

const defaultPreviewImage = 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80';

export const CollegePreview = ({ colleges }: CollegePreviewProps) => {
  const { t } = useTranslation();
  const displayColleges = colleges.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">
            {t('home.collegePreview.institutions')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-ink-900">
            {t('nav.colleges')}
          </h2>
          <p className="text-gray-800 max-w-2xl">
            {t('home.collegePreview.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayColleges.map((college, index) => {
            const IconComponent = (college.iconName && iconMap[college.iconName]) || GraduationCap;
            return (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/colleges/${college.slug}`}
                  className="group block relative h-[320px] overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${college.previewImage || defaultPreviewImage})` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/60 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/20">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:underline transition-all">
                      {college.name}
                    </h3>

                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {college.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-white/90 mb-4">
                      {college.facultyCount && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{college.facultyCount} {t('home.collegePreview.faculty')}</span>
                        </div>
                      )}
                      {college.studentCount && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{college.studentCount} {t('home.collegePreview.students')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-semibold">
                        {college.programCount ?? college.programs?.length ?? college.courses?.length ?? 0} {t('home.collegePreview.programs')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/colleges"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            {t('home.quickLinks.viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
