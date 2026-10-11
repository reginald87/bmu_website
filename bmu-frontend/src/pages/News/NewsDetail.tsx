import { useState, useEffect } from 'react';
import { sanitizeHtml } from '../../utils/sanitize';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
 Calendar,
 Clock,
 User,
 ChevronLeft,
 ChevronRight,
 Share2,
 Printer,
 Link as LinkIcon,
 CheckCircle,
 MessageSquare,
 Tag,
 Newspaper,
 TrendingUp,
  Bookmark,
  Heart
} from 'lucide-react';
import { apiClient, ALLOW_API_MOCKS } from '../../services/api';
import { NewsletterForm } from '../../components/common/NewsletterForm';

interface Article {
 id: number;
 title: string;
 slug: string;
 excerpt: string;
 content: string;
 category: string;
 type: string;
 author: {
 name: string;
 role: string;
 image: string;
 bio: string;
 };
 date: string;
 readTime: string;
 image: string;
 tags: string[];
 relatedArticles: number[];
}

const fallbackNews: Article[] = [
 {
 id: 1,
 slug: 'bmu-hosts-international-medical-conference-2024',
 title: 'BMU Hosts International Medical Conference 2024',
 excerpt: 'Over 500 healthcare professionals from 30 countries gathered at Bayelsa Medical University for the annual International Medical Conference focusing on emerging infectious diseases.',
 content: `
 <p class="lead">Bayelsa Medical University proudly hosted the 2024 International Medical Conference, bringing together over 500 healthcare professionals from 30 countries to discuss the latest developments in emerging infectious diseases and global health security.</p><p>The three-day conference, held at the University's main campus in Yenagoa, featured keynote speeches from renowned epidemiologists, virologists, and public health experts. The theme for this year's conference was"One Health: Bridging Human, Animal, and Environmental Medicine for a Safer World."</p><h2>Key Highlights</h2><p>The conference opened with an address by the Vice Chancellor, Prof. Osahon Enabulele, who emphasized the importance of international collaboration in combating emerging infectious diseases."In an interconnected world, diseases know no borders. This conference represents our commitment to fostering global partnerships in healthcare,"he stated.</p><p>Dr. Sarah Chen, Director of the World Health Organization's Africa Regional Office, delivered the keynote address on the challenges and opportunities in pandemic preparedness. Her presentation highlighted several key areas:</p><ul><li>Strengthening early warning systems for disease outbreaks</li><li>Building resilient healthcare infrastructure in resource-limited settings</li><li>Advancing vaccine research and development for tropical diseases</li><li>Promoting community engagement in public health initiatives</li></ul><h2>Research Presentations</h2><p>The conference featured over 150 oral and poster presentations from researchers across the globe. Notable research included:</p><p><strong>Malaria Resistance Mapping:</strong> A team from BMU presented groundbreaking research on tracking artemisinin resistance in malaria parasites across the Niger Delta region, providing crucial data for treatment protocol updates.</p><p><strong>AI in Disease Surveillance:</strong> Researchers from Johns Hopkins University demonstrated how artificial intelligence can predict disease outbreaks by analyzing social media and weather patterns.</p><p><strong>One Health Approach to Lassa Fever:</strong> A collaborative study between BMU and the Nigeria Centre for Disease Control showcased successful interventions in reducing Lassa fever transmission through rodent control and community education.</p><h2>Workshops and Training</h2><p>Parallel to the main conference, specialized workshops provided hands-on training in:</p><ul><li>Advanced molecular diagnostics techniques</li><li>Outbreak investigation and contact tracing</li><li>Health communication during emergencies</li><li>Grant writing for global health research</li></ul><h2>Partnerships and Collaborations</h2><p>Several new partnerships were announced during the conference, including:</p><p><strong>BMU-Johns Hopkins Research Exchange Program:</strong> A five-year partnership enabling faculty and student exchanges between the two institutions.</p><p><strong>Tropical Disease Research Network:</strong> A consortium of African universities dedicated to collaborative research on neglected tropical diseases.</p><p><strong>Community Health Worker Training Initiative:</strong> A program to train 1,000 community health workers across Bayelsa State in disease surveillance and prevention.</p><h2>Looking Forward</h2><p>The conference concluded with a commitment to continue the dialogue through the newly established BMU Global Health Forum, which will host quarterly virtual seminars and an annual in-person conference.</p><p>"This conference has strengthened BMU's position as a leading institution in tropical medicine and global health research in Africa,"said Prof. Grace Ebieri, Dean of the College of Medicine."We look forward to welcoming everyone back next year."</p><p>The 2025 International Medical Conference is scheduled for November 10-12, with a focus on antimicrobial resistance and the future of infectious disease treatment.</p>
 `,
 category: 'Event',
 type: 'news',
 author: {
 name: 'Dr. Sarah Okonkwo',
 role: 'Director of Public Relations',
 image: '/authors/sarah-okonkwo.jpg',
 bio: 'Dr. Okonkwo oversees communications and public engagement at Bayelsa Medical University. She has a background in medical journalism and public health communications.'
 },
 date: '2024-11-15',
 readTime: '8 min',
 image: '/news/conference-2024.jpg',
 tags: ['Conference', 'Healthcare', 'International', 'Research', 'Global Health'],
 relatedArticles: [2, 4, 6]
 },
 {
 id: 2,
 slug: 'new-research-center-for-tropical-diseases-opens',
 title: 'New Research Center for Tropical Diseases Opens',
 excerpt: 'BMU officially opens its state-of-the-art Tropical Disease Research Center, equipped with advanced laboratory facilities to combat malaria, dengue, and other tropical illnesses.',
 content: `
 <p class="lead">Bayelsa Medical University has officially opened the doors to its new Tropical Disease Research Center (TDRC), a cutting-edge facility designed to advance research and treatment of diseases that disproportionately affect tropical regions.</p><p>The ribbon-cutting ceremony, attended by government officials, international partners, and university leadership, marked a significant milestone in BMU's mission to become a leading center for tropical medicine research in Africa.</p><h2>State-of-the-Art Facilities</h2><p>The TDRC features:</p><ul><li><strong>Biosafety Level 3 Laboratories:</strong> For safe handling of dangerous pathogens including Lassa fever and Ebola</li><li><strong>Genomic Sequencing Suite:</strong> Advanced equipment for pathogen genetic analysis</li><li><strong>Insectary:</strong> Controlled environment for studying disease vectors including mosquitoes and tsetse flies</li><li><strong>Drug Discovery Lab:</strong> High-throughput screening equipment for testing new therapeutics</li><li><strong>Clinical Trial Unit:</strong> Facilities for testing vaccines and treatments in human subjects</li></ul><h2>Research Focus Areas</h2><p>The center will prioritize research on:</p><ul><li>Malaria drug resistance and new treatment strategies</li><li>Dengue fever surveillance and prevention</li><li>Lassa fever diagnostics and therapeutics</li><li>Neglected tropical diseases affecting the Niger Delta</li><li>Emerging infectious diseases preparedness</li></ul><h2>International Collaboration</h2><p>The TDRC has already established partnerships with:</p><ul><li>London School of Hygiene and Tropical Medicine</li><li>US Centers for Disease Control and Prevention</li><li>Gates Foundation-funded research networks</li><li>West African College of Physicians</li></ul><p>"This center represents a significant investment in African-led research,"said Prof. John Ebieri, Director of the TDRC."We are committed to developing solutions for diseases that affect our region, by researchers who understand the local context."</p><h2>Community Impact</h2><p>Beyond research, the center will serve the community through:</p><ul><li>Free screening programs for tropical diseases</li><li>Training programs for local healthcare workers</li><li>Public education on disease prevention</li><li>Outreach to remote communities in the Niger Delta</li></ul><p>The TDRC is funded through a combination of federal government support, international grants, and private sector partnerships totaling over ?2 billion over five years.</p>
 `,
 category: 'Research',
 type: 'news',
 author: {
 name: 'Prof. John Ebieri',
 role: 'Director, Tropical Disease Research Center',
 image: '/authors/john-ebieri.jpg',
 bio: 'Prof. Ebieri is a leading researcher in tropical medicine with over 20 years of experience in malaria and infectious disease research.'
 },
 date: '2024-11-10',
 readTime: '6 min',
 image: '/news/research-center.jpg',
 tags: ['Research', 'Facilities', 'Tropical Medicine', 'Infrastructure', 'Innovation'],
 relatedArticles: [1, 7, 3]
 }
];

const relatedArticlesData = [
 {
 id: 3,
 slug: 'bmu-students-win-national-medical-quiz-competition',
 title: 'BMU Students Win National Medical Quiz Competition',
 excerpt: 'A team of five medical students from BMU emerged victorious at the 2024 National Medical Quiz Championship.',
 date: '2024-11-05',
 category: 'Achievement'
 },
 {
 id: 4,
 slug: 'partnership-with-johns-hopkins-university-announced',
 title: 'Partnership with Johns Hopkins University Announced',
 excerpt: 'BMU signs historic partnership agreement with Johns Hopkins University for faculty exchange and joint research.',
 date: '2024-10-28',
 category: 'Partnership'
 },
 {
 id: 6,
 slug: '2024-2025-academic-session-commences',
 title: '2024/2025 Academic Session Commences',
 excerpt: 'BMU welcomes over 1,200 new students across various programs as the new academic session begins.',
 date: '2024-10-15',
 category: 'Academic'
 }
];

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
 news: { label: 'News', color: 'text-blue-600', bg: 'bg-blue-100' },
 announcement: { label: 'Announcement', color: 'text-purple-600', bg: 'bg-purple-100' },
 press: { label: 'Press Release', color: 'text-green-600', bg: 'bg-green-100' }
};

export const NewsDetail = () => {
 const { slug } = useParams();
 const navigate = useNavigate();
 const [isBookmarked, setIsBookmarked] = useState(false);
 const [showShareMenu, setShowShareMenu] = useState(false);
 const [copied, setCopied] = useState(false);

  const { data: article, isLoading } = useQuery<Article | null>({
    queryKey: ['news', slug],
    queryFn: async (): Promise<Article | null> => {
      if (!slug) return null;
      try {
        const response = await apiClient.get(`/public/news/${slug}`);
        const item = response.data;
        if (item && item.id) {
          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt || '',
            content: item.content || '',
            category: item.category_display || item.category,
            type: item.type || 'news',
            author: { name: item.author || '', role: '', image: '', bio: '' },
            date: item.published_at ? item.published_at.split('T')[0] : '',
            readTime: '3 min',
            image: item.featured_image || '',
            tags: [],
            relatedArticles: [],
          };
        }
      } catch (error) {
        if (!ALLOW_API_MOCKS) throw error;
      }
      const found = ALLOW_API_MOCKS ? fallbackNews.find(a => a.slug === slug) : null;
      return found || null;
    },
    enabled: !!slug,
  });

 useEffect(() => {
 window.scrollTo(0, 0);
 }, [slug]);

 const handleShare = (platform: string) => {
 const url = window.location.href;
 const text = article?.title || 'Check out this article from BMU';

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
 <>
 <Helmet>
 <title>Loading... | Bayelsa Medical University</title>
 </Helmet>
 <div className="min-h-screen bg-gray-50 pt-[180px]">
 <div className="container-custom py-16">
 <div className="max-w-2xl mx-auto text-center">
 <div className="w-8 h-8 border-4 border-ink-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
 <p className="text-gray-600">Loading article...</p>
 </div>
 </div>
 </div>
 </>
 );
 }

 if (!article) {
 return (
 <><Helmet><title>Article Not Found | Bayelsa Medical University</title></Helmet><div className="min-h-screen bg-gray-50"><div className="container-custom py-16"><div className="max-w-2xl mx-auto text-center"><Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1><p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p><Link
 to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white font-semibold hover:bg-ink-900/90 transition"><ChevronLeft className="w-5 h-5"/>
 Back to News
 </Link></div></div></div></>
 );
 }

 const typeConfig = typeLabels[article.type];

 return (
 <><Helmet><title>{article.title} | Bayelsa Medical University</title><meta name="description"content={article.excerpt} /><meta property="og:title"content={article.title} /><meta property="og:description"content={article.excerpt} /></Helmet><div className="min-h-screen bg-gray-50 pt-[180px]">
 {/* Navigation Bar */}
 <div className="bg-white border-b sticky top-[140px] z-20"><div className="container-custom py-4"><div className="flex items-center justify-between"><button
 onClick={() => navigate(-1)}
 className="flex items-center gap-2 text-gray-600 text-ink-900 transition"><ChevronLeft className="w-5 h-5"/><span className="hidden sm:inline">Back to News</span></button><div className="flex items-center gap-2"><div className="relative"><button
 onClick={() => setShowShareMenu(!showShareMenu)}
 className="p-2 bg-gray-100 transition" title="Share article"><Share2 className="w-5 h-5 text-gray-600"/></button>
 {showShareMenu && (
 <div className="absolute right-0 top-full mt-2 w-48 bg-white border py-2 z-50"><button
 onClick={() => handleShare('facebook')}
 className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-blue-600 font-bold">f</span>
 Facebook
 </button><button
 onClick={() => handleShare('twitter')}
 className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-sky-500 font-bold">X</span>
 Twitter
 </button><button
 onClick={() => handleShare('linkedin')}
 className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition"><span className="w-5 h-5 flex items-center justify-center text-blue-700 font-bold">in</span>
 LinkedIn
 </button><button
 onClick={() => handleShare('copy')}
 className="flex items-center gap-3 w-full px-4 py-2 bg-gray-50 transition">
 {copied ? <CheckCircle className="w-5 h-5 text-green-600"/> : <LinkIcon className="w-5 h-5 text-gray-600"/>}
 {copied ? 'Copied!' : 'Copy Link'}
 </button></div>
 )}
 </div><button
 onClick={() => setIsBookmarked(!isBookmarked)}
 className="p-2 bg-gray-100 transition" title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
 ><Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-ink-900 fill-ink-900' : 'text-gray-600'}`} /></button><button
 onClick={handlePrint}
 className="p-2 bg-gray-100 transition" title="Print article"><Printer className="w-5 h-5 text-gray-600"/></button></div></div></div></div>

 {/* Article Header */}
 <div className="bg-white"><div className="container-custom py-8"><motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 {/* Breadcrumb */}
 <div className="flex items-center gap-2 text-gray-600 text-sm mb-6"><Link to="/" className="text-ink-900 transition">Home</Link><span>/</span><Link to="/news" className="text-ink-900 transition">News</Link><span>/</span><span className="text-gray-900 font-medium">Article</span></div>
 {/* Tags */}
 <div className="flex items-center gap-2 mb-4"><span className={`px-3 py-1 text-sm font-medium ${typeConfig.bg} ${typeConfig.color}`}>
 {typeConfig.label}
 </span><span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600">
 {article.category}
 </span></div>

 {/* Title */}
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
 {article.title}
 </h1>

 {/* Meta Info */}
 <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8"><div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>{article.date}</span></div><div className="flex items-center gap-2"><Clock className="w-4 h-4"/><span>{article.readTime} read</span></div><div className="flex items-center gap-2"><User className="w-4 h-4"/><span>By {article.author.name}</span></div></div>

 {/* Tags */}
 <div className="flex flex-wrap gap-2 mb-8">
 {article.tags.map((tag: string) => (
 <span
 key={tag}
 className="px-3 py-1 bg-gray-100 text-gray-700 text-sm bg-gray-200 transition cursor-pointer">
 #{tag}
 </span>
 ))}
 </div></motion.div></div></div>

 {/* Featured Image */}
 <div className="container-custom"><div className="bg-gray-200 h-[400px] md:h-[500px] flex items-center justify-center mb-8"><div className="text-center"><Newspaper className="w-20 h-20 text-gray-400 mx-auto mb-4"/><p className="text-gray-500">Article Featured Image</p></div></div></div>

 {/* Article Content */}
 <div className="container-custom"><div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
 {/* Main Content */}
 <div className="lg:col-span-3"><motion.article
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 className="bg-white p-8 md:p-12 shadow-sm">
 {/* Article Body */}
 <div
 className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-ink-900 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:marker:text-ink-900" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
 />

 {/* Engagement Section */}
 <div className="mt-12 pt-8 border-t"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><button className="flex items-center gap-2 px-4 py-2 bg-gray-100 bg-red-50 transition group"><Heart className="w-5 h-5 text-gray-600 group- text-red-600 group- fill-red-600"/><span className="text-gray-600 group- text-red-600">Like</span></button><button className="flex items-center gap-2 px-4 py-2 bg-gray-100 bg-ink-900/10 transition"><MessageSquare className="w-5 h-5 text-gray-600"/><span className="text-gray-600">Comment</span></button></div><div className="flex items-center gap-2"><span className="text-sm text-gray-500">Share:</span><button
 onClick={() => handleShare('facebook')}
 className="p-2 bg-blue-50 transition text-blue-600 font-bold" title="Share on Facebook">
 f
 </button><button
 onClick={() => handleShare('twitter')}
 className="p-2 bg-sky-50 transition text-sky-500 font-bold" title="Share on Twitter">
 X
 </button><button
 onClick={() => handleShare('linkedin')}
 className="p-2 bg-blue-50 transition text-blue-700 font-bold" title="Share on LinkedIn">
 in
 </button></div></div></div></motion.article>

 {/* Author Bio */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.3 }}
 className="mt-8 bg-white p-8 shadow-sm"><div className="flex items-start gap-4"><div className="w-16 h-16 bg-ink-900/10 flex items-center justify-center flex-shrink-0"><User className="w-8 h-8 text-ink-900"/></div><div><h3 className="font-bold text-gray-900">{article.author.name}</h3><p className="text-ink-900 text-sm mb-2">{article.author.role}</p><p className="text-gray-600 text-sm">{article.author.bio}</p></div></div></motion.div>

 {/* Newsletter CTA */}
 <div className="mt-8 bg-gradient-to-r from-ink-900 to-primary-600 p-8 text-white"><div className="flex flex-col md:flex-row items-center gap-6"><div className="flex-1"><h3 className="text-xl font-bold mb-2">Never Miss an Update</h3><p className="text-white/80">Subscribe to our newsletter for the latest news, events, and announcements from BMU.</p></div><NewsletterForm variant="dark" source="news-detail" className="w-full md:w-auto" placeholder="Your email" /></div></div></div>

 {/* Sidebar */}
 <div className="lg:col-span-1"><div className="sticky top-24 space-y-6">
 {/* Related Articles */}
 <div className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-ink-900"/>
 Related Articles
 </h3><div className="space-y-4">
 {ALLOW_API_MOCKS && relatedArticlesData.map((related) => (
 <Link
 key={related.id}
 to={`/news/${related.slug}`}
 className="block group"><h4 className="font-medium text-gray-900 text-sm group- text-ink-900 transition line-clamp-2">
 {related.title}
 </h4><p className="text-xs text-gray-500 mt-1">{related.category} • {related.date}</p></Link>
 ))}
 </div></div>

 {/* Categories */}
 <div className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-primary-600"/>
 Categories
 </h3><div className="space-y-2">
 {['Research', 'Events', 'Achievements', 'Partnerships', 'Academics', 'Community'].map((cat) => (
 <Link
 key={cat}
 to={`/news?category=${cat}`}
 className="flex items-center justify-between py-2 text-ink-900 transition"><span className="text-gray-600">{cat}</span><ChevronRight className="w-4 h-4 text-gray-400"/></Link>
 ))}
 </div></div>

 {/* Quick Links */}
 <div className="bg-white p-6 shadow-sm"><h3 className="font-bold text-gray-900 mb-4">Quick Links</h3><div className="space-y-2"><Link to="/events" className="block py-2 text-gray-600 text-ink-900 transition">
 Upcoming Events
 </Link><Link to="/apply" className="block py-2 text-gray-600 text-ink-900 transition">
 Apply to BMU
 </Link><Link to="/contact" className="block py-2 text-gray-600 text-ink-900 transition">
 Contact Us
 </Link><Link to="/about" className="block py-2 text-gray-600 text-ink-900 transition">
 About BMU
 </Link></div></div></div></div></div></div>

 {/* More Articles Section */}
 <div className="container-custom py-16"><h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles You Might Like</h2><div className="grid md:grid-cols-3 gap-8">
 {ALLOW_API_MOCKS && relatedArticlesData.slice(0, 3).map((article) => (
 <Link
 key={article.id}
 to={`/news/${article.slug}`}
 className="bg-white overflow-hidden shadow-sm transition group"><div className="bg-gray-200 h-48 flex items-center justify-center"><Newspaper className="w-12 h-12 text-gray-400"/></div><div className="p-6"><span className="text-xs text-primary-600 font-medium">{article.category}</span><h3 className="font-bold text-ink-900 mt-2 mb-2 group- text-primary-600 transition line-clamp-2">
 {article.title}
 </h3><p className="text-sm text-ink-900/70 line-clamp-2">{article.excerpt}</p><p className="text-sm text-ink-900/50 mt-4">{article.date}</p></div></Link>
 ))}
 </div></div></div></>
 );
};
