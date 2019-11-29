import debug from 'debug';
import createError from 'http-errors';
import _ from 'lodash';

import { validateUser } from '../utils/validator';
import { simpleUser } from '../utils/userFunc';
import filterQuery from '../utils/filter-query';
import filterSelect from '../utils/filter-select';

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
    const options = Object.assign({
      operators: this.options.whitelist || [],
      filters: this.options.filters,
      paginate
    }, opts);
    const result = filterQuery(query, options);

    return Object.assign(result, { paginate });
  }

  get Model() {
    return this.options.Model;
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
        [key]: 1
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
      executeQuery = total => Promise.resolve({
        total,
        limit: filters.$limit,
        skip: filters.$skip || 0,
        data: []
      });
    } else {
      executeQuery = total => q.exec().then(data => {
        return {
          total,
          limit: filters.$limit,
          skip: filters.$skip || 0,
          data
        };
      });
    }

    if (paginate && paginate.default) {
      return model.where(query)[this.useEstimatedDocumentCount ? 'estimatedDocumentCount' : 'countDocuments']()
        .exec().then(executeQuery);
    }

    return executeQuery().then(page => {
      return page.data
    });
  }

  async get(id, params = {}) {
    let user;

    try {
      user = await User.findById(req.params.id).lean();
    } catch (error) {
      switch (error.name) {
        case 'CastError':
          return next(createError(400, '"Id" is invalid'));
        default:
          return next(createError(500));
      }
    }

    if (!user) {
      return next(createError(404, 'Not found user'));
    }

    return res.json({ user: simpleUser(user) });
  }

  create(data, params = {}) {
    const model = this.Model;

    return new Promise((resolve, reject) => {
      // First Validate The Request
      const { error } = validateUser(data);
      if (error) {
        reject({ code: 400, message: error.details[0].message });
      }

      return model.findOne({ email: data.email }).lean()
        .then(user => {
          // Check if this user already exisits
          if (user) {
            reject({ code: 403, message: 'That user already exists!' });
          }

          // Insert the new user if they do not exist yet
          user = new model(_.merge({}, _.pick(data, this.allowField), this.requiredField));

          user.save()
            .then(data => resolve({ user: simpleUser(data.toObject()) }))
            .catch(err => reject({ code: 500, message: err }));
        })
        .catch(err => reject({ code: 500, message: err }));
    });
  }

  async update(id, data, params = {}) {

  }

  async patch(id, data, params = {}) {

  }

  async remove(id, params = {}) {

  }
}

function init(options) {
  return new Services(options);
}

export default init;
export { Services };
