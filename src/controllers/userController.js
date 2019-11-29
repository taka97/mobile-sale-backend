import debug from 'debug';
import createError from 'http-errors';
import _ from 'lodash';
import config from 'config';

import User from '../models/user';
import Model from '../models/user';
import createService from '../services/Services';
import { simpleUser } from '../utils/userFunc';
import { validateUser } from '../utils/validator';

const dg = debug('MS:controllers:users');

class UserController {
  constructor(options = {}) {
    const paginate = config.get('paginate');
    const excludeField = ['password'];
    const allowField = [
      'email',
      'username',
      'password',
      'fullname',
      'phone',
      'birthDate',
      'cmnd',
      'address',
      'roles',
      'createdAt',
      'updatedAt',
    ];

    options = Object.assign({
      paginate,
      Model,
      paginate,
      excludeField,
      allowField,
    }, options);

    this.requiredField = options.requiredField;
    this.services = createService(options);

    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.show = this.show.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }
  /**
 * Controller - Get list all of User
 * @param {object} req request
 * @param {object} res response
 */
  async index(req, res) {
    let { query } = req;
    if (this.requiredField) {
      query = Object.assign({}, query, this.requiredField);
    }

    const result = await this.services.find({ query });
    res.send(result);
  }

  /**
   * Controller - Create User
   * @param {object} req request
   * @param {object} res response
   * @param {object} next next pointer
   */
  async create(req, res, next) {
    try {
      const { query, body } = req;
      // First Validate The Request
      const { error } = validateUser(body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { total } = await this.services.find({
        query: {
          $or: [
            { email: body.email },
            // body.username ? { username: body.username } : undefined,
          ],
          $limit: 0,
        }
      });

      if (total !== 0) {
        return next(createError(403, 'That user already exists!'));
      }

      const params = this.requiredField ? Object.assign({}, body, this.requiredField) : body;

      const result = await this.services.create(params, { query });
      return res.status(201).send(result);
    } catch (err) {
      return next(createError(err.code, err.message));
    }
  }

  /**
 * Controller - Show Detail of User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  async show(req, res, next) {
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

  /**
 * Controller - Update User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  update(req, res) {
    res.json({ msg: 'update user detail', id: req.params.id });
  }

  /**
 * Controller - Patch User
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next pointer
 */
  async patch(req, res, next) {
    const query = query;
    const data = req.body;
    const writeResults = await User.updatesMany(query, data);

    if (this.options.writeResults) {
      return res.send(writeResults);
    }

    dg(data);
    dg(response);

    res.json({ msg: 'patch user detail', id: req.params.id });
  }

  /**
 * Controller - Delete User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  destroy(req, res) {
    res.json({ msg: 'delete user detail', id: req.params.id });
  }
}

// export default new UserController();

function init(options) {
  return new UserController(options);
}

export default init;
export { UserController };
