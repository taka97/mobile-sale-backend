import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
import CustomerController from '../controllers/customerController';

const router = Router();

// router.get('/', UserController.index);

router.post('/', CustomerController.create);

router.get('/:id', authenticateJWT, CustomerController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

// router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
