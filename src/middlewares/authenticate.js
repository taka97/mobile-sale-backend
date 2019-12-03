import config from 'config';
import passport from 'passport';
import { Unauthorized } from 'http-errors';


const authenticate = (strategy) => {
  if (!strategy || typeof strategy !== 'string') {
    throw new Error('"Strategy must be a string (authenticaion)');
  }

  const strategies = config.get('authentication.strategies');
  if (!strategies.includes(strategy)) {
    throw new Error('"Strategy must be a valid strategy (authenticaion)');
  }

  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Unauthorized());
      }
      req.user = user;
      return next();
    })(req, res, next);
  }
}

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Unauthorized());
    }
    req.user = user;
    return next();
  })(req, res, next);
};

/* eslint-disable import/prefer-default-export */
export { authenticate, authenticateJWT };
