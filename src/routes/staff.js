import { Router } from 'express';

import StaffController from '../controllers/staffController';
import {
  authenticate,
  restrictPermission,
  setField,
  restrictToOwner,
  validatorData,
} from '../middlewares';
import {
  validateUser,
  validateChangeUserInfo as changeInfo,
  validateChangePassword as changePassword,
} from '../utils';

const setStoreIdField = setField({
  as: 'query.storeId',
  from: 'user.storeId',
  allowUndefined: true
});

const middlewareForCreate = [validatorData(validateUser)];
const middlewareForIndex = [
  restrictPermission('admin', 'staff'),
  setStoreIdField,
];
const middlewareForShow = [
  restrictPermission('admin', 'staff'),
  setStoreIdField,
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
 * /staff:
 *  post:
 *    tags:
 *      - 'staff'
 *    summary: 'Create new staff'
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

router.get('/', middlewareForIndex, StaffController.index);

router.get('/:id', middlewareForShow, StaffController.show);

router.patch('/:id', middlewareForPatchUserInfo, StaffController.patchUserInfo);

router.patch('/:id/password', middlewareForPatchPassword, StaffController.patchPassword);

router.delete('/:id', middlewareForDetroy, StaffController.destroy);

export default router;
