import { Router } from 'express';
import {
  getPublicProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicProjects);
router.get('/all', protectAdmin, getAllProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);
router.post('/', protectAdmin, createProject);
router.put('/:id', protectAdmin, updateProject);
router.delete('/:id', protectAdmin, deleteProject);

export default router;
