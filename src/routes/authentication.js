import { Router } from 'express';
import AuthenticationController from '../controllers/AuthenticationController';

const router = Router();

router.post('/', AuthenticationController.create);

export default router;
