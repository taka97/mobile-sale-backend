import { Router } from 'express';
import { authenticateJWT, restrictPermission } from '../middlewares';
import AdminController from '../controllers/adminController';

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
router.post('/', AdminController.create);

router.get('/', authenticateJWT, restrictPermission('admin'), AdminController.index);

router.get('/:id', authenticateJWT, AdminController.show);

router.put('/:id', authenticateJWT, AdminController.update);

// router.patch('/:id', authenticateJWT, UserController.update);

router.delete('/:id?', authenticateJWT, AdminController.destroy);

export default router;
