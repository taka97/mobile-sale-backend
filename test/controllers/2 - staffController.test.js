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

  describe('#Update a user detail', () => {
    const accessToken = {};
    const userId = {};

    before('Create user account', async () => {
      await User.deleteMany();
      await User.create(sampleAdminData);
      await User.create(sampleStaffData);
      await User.create(sampleCustomerData);
      await User.create({ ...sampleStaff[5], roles: 'admin' });

      const data = [sampleAdminData, sampleStaffData, sampleCustomerData];
      const responseo = await request(app)
        .post('/api/authentication')
        .send({
          email: sampleStaff[5].email,
          password: sampleStaff[5].password,
          strategy: 'admin',
        });

      userId.otherStaff = responseo.body.userId;
      accessToken.otherStaff = responseo.body.accessToken;
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

    describe('##Check permission', () => {
      it('should return Dont have permission - customer', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.customer}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to access');
      });

      it('should return Dont have permission - staff (no owner)', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.otherStaff}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to modify');
      });

      it('should return fail - staff (owner)', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string')
          .include('Donnot have any field is modified');
      });

      it('should return Dont have permission - admin', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.admin}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to modify');
      });
    });

    describe('##Change user info - staff owner', () => {
      it('Change user info: email, expect fail', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            email: newData.email,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string')
          .include('"email" is not allowed');
      });

      it('Change user info: username, expect fail - 1', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            username: newData.username,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string')
          .include('Cannot change your username');
      });

      it('Change user info: username, expect fail - 2', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.otherStaff}`)
          .send({
            username: sampleStaffData.username,
          })
          .set('Authorization', `Bearer ${accessToken.otherStaff}`);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string')
          .include('username is existed!!');
      });


      it('Change user info: username, expect success - 3', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.otherStaff}`)
          .send({
            username: newData.username,
          })
          .set('Authorization', `Bearer ${accessToken.otherStaff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', newData.username);
        expect(response.body).to.have.property('fullname', sampleStaff[5].fullname);
        expect(response.body).to.have.property('email', sampleStaff[5].email);
        expect(response.body).to.have.property('birthDate',
          (new Date(sampleStaff[5].birthDate)).toISOString());
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('sex', sampleStaff[5].sex);
      });

      it('Change user info: fullname, expect fail', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            fullname: 'abc',
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string')
          .include('"fullname" length must be at least 5 characters long');
      });

      it('Change user info: fullname, expect success', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            fullname: newData.fullname,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(sampleStaffData.birthDate)).toISOString());
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
      });

      it('Change user info: phone, expect fail', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            phone: 'abc',
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', '"phone" with value "abc" fails to match the numbers pattern');
      });

      it('Change user info: phone, expect success', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            phone: newData.phone,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(sampleStaffData.birthDate)).toISOString());
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('phone', newData.phone);
      });

      it('Change user info: birthDate, expect fail', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            birthDate: 'abc',
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', '"birthDate" must be a valid date');
      });

      it('Change user info: birthDate, expect success', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            birthDate: newData.birthDate,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(newData.birthDate)).toISOString());
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('phone', newData.phone);
      });

      it('Change user info: cmnd, expect fail', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            cmnd: `${newData.cmnd}a`,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message',
            `"cmnd" with value "${`${newData.cmnd}a`}" fails to match the numbers pattern`);
      });

      it('Change user info: cmnd, expect success', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            cmnd: newData.cmnd,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(newData.birthDate)).toISOString());
        expect(response.body).to.have.property('cmnd', newData.cmnd);
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('phone', newData.phone);
      });

      it('Change user info: address, expect success', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}`)
          .send({
            address: newData.address,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(newData.birthDate)).toISOString());
        expect(response.body).to.have.property('cmnd', newData.cmnd);
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
        expect(response.body).to.have.property('phone', newData.phone);
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('address', newData.address);
      });

      // no oldpassword
      it('Change user info: passsword, expect fail - 1', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', '"oldPassword" is required');
      });

      // no new password
      it('Change user info: passsword, expect fail - 2', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: sampleAdminData.password,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', '"newPassword" is required');
      });

      // no repeat password
      it('Change user info: passsword, expect fail - 3', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: sampleAdminData.password,
            newPassword: newData.passsword,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', '"repeatPassword" is required');
      });

      // new password and repeat password donnt match
      it('Change user info: passsword, expect fail - 4', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: sampleAdminData.password,
            newPassword: newData.passsword,
            repeatPassword: `${newData.passsword}a`,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', 'repeatPassword donnot match newPassword');
      });

      // old password donnt match
      it('Change user info: passsword, expect fail - 5', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: `${sampleAdminData.password}a`,
            newPassword: newData.passsword,
            repeatPassword: newData.passsword,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have
          .property('message', 'old password donn\'t match');
      });

      // new password is so short
      it('Change user info: passsword, expect fail - 6', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: sampleAdminData.password,
            newPassword: 'a',
            repeatPassword: 'aa',
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(400);
        /* eslint-disable max-len */
        expect(response.body).to.have.property('message',
          '"newPassword" with value "a" fails to match the required pattern: /^[0-9a-zA-z]{5,128}$/');
      });

      it('Change user info: passsword, expect success - 7', async () => {
        const response = await request(app)
          .patch(`/api/staffs/${userId.staff}/password`)
          .send({
            oldPassword: sampleStaffData.password,
            newPassword: newData.passsword,
            repeatPassword: newData.passsword,
          })
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.not.have.property('password');
        expect(response.body).to.have.property('username', sampleStaffData.username);
        expect(response.body).to.have.property('fullname', newData.fullname);
        expect(response.body).to.have.property('email', sampleStaffData.email);
        expect(response.body).to.have.property('birthDate',
          (new Date(newData.birthDate)).toISOString());
        expect(response.body).to.have.property('cmnd', newData.cmnd);
        expect(response.body).to.have.property('sex', sampleStaffData.sex);
        expect(response.body).to.have.property('phone', newData.phone);
        expect(response.body).to.have.property('avatar', config.avatar.default);
        expect(response.body).to.have.property('address', newData.address);

        const { body } = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaffData.email,
            password: newData.passsword,
            strategy: 'staff',
          });
        expect(body.userId).to.equal(userId.staff);
      });
    });
  });

  describe('#Delete a user', () => {
    const accessToken = {};
    const userId = {};

    before('Create user account', async () => {
      await User.deleteMany();
      await User.create(sampleAdminData);
      await User.create(sampleStaffData);
      await User.create(sampleCustomerData);
      await User.create({ ...sampleStaff[5], roles: 'admin' });

      const data = [sampleAdminData, sampleStaffData, sampleCustomerData];
      const responseo = await request(app)
        .post('/api/authentication')
        .send({
          email: sampleStaff[5].email,
          password: sampleStaff[5].password,
          strategy: 'admin',
        });

      userId.otherStaff = responseo.body.userId;
      accessToken.otherStaff = responseo.body.accessToken;
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

    describe('##Without owner', () => {
      it('should return Dont have permission - customer', async () => {
        const response = await request(app)
          .delete(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.customer}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to access');
      });

      it('should return Dont have permission - staff (no owner)', async () => {
        const response = await request(app)
          .delete(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.otherStaff}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to modify');
      });

      it('should return Dont have permission - admin', async () => {
        const response = await request(app)
          .delete(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.admin}`);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.be.a('string')
          .include('You don\'t have permission to modify');
      });
    });

    describe('##Owner', () => {
      it('shound return done', async () => {
        const response = await request(app)
          .delete(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(response.status).to.equal(204);
        expect(response.body).to.be.empty;
        const authentication = await request(app)
          .post('/api/authentication')
          .send({
            email: sampleStaffData.email,
            password: sampleStaffData.password,
            strategy: 'staff'
          });
        expect(authentication.status).to.equal(400);
        expect(authentication.body).to.have.property('message', 'Incorrect email/username or password');
        const getDetail = await request(app)
          .get(`/api/staffs/${userId.staff}`)
          .set('Authorization', `Bearer ${accessToken.staff}`);
        expect(getDetail.status).to.equal(401);
        expect(getDetail.body).to.have.property('message', 'Unauthorized');
      });
    });
  });
});
