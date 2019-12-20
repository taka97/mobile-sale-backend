import debug from 'debug';

const dg = debug('MS::middleware::wrapBodyWith');

function wrapBodyWith(fieldName) {
  return (req, res, next) => {
    req.body = { [fieldName]: { ...req.body } };

    dg(`Wrapped body inside '${fieldName}'`);
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { wrapBodyWith };
