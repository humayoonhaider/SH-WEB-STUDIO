import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
import userAuthRoutes from './routes/userAuthRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import adminReferralRoutes from './routes/adminReferralRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { Project } from './models/index.js';

const app = express();

// Basic Server Settings
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security & CORS
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins but echo them back for credentials support
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 1. Health Check (Immediate response, no DB, critical for Railway)
app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 2. Optimized Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'sh-web-studio.up.railway.app';
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];

    let projects: any[] = [];
    try {
      projects = await Project.find({ isActive: true });
    } catch (e) {
      console.warn('[Sitemap] DB fallback used');
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${baseUrl}/services</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/work</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/about</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/contact</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/pricing</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>
  <url><loc>${baseUrl}/referral-program</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`;

    projects.forEach(p => {
      xml += `\n  <url><loc>${baseUrl}/work/${p.slug || p._id}</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>`;
    });

    xml += '\n</urlset>';
    res.header('Content-Type', 'application/xml').send(xml);
  } catch (error) {
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://sh-web-studio.up.railway.app/</loc></url></urlset>');
  }
});

// 3. Robots.txt
app.get('/robots.txt', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'sh-web-studio.up.railway.app';
  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /register

Sitemap: ${protocol}://${host}/sitemap.xml`;
  res.header('Content-Type', 'text/plain').send(content);
});

// 4. Google Verification
app.get('/google:code.html', (req, res) => {
  const code = req.params.code;
  // Common format is just the code, but some prefer the full string. 
  // We send the full string as per the user's manual check.
  res.send(`google-site-verification: google${code}.html`);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin/referrals', adminReferralRoutes);
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
app.use('/api/chat', chatRoutes);

// API 404
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

export default app;
