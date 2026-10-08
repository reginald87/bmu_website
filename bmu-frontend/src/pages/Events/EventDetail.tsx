import { useState, useEffect, useMemo } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  Share2,
  Printer,
  Link as LinkIcon,
  CheckCircle,
  Mail,
  Phone,
  Bookmark,
  Download,
  CreditCard
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { EventRegistrationModal } from '../../components/events/EventRegistrationModal';

interface EventOrganizer {
  name: string;
  email: string;
  phone: string;
}

interface AgendaItem {
  time: string;
  activity: string;
}

interface EventSpeaker {
  name: string;
  role: string;
  topic: string;
}

interface EventDetailData {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  endDate?: string;
  location: string;
  venue: string;
  type?: string;
  category: string;
  featured?: boolean;
  image?: string;
  attendees?: number;
  maxAttendees?: number;
  registrationOpen: boolean;
  registrationDeadline?: string;
  price?: string;
  fee?: number | null;
  organizer: EventOrganizer;
  agenda?: AgendaItem[];
  speakers?: EventSpeaker[];
  tags: string[];
  relatedEvents?: number[];
}

const fallbackEvents: Record<string, EventDetailData> = {
 'international-medical-conference-2024': {
 id: 1,
 slug: 'international-medical-conference-2024',
 title: 'International Medical Conference 2024',
 description: 'Join over 500 healthcare professionals from 30 countries discussing emerging infectious diseases, global health security, and the latest medical research.',
 longDescription: `
 <p class="lead">The 2024 International Medical Conference at Bayelsa Medical University brings together healthcare professionals, researchers, and policymakers from around the world to address the most pressing challenges in global health.</p><h2>Conference Theme</h2><p>"One Health: Bridging Human, Animal, and Environmental Medicine for a Safer World"</p><h2>Keynote Speakers</h2><ul><li><strong>Dr. Sarah Chen</strong> - Director, WHO Africa Regional Office</li><li><strong>Prof. Michael Thompson</strong> - Johns Hopkins University</li><li><strong>Dr. Amina Ibrahim</strong> - Nigeria Centre for Disease Control</li><li><strong>Prof. Grace Ebieri</strong> - Dean, BMU College of Medicine</li></ul><h2>Conference Tracks</h2><ul><li>Infectious Disease Surveillance and Response</li><li>Tropical Medicine and Neglected Diseases</li><li>Healthcare Systems Strengthening</li><li>Digital Health and AI in Medicine</li><li>One Health Approach to Disease Prevention</li></ul><h2>Registration Information</h2><p>Early bird registration: ₦50,000 (until November 30)</p><p>Standard registration: ₦75,000</p><p>Student registration: ₦25,000</p><p>International participants: $200</p><h2>Contact</h2><p>For inquiries about the conference, please contact:</p><p>Email: conference2024@bmu.edu.ng</p><p>Phone: +234 803 111 0020</p>
 `,
 date: '2024-12-10',
 time: '9:00 AM - 5:00 PM',
 endDate: '2024-12-12',
 location: 'BMU Main Auditorium, Yenagoa',
 venue: 'Bayelsa Medical University Main Campus, Yenagoa, Bayelsa State',
 type: 'conference',
 category: 'Academic',
 featured: true,
 image: '/events/conference-2024.jpg',
 attendees: 500,
 maxAttendees: 600,
 registrationOpen: true,
 registrationDeadline: '2024-12-05',
 price: '₦50,000 - ₦75,000',
 organizer: {
 name: 'BMU Conference Committee',
 email: 'conference2024@bmu.edu.ng',
 phone: '+234 803 111 0020'
 },
 agenda: [
 { time: '8:00 AM', activity: 'Registration & Breakfast' },
 { time: '9:00 AM', activity: 'Opening Ceremony & Keynote Address' },
 { time: '10:30 AM', activity: 'Plenary Session: Global Health Security' },
 { time: '12:00 PM', activity: 'Lunch Break' },
 { time: '1:30 PM', activity: 'Parallel Sessions (5 tracks)' },
 { time: '4:00 PM', activity: 'Poster Presentations' },
 { time: '5:00 PM', activity: 'Networking Reception' }
 ],
 speakers: [
 { name: 'Dr. Sarah Chen', role: 'Director, WHO Africa', topic: 'Pandemic Preparedness' },
 { name: 'Prof. Michael Thompson', role: 'Johns Hopkins', topic: 'AI in Healthcare' },
 { name: 'Dr. Amina Ibrahim', role: 'NCDC', topic: 'Disease Surveillance' }
 ],
 tags: ['Conference', 'Healthcare', 'International', 'Research'],
 relatedEvents: [2, 3, 4]
 },
 'matriculation-ceremony-2024': {
 id: 2,
 slug: 'matriculation-ceremony-2024',
 title: '2024/2025 Matriculation Ceremony',
 description: 'Official welcome ceremony for new students entering the 2024/2025 academic session.',
 longDescription: `
 <p class="lead">The Matriculation Ceremony marks the formal admission of new students into Bayelsa Medical University.</p><h2>Ceremony Details</h2><p>All newly admitted students are required to attend this important ceremony where they will take the matriculation oath and officially become members of the university community.</p><h2>Requirements</h2><ul><li>Matriculation gown (available at the bookstore)</li><li>Student ID card</li><li>Admission letter</li><li>Completed medical screening</li></ul><h2>For Parents</h2><p>Parents and guardians are welcome to attend. Seating is available on a first-come, first-served basis. Please arrive at least 30 minutes early.</p>
 `,
 date: '2024-11-25',
 time: '10:00 AM - 1:00 PM',
 location: 'University Convocation Arena',
 venue: 'BMU Convocation Arena',
 type: 'ceremony',
 category: 'Academic',
 featured: false,
 image: '/events/matriculation.jpg',
 attendees: 2000,
 registrationOpen: true,
 price: 'Free',
 organizer: {
 name: 'Registrar\'s Office',
 email: 'registrar@bmu.edu.ng',
 phone: '+234 803 111 0010'
 },
 agenda: [
 { time: '9:30 AM', activity: 'Procession & Seating' },
 { time: '10:00 AM', activity: 'National Anthem & Opening Prayer' },
 { time: '10:15 AM', activity: 'Vice Chancellor\'s Address' },
 { time: '10:45 AM', activity: 'Matriculation Oath' },
 { time: '11:30 AM', activity: 'Keynote Speech' },
 { time: '12:30 PM', activity: 'Closing & Photo Session' }
 ],
 speakers: [
 { name: 'Prof. Osahon Enabulele', role: 'Vice Chancellor', topic: 'Welcome Address' }
 ],
 tags: ['Matriculation', 'Students', 'Academic'],
 relatedEvents: [1, 5]
 }
};

const relatedEventsData = [
 {
 id: 3,
 slug: 'medical-research-symposium',
 title: 'Medical Research Symposium',
 date: '2024-12-05',
 category: 'Research'
 },
 {
 id: 4,
 slug: 'healthcare-leadership-workshop',
 title: 'Healthcare Leadership Workshop',
 date: '2024-12-15',
 category: 'Professional'
 },
 {
 id: 5,
 slug: 'community-health-outreach',
 title: 'Community Health Outreach',
 date: '2024-11-30',
 category: 'Community'
 }
];

export const EventDetail = () => {
 const { slug } = useParams();
 const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const { data: eventsData, isLoading, isError } = useQuery<Record<string, EventDetailData> | EventDetailData[]>({
  queryKey: ['events'],
  queryFn: async () => {
   try {
     const response = await apiClient.get('/public/events');
    const data = response.data?.items || response.data;
    if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
     return data;
    }
   } catch {
     // fall back to mock data on error
   }
   return fallbackEvents;
  },
  });

  const event = useMemo<EventDetailData | null>(() => {
  if (!slug || !eventsData) return null;
  if (Array.isArray(eventsData)) {
   return eventsData.find((e) => e.slug === slug) || null;
  }
  return eventsData[slug] || null;
  }, [slug, eventsData]);

 useEffect(() => {
 window.scrollTo(0, 0);
 }, [slug]);

 const handleShare = (platform: string) => {
 const url = window.location.href;
 const text = event?.title || 'Check out this event at BMU';

 switch (platform) {
  case 'facebook':
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  break;
  case 'twitter':
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  break;
  case 'linkedin':
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  break;
  case 'copy':
  navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
  break;
 }
 setShowShareMenu(false);
 };

 const handlePrint = () => {
 window.print();
 };

  if (isLoading) {
 return (
  <><Helmet><title>Loading Event | Bayelsa Medical University</title></Helmet><div className="min-h-screen bg-gray-50"><div className="container-custom py-16"><div className="max-w-2xl mx-auto text-center"><div className="w-16 h-16 border-4 border-gray-200 border-t-[#1E1E1E] rounded-full animate-spin mx-auto mb-4"/><h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Event</h1><p className="text-gray-600">Please wait while we fetch the event details...</p></div></div></div></>
 );
 }

 if (isError) {
 return (
  <><Helmet><title>Error | Bayelsa Medical University</title></Helmet><div className="min-h-screen bg-gray-50"><div className="container-custom py-16"><div className="max-w-2xl mx-auto text-center"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Event</h1><p className="text-gray-600 mb-6">An error occurred while fetching the event. Please try again later.</p><Link
  to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"><ChevronLeft className="w-5 h-5"/>
  Back to Events
  </Link></div></div></div></>
 );
 }

 if (!event) {
 return (
  <><Helmet><title>Event Not Found | Bayelsa Medical University</title></Helmet><div className="min-h-screen bg-gray-50"><div className="container-custom py-16"><div className="max-w-2xl mx-auto text-center"><Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1><p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p><Link
  to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"><ChevronLeft className="w-5 h-5"/>
  Back to Events
  </Link></div></div></div></>
 );
 }

 return (
 <><Helmet><title>{event.title} | Bayelsa Medical University</title><meta name="description"content={event.description} /></Helmet><div className="min-h-screen bg-gray-50">
 {/* Navigation Bar */}
 <div className="bg-white border-b sticky top-[140px] z-20"><div className="container-custom py-4"><div className="flex items-center justify-between"><button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-gray-600 text-[#1E1E1E] transition"><ChevronLeft className="w-5 h-5"/><span className="hidden sm:inline">Back to Events</span></button><div className="flex items-center gap-2"><div className="relative"><button
  onClick={() => setShowShareMenu(!showShareMenu)}
  className="p-2 bg-gray-100 transition"><Share2 className="w-5 h-5 text-gray-600"/></button>
  {showShareMenu && (
  <div className="absolute right-0 top-full mt-2 w-48 bg-white border py-2 z-50"><button onClick={() => handleShare('facebook')} className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-blue-600 font-bold">f</span> Facebook
  </button><button onClick={() => handleShare('twitter')} className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-sky-500 font-bold">X</span> Twitter
  </button><button onClick={() => handleShare('linkedin')} className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-blue-700 font-bold">in</span> LinkedIn
  </button><button onClick={() => handleShare('copy')} className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition">
  {copied ? <CheckCircle className="w-5 h-5 text-green-600"/> : <LinkIcon className="w-5 h-5 text-gray-600"/>}
  {copied ? 'Copied!' : 'Copy Link'}
  </button></div>
  )}
  </div><button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2 bg-gray-100 transition"><Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#1E1E1E] fill-[#1E1E1E]' : 'text-gray-600'}`} /></button><button onClick={handlePrint} className="p-2 bg-gray-100 transition"><Printer className="w-5 h-5 text-gray-600"/></button></div></div></div></div>

 {/* Hero */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: '#1E1E1E' }}><div className="absolute inset-0 opacity-5" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} /><div className="container-custom relative z-10"><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}><div className="flex items-center gap-2 text-white/60 text-sm mb-6"><Link to="/" className="text-white transition">Home</Link><span>/</span><Link to="/events" className="text-white transition">Events</Link><span>/</span><span className="text-white font-medium">Event Details</span></div><div className="flex items-center gap-3 mb-6"><span className="px-3 py-1 text-sm font-medium bg-white/20">
  {event.category}
  </span>
  {event.registrationOpen && (
  <span className="px-3 py-1 text-sm font-medium bg-green-400 text-green-900">
  Registration Open
  </span>
  )}
  </div><h1 className="text-display text-white mb-6">
  {event.title}
  </h1><p className="text-lead text-white/80 max-w-3xl">
  {event.description}
  </p></motion.div></div></section>

 {/* Main Content */}
 <div className="container-custom py-12"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Left Column - Event Details */}
 <div className="lg:col-span-2 space-y-8">
 {/* Event Info Cards */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="grid sm:grid-cols-2 gap-4"><div className="bg-white p-6 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-[#1E1E1E]/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-[#1E1E1E]"/></div><span className="text-sm text-gray-500">Date</span></div><p className="font-semibold text-gray-900">{event.date}</p>
  {event.endDate && <p className="text-sm text-gray-500">to {event.endDate}</p>}
  </div><div className="bg-white p-6 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-[#A51C30]/10 flex items-center justify-center"><Clock className="w-5 h-5 text-[#A51C30]"/></div><span className="text-sm text-gray-500">Time</span></div><p className="font-semibold text-gray-900">{event.time}</p></div><div className="bg-white p-6 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-[#A51C30]/20 flex items-center justify-center"><MapPin className="w-5 h-5 text-[#1E1E1E]"/></div><span className="text-sm text-gray-500">Location</span></div><p className="font-semibold text-gray-900">{event.location}</p><p className="text-sm text-gray-500">{event.venue}</p></div><div className="bg-white p-6 shadow-sm"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600"/></div><span className="text-sm text-gray-500">Attendees</span></div><p className="font-semibold text-gray-900">{event.attendees} registered</p>
  {event.maxAttendees && <p className="text-sm text-gray-500">Max: {event.maxAttendees}</p>}
  </div></motion.div>

 {/* Description */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2><div
  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-[#1E1E1E] prose-strong:text-gray-900 prose-ul:text-gray-700"dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.longDescription) }}
  /></motion.div>

 {/* Agenda */}
 {event.agenda && (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold text-gray-900 mb-6">Event Agenda</h2><div className="space-y-4">
   {event.agenda.map((item: AgendaItem, index: number) => (
  <div key={index} className="flex gap-4"><div className="w-24 flex-shrink-0 text-sm font-medium text-[#1E1E1E]">
  {item.time}
  </div><div className="flex-1 pb-4 border-b last:border-0"><p className="font-medium text-gray-900">{item.activity}</p></div></div>
  ))}
  </div></motion.div>
 )}

 {/* Speakers */}
 {event.speakers && (
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2><div className="grid sm:grid-cols-2 gap-6">
   {event.speakers.map((speaker: EventSpeaker, index: number) => (
  <div key={index} className="flex items-start gap-4"><div className="w-16 h-16 bg-gray-200 flex items-center justify-center"><Users className="w-8 h-8 text-gray-400"/></div><div><h3 className="font-bold text-gray-900">{speaker.name}</h3><p className="text-[#1E1E1E] text-sm">{speaker.role}</p><p className="text-gray-600 text-sm mt-1">{speaker.topic}</p></div></div>
  ))}
  </div></motion.div>
 )}
  </div>

  {/* Right Column - Registration & Info */}
  <div className="space-y-6">
  {/* Registration Card */}
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   className="bg-white p-6 shadow-sm sticky top-24"><h3 className="text-xl font-bold text-gray-900 mb-4">Register for this Event</h3>
 
    {event.fee || event.price ? (
    <div className="mb-4"><span className="text-sm text-gray-500">Registration Fee</span><div className="flex items-center gap-2 mt-1"><CreditCard className="w-5 h-5 text-[#1E1E1E]"/><p className="text-2xl font-bold text-[#1E1E1E]">{event.fee != null ? `₦${Number(event.fee).toLocaleString()}` : event.price}</p></div></div>
    ) : null}

   {event.registrationOpen ? (
    <><button
    onClick={() => setShowRegistrationModal(true)}
    className="w-full py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition mb-4">
    {(event.fee != null && event.fee > 0) || (event.price && event.price !== 'Free') ? 'Register & Pay Now' : 'Register Now'}
    </button></>
   ) : (
   <div className="p-4 bg-gray-100"><p className="text-gray-600 font-medium">Registration Closed</p><p className="text-sm text-gray-500 mt-1">This event is no longer accepting registrations.</p></div>
   )}
  </motion.div>

 {/* Organizer Info */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4">Organizer</h3><p className="font-medium text-[#1E1E1E]">{event.organizer.name}</p><div className="mt-4 space-y-2 text-sm"><a href={`mailto:${event.organizer.email}`} className="flex items-center gap-2 text-gray-600 text-[#1E1E1E] transition"><Mail className="w-4 h-4"/> {event.organizer.email}
  </a><a href={`tel:${event.organizer.phone}`} className="flex items-center gap-2 text-gray-600 text-[#1E1E1E] transition"><Phone className="w-4 h-4"/> {event.organizer.phone}
  </a></div></motion.div>

 {/* Add to Calendar */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4">Add to Calendar</h3><button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 bg-gray-50 transition"><Download className="w-5 h-5"/>
  Download .ics File
  </button></motion.div>

 {/* Tags */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4">Tags</h3><div className="flex flex-wrap gap-2">
  {event.tags.map((tag: string) => (
  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm">
  #{tag}
  </span>
  ))}
  </div></motion.div></div></div>

 {/* Related Events */}
 <section className="mt-16"><h2 className="text-2xl font-bold text-gray-900 mb-8">Related Events</h2><div className="grid md:grid-cols-3 gap-8">
  {relatedEventsData.slice(0, 3).map((evt) => (
  <Link
  key={evt.id}
  to={`/events/${evt.slug}`}
  className="bg-white overflow-hidden shadow-sm transition group"><div className="bg-gray-200 h-48 flex items-center justify-center"><Calendar className="w-12 h-12 text-gray-400"/></div><div className="p-6"><span className="text-xs text-[#A51C30] font-medium">{evt.category}</span><h3 className="font-bold text-[#1E1E1E] mt-2 mb-2 group- text-[#A51C30] transition line-clamp-2">
  {evt.title}
  </h3><p className="text-sm text-[#1E1E1E]/50">{evt.date}</p></div></Link>
  ))}
  </div></section></div></div>

      {showRegistrationModal && (
        <EventRegistrationModal
          event={{
            id: event.id,
            slug: event.slug,
            title: event.title,
            description: event.description,
            event_date: event.date,
            start_time: event.time,
            end_time: event.endDate ?? null,
            event_type: event.type || 'other',
            event_type_display: event.type || '',
            category: event.category,
            category_display: event.category,
            location: event.venue || event.location,
            featured_image: event.image || null,
            registration_open: event.registrationOpen,
            registered_count: event.attendees ?? 0,
            max_attendees: event.maxAttendees ?? null,
            is_featured: event.featured ?? false,
            fee: event.fee || (event.price ? parseNumericFee(event.price) : null),
            currency: 'NGN',
          }}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}
    </>
  );
};

/** Extract a numeric fee from a price string like "₦50,000 - ₦75,000" */
function parseNumericFee(price: string): number | null {
  const match = price.replace(/,/g, '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
