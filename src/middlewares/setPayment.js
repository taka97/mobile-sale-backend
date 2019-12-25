function setPayment() {
  return (req, res, next) => {
    const { body: { paymentMethod } } = req;

    // cod: cash of delivery
    switch (paymentMethod) {
      case 'cod':
        req.body = {
          paymentMethod,
        };
        break;
      default:
        return next(new Error('developing....'));
    }

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setPayment };
