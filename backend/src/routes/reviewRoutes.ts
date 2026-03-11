import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { reviewController } from '../controllers/reviewController';

const router = Router();

router.get('/', authMiddleware, reviewController.getAllForAdmin);

export default router;
