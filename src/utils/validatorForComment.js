import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateCommentCreateParent = (comment) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    text: Joi.string().required(),
    parentId: Joi.objectId(),
  });
  return schema.validate(comment);
};

export const validateCommentGetList = (comment) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    parentId: Joi.objectId(),
  });
  return schema.validate(comment);
};
