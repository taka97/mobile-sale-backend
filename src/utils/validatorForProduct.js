import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateProductCreate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.objectId().required(),
    price: Joi.number().min(0).required(),
    review: Joi.string().required(),
    shortReview: Joi.string().required(),
  });
  return schema.validate(product);
};

export const validateProductUpdate = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.objectId().required(),
    price: Joi.number().min(0).required(),
    review: Joi.string().required(),
    shortReview: Joi.string().required(),
  });
  return schema.validate(product);
};

export const validateProductAddOption = (product) => {
  const schema = Joi.object({
    options: Joi.array().items(
      Joi.object({
        group: Joi.string().required(),
        name: Joi.string().required(),
        value: Joi.string().required(),
      }),
    ).min(1),
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

export const validateProductCreateImage = (product) => {
  const schema = Joi.object({
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().dataUri().required(),
        caption: Joi.string(),
      }),
    ).min(1),
  });
  return schema.validate(product);
};
