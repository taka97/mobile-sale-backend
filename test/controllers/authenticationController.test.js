import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';

const sampleAdmin = [
  {
    email: 'admin01@mobilesale.com',
    password: 'Admin01',
    fullname: 'Admin 01',
    username: 'admin01',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'admin',
  },
  {
    email: 'admin02@mobilesale.com',
    password: 'Admin02',
    fullname: 'Admin 02',
    username: 'admin02',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'admin',
  },
];

const noExistAdmin = [
  {
    email: 'admin03@mobilesale.com',
    password: 'Admin03',
    fullname: 'Admin 03',
    username: 'admin03',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'admin',
  },
  {
    email: 'admin04@mobilesale.com',
    password: 'Admin04',
    fullname: 'Admin 04',
    username: 'admin04',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'admin',
  },
];

const sampleStaff = [
  {
    email: 'staff01@store.com',
    password: 'staff01',
    fullname: 'staff 01 - store',
    username: 'store_staff01',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'staff',
    storeId: '5ddd3d236f02f3381c484bce',
  },
  {
    email: 'staff02@store.com',
    password: 'staff02',
    fullname: 'staff 02 - store',
    username: 'store_staff02',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'staff',
    storeId: '5ddd3d236f02f3381c484bce',
  },
];

const noExistStaff = [
  {
    email: 'staff03@store.com',
    password: 'staff03',
    fullname: 'staff 03 - store',
    username: 'store_staff03',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'staff',
    storeId: '5ddd3d236f02f3381c484bce',
  },
  {
    email: 'staff04@store.com',
    password: 'staff04',
    fullname: 'staff 04 - store',
    username: 'store_staff04',
    phone: '0987654321',
    birthDate: '10/06/1997',
    roles: 'staff',
    storeId: '5ddd3d236f02f3381c484bce',
  },
]

const sampleCustomer = [
  {
    email: 'vanhoang0609@gmail.com',
    password: 'taka01',
    fullname: 'Ho Van Hoang Gmail',
    username: 'gmailtaka',
    phone: '0987654321',
    birthDate: '10/06/1997',
  },
  {
    email: 'vanhoang0609@yahoo.com',
    password: 'taka02',
    username: 'yahootaka',
    fullname: 'Ho Van Hoang Yahoo',
    phone: '0987654321',
    birthDate: '10/06/1997',
  },
];

const noExistCustomer = [
  {
    email: 'vanhoang0609@hotmail.com',
    password: 'Abc12345',
    fullname: 'Ho Van Hoang Hotmail',
    username: 'hotmailtaka',
    phone: '0987654321',
    birthDate: '10/06/1997',
  },
  {
    email: 'vanhoang0609@yahoo.com.vn',
    password: 'Abc12345',
    fullname: 'Ho Van Hoang Yahoo.com',
    username: 'yahoocomtaka',
    phone: '0987654321',
    birthDate: '10/06/1997',
  },
];

describe('Authentication Controller', () => {
  // eslint-disable-next-line func-names
  before('*** Create user before testing', async function () {
    this.timeout(5000);
    await User.deleteMany();
    await User.create(sampleCustomer);
    await User.create(sampleStaff);
    await User.create(sampleAdmin);
  });

  describe('#Sign in - Customer', () => {
    describe('##Missing field', () => {
      it('Sign in with no field', async () => {
        const response = await request(app)
          .post('/api/authentication');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[0].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[1].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[0].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[1].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleCustomer[0].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleCustomer[1].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });
    });

    describe('##Sign without strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[0].email,
            password: noExistCustomer[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[1].email,
            password: noExistCustomer[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });
    });

    describe('##Sign with right strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[0].email,
            password: noExistCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[1].email,
            password: noExistCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });
    });

    describe('##Sign with wrong strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[0].email,
            password: noExistCustomer[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistCustomer[1].email,
            password: noExistCustomer[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });
    });
  });

  describe.only('#Sign in - Staff', () => {
    describe('##Missing field', () => {
      it('Sign in with no field', async () => {
        const response = await request(app)
          .post('/api/authentication');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleStaff[0].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleStaff[1].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleStaff[0].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleStaff[1].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleStaff[0].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleStaff[1].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });
    });

    describe('##Sign without strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistStaff[0].email,
            password: noExistStaff[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistStaff[1].email,
            password: noExistStaff[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].email,
            password: sampleStaff[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].email,
            password: sampleStaff[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].username,
            password: sampleStaff[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].username,
            password: sampleStaff[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].email,
            password: sampleStaff[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].email,
            password: sampleStaff[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].username,
            password: sampleStaff[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].username,
            password: sampleStaff[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });
    });

    describe('##Sign with right strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[0].email,
            password: noExistAdmin[0].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[1].email,
            password: noExistAdmin[1].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].email,
            password: sampleStaff[1].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].email,
            password: sampleStaff[0].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].username,
            password: sampleStaff[1].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].username,
            password: sampleStaff[0].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].email,
            password: sampleStaff[0].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
        expect(response.body).to.have.property('storeId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].email,
            password: sampleStaff[1].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
        expect(response.body).to.have.property('storeId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[0].username,
            password: sampleStaff[0].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
        expect(response.body).to.have.property('storeId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaff[1].username,
            password: sampleStaff[1].password,
            strategy: 'staff',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
        expect(response.body).to.have.property('storeId').lengthOf(24);
      });
    });

    describe('##Sign with wrong strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[0].email,
            password: noExistAdmin[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[1].email,
            password: noExistAdmin[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });
    });
  });


  describe('#Sign in - Admin', () => {
    describe('##Missing field', () => {
      it('Sign in with no field', async () => {
        const response = await request(app)
          .post('/api/authentication');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[0].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just email field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[1].email });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[0].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just username field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ email: sampleCustomer[1].username });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleCustomer[0].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });

      it('Sign in with just password field - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({ password: sampleCustomer[1].password });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Missing credentials');
      });
    });

    describe('##Sign without strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[0].email,
            password: noExistAdmin[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[1].email,
            password: noExistAdmin[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].email,
            password: sampleAdmin[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].email,
            password: sampleAdmin[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].username,
            password: sampleAdmin[0].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].username,
            password: sampleAdmin[1].password,
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });
    });

    describe('##Sign with right strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[0].email,
            password: noExistAdmin[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[1].email,
            password: noExistAdmin[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].email,
            password: sampleAdmin[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].email,
            password: sampleAdmin[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].username,
            password: sampleAdmin[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].username,
            password: sampleAdmin[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].email,
            password: sampleAdmin[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].email,
            password: sampleAdmin[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[0].username,
            password: sampleAdmin[0].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleAdmin[1].username,
            password: sampleAdmin[1].password,
            strategy: 'admin',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });
    });

    describe('##Sign with wrong strategy field', () => {
      it('Sign in with user is not exists - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[0].email,
            password: noExistAdmin[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is not exists - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: noExistAdmin[1].email,
            password: noExistAdmin[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right email, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right username, wrong password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Incorrect email/username or password');
      });

      it('Sign in with user is right both email and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].email,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both email and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].email,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 1', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[0].username,
            password: sampleCustomer[0].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });

      it('Sign in with user is right both username and password - 2', async () => {
        const response = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleCustomer[1].username,
            password: sampleCustomer[1].password,
            strategy: 'customer',
          });
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('accessToken').lengthOf(260);
        expect(response.body).to.have.property('userId').lengthOf(24);
      });
    });
  });
});
