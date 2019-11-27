import config from 'config';
import jwt from 'jsonwebtoken';

const authentication = config.get('authentication');

function jwtSign(data) { return jwt.sign(data, authentication.secret, authentication.jwt); }

function jwtVerify(token) { return jwt.verify(token, authentication.secret, authentication.jwt); }

export {
  jwtSign,
  jwtVerify,
};
