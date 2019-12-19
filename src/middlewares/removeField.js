import debug from 'debug';
import _ from 'lodash';
import { Forbidden } from 'http-errors';

const dg = debug('MS::middleware::removeField');

function removeField(fieldName) {
  if (!fieldName) {
    throw new Error('fieldName is required');
  }

  return (req, res, next) => {
    dg(`Remove all value in '${fieldName}'`);

    _.set(req, fieldName, {});
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { removeField };
