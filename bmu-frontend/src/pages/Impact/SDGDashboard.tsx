import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  HeartPulse,
  GraduationCap,
  Users,
  Handshake,
  ArrowRight,
  TrendingUp,
  MapPin,
  Download,
  Info,
  FileText,
  ExternalLink,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSDGMetrics, useSDGs, usePublicDocuments } from '../../services/apiHooks';
import type { SDGMetric } from '../../services/mockData';

// Recharts imports for data visualization
import { 
 LineChart, 
 Line, 
 BarChart, 
 Bar, 
 XAxis, 
 YAxis, 
 CartesianGrid, 
 Tooltip, 
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
 Legend
} from 'recharts';

const overallProgress = [
 { label: 'Overall SDG Progress', value: 72, target: 100 },
 { label: 'Active Projects', value: 45, target: 60 },
 { label: 'Community Engagement', value: 85, target: 100 },
 { label: 'Research Publications', value: 68, target: 100 }
];

// Chart data for SDG 3 - Health
const monthlyOutreachData = [
 { month: 'Jan', patients: 850, campaigns: 3 },
 { month: 'Feb', patients: 920, campaigns: 4 },
 { month: 'Mar', patients: 1100, campaigns: 5 },
 { month: 'Apr', patients: 980, campaigns: 3 },
 { month: 'May', patients: 1250, campaigns: 6 },
 { month: 'Jun', patients: 1400, campaigns: 5 },
 { month: 'Jul', patients: 1350, campaigns: 4 },
 { month: 'Aug', patients: 1500, campaigns: 6 },
 { month: 'Sep', patients: 1600, campaigns: 5 },
 { month: 'Oct', patients: 1550, campaigns: 5 },
 { month: 'Nov', patients: 1700, campaigns: 6 },
 { month: 'Dec', patients: 1800, campaigns: 7 },
];

const diseaseBreakdown = [
  { name: 'Malaria', value: 52, color: '#ef4444' },
  { name: 'Hypertension', value: 48, color: '#f59e0b' },
  { name: 'Tuberculosis', value: 46, color: '#10b981' },
  { name: 'Other Respiratory', value: 46, color: '#059669' },
  { name: 'Diabetes', value: 39, color: '#3b82f6' },
  { name: 'Parasitic Infections', value: 41, color: '#8b5cf6' },
  { name: 'Eye Conditions', value: 28, color: '#6366f1' },
];

// Chart data for SDG 4 - Education
const scholarshipData = [
 { year: '2020', awarded: 320, target: 400 },
 { year: '2021', awarded: 380, target: 450 },
 { year: '2022', awarded: 450, target: 500 },
 { year: '2023', awarded: 520, target: 550 },
 { year: '2024', awarded: 620, target: 650 },
];

const enrollmentData = [
 { program: 'MBBS', male: 280, female: 420 },
 { program: 'Nursing', male: 150, female: 550 },
 { program: 'Pharmacy', male: 200, female: 380 },
 { program: 'Public Health', male: 180, female: 320 },
];

// Chart data for SDG 5 - Gender Equality
const facultyGenderData = [
  { name: 'Female', value: 52, color: '#A51C30' },
  { name: 'Male', value: 48, color: '#1E1E1E' },
];

const studentGenderData = [
 { name: 'Female', value: 62, color: '#A51C30' },
 { name: 'Male', value: 38, color: '#1E1E1E' },
];

const leadershipGenderData = [
 { level: 'Deans', male: 6, female: 4 },
 { level: 'Heads of Dept', male: 18, female: 15 },
 { level: 'Senior Faculty', male: 25, female: 28 },
 { level: 'Non-Teaching Staff', male: 32, female: 70 },
];

// Chart data for SDG 17 - Partnerships for the Goals
const partnershipGrowthData = [
 { year: '2020', partnerships: 4, projects: 3 },
 { year: '2021', partnerships: 6, projects: 5 },
 { year: '2022', partnerships: 7, projects: 8 },
 { year: '2023', partnerships: 9, projects: 10 },
 { year: '2024', partnerships: 10, projects: 12 },
];

// Impact Map - Niger Delta Outreach Locations
const outreachLocations = [
  { name: "Yenagoa", patients: 300, campaigns: 1, coordinates: { x: 50, y: 45 } },
  { name: "Ogbia", patients: 180, campaigns: 1, coordinates: { x: 65, y: 40 } },
  { name: "Sagbama", patients: 180, campaigns: 1, coordinates: { x: 35, y: 55 } },
  { name: "Ekeremor", patients: 180, campaigns: 1, coordinates: { x: 25, y: 70 } },
  { name: "Kolokuma/Opokuma", patients: 180, campaigns: 1, coordinates: { x: 55, y: 50 } },
  { name: "Southern Ijaw", patients: 180, campaigns: 1, coordinates: { x: 40, y: 75 } },
  { name: "Nembe", patients: 180, campaigns: 1, coordinates: { x: 75, y: 35 } },
  { name: "Brass", patients: 180, campaigns: 1, coordinates: { x: 85, y: 30 } },
];

// Impact Stories
const impactStories = [
  { title: "Free Medical Outreach — ASPIRE Administration Anniversary", date: "Nov 15, 2024", location: "Yenagoa LGA", patients: 300 },
  { title: "Malaria Screening & Treatment Camp", date: "Nov 15, 2024", location: "Yenagoa Central", patients: 52 },
  { title: "Eye Health Initiative — Free Medicated Glasses", date: "Nov 15, 2024", location: "University Gate, Yenagoa", patients: 28 },
  { title: "Tuberculosis Early Detection & Chest X-ray Drive", date: "Nov 15, 2024", location: "Yenagoa LGA", patients: 46 },
];

// Live counter animation hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
 const [count, setCount] = useState(0);
 
 useEffect(() => {
 let startTime: number | null = null;
 const startValue = 0;
 
 const animate = (currentTime: number) => {
 if (!startTime) startTime = currentTime;
 const progress = Math.min((currentTime - startTime) / duration, 1);
 
 // Easing function for smooth animation
 const easeOutQuart = 1 - Math.pow(1 - progress, 4);
 const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);
 
 setCount(currentCount);
 
 if (progress < 1) {
 requestAnimationFrame(animate);
 }
 };
 
 requestAnimationFrame(animate);
 }, [end, duration]);
 
 return count;
};

// Impact Map Component
const ImpactMap = () => {
 const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
 
 return (
 <div className="bg-white shadow-sm p-6">
 <div className="relative aspect-[16/10] bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] overflow-hidden">
 {/* Bayelsa State simplified SVG map */}
 <svg viewBox="0 0 100 100" className="w-full h-full">
 {/* Water bodies */}
 <path d="M0,20 Q25,15 50,20 Q75,25 100,20 L100,100 L0,100 Z" fill="#a5d6a7" opacity="0.3" />
 <ellipse cx="30" cy="60" rx="15" ry="8" fill="#81c784" opacity="0.4" />
 <ellipse cx="70" cy="50" rx="12" ry="6" fill="#81c784" opacity="0.4" />
 
 {/* Bayelsa land area - simplified shape */}
 <path 
 d="M15,30 Q40,25 60,35 Q80,40 90,55 Q85,75 60,85 Q35,80 20,70 Q10,50 15,30" 
 fill="#4caf50" 
 opacity="0.2"
 />
 
 {/* Location markers */}
 {outreachLocations.map((location) => (
 <g key={location.name}>
 <circle
 cx={location.coordinates.x}
 cy={location.coordinates.y}
 r={hoveredLocation === location.name ? 8 : 5}
 fill="#1E1E1E"
 stroke="#A51C30"
 strokeWidth="2"
 className="cursor-pointer transition-all duration-300"
 onMouseEnter={() => setHoveredLocation(location.name)}
 onMouseLeave={() => setHoveredLocation(null)}
 />
 {/* Pulse animation ring */}
 <circle
 cx={location.coordinates.x}
 cy={location.coordinates.y}
 r="8"
 fill="none"
 stroke="#A51C30"
 strokeWidth="1"
 opacity={0.5}
 >
 <animate attributeName="r" from="8" to="15" dur="2s" repeatCount="indefinite" />
 <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
 </circle>
 </g>
 ))}
 </svg>
 
 {/* Tooltip */}
 {hoveredLocation && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="absolute bottom-4 left-4 bg-white p-4 z-10"
 >
 {(() => {
 const loc = outreachLocations.find(l => l.name === hoveredLocation);
 return loc ? (
 <>
 <h4 className="font-bold text-ink-900">{loc.name}</h4>
  <p className="text-sm text-gray-700">Patients treated: {loc.patients.toLocaleString()}</p>
  <p className="text-sm text-gray-700">Campaigns: {loc.campaigns}</p>
 </>
 ) : null;
 })()}
 </motion.div>
 )}
 
 {/* Map Legend */}
 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 shadow-sm">
 <div className="flex items-center gap-2 text-sm">
 <div className="w-3 h-3 bg-ink-900 border-2 border-primary-600" />
 <span className="text-gray-700">Outreach Locations</span>
 </div>
 </div>
 </div>
 
 {/* Location List */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
 {outreachLocations.map((location) => (
 <div 
 key={location.name}
  className="flex items-center gap-2 text-small text-gray-700"
 onMouseEnter={() => setHoveredLocation(location.name)}
 onMouseLeave={() => setHoveredLocation(null)}
 >
 <MapPin className="w-4 h-4 text-primary-600" />
 <span>{location.name}</span>
 </div>
 ))}
 </div>
 </div>
 );
};

const MetricCard = ({ metric, color }: { metric: SDGMetric; color: string }) => {
  const value = metric.current_value ?? metric.value ?? 0;
  const target = metric.target_value ?? metric.target ?? 1;
  const animatedValue = useAnimatedCounter(value, 2000);
  const isPercent = metric.unit === '%';
  const pct = Math.min(100, (value / (target || 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br p-6 text-center"
      style={{ background: `linear-gradient(135deg, ${color}10, ${color}20)` }}
    >
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {isPercent ? `${animatedValue}%` : animatedValue.toLocaleString()}
      </div>
      <div className="text-gray-800 text-sm">{metric.label}</div>
      {metric.unit !== '%' && (
        <div className="text-xs text-gray-500 mt-1">
          Target: {target.toLocaleString()} {metric.unit}
        </div>
      )}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2">
          <div className="h-2 transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </motion.div>
  );
};

export const SDGDashboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'sdg3' | 'sdg4' | 'sdg5' | 'sdg17'>('all');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  
  const { data: sdgData } = useSDGMetrics();
  const { data: sdgList } = useSDGs();
  const { data: impactReports } = usePublicDocuments('strategic');
 
 return (
 <>
 <Helmet>
 <title>SDG Impact Dashboard | Bayelsa Medical University</title>
 <meta name="description" content="Track BMU's real-time contributions to UN Sustainable Development Goals. Interactive dashboard with live metrics, charts, and impact data for THE Impact Rankings." />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
 <Link to="/impact" className="hover:text-white transition">Impact</Link>
 <span>/</span>
 <span className="text-white font-medium">SDG Dashboard</span>
 </div>
 <h1 className="text-display text-white mb-6">
 SDG <span className="text-primary-600">Impact Dashboard</span>
 </h1>
 <p className="text-lead text-white/80 max-w-2xl">
 Tracking Bayelsa Medical University's contribution to the UN 2030 Agenda for Sustainable Development
 </p>
 <div className="flex flex-wrap gap-2 mt-6">
 <span className="bg-white/20 px-3 py-1 text-sm text-white">SDG 3: Good Health</span>
 <span className="bg-white/20 px-3 py-1 text-sm text-white">SDG 4: Quality Education</span>
 <span className="bg-white/20 px-3 py-1 text-sm text-white">SDG 5: Gender Equality</span>
 <span className="bg-white/20 px-3 py-1 text-sm text-white">SDG 17: Partnerships</span>
 </div>
 </motion.div>
 </div>
 </section>

 {/* Overall Progress */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {overallProgress.map((item, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <div className="text-stat text-ink-900 mb-1">{item.value}%</div>
  <p className="text-gray-800 text-body">{item.label}</p>
  <p className="text-xs text-gray-500 mt-1">Target: {item.target}%</p>
 </motion.div>
 ))}
 </div>
  </div>
  </section>

  {/* SDG Contributions */}
  <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
  <div className="container-custom">
  <h2 className="text-headline text-gray-900 mb-8 text-center">Our SDG Contributions</h2>
  {(!sdgList || sdgList.length === 0) ? (
  <p className="text-center text-gray-500">Loading contributions…</p>
  ) : (
  <div className="space-y-10">
  {sdgList.map((sdg) => (
  <div key={sdg.id} className="border-b pb-6" style={{ borderColor: '#e5e4e7' }}>
  <div className="flex items-center gap-3 mb-4">
  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${sdg.color}20` }}>
  <span className="text-lg font-bold" style={{ color: sdg.color }}>SDG {sdg.number}</span>
  </div>
  <h3 className="text-title text-gray-900">{sdg.title}</h3>
  </div>
  <ul className="list-disc list-inside space-y-1 text-gray-700 text-body">
  {sdg.contributions.map((contribution, idx) => (
  <li key={idx}>{contribution}</li>
  ))}
  </ul>
  </div>
  ))}
  </div>
  )}
  </div>
  </section>

  {/* Interactive Map */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="text-center mb-8">
 <h2 className="text-headline text-gray-900 mb-3">Community Outreach Map</h2>
  <p className="text-lead text-gray-800">Niger Delta region - Health impact locations across Bayelsa State</p>
 </div>
 <ImpactMap />
 </div>
 </section>

 {/* SDG Tabs */}
 <section className="py-6 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="flex flex-wrap gap-2">
 {[
 { id: 'all', label: 'All Goals' },
 { id: 'sdg3', label: 'SDG 3: Health', color: '#4c9f38' },
 { id: 'sdg4', label: 'SDG 4: Education', color: '#c5192d' },
 { id: 'sdg5', label: 'SDG 5: Equality', color: '#ff3a21' },
 { id: 'sdg17', label: 'SDG 17: Partnerships', color: '#19486a' },
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as typeof activeTab)}
 className={`px-6 py-3 font-semibold transition-all ${
 activeTab === tab.id 
 ? 'bg-ink-900 text-white' 
  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* SDG 3 Panel - Health */}
 {(activeTab === 'all' || activeTab === 'sdg3') && (
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-12 h-12 bg-[#4c9f38]/10 flex items-center justify-center">
 <HeartPulse className="w-6 h-6 text-[#4c9f38]" />
 </div>
 <div>
 <span className="text-sm font-bold text-[#4c9f38]">SDG 3</span>
 <h2 className="text-headline text-gray-900">Good Health & Well-being</h2>
 </div>
 </div>

        {/* Live Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sdgData?.sdg3?.metrics?.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} color="#4c9f38" />
          ))}
        </div>

 {/* Charts Row */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Monthly Trends */}
 <div className="bg-white p-6 shadow-sm">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-title text-gray-900 flex items-center gap-2">
 <BarChart3 className="w-5 h-5 text-primary-600" />
 Monthly Outreach Trends
 </h3>
 <div className="flex gap-2">
 {(['month', 'quarter', 'year'] as const).map((range) => (
 <button
 key={range}
 onClick={() => setTimeRange(range)}
 className={`px-3 py-1 text-xs capitalize ${
  timeRange === range ? 'bg-ink-900 text-white' : 'bg-gray-100 text-gray-700'
 }`}
 >
 {range}
 </button>
 ))}
 </div>
 </div>
 <ResponsiveContainer width="100%" height={250}>
 <LineChart data={monthlyOutreachData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
 <XAxis dataKey="month" tick={{fontSize: 12}} />
 <YAxis yAxisId="left" tick={{fontSize: 12}} />
 <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
 <Tooltip />
 <Line yAxisId="left" type="monotone" dataKey="patients" stroke="#1E1E1E" name="Patients" strokeWidth={2} />
 <Line yAxisId="right" type="monotone" dataKey="campaigns" stroke="#A51C30" name="Campaigns" strokeWidth={2} />
 </LineChart>
 </ResponsiveContainer>
 <div className="flex justify-center gap-6 mt-4">
 <div className="flex items-center gap-2">
 <div className="w-3 h-3 bg-ink-900" />
  <span className="text-small text-gray-700">Patients</span>
  </div>
  <div className="flex items-center gap-2">
  <div className="w-3 h-3 bg-primary-600" />
  <span className="text-small text-gray-700">Campaigns</span>
 </div>
 </div>
 </div>

 {/* Disease Breakdown */}
 <div className="bg-white p-6 shadow-sm">
 <h3 className="text-title text-gray-900 flex items-center gap-2 mb-6">
 <PieChartIcon className="w-5 h-5 text-primary-600" />
 Disease Burden Treated
 </h3>
 <ResponsiveContainer width="100%" height={220}>
 <PieChart>
 <Pie 
 data={diseaseBreakdown} 
 cx="50%" 
 cy="50%" 
 outerRadius={80} 
 dataKey="value"
 label={({ name, value }) => `${name} ${value}%`}
 >
 {diseaseBreakdown.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="flex flex-wrap justify-center gap-4 mt-2">
 {diseaseBreakdown.map(item => (
 <div key={item.name} className="flex items-center gap-2 text-small">
 <div className="w-3 h-3 " style={{ backgroundColor: item.color }} />
 <span>{item.name}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Impact Stories */}
 <div className="mt-8 bg-white p-6 shadow-sm">
 <h3 className="text-title text-gray-900 flex items-center gap-2 mb-4">
 <Calendar className="w-5 h-5 text-primary-600" />
 Recent Impact Stories
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {impactStories.map((story, idx) => (
 <motion.div
 key={idx}
 initial={{ opacity: 0, x: -20 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: idx * 0.1 }}
 className="border-l-4 border-primary-600 pl-4 py-2 bg-gray-50 rounded-r-lg"
 >
 <p className="font-semibold text-gray-800">{story.title}</p>
  <p className="text-sm text-gray-700">{story.date} • {story.location}</p>
 <p className="text-sm text-ink-900">{story.patients} patients served</p>
 </motion.div>
 ))}
 </div>
 </div>

        {/* SDG 3 Progress Bars */}
        <div className="mt-8 bg-white p-6 shadow-sm">
          <h3 className="text-title text-gray-900 mb-4">Progress Toward SDG 3 Targets</h3>
          <div className="space-y-4">
            {sdgData?.sdg3?.metrics?.map((m, idx) => {
              const val = m.current_value ?? m.value ?? 0;
              const tgt = m.target_value ?? m.target ?? 1;
              const pct = Math.min(100, (val / (tgt || 1)) * 100);
              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-body text-gray-700">{m.label} (Target: {tgt.toLocaleString()} {m.unit})</span>
                    <span className="text-body font-semibold">{val.toLocaleString()} / {tgt.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3">
                    <div className="bg-[#4c9f38] h-3 transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 </div>
 </section>
 )}

 {/* SDG 4 Panel - Education */}
 {(activeTab === 'all' || activeTab === 'sdg4') && (
 <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
 <div className="container-custom">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-12 h-12 bg-[#c5192d]/10 flex items-center justify-center">
 <GraduationCap className="w-6 h-6 text-[#c5192d]" />
 </div>
 <div>
 <span className="text-sm font-bold text-[#c5192d]">SDG 4</span>
 <h2 className="text-headline text-gray-900">Quality Education</h2>
 </div>
 </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sdgData?.sdg4?.metrics?.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} color="#c5192d" />
          ))}
        </div>

 {/* Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Scholarship Trend */}
 <div className="bg-gray-50 p-6">
 <h3 className="text-title text-gray-900 mb-4">Scholarships Awarded by Year</h3>
 <ResponsiveContainer width="100%" height={250}>
 <BarChart data={scholarshipData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
 <XAxis dataKey="year" />
 <YAxis />
 <Tooltip />
 <Bar dataKey="awarded" fill="#c5192d" name="Awarded" radius={[4, 4, 0, 0]} />
 <Bar dataKey="target" fill="#e5e4e7" name="Target" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 {/* Enrollment by Program */}
 <div className="bg-gray-50 p-6">
 <h3 className="text-title text-gray-900 mb-4">Enrollment by Program & Gender</h3>
 <ResponsiveContainer width="100%" height={250}>
 <BarChart data={enrollmentData}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
 <XAxis dataKey="program" />
 <YAxis />
 <Tooltip />
 <Legend />
 <Bar dataKey="male" stackId="a" fill="#1E1E1E" name="Male" />
 <Bar dataKey="female" stackId="a" fill="#A51C30" name="Female" />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>
 </section>
 )}

 {/* SDG 5 Panel - Gender Equality */}
 {(activeTab === 'all' || activeTab === 'sdg5') && (
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="flex items-center gap-3 mb-8">
 <div className="w-12 h-12 bg-[#ff3a21]/10 flex items-center justify-center">
 <Users className="w-6 h-6 text-[#ff3a21]" />
 </div>
 <div>
 <span className="text-sm font-bold text-[#ff3a21]">SDG 5</span>
 <h2 className="text-headline text-gray-900">Gender Equality</h2>
 </div>
  </div>

  {/* Dynamic Metrics from API */}
  {sdgData?.sdg5?.metrics && sdgData.sdg5.metrics.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {sdgData.sdg5.metrics.map((metric, idx) => (
        <MetricCard key={idx} metric={metric} color="#ff3a21" />
      ))}
    </div>
  )}

  {/* Gender Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Faculty Gender */}
 <div className="bg-white p-6 shadow-sm">
 <h3 className="text-title text-gray-900 mb-4 text-center">Faculty Gender Ratio</h3>
 <ResponsiveContainer width="100%" height={200}>
 <PieChart>
 <Pie 
 data={facultyGenderData} 
 cx="50%" 
 cy="50%" 
 innerRadius={60}
 outerRadius={80} 
 dataKey="value"
 label={({ value }) => `${value}%`}
 >
 {facultyGenderData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="flex justify-center gap-4 mt-2">
 {facultyGenderData.map(item => (
 <div key={item.name} className="flex items-center gap-2 text-small">
 <div className="w-3 h-3 " style={{ backgroundColor: item.color }} />
 <span>{item.name}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Student Gender */}
 <div className="bg-white p-6 shadow-sm">
 <h3 className="text-title text-gray-900 mb-4 text-center">Student Gender Ratio</h3>
 <ResponsiveContainer width="100%" height={200}>
 <PieChart>
 <Pie 
 data={studentGenderData} 
 cx="50%" 
 cy="50%" 
 innerRadius={60}
 outerRadius={80} 
 dataKey="value"
 label={({ value }) => `${value}%`}
 >
 {studentGenderData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="flex justify-center gap-4 mt-2">
 {studentGenderData.map(item => (
 <div key={item.name} className="flex items-center gap-2 text-small">
 <div className="w-3 h-3 " style={{ backgroundColor: item.color }} />
 <span>{item.name}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Leadership Positions */}
 <div className="bg-white p-6 shadow-sm">
 <h3 className="text-title text-gray-900 mb-4">Leadership by Gender</h3>
 <ResponsiveContainer width="100%" height={200}>
 <BarChart data={leadershipGenderData} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" horizontal={false} />
 <XAxis type="number" />
 <YAxis dataKey="level" type="category" width={100} />
 <Tooltip />
 <Legend />
 <Bar dataKey="male" stackId="a" fill="#1E1E1E" name="Male" />
 <Bar dataKey="female" stackId="a" fill="#A51C30" name="Female" />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

  {/* Gender Initiatives — from SDG 5 contributions */}
  <div className="mt-8 bg-white p-6 shadow-sm">
  <h3 className="text-title text-gray-900 mb-4">Gender Equality Initiatives</h3>
  {(() => {
  const sdg5 = sdgList?.find(s => s.number === 5);
  const contributions = sdg5?.contributions ?? [];
  const items = contributions.length > 0
    ? contributions
    : [
      "Women in STEM scholarship and mentorship programmes support female students in medicine, pharmacy, and dentistry.",
      "Zero-tolerance policy on gender-based violence fully implemented across all campuses.",
      "Equal Pay Policy ensures gender-neutral compensation across all staff categories.",
      "Women's Leadership Development Programme provides mentorship and advancement opportunities for female faculty and staff.",
    ];
  const initiativeLabels = [
    "Women in STEM",
    "Safe Campus Policy",
    "Equal Pay Policy",
    "Women's Leadership",
  ];
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map((initiative: string, idx: number) => (
  <motion.div
  key={idx}
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: idx * 0.1 }}
  className="bg-gray-50 p-4"
  >
  <h4 className="font-semibold text-[#ff3a21] mb-1">{initiativeLabels[idx] || `Initiative ${idx + 1}`}</h4>
   <p className="text-small text-gray-800">{initiative}</p>
  </motion.div>
  ))}
  </div>
  );
  })()}
  </div>
 </div>
 </section>
 )}

  {/* SDG 17 Panel - Partnerships for the Goals */}
  {(activeTab === 'all' || activeTab === 'sdg17') && (
  <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
  <div className="container-custom">
  <div className="flex items-center gap-3 mb-8">
  <div className="w-12 h-12 bg-[#19486a]/10 flex items-center justify-center">
  <Handshake className="w-6 h-6 text-[#19486a]" />
  </div>
  <div>
  <span className="text-sm font-bold text-[#19486a]">SDG 17</span>
  <h2 className="text-headline text-gray-900">Partnerships for the Goals</h2>
  </div>
  </div>

  {/* Dynamic Metrics from API */}
  {sdgData?.sdg17?.metrics && sdgData.sdg17.metrics.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {sdgData.sdg17.metrics.map((metric, idx) => (
  <MetricCard key={idx} metric={metric} color="#19486a" />
  ))}
  </div>
  )}

  {/* Partnership Growth */}
  <div className="bg-gray-50 p-6">
  <h3 className="text-title text-gray-900 mb-4">Partnership Growth</h3>
  <ResponsiveContainer width="100%" height={250}>
  <BarChart data={partnershipGrowthData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
  <XAxis dataKey="year" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="partnerships" fill="#19486a" name="Partnerships" radius={[4, 4, 0, 0]} />
  <Bar dataKey="projects" fill="#4c9f38" name="Joint Projects" radius={[4, 4, 0, 0]} />
  </BarChart>
  </ResponsiveContainer>
  </div>

  {/* Partnership Highlights */}
  <div className="mt-8 bg-white p-6 shadow-sm">
  <h3 className="text-title text-gray-900 mb-4">Partnership Highlights</h3>
  {(() => {
  const sdg17 = sdgList?.find(s => s.number === 17);
  const contributions = sdg17?.contributions ?? [];
  const items = contributions.length > 0
  ? contributions
  : [
  "Active partnerships with international institutions, NGOs and government agencies.",
  "Collaboration with WHO, UNICEF and UNFPA on health programmes.",
  "Academic partnerships for joint research and faculty exchange.",
  "Student and staff exchange programmes building global capacity.",
  ];
  return (
  <ul className="list-disc list-inside space-y-2 text-gray-700 text-body">
  {items.map((item: string, idx: number) => (
  <li key={idx}>{item}</li>
  ))}
  </ul>
  );
  })()}
  </div>
  </div>
  </section>
  )}

  {/* Annual Reports Section */}
  <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
  <div className="container-custom">
  <div className="text-center mb-8">
  <h2 className="text-headline text-gray-900 mb-3">Annual Impact Reports</h2>
   <p className="text-lead text-gray-800">Comprehensive reports on BMU's SDG contributions</p>
  </div>

  {!impactReports ? null : impactReports.length === 0 ? (
    <p className="text-center text-gray-500">No impact reports available yet.</p>
  ) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {impactReports.map((report, index) => {
    const downloadUrl = report.file
      ? report.file
      : `/api/public/public-documents/${report.id}/download`;
    return (
  <motion.div
  key={report.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1 }}
  className="bg-gray-50 p-6 border border-gray-100 hover:border-ink-900 transition-colors"
  >
  <div className="flex items-center gap-3 mb-4">
  <div className="w-12 h-12 bg-ink-900/10 flex items-center justify-center">
  <FileText className="w-6 h-6 text-ink-900" />
  </div>
  <div>
  <h3 className="text-title text-gray-900">{report.title}</h3>
   <p className="text-small text-gray-700">{report.document_type.toUpperCase()} • {report.download_count.toLocaleString()} downloads</p>
  </div>
  </div>
  <div className="flex gap-2">
  <a
    href={`/api/public/public-documents/${report.id}/download?view=1`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
  >
  <ExternalLink className="w-4 h-4" />
  View
  </a>
  <a
    href={downloadUrl}
    download
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-ink-900 text-white font-medium hover:bg-ink-900/90 transition"
  >
  <Download className="w-4 h-4" />
  Download
  </a>
  </div>
  </motion.div>
    );
  })}
  </div>
  )}
  </div>
 </section>

 {/* Data Sources & Methodology */}
 <section className="py-12" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="bg-white p-6 shadow-sm">
 <div className="flex items-center gap-3 mb-4">
 <Info className="w-6 h-6 text-primary-600" />
 <h3 className="text-title text-gray-900">Data Sources & Methodology</h3>
 </div>
  <p className="text-body text-gray-800 mb-4">
 Data presented in this dashboard is collected from multiple sources including hospital records, 
 community outreach logs, academic databases, and annual surveys. All metrics are verified and 
 reported annually for THE Impact Rankings submission.
 </p>
  <div className="flex flex-wrap gap-4 text-small text-gray-700">
 <span>Last updated: December 2024</span>
 <span>•</span>
 <span>Data verified by: Quality Assurance Unit</span>
 <span>•</span>
 <span>Next update: March 2025</span>
 </div>
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="py-16" style={{ backgroundColor: 'var(--color-ink-900)' }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">Partner for Impact</h2>
 <p className="text-lead text-white/80 mb-6">
 Join us in advancing the Sustainable Development Goals. Explore collaboration opportunities in research, education, and community programs.
 </p>
 <Link 
 to="/research/collaborations"
 className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-ink-900 font-bold hover:bg-white transition"
 >
 Explore Partnerships <ArrowRight className="w-5 h-5" />
 </Link>
 </div>
 <div className="bg-white/10 backdrop-blur p-8">
 <div className="flex items-center gap-4 mb-4">
 <TrendingUp className="w-8 h-8 text-primary-600" />
 <div>
 <div className="text-3xl font-bold text-white">12/17</div>
 <p className="text-white/80">Active SDGs</p>
 </div>
 </div>
 <p className="text-white/60 text-sm">
 BMU contributes to 12 of the 17 UN Sustainable Development Goals through education, research, and community engagement.
 </p>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

