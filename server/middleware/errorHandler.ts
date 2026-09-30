import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Database Connection / Timeout Errors Specifically
  const isDatabaseError = 
    err?.name === 'MongooseError' || 
    err?.name === 'MongoNetworkError' || 
    err?.name === 'MongoServerSelectionError' ||
    err?.message?.includes('buffering timed out') ||
    err?.message?.includes('selection timed out');

  if (isDatabaseError) {
    console.warn(`[Storage] Database issue detected on ${req.method} ${req.url}: ${err.message}`);
    
    // If it's a GET request and not for the API, we try to serve the page anyway 
    // (the server.ts catch-all will usually handle this, but if we're here, something failed)
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      statusCode = 200; // Fake success or 503? Google prefers 503 for temporary DB issues, 
      // but if we can serve the page with stale/fallback data, 200 is better.
      // However, for pure crash prevention, we'll stick to a clean 503 for crawlers if DB is dead.
      statusCode = 503; 
      message = 'Our services are currently undergoing optimization. Please refresh in a moment.';
    }
  }

  console.error(`[Error] ${req.method} ${req.url}:`, err);

  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.status(statusCode).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${statusCode} - System Notice | SH Web Studio</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0B0B0F; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh;">
          <h1 style="color: #3B82F6; font-size: 3rem; margin-bottom: 0;">${statusCode === 503 ? 'Notice' : statusCode}</h1>
          <h2 style="font-weight: 400; color: #9CA3AF;">${statusCode === 503 ? 'Service Optimization' : 'An error occurred'}</h2>
          <p style="max-width: 500px; line-height: 1.6; color: #6B7280;">${message}</p>
          <a href="/" style="margin-top: 20px; color: #3B82F6; text-decoration: none; border: 1px solid #3B82F6; padding: 10px 20px; border-radius: 8px;">Return to Studio Home</a>
        </body>
      </html>
    `);
    return;
  }

  res.status(statusCode).json({
    success: false,
    message,
    isDatabaseError,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
