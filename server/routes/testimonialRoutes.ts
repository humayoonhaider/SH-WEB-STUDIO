import { Router } from 'express';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitClientReview,
} from '../controllers/testimonialController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getTestimonials);
router.post('/submit', submitClientReview);

// Protected Admin routes
router.get('/admin', protectAdmin, getAllTestimonialsAdmin);
router.post('/', protectAdmin, createTestimonial);
router.put('/:id', protectAdmin, updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);

export default router;
