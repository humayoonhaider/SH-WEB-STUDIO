import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err?.name === 'MongooseError' || err?.name === 'MongoNetworkError' || err?.message?.includes('buffering timed out')) {
    console.warn('[AI Studio] Database offline — returning fallback response');
    if (req.method === 'GET') {
      if (req.path.startsWith('/api/')) {
        res.json({
          success: true,
          data: req.path.endsWith('s') || req.path.endsWith('s/') ? [] : null,
        });
        return;
      }
      // For non-API GET requests (like page loads), let the request continue to the catch-all HTML serving
      // or at least don't return a JSON success response for a page.
      next();
      return;
    }
    res.status(503).json({ success: false, error: 'Service temporarily unavailable (database offline)' });
    return;
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message = err.message || 'An unexpected server error occurred. Please try again.';

  if (statusCode === 500) {
    console.error('Critical Server Error:', err);
  }

  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    // Return a simple HTML error for bots and users instead of JSON
    res.status(statusCode).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${statusCode} - System Maintenance | SH Web Studio</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body style="font-family: sans-serif; padding: 3rem; text-align: center; background: #0B0B0F; color: #E5E7EB;">
          <h1 style="color: #3B82F6;">${statusCode}</h1>
          <h2 style="font-weight: 500;">Server Optimization in Progress</h2>
          <p style="color: #9CA3AF; max-width: 500px; margin: 1rem auto;">${message}</p>
          <div style="margin-top: 2rem;">
            <a href="/" style="background: #2563EB; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600;">Return to Home</a>
          </div>
        </body>
      </html>
    `);
    return;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
