import { UserController } from './userController';

class CustomerController extends UserController {
  constructor() {
    const requiredField = { roles: 'customer', isDeleted: false };

    const options = {
      requiredField,
    };
    super(options);
  }
}

export default new CustomerController();
// export { CustomerController };
