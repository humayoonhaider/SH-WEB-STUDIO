import { Router } from 'express';
import { optimizeImage } from '../controllers/mediaController.js';

const router = Router();

// Endpoint for dynamic image optimization (WebP, Resize, Quality)
router.get('/optimize', optimizeImage);

export default router;
