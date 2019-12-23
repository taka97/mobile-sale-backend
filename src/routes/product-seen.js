import { Router } from 'express';

import ProductSeenController from '../controllers/productSeenController';
import {
  authenticate,
  restrictPermission,
  validatorData,
  setField,
} from '../middlewares';
import {
  validateProductSeenCreate as create,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(create),
  setField({ as: 'body.userId', from: 'user._id' }),
];
const middlewareForIndex = [
  authenticate('jwt'),
  restrictPermission('customer'),
  setField({ as: 'query.userId', from: 'user._id' }),
];

const router = Router();

/**
 * @swagger
 * /productSeen:
 *  post:
 *    tags:
 *      - 'productSeen'
 *    summary: 'Create new product-seen'
 *    description: >
 *      * For customer
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for create productSeen'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/ProductSeen'
 *    responses:
 *      201:
 *        description: Create productSeen is success
 *        schema:
 *          $ref: '#/definitions/ProductSeenResponse'
 *      400:
 *        description: Missing field
 */
router.post('/', middlewareForCreate, ProductSeenController.create);

/**
 * @swagger
 * /productSeen:
 *  get:
 *    tags:
 *      - 'productSeen'
 *    summary: 'Get list all of product seen'
 *    description: >
 *      * For customer
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of productSeen
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 */
router.get('/', middlewareForIndex, ProductSeenController.index);

export default router;
