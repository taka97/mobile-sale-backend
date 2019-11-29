import { UserController } from './userController';

class CustomerController extends UserController {
  constructor() {
    const requiredField = { roles: 'customer' };

    const options = {
      requiredField,
    };
    super(options);
  }
}

// const dg = debug('MS:controllers:users');

export default new CustomerController();

export { CustomerController };
