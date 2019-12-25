// import debug from 'debug';
import config from 'config';

import Model from '../models/cart';
import createService from '../services/Services';
import {
  Ok,
} from '../helpers/http-code';
import CartManager from '../helpers/cartHelper';
import ProductController from './productController';

// const dg = debug('MS:controllers:product');

class CartController {
  constructor(options = {}) {
    const paginate = config.get('paginate');

    /* eslint-disable  no-param-reassign */
    options = {
      ...options,
      paginate,
      Model,
    };

    this.requiredField = options.requiredField;
    this.services = createService(options);

    this.createCartAndSave = this.createCartAndSave.bind(this);
    this.addItemToCart = this.addItemToCart.bind(this);
    this.getItemInCart = this.getItemInCart.bind(this);
    this.updateItemInCart = this.updateItemInCart.bind(this);
    this.removeItemFromCart = this.removeItemFromCart.bind(this);
  }

  createNewCart(userId) {
    return this.services.create({ userId }, {});
  }

  saveCartIdToUser(userModel, cartId) {
    userModel.cartId = cartId;
    return userModel.save();
  }

  async createCartAndSave(userModel, userId) {
    const { _id: cartId } = await this.createNewCart(userId);
    await this.saveCartIdToUser(userModel, cartId);
    return cartId;
  }

  /**
 * Controller - Show Detail of Category
 * @param {object} req request
 * @param {object} res response
 * @param {object} next next pointer
 */
  async getItemInCart(req, res, next) {
    try {
      const { params, query } = req;
      const id = params.id ? params.id : await this.createCartAndSave(req.user, params.userId);

      const user = await this.services.get(id, { query });
      return res.status(Ok).send(user);
    } catch (err) {
      return next(err);
    }
  }

  async addItemToCart(req, res, next) {
    try {
      const { params, query, body: { productId, priceId, qty } } = req;

      const id = params.id ? params.id : await this.createCartAndSave(req.user, params.userId);
      const productDetail = await ProductController.services.get(productId, {
        query: {
          $select: 'prices',
        },
      });
      const itemDetail = productDetail.prices
        /* eslint-disable no-underscore-dangle */
        .filter((item) => item._id.toString() === priceId)[0];

      const cartDetail = await this.services.get(id, {});

      const cart = new CartManager(cartDetail);
      cart.update(itemDetail, productId, priceId, qty);

      const data = cart.toObject();
      const result = await this.services.update(id, data, query);
      return res.status(Ok).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async removeItemFromCart(req, res, next) {
    try {
      const { params, query, body: { productId, priceId } } = req;

      const id = params.id ? params.id : await this.createCartAndSave(req.user, params.userId);

      const cartDetail = await this.services.get(id, {});

      const cart = new CartManager(cartDetail);
      cart.remove(undefined, productId, priceId);

      const data = cart.toObject();
      const result = await this.services.update(id, data, query);
      return res.status(Ok).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async updateItemInCart(req, res, next) {
    try {
      const { params, query, body: { productId, priceId, qty } } = req;

      const id = params.id ? params.id : await this.createCartAndSave(req.user, params.userId);
      const productDetail = await ProductController.services.get(productId, {
        query: {
          $select: 'prices',
        },
      });
      const itemDetail = productDetail.prices
        /* eslint-disable no-underscore-dangle */
        .filter((item) => item._id.toString() === priceId)[0];

      const cartDetail = await this.services.get(id, {});

      const cart = new CartManager(cartDetail);
      cart.update(itemDetail, productId, priceId, qty);

      const data = cart.toObject();
      const result = await this.services.update(id, data, query);
      return res.status(Ok).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

export default new CartController();
