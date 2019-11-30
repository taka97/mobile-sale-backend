import _ from 'lodash';

function parse(number) {
  return typeof number !== 'undefined' ? Math.abs(parseInt(number, 10)) : number;
}

// Returns the pagination limit and will take into account the
// default and max pagination settings
function getLimit(limit, paginate) {
  if (paginate && paginate.default) {
    const lower = typeof limit === 'number' ? limit : paginate.default;
    const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

    return Math.min(lower, upper);
  }

  return limit;
}

// Makes sure that $sort order is always converted to an actual number
function convertSort(sort) {
  if (typeof sort !== 'object' || Array.isArray(sort)) {
    return sort;
  }

  return Object.keys(sort).reduce((result, key) => {
    /* eslint-disable no-param-reassign */
    result[key] = typeof sort[key] === 'object'
      ? sort[key] : parseInt(sort[key], 10);

    return result;
  }, {});
}

function cleanQuery(query, operators, filters) {
  if (_.isObject(query) && query.constructor === {}.constructor) {
    const result = {};

    _.each(query, (value, key) => {
      if (key[0] === '$') {
        if (filters[key] !== undefined) {
          return;
        }

        if (!operators.includes(key)) {
          throw new Error(`Invalid query parameter ${key}`, query);
        }
      }

      result[key] = cleanQuery(value, operators, filters);
    });

    Object.getOwnPropertySymbols(query).forEach((symbol) => {
      result[symbol] = query[symbol];
    });

    return result;
  }

  return query;
}

function assignFilters(object, query, filters, options) {
  if (Array.isArray(filters)) {
    _.each(filters, (key) => {
      /* eslint-disable no-param-reassign */
      if (query[key] !== undefined) {
        object[key] = query[key];
      }
    });
  } else {
    _.each(filters, (converter, key) => {
      /* eslint-disable no-param-reassign */
      const converted = converter(query[key], options);

      if (converted !== undefined) {
        object[key] = converted;
      }
    });
  }

  return object;
}

const FILTERS = {
  $sort: (value) => convertSort(value),
  $limit: (value, options) => getLimit(parse(value), options.paginate),
  $skip: (value) => parse(value),
  $select: (value) => value,
};

const OPERATORS = ['$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$ne', '$or'];

function filterQuery(query, options = {}) {
  const {
    filters: additionalFilters = {},
    operators: additionalOperators = [],
  } = options;
  const result = {};

  result.filters = assignFilters({}, query, FILTERS, options);
  result.filters = assignFilters(result.filters, query, additionalFilters, options);

  result.query = cleanQuery(query, OPERATORS.concat(additionalOperators), result.filters);

  return result;
}

export default filterQuery;
export { OPERATORS, FILTERS };
