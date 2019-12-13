import { Router } from 'express';

import authenticationRouter from './authentication';
import adminRouter from './admin';
import staffRouter from './staff';
import customerRouter from './customer';
import categoryRouter from './category';
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
 *        example: 'admin@gmail.com'
 *      password:
 *        type: string
 *        example: 'Abc12345'
 *      strategy:
 *        type: string
 *        default: customer
 *        example: 'admin'
 *        enum: ['customer', 'staff', 'admin']
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
 *    required:
 *      - userId
 *      - accessToken
 *  PasswordChange:
 *    type: object
 *    properties:
 *      oldPassword:
 *        type: string
 *      newPassword:
 *        type: string
 *      repeatPassword:
 *        type: string
 *    required:
 *      - oldPassword
 *      - newPassword
 *      - repeatPassword
 *  User:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *      username:
 *        type: string
 *      fullname:
 *        type: string
 *      avatar:
 *        type: string
 *      cmnd:
 *        type: string
 *      address:
 *        type: string
 *      phone:
 *        type: string
 *      birthDate:
 *        type: string
 *      sex:
 *        type: string
 *        enum: ['male', 'female']
 *    required:
 *      - email
 *      - fullname
 *      - birthDate
 *      - sex
 *  UserResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      email:
 *        type: string
 *      username:
 *        type: string
 *      avatar:
 *        type: string
 *      fullname:
 *        type: string
 *      cmnd:
 *        type: string
 *      address:
 *        type: string
 *      phone:
 *        type: string
 *      birthDate:
 *        type: string
 *      sex:
 *        type: string
 *        enum: ['male', 'female']
 *      roles:
 *        type: string
 *        enum: ['customer', 'staff', 'admin']
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 *  QueryResponse:
 *    type: object
 *    properties:
 *      total:
 *        type: integer
 *      limit:
 *        type: integer
 *      skip:
 *        type: integer
 *      data:
 *        type: array
 *        items:
 *          type: object
 *  Category:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *    required:
 *      - name
 *  CategoryResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 */

router.use('/authentication', authenticationRouter);
router.use('/admin', adminRouter);
router.use('/staffs', staffRouter);
router.use('/customers', customerRouter);
router.use('/categories', categoryRouter);

router.use('/seeder', seederRouter);

export default router;
