import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, ShieldCheck, FileText } from 'lucide-react';

interface LegalSection {
  title: string;
  body: string;
}

interface LegalBodyProps {
  intro: string;
  sections: LegalSection[];
  updatedLabel: string;
}

const LegalHero: React.FC<{ pageName: string; title: React.ReactNode }> = ({ pageName, title }) => {
  return (
    <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="container-custom relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">{pageName}</span>
          </div>
          <h1 className="text-display text-white mb-6">{title}</h1>
        </motion.div>
      </div>
    </section>
  );
};

const LegalBody: React.FC<LegalBodyProps> = ({ intro, sections, updatedLabel }) => {
  return (
    <section className="py-16">
      <div className="container-custom max-w-4xl">
        <p className="text-lg text-gray-700 leading-relaxed mb-8">{intro}</p>
        <p className="inline-block text-sm text-gray-500 bg-gray-100 px-3 py-1.5 mb-10">{updatedLabel}</p>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const privacySections: LegalSection[] = [
  {
    title: 'Information We Collect',
    body: 'We collect information you provide directly, such as your name, email address, telephone number, programme of interest and application details when you submit forms on this website. We also automatically collect limited technical information including your browser type, device and IP address to operate and improve our services.'
  },
  {
    title: 'How We Use Your Information',
    body: 'Information you provide is used to process applications and enquiries, respond to your requests, deliver admissions communications, and improve the services we offer. Where required, we may use your contact details to send you important notices about your application, events and university updates. You may opt out of non-essential communications at any time.'
  },
  {
    title: 'Information We Never Collect',
    body: 'We do not ask for or store payment card numbers (CVC or full PAN) on our servers. Payments are processed by trusted third-party gateways such as Paystack, subject to their own privacy and security policies.'
  },
  {
    title: 'Cookies and Analytics',
    body: 'We use essential cookies required for the site to function and anonymised analytics to understand how visitors use our website. You can disable cookies in your browser, though some parts of the site may then not function correctly.'
  },
  {
    title: 'Data Sharing',
    body: 'We do not sell or rent your personal information. We share data only with service providers that help us operate this website (hosting, email delivery, secure payment processing) and where we are required to do so by law.'
  },
  {
    title: 'Data Retention and Security',
    body: 'We keep personal information only for as long as necessary for the purposes described in this policy or as required by applicable regulations. We apply reasonable technical and organisational measures to protect your information from unauthorised access, loss or alteration.'
  },
  {
    title: 'Your Rights',
    body: 'You may request access to, correction of, or deletion of the personal information we hold about you by contacting our data protection contact below. We will respond to verified requests within a reasonable timeframe.'
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this policy from time to time. Material changes will be reflected on this page, and we encourage you to review it periodically.'
  },
];

const termsSections: LegalSection[] = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing and using this website, you agree to these Terms of Use. If you do not agree with any part of these terms, please discontinue use of the site.'
  },
  {
    title: 'Use of Website Content',
    body: 'Content published on this website, including text, imagery, documents and course information, is provided for general information about Bayelsa Medical University. It is not intended as legal, financial or medical advice, and programme details may change. You may not reproduce site content for commercial purposes without prior written permission.'
  },
  {
    title: 'Applications and Admissions',
    body: 'Information submitted through the application portal must be genuine and complete. Submitting false or misleading information may result in the rejection of an application, the withdrawal of an offer, or the discontinuation of any associated admission. Payment made toward an application is non-refundable once an application has been submitted.'
  },
  {
    title: 'Third-Party Services',
    body: 'Where this website links to third-party services (such as secure payment gateways or partner websites), those services operate under their own terms and privacy policies, and we are not responsible for their content or practices.'
  },
  {
    title: 'Availability and Security',
    body: 'We aim to keep the website available and secure, but we do not warrant that access will be uninterrupted or error-free. You are responsible for safeguarding your login credentials and for activity that occurs under your account.'
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, Bayelsa Medical University shall not be liable for any indirect, incidental or consequential loss arising from the use of, or inability to use, this website, including reliance on any information contained within it.'
  },
  {
    title: 'Intellectual Property',
    body: 'The Bayelsa Medical University name, logo and all trademarks, service marks and site design are the property of Bayelsa Medical University and may not be used without prior written consent.'
  },
  {
    title: 'Governing Law',
    body: 'These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bayelsa State.'
  },
  {
    title: 'Contact',
    body: 'Questions about these Terms of Use should be directed to the University Registrar at registrar@bmu.edu.ng.'
  },
];

interface SitemapSection {
  label: string;
  links: { label: string; path: string }[];
}

const sitemapSections: SitemapSection[] = [
  {
    label: 'About BMU',
    links: [
      { label: 'Overview', path: '/about' },
      { label: 'Our History', path: '/about/history' },
      { label: 'Vision & Mission', path: '/about/vision-mission' },
      { label: 'Governance', path: '/about/governance' },
      { label: 'Leadership', path: '/about/leadership' },
      { label: 'Our Staff', path: '/about/staff' },
      { label: 'Public Documents', path: '/about/documents' },
      { label: 'Campus Life', path: '/about/campus' },
    ],
  },
  {
    label: 'Academics',
    links: [
      { label: 'Colleges', path: '/academics/colleges' },
      { label: 'Programmes', path: '/academics/programs' },
      { label: 'Faculties', path: '/academics/faculties' },
      { label: 'Academic Departments', path: '/academics/departments' },
      { label: 'Academic Calendar', path: '/academics/calendar' },
      { label: 'Admissions', path: '/academics/admissions' },
      { label: 'Library', path: '/academics/library' },
    ],
  },
  {
    label: 'Research',
    links: [
      { label: 'Research Overview', path: '/research' },
      { label: 'Research Centres', path: '/research/centers' },
      { label: 'Publications', path: '/research/publications' },
      { label: 'Research Funding', path: '/research/funding' },
      { label: 'Collaborations', path: '/research/collaborations' },
      { label: 'Innovation & Technology', path: '/research/innovation' },
      { label: 'University Projects', path: '/research/university-projects' },
      { label: 'Faculty Directory', path: '/research/faculty' },
    ],
  },
  {
    label: 'Admissions & Apply',
    links: [
      { label: 'How to Apply', path: '/apply' },
      { label: 'Application Portal', path: '/apply/portal' },
      { label: 'Check Application Status', path: '/apply/status' },
    ],
  },
  {
    label: 'News & Events',
    links: [
      { label: 'News & Articles', path: '/news' },
      { label: 'Announcements', path: '/news/announcements' },
      { label: 'Press Releases', path: '/news/press-releases' },
      { label: 'Events', path: '/events' },
      { label: 'Event Calendar', path: '/events/calendar' },
      { label: 'Past Events', path: '/events/past' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  {
    label: 'Campus & Community',
    links: [
      { label: 'Impact & SDGs', path: '/impact' },
      { label: 'Sustainability', path: '/impact/sustainability' },
      { label: 'Community Engagement', path: '/impact/community' },
      { label: 'International Relations', path: '/international' },
      { label: 'Exchange Programmes', path: '/international/exchange' },
      { label: 'International Students', path: '/international/students' },
      { label: 'Visitors', path: '/international/visitors' },
    ],
  },
  {
    label: 'Institutes & Centres',
    links: [
      { label: 'Career Centre', path: '/centres/career' },
      { label: 'CPD Centre', path: '/centres/cpd' },
      { label: 'Foundation Studies', path: '/centres/foundation-studies' },
      { label: 'Innovation Centre', path: '/centres/innovation' },
      { label: 'Foreign Languages', path: '/institutes/foreign-languages' },
      { label: 'Research Institutes', path: '/institutes/research' },
      { label: 'Jobs', path: '/careers/jobs' },
    ],
  },
  {
    label: 'Portals & Contact',
    links: [
      { label: 'Portals Home', path: '/portals' },
      { label: 'Applicant Portal', path: '/portals/applicant' },
      { label: 'Frequently Asked Questions', path: '/faq' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Use', path: '/terms' },
      { label: 'Search', path: '/search' },
    ],
  },
];

export const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Bayelsa Medical University</title>
        <meta name="description" content="How Bayelsa Medical University collects, uses and protects the personal information you share through this website." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <LegalHero pageName="Privacy Policy" title={<>Privacy <span className="text-primary-600">Policy</span></>} />
      <LegalBody
        intro="Bayelsa Medical University respects your privacy. This policy explains what information we collect when you use our website, how we use and protect it, and the choices you have."
        sections={privacySections}
        updatedLabel="Last updated: January 2026"
      />
      <section className="pb-16">
        <div className="container-custom max-w-4xl bg-ink-900 text-white p-8">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Contact Our Data Protection Team</h3>
          <p className="text-white/80">For privacy questions or requests, email <a href="mailto:webmaster@bmu.edu.ng" className="underline">webmaster@bmu.edu.ng</a>.</p>
        </div>
      </section>
    </>
  );
};

export const TermsOfUse = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Use | Bayelsa Medical University</title>
        <meta name="description" content="Terms and conditions governing your use of the Bayelsa Medical University website." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <LegalHero pageName="Terms of Use" title={<>Terms of <span className="text-primary-600">Use</span></>} />
      <LegalBody
        intro="These Terms of Use govern your access to and use of the Bayelsa Medical University website. By using this site, you agree to be bound by these terms."
        sections={termsSections}
        updatedLabel="Last updated: January 2026"
      />
      <section className="pb-16">
        <div className="container-custom max-w-4xl bg-ink-900 text-white p-8">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FileText className="w-5 h-5" /> Legal Requests</h3>
          <p className="text-white/80">Contact the Office of the Registrar at <a href="mailto:registrar@bmu.edu.ng" className="underline">registrar@bmu.edu.ng</a>.</p>
        </div>
      </section>
    </>
  );
};

export const SitemapPage = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap | Bayelsa Medical University</title>
        <meta name="description" content="Browse all sections and pages of the Bayelsa Medical University website." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <LegalHero pageName="Sitemap" title={<>Site <span className="text-primary-600">Map</span></>} />
      <section className="py-16">
        <div className="container-custom max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sitemapSections.map((group) => (
              <div key={group.label}>
                <h2 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b-2 border-primary-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  {group.label}
                </h2>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition text-sm"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};