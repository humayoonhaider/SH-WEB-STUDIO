import crypto from 'crypto';
import { User } from '../models/index.js';

/**
 * Generates a unique referral code like SH-NAME8K2 or SH-7X9Q2P
 */
export async function generateUniqueReferralCode(name = ''): Promise<string> {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'USER';
  
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    const candidate = `SH-${cleanName}${randomSuffix}`.slice(0, 16);
    
    // Check uniqueness in database
    const existing = await User.findOne({ referralCode: candidate });
    if (!existing) {
      return candidate;
    }
  }

  // Fallback purely random if name collisions happen
  const fallback = `SH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  return fallback;
}
