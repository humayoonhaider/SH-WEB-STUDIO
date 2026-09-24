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
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      const express = (await import('express')).default;
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log(`📦 Serving production build from ${distPath}`);
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
