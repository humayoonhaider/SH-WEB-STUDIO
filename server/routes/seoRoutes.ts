import { Router } from 'express';
import { getSEO, updateSEO } from '../controllers/seoController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSEO);
router.put('/', protectAdmin, updateSEO);

export default router;
