import debug from 'debug';
import _ from 'lodash';
import { Types } from 'mongoose';
import { Forbidden } from 'http-errors';

const dg = debug('MS::middleware::toObjectId');

function toObjectId(path) {
  if (!path) {
    throw new Error('path is required');
  }

  return (req, res, next) => {
    let value = _.get(req, path);

    if (value === undefined) {
      return next(new Forbidden(`Expected field ${path} not available`));
    }

    dg(`Convert value '${value}' from '${path}' to ObjectId`);

    value = new Types.ObjectId(value);
    _.set(req, path, value);
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { toObjectId };
