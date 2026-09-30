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

// Safety net: Set a global timeout for all requests to prevent "hanging" 5xx errors
const TIMEOUT_MS = 25000; // 25 seconds (Google crawler timeout is usually around this)

async function startServer() {
  try {
    console.log(`[BOOT] Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`[BOOT] Target Port: ${PORT}`);

    // 1. Logger & Timeout Safety
    app.use((req, res, next) => {
      const start = Date.now();
      
      // Request timeout protection
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          console.error(`🚨 [TIMEOUT] ${req.method} ${req.originalUrl} exceeded ${TIMEOUT_MS}ms`);
          res.status(504).send('Request Timeout');
        }
      }, TIMEOUT_MS);

      res.on('finish', () => {
        clearTimeout(timeout);
        const duration = Date.now() - start;
        if (res.statusCode >= 500) {
          console.error(`🚨 [5XX] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
        } else {
          console.log(`🌐 [REQ] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
        }
      });
      next();
    });

    // 2. Static Serving (High Priority)
    const distPath = path.resolve(__dirname, 'dist');
    if (isProduction && fs.existsSync(distPath)) {
      app.use(express.static(distPath, { 
        maxAge: '1h', 
        index: false,
        redirect: false // Prevent unwanted redirects that might cause loops
      }));
      console.log(`[BOOT] Static assets mapped to ${distPath}`);
    } else if (!isProduction) {
      try {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
        console.log('🚀 Vite dev middleware attached');
      } catch (e) {
        console.warn('⚠️ Vite failed, check dependencies');
      }
    }

    // 3. Catch-all SPA Handler (Must be registered after all other routes)
    app.get('*', async (req, res, next) => {
      // Don't intercept API or static files that should have been caught
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }

      try {
        const indexPath = path.resolve(isProduction ? distPath : __dirname, 'index.html');
        
        if (fs.existsSync(indexPath)) {
          // In production, we send the file directly
          // In development, Vite middleware usually handles this, but we have this as fallback
          return res.sendFile(indexPath);
        } else {
          // Critical fallback to avoid 5xx
          console.warn(`[WARN] index.html not found at ${indexPath}. Sending minimal recovery shell.`);
          return res.status(200).send('<!DOCTYPE html><html><head><title>SH Web Studio</title><meta name="robots" content="noindex"></head><body style="background:#000;color:#fff;text-align:center;padding:50px"><h1>Studio Optimization in Progress</h1><p>Please refresh in a moment.</p></body></html>');
        }
      } catch (e) {
        next(e);
      }
    });

    // 4. Global Error Handler
    app.use(errorHandler);

    // 5. Port Binding
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ [READY] Server listening on http://0.0.0.0:${PORT}`);
    });

    // 6. DB Connection (Background)
    connectDB()
      .then(() => {
        console.log('[DB] Connected. Starting data verification...');
        return seedInitialData();
      })
      .catch(err => {
        console.error('[DB] Failed to initialize storage:', err.message);
        // Note: The app remains running on local storage mode even if DB fails
      });

  } catch (error) {
    console.error('[CRITICAL] Startup failed:', error);
    process.exit(1);
  }
}

// Global Process Resilience
process.on('unhandledRejection', (reason) => {
  console.error('🔥 [Unhandled Rejection]:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('🔥 [Uncaught Exception]:', err);
  // Keep process alive if possible in dev, but in prod we might need to restart
  if (process.env.NODE_ENV === 'production') {
    console.warn('Attempting to stay alive, but process might be unstable.');
  }
});

startServer();
