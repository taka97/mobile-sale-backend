import { Router } from 'express';

import CartController from '../controllers/cartController';
import {
  authenticate,
  validatorData,
  setField,
  restrictPermission,
} from '../middlewares';
import {
  validateCartAddItem as addItem,
  validateCartUpdateItem as updateItem,
  validateCartRemoveItem as removeItem,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(addItem),
  setField({ as: 'params.userId', from: 'user._id' }),
  setField({ as: 'params.id', from: 'user.cartId', allowUndefined: true }),
];
const middlewareForIndex = [
  authenticate('jwt'),
  restrictPermission('customer'),
  setField({ as: 'params.userId', from: 'user._id' }),
  setField({ as: 'params.id', from: 'user.cartId', allowUndefined: true }),
];
const middlewareForPatch = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(updateItem),
  setField({ as: 'params.id', from: 'user.cartId', allowUndefined: true }),
];
const middlewareForDestroy = [
  authenticate('jwt'),
  restrictPermission('customer'),
  validatorData(removeItem),
  setField({ as: 'params.id', from: 'user.cartId', allowUndefined: true }),
];

const router = Router();

/**
 * @swagger
 * /cart:
 *  post:
 *    tags:
 *      - 'cart'
 *    summary: 'Add item to cart'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for sign up'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            productId:
 *              type: string
 *            priceId:
 *              type: string
 *            qty:
 *              type: number
 *    responses:
 *      201:
 *        description: Add item to cart is success
 *        schema:
 *          $ref: '#/definitions/CartResponse'
 *      400:
 *        description: Missing field
 */
router.post('/', middlewareForCreate, CartController.addItemToCart);

/**
* @swagger
* /cart:
*  get:
*    tags:
*      - 'cart'
*    summary: 'Get item in cart'
*    responses:
*      201:
*        description: Item in cart
*        schema:
*          $ref: '#/definitions/CartResponse'
*/
router.get('/', middlewareForIndex, CartController.getItemInCart);

/**
 * @swagger
 * /cart:
 *  patch:
 *    tags:
 *      - 'cart'
 *    summary: 'Add item to cart'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for update'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            productId:
 *              type: string
 *            priceId:
 *              type: string
 *            qty:
 *              type: number
 *    responses:
 *      201:
 *        description: Update item is success
 *        schema:
 *          $ref: '#/definitions/CartResponse'
 *      400:
 *        description: Missing field
 */
router.patch('/', middlewareForPatch, CartController.updateItemInCart);

/**
 * @swagger
 * /cart:
 *  delete:
 *    tags:
 *      - 'cart'
 *    summary: 'Remove item from cart'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for update'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            productId:
 *              type: string
 *            priceId:
 *              type: string
 *    responses:
 *      201:
 *        description: Update item is success
 *        schema:
 *          $ref: '#/definitions/CartResponse'
 *      400:
 *        description: Missing field
 */
router.delete('/', middlewareForDestroy, CartController.removeItemFromCart);

export default router;
