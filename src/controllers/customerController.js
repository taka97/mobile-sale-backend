import { UserController } from './userController';

class CustomerController extends UserController {
  constructor() {
    const options = {
      data: {
        roles: 'customer'
      }
    };
    super(options);
  }
}

// const dg = debug('MS:controllers:users');

export default new CustomerController();

export { CustomerController };
