import { Router } from 'express';
import { getSEO, updateSEO, getSearchConsoleData } from '../controllers/seoController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSEO);
router.put('/', protectAdmin, updateSEO);
router.get('/search-console', protectAdmin, getSearchConsoleData);

export default router;
