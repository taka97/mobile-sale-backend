// import debug from 'debug';
import config from 'config';
import {
  BadRequest,
  Forbidden,
} from 'http-errors';

import Model from '../models/category';
import createService from '../services/Services';
import {
  Ok,
  Created,
  NoContent,
} from '../helpers/http-code';

// const dg = debug('MS:controllers:category');

class CategoryController {
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
  }

  /**
 * Controller - Get list all of Category
 * @param {object} req request
 * @param {object} res response
 */
  async index(req, res) {
    const { query } = req;
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

      const findQuery = {
        name: body.name,
        $limit: 0,
      };

      const { total } = await this.services.find({ query: findQuery });

      if (total !== 0) {
        throw new Forbidden('That name is already used!!!');
      }

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

  /**
 * Controller - Patch Category
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next pointer
 */
  async patch(req, res, next) {
    const {
      params, query, body, user,
    } = req;
    const id = params.id ? params.id : null;

    try {
      const { username } = body;
      if (Object.keys(body).length === 0) {
        throw new BadRequest('Donnot have any field is modified');
      }

      if (username) {
        if (user.username !== undefined) {
          throw new BadRequest('Cannot change your username');
        }
        const findQuery = {
          username,
          $limit: 0,
          isDeleted: false,
        };
        const { total } = await this.services.find({ query: findQuery });
        if (total !== 0) {
          throw new BadRequest('username is existed!!');
        }
      }

      const data = { ...(user.toObject()), ...body };

      const result = await this.services.update(id, data, { query });
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

    try {
      const result = await this.services.remove(id, params);
      return res.status(NoContent).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

export default new CategoryController();
