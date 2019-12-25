import Joi from '@hapi/joi';
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const validateCheckoutAddress = (checkout) => {
  const schema = Joi.object({
    addressIndex: Joi.number().min(0).required(),
  });
  return schema.validate(checkout);
};

export const validateCheckoutShipping = (checkout) => {
  const schema = Joi.object({
    shippingMethod: Joi.string().valid('standard', 'fast').required(),
  });
  return schema.validate(checkout);
}

export const validateCheckoutPayment = (checkout) => {
  const schema = Joi.object({
    paymentMethod: Joi.string().valid('cod').required(),
  });
  return schema.validate(checkout);
}
