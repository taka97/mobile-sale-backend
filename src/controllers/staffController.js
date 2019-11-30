import { UserController } from './userController';

class StaffController extends UserController {
  constructor() {
    const requiredField = { roles: 'staff', isDeleted: false };

    const options = {
      requiredField,
    };
    super(options);
  }
}

export default new StaffController();
// export { StaffController };
