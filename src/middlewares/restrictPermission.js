import createError from 'http-errors';

const restrictPermission = (...roles) => {
  let availableForAll = roles.length === 0;

  return function (req, res, next) {
    const { user } = req;
    if (!availableForAll && !roles.includes(user.roles)) {
      return next(createError(401, 'You don\'t have permission to access'));
    } else {
      return next();
    }
  };
};

/* eslint-disable import/prefer-default-export */
export { restrictPermission };
