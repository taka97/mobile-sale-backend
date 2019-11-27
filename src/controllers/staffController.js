import { UserController } from './userController';

class StaffController extends UserController {
  constructor() {
    const options = {
      data: {
        roles: 'staff'
      }
    };
    super(options);
  }
}

// const dg = debug('MS:controllers:users');

export default new StaffController();

export { StaffController };
