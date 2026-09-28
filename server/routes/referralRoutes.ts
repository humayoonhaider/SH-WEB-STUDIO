import { Router } from 'express';
import {
  validateReferralCode,
  getPublicReferralSettings,
  getMyReferrals,
  getMyStats,
} from '../controllers/referralController.js';
import { protectUser } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/validate/:code', validateReferralCode);
router.get('/public-settings', getPublicReferralSettings);

// Authenticated user routes
router.get('/me', protectUser, getMyReferrals);
router.get('/my-stats', protectUser, getMyStats);

export default router;
