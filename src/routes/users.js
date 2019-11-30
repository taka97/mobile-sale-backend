import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
/* eslint-disable import/no-named-as-default */
import UserController from '../controllers/userController';

const router = Router();

const userController = UserController();

router.get('/', userController.index);

router.post('/', userController.create);

router.get('/:id', authenticateJWT, userController.show);

router.patch('/:id', authenticateJWT, userController.update);

router.delete('/:id', authenticateJWT, userController.destroy);

export default router;
