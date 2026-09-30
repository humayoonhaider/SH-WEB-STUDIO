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
  type?: 'website' | 'article' | 'profile';
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
}) => {
  const { seo } = useSite();

  const siteTitle = title || seo.metaTitle || 'SH Web Studio | High-Performance Web Development';
  const siteDescription = description || seo.metaDescription || 'SH Web Studio is a premier digital agency specializing in modern React ecosystems, full-stack Node.js applications, and custom business solutions.';
  const siteKeywords = keywords || seo.keywords || 'web development, react, nodejs, custom software, digital studio, pakistan web development';
  const siteOgTitle = ogTitle || siteTitle;
  const siteOgDescription = ogDescription || siteDescription;
  const siteOgImage = ogImage || seo.ogImage || 'https://shwebstudio.up.railway.app/og-image.jpg';
  const siteCanonical = canonical || getCanonicalUrl();

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="google-site-verification" content="QJcq_H2XFIcZrSRz9nOmXJE5-0BdoYHtPpFDf25EKl8" />
      <link rel="canonical" href={siteCanonical} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteOgTitle} />
      <meta property="og:description" content={siteOgDescription} />
      <meta property="og:image" content={siteOgImage} />
      <meta property="og:url" content={siteCanonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteOgTitle} />
      <meta name="twitter:description" content={siteOgDescription} />
      <meta name="twitter:image" content={siteOgImage} />
    </Helmet>
  );
};
