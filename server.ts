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

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT !== undefined;

async function startServer() {
  try {
    console.log(`[System] Initializing in ${isProduction ? 'PROD' : 'DEV'} mode...`);

    // Monitor all requests to catch 5xx triggers
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (res.statusCode >= 500) {
          console.error(`🚨 [5XX ERROR] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} (${duration}ms)`);
        } else if (req.path.includes('google') || req.path.includes('sitemap') || req.path.includes('robots')) {
          console.log(`🔍 [SEO-CRAWL] ${req.method} ${req.originalUrl} -> Status: ${res.statusCode} (${duration}ms)`);
        }
      });
      next();
    });

    let vite: any;
    if (!isProduction) {
      try {
        const { createServer: createViteServer } = await import('vite');
        vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
      } catch (e) {
        console.error('[Vite] Failed to start:', e);
      }
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath, { maxAge: '1d', index: false }));
        console.log(`[Static] Serving from ${distPath}`);
      }
    }

    // Catch-all SPA logic
    app.get('*', async (req, res, next) => {
      // Skip API
      if (req.path.startsWith('/api/')) return next();

      try {
        const url = req.originalUrl;
        
        if (!isProduction && vite) {
          const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          const html = await vite.transformIndexHtml(url, template);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } else {
          const distPath = path.resolve(__dirname, 'dist');
          const indexPath = path.resolve(distPath, 'index.html');
          const rootPath = path.resolve(__dirname, 'index.html');
          
          const finalPath = fs.existsSync(indexPath) ? indexPath : rootPath;
          
          if (fs.existsSync(finalPath)) {
            return res.sendFile(finalPath);
          } else {
            // Ultimate fallback to prevent 5xx
            return res.status(200).send(`<!DOCTYPE html><html><head><title>SH Web Studio</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
          }
        }
      } catch (e) {
        next(e);
      }
    });

    // Final error handler
    app.use(errorHandler);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡ Server listening on port ${PORT}`);
    });

    // DB Init
    connectDB()
      .then(() => seedInitialData())
      .catch(err => console.error('[DB] Error during init:', err));

  } catch (error) {
    console.error('[Fatal] Startup crash:', error);
    process.exit(1);
  }
}

// Global Process Handlers
process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

startServer();
