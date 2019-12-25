function setShipping() {
  return (req, res, next) => {
    const { body: { shippingMethod } } = req;

    // cod: cash of delivery
    switch (shippingMethod) {
      case 'standard':
        req.body = {
          shippingMethod,
          shippingTax: 0,
        };
        break;
      case 'fast':
        req.body = {
          shippingMethod,
          shippingTax: 20000,
        };
        break;
      default:
        return next(new Error('developing....'));
    }

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setShipping };
