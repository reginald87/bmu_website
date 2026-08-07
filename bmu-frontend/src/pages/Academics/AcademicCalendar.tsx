import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, Bell, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { useAcademicCalendar, useDeadlines } from '../../services/apiHooks';
import type { AcademicEventData } from '../../services/mockData';

const deadlineIconMap: Record<string, React.ElementType> = {
  BookOpen, Clock, Calendar, GraduationCap, Bell, AlertCircle,
};

const getEventColor = (type: string) => {
 switch (type) {
 case 'academic': return 'bg-blue-100 text-blue-700';
 case 'resumption': return 'bg-green-100 text-green-700';
 case 'exam':
 case 'examination': return 'bg-red-100 text-red-700';
 case 'holiday': return 'bg-yellow-100 text-yellow-700';
 case 'ceremony': return 'bg-purple-100 text-purple-700';
 default: return 'bg-gray-100 text-gray-700';
 }
};

const formatDate = (start: string, end: string | null) => {
 const startDate = new Date(start);
 const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
 if (!end) return startDate.toLocaleDateString('en-US', opts);
 const endDate = new Date(end);
 const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
 const endFormatted = endDate.toLocaleDateString('en-US', opts);
 return `${startFormatted} - ${endFormatted}`;
};

export const AcademicCalendar = () => {
  const { data: events, isLoading } = useAcademicCalendar();
  const { data: deadlines } = useDeadlines();

  const academicYear = events?.[0]?.academic_year ?? '2024/2025';

 const groupedEvents = (events ?? []).reduce<Record<string, AcademicEventData[]>>((acc, event) => {
 const group = event.term_display ?? 'Other Dates';
 if (!acc[group]) acc[group] = [];
 acc[group].push(event);
 return acc;
 }, {});

 return (
 <>
 <Helmet>
 <title>Academic Calendar | Bayelsa Medical University</title>
 <meta name="description" content="View the academic calendar for Bayelsa Medical University. Important dates for registration, examinations, holidays, and academic deadlines for the 2024/2025 session." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/" className="hover:text-white transition">Home</Link>
 <span>/</span>
 <Link to="/academics" className="hover:text-white transition">Academics</Link>
 <span>/</span>
 <span className="text-white font-medium">Academic Calendar</span>
 </div>
 <h1 className="text-display text-white mb-6">
 Academic <span className="text-[#A51C30]">Calendar</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Academic Year {academicYear} - Important dates, deadlines, and events for the session.
 </p>
 </motion.div>
 </div>
 </section>

 {/* Important Deadlines Alert */}
 <section className="py-8" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="bg-[#A51C30]/10 border border-[#A51C30]/20 p-6">
 <div className="flex items-start gap-4">
 <AlertCircle className="w-6 h-6 text-[#A51C30] flex-shrink-0 mt-1" />
 <div>
 <h3 className="font-semibold text-[#A51C30] mb-2">Important Notice</h3>
 <p className="text-gray-700">
 All students are advised to adhere strictly to registration and payment deadlines. 
 Late registration attracts a penalty fee. Academic activities proceed as scheduled 
 regardless of public holidays falling within the semester.
 </p>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Term Dates */}
 <section className="py-16">
 <div className="container-custom">
 {isLoading ? (
 <div className="flex items-center justify-center min-h-[300px]">
 <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {Object.entries(groupedEvents).map(([termName, termEvents], index) => (
 <motion.div
 key={termName}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white shadow-sm border border-gray-100 overflow-hidden"
 >
 <div className="p-6 border-b border-gray-100" style={{ backgroundColor: '#1E1E1E' }}>
 <h2 className="text-title text-white">{termName}</h2>
 </div>
 <div className="p-6">
 <div className="space-y-4">
 {termEvents.map((event) => (
 <div key={event.id} className="flex items-start gap-3">
 <span className={`px-2 py-1 text-xs font-medium flex-shrink-0 ${getEventColor(event.event_type)}`}>
 {event.event_type_display}
 </span>
 <div>
 <p className="font-medium text-gray-900 text-sm">{event.title}</p>
 <p className="text-small text-gray-500">{formatDate(event.start_date, event.end_date)}</p>
 {event.description && (
 <p className="text-xs text-gray-400 mt-1">{event.description}</p>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </section>

  {/* Important Deadlines */}
  <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="container-custom">
  <h2 className="text-headline text-gray-900 mb-8 text-center">Key Deadlines</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
  {(deadlines ?? []).map((item) => {
  const Icon = deadlineIconMap[item.icon_name] || Calendar;
  return (
  <motion.div
  key={item.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="bg-white p-6 shadow-sm border border-gray-100 flex items-start gap-4"
  >
  <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
  <Icon className="w-6 h-6 text-[#A51C30]" />
  </div>
  <div>
  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
  <p className="text-small text-gray-600">{item.deadline}</p>
  </div>
  </motion.div>
  );
  })}
 </div>
 </div>
 </section>

  {/* Download Section */}
  <section className="py-16" style={{ backgroundColor: '#1E1E1E' }}>
  <div className="container-custom text-center">
  <h2 className="text-headline text-white mb-4">Download Calendar</h2>
  <p className="text-lead text-white/80 max-w-2xl mx-auto mb-8">
  Download the complete academic calendar in PDF format for offline reference.
  </p>
  <div className="flex flex-wrap justify-center gap-4">
  <button
  onClick={() => window.open(`/api/v1/academics/calendar/download/?academic_year=${academicYear}`, '_blank')}
  className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition flex items-center gap-2"
  >
  <Calendar className="w-5 h-5" />
  Download PDF Calendar
  </button>
  </div>
  </div>
  </section>
 </>
 );
};
