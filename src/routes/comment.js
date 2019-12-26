import { Router } from 'express';

import CommentController from '../controllers/commentController';
import {
  authenticate,
  validatorData,
  validatorQuery,
  setField,
  setValue,
} from '../middlewares';
import {
  validateCommentCreateParent as create,
  validateCommentGetList as getList,
} from '../utils';

const middlewareForCreate = [
  authenticate('jwt'),
  validatorData(create),
  setField({ as: 'body.author', from: 'user._id' }),
];
const middlewareForIndex = [
  authenticate('jwt'),
  validatorQuery(getList),
  setValue({ field: 'query.parentId', value: undefined, isDefault: true }),
];
const middlewareForShow = [
  authenticate('jwt'),
  validatorQuery(getList),
];
// const middlewareForPatch = [
// ];
// const middlewareForDetroy = [
// ];

const router = Router();

/**
 * @swagger
 * /comments:
 *  post:
 *    tags:
 *      - 'comment'
 *    summary: 'Create new comment'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: body
 *        name: body
 *        description: 'Id of product'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Comment'
 *    responses:
 *      201:
 *        description: Create comment is success
 *        schema:
 *          $ref: '#/definitions/Comment'
 */
router.post('/', middlewareForCreate, CommentController.create);

/**
 * @swagger
 * /comments:
 *  get:
 *    tags:
 *      - 'comment'
 *    summary: 'Get list of comment'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: query
 *        name: productId
 *        description: 'Id of product'
 *        required: true
 *      - in: query
 *        name: parentId
 *        description: 'If of parent comment'
 *    responses:
 *      201:
 *        description: List all of comment
 *        schema:
 *          $ref: '#/definitions/QueryResponse'
 */
router.get('/', middlewareForIndex, CommentController.index);

/**
 * @swagger
 * /comment/{commentId}:
 *  get:
 *    tags:
 *      - 'comment'
 *    summary: 'Get detail of comment'
 *    produces:
 *      - 'application/json'
 *    parameters:
 *      - in: path
 *        name: commentId
 *        description: 'Id of comment'
 *        required: true
 *        schema:
 *          type: byte
 *    responses:
 *      200:
 *        description: Detail of comment
 *        schema:
 *          $ref: '#/definitions/CommentResponse'
 *      401:
 *        description: You donn't have permission to access
 *      404:
 *        description: No record found for id `{commentId}`
 */
router.get('/:id', middlewareForShow, CommentController.show);

// router.patch('/:id', middlewareForPatch, CommentController.patch);

// router.delete('/:id', middlewareForDetroy, CommentController.destroy);

export default router;
