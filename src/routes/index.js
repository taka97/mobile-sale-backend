import { Router } from 'express';

import authenticationRouter from './authentication';
import adminRouter from './admin';
import customerRouter from './customer';
import userRouter from './users';

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
router.use('/customers', customerRouter);
router.use('/users', userRouter);

export default router;
