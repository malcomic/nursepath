import { Router } from 'express';
import { guideController } from '../controllers/guideController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', guideController.getAll);
router.get('/search', guideController.search);
router.get('/:id', guideController.getById);
router.get('/category/:categoryId', guideController.getByCategory);

// Admin routes
router.post('/', authMiddleware, guideController.create);
router.put('/:id', authMiddleware, guideController.update);
router.delete('/:id', authMiddleware, guideController.delete);

export default router;
