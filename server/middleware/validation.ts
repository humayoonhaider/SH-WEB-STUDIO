import { Request, Response, NextFunction } from 'express';

export const validateInquiry = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, message, honeypot } = req.body;

  // Honeypot spam check - if bots fill the hidden field, reject silently or with error
  if (honeypot) {
    res.status(400).json({ success: false, message: 'Invalid submission.' });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, message: 'Your name is required.' });
    return;
  }

  if (name.length > 100) {
    res.status(400).json({ success: false, message: 'Name must be under 100 characters.' });
    return;
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ success: false, message: 'Please enter a message of at least 5 characters.' });
    return;
  }

  if (message.length > 3000) {
    res.status(400).json({ success: false, message: 'Message is too long (maximum 3000 characters).' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  next();
};
