import Joi from '@hapi/joi';

/* eslint-disable import/prefer-default-export */

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(5).max(255).required(),
    username: Joi.string().min(5).max(50),
    fullname: Joi.string().min(5).max(128).required(),
    phone: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    birthDate: Joi.date().required(),
    cmnd: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    address: Joi.string(),
  });
  return schema.validate(user);
};

const validateEmail = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  });
  return schema.validate(user);
};

export {
  validateUser,
  validateEmail,
};
