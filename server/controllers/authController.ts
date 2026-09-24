import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_shwebstudio_2026';
const JWT_EXPIRES_IN = '7d';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    console.log(`[Login Attempt] Email: "${cleanEmail}"`);

    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      console.log(`[Login Failed] Admin not found for email: "${cleanEmail}"`);
      // Dummy compare to avoid timing leak
      await bcrypt.compare(password || '', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF');
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    if (!admin.isActive) {
      console.log(`[Login Failed] Admin account is inactive: "${cleanEmail}"`);
      res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password || '', admin.passwordHash);
    if (!isMatch) {
      console.log(`[Login Failed] Password mismatch for: "${cleanEmail}"`);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Update last login
    await Admin.findByIdAndUpdate(String(admin._id), { lastLogin: new Date() });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin account not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email taken by another admin
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing && String(existing._id) !== String(req.admin.id)) {
      res.status(409).json({ success: false, message: 'Email is already in use by another account.' });
      return;
    }

    const updated = await Admin.findByIdAndUpdate(
      req.admin.id,
      { name: name.trim(), email: cleanEmail },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: updated?._id,
        name: updated?.name,
        email: updated?.email,
        role: updated?.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      return;
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin account not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await Admin.findByIdAndUpdate(req.admin.id, { passwordHash });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};
