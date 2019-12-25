import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateCartAddItem = (cart) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    priceId: Joi.objectId().required(),
    qty: Joi.number().min(1).required(),
  });
  return schema.validate(cart);
};

export const validateCartUpdateItem = (cart) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    priceId: Joi.objectId().required(),
    qty: Joi.number().min(1).required(),
  });
  return schema.validate(cart);
};

export const validateCartRemoveItem = (cart) => {
  const schema = Joi.object({
    productId: Joi.objectId().required(),
    priceId: Joi.objectId().required(),
  });
  return schema.validate(cart);
};
