import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './server/app.js';
import { connectDB } from './server/config/db.js';
import { seedInitialData } from './server/seed/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
console.log(`[Server] Environment: ${process.env.NODE_ENV}, isProduction: ${isProduction}`);

async function startServer() {
  try {
    // 1. Setup Vite in development or serve static in production
    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('🚀 Vite dev middleware attached');

      // Fallback to serving index.html if Vite doesn't catch it
      app.get('*', async (req, res, next) => {
        try {
          const url = req.originalUrl;
          const fs = await import('fs');
          const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          const html = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          next(e);
        }
      });
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      const express = (await import('express')).default;
      const fs = await import('fs');

      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath, {
          maxAge: '1d',
          index: false // We handle index via catch-all
        }));

        app.get('*', (req, res) => {
          const indexPath = path.resolve(distPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            console.error('❌ Production index.html missing at:', indexPath);
            res.status(500).send('Production build is incomplete. Please run npm run build.');
          }
        });
        console.log(`📦 Serving production build from ${distPath}`);
      } else {
        console.warn('⚠️ dist directory not found. Fallback to serving index.html from root.');
        app.get('*', (_req, res) => {
          const indexPath = path.resolve(__dirname, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            res.status(500).send('No build found and root index.html missing. Please run npm run build.');
          }
        });
      }
    }

    // 2. Start Listening (Immediate responsiveness)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡ Server running on http://0.0.0.0:${PORT}`);
      console.log(`🛡️  Admin route accessible at http://0.0.0.0:${PORT}/admin/login`);
    });

    // 3. Initialize DB & auto-seed baseline data (Background)
    (async () => {
      try {
        console.log('[Storage] Attempting database initialization...');
        await connectDB();
        await seedInitialData();
      } catch (dbErr) {
        console.warn('⚠️ Warning during DB connect/seed, operating in persistent local storage mode:', dbErr);
      }
    })();
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
