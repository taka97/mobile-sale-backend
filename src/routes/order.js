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

router.get('/', middlewareForIndex, OrderController.index);

router.get('/:id', middlewareForShow, OrderController.show);

export default router;
