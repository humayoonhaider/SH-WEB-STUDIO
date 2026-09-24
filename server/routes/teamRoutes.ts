import { Router } from 'express';
import {
  getPublicTeam,
  getAllTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getPublicTeam);
router.get('/all', protectAdmin, getAllTeam);
router.post('/', protectAdmin, createTeamMember);
router.put('/:id', protectAdmin, updateTeamMember);
router.delete('/:id', protectAdmin, deleteTeamMember);

export default router;
