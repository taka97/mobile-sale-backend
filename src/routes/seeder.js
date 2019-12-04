import { Router } from 'express';
import SeederController from '../controllers/seederController';

const router = Router();

router.get('/:action/:numberRecord?', SeederController.index);

export default router;
