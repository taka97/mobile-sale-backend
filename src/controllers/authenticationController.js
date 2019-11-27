// import debug from 'debug';
import createError from 'http-errors';
import passport from 'passport';
import { jwtSign } from '../utils/jwtFunc';

// const dg = debug('MS:controllers:users');

class AuthenticationController {
  /**
   * Controller - Authentication User
   * @param {object} req request
   * @param {object} res response
   * @param {object} next next pointer
   */
  async create(req, res, next) {
    const strategyName = req.body.strategy || 'customer';
    return passport.authenticate(strategyName, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(createError(400, info.message));
      }

      const { _id: userId } = user;
      // eslint-disable-next-line no-underscore-dangle
      const accessToken = jwtSign({ id: userId });
      return res.status(201).send({ accessToken, userId });
    })(req, res, next);
  }
}

export default new AuthenticationController();
