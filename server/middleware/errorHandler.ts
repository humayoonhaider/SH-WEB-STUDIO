import { Request, Response, NextFunction } from 'express';

/**
 * Standardized Error Handler
 * Designed to prevent 5xx crashes and provide bot-friendly HTML fallbacks
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // Log everything for debugging in Railway/Cloud logs
  console.error(`[ERROR] ${req.method} ${req.url}:`, {
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    headers: req.headers
  });

  // Prevent double response
  if (res.headersSent) {
    return;
  }

  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
    return;
  }

  // If it's a page request, return a clean HTML error page
  // This prevents Google from seeing a raw JSON error or a broken process crash
  res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notice | SH Web Studio</title>
        <meta name="robots" content="noindex, nofollow">
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; background: #0B0B0F; color: #E5E7EB; text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
        <h1 style="font-size: 3rem; color: #3B82F6; margin: 0;">Studio Notice</h1>
        <p style="font-size: 1.25rem; color: #9CA3AF; margin: 1rem 0 2rem;">We are currently optimizing the studio experience. Please try again in a few seconds.</p>
        <a href="/" style="background: #2563EB; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; transition: opacity 0.2s;">Return to Home</a>
      </body>
    </html>
  `);
};
