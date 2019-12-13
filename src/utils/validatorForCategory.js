import Joi from '@hapi/joi';

export const validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(category);
};

export const validateChangeCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(category);
};
