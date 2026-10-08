import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
	Stethoscope, 
	Heart, 
	Microscope, 
	FlaskConical,
	ArrowLeft,
	GraduationCap,
	BookOpen,
	MapPin,
	Mail,
	Phone
} from 'lucide-react';
import { fetchCollegeBySlug } from '../../services/api';

interface CollegeData {
	slug: string;
	name: string;
	fullName: string;
	description: string;
	history: string;
	programs: { name: string; degree: string; duration: string; description: string }[];
	facilities: string[];
	faculty: { name: string; title: string; specialization: string }[];
	stats: { value: string; label: string }[];
	contact: { email: string; phone: string; location: string };
	icon: React.ElementType;
	color: string;
	dean: { name: string; title: string; message: string };
}

const collegesData: Record<string, CollegeData> = {
 medicine: {
 slug: 'medicine',
 name: 'College of Medicine',
 fullName: 'College of Medicine and Health Sciences',
 description: 'Nigeria\'s premier medical school focusing on training world-class physicians, surgeons, and medical researchers with emphasis on healthcare challenges specific to the Niger Delta region.',
 history: 'Established in 2018, the College of Medicine was the first academic unit of BMU. Our MBBS program has graduated over 200 physicians serving across Nigeria and internationally.',
 programs: [
 { name: 'Medicine and Surgery', degree: 'MBBS', duration: '6 years', description: 'Comprehensive medical training combining pre-clinical sciences with extensive clinical rotations.' },
 { name: 'Anatomy', degree: 'B.Sc', duration: '4 years', description: 'Study of human body structure with emphasis on functional anatomy and imaging.' },
 { name: 'Physiology', degree: 'B.Sc', duration: '4 years', description: 'Understanding body functions and mechanisms with clinical correlations.' },
 { name: 'Pharmacology', degree: 'B.Sc', duration: '4 years', description: 'Study of drug actions, therapeutics, and clinical pharmacology.' }
 ],
 facilities: [
 'Anatomy Laboratory with cadaveric specimens',
 'Physiology & Biochemistry Labs',
 'Clinical Skills Simulation Center',
 'Medical Research Library',
 '500-bed Teaching Hospital',
 'Pathology Museum'
 ],
 faculty: [
 { name: 'Prof. Emmanuel Ekanem', title: 'Dean', specialization: 'Public Health Medicine' },
 { name: 'Prof. Michael Ogu', title: 'Professor', specialization: 'Internal Medicine' },
 { name: 'Dr. Chinedu Amadi', title: 'Senior Lecturer', specialization: 'Anatomy' }
 ],
 stats: [
 { value: '800+', label: 'Students' },
 { value: '120', label: 'Faculty' },
 { value: '200+', label: 'Graduates' },
 { value: '95%', label: 'Pass Rate' }
 ],
 contact: {
 email: 'medicine@bmu.edu.ng',
 phone: '+234 803 111 0001',
 location: 'Main Campus, Yenagoa'
 },
 icon: Stethoscope,
 color: '#1E1E1E',
 dean: {
 name: 'Prof. Emmanuel Ekanem',
 title: 'Dean, College of Medicine',
 message: 'Our mission is to train competent, compassionate physicians who will serve the healthcare needs of the Niger Delta and beyond. We combine rigorous academic training with extensive clinical exposure.'
 }
 },
 nursing: {
 slug: 'nursing',
 name: 'School of Nursing',
 fullName: 'School of Nursing Sciences',
 description: 'Comprehensive nursing education combining theoretical knowledge with extensive clinical practice, producing highly skilled nursing professionals for healthcare delivery.',
 history: 'Founded in 2019, our nursing school has rapidly grown to become one of Nigeria\'s leading nursing education institutions with a 100% NCLEX pass rate.',
 programs: [
 { name: 'Nursing Science', degree: 'B.NSc', duration: '5 years', description: 'Professional nursing program with clinical rotations across all major specialties.' },
 { name: 'Post-Basic Nursing', degree: 'PGD', duration: '18 months', description: 'Specialized training for registered nurses seeking advanced certification.' },
 { name: 'M.Sc Nursing', degree: 'M.Sc', duration: '2 years', description: 'Graduate program in nursing leadership, education, and advanced practice.' },
 { name: 'PhD Nursing', degree: 'PhD', duration: '3-4 years', description: 'Doctoral research program in nursing science and healthcare.' }
 ],
 facilities: [
 'Nursing Skills Laboratory',
 'Maternal-Child Health Simulation Lab',
 'Community Health Practice Center',
 'Nursing Computer Laboratory',
 'Clinical Practice Wards',
 'Research Library'
 ],
 faculty: [
 { name: 'Prof. Helen Douglas', title: 'Dean', specialization: 'Maternal Health Nursing' },
 { name: 'Dr. Blessing Iruo', title: 'Senior Lecturer', specialization: 'Medical-Surgical Nursing' },
 { name: 'Dr. Patience Alagoa', title: 'Lecturer I', specialization: 'Pediatric Nursing' }
 ],
 stats: [
 { value: '600+', label: 'Students' },
 { value: '45', label: 'Faculty' },
 { value: '350+', label: 'Graduates' },
 { value: '100%', label: 'NCLEX Pass' }
 ],
 contact: {
 email: 'nursing@bmu.edu.ng',
 phone: '+234 803 111 0002',
 location: 'Health Sciences Campus'
 },
 icon: Heart,
 color: '#A51C30',
 dean: {
 name: 'Prof. Helen Douglas',
 title: 'Dean, School of Nursing',
 message: 'We are committed to producing nursing leaders who combine clinical excellence with compassionate care. Our graduates are sought after by healthcare institutions worldwide.'
 }
 },
 'allied-health': {
 slug: 'allied-health',
 name: 'School of Allied Health',
 fullName: 'School of Allied Health Sciences',
 description: 'Specialized training for allied health professionals including medical laboratory scientists, radiographers, physiotherapists, and other healthcare technologists.',
 history: 'Established to meet the growing demand for allied health professionals in Nigeria\'s healthcare system, providing hands-on training with modern equipment.',
 programs: [
 { name: 'Medical Laboratory Science', degree: 'BMLS', duration: '5 years', description: 'Training in clinical laboratory diagnostics including hematology, microbiology, and chemical pathology.' },
 { name: 'Radiography', degree: 'B.Sc', duration: '5 years', description: 'Medical imaging technology including X-ray, CT, MRI, and ultrasound.' },
 { name: 'Physiotherapy', degree: 'B.Sc', duration: '5 years', description: 'Physical rehabilitation and therapeutic interventions for patients.' },
 { name: 'Optometry', degree: 'B.Sc', duration: '5 years', description: 'Eye care, vision science, and optical services.' }
 ],
 facilities: [
 'Medical Laboratory Complex',
 'Diagnostic Imaging Center',
 'Physiotherapy Gymnasium',
 'Optometry Clinic',
 'Research Laboratories',
 'Anatomy Museum'
 ],
 faculty: [
 { name: 'Prof. Gift Ebi', title: 'Dean', specialization: 'Medical Laboratory Science' },
 { name: 'Dr. Tamaraebi Kpodoh', title: 'Professor', specialization: 'Radiography' },
 { name: 'Dr. Timipa Orunaboka', title: 'Senior Lecturer', specialization: 'Physiotherapy' }
 ],
 stats: [
 { value: '400+', label: 'Students' },
 { value: '35', label: 'Faculty' },
 { value: '280+', label: 'Graduates' },
 { value: '90%', label: 'Employment' }
 ],
 contact: {
 email: 'alliedhealth@bmu.edu.ng',
 phone: '+234 803 111 0003',
 location: 'Health Sciences Campus'
 },
 icon: Microscope,
 color: '#A51C30',
 dean: {
 name: 'Prof. Gift Ebi',
 title: 'Dean, School of Allied Health',
 message: 'Allied health professionals are essential to modern healthcare delivery. We train competent technologists ready to work in any healthcare setting.'
 }
 },
 'public-health': {
 slug: 'public-health',
 name: 'Institute of Public Health',
 fullName: 'Institute of Public Health and Community Medicine',
 description: 'Training public health leaders, epidemiologists, and health policy experts focused on disease prevention, health promotion, and population health management.',
 history: 'The youngest but fastest-growing academic unit, addressing the critical need for public health expertise in the Niger Delta region.',
 programs: [
 { name: 'Public Health', degree: 'B.Sc', duration: '4 years', description: 'Population health, epidemiology, and health systems management.' },
 { name: 'Master of Public Health', degree: 'MPH', duration: '2 years', description: 'Graduate public health leadership and research.' },
 { name: 'Epidemiology', degree: 'M.Sc', duration: '2 years', description: 'Disease surveillance and outbreak investigation.' },
 { name: 'Doctor of Public Health', degree: 'DrPH', duration: '3 years', description: 'Advanced public health practice and policy.' }
 ],
 facilities: [
 'Epidemiology Laboratory',
 'Community Health Research Center',
 'Biostatistics Computer Lab',
 'Environmental Health Lab',
 'Health Policy Research Unit',
 'Field Research Stations'
 ],
 faculty: [
 { name: 'Prof. Emmanuel Ekanem', title: 'Director', specialization: 'Public Health' },
 { name: 'Dr. Henry Ayibatari', title: 'Senior Lecturer', specialization: 'Epidemiology' },
 { name: 'Dr. Tari Oweifa', title: 'Lecturer I', specialization: 'Environmental Health' }
 ],
 stats: [
 { value: '300+', label: 'Students' },
 { value: '28', label: 'Faculty' },
 { value: '150+', label: 'Graduates' },
 { value: '25+', label: 'Research Projects' }
 ],
 contact: {
 email: 'publichealth@bmu.edu.ng',
 phone: '+234 803 111 0004',
 location: 'Research Campus'
 },
 icon: FlaskConical,
 color: '#1E1E1E',
 dean: {
 name: 'Prof. Emmanuel Ekanem',
 title: 'Director, Institute of Public Health',
 message: 'Public health is the foundation of healthcare systems. We train leaders who prevent disease, promote health, and strengthen communities.'
 }
 }
};

const defaultCollegeData = (slug: string, name: string, description: string): CollegeData => ({
	slug,
	name,
	fullName: name,
	description,
	history: '',
	programs: [],
	facilities: [],
	faculty: [],
	stats: [],
	contact: { email: '', phone: '', location: '' },
	icon: Stethoscope,
	color: '#1E1E1E',
	dean: { name: '', title: '', message: '' },
});

interface ApiCollegeDetail {
	slug: string;
	name: string;
	description: string;
	primary_color?: string;
	student_count?: number;
	faculty_count?: number;
	faculty_members_count?: number;
}

export const CollegeDetail = () => {
	const { collegeSlug } = useParams<{ collegeSlug: string }>();
	const [college, setCollege] = useState<CollegeData | null>(null);
	const [loading, setLoading] = useState(() => Boolean(collegeSlug));

	useEffect(() => {
		if (!collegeSlug) return;

		fetchCollegeBySlug(collegeSlug)
			.then((apiCollege: ApiCollegeDetail | undefined) => {
				if (apiCollege) {
					const hardcoded = collegesData[collegeSlug];
					if (hardcoded) {
						setCollege({
							...hardcoded,
							slug: apiCollege.slug,
							name: apiCollege.name,
							description: apiCollege.description,
							color: apiCollege.primary_color || hardcoded.color,
							stats: hardcoded.stats.length ? hardcoded.stats : [
								{ value: String(apiCollege.student_count || 0), label: 'Students' },
								{ value: String(apiCollege.faculty_count || 0), label: 'Faculty' },
								{ value: String(apiCollege.faculty_members_count || 0), label: 'Staff' },
							],
						});
					} else {
						setCollege(defaultCollegeData(apiCollege.slug, apiCollege.name, apiCollege.description));
					}
				} else {
					const hardcoded = collegeSlug ? collegesData[collegeSlug] : null;
					setCollege(hardcoded || null);
				}
			})
			.catch(() => {
				const hardcoded = collegeSlug ? collegesData[collegeSlug] : null;
				setCollege(hardcoded || null);
			})
			.finally(() => setLoading(false));
	}, [collegeSlug]);

	if (loading) {
	return (
		<div className="container-custom py-20 text-center">
			<div className="animate-pulse">
				<div className="h-8 bg-gray-200 w-64 mx-auto mb-4" />
				<div className="h-4 bg-gray-200 w-96 mx-auto" />
			</div>
		</div>
		);
	}

	if (!college) {
	return (
		<>
 <Helmet>
 <title>College Not Found | Bayelsa Medical University</title>
 </Helmet>
 <div className="container-custom py-20 text-center">
 <h1 className="text-headline text-gray-900 mb-4">College Not Found</h1>
 <p className="text-lead text-gray-600 mb-6">The college you are looking for does not exist.</p>
 <Link to="/colleges" className="text-[#1E1E1E] font-medium hover:underline">
 ← Back to Colleges
 </Link>
 </div>
 </>
 );
 }

 const Icon = college.icon;

 return (
 <>
 <Helmet>
 <title>{college.name} | Bayelsa Medical University</title>
 <meta name="description" content={`${college.fullName} at Bayelsa Medical University. Explore programs, faculty, facilities, and admission requirements.`} />
 </Helmet>

 {/* Hero */}
 <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: college.color }}>
 <div className="absolute inset-0 opacity-5" style={{
 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
 }} />

 <div className="container-custom relative z-10">
 <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
 <Link to="/colleges" className="inline-flex items-center gap-2 text-white/60 text-sm mb-6 hover:text-white transition">
 <ArrowLeft className="w-4 h-4" />
 Back to Colleges
 </Link>
 <div className="flex items-center gap-4 mb-6">
 <div className="w-20 h-20 bg-white/20 flex items-center justify-center">
 <Icon className="w-10 h-10 text-white" />
 </div>
 <div>
 <h1 className="text-display text-white">{college.name}</h1>
 <p className="text-lead text-white/80">{college.fullName}</p>
 </div>
 </div>
 <p className="text-body text-white/90 max-w-2xl">{college.description}</p>
 </motion.div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-12 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e4e7' }}>
 <div className="container-custom">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {college.stats.map((stat, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="text-center"
 >
 <div className="text-stat" style={{ color: college.color }}>{stat.value}</div>
 <p className="text-gray-600 text-body">{stat.label}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Dean's Message */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <div className="bg-white p-8 shadow-sm border border-gray-100">
 <div className="flex items-start gap-6">
 <div className="w-16 h-16 bg-gray-200 flex-shrink-0" />
 <div>
 <h2 className="text-title text-gray-900 mb-2">{college.dean.name}</h2>
 <p className="text-small text-[#A51C30] mb-4">{college.dean.title}</p>
 <p className="text-body text-gray-600 italic">"{college.dean.message}"</p>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Programs */}
 <section className="py-16">
 <div className="container-custom">
 <h2 className="text-headline text-gray-900 mb-8">Academic Programs</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {college.programs.map((program, index) => (
 <motion.div
 key={program.name}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100"
 >
 <div className="flex items-center gap-2 mb-2">
 <GraduationCap className="w-5 h-5" style={{ color: college.color }} />
 <span className="text-small font-semibold" style={{ color: college.color }}>{program.degree}</span>
 <span className="text-small text-gray-500">• {program.duration}</span>
 </div>
 <h3 className="text-title text-gray-900 mb-2">{program.name}</h3>
 <p className="text-body text-gray-600">{program.description}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Facilities */}
 <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
 <div className="container-custom">
 <h2 className="text-headline text-gray-900 mb-8">Facilities</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {college.facilities.map((facility, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-3"
 >
 <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${college.color}15` }}>
 <BookOpen className="w-5 h-5" style={{ color: college.color }} />
 </div>
 <span className="text-body text-gray-700">{facility}</span>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Faculty */}
 <section className="py-16">
 <div className="container-custom">
 <h2 className="text-headline text-gray-900 mb-8">Leadership & Faculty</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {college.faculty.map((member, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 shadow-sm border border-gray-100 text-center"
 >
 <div className="w-20 h-20 bg-gray-200 mx-auto mb-4" />
 <h3 className="font-semibold text-gray-900">{member.name}</h3>
 <p className="text-small text-[#A51C30]">{member.title}</p>
 <p className="text-small text-gray-500 mt-2">{member.specialization}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Contact */}
 <section className="py-16" style={{ backgroundColor: college.color }}>
 <div className="container-custom">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
 <div>
 <h2 className="text-headline text-white mb-4">Contact Us</h2>
 <p className="text-lead text-white/80 mb-6">
 Have questions about programs or admissions? Get in touch with our admissions office.
 </p>
 <div className="space-y-4">
 <div className="flex items-center gap-3 text-white/80">
 <Mail className="w-5 h-5" />
 <span>{college.contact.email}</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <Phone className="w-5 h-5" />
 <span>{college.contact.phone}</span>
 </div>
 <div className="flex items-center gap-3 text-white/80">
 <MapPin className="w-5 h-5" />
 <span>{college.contact.location}</span>
 </div>
 </div>
 </div>
 <div className="flex flex-wrap gap-4">
 <Link 
 to="/academics/admissions"
 className="px-8 py-4 bg-[#A51C30] text-[#1E1E1E] font-bold hover:bg-white transition"
 >
 Admission Requirements
 </Link>
 <Link 
 to="/apply"
 className="px-8 py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-[#1E1E1E] transition"
 >
 Apply Now
 </Link>
 </div>
 </div>
 </div>
 </section>
 </>
 );
};

