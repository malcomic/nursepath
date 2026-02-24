import { Router } from 'express';
import { purchaseController } from '../controllers/purchaseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', purchaseController.create);
router.get('/email', purchaseController.getByEmail);

// Admin routes
router.get('/', authMiddleware, purchaseController.getAll);
router.get('/guide/:guideId', authMiddleware, purchaseController.getByGuide);

export default router;
