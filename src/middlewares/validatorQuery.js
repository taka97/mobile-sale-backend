import { BadRequest } from 'http-errors';

/**
 * Middleware for validate data
 * @param {Function} validator validator
 * @param {string} setField `req[setField] = true` when validate success
 */
function validatorQuery(validator, setField) {
  if (typeof validator !== 'function') {
    throw new Error('validator must be a function (validatorQuery)');
  }

  if (setField && typeof setField !== 'string') {
    throw new Error('setField must be a string (validatorQuery)');
  }

  return (req, res, next) => {
    const { error } = validator(req.query);
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
export { validatorQuery };
