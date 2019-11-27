import config from 'config';
import passportJWT from 'passport-jwt';

import User from '../models/user';

const authentication = config.get('authentication');

const init = () => {
  const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

  const extractors = [
    ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ];

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors(extractors),
    secretOrKey: authentication.secret,
  };

  return new JwtStrategy(jwtOptions,
    (jwtPayload, done) => User.findById(jwtPayload.id,
      (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      }));
};

export default init;
