import User from '../models/user';
import Category from '../models/category';
import Product from '../models/product';

import * as seeder from '../seederData';

class SeederController {
  constructor() {
    this.constantData = {
      phone: '0987654321',
      fullname: 'Hồ Văn Hoàng',
      birthDate: '11/26/2019',
      sex: 'male',
    };

    this.index = this.index.bind(this);
  }

  generatorAccount(data, numberRecord) {
    const results = [];
    for (let i = 0; i < numberRecord; i += 1) {
      const tmp = {
        ...this.constantData,
        email: `${data}${i}@gmail.com`,
        username: `${data}${i}`,
        password: `${data}${i}`,
        roles: `${data}`,
      };
      results.push(tmp);
    }
    return results;
  }

  /* eslint-disable  no-unused-vars */
  generatorCategory(data, numberRecord) {
    return seeder.categories;
  }

  generatorProduct() {
    return seeder.products;
  }

  async index(req, res) {
    const { action, numberRecord = 10 } = req.params;
    let accounts;
    let categories;
    let products;

    switch (action) {
      case 'admin':
      case 'staff':
      case 'customer':
        accounts = this.generatorAccount(action, numberRecord);
        await User.create(accounts);
        return res.send({ status: 'Created user', account: accounts });
      case 'category':
        categories = this.generatorCategory(action, numberRecord);
        await Category.create(categories);
        return res.send({ status: 'Created category', category: categories });
      case 'product':
        products = this.generatorProduct();
        await Product.create(products);
        return res.send({ status: 'Created product', product: products });
      case 'removeAllCategory':
        await Category.deleteMany();
        return res.send({ status: 'Removed all category' });
      case 'removeAllUser':
        await User.deleteMany();
        return res.send({ status: 'Removed all user' });
      case 'removeAllCollection':
        await Category.deleteMany();
        await User.deleteMany();
        return res.send({ status: 'Removed all collection' });
      default:
        return res.send({ message: 'Input your content' });
    }
  }
}

export default new SeederController();
