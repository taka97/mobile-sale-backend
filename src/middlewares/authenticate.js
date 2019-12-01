import passport from 'passport';
import createError from 'http-errors';
import { UNAUTHORIZED } from '../helpers/http-error';

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(createError(UNAUTHORIZED));
    }
    req.user = user;
    return next();
  })(req, res, next);
};

/* eslint-disable import/prefer-default-export */
export { authenticateJWT };
