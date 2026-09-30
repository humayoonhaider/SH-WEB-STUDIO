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

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('Server Error:', err);
  }

  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    // Return a simple HTML error for bots and users instead of JSON
    res.status(statusCode).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Server Error</title></head>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1>${statusCode} - Server Error</h1>
          <p>${message}</p>
          <a href="/">Go back home</a>
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
