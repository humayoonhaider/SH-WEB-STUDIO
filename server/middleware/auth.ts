import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';

export interface AuthenticatedRequest extends Request {
  admin?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_shwebstudio_2026';

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

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or inactive admin account.',
      });
      return;
    }

    req.admin = {
      _id: admin._id,
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Session expired or token invalid. Please log in again.',
    });
  }
};
