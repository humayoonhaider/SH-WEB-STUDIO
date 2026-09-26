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

// Sitemap Generation Logic
app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
    const staticRoutes = [
      '',
      '/services',
      '/work',
      '/about',
      '/reviews',
      '/testimonials',
      '/contact'
    ];

    // Fetch dynamic slugs
    const [projects, services] = await Promise.all([
      ProjectModel.find({ isActive: true }).select('slug updatedAt').lean(),
      ServiceModel.find({ isActive: true }).select('slug updatedAt').lean()
    ]);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Add static routes
    staticRoutes.forEach(route => {
      xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add dynamic project routes
    projects.forEach(project => {
      const lastMod = project.updatedAt ? new Date(project.updatedAt as any).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `
  <url>
    <loc>${baseUrl}/work/${project.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add dynamic service routes
    services.forEach(service => {
      const lastMod = service.updatedAt ? new Date(service.updatedAt as any).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `
  <url>
    <loc>${baseUrl}/services#${service.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic Robots.txt Logic
app.get('/robots.txt', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
  
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
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
