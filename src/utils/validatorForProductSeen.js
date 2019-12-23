import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

/* eslint-disable import/prefer-default-export */
export const validateProductSeenCreate = (product) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
  });
  return schema.validate(product);
};
