import { Router } from 'express';
import CustomerController from '../controllers/customerController';

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

router.get('/', middlewareForIndex, CustomerController.index);

router.get('/:id', middlewareForShow, CustomerController.show);

router.patch('/:id', middlewareForPatchUserInfo, CustomerController.patchUserInfo);

router.patch('/:id/password', middlewareForPatchPassword, CustomerController.patchPassword);

router.delete('/:id', middlewareForDetroy, CustomerController.destroy);

export default router;
