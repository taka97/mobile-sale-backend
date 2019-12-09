import { BadRequest } from 'http-errors';

/**
 * Middleware for validate data
 * @param {Function} validator validator
 * @param {string} setField `req[setField] = true` when validate success
 */
function validatorData(validator, setField) {
  if (typeof validator !== 'function') {
    throw new Error('validator must be a function (validatorData)');
  }

  if (setField && typeof setField !== 'string') {
    throw new Error('setField must be a string (validatorData)');
  }

  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      return next(new BadRequest(error.details[0].message));
    }
    if (setField) {
      req[setField] = true;
    }
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { validatorData };
