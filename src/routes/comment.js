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
  validatorQuery(getList),
  setValue({ field: 'query.parentId', value: undefined, isDefault: true }),
];
const middlewareForShow = [
  validatorQuery(getList),
];
// const middlewareForPatch = [
// ];
// const middlewareForDetroy = [
// ];

const router = Router();

router.post('/', middlewareForCreate, CommentController.create);

router.get('/', middlewareForIndex, CommentController.index);

router.get('/:id', middlewareForShow, CommentController.show);

// router.patch('/:id', middlewareForPatch, CommentController.patch);

// router.delete('/:id', middlewareForDetroy, CommentController.destroy);

export default router;
