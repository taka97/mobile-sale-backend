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

const router = Router();

router.get('/', authenticateJWT, restrictPermission('admin'), AdminController.index);

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
router.post('/', validatorData(validateUser), AdminController.create);

router.get('/:id', authenticateJWT, AdminController.show);

// router.put('/:id', authenticateJWT, AdminController.update);

router.patch('/:id',
  authenticateJWT,
  restrictPermission('admin'),
  restrictToOwner,
  validatorData(changeInfo),
  AdminController.patchUserInfo);

router.patch('/:id/password',
  authenticateJWT,
  restrictPermission('admin'),
  restrictToOwner,
  validatorData(changePassword),
  AdminController.patchPassword);

router.delete('/:id?', authenticateJWT, AdminController.destroy);

export default router;
