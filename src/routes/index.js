import { Router } from 'express';

import authenticationRouter from './authentication';
import userRouter from './users';

const router = Router();

router.use('/authentication', authenticationRouter);
router.use('/users', userRouter);

export default router;
