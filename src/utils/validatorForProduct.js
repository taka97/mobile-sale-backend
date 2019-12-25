import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateProductCreate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.objectId().required(),
  });
  return schema.validate(product);
};

export const validateProductUpdate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.objectId().required(),
  });
  return schema.validate(product);
};

export const validateProductAddPrice = (product) => {
  const schema = Joi.object({
    prices: Joi.array().items(
      Joi.object({
        color: Joi.string().required(),
        memory: Joi.string().required(),
        warranty: Joi.string().required(),
        price: Joi.number().min(0).required(),
        currentQty: Joi.number().min(0).required(),
        totalQty: Joi.number().min(0).required(),
        image: Joi.string().dataUri().required(),
      }),
    ).min(1),
  });
  return schema.validate(product);
};

export const validateProductUpdatePrice = (product) => {
  const schema = Joi.object({
    color: Joi.string(),
    memory: Joi.string(),
    warranty: Joi.string(),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    image: Joi.string().dataUri(),
  });
  return schema.validate(product);
};

export const validateProductCreateDetail = (product) => {
  const schema = Joi.object({
    details: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required(),
      }),
    ).min(1),
  });
  return schema.validate(product);
};
