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
  authenticate('jwt'),
  restrictPermission('admin'),
];

const router = Router();

/**
 * @swagger
 * /products:
 *  post:
 *    tags:
 *      - 'product'
 *    summary: 'Create new products'
 *    description: >
 *      * For admin
 *      * For staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for products'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Product'
 *    responses:
 *      201:
 *        description: Create Product is success
 *        schema:
 *          $ref: '#/definitions/Product'
 *      400:
 *        description: Missing field
 *      403:
 *        description: That name already exists!
 */
router.post('/', middlewareForCreate, ProductController.create);

/**
 * @swagger
 * /products:
 *  get:
 *    tags:
 *      - 'product'
 *    summary: 'Get list all of product'
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of product
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 */
router.get('/', middlewareForIndex, ProductController.index);

/**
 * @swagger
 * /products/{productId}:
 *  get:
 *    tags:
 *      - 'product'
 *    summary: 'Get detail of product'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of product
 *        schema:
 *          $ref: '#/definitions/Product'
 *      404:
 *        description: No record found for id `{productId}`
 */
router.get('/:id', middlewareForShow, ProductController.show);

/**
 * @swagger
 * /products/{productId}:
 *  patch:
 *    tags:
 *      - 'product'
 *    summary: 'Change detail of admin'
 *    description: >
 *      * Just for admin, staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Info that product need change'
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            category:
 *              type: string
 *    responses:
 *      200:
 *        description: Detail of product (after updated)
 *        schema:
 *          $ref: '#/definitions/Product'
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 *      404:
 *        description: 'Invalid data in request'
 */
router.patch('/:id', middlewareForPatch, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/details:
 *  post:
 *    tags:
 *      - 'product'
 *    summary: 'Create new detail for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Data of detail'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            details:
 *              type: array
 *              items:
 *                properties:
 *                  name:
 *                    type: string
 *                  value:
 *                    type: string
 *                required:
 *                  - name
 *                  - value
 *    responses:
 *      200:
 *        description: Create product detail is success
 *        schema:
 *          $ref: '#/definitions/Product'
 *      400:
 *        description: Missing field
 */
router.post('/:id/details', middlewareForPostDetail, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/details/{detailId}:
 *  delete:
 *    tags:
 *      - 'product'
 *    summary: 'Delete detail for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: path
 *        name: detailId
 *        description: 'Id of detail inside product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Delete product detail is success
 *        schema:
 *          $ref: '#/definitions/Product'
 */
router.delete('/:id/details/:detailId', middlewareForDeleteDetail, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/prices:
 *  post:
 *    tags:
 *      - 'product'
 *    summary: 'Create new price for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Data of price'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            prices:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  image:
 *                    type: string
 *                  color:
 *                    type: string
 *                  memory:
 *                    type: string
 *                  warranty:
 *                    type: string
 *                  price:
 *                    type: number
 *                  curentQty:
 *                    type: number
 *                  totalQty:
 *                    type: number
 *                required:
 *                  - image
 *                  - color
 *                  - memory
 *                  - warranty
 *                  - price
 *                  - quantity
 *    responses:
 *      200:
 *        description: Create product prices is success
 *        schema:
 *          $ref: '#/definitions/Product'
 *      400:
 *        description: Missing field
 */
router.post('/:id/prices', middlewareForPostPrice, ProductController.patch);

// router.patch('/:id/prices/:priceId', middlewareForPatchPrice, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/details/{priceId}:
 *  delete:
 *    tags:
 *      - 'product'
 *    summary: 'Delete detail for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: path
 *        name: priceId
 *        description: 'Id of price inside product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Delete product detail is success
 *        schema:
 *          $ref: '#/definitions/Product'
 */
router.delete('/:id/prices/:priceId', middlewareForDeletePrice, ProductController.patch);

/**
 * @swagger
 * /products/{userId}:
 *  delete:
 *    tags:
 *      - 'product'
 *    summary: 'Delete a product'
 *    description: >
 *      * Just for admin
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      204:
 *        description: Product is deleted
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 */
router.delete('/:id', middlewareForDetroy, ProductController.destroy);

export default router;
