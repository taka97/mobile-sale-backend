import _ from 'lodash';

function setValue({ field, value, isDefault = false }) {
  if (!field) {
    throw new Error('field or value is required');
  }

  return (req, res, next) => {
    if (isDefault) {
      const currentValue = _.get(req, field);
      if (currentValue !== undefined) {
        return next();
      }
    }

    _.set(req, field, value);
    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setValue };
