function setAddress() {
  return (req, res, next) => {
    const { body: { addressIndex }, user } = req;

    if (addressIndex === 0) {
      const add = {
        fullname: user.fullname || '',
        phone: user.phone || '',
        address: user.address || '',
        company: user.address || '',
      };
      req.body = {
        shippingAddress: add,
        billingAddress: add,
      };
    } else {
      return next(new Error('developing....'));
    }

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setAddress };
