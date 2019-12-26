import { Router } from 'express';

import CheckoutController from '../controllers/checkoutController';
import {
  authenticate,
  restrictPermission,
  validatorData,
  removeField,
  setField,
  convertCartToBody,
  setAddress,
  setShipping,
  setPayment,
  setComplete,
} from '../middlewares';
import {
  validateCheckoutAddress as changeAddress,
  validateCheckoutShipping as changeShipping,
  validateCheckoutPayment as changePayment,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  restrictPermission('customer'),
  removeField('body'),
  setField({ as: 'body.userId', from: 'user._id' }),
  setField({ as: 'body.email', from: 'user.email' }),
  convertCartToBody({ from: 'user.cartId' }),
];
const middlewareForPatchAddress = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(changeAddress),
  setAddress(),
];
const middlewareForPatchShipping = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(changeShipping),
  setShipping(),
];
const middlewareForPatchPayment = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(changePayment),
  setPayment(),
];
const middlewareForPatchComplete = [
  authenticate('jwt'),
  restrictPermission('customer'),
  removeField('body'),
  setField({ as: 'params.cartId', from: 'user.cartId' }),
  setComplete(),
];
const middlewareForShow = [
  authenticate('jwt'),
  restrictPermission('customer'),
];

const router = Router();

/**
 * @swagger
 * /checkouts:
 *  post:
 *    tags:
 *      - 'checkout'
 *    summary: 'Step 01 - Create checkout request'
 *    responses:
 *      201:
 *        description: Checkout is created
 *        schema:
 *          $ref: '#/definitions/CheckoutResponse'
 */
router.post('/', middlewareForCreate, CheckoutController.create);

/**
 * @swagger
 * /checkouts/{checkoutId}:
 *  get:
 *    tags:
 *      - 'checkout'
 *    summary: 'Get checkout request'
 *    parameters:
 *      - in: path
 *        name: checkoutId
 *        description: 'Id of checkout'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of checkout
 *        schema:
 *          $ref: '#/definitions/CheckoutResponse'
 */
router.get('/:id', middlewareForShow, CheckoutController.show);

/**
 * @swagger
 * /checkouts/{checkoutId}/address:
 *  patch:
 *    tags:
 *      - 'checkout'
 *    summary: 'Step 02 - Add address'
 *    parameters:
 *      - in: path
 *        name: checkoutId
 *        description: 'Id of checkout'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of checkout
 *        schema:
 *          $ref: '#/definitions/CheckoutResponse'
 */
router.patch('/:id/address', middlewareForPatchAddress, CheckoutController.update);

/**
 * @swagger
 * /checkouts/{checkoutId}/shipping:
 *  patch:
 *    tags:
 *      - 'checkout'
 *    summary: 'Step 03 - Add shipping method'
 *    parameters:
 *      - in: path
 *        name: checkoutId
 *        description: 'Id of checkout'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of checkout
 *        schema:
 *          $ref: '#/definitions/CheckoutResponse'
 */
router.patch('/:id/shipping', middlewareForPatchShipping, CheckoutController.update);

/**
 * @swagger
 * /checkouts/{checkoutId}/payment:
 *  patch:
 *    tags:
 *      - 'checkout'
 *    summary: 'Step 04 - Add payment method'
 *    parameters:
 *      - in: path
 *        name: checkoutId
 *        description: 'Id of checkout'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of checkout
 *        schema:
 *          $ref: '#/definitions/CheckoutResponse'
 */
router.patch('/:id/payment', middlewareForPatchPayment, CheckoutController.update);

/**
 * @swagger
 * /checkouts/{checkoutId}/complete:
 *  patch:
 *    tags:
 *      - 'checkout'
 *    summary: 'Step 05 - Completed checkout'
 *    parameters:
 *      - in: path
 *        name: checkoutId
 *        description: 'Id of checkout'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of order
 *        schema:
 *          $ref: '#/definitions/OrderResponse'
 */
router.patch('/:id/complete', middlewareForPatchComplete, CheckoutController.updateWithCompleted);

export default router;
