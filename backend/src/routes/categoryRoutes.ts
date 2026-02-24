import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin routes
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

export default router;
