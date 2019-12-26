import config from 'config';
import passportLocal from 'passport-local';

import User from '../models/user';

import { validateEmail } from '../utils';

const authentication = config.get('authentication');

const LocalStrategyConfig = (strategy) => {
  const { Strategy: LocalStrategy } = passportLocal;

  const localOptions = {
    ...authentication.local,
    session: false,
  };

  return new LocalStrategy(localOptions,
    (email, password, done) => {
      const { error } = validateEmail({ email });
      const query = {
        [(error ? 'username' : 'email')]: email,
        isDeleted: false,
        roles: strategy,
      };

      return User.findOne(query,
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (user && user.validPassword(password)) {
            return done(null, user);
          }
          return done(null, false, { message: 'Incorrect email/username or password' });
        });
    });
};

export default LocalStrategyConfig;
