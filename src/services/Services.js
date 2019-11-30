import debug from 'debug';
import createError from 'http-errors';
import _ from 'lodash';

import { validateUser } from '../utils/validator';
import { simpleUser } from '../utils/userFunc';
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
      return model
        .where(query)
      [this.useEstimatedDocumentCount ? 'estimatedDocumentCount' : 'countDocuments']()
        .exec()
        .then(executeQuery);
    }

    return executeQuery().then(page => {
      return page.data
    });
  }

  get(id, params = {}) {
    const { query, filters } = this.filterQuery(params);
    const model = this.Model;

    query.$and = (query.$and || []).concat([{ '_id': id }]);

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
      let fields = { [this.id]: 1 };

      for (let key of filters.$select) {
        fields[key] = 1;
      }

      modelQuery.select(fields);
    } else if (filters.$select && typeof filters.$select === 'object') {
      modelQuery.select(filters.$select);
    }

    return modelQuery
      .lean(this.lean)
      .exec()
      .then(data => {
        if (!data) {
          return ({ message: `No record found for id ${id}` });
        }

        return data;
      })
      .catch(err => {
        switch(err.name) {
          case 'CastError':
            throw ({code: 400, message: '"Id" is invalid'});
          default:
            throw ({ code: 500, message: err });
        }
      });
  }

  // async get(id, params = {}) {




  //   let user;

  //   try {
  //     user = await User.findById(req.params.id).lean();
  //   } catch (error) {
  //     switch (error.name) {
  //       case 'CastError':
  //         return next(createError(400, '"Id" is invalid'));
  //       default:
  //         return next(createError(500));
  //     }
  //   }

  //   if (!user) {
  //     return next(createError(404, 'Not found user'));
  //   }

  //   return res.json({ user: simpleUser(user) });
  // }

  create(_data, params = {}) {
    const model = this.Model;
    const { query: { $populate } = {} } = params;
    const isMulti = Array.isArray(_data);
    const data = isMulti ? _data : [_data];

    // $select with allowSelect
    if (this.allowField) {
      params.query.$select = filterSelect(params.query.$select, this.allowField, this.excludeField);
    }

    return model.create(data, params.mongoose)
      .then(results => {
        if ($populate) {
          return Promise.all(results.map(result => model.populate(result, $populate)));
        }

        return results;
      })
      .then(results => {
        if (this.lean) {
          results = results.map(item => (item.toObject ? item.toObject() : item));
        }

        return isMulti ? results : results[0];
      })
      .then(select(params, '_id'))
      .catch(err => Promise.reject({ code: 500, message: err }));
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
