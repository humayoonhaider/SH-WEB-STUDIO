import { Router } from 'express';
import {
  getPublicServices,
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicServices);
router.get('/all', protectAdmin, getAllServices);
router.get('/:id', getServiceById);
router.post('/', protectAdmin, createService);
router.put('/:id', protectAdmin, updateService);
router.delete('/:id', protectAdmin, deleteService);

export default router;
