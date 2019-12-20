import debug from 'debug';
import { renameProperty } from '../utils';

const dg = debug('MS::middleware::setField');

function addPrefix2PropertyName(prefix) {
  if (!prefix) {
    throw new Error('prefix is required');
  }

  return (req, res, next) => {
    req.body = renameProperty(req.body, prefix);
    dg(req.body);
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { addPrefix2PropertyName };
