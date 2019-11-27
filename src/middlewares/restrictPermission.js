import createError from 'http-errors';

const restrictPermission = (roles) => {
  if (!roles) {
    roles = []
  };

  if (typeof roles !== string && !Array.isArray(roles)) {
    return next(createError());
  }

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  console.dir(roles);

  return function (req, res, next) {

  };
};

/* eslint-disable import/prefer-default-export */
export { restrictPermission };
