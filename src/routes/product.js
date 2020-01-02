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
  validateProductAddOption as addOption,
  validateProductCreateDetail as addDetail,
  validateProductCreateImage as addImage,
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
const middlewareForPostOption = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(addOption),
  wrapBodyWith('$addToSet'),
];
const middlewareForDeleteOption = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  removeField('body'),
  setField({ as: 'body.options._id', from: 'params.optionId' }),
  wrapBodyWith('$pull'),
];
const middlewareForPostImage = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  validatorData(addImage),
  uploadImage('images', 'url'),
  wrapBodyWith('$addToSet'),
];
const middlewareForDeleteImage = [
  authenticate('jwt'),
  restrictPermission('admin', 'staff'),
  removeField('body'),
  setField({ as: 'body.images._id', from: 'params.imageId' }),
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
 *            price:
 *              type: number
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
 * /products/{productId}/options:
 *  post:
 *    tags:
 *      - 'product'
 *    summary: 'Create new option for a product'
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
 *        description: 'Data of option'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            options:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  group:
 *                    type: string
 *                  name:
 *                    type: string
 *                  value:
 *                    type: string
 *                required:
 *                  - group
 *                  - name
 *                  - value
 *    responses:
 *      200:
 *        description: Create product option is success
 *        schema:
 *          $ref: '#/definitions/Product'
 *      400:
 *        description: Missing field
 */
router.post('/:id/options', middlewareForPostOption, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/options/{optionId}:
 *  delete:
 *    tags:
 *      - 'product'
 *    summary: 'Delete option for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of option'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: path
 *        name: optionId
 *        description: 'Id of option inside product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Delete product option is success
 *        schema:
 *          $ref: '#/definitions/Product'
 */
router.delete('/:id/options/:optionId', middlewareForDeleteOption, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/images:
 *  post:
 *    tags:
 *      - 'product'
 *    summary: 'Create new image for a product'
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
 *        description: 'Data of image'
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            images:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  url:
 *                    type: string
 *                  caption:
 *                    type: string
 *                required:
 *                  - url
 *    responses:
 *      200:
 *        description: Create product option is success
 *        schema:
 *          $ref: '#/definitions/Product'
 *      400:
 *        description: Missing field
 */
router.post('/:id/images', middlewareForPostImage, ProductController.patch);

/**
 * @swagger
 * /products/{productId}/images/{imageId}:
 *  delete:
 *    tags:
 *      - 'product'
 *    summary: 'Delete image for a product'
 *    description: >
 *      * Just for admin
 *      * Just for staff
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: productId
 *        description: 'Id of image'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: path
 *        name: imageId
 *        description: 'Id of image inside product'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Delete product image is success
 *        schema:
 *          $ref: '#/definitions/Product'
 */
router.delete('/:id/images/:imageId', middlewareForDeleteImage, ProductController.patch);


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
