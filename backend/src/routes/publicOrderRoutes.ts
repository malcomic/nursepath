import { Router } from 'express';
import { publicOrderController } from '../controllers/publicOrderController';

const router = Router();

router.get('/by-email', publicOrderController.listByEmail);
router.get('/:id', publicOrderController.getStatus);

export default router;

