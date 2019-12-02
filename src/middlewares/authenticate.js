import passport from 'passport';
import { Unauthorized } from 'http-errors';


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
export { authenticateJWT };
