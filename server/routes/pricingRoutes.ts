import { Router } from 'express';
import {
  getPublicPricing,
  getAllPricing,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from '../controllers/pricingController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicPricing);
router.get('/all', protectAdmin, getAllPricing);
router.post('/', protectAdmin, createPricingPlan);
router.put('/:id', protectAdmin, updatePricingPlan);
router.delete('/:id', protectAdmin, deletePricingPlan);

export default router;
