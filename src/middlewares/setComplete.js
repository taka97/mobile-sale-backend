function setComplete() {
  return (req, res, next) => {
    const data = {
      isCompleted: true,
    };

    req.body = data;

    return next();
  };
}

/* eslint-disable import/prefer-default-export */
export { setComplete };
