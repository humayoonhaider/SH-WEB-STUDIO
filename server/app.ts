import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
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
import { Project, Service } from './models/index.js';

const app = express();

// Enable reverse proxy trust for Railway / Cloudflare (prevents IP collision and 429 errors)
app.set('trust proxy', true);

// Ultra-fast Sitemap.xml (Serves instantly with static file priority and dynamic fallback)
app.get('/sitemap.xml', async (_req, res) => {
  try {
    // 1. Try serving pre-generated static XML directly (0ms response, zero db dependency)
    const candidates = [
      path.resolve(process.cwd(), 'public', 'sitemap.xml'),
      path.resolve(process.cwd(), 'dist', 'sitemap.xml'),
      path.resolve(process.cwd(), 'sitemap.xml'),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.status(200).send(content);
      }
    }

    // 2. Dynamic Fallback
    const baseUrl = (process.env.SITE_URL || 'https://sh-web-studio.up.railway.app').replace(/\/$/, '');
    const today = new Date().toISOString().split('T')[0];

    let dynamicProjects: any[] = [];
    try {
      dynamicProjects = await Project.find({ isActive: true });
    } catch {
      dynamicProjects = [];
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/work</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/reviews</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/pricing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/process</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/work/e-commerce-shop</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/work/intelligence-hub</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap critical fallback error:', error);
    const hardFallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sh-web-studio.up.railway.app/</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(hardFallback);
  }
});

// Dynamic Robots.txt Route
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const content = fs.readFileSync(robotsPath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(content);
  }

  const defaultRobots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://sh-web-studio.up.railway.app/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(defaultRobots);
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
