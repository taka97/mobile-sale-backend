import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
/* eslint-disable import/no-named-as-default */
import UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.index);

router.post('/', UserController.create);

router.get('/:id', authenticateJWT, UserController.show);

router.patch('/:id', authenticateJWT, UserController.update);

router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
