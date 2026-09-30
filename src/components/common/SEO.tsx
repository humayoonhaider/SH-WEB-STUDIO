import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSite } from '../../context/SiteContext';
import { getCanonicalUrl } from '../../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  schema?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonical,
  type = 'website',
  schema,
}) => {
  const { settings, seo } = useSite();

  const siteTitle = title ? `${title} | ${settings.businessName || 'SH Web Studio'}` : (seo.metaTitle || 'SH Web Studio | High-Performance Web Development');
  const siteDescription = description || seo.metaDescription || 'SH Web Studio is a premier digital agency specializing in modern React ecosystems, full-stack Node.js applications, and custom business solutions.';
  const siteKeywords = keywords || seo.keywords || 'web development, react, nodejs, custom software, digital studio, pakistan web development';
  const siteOgTitle = ogTitle || siteTitle;
  const siteOgDescription = ogDescription || siteDescription;
  const siteOgImage = ogImage || seo.ogImage || 'https://shwebstudio.up.railway.app/og-image.jpg';
  const siteCanonical = canonical || getCanonicalUrl();

  // Standard JSON-LD for the organization/business
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": settings.businessName || "SH Web Studio",
    "image": siteOgImage,
    "url": "https://shwebstudio.up.railway.app",
    "telephone": settings.phone || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.address || "",
      "addressLocality": "Mardan",
      "addressRegion": "KPK",
      "postalCode": "23200",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.1989,
      "longitude": 72.0461
    },
    "url_link": "https://shwebstudio.up.railway.app",
    "sameAs": [
      settings.linkedinUrl || "",
      settings.githubUrl || "",
      settings.instagramUrl || ""
    ].filter(url => !!url)
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content={settings.businessName || "SH Web Studio"} />
      <meta name="google-site-verification" content="QJcq_H2XFIcZrSRz9nOmXJE5-0BdoYHtPpFDf25EKl8" />
      <link rel="canonical" href={siteCanonical} />
      <meta name="theme-color" content={settings.primaryColor || "#0B0B0F"} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type === 'business' ? 'website' : type} />
      <meta property="og:title" content={siteOgTitle} />
      <meta property="og:description" content={siteOgDescription} />
      <meta property="og:image" content={siteOgImage} />
      <meta property="og:url" content={siteCanonical} />
      <meta property="og:site_name" content={settings.businessName || "SH Web Studio"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteOgTitle} />
      <meta name="twitter:description" content={siteOgDescription} />
      <meta name="twitter:image" content={siteOgImage} />
      <meta name="twitter:creator" content="@shwebstudio" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
