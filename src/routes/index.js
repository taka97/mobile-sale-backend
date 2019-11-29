import { Router } from 'express';

import authenticationRouter from './authentication';
import adminRouter from './admin';
import staffRouter from './staff';
import customerRouter from './customer';
// import userRouter from './users';
import seederRouter from './seeder';

const router = Router();

/**
 * @swagger
 * definitions:
 *  Authentication:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *      password:
 *        type: string
 *      strategy:
 *        type: string
 *        default: customer
 *    required:
 *      - email
 *      - password
 *  AuthenticationResponse:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *      accessToken:
 *        type: string
 *      storeId:
 *        type: string
 *        description: returned if user is staff
 *    required:
 *      - userId
 *      - accessToken
 */

router.use('/authentication', authenticationRouter);
router.use('/admin', adminRouter);
router.use('/staffs', staffRouter);
router.use('/customers', customerRouter);
// router.use('/users', userRouter);

router.use('/seeder', seederRouter);

export default router;
