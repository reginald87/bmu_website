import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Microscope,
  Target,
  Eye,
  BookOpen,
  ChevronRight,
  FileText,
  Award,
  Beaker,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';
import { useResearchCenters } from '../../services/apiHooks';

export const ResearchAndDevelopment = () => {
  const { data: centers = [], isLoading, isError } = useResearchCenters();
  const center = centers.find((c) => c.is_featured) ?? centers[0] ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-ink-900" />
      </div>
    );
  }

  if (isError || !center) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">Unable to load Research & Development Center information.</p>
          <Link to="/research" className="text-ink-900 font-medium hover:underline">
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  const researchAreas = center.research_areas
    ? center.research_areas.split(',').map((a: string) => a.trim())
    : [];

  return (
    <>
      <Helmet>
        <title>Research & Development Center | Bayelsa Medical University</title>
        <meta name="description" content={center.description} />
      </Helmet>

      {/* Hero with Director */}
      <section className="relative pt-[180px] pb-20 overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/research" className="hover:text-white transition">Research</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">Research & Development</span>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <Microscope className="w-8 h-8 text-primary-600" />
                  {center.code && (
                    <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-mono">
                      {center.code}
                    </span>
                  )}
                </div>
                <h1 className="text-display text-white mb-4">{center.name}</h1>
                <p className="text-lead text-white/80 max-w-2xl">
                  Advancing medical knowledge through cutting-edge research, innovation,
                  and collaboration to address health challenges in the Niger Delta and beyond.
                </p>
              </div>

              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/5 border border-white/10 p-6 text-center"
                >
                  <div className="w-24 h-24 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-1">{center.director_title}</p>
                  <h2 className="text-xl font-bold text-white">{center.director_name}</h2>
                  {center.established_date && (
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-white/50 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      Established {new Date(center.established_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 border-y bg-white" style={{ borderColor: '#e5e4e7' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: center.total_publications + '+', label: 'Publications' },
              { value: center.ongoing_projects_count + '+', label: 'Active Projects' },
              { value: center.completed_projects_count + '+', label: 'Completed Projects' },
              { value: researchAreas.length, label: 'Research Areas' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-ink-900 mb-1">{stat.value}</div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">About</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-gray-900">About the Research & Development Center</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{center.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(center.mission || center.vision) && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {center.mission && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-ink-900/5 p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-ink-900 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{center.mission}</p>
                </motion.div>
              )}
              {center.vision && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-primary-600/5 p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-600 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{center.vision}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Research Areas */}
      {researchAreas.length > 0 && (
        <section className="py-20 bg-[#f8f9fa]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">Focus Areas</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">Research Focus Areas</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our research spans a wide range of medical and health-related disciplines
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {researchAreas.map((area: string, i: number) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 shadow-sm border border-gray-100 flex items-start gap-3"
                >
                  <Beaker className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{area}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Info */}
      {(center.email || center.phone || center.location) && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">Contact</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">Get in Touch</h2>
                <p className="text-gray-600">
                  Interested in collaborating or learning more about our research?
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {center.email && (
                  <div className="text-center p-6 bg-[#f8f9fa]">
                    <Mail className="w-6 h-6 text-primary-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 text-sm mb-1">Email</p>
                    <a href={`mailto:${center.email}`} className="text-gray-600 text-sm hover:text-ink-900 transition">
                      {center.email}
                    </a>
                  </div>
                )}
                {center.phone && (
                  <div className="text-center p-6 bg-[#f8f9fa]">
                    <Phone className="w-6 h-6 text-primary-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 text-sm mb-1">Phone</p>
                    <a href={`tel:${center.phone}`} className="text-gray-600 text-sm hover:text-ink-900 transition">
                      {center.phone}
                    </a>
                  </div>
                )}
                {center.location && (
                  <div className="text-center p-6 bg-[#f8f9fa]">
                    <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 text-sm mb-1">Location</p>
                    <p className="text-gray-600 text-sm">{center.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Publications & Funding CTA */}
      <section className="py-20 bg-ink-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">Resources</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">
                Explore Our Research
              </h2>
              <p className="text-white/70 mb-6 max-w-md">
                Browse our publications, find research funding opportunities, and learn about ongoing projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/research/publications"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold hover:bg-white hover:text-ink-900 transition"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Publications
                </Link>
                <Link
                  to="/research/funding"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-ink-900 transition"
                >
                  <Award className="w-5 h-5" />
                  Research Funding
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: FileText, value: center.total_publications, label: 'Publications' },
                { icon: Beaker, value: center.ongoing_projects_count, label: 'Active Projects' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
