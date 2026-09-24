import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', protectAdmin, getDashboardStats);

export default router;
