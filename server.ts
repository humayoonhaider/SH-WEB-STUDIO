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
// Improved production detection for Railway
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT !== undefined || process.env.RAILWAY_STATIC_URL !== undefined;

async function startServer() {
  try {
    console.log(`[Server] Initialization... Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

    let vite: any;
    if (!isProduction) {
      try {
        const { createServer: createViteServer } = await import('vite');
        vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
        console.log('🚀 Vite dev middleware attached');
      } catch (viteErr) {
        console.warn('⚠️ Vite failed to initialize, falling back to static serving:', viteErr);
      }
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath, {
          maxAge: '1d',
          index: false 
        }));
        console.log(`📦 Serving static build from ${distPath}`);
      }
    }

    // SPA Catch-all
    app.get('*', async (req, res, next) => {
      // API routes should have been handled by routers in app.ts
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
          const rootIndexPath = path.resolve(__dirname, 'index.html');
          
          const targetPath = fs.existsSync(indexPath) ? indexPath : rootIndexPath;
          
          if (fs.existsSync(targetPath)) {
            return res.sendFile(targetPath);
          } else {
            return res.status(404).send('Application build missing. Please run build.');
          }
        }
      } catch (e) {
        next(e);
      }
    });

    // Final error handler
    app.use(errorHandler);

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡ Server active on port ${PORT}`);
    });

    // Global Process Crash Prevention
    process.on('unhandledRejection', (reason: any, promise) => {
      console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
      // In production, we don't necessarily want to exit, but we should log it
    });

    process.on('uncaughtException', (error) => {
      console.error('[Process] Uncaught Exception:', error);
      // For uncaught exceptions, it is often safer to exit after logging
      if (isProduction) {
        process.exit(1);
      }
    });

    // Async background tasks
    connectDB().then(() => seedInitialData()).catch(err => console.error('[DB] Background init error:', err));

  } catch (error) {
    console.error('Fatal server error:', error);
    process.exit(1);
  }
}

startServer();
