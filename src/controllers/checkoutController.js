// import debug from 'debug';
import config from 'config';
import {
  BadRequest,
  Forbidden,
} from 'http-errors';

import Model from '../models/checkout';
import createService from '../services/Services';
import {
  Ok,
  Created,
  NoContent,
} from '../helpers/http-code';

// const dg = debug('MS:controllers:product');

class CheckoutController {
  constructor(options = {}) {
    const paginate = config.get('paginate');

    /* eslint-disable  no-param-reassign */
    options = {
      ...options,
      paginate,
      Model,
    };

    this.services = createService(options);

    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.show = this.show.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.destroy = this.destroy.bind(this);
    this.updateWithCompleted = this.updateWithCompleted.bind(this);
  }

  get Services() {
    return this.services;
  }

  /**
 * Controller - Get list all of Category
 * @param {object} req request
 * @param {object} res response
 */
  async index(req, res) {
    let { query } = req;
    if (this.requiredField) {
      query = { ...query, ...this.requiredField };
    }
    const result = await this.services.find({ query });
    res.send(result);
  }

  /**
   * Controller - Create Category
   * @param {object} req request
   * @param {object} res response
   * @param {object} next next pointer
   */
  async create(req, res, next) {
    try {
      const { query, body } = req;
      const result = await this.services.create(body, { query });
      return res.status(Created).send(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
 * Controller - Show Detail of Category
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  async show(req, res, next) {
    try {
      const { params, query } = req;
      const id = params.id ? params.id : null;

      const user = await this.services.get(id, { query });
      return res.status(Ok).send(user);
    } catch (err) {
      return next(err);
    }
  }

  /**
 * Controller - Update Category
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  async update(req, res, next) {
    try {
      const { params, query, body: data } = req;
      const id = params.id ? params.id : null;

      const result = await this.services.update(id, data, { query });
      return res.status(Ok).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async updateWithCompleted(req, res, next) {
    try {
      const { params, query, body: data } = req;
      const id = params.id ? params.id : null;

      const result = await this.services.update(id, data, { query });
      return res.status(Ok).send(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
 * Controller - Patch Category
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next pointer
 */
  async patch(req, res, next) {
    const {
      params, query, body,
    } = req;
    const id = params.id ? params.id : null;

    try {
      if (Object.keys(body).length === 0) {
        throw new BadRequest('Donnot have any field is modified');
      }

      const data = { ...body };

      const result = await this.services.patch(id, data, { query });
      return res.send(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
  * Controller - Delete Category (Carefully with using it)
  * @param {object} req request
  * @param {object} res response
  * @param {object} next next pointer
  */
  async destroy(req, res, next) {
    const { params } = req;
    const id = params.id ? params.id : null;
    const data = {
      isDeleted: true,
    };

    try {
      const result = await this.services.patch(id, data);
      return res.status(NoContent).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

export default new CheckoutController();
