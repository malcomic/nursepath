import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { orderController } from '../controllers/orderController';

const router = Router();

// Admin routes
router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getById);
router.post('/:id/resend-link', authMiddleware, orderController.resendLink);
router.post('/:id/regenerate-link', authMiddleware, orderController.regenerateLink);
router.post('/:id/refund', authMiddleware, orderController.refund);
router.delete('/:id', authMiddleware, orderController.delete);

export default router;

