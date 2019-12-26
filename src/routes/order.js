import { Router } from 'express';

import OrderController from '../controllers/orderController';
import {
  authenticate,
  restrictPermission,
  setField,
} from '../middlewares';

const middlewareForIndex = [
  authenticate('jwt'),
  restrictPermission('customer'),
  setField({ as: 'query.userId', from: 'user._id' }),
];
const middlewareForShow = [
  authenticate('jwt'),
  restrictPermission('customer'),
  setField({ as: 'query.userId', from: 'user._id' }),
];

const router = Router();

/**
 * @swagger
 * /checkouts:
 *  get:
 *    tags:
 *      - 'order'
 *    summary: 'Get list of order'
 *    responses:
 *      200:
 *        description: Detail of order
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 */
router.get('/', middlewareForIndex, OrderController.index);

/**
 * @swagger
 * /orders/{orderId}:
 *  get:
 *    tags:
 *      - 'order'
 *    summary: 'Get order detail'
 *    parameters:
 *      - in: path
 *        name: orderId
 *        description: 'Id of order'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of order
 *        schema:
 *          $ref: '#/definitions/OrderResponse'
 */
router.get('/:id', middlewareForShow, OrderController.show);

export default router;
