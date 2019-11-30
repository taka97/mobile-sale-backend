import { UserController } from './userController';

class StaffController extends UserController {
  constructor() {
    const requiredField = { roles: 'staff' };

    const options = {
      requiredField,
    };
    super(options);
  }
}

export default new StaffController();
// export { StaffController };
