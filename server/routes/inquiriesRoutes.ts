import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryAnalytics,
} from '../controllers/inquiriesController.js';
import { protectAdmin } from '../middleware/auth.js';
import { inquiryRateLimiter } from '../middleware/rateLimiter.js';
import { validateInquiry } from '../middleware/validation.js';

const router = Router();

router.post('/', inquiryRateLimiter, validateInquiry, submitInquiry);
router.get('/analytics', protectAdmin, getInquiryAnalytics);
router.get('/', protectAdmin, getInquiries);
router.get('/:id', protectAdmin, getInquiryById);
router.put('/:id', protectAdmin, updateInquiryStatus);
router.delete('/:id', protectAdmin, deleteInquiry);

export default router;
