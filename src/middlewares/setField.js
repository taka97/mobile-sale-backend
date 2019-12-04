import debug from 'debug';
import _ from 'lodash';
import { Forbidden } from 'http-errors';

const dg = debug('MS::middleware::setField');

function setField({ as, from, allowUndefined = false }) {
  if (!as || !from) {
    throw new Error('as or from is required');
  }

  return (req, res, next) => {
    let value = _.get(req, from);

    if (value === undefined) {
      if (allowUndefined) {
        dg(`Skipping call with value ${from} not set`);
        return next();
      }

      return next(new Forbidden(`Expected field ${as} not available`));
    }

    dg(`Setting value '${value}' from '${from}' as '${as}'`);

    if (typeof value.toString === 'function') {
      value = value.toString();
    }

    _.set(req, as, value);
    return next();
  }
}

/* eslint-disable import/prefer-default-export */
export { setField };
