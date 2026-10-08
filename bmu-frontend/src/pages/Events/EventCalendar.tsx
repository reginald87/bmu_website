import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 ChevronLeft,
 ChevronRight,
 Calendar,
 Clock,
 MapPin,
 ChevronRight as ArrowRight
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface CalendarEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  color: string;
}

const fallbackEvents = [
 {
 id: 1,
 slug: 'international-medical-conference-2024',
 title: 'International Medical Conference 2024',
 date: '2024-12-10',
 time: '9:00 AM - 5:00 PM',
 location: 'BMU Main Auditorium',
 category: 'Academic',
 color: '#1E1E1E'
 },
 {
 id: 2,
 slug: 'matriculation-ceremony-2024',
 title: 'Matriculation Ceremony',
 date: '2024-11-25',
 time: '10:00 AM - 1:00 PM',
 location: 'Convocation Arena',
 category: 'Academic',
 color: '#A51C30'
 },
 {
 id: 3,
 slug: 'medical-research-symposium',
 title: 'Medical Research Symposium',
 date: '2024-12-05',
 time: '2:00 PM - 6:00 PM',
 location: 'Research Center',
 category: 'Research',
 color: '#A51C30'
 },
 {
 id: 4,
 slug: 'healthcare-leadership-workshop',
 title: 'Healthcare Leadership Workshop',
 date: '2024-12-15',
 time: '9:00 AM - 4:00 PM',
 location: 'College of Health Sciences',
 category: 'Professional',
 color: '#1E1E1E'
 },
 {
 id: 5,
 slug: 'community-health-outreach',
 title: 'Community Health Outreach',
 date: '2024-11-30',
 time: '8:00 AM - 4:00 PM',
 location: 'Community Centers',
 category: 'Community',
 color: '#A51C30'
 },
 {
 id: 6,
 slug: 'alumni-homecoming-2024',
 title: 'Alumni Homecoming 2024',
 date: '2024-12-20',
 time: '5:00 PM - 11:00 PM',
 location: 'University Grand Hall',
 category: 'Alumni',
 color: '#A51C30'
 }
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const EventCalendar = () => {
 const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<{ date: string; events: CalendarEvent[] } | null>(null);

   const { data: events } = useQuery<CalendarEvent[]>({
   queryKey: ['events'],
   queryFn: async () => {
    try {
     const response = await apiClient.get('/public/events/');
     const items = response.data?.items || response.data;
     if (Array.isArray(items) && items.length > 0) {
       return items.map((item: Record<string, unknown>) => ({
         id: item.id as number,
         slug: item.slug as string,
         title: item.title as string,
         date: (item.event_date as string || '').split('T')[0],
         time: [item.start_time, item.end_time].filter(Boolean).join(' - ') || 'All day',
         location: (item.location || '') as string,
         category: (item.category_display || item.category || 'General') as string,
         color: item.category === 'academic' || item.category === 'Academic' ? '#1E1E1E' : '#A51C30',
       }));
     }
     return fallbackEvents;
    } catch {
     return fallbackEvents;
    }
   },
   initialData: fallbackEvents,
  });

 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();

 // Get first day of month
 const firstDay = new Date(year, month, 1).getDay();
 // Get number of days in month
 const daysInMonth = new Date(year, month + 1, 0).getDate();
 // Get days from previous month
 const prevMonthDays = new Date(year, month, 0).getDate();

 // Generate calendar days
 const calendarDays: Array<{ day: number; type: 'prev' | 'current' | 'next'; date?: string }> = [];

 // Previous month days
 for (let i = firstDay - 1; i >= 0; i--) {
  calendarDays.push({ day: prevMonthDays - i, type: 'prev' });
 }

 // Current month days
 for (let i = 1; i <= daysInMonth; i++) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
  calendarDays.push({ day: i, type: 'current', date: dateStr });
 }

 // Next month days to fill grid
 const remainingCells = 42 - calendarDays.length;
 for (let i = 1; i <= remainingCells; i++) {
  calendarDays.push({ day: i, type: 'next' });
 }

 const prevMonth = () => {
  setCurrentDate(new Date(year, month - 1, 1));
  setSelectedEvent(null);
 };

 const nextMonth = () => {
  setCurrentDate(new Date(year, month + 1, 1));
  setSelectedEvent(null);
 };

  const getEventsForDate = (dateStr: string) => {
   return (events || []).filter(event => event.date === dateStr);
  };

 const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
 ];

 return (
  <><Helmet><title>Event Calendar | Bayelsa Medical University</title><meta name="description"content="View all upcoming events at Bayelsa Medical University in calendar format."/></Helmet><div className="min-h-screen bg-gray-50">
  {/* Hero */}
  <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}><div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="hover:text-white transition">Home</Link><span>/</span><Link to="/events" className="hover:text-white transition">Events</Link><span>/</span><span className="text-white font-medium">Calendar</span></div><h1 className="text-display text-white mb-6">
  Event <span className="text-[#A51C30]">Calendar</span></h1><p className="text-lead text-white/80 max-w-2xl">
  View all events in calendar format and plan your schedule.
  </p></motion.div></div></section>

  {/* Calendar */}
  <div className="container-custom py-12"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* Calendar Grid */}
  <div className="lg:col-span-2"><div className="bg-white shadow-sm p-6">
  {/* Calendar Header */}
  <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">
  {monthNames[month]} {year}
  </h2><div className="flex gap-2"><button
  onClick={prevMonth} aria-label="Previous month"
  className="p-2 hover:bg-gray-100 transition"><ChevronLeft className="w-5 h-5"/></button><button
  onClick={() => setCurrentDate(new Date())}
  className="px-4 py-2 text-sm font-medium text-[#1E1E1E] hover:bg-[#1E1E1E]/10 transition">
  Today
  </button><button
  onClick={nextMonth} aria-label="Next month"
  className="p-2 hover:bg-gray-100 transition"><ChevronRight className="w-5 h-5"/></button></div></div>

  {/* Days of Week */}
  <div className="grid grid-cols-7 gap-2 mb-2">
  {daysOfWeek.map(day => (
  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
  {day}
  </div>
  ))}
  </div>

  {/* Calendar Days */}
  <div className="grid grid-cols-7 gap-2">
  {calendarDays.map((dayInfo, index) => {
  const dayEvents = dayInfo.date ? getEventsForDate(dayInfo.date) : [];
  const hasEvents = dayEvents.length > 0;
  const isSelected = selectedEvent && dayInfo.date === selectedEvent.date;

  return (
  <button
  key={index}
  onClick={() => hasEvents && dayInfo.date && setSelectedEvent({ date: dayInfo.date, events: dayEvents })}
  className={`
  aspect-square p-2 text-left transition relative
  ${dayInfo.type === 'current' ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
  ${isSelected ? 'ring-2 ring-[#1E1E1E]' : ''}
  ${hasEvents ? 'cursor-pointer' : 'cursor-default'}
  `}
  ><span className={`text-sm font-medium ${dayInfo.type === 'current' ? 'text-gray-900' : ''}`}>
  {dayInfo.day}
  </span>
  {hasEvents && (
  <div className="absolute bottom-1 left-1 right-1 flex gap-0.5">
  {dayEvents.slice(0, 3).map((evt, i) => (
  <div
  key={i}
  className="h-1 flex-1" style={{ backgroundColor: evt.color }}
  />
  ))}
  </div>
  )}
  </button>
  );
  })}
  </div>

  {/* Legend */}
  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
  {['Academic', 'Research', 'Community', 'Professional', 'Alumni'].map((cat) => (
  <div key={cat} className="flex items-center gap-2"><div
  className="w-3 h-3" style={{
  backgroundColor: cat === 'Academic' ? '#1E1E1E' :
  cat === 'Research' ? '#A51C30' :
  cat === 'Community' ? '#A51C30' :
  cat === 'Professional' ? '#1E1E1E' : '#A51C30'
  }}
  /><span className="text-sm text-gray-600">{cat}</span></div>
  ))}
  </div></div></div>

  {/* Event List */}
  <div><div className="bg-white shadow-sm p-6"><h3 className="text-lg font-bold text-gray-900 mb-4">
  {selectedEvent ? `Events on ${selectedEvent.date}` : 'Upcoming Events'}
  </h3><div className="space-y-4">
   {(selectedEvent?.events || events?.slice(0, 5) || []).map((event: CalendarEvent) => (
  <Link
  key={event.id}
  to={`/events/${event.slug}`}
  className="block p-4 hover:bg-gray-50 transition group"><div className="flex items-start gap-3"><div
  className="w-2 h-2 mt-2 flex-shrink-0" style={{ backgroundColor: event.color || '#1E1E1E' }}
  /><div className="flex-1"><h4 className="font-medium text-gray-900 group-hover:text-[#1E1E1E] transition line-clamp-2">
  {event.title}
  </h4><div className="mt-2 space-y-1 text-sm text-gray-500"><div className="flex items-center gap-1"><Calendar className="w-3 h-3"/>
  {event.date}
  </div><div className="flex items-center gap-1"><Clock className="w-3 h-3"/>
  {event.time}
  </div><div className="flex items-center gap-1"><MapPin className="w-3 h-3"/>
  {event.location}
  </div></div></div><ArrowRight className="w-5 h-5 text-gray-300 self-center group-hover:text-[#1E1E1E] transition"/></div></Link>
  ))}
  </div><Link
  to="/events" className="block mt-6 text-center text-[#1E1E1E] font-medium hover:underline">
  View All Events
  </Link></div></div></div></div></div></>
 );
};