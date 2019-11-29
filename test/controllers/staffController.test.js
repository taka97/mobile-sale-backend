import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';

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
];

const sampleStaffData = {
  email: 'vanhoang0609@gmail.com',
  fullname: 'Van Hoang',
  password: 'Abc12345',
  birthDate: '2019/10/05',
};

describe('Staff Controller', () => {
  let accessToken;
  let userId;

  // eslint-disable-next-line func-names
  before('***Cleaning user collection', async () => {
    await User.deleteMany();
  });

  describe('#Create user', () => {
    describe('##Missing field', () => {
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
    });

    describe('##Enough field', () => {
      it('shound return success and user data', async () => {
        const response = await request(app)
          .post('/api/staffs')
          .send(sampleStaff[4]);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('fullname', sampleStaff[4].fullname);
        expect(response.body).to.have.property('email', sampleStaff[4].email);
        expect(response.body).to.have.property('birthDate', (new Date(sampleStaff[4].birthDate)).toISOString());
      });

      it('shound return false with error user already exists', async () => {
        const response = await request(app)
          .post('/api/staffs')
          .send(sampleStaff[4]);
        expect(response.status).to.equal(403);
        expect(response.body.message).to.be.a('string').include('That user already exists!');
      });
    });
  });

  describe('#Get a user detail', () => {
    before(async () => {
      await User.deleteMany();
      await User.create(sampleStaffData);

      const response = await request(app)
        .post('/api/authentication')
        .send({
          email: sampleStaffData.email,
          password: sampleStaffData.password,
        });
      accessToken = response.body.accessToken;
      userId = response.body.userId;
    });

    it('should return Id invalid with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/staffs/abc')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return Id invalid with Token in Authorization header', async () => {
      const response = await request(app)
        .get('/api/staffs/abc')
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.a('string').include('"Id" is invalid');
    });

    it('should return user data with Bearer Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.not.have.property('password');
      expect(response.body.user).to.have.property('fullname', sampleStaffData.fullname);
      expect(response.body.user).to.have.property('email', sampleStaffData.email);
      expect(response.body.user).to.have.property('birthDate', (new Date(sampleStaffData.birthDate)).toISOString());
    });

    it('should return user data with Token in Authorization header', async () => {
      const response = await request(app)
        .get(`/api/staffs/${userId}`)
        .set('Authorization', `jwt ${accessToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property('_id');
      expect(response.body.user).to.not.have.property('password');
      expect(response.body.user).to.have.property('fullname', sampleStaffData.fullname);
      expect(response.body.user).to.have.property('email', sampleStaffData.email);
      expect(response.body.user).to.have.property('birthDate', (new Date(sampleStaffData.birthDate)).toISOString());
    });
  });
});
