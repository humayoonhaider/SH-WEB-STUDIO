import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Referral } from '../models/index.js';
import { generateUniqueReferralCode } from '../utils/referralCode.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_shwebstudio_2026';
const JWT_EXPIRES_IN = '30d';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, password, referralCode } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Full name, email address, and password are required.',
      });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    // Validate referral attribution if supplied
    let referringUser: any = null;
    let cleanRefCode = '';
    if (referralCode && typeof referralCode === 'string') {
      cleanRefCode = referralCode.trim().toUpperCase();
      referringUser = await User.findOne({ referralCode: cleanRefCode });
    }

    // Generate unique referral code for this new user
    const newReferralCode = await generateUniqueReferralCode(cleanName);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      passwordHash,
      role: 'user',
      referralCode: newReferralCode,
      referredBy: referringUser ? String(referringUser._id) : '',
      referredByCode: referringUser ? referringUser.referralCode : '',
      paymentDetails: {
        method: '',
        accountHolderName: cleanName,
        bankName: '',
        accountNumber: '',
        routingOrSwift: '',
        notes: '',
      },
      isActive: true,
      lastLogin: new Date(),
    });

    // If referred by another user, create the Referral relationship permanently
    if (referringUser && String(referringUser._id) !== String(user._id)) {
      try {
        await Referral.create({
          referrer: String(referringUser._id),
          referredUser: String(user._id),
          referralCode: referringUser.referralCode,
          status: 'REGISTERED',
          registeredAt: new Date(),
          notes: `Referred via link on ${new Date().toISOString().split('T')[0]}`,
        });
      } catch (refErr) {
        console.warn('Referral creation warning:', refErr);
      }
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const publicBaseUrl = (process.env.SITE_URL || 'https://shwebstudio.up.railway.app').replace(/\/$/, '');

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to SH Web Studio.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        referralCode: user.referralCode,
        referralLink: `${publicBaseUrl}/register?ref=${user.referralCode}`,
        referredBy: user.referredBy,
        referredByCode: user.referredByCode,
        paymentDetails: user.paymentDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Dummy compare to avoid timing analysis
      await bcrypt.compare(password, '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF');
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Update last login
    await User.findByIdAndUpdate(String(user._id), { lastLogin: new Date() });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const publicBaseUrl = (process.env.SITE_URL || 'https://shwebstudio.up.railway.app').replace(/\/$/, '');

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        referralCode: user.referralCode,
        referralLink: `${publicBaseUrl}/register?ref=${user.referralCode}`,
        referredBy: user.referredBy,
        paymentDetails: user.paymentDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const publicBaseUrl = (process.env.SITE_URL || 'https://shwebstudio.up.railway.app').replace(/\/$/, '');

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        referralCode: user.referralCode,
        referralLink: `${publicBaseUrl}/register?ref=${user.referralCode}`,
        referredBy: user.referredBy,
        referredByCode: user.referredByCode,
        paymentDetails: user.paymentDetails || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, company } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name ? { name: String(name).trim() } : {}),
        ...(phone !== undefined ? { phone: String(phone).trim() } : {}),
        ...(company !== undefined ? { company: String(company).trim() } : {}),
      },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        company: updated.company,
        role: updated.role,
        referralCode: updated.referralCode,
        paymentDetails: updated.paymentDetails,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const updatePaymentDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { method, accountHolderName, bankName, accountNumber, routingOrSwift, notes } = req.body;

    const paymentDetails = {
      method: method || 'Bank Transfer',
      accountHolderName: String(accountHolderName || '').trim(),
      bankName: String(bankName || '').trim(),
      accountNumber: String(accountNumber || '').trim(),
      routingOrSwift: String(routingOrSwift || '').trim(),
      notes: String(notes || '').trim(),
    };

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { paymentDetails },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Payout and payment details updated successfully.',
      data: updated.paymentDetails,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update payment details.' });
  }
};
