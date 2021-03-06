import { Unauthorized } from 'http-errors';

function restrictPermission(...roles) {
  const availableForAll = roles.length === 0;

  return (req, res, next) => {
    const { user } = req;
    if (!availableForAll && !roles.includes(user.roles)) {
      return next(new Unauthorized('You don\'t have permission to access'));
    }
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { restrictPermission };
