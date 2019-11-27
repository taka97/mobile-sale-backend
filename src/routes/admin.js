import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
import AdminController from '../controllers/adminController';

const router = Router();

// router.get('/', UserController.index);

router.post('/', AdminController.create);

router.get('/:id', authenticateJWT, AdminController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

// router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
