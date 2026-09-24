import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.put('/', protectAdmin, updateSettings);

export default router;
