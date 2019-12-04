import { UserController } from './userController';

class StaffController extends UserController {
  constructor() {
    const requiredField = { roles: 'staff', isDeleted: false };
    const allowField = [
      'email',
      'username',
      'password',
      'fullname',
      'phone',
      'birthDate',
      'sex',
      'storeId',
      'cmnd',
      'address',
      'roles',
      'createdAt',
      'updatedAt',
    ];

    const options = {
      requiredField,
      allowField,
    };
    super(options);
  }
}

export default new StaffController();
// export { StaffController };
