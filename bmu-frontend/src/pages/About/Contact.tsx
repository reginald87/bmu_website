import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSubmitContactEnquiry, usePageSections } from '../../services/apiHooks';

const defaultIcon = L.icon({
 iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
 iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
 shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
 iconSize: [25, 41],
 iconAnchor: [12, 41],
 popupAnchor: [1, -34],
 shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_COORDS: [number, number] = [4.9279, 6.2673]; // Yenagoa, Bayelsa

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitMutation = useSubmitContactEnquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  const { data: sections } = usePageSections('contact');

  const fallbackContactInfo = [
    {
      icon: MapPin,
      title: 'Main Campus',
      details: ['Permanent Site,', 'Yenagoa-Amasoma Road,', 'Yenagoa, Bayelsa State, Nigeria'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+234 803 123 4567', '+234 805 987 6543'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@bmu.edu.ng', 'admissions@bmu.edu.ng'],
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Monday - Friday', '8:00 AM - 5:00 PM WAT'],
    },
  ];
  const rawContactInfo = (sections?.find(s => s.section_key === 'contact_info')?.data as any[] || fallbackContactInfo);
  const iconByTitle: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    'Main Campus': MapPin,
    'Address': MapPin,
    'Location': MapPin,
    'Phone': Phone,
    'Hotline': Phone,
    'Email': Mail,
    'Office Hours': Clock,
    'Hours': Clock,
  };
  const contactInfo: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; title: string; details: string[] }[] = rawContactInfo.map((item) => ({
    ...item,
    icon: item.icon || iconByTitle[item.title] || MapPin,
  }));

  const fallbackDepartments = [
    { name: 'Admissions Office', email: 'admissions@bmu.edu.ng', phone: '+234 803 123 4567' },
    { name: 'Student Affairs', email: 'studentaffairs@bmu.edu.ng', phone: '+234 803 123 4568' },
    { name: 'Research & Innovation', email: 'research@bmu.edu.ng', phone: '+234 803 123 4569' },
    { name: 'International Relations', email: 'international@bmu.edu.ng', phone: '+234 803 123 4570' },
    { name: 'Human Resources', email: 'hr@bmu.edu.ng', phone: '+234 803 123 4571' },
    { name: 'Public Relations', email: 'pro@bmu.edu.ng', phone: '+234 803 123 4572' },
    { name: 'Webmaster', email: 'webmaster@bmu.edu.ng', phone: '+234 803 123 4573' },
  ];
  const departmentContacts = (sections?.find(s => s.section_key === 'department_contacts')?.data as any[] || fallbackDepartments);

  const mapData = sections?.find(s => s.section_key === 'map_coords')?.data as any[] | undefined;
  const mapCenter: [number, number] = mapData?.[0]?.lat && mapData?.[0]?.lng
    ? [Number(mapData[0].lat), Number(mapData[0].lng)]
    : DEFAULT_COORDS;

  return (
    <>
      <Helmet>
        <title>Contact Us | Bayelsa Medical University</title>
        <meta name="description" content="Get in touch with Bayelsa Medical University. Find our campus location, phone numbers, email addresses, and office hours." />
      </Helmet>

      {/* Hero - pt-[140px] to clear fixed navbar */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/about" className="hover:text-white transition">About</Link>
              <span>/</span>
              <span className="text-white font-medium">Contact Us</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Get in <span className="text-[#A51C30]">Touch</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              We would love to hear from you. Reach out for inquiries, admissions information, or partnership opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: '#A51C3020' }}>
                    <Icon className="w-6 h-6" style={{ color: '#A51C30' }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  {item.details.map((line, i) => (
                    <p key={i} className="text-gray-600 text-sm">{line}</p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#A51C30' }} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We will get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="admissions">Admissions Inquiry</option>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="research">Research Collaboration</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:border-transparent resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-3 px-6 font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#A51C30' }}
                  >
                    {submitMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {submitMutation.isPending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Department Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Contacts</h2>
              <div className="space-y-4">
                {departmentContacts.map((dept) => (
                  <div
                    key={dept.name}
                    className="p-4 border border-gray-200 hover:border-[#A51C30] transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">{dept.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" style={{ color: '#A51C30' }} />
                        {dept.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" style={{ color: '#A51C30' }} />
                        {dept.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Us</h2>
          <div className="relative z-0 isolate aspect-video overflow-hidden border border-gray-200" style={{ minHeight: '400px' }}>
            <MapContainer
              center={mapCenter}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter}>
                <Popup>
                  Bayelsa Medical University<br />
                  {contactInfo[0].details.join(', ')}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Permanent Site, Yenagoa-Amasoma Road, Yenagoa, Bayelsa State, Nigeria
          </p>
        </div>
      </section>
    </>
  );
};
