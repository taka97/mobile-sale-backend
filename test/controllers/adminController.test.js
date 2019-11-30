import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';
import { forEachAsync } from '../../src/utils/utils';

const sampleAdmin = [
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
];

const sampleCustomerData = {
  email: 'customer@gmail.com',
  fullname: 'Customer',
  username: 'customer',
  password: 'customer',
  birthDate: '2019/10/05',
  roles: 'customer',
};

const sampleStaffData = {
  email: 'staff@gmail.com',
  fullname: 'Staff',
  username: 'staff',
  password: 'staff',
  birthDate: '2019/10/05',
  roles: 'staff',
};

const sampleAdminData = {
  email: 'admin@gmail.com',
  fullname: 'Admin',
  username: 'admin',
  password: 'admin',
  birthDate: '2019/10/05',
  roles: 'admin',
};

describe('Admin Controller', () => {
  before('***Cleaning user collection', async () => {
    await User.deleteMany();
  });

  describe('#Create user', () => {
    describe('##Missing field', () => {
      it('shound return error missing "password"', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[0]);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string').include('"password" is required');
      });

      it('shound return error missing "fullname"', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[1]);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string').include('"fullname" is required');
      });

      it('shound return error missing "email"', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[2]);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string').include('"email" is required');
      });

      it('shound return error missing "birthDate"', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[3]);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string').include('"birthDate" is required');
      });
    });

    describe('##Enough field', () => {
      it('shound return success and user data', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[4]);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('fullname', sampleAdmin[4].fullname);
        expect(response.body).to.have.property('email', sampleAdmin[4].email);
        expect(response.body).to.have.property('birthDate',
          (new Date(sampleAdmin[4].birthDate)).toISOString());
      });

      it('shound return false with error user already exists', async () => {
        const response = await request(app)
          .post('/api/admin')
          .send(sampleAdmin[4]);
        expect(response.status).to.equal(403);
        expect(response.body.message).to.be.a('string').include('That user already exists!');
      });
    });
  });

  describe('#Get a user detail', () => {
    const noExistId = '5de25b1504da0435c8e714ad';
    let accessToken;
    let userId;

    before('Clean all user', async () => {
      await User.deleteMany();
      await User.create(sampleAdminData);

      const response = await request(app)
        .post('/api/authentication')
        .send({
          email: sampleAdminData.email,
          password: sampleAdminData.password,
          strategy: 'admin',
        });
      accessToken = response.body.accessToken;
      userId = response.body.userId;
    });

    it('should return Id invalid with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/abc')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return Id invalid with Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/abc')
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return No record with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${noExistId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.a('string')
        .include(`No record found for id ${noExistId}`);
    });

    it('should return No record with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${noExistId}`)
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.a('string')
        .include(`No record found for id ${noExistId}`);
    });

    it('should return user data with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body).to.have.property('email', sampleAdminData.email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleAdminData.birthDate)).toISOString());
    });

    it('should return user data with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${userId}`)
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id');
      expect(response.body).to.not.have.property('password');
      expect(response.body).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body).to.have.property('email', sampleAdminData.email);
      expect(response.body).to.have.property('birthDate',
        (new Date(sampleAdminData.birthDate)).toISOString());
    });
  });

  describe('#Get list of user (admin)', () => {
    const accessToken = {};
    const userId = {};

    before('Create user account', async () => {
      await User.deleteMany();
      await User.create(sampleAdminData);
      await User.create(sampleStaffData);
      await User.create(sampleCustomerData);

      const data = [sampleAdminData, sampleStaffData, sampleCustomerData];
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

    it('Admin get should return user data', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${accessToken.admin}`);
      expect(response.status).to.equal(200);
      expect(response.body.total).to.equal(1);
      expect(response.body.limit).to.equal(10);
      expect(response.body.skip).to.equal(0);
      expect(response.body.data).to.be.an('array');
      expect(response.body.data).to.have.length(1);
      expect(response.body.data[0]).to.have.property('_id');
      expect(response.body.data[0]).to.not.have.property('password');
      expect(response.body.data[0]).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body.data[0]).to.have.property('email', sampleAdminData.email);
      expect(response.body.data[0]).to.have.property('birthDate',
        (new Date(sampleAdminData.birthDate)).toISOString());
    });

    it('Staff get should return don\'t have permission', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${accessToken.staff}`);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'You don\'t have permission to access');
    });

    it('Customer get should return don\'t have permission', async () => {
      const response = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${accessToken.customer}`);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message', 'You don\'t have permission to access');
    });
  });
});
