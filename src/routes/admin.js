import { Router } from 'express';

import AdminController from '../controllers/adminController';
import {
  authenticateJWT,
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

// all router below must authanticate with jwt
router.use(authenticateJWT);

router.get('/', middlewareForIndex, AdminController.index);

router.get('/:id', middlewareForShow, AdminController.show);

// router.put('/:id', middlewareForPut, AdminController.update);

router.patch('/:id', middlewareForPatchUserInfo, AdminController.patchUserInfo);

router.patch('/:id/password', middlewareForPatchPassword, AdminController.patchPassword);

router.delete('/:id', middlewareForDetroy, AdminController.destroy);

export default router;
