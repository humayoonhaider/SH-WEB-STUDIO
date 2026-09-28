import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePaymentDetails,
} from '../controllers/userAuthController.js';
import { protectUser } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', protectUser, getMe);
router.put('/profile', protectUser, updateProfile);
router.put('/payment-details', protectUser, updatePaymentDetails);

export default router;
