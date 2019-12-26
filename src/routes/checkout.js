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
  setComplete(),
];
const middlewareForShow = [
  authenticate('jwt'),
  restrictPermission('customer'),
];

const router = Router();

router.post('/', middlewareForCreate, CheckoutController.create);

router.get('/:id', middlewareForShow, CheckoutController.show);

router.patch('/:id/address', middlewareForPatchAddress, CheckoutController.update)

router.patch('/:id/shipping', middlewareForPatchShipping, CheckoutController.update);

router.patch('/:id/payment', middlewareForPatchPayment, CheckoutController.update);

router.patch('/:id/complete', middlewareForPatchComplete, CheckoutController.updateWithCompleted);

export default router;
