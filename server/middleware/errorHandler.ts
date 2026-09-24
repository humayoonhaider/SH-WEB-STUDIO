import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
