import { Router } from 'express';
import {
  getAdminReferralStats,
  getAdminReferrals,
  getAdminReferralDetail,
  updateReferralStatus,
  recordQualifyingPayment,
  updateCommissionStatus,
  getAdminReferralSettings,
  updateAdminReferralSettings,
} from '../controllers/adminReferralController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.use(protectAdmin);

router.get('/stats', getAdminReferralStats);
router.get('/settings', getAdminReferralSettings);
router.put('/settings', updateAdminReferralSettings);
router.get('/', getAdminReferrals);
router.get('/:id', getAdminReferralDetail);
router.put('/:id/status', updateReferralStatus);
router.post('/payments', recordQualifyingPayment);
router.put('/commissions/:id/status', updateCommissionStatus);

export default router;
