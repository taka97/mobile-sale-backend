import CheckoutController from '../controllers/checkoutController';

function setComplete() {
  const services = CheckoutController.services;

  return async (req, res, next) => {
    const { params: { id } } = req;

    const { totalItemsPrice, totalTax } = await services.get(id);

    const data = {
      isCompleted: true,
      totalPrice: totalItemsPrice + totalTax,
    };



    req.body = data;

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setComplete };
