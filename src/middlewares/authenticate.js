import { authenticate } from 'passport';

const authenticateJWT = (req, res, next) => {
  authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ message: 'Not authenticated' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

/* eslint-disable import/prefer-default-export */
export { authenticateJWT };
