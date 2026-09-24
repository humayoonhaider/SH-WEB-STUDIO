import { Router } from 'express';
import {
  getProcessSteps,
  getAllProcessSteps,
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
} from '../controllers/processController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProcessSteps);
router.get('/all', protectAdmin, getAllProcessSteps);
router.post('/', protectAdmin, createProcessStep);
router.put('/:id', protectAdmin, updateProcessStep);
router.delete('/:id', protectAdmin, deleteProcessStep);

export default router;
