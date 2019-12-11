import { Router } from 'express';

import StaffController from '../controllers/staffController';
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
  restrictPermission('admin', 'staff'),
];
const middlewareForShow = [
  restrictPermission('admin', 'staff'),
];
// const middlewareForPut = [];
const middlewareForPatchUserInfo = [
  restrictPermission('admin', 'staff'),
  restrictToOwner,
  validatorData(changeInfo),
];
const middlewareForPatchPassword = [
  restrictPermission('admin', 'staff'),
  restrictToOwner,
  validatorData(changePassword),
];
const middlewareForDetroy = [
  restrictPermission('admin', 'staff'),
  restrictToOwner,
];

const router = Router();

/**
 * @swagger
 * /staffs:
 *  post:
 *    tags:
 *      - 'staff'
 *    summary: 'Create new staff'
 *    description: >
 *      * For admin (later)
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
 *        description: Create staff is success
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
router.post('/', middlewareForCreate, StaffController.create);

// all router below must authenticate with jwt
router.use(authenticate('jwt'));

/**
 * @swagger
 * /staffs:
 *  get:
 *    tags:
 *      - 'staff'
 *    summary: 'Get list all of staff'
 *    description: >
 *      * For admin
 *      * For all staff in same store
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of staff
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 *      401:
 *        description: You donn't have permission to access
 */
router.get('/', middlewareForIndex, StaffController.index);

/**
 * @swagger
 * /staffs/{userId}:
 *  get:
 *    tags:
 *      - 'staff'
 *    summary: 'Get detail of staff'
 *    description: >
 *      * For admin
 *      * For all staff in same store
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
 *        description: Detail of staff
 *        schema:
 *          $ref: '#/definitions/User'
 *      401:
 *        description: You donn't have permission to access
 *      404:
 *        description: No record found for id `{userId}`
 */
router.get('/:id', middlewareForShow, StaffController.show);

/**
 * @swagger
 * /staffs/{userId}:
 *  patch:
 *    tags:
 *      - 'staff'
 *    summary: 'Change detail of staff'
 *    description: >
 *      * Just for staff (owner)
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
 *        description: Detail of staff (after updated)
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
router.patch('/:id', middlewareForPatchUserInfo, StaffController.patchUserInfo);

/**
 * @swagger
 * /staffs/{userId}/password:
 *  patch:
 *    tags:
 *      - 'staff'
 *    summary: 'Change password of staff'
 *    description: >
 *      * Just for staff (owner)
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
 *        description: Detail of staff (after updated)
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
router.patch('/:id/password', middlewareForPatchPassword, StaffController.patchPassword);

/**
 * @swagger
 * /staffs/{userId}:
 *  delete:
 *    tags:
 *      - 'staff'
 *    summary: 'Delete staff account'
 *    description: >
 *      * For admin (later)
 *      * For staff (owner)
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
router.delete('/:id', middlewareForDetroy, StaffController.destroy);

export default router;
