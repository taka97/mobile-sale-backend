import { Router } from 'express';
import { authenticateJWT } from '../middlewares';
import CustomerController from '../controllers/customerController';

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
router.post('/', CustomerController.create);

// router.get('/', UserController.index);

router.get('/:id', authenticateJWT, CustomerController.show);

// router.patch('/:id', authenticateJWT, UserController.update);

// router.delete('/:id', authenticateJWT, UserController.destroy);

export default router;
