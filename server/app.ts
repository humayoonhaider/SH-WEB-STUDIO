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
import userAuthRoutes from './routes/userAuthRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import adminReferralRoutes from './routes/adminReferralRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { Project } from './models/index.js';

const app = express();

// 1. Basic Middleware & Security
app.set('trust proxy', true);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 2. Health & SEO Endpoints (High priority, minimal dependency)
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/sitemap.xml', async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'shwebstudio.up.railway.app';
  const baseUrl = `${protocol}://${host}`;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Attempt DB fetch with short timeout
    const projectsPromise = Project.find({ isActive: true });
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));
    
    let projects: any[] = [];
    try {
      projects = await Promise.race([projectsPromise, timeoutPromise]) as any[];
    } catch {
      console.warn('[Sitemap] Using static fallback due to DB delay');
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
      if (p.slug) xml += `\n  <url><loc>${baseUrl}/work/${p.slug}</loc><lastmod>${today}</lastmod><priority>0.7</priority></url>`;
    });

    xml += '\n</urlset>';
    res.header('Content-Type', 'application/xml').send(xml);
  } catch (err) {
    res.status(200).header('Content-Type', 'application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl}/</loc></url></urlset>`);
  }
});

app.get('/robots.txt', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'shwebstudio.up.railway.app';
  res.header('Content-Type', 'text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${protocol}://${host}/sitemap.xml`);
});

// Google Verification Files (Universal)
app.get('/google:code.html', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(`google-site-verification: google${req.params.code}.html`);
});

// 3. API Routes
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

// 4. API Fallback
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

export default app;
