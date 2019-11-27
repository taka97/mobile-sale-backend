import { Router } from 'express';
import AuthenticationController from '../controllers/authenticationController';

const router = Router();

/**
 * @swagger
 * /authentication:
 *  post:
 *    tags:
 *      - authentications
 *    summary: Sign in to get accessToken
 *    description: ''
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'User infomation for sign in'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Authentication'
 *    responses:
 *      201:
 *        description: accessToken is created
 *        schema:
 *          $ref: '#/definitions/AuthenticationResponse'
 *      400:
 *        description: Invalid email/username or password
 */
router.post('/', AuthenticationController.create);

export default router;
