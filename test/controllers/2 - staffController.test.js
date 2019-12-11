import request from 'supertest';
import config from 'config';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';
import { forEachAsync } from '../../src/utils';

const sampleStaff = [
  {
    email: 'vanhoang0609@gmail.com',
  },
  {
    email: 'vanhoang0609@gmail.com',
    password: 'Abc12345',
  },
  {
    fullname: 'Van Hoang',
    password: 'Abc12345',
  },
  {
    email: 'vanhoang0609@gmail.com',
    fullname: 'Van Hoang',
    password: 'Abc12345',
  },
  {
    email: 'vanhoang0609@gmail.com',
    fullname: 'Van Hoang',
    password: 'Abc12345',
    birthDate: '2019/10/05',
  },
  {
    email: 'vanhoang0609@gmail.com',
    fullname: 'Van Hoang',
    password: 'Abc12345',
    birthDate: '2019/10/05',
    sex: 'male',
  },
  {
    email: 'vanhoang0609@yahoo.com',
    fullname: 'Van Hoang',
    password: 'Abc12345',
    birthDate: '2019/10/05',
    sex: 'male',
  },
];

const sampleCustomerData = {
  email: 'customer@gmail.com',
  fullname: 'Customer',
  username: 'customer',
  password: 'customer',
  birthDate: '2019/10/05',
  sex: 'male',
  roles: 'customer',
};

const sampleStaffData = {
  email: 'staff@gmail.com',
  fullname: 'Staff',
  username: 'staff',
  password: 'staff',
  birthDate: '2019/10/05',
  sex: 'male',
  roles: 'staff',
};

const sampleAdminData = {
  email: 'admin@gmail.com',
  fullname: 'Admin',
  username: 'admin',
  password: 'admin',
  birthDate: '2019/10/05',
  sex: 'male',
  roles: 'admin',
};

const newData = {
  email: 'newstaff@gmail.com',
  fullname: 'New Staff',
  username: 'newstaff',
  passsword: 'newpassword',
  birthDate: '1997/10/06',
  sex: 'male',
  roles: 'admin',
  phone: '0123456789',
  cmnd: '215416497',
  address: 'my address',
};

describe('Staff Controller', () => {
  before('***Cleaning user collection', async () => {
    await User.deleteMany();
  });

  describe('#Create user', () => {
    it('shound return error missing "password"', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[0]);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"password" is required');
    });

    it('shound return error missing "fullname"', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[1]);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"fullname" is required');
    });

    it('shound return error missing "email"', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[2]);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"email" is required');
    });

    it('shound return error missing "birthDate"', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[3]);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"birthDate" is required');
    });

    it('shound return error missing "sex"', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[4]);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"sex" is required');
    });

    it('shound return success and user data', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[5]);
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleStaff[5].fullname);
      expect(response.body).to.have.property('email', sampleStaff[5].email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleStaff[5].birthDate)).toISOString());
      expect(response.body).to.have.property('avatar', config.avatar.default);
      expect(response.body).to.have.property('sex', sampleStaff[5].sex);
    });

    it('shound return false with error user already exists', async () => {
      const response = await request(app)
        .post('/api/staffs')
        .send(sampleStaff[5]);
      expect(response.status).to.equal(403);
      expect(response.body.message).to.be.a('string').include('That user already exists!');
    });
  });

  describe('#Get a user detail', () => {
    const noExistId = '5de25b1504da0435c8e714ad';
    const accessToken = {};
    const userId = {};

    before(async () => {
      let data;
      await User.deleteMany();
      await User.deleteMany();
      await User.create(sampleAdminData);
      await User.create(sampleStaffData);
      await User.create(sampleCustomerData);
      await User.create({
        ...sampleStaff[5],
        roles: 'staff',
      });
      await User.create({
        ...sampleStaff[6],
        roles: 'staff',
      });

      data = [sampleStaff[5], sampleStaff[6]];
      await forEachAsync(data, async (current, index) => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: current.email,
            password: current.password,
            strategy: 'staff',
          });
        userId[`Staff0${index}`] = response.body.userId;
        accessToken[`Staff0${index}`] = response.body.accessToken;
      });

      data = [sampleAdminData, sampleStaffData, sampleCustomerData];
      await forEachAsync(data, async (current) => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: current.email,
            password: current.password,
            strategy: current.roles,
          });
        userId[current.roles] = response.body.userId;
        accessToken[current.roles] = response.body.accessToken;
      });
    });

    it('should return Id invalid with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/staffs/abc')
        .set('Authorization', `Bearer ${accessToken.staff}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return Id invalid with Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/staffs/abc')
        .set('Authorization', `jwt ${accessToken.staff}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return No record with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${noExistId}`)
        .set('Authorization', `Bearer ${accessToken.staff}`);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.be.a('string')
        .include(`No record found for id '${noExistId}'`);
    });

    it('should return No record with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${noExistId}`)
        .set('Authorization', `jwt ${accessToken.staff}`);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.be.a('string')
        .include(`No record found for id '${noExistId}'`);
    });

    it('should return user data with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId.staff}`)
        .set('Authorization', `Bearer ${accessToken.staff}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleStaffData.fullname);
      expect(response.body).to.have.property('email', sampleStaffData.email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleStaffData.birthDate)).toISOString());
      expect(response.body).to.have.property('avatar', config.avatar.default);
      expect(response.body).to.have.property('sex', sampleStaffData.sex);
    });

    it('should return user data with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId.staff}`)
        .set('Authorization', `jwt ${accessToken.staff}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleStaffData.fullname);
      expect(response.body).to.have.property('email', sampleStaffData.email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleStaffData.birthDate)).toISOString());
      expect(response.body).to.have.property('avatar', config.avatar.default);
      expect(response.body).to.have.property('sex', sampleStaffData.sex);
    });

    it('should return not authentication with user as customer', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId.customer}`)
        .set('Authorization', `jwt ${accessToken.customer}`);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'You don\'t have permission to access');
    });

    it('should return success with user as admin', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId.admin}`)
        .set('Authorization', `jwt ${accessToken.admin}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body).to.have.property('email', sampleAdminData.email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleAdminData.birthDate)).toISOString());
      expect(response.body).to.have.property('avatar', config.avatar.default);
      expect(response.body).to.have.property('sex', sampleAdminData.sex);
    });

    it('shound return success', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId.Staff00}`)
        .set('Authorization', `jwt ${accessToken.Staff01}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleStaff[5].fullname);
      expect(response.body).to.have.property('email', sampleStaff[5].email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleStaff[5].birthDate)).toISOString());
      expect(response.body).to.have.property('avatar', config.avatar.default);
      expect(response.body).to.have.property('sex', sampleStaff[5].sex);
    });
  });
});
