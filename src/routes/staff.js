import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
import StaffController from '../controllers/staffController';

const router = Router();

// router.get('/', UserController.index);

router.post('/', StaffController.create);

router.get('/:id', authenticateJWT, StaffController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

// router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
