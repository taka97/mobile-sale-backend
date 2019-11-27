import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';

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

const sampleAdminData = {
  email: 'vanhoang0609@gmail.com',
  fullname: 'Van Hoang',
  password: 'Abc12345',
  birthDate: '2019/10/05',
};

describe('Admin Controller', () => {
  let accessToken;
  let userId;

  // eslint-disable-next-line func-names
  before('***Cleaning user collection', async function () {
    this.timeout(5000);
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
        expect(response.body.user).to.have.property('_id');
        expect(response.body.user).to.not.have.property('password');
        expect(response.body.user).to.have.property('fullname', sampleAdmin[4].fullname);
        expect(response.body.user).to.have.property('email', sampleAdmin[4].email);
        expect(response.body.user).to.have.property('birthDate', (new Date(sampleAdmin[4].birthDate)).toISOString());
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
    before(async () => {
      await User.deleteMany();
      await User.create(sampleAdminData);

      const response = await request(app)
        .post('/api/authentication')
        .send({
          email: sampleAdminData.email,
          password: sampleAdminData.password,
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

    it('should return user data with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.not.have.property('password');
      expect(response.body.user).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body.user).to.have.property('email', sampleAdminData.email);
      expect(response.body.user).to.have.property('birthDate', (new Date(sampleAdminData.birthDate)).toISOString());
    });

    it('should return user data with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/admin/${userId}`)
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.not.have.property('password');
      expect(response.body.user).to.have.property('fullname', sampleAdminData.fullname);
      expect(response.body.user).to.have.property('email', sampleAdminData.email);
      expect(response.body.user).to.have.property('birthDate', (new Date(sampleAdminData.birthDate)).toISOString());
    });
  });
});
