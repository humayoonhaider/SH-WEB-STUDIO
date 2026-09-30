import { Router } from 'express';
import {
  validateReferralCode,
  getPublicReferralSettings,
  getMyReferrals,
  getMyStats,
  createWithdrawalRequest,
  getMyWithdrawalRequests,
  cancelWithdrawalRequest,
  requestUserWithdrawal,
} from '../controllers/referralController.js';
import { protectUser } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/validate/:code', validateReferralCode);
router.get('/public-settings', getPublicReferralSettings);

// Authenticated user routes
router.get('/me', protectUser, getMyReferrals);
router.get('/my-stats', protectUser, getMyStats);
router.post('/withdraw', protectUser, requestUserWithdrawal);
router.post('/withdrawal-requests', protectUser, createWithdrawalRequest);
router.get('/withdrawal-requests', protectUser, getMyWithdrawalRequests);
router.post('/withdrawal-requests/:id/cancel', protectUser, cancelWithdrawalRequest);

export default router;
