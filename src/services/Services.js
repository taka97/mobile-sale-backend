import debug from 'debug';
import _ from 'lodash';

import {
  OK,
  BADREQUEST,
  INTERNALSERVERERROR,
} from '../helpers/http-error';


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
          return Promise.resolve({ message: `No record found for id ${id}` });
        }

        return data;
      })
      .catch((err) => {
        switch (err.name) {
          case 'CastError':
            return Promise.reject({ code: BADREQUEST, message: '"Id" is invalid' });
          default:
            return Promise.reject({ code: INTERNALSERVERERROR, message: err });
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
      .catch((err) => Promise.reject({ code: INTERNALSERVERERROR, message: err }));
  }

  update(id, data, params = {}) {
    if (id === null) {
      return Promise.reject({
        code: INTERNALSERVERERROR,
        message: 'Not replacing multiple records. Did you mean `patch`?',
      });
    }
    // Handle case where data might be a mongoose model
    if (typeof data.toObject === 'function') {
      data = data.toObject();
    }

    const { query, filters } = this.filterQuery(params);
    const options = {
      new: true,
      overwrite: this.overwrite,
      runValidators: true,
      context: 'query',
      setDefaultsOnInsert: true,
    };

    query.$and = (query.$and || []).concat({ [this.id]: id });

    if (this.id === '_id') {
      // We can not update default mongo ids
      data = _.omit(data, this.id);
    } else {
      // If not using the default Mongo _id field set the id to its
      // previous value. This prevents orphaned documents.
      data = { ...data, [this.id]: id };
    }

    const model = this.Model;
    let modelQuery = model.findOneAndUpdate(query, data, options);

    if (filters.$populate) {
      modelQuery = modelQuery.populate(filters.$populate);
    }

    // $select with allowSelect
    if (this.allowField) {
      /* eslint-disable no-param-reassign */
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

    dg('filter: ', filters);
    dg('query: ', query);

    return modelQuery.lean(this.lean).exec()
      .then((result) => {
        if (result === null) {
          return Promise.reject({ code: OK, message: `No record found for id ${id}` });
        }

        return result;
      })
      .catch((err) => { Promise.reject({ code: INTERNALSERVERERROR, message: err }); });
  }

  patch(id, data, params = {}) {
    const { query } = this.filterQuery(params);
    const mapIds = (dataIds) => dataIds.map((current) => current[this.id]);

    // By default we will just query for the one id. For multi patch
    // we create a list of the ids of all items that will be changed
    // to re-query them after the update
    const ids = id === null
      ? this.find({ ...params, paginate: false }).then(mapIds)
      : Promise.resolve([id]);

    // Handle case where data might be a mongoose model
    if (typeof data.toObject === 'function') {
      data = data.toObject();
    }

    // ensure we are working on a copy
    data = { ...data };

    // If we are updating multiple records
    const options = {
      multi: id === null,
      runValidators: true,
      context: 'query',
    };

    if (id !== null) {
      query.$and = (query.$and || []).concat({ [this.id]: id });
    }

    if (this.id === '_id') {
      // We can not update default mongo ids
      delete data[this.id];
    } else if (id !== null) {
      // If not using the default Mongo _id field set the id to its
      // previous value. This prevents orphaned documents.
      data[this.id] = id;
    }

    // NOTE (EK): We need this shitty hack because update doesn't
    // return a promise properly when runValidators is true. WTF!
    try {
      return ids
        .then((idList) => {
          // Create a new query that re-queries all ids that
          // were originally changed
          const findParams = idList.length ? ({
            ...params,
            paginate: false,
            query: { [this.id]: { $in: idList }, ...params.query },
          }) : ({ ...params, paginate: false });

          // If params.query.$populate was provided, remove it
          // from the query sent to mongoose.
          const discriminator = query[this.discriminatorKey] || this.discriminatorKey;
          const model = this.discriminators[discriminator] || this.Model;
          return model
            .updateMany(query, data, options)
            .lean(this.lean)
            .exec()
            .then((writeResult) => {
              if (options.writeResult) {
                return writeResult;
              }
              return this.getOrFind(id, findParams);
            });
        })
        .then(select(params, this.id))
        .catch((err) => Promise.reject({ code: INTERNALSERVERERROR, message: err }));
    } catch (e) {
      return Promise.reject({ code: INTERNALSERVERERROR, message: e });
    }
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
        .then((result) => {
          if (result === null) {
            Promise.reject({ code: OK, message: `No record found for id '${id}'` });
          }

          return result;
        })
        .then(select(params, this.id))
        .catch((err) => Promise.reject({ code: INTERNALSERVERERROR, message: err }));
    }

    const findParams = {
      ...params,
      paginate: false,
      query,
    };

    // NOTE (EK): First fetch the record(s) so that we can return
    // it/them when we delete it/them.
    return this.getOrFind(id, findParams).then((data) => this.Model.deleteMany(query)
      .lean(this.lean)
      .exec()
      .then(() => data)
      .then(select(params, this.id)))
      .catch((err) => Promise.reject({ code: INTERNALSERVERERROR, message: err }));
  }
}

function init(options) {
  return new Services(options);
}

export default init;
export { Services };
