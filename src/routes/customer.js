import { Router } from 'express';
import CustomerController from '../controllers/customerController';

import {
  authenticate,
  restrictPermission,
  restrictToOwner,
  validatorData,
} from '../middlewares';
import {
  validateUser,
  validateChangeUserInfo as changeInfo,
  validateChangePassword as changePassword,
} from '../utils';

const middlewareForCreate = [validatorData(validateUser)];
const middlewareForIndex = [
  restrictPermission('admin'),
];
const middlewareForShow = [
  restrictPermission('admin', 'customer'),
];
// const middlewareForPut = [];
const middlewareForPatchUserInfo = [
  restrictPermission('admin', 'customer'),
  restrictToOwner,
  validatorData(changeInfo),
];
const middlewareForPatchPassword = [
  restrictPermission('admin', 'customer'),
  restrictToOwner,
  validatorData(changePassword),
];
const middlewareForDetroy = [
  restrictPermission('admin', 'customer'),
  restrictToOwner,
];

const router = Router();

/**
 * @swagger
 * /customers:
 *  post:
 *    tags:
 *      - 'customer'
 *    summary: 'Create new customer'
 *    description: ''
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for sign up'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/User'
 *    responses:
 *      201:
 *        description: Create customer is success
 *        schema:
 *          $ref: '#/definitions/User'
 *      400:
 *        description: >
 *          Missing field:
 *            * "email" is required
 *            * "password" is required
 *            * "fullname" is required
 *            * "birthDate" is required
 *            * "sex" is required
 *      403:
 *        description: That user already exists!
 */
router.post('/', middlewareForCreate, CustomerController.create);

// all router below must authenticate with jwt
router.use(authenticate('jwt'));

/**
 * @swagger
 * /customers:
 *  get:
 *    tags:
 *      - 'customer'
 *    summary: 'Get list all of customer'
 *    description: >
 *      * Just for admin
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of customer
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 *      401:
 *        description: You donn't have permission to access
 */
router.get('/', middlewareForIndex, CustomerController.index);

/**
 * @swagger
 * /customers/{userId}:
 *  get:
 *    tags:
 *      - 'customer'
 *    summary: 'Get detail of customer'
 *    description: >
 *      * For admin
 *      * For customer (owner)
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: 'Id of user'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of customer
 *        schema:
 *          $ref: '#/definitions/User'
 *      401:
 *        description: You donn't have permission to access
 *      404:
 *        description: No record found for id `{userId}`
 */
router.get('/:id', middlewareForShow, CustomerController.show);

/**
 * @swagger
 * /customers/{userId}:
 *  patch:
 *    tags:
 *      - 'customer'
 *    summary: 'Change detail of customer'
 *    description: >
 *      * Just for customer (owner)
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: 'Id of user'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Info that user need change'
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            fullname:
 *              type: string
 *            cmnd:
 *              type: string
 *            address:
 *              type: string
 *            phone:
 *              type: string
 *            birthDate:
 *              type: string
 *            sex:
 *              type: string
 *              enum: ['male', 'female']
 *    responses:
 *      200:
 *        description: Detail of customer (after updated)
 *        schema:
 *          $ref: '#/definitions/User'
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 *      404:
 *        description: 'Invalid data in request'
 */
router.patch('/:id', middlewareForPatchUserInfo, CustomerController.patchUserInfo);

/**
 * @swagger
 * /customers/{userId}/password:
 *  patch:
 *    tags:
 *      - 'customer'
 *    summary: 'Change password of customer'
 *    description: >
 *      * Just for customer (owner)
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: 'Id of user'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Form to change password'
 *        schema:
 *          $ref: '#/definitions/PasswordChange'
 *    responses:
 *      200:
 *        description: Detail of customer (after updated)
 *        schema:
 *          $ref: '#/definitions/User'
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 *      404:
 *        description: 'Invalid data in request'
 */
router.patch('/:id/password', middlewareForPatchPassword, CustomerController.patchPassword);

/**
 * @swagger
 * /customers/{userId}:
 *  delete:
 *    tags:
 *      - 'customer'
 *    summary: 'Delete customer account'
 *    description: >
 *      * For admin (later)
 *      * For customer (owner)
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: 'Id of user'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      204:
 *        description: Account is deleted
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 */
router.delete('/:id', middlewareForDetroy, CustomerController.destroy);

export default router;
