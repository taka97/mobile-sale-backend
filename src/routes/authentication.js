import { Router } from 'express';
import AuthenticationController from '../controllers/authenticationController';

const router = Router();

router.post('/', AuthenticationController.create);

export default router;
