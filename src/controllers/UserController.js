import debug from 'debug';
import createError from 'http-errors';

import User from '../models/user';
import { validateUser } from '../utils/validator';
import { simpleUser } from '../utils/userFunc';

// const dg = debug('MS:controllers:users');

class UserController {
  /**
 * Controller - Get list all of User
 * @param {object} req request
 * @param {object} res response
 */
  static index(req, res) {
    res.json({ msg: 'get list of users' });
  }

  /**
   * Controller - Create User
   * @param {object} req request
   * @param {object} res response
   * @param {object} next next pointer
   */
  static async create(req, res, next) {
    // First Validate The Request
    const { error } = validateUser(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email }).lean();
    if (user) {
      return next(createError(403, 'That user already exisits!'));
    }

    // const verifyToken = jwtAuthSign({ email: req.body.email });

    // Insert the new user if they do not exist yet
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      // verifyToken,
    });
    await user.save();

    return res.json({ msg: 'create user', data: simpleUser(user.toObject()) });
  }

  /**
 * Controller - Show Detail of User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  static async show(req, res, next) {
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

    return res.json({ msg: 'show user detail', data: simpleUser(user) });
  }

  /**
 * Controller - Update User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  static update(req, res) {
    res.json({ msg: 'update user detail', id: req.params.id });
  }

  /**
 * Controller - Delete User
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  static destroy(req, res) {
    res.json({ msg: 'delete user detail', id: req.params.id });
  }
}

export default UserController;
