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
  const errMessage = err?.message || '';
  const isDatabaseError = 
    err?.name === 'MongooseError' || 
    err?.name === 'MongoNetworkError' || 
    err?.name === 'MongoServerSelectionError' ||
    (typeof errMessage === 'string' && (
      errMessage.includes('buffering timed out') || 
      errMessage.includes('selection timed out') ||
      errMessage.includes('connection timed out')
    ));

  if (isDatabaseError) {
    console.warn(`[Storage-Alert] Database issue on ${req.method} ${req.url}: ${errMessage}`);
    
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      statusCode = 503; 
      message = 'The studio is currently optimizing performance. Please check back in a few seconds.';
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
