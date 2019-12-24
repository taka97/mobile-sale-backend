import { Unauthorized } from 'http-errors';

function restrictToOwner() {
  return function (req, res, next) {
    const { _id: userId } = req.user;

    if (req.params.id !== userId.toString()) {
      return next(new Unauthorized('You don\'t have permission to modify'));
    }
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { restrictToOwner };
