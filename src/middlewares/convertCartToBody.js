import _ from 'lodash';
import CartController from '../controllers/cartController';

function convertCartToBody({ from }) {
  if (!from || typeof from !== 'string') {
    throw new Error('from must be a string (convertCartToBody)');
  }

  const cartServices = CartController.services;

  return async (req, res, next) => {
    const { body } = req;
    const cartId = _.get(req, from);
    const cartDetail = await cartServices.get(cartId);

    body.items = cartDetail.items;
    body.totalQty = cartDetail.totalQty;
    body.totalItemsPrice = cartDetail.totalPrice;

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { convertCartToBody };
