import debug from 'debug';
import createError from 'http-errors';
import config from 'config';

import Model from '../models/user';
import createService from '../services/Services';
import { validateUser } from '../utils';

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

    /* eslint-disable  no-param-reassign */
    options = {
      paginate,
      Model,
      excludeField,
      allowField,
      ...options,
    };

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
      query = { ...query, ...this.requiredField };
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
        },
      });

      if (total !== 0) {
        return next(createError(403, 'That user already exists!'));
      }

      const params = this.requiredField ? ({ ...body, ...this.requiredField }) : body;

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
    try {
      const user = await this.services.get(req.params.id, { query: req.query });
      return res.status(200).send(user);
    } catch (err) {
      return next(createError(err.code, err.message));
    }
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
  async patch(req, res) {
    // const { query } = req;
    const data = req.body;
    // const writeResults = await User.updatesMany(query, data);

    // if (this.options.writeResults) {
    //   return res.send(writeResults);
    // }

    dg(data);
    // dg(response);

    res.json({ msg: 'patch user detail', id: req.params.id });
  }

  /**
 * Controller - Delete User (Carefully with using it)
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  async destroy(req, res, next) {
    const { params } = req;
    let { query } = req;
    if (this.requiredField) {
      query = { ...query, ...this.requiredField };
    }
    const id = params.id ? params.id : null;

    try {
      const result = await this.services.remove(id, { query });
      return res.status(204).send(result);
    } catch (err) {
      return next(createError(err.code, err.message));
    }
  }
}

function init(options) {
  return new UserController(options);
}

export default init;
export { UserController };
