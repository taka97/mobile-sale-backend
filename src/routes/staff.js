import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
import StaffController from '../controllers/staffController';

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
router.post('/', StaffController.create);

router.get('/', StaffController.index);

router.get('/:id', authenticateJWT, StaffController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

// router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
