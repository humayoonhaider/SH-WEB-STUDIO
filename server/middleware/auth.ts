import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin, User } from '../models/index.js';

export interface AuthenticatedRequest extends Request {
  admin?: any;
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_shwebstudio_2026';

// Protect Admin Routes (Only admins and superadmins allowed)
export const protectAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role?: string };
    
    // Check Admin collection first
    const admin = await Admin.findById(decoded.id);

    if (admin && admin.isActive) {
      req.admin = {
        _id: admin._id,
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
      return next();
    }

    // Check User collection if role is admin
    const user = await User.findById(decoded.id);
    if (user && user.isActive && user.role === 'admin') {
      req.admin = {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return next();
    }

    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Session expired or token invalid. Please log in again.',
    });
  }
};

// Protect Public User Routes (For registered users & referral partners)
export const protectUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Please log in to access your account.',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role?: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account not found or inactive.',
      });
      return;
    }

    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      paymentDetails: user.paymentDetails,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Session expired or token invalid. Please log in again.',
    });
  }
};
