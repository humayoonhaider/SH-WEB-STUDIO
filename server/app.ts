import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import processRoutes from './routes/processRoutes.js';
import inquiriesRoutes from './routes/inquiriesRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { seedInitialData } from './seed/seedData.js';
import { errorHandler } from './middleware/errorHandler.js';

import { ProjectModel, ServiceModel } from './models/schemas.js';

const app = express();

// Enable reverse proxy trust for Railway / Cloudflare (prevents IP collision and 429 errors)
app.set('trust proxy', true);

// Fast, Cached Sitemap.xml Generator (Supports Dynamic Mongo Slugs with Infallible Static Fallback)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const rawHost = req.headers['x-forwarded-host'] || req.get('host') || 'sh-web-studio.up.railway.app';
    const host = Array.isArray(rawHost) ? rawHost[0] : rawHost.split(',')[0].trim();
    const rawProto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const protocol = Array.isArray(rawProto) ? rawProto[0] : rawProto.split(',')[0].trim();
    
    // Normalize base URL (prefer SITE_URL env if provided, else use request host)
    const baseUrl = (process.env.SITE_URL || `${protocol}://${host}`).replace(/\/$/, '');

    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/services', priority: '0.9', changefreq: 'weekly' },
      { path: '/work', priority: '0.9', changefreq: 'weekly' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/reviews', priority: '0.8', changefreq: 'weekly' },
      { path: '/testimonials', priority: '0.8', changefreq: 'weekly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
      { path: '/process', priority: '0.7', changefreq: 'monthly' },
    ];

    let projects: any[] = [];
    let services: any[] = [];

    // Safely query dynamic models with timeout protection
    try {
      const results = await Promise.race([
        Promise.all([
          ProjectModel.find({ isActive: true }).select('slug updatedAt').lean(),
          ServiceModel.find({ isActive: true }).select('slug updatedAt').lean(),
        ]),
        new Promise<[any[], any[]]>((_, reject) =>
          setTimeout(() => reject(new Error('DB Timeout')), 1500)
        ),
      ]);
      projects = results[0] || [];
      services = results[1] || [];
    } catch {
      // Graceful fallback to static defaults if DB is slow/connecting
      projects = [
        { slug: 'e-commerce-shop', updatedAt: new Date() },
        { slug: 'intelligence-hub', updatedAt: new Date() },
      ];
    }

    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    }

    // Add dynamic project routes
    for (const project of projects) {
      if (project?.slug) {
        const lastMod = project.updatedAt
          ? new Date(project.updatedAt).toISOString().split('T')[0]
          : today;
        xml += `  <url>\n    <loc>${baseUrl}/work/${encodeURIComponent(project.slug)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Absolute fallback so Google Search Console never gets a 429 or 500
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sh-web-studio.up.railway.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sh-web-studio.up.railway.app/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sh-web-studio.up.railway.app/work</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(fallbackXml);
  }
});

// Dynamic Robots.txt Route
app.get('/robots.txt', (req, res) => {
  const rawHost = req.headers['x-forwarded-host'] || req.get('host') || 'sh-web-studio.up.railway.app';
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost.split(',')[0].trim();
  const rawProto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const protocol = Array.isArray(rawProto) ? rawProto[0] : rawProto.split(',')[0].trim();
  const baseUrl = (process.env.SITE_URL || `${protocol}://${host}`).replace(/\/$/, '');

  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(content);
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to avoid issues with inline scripts in dev/pre-rendered apps
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // In development/preview, we allow all. In production, we should restrict this.
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

import { getDBStatusDetails, connectDB } from './config/db.js';

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SH Web Studio API',
    storage: getDBStatusDetails(),
  });
});

app.get('/api/system/storage-status', (_req, res) => {
  res.json({
    success: true,
    data: getDBStatusDetails(),
  });
});

app.post('/api/system/retry-atlas', async (_req, res) => {
  const connected = await connectDB();
  res.json({
    success: connected,
    data: getDBStatusDetails(),
  });
});

app.post('/api/system/seed-defaults', async (req, res) => {
  try {
    const force = req.body.force === true || req.query.force === 'true';
    await seedInitialData(force);
    res.json({ success: true, message: 'Default studio data seeded successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to seed default data.' });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/process', processRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/media', mediaRoutes);

// 404 for unhandled API endpoints
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
