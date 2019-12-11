// import debug from 'debug';
import config from 'config';
import {
  BadRequest,
  Forbidden,
} from 'http-errors';

import Model from '../models/user';
import createService from '../services/Services';
import {
  Ok,
  Created,
  NoContent,
} from '../helpers/http-code';

// const dg = debug('MS:controllers:users');

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
      'sex',
      'avatar',
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
    this.patchUserInfo = this.patchUserInfo.bind(this);
    this.patchPassword = this.patchPassword.bind(this);
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

      const findQuery = {
        $or: [{ email: body.email }],
        $limit: 0,
        isDeleted: false,
      };

      if (body.username) {
        findQuery.$or.push({ username: body.username });
      }

      const { total } = await this.services.find({ query: findQuery });

      if (total !== 0) {
        throw new Forbidden('That user already exists!');
      }

      const data = this.requiredField ? ({ ...body, ...this.requiredField }) : body;

      const result = await this.services.create(data, { query });
      return res.status(Created).send(result);
    } catch (err) {
      return next(err);
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
      const { params, query } = req;
      const id = params.id ? params.id : null;

      const user = await this.services.get(id, { query });
      return res.status(Ok).send(user);
    } catch (err) {
      return next(err);
    }
  }

  /**
 * Controller - Update User
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
 * Controller - Patch User Info
 * @param {Object} req request
 * @param {Object} res response
 * @param {Object} next next pointer
 */
  async patchUserInfo(req, res, next) {
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
   * Controller - Patch User Password
   * @param {Object} req request
   * @param {Object} res response
   * @param {Object} next next pointer
   */
  async patchPassword(req, res, next) {
    const {
      params, query, body, user,
    } = req;
    const { oldPassword, newPassword } = body;
    const { id } = params;

    try {
      if (!user.validPassword(oldPassword)) {
        throw new BadRequest('old password donn\'t match');
      }
      const data = {
        password: newPassword,
      };
      const result = await this.services.patch(id, data, { query });
      return res.send(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
  * Controller - Delete User (Carefully with using it)
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

function init(options) {
  return new UserController(options);
}

export default init;
export { UserController };
