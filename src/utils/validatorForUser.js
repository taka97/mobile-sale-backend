import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().pattern(/^[0-9a-zA-z]{5,128}$/),
    username: Joi.string().min(5).max(50),
    fullname: Joi.string().min(5).max(128).required(),
    phone: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    birthDate: Joi.date().min('1-1-1974').max('now').required(),
    sex: Joi.string().lowercase().valid('male', 'female').required(),
    cmnd: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    address: Joi.string(),
  });
  return schema.validate(user);
};

export const validateEmail = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  });
  return schema.validate(user);
};

export const validateChangeAvatar = (user) => {
  const schema = Joi.object({
    avatarUri: Joi.string().dataUri(),
  });
  return schema.validate(user);
};

export const validateChangeUserInfo = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5),
    email: Joi.any().forbidden(),
    fullname: Joi.string().min(5).max(128),
    phone: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    birthDate: Joi.date().min('1-1-1974').max('now'),
    cmnd: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
    sex: Joi.string().lowercase().valid('male', 'female'),
    address: Joi.string(),
    roles: Joi.any().forbidden(),
    createdAt: Joi.any().forbidden(),
    updatedAt: Joi.any().forbidden(),
    password: Joi.any().forbidden(),
    avatar: Joi.any().forbidden(),
  });
  return schema.validate(user);
};

export const validateChangePassword = (user) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required().pattern(/^[0-9a-zA-z]{5,128}$/),
    newPassword: Joi.string().required().pattern(/^[0-9a-zA-z]{5,128}$/),
    repeatPassword: Joi.string().required().valid(Joi.ref('newPassword'))
      .messages({
        'any.only': 'repeatPassword donnot match newPassword',
      }),
  });
  return schema.validate(user);
};
