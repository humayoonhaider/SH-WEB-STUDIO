import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(options: { windowMs: number; maxRequests: number; message: string }) {
  const store: RateLimitStore = {};

  // Cleanup expired IPs every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime < now) {
        delete store[ip];
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction): void => {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'anonymous';
    const now = Date.now();

    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      return next();
    }

    store[ip].count += 1;

    if (store[ip].count > options.maxRequests) {
      const retryAfter = Math.ceil((store[ip].resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests. Please try again later.',
      });
      return;
    }

    next();
  };
}

// 10 login attempts per 15 minutes
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
});

// 10 contact inquiries per 10 minutes
export const inquiryRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many inquiries submitted from this IP. Please wait a few minutes before submitting another.',
});
