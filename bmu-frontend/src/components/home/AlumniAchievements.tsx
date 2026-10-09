import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Award, Building2, ArrowRight, Users, ExternalLink, User } from 'lucide-react';
import { useAlumni, useAlumniCount } from '../../services/apiHooks';
import type { AlumniData } from '../../services/api';

interface Alumni {
  id: number;
  name: string;
  graduationYear: number;
  program: string;
  achievement?: string;
  currentRole: string;
  organization: string;
  image?: string;
}

const fallbackAlumni: Alumni[] = [
  {
    id: 1,
    name: 'Dr. Sarah Okonkwo',
    graduationYear: 2020,
    program: 'MBBS',
    achievement: 'Young Physician Award 2024',
    currentRole: 'Resident Surgeon',
    organization: 'Lagos University Teaching Hospital',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    id: 2,
    name: 'Dr. Michael Ebi',
    graduationYear: 2019,
    program: 'MPH',
    achievement: 'WHO Fellowship Recipient',
    currentRole: 'Epidemiologist',
    organization: 'World Health Organization',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  },
  {
    id: 3,
    name: 'Nurse Adaeze Douglas',
    graduationYear: 2021,
    program: 'B.NSc',
    achievement: 'Excellence in Patient Care',
    currentRole: 'Head Nurse',
    organization: 'National Hospital Abuja',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&q=80',
  },
];

const mapAlumni = (data: AlumniData): Alumni => ({
  id: data.id,
  name: data.name,
  graduationYear: data.graduation_year,
  program: data.program || data.degree_awarded || '',
  currentRole: data.current_role || '',
  organization: data.organization || '',
  image: data.image || undefined,
});

export const AlumniAchievements = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: unknown }> }) => {
  const { t } = useTranslation();
  const { data: backendAlumni } = useAlumni(6);
  const { data: alumniCount } = useAlumniCount();

  const staticAlumni = (homeSections?.find(s => s.section_key === 'alumni_notable')?.data as Alumni[] | undefined);

  const notableAlumni: Alumni[] = backendAlumni && backendAlumni.length > 0
    ? backendAlumni.map(mapAlumni)
    : (staticAlumni && staticAlumni.length > 0 ? staticAlumni : fallbackAlumni);

  const alumniTotal = (typeof alumniCount === 'number' && alumniCount > 0)
    ? alumniCount.toString()
    : (homeSections?.find(s => s.section_key === 'alumni_stat')?.data as Array<{ value: string; label: string }> || [{ value: '2,500+', label: 'Active Alumni Network' }])[0]?.value || '2,500+';

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
          <span className="text-sm font-semibold uppercase tracking-wider mb-2 block text-primary-600">
            {t('home.alumni.subtitle', 'Where Our Graduates Go')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ink-900">
            {t('home.alumni.title', 'Distinguished Alumni')}
          </h2>
          <p className="text-gray-800 max-w-2xl">
            {t('home.alumni.description', 'Our graduates are making an impact in healthcare across Nigeria and beyond.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {notableAlumni.map((alumni, index) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-white border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative">
                    {alumni.image ? (
                      <div className="w-16 h-16 overflow-hidden border-2 border-gray-200">
                        <img loading="lazy" decoding="async"
                          src={alumni.image}
                          alt={alumni.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{alumni.name}</h3>
                    <p className="text-sm text-gray-500">
                      {alumni.program} • Class of {alumni.graduationYear}
                    </p>
                  </div>
                </div>

                {alumni.achievement && (
                  <div className="mb-4 p-3 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-semibold text-ink-900">{alumni.achievement}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Currently:</span> {alumni.currentRole}
                  </p>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">{alumni.organization}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/portals/alumni"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
                >
                  Connect with Alumni
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-gray-50 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-600/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink-900">{alumniTotal}</p>
                <p className="text-gray-600">Active Alumni Network</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/portals/alumni"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                Alumni Portal
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                to="/about/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-ink-900 text-ink-900 font-semibold hover:bg-ink-900 hover:text-white transition-colors"
              >
                Join Network
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
