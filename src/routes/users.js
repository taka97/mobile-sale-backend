import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authenticate';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.index);

router.post('/', UserController.create);

router.get('/:id', authenticateJWT, UserController.show);

router.patch('/:id', authenticateJWT, UserController.update);

router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
