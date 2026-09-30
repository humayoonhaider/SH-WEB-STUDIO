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
      res.json({
        success: true,
        data: req.path.endsWith('s') || req.path.endsWith('s/') ? [] : null,
      });
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

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
