import User from '../models/user';

class SeederController {
  async index(req, res) {
    const defaultAdmin = [
      {
        "email": "admin@gmail.com",
        "username": "admin",
        "password": "admin",
        "phone": "0987654321",
        "fullname": "Hồ Văn Hoàng",
        "birthDate": "11/26/2019",
        "roles": "admin",
      },
      {
        "email": "admin1@gmail.com",
        "username": "admin1",
        "password": "admin1",
        "phone": "0987654321",
        "fullname": "Hồ Văn Hoàng",
        "birthDate": "11/26/2019",
        "roles": "admin",
      },
      {
        "email": "admin2@gmail.com",
        "username": "admin2",
        "password": "admin2",
        "phone": "0987654321",
        "fullname": "Hồ Văn Hoàng",
        "birthDate": "11/26/2019",
        "roles": "admin",
      },
      {
        "email": "admin3@gmail.com",
        "username": "admin3",
        "password": "admin3",
        "phone": "0987654321",
        "fullname": "Hồ Văn Hoàng",
        "birthDate": "11/26/2019",
        "roles": "admin",
      },
      {
        "email": "admin4@gmail.com",
        "username": "admin4",
        "password": "admin4",
        "phone": "0987654321",
        "fullname": "Hồ Văn Hoàng",
        "birthDate": "11/26/2019",
        "roles": "admin",
      }
    ];

    const { action } = req.params;

    switch (action) {
      case 'admin':
        await User.deleteMany();
        await User.create(defaultAdmin);
        return res.send({ status: 'Created user', account: defaultAdmin });
        break;
      default:
        break;
    }
  }
}

export default new SeederController();
