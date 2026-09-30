import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import fs from 'fs';
import app from './server/app.js';
import { connectDB } from './server/config/db.js';
import { seedInitialData } from './server/seed/seedData.js';
import { errorHandler } from './server/middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we pick up the correct PORT from Railway
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT !== undefined;

async function startServer() {
  try {
    console.log(`[DEPLOY-LOG] Starting Server...`);
    console.log(`[DEPLOY-LOG] Mode: ${isProduction ? 'PROD' : 'DEV'}`);
    console.log(`[DEPLOY-LOG] Port: ${PORT}`);

    // 1. Detailed Request Logging for Debugging
    app.use((req, res, next) => {
      const start = Date.now();
      const ua = req.get('User-Agent') || 'Unknown';
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (res.statusCode >= 500) {
          console.error(`🚨 [5XX-DETECTOR] ${req.method} ${req.url} | Status: ${res.statusCode} | Duration: ${duration}ms | UA: ${ua}`);
        } else if (req.url.includes('sitemap') || req.url.includes('robots') || req.url.includes('google')) {
          console.log(`🔍 [SEO-VISIT] ${req.method} ${req.url} | Status: ${res.statusCode} | Duration: ${duration}ms | UA: ${ua}`);
        }
      });
      next();
    });

    // 2. Static Content Configuration
    const distPath = path.resolve(__dirname, 'dist');
    
    if (isProduction) {
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath, { 
          maxAge: '1h', 
          index: false,
          redirect: false 
        }));
        console.log(`[DEPLOY-LOG] Static assets served from: ${distPath}`);
      } else {
        console.warn(`[DEPLOY-LOG] WARNING: dist folder not found at ${distPath}`);
      }
    } else {
      try {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
        console.log('[DEPLOY-LOG] Vite dev middleware active');
      } catch (e) {
        console.warn('[DEPLOY-LOG] Vite init failed, check node_modules');
      }
    }

    // 3. Catch-all HTML Route (SPA Support)
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }

      try {
        const indexPath = path.resolve(isProduction && fs.existsSync(distPath) ? distPath : __dirname, 'index.html');
        
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        } else {
          // Absolute fallback to prevent 5xx if build fails
          console.warn(`[DEPLOY-LOG] index.html missing. Serving recovery shell.`);
          res.status(200).send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>SH Web Studio</title></head><body style="background:#0b0b0f;color:#fff;text-align:center;padding:50px"><h1>Studio Optimization</h1><p>The studio is being prepared. Please refresh in a moment.</p></body></html>');
        }
      } catch (e) {
        next(e);
      }
    });

    // 4. Global Error Handler
    app.use(errorHandler);

    // 5. Start Listening
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 [DEPLOY-LOG] Server is READY and listening on port ${PORT}`);
    });

    // 6. DB Connection (Non-blocking)
    connectDB().then(() => seedInitialData()).catch(err => console.error(`[DEPLOY-LOG] DB Init Error: ${err.message}`));

  } catch (error) {
    console.error('[DEPLOY-LOG] FATAL CRASH DURING STARTUP:', error);
    process.exit(1);
  }
}

// Global Safety Net
process.on('unhandledRejection', (reason) => {
  console.error('[DEPLOY-LOG] UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[DEPLOY-LOG] UNCAUGHT EXCEPTION:', err);
  if (isProduction) process.exit(1);
});

startServer();
