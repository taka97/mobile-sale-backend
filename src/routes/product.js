import { Router } from 'express';

import ProductController from '../controllers/productController';
import {
  authenticate,
  restrictPermission,
  validatorData,
  uploadImage,
  wrapBodyWith,
  setField,
  removeField,
  // addPrefix2PropertyName,
  // toObjectId,
} from '../middlewares';
import {
  validateProductCreate as createProduct,
  validateProductUpdate as changeInfo,
  validateProductAddPrice as addPrice,
  // validateProductUpdatePrice as changePrice,
  validateProductCreateDetail as addDetail,
  // validateCategory,
  // validateChangeCategory as changeInfo,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(createProduct),
];
const middlewareForIndex = [
];
const middlewareForShow = [
];
const middlewareForPatch = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(changeInfo),
];
const middlewareForPostDetail = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(addDetail),
  wrapBodyWith('$addToSet'),
];
const middlewareForDeleteDetail = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  removeField('body'),
  setField({ as: 'body.details._id', from: 'params.detailId' }),
  wrapBodyWith('$pull'),
];
const middlewareForPostPrice = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(addPrice),
  uploadImage('prices', 'image'),
  wrapBodyWith('$addToSet'),
];
// const middlewareForPatchPrice = [
//   authenticate('jwt'),
//   restrictPermission('admin', 'staff'),
//   validatorData(changePrice),
//   uploadImage('image'),
//   // addPrefix2PropertyName('prices.$.'),
//   // setField({ as: 'query.prices._id', from: 'params.priceId' }),
//   wrapBodyWith('$addToSet'),
// ];
const middlewareForDeletePrice = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  removeField('body'),
  setField({ as: 'body.prices._id', from: 'params.priceId' }),
  wrapBodyWith('$pull'),
];
const middlewareForDetroy = [
  // authenticate('jwt'),
  // restrictPermission('admin'),
];

const router = Router();

router.post('/', middlewareForCreate, ProductController.create);

router.get('/', middlewareForIndex, ProductController.index);

router.get('/:id', middlewareForShow, ProductController.show);

router.patch('/:id', middlewareForPatch, ProductController.patch);

router.post('/:id/details', middlewareForPostDetail, ProductController.patch);

router.delete('/:id/details/:detailId', middlewareForDeleteDetail, ProductController.patch);

router.post('/:id/prices', middlewareForPostPrice, ProductController.patch);

// router.patch('/:id/prices/:priceId', middlewareForPatchPrice, ProductController.patch);

router.delete('/:id/prices/:priceId', middlewareForDeletePrice, ProductController.patch);

router.delete('/:id', middlewareForDetroy, ProductController.destroy);

export default router;
