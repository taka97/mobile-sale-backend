import Joi from '@hapi/joi';

/* eslint-disable import/prefer-default-export */

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    password: Joi.string().min(5).max(255).required(),
  })
  return schema.validate(user);
};
