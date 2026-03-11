import { Router } from 'express';
import { purchaseController } from '../controllers/purchaseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Admin routes (purchases are no longer public; Stripe checkout is required)
router.post('/', authMiddleware, purchaseController.create);
router.get('/email', authMiddleware, purchaseController.getByEmail);
router.get('/', authMiddleware, purchaseController.getAll);
router.get('/guide/:guideId', authMiddleware, purchaseController.getByGuide);

export default router;
