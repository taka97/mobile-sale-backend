import debug from 'debug';

import filterQuery from '../utils/filter-query';
import filterSelect from '../utils/filter-select';
import select from '../utils/select';

const dg = debug('MS::services::Services');

class Services {
  constructor(options) {
    if (!options.Model || !options.Model.modelName) {
      throw new Error('You must provide a Mongoose Model');
    }

    this.options = options || {};
    this.requiredField = options.requiredField || {};
    this.lean = options.lean === undefined ? true : options.lean;
    this.useEstimatedDocumentCount = !!options.useEstimatedDocumentCount;
    this.allowField = options.allowField;
    this.excludeField = options.excludeField || [];
    this.id = options.id || '_id';

    // Binding method
    // this.find = this.find.bind(this);
    // this.get = this.get.bind(this);
    // this.create = this.create.bind(this);
    // this.update = this.update.bind(this);
    // this.remove = this.remove.bind(this);
  }

  filterQuery(params = {}, opts = {}) {
    const paginate = typeof params.paginate !== 'undefined'
      ? params.paginate : this.options.paginate;
    const { query = {} } = params;
    const options = {
      operators: this.options.whitelist || [],
      filters: this.options.filters,
      paginate,
      ...opts,
    };
    const result = filterQuery(query, options);
    return Object.assign(result, { paginate });
  }

  get Model() {
    return this.options.Model;
  }

  getOrFind(id, params = {}) {
    if (id === null) {
      return this.find(params);
    }

    return this.get(id, params);
  }

  find(params = {}) {
    const { filters, query, paginate } = this.filterQuery(params);
    const model = this.Model;
    const q = model.find(query).lean(this.lean);

    // $select with allowSelect
    if (this.allowField) {
      filters.$select = filterSelect(filters.$select, this.allowField, this.excludeField);
    }

    // $select uses a specific find syntax, so it has to come first.
    if (Array.isArray(filters.$select)) {
      q.select(filters.$select.reduce((res, key) => Object.assign(res, {
        [key]: 1,
      }), {}));
    } else if (typeof filters.$select === 'string' || typeof filters.$select === 'object') {
      q.select(filters.$select);
    }

    // Handle $sort
    if (filters.$sort) {
      q.sort(filters.$sort);
    }

    // Handle collation
    if (params.collation) {
      q.collation(params.collation);
    }

    // Handle $limit
    if (typeof filters.$limit !== 'undefined') {
      q.limit(filters.$limit);
    }

    // Handle $skip
    if (filters.$skip) {
      q.skip(filters.$skip);
    }

    // Handle $populate
    if (filters.$populate) {
      q.populate(filters.$populate);
    }

    let executeQuery;

    if (filters.$limit === 0) {
      executeQuery = (total) => Promise.resolve({
        total,
        limit: filters.$limit,
        skip: filters.$skip || 0,
        data: [],
      });
    } else {
      executeQuery = (total) => q.exec().then((data) => ({
        total,
        limit: filters.$limit,
        skip: filters.$skip || 0,
        data,
      }));
    }

    if (paginate && paginate.default) {
      return model
        .where(query)[this.useEstimatedDocumentCount
          ? 'estimatedDocumentCount'
          : 'countDocuments']()
        .exec().then(executeQuery);
    }

    return executeQuery().then((page) => page.data);
  }

  get(id, params = {}) {
    const { query, filters } = this.filterQuery(params);
    const model = this.Model;

    query.$and = (query.$and || []).concat([{ [this.id]: id }]);

    let modelQuery = model.findOne(query);

    // Handle $populate
    if (filters.$populate) {
      modelQuery = modelQuery.populate(filters.$populate);
    }

    // $select with allowSelect
    if (this.allowField) {
      filters.$select = filterSelect(filters.$select, this.allowField, this.excludeField);
    }

    // Handle $select
    if (filters.$select && filters.$select.length) {
      const fields = { [this.id]: 1 };

      filters.$select.forEach((key) => { fields[key] = 1; });

      modelQuery.select(fields);
    } else if (filters.$select && typeof filters.$select === 'object') {
      modelQuery.select(filters.$select);
    }

    return modelQuery
      .lean(this.lean)
      .exec()
      .then((data) => {
        if (!data) {
          return ({ code: 200, message: `No record found for id ${id}` });
        }

        return data;
      })
      .catch((err) => {
        switch (err.name) {
          case 'CastError':
            /* eslint-disable no-throw-literal */
            throw ({ code: 400, message: '"Id" is invalid' });
          default:
            /* eslint-disable no-throw-literal */
            throw ({ code: 500, message: err });
        }
      });
  }

  create(_data, params = {}) {
    const model = this.Model;
    const { query: { $populate } = {} } = params;
    const isMulti = Array.isArray(_data);
    const data = isMulti ? _data : [_data];

    // $select with allowSelect
    if (this.allowField) {
      /* eslint-disable no-param-reassign */
      params.query.$select = filterSelect(params.query.$select, this.allowField, this.excludeField);
    }

    return model.create(data, params.mongoose)
      .then((results) => {
        if ($populate) {
          return Promise.all(results.map((result) => model.populate(result, $populate)));
        }

        return results;
      })
      .then((results) => {
        if (this.lean) {
          /* eslint-disable no-param-reassign */
          results = results.map((item) => (item.toObject ? item.toObject() : item));
        }

        return isMulti ? results : results[0];
      })
      .then(select(params, this.id))
      /* eslint-disable prefer-promise-reject-errors */
      .catch((err) => Promise.reject({ code: 500, message: err }));
  }

  update(id, data, params = {}) {
    return ({ id, data, params });
  }

  patch(id, data, params = {}) {
    return ({ id, data, params });
  }

  remove(id, params = {}) {
    const { query } = this.filterQuery(params);

    if (params.collation) {
      query.collation = params.collation;
    }

    // $select with allowSelect
    if (this.allowField) {
      /* eslint-disable no-param-reassign */
      params.query.$select = filterSelect(params.query.$select, this.allowField, this.excludeField);
    }

    if (id !== null) {
      query.$and = (query.$and || []).concat({ [this.id]: id });

      return this.Model.findOneAndDelete(query)
        .lean(this.lean)
        .exec()
        .then(result => {
          if (result === null) {
            /* eslint-disable no-throw-literal */
            throw ({ code: 200, message: `No record found for id '${id}'` });;
          }

          return result;
        })
        .then(select(params, this.id))
        .catch((err) => Promise.reject({ code: 500, message: err }));
    }

    const findParams = Object.assign({}, params, {
      paginate: false,
      query
    });

    // NOTE (EK): First fetch the record(s) so that we can return
    // it/them when we delete it/them.
    return this.getOrFind(id, findParams).then(data =>
      this.Model.deleteMany(query)
        .lean(this.lean)
        .exec()
        .then(() => data)
        .then(select(params, this.id))
    ).catch((err) => Promise.reject({ code: 500, message: err }));

    return ({ id, params });
  }
}

function init(options) {
  return new Services(options);
}

export default init;
export { Services };
