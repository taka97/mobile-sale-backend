import { UserController } from './userController';

class AdminController extends UserController {
  constructor() {
    const requiredField = { roles: 'admin', isDeleted: false };

    const options = {
      requiredField,
    };
    super(options);
  }
}

export default new AdminController();
// export { AdminController };
