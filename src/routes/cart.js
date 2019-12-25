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
  setField({ as: 'params.id', from: 'user.cartId', allowUndefined: true }),
];
const middlewareForIndex = [
  authenticate('jwt'),
  restrictPermission('customer'),
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

router.post('/', middlewareForCreate, CartController.addItemToCart);

router.get('/', middlewareForIndex, CartController.getItemInCart);

router.patch('/', middlewareForPatch, CartController.updateItemInCart);

router.delete('/', middlewareForDestroy, CartController.removeItemFromCart);

export default router;
