import passport from 'passport';

import LocalStrategy from './authentication/localStrategy';
import JwtStrategy from './authentication/jwtStrategy';

passport.use('customer', LocalStrategy('customer'));
passport.use('staff', LocalStrategy('staff'));
passport.use('admin', LocalStrategy('admin'));
passport.use('jwt', JwtStrategy());

export default passport;
