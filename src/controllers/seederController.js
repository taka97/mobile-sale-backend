import User from '../models/user';

class SeederController {
  constructor() {
    this.constantData = {
      phone: '0987654321',
      fullname: 'Hồ Văn Hoàng',
      birthDate: '11/26/2019',
    }

    this.index = this.index.bind(this);
  }

  generatorAccount(data, numberRecord) {
    const results = [];
    for (let i = 0; i < numberRecord; i += 1) {
      const tmp = {
        ...this.constantData,
        email: `${data}${i}@gmail.com`,
        username: `${data}${i}@gmail.com`,
        password: `${data}${i}`,
        roles: `${data}`,
      }
      results.push(tmp);
    }
    return results;
  }

  async index(req, res) {
    const { action, numberRecord = 10 } = req.params;

    switch (action) {
      case 'admin':
      case 'staff':
      case 'customer':
        const accounts = this.generatorAccount(action, numberRecord);
        await User.create(accounts);
        return res.send({ status: 'Created user', account: accounts });
      case 'removeAllUser':
        await User.deleteMany();
        return res.send({ status: 'Removed all user' });
      default:
        return res.send({ message: 'Input your content' });
    }
  }
}

export default new SeederController();
