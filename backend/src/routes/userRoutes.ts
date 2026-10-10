import { Router } from 'express';
import { getUserProfile, getUserRecords } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:id', authenticate, getUserProfile);
router.get('/:id/records', authenticate, getUserRecords);

export default router;
