import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { settingsController } from '../controllers/settingsController';

const router = Router();

router.get('/', authMiddleware, settingsController.get);
router.put('/', authMiddleware, settingsController.update);

export default router;

