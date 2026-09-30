/**
 * SEO Utility for SH Web Studio
 * Manages dynamic canonical URLs and metadata generation
 */

const SITE_BASE_URL = 'https://shwebstudio.up.railway.app';

/**
 * Generates a clean canonical URL for the current path
 * @param path Optional specific path. If omitted, uses current window location.
 * @returns Fully qualified absolute URL
 */
export const getCanonicalUrl = (path?: string): string => {
  const currentPath = path || window.location.pathname;
  
  // Remove trailing slashes (except for root) and ensure it starts with /
  let cleanPath = currentPath.replace(/\/$/, '');
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  
  // If it's just root, return base URL
  if (cleanPath === '' || cleanPath === '/') {
    return SITE_BASE_URL;
  }
  
  return `${SITE_BASE_URL}${cleanPath}`;
};

/**
 * Metadata object generator for standardized SEO properties
 */
export const generateMetadata = (options: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) => {
  const { title, description, path, image } = options;
  
  const siteTitle = title ? `${title} | SH Web Studio` : 'SH Web Studio | High-Performance Web Development';
  const siteDescription = description || 'SH Web Studio is a premier digital agency specializing in modern React ecosystems, full-stack Node.js applications, and custom business solutions.';
  const canonicalUrl = getCanonicalUrl(path);
  const ogImage = image || `${SITE_BASE_URL}/og-image.jpg`;

  return {
    title: siteTitle,
    description: siteDescription,
    canonical: canonicalUrl,
    ogImage,
  };
};
