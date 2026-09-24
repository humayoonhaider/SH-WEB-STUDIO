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
import { seedInitialData } from './seed/seedData.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

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

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

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

// 404 for unhandled API endpoints
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Centralized error handler
app.use(errorHandler);

export default app;
