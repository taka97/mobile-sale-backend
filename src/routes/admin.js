import { Router } from 'express';

import AdminController from '../controllers/adminController';
import {
  authenticate,
  restrictPermission,
  restrictToOwner,
  validatorData,
} from '../middlewares';
import {
  validateUser,
  validateChangeAvatar as changeAvatar,
  validateChangeUserInfo as changeInfo,
  validateChangePassword as changePassword,
} from '../utils';

const middlewareForCreate = [validatorData(validateUser)];
const middlewareForIndex = [restrictPermission('admin')];
const middlewareForShow = [restrictPermission('admin')];
// const middlewareForPut = [];
const middlewareForPatchUserInfo = [
  restrictPermission('admin'),
  restrictToOwner,
  validatorData(changeInfo),
];
const middlewareForPatchPassword = [
  restrictPermission('admin'),
  restrictToOwner,
  validatorData(changePassword),
];
const middlewareForPatchAvatar = [
  restrictPermission('admin'),
  restrictToOwner,
  validatorData(changeAvatar),
];
const middlewareForDetroy = [
  restrictPermission('admin'),
  restrictToOwner,
];

const router = Router();

/**
 * @swagger
 * /admin:
 *  post:
 *    tags:
 *      - 'admin'
 *    summary: 'Create new admin'
 *    description: >
 *      * Just for admin (later)
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
 *        description: Create admin is success
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
router.post('/', middlewareForCreate, AdminController.create);

// all router below must authenticate with jwt
router.use(authenticate('jwt'));

/**
 * @swagger
 * /admin:
 *  get:
 *    tags:
 *      - 'admin'
 *    summary: 'Get list all of admin'
 *    description: >
 *      * Just for admin
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of admin
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 *      401:
 *        description: You donn't have permission to access
 */
router.get('/', middlewareForIndex, AdminController.index);

/**
 * @swagger
 * /admin/{userId}:
 *  get:
 *    tags:
 *      - 'admin'
 *    summary: 'Get detail of admin'
 *    description: >
 *      * Just for admin
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
 *        description: Detail of admin
 *        schema:
 *          $ref: '#/definitions/User'
 *      401:
 *        description: You donn't have permission to access
 *      404:
 *        description: No record found for id `{userId}`
 */
router.get('/:id', middlewareForShow, AdminController.show);

// router.put('/:id', middlewareForPut, AdminController.update);

/**
 * @swagger
 * /admin/{userId}:
 *  patch:
 *    tags:
 *      - 'admin'
 *    summary: 'Change detail of admin'
 *    description: >
 *      * Just for admin (owner)
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
 *        description: Detail of admin (after updated)
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
router.patch('/:id', middlewareForPatchUserInfo, AdminController.patchUserInfo);

/**
 * @swagger
 * /admin/{userId}/password:
 *  patch:
 *    tags:
 *      - 'admin'
 *    summary: 'Change password of admin'
 *    description: >
 *      * Just for admin (owner)
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
 *        description: Detail of admin (after updated)
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
router.patch('/:id/password', middlewareForPatchPassword, AdminController.patchPassword);

/**
 * @swagger
 * /admin/{userId}/avatar:
 *  patch:
 *    tags:
 *      - 'admin'
 *    summary: 'Change avatar of admin'
 *    description: >
 *      * Just for admin (owner)
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
 *            avatarUri:
 *              type: string
 *              format: uri
 *    responses:
 *      200:
 *        description: Detail of admin (after updated)
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
router.patch('/:id/avatar', middlewareForPatchAvatar, AdminController.patchAvatar);

/**
 * @swagger
 * /admin/{userId}:
 *  delete:
 *    tags:
 *      - 'admin'
 *    summary: 'Delete admin account'
 *    description: >
 *      * Just for admin (owner)
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
router.delete('/:id', middlewareForDetroy, AdminController.destroy);

export default router;
