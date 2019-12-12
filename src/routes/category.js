import { Router } from 'express';

import CategoryController from '../controllers/categoryController';
import {
  authenticate,
  restrictPermission,
  validatorData,
} from '../middlewares';
import {
  validateCategory,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  restrictPermission('admin'),
  validatorData(validateCategory),
];
const middlewareForIndex = [
  // restrictPermission('admin')
];
const middlewareForShow = [
  // restrictPermission('admin')
];
// const middlewareForPut = [];
const middlewareForPatch = [
  // restrictPermission('admin'),
  // restrictToOwner,
  // validatorData(changeInfo),
];
const middlewareForDetroy = [
  // restrictPermission('admin'),
  // restrictToOwner,
];

const router = Router();

/**
 * @swagger
 * /categories:
 *  post:
 *    tags:
 *      - 'category'
 *    summary: 'Create new category'
 *    description: >
 *      * For admin
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Data for sign up'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Category'
 *    responses:
 *      201:
 *        description: Create category is success
 *        schema:
 *          $ref: '#/definitions/Category'
 *      400:
 *        description: >
 *          Missing field:
 *            * "email" is required
 *            * "password" is required
 *            * "fullname" is required
 *            * "birthDate" is required
 *            * "sex" is required
 *      403:
 *        description: Category name has already exists!
 */
router.post('/', middlewareForCreate, CategoryController.create);

/**
 * @swagger
 * /categories:
 *  get:
 *    tags:
 *      - 'category'
 *    summary: 'Get list all of category'
 *    description: >
 *      * For admin
 *      * For staff
 *      * For customer
 *      * For guest
 *    produces:
 *      - 'application/json'
 *    responses:
 *      200:
 *        description: List all of category
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 *      401:
 *        description: You donn't have permission to access
 */
router.get('/', middlewareForIndex, CategoryController.index);

/**
 * @swagger
 * /categories/{categoryId}:
 *  get:
 *    tags:
 *      - 'category'
 *    summary: 'Get detail of category'
 *    description: >
 *      * For admin
 *      * For staff
 *      * For customer
 *      * For guest
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        description: 'Id of category'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of category
 *        schema:
 *          $ref: '#/definitions/Categories'
 *      401:
 *        description: You donn't have permission to access
 *      404:
 *        description: No record found for id `{categoryId}`
 */
router.get('/:id', middlewareForShow, CategoryController.show);

/**
 * @swagger
 * /categories/{categoryId}:
 *  patch:
 *    tags:
 *      - 'category'
 *    summary: 'Change detail of category'
 *    description: >
 *      * Just for admin
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        description: 'Id of category'
 *        required: true
 *        schema:
 *          type: byte
 *      - in: body
 *        name: body
 *        description: 'Info that user need change'
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *    responses:
 *      200:
 *        description: Detail of category (after updated)
 *        schema:
 *          $ref: '#/definitions/Category'
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 *      404:
 *        description: 'Invalid data in request'
 */
router.patch('/:id', middlewareForPatch, CategoryController.patch);

/**
 * @swagger
 * /categories/{categoryId}:
 *  delete:
 *    tags:
 *      - 'category'
 *    summary: 'Delete category account'
 *    description: >
 *      * Just for admin
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: categoryId
 *        description: 'Id of category'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      204:
 *        description: Category is deleted
 *      401:
 *        description: >
 *          You donn't have permission
 *            * You donn't have permission to access
 *            * You donn't have permission to modify
 */
router.delete('/:id', middlewareForDetroy, CategoryController.destroy);

export default router;
