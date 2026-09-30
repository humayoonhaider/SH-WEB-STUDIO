/**
 * SEO Search Engine Notification Utility
 * Pings Google and Bing to re-crawl the sitemap when content changes.
 */

export const pingSearchEngines = async (host?: string) => {
  const baseUrl = host ? `https://${host}` : process.env.SITE_URL || 'https://shwebstudio.up.railway.app';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  console.log(`[SEO] Initiating search engine ping for sitemap: ${sitemapUrl}`);

  const endpoints = [
    {
      name: 'Google',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    },
    {
      name: 'Bing',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    }
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (engine) => {
      try {
        const response = await fetch(engine.url);
        if (response.ok) {
          console.log(`[SEO] Successfully pinged ${engine.name}`);
          return { name: engine.name, success: true };
        } else {
          console.warn(`[SEO] Failed to ping ${engine.name}: ${response.status} ${response.statusText}`);
          return { name: engine.name, success: false, status: response.status };
        }
      } catch (error: any) {
        console.error(`[SEO] Error pinging ${engine.name}:`, error.message);
        return { name: engine.name, success: false, error: error.message };
      }
    })
  );

  return results;
};
