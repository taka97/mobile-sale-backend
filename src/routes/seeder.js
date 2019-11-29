import { Router } from 'express';
import SeederController from '../controllers/seederController';

const router = Router();

router.get('/:action', SeederController.index);

export default router;
