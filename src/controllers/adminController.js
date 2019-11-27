import { UserController } from './userController';

class AdminController extends UserController {
  constructor() {
    const options = {
      data: {
        roles: 'admin'
      }
    };
    super(options);
  }
}

// const dg = debug('MS:controllers:users');

export default new AdminController();

export { AdminController };
