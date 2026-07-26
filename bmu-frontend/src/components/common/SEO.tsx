import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export const SEO = ({ 
  title, 
  description, 
  image = 'https://bmu.edu.ng/logo.png', 
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  structuredData 
}: SEOProps) => {
  const fullTitle = `${title} | Bayelsa Medical University`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bayelsa Medical University" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Common structured data templates
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bayelsa Medical University',
  url: 'https://bmu.edu.ng',
  logo: 'https://bmu.edu.ng/logo.png',
  description: 'Bayelsa Medical University - Excellence in Healthcare Education',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yenagoa',
    addressRegion: 'Bayelsa State',
    addressCountry: 'Nigeria'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+234-XXX-XXX-XXXX',
    contactType: 'admissions'
  },
  sameAs: [
    'https://facebook.com/bmu.edu.ng',
    'https://twitter.com/bmu_edu',
    'https://instagram.com/bmu.edu.ng'
  ]
};

export const educationalOrganizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Bayelsa Medical University',
  url: 'https://bmu.edu.ng',
  logo: 'https://bmu.edu.ng/logo.png',
  description: 'Premier medical university in Nigeria offering undergraduate, postgraduate and professional healthcare programs',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yenagoa',
    addressRegion: 'Bayelsa State',
    addressCountry: 'NG'
  }
};

export const createProgramStructuredData = (program: {
  name: string;
  description: string;
  duration: string;
  level: string;
  college?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalProgram',
  name: program.name,
  description: program.description,
  provider: {
    '@type': 'EducationalOrganization',
    name: 'Bayelsa Medical University'
  },
  programType: program.level,
  educationalLevel: program.level,
  timeToComplete: program.duration,
  department: program.college || 'Bayelsa Medical University',
  url: typeof window !== 'undefined' ? window.location.href : ''
});

export const createEventStructuredData = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  location: event.location ? {
    '@type': 'Place',
    name: event.location
  } : undefined,
  image: event.image,
  organizer: {
    '@type': 'Organization',
    name: 'Bayelsa Medical University'
  },
  url: typeof window !== 'undefined' ? window.location.href : ''
});

export const createNewsArticleStructuredData = (article: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.headline,
  description: article.description,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  image: article.image,
  author: article.author ? {
    '@type': 'Organization',
    name: article.author
  } : {
    '@type': 'Organization',
    name: 'Bayelsa Medical University'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Bayelsa Medical University',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bmu.edu.ng/logo.png'
    }
  }
});
