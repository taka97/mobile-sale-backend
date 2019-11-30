import { Router } from 'express';
import { authenticateJWT, restrictPermission } from '../middlewares';
import AdminController from '../controllers/adminController';

const router = Router();

router.post('/', AdminController.create);

router.get('/', authenticateJWT, restrictPermission('admin'), AdminController.index);

router.get('/:id', authenticateJWT, AdminController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

router.delete('/:id?', authenticateJWT, AdminController.destroy);

export default router;
