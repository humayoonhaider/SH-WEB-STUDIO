import { Router } from 'express';
import { login, logout, getMe, updateProfile, updatePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validateLogin } from '../middleware/validation.js';

const router = Router();

router.post('/login', authRateLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.put('/profile', protectAdmin, updateProfile);
router.put('/password', protectAdmin, updatePassword);

export default router;
