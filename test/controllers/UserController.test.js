import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';

const sampleUserData = [{
  email: 'vanhoang0609@gmail.com',
  password: 'Abc12345',
  name: 'Ho Van Hoang',
  phone: '0987654321'
}]

describe('User Controller', () => {
  before('***Cleaning user collection', async () => {
    await User.deleteMany();
  });

  describe('#Create', () => {
    it('Create a user - 1', async () => {
      const response = await request(app).post('/api/users').send(sampleUserData[0]);
      expect(response.status).equal(201);
      expect(response.body.data).to.have.property('email', sampleUserData[0].email);
      expect(response.body.data).to.have.property('name', sampleUserData[0].name);
      expect(response.body.data).to.have.property('phone', sampleUserData[0].phone);
      expect(response.body.data).to.not.have.property('password');
    });

    it('Create a user - 2', async () => {
      const response = await request(app).post('/api/users').send(sampleUserData[1]);
      expect(response.status).equal(201);
      expect(response.body.data).to.have.property('email', sampleUserData[1].email);
      expect(response.body.data).to.have.property('name', sampleUserData[1].name);
      expect(response.body.data).to.have.property('phone', sampleUserData[1].phone);
      expect(response.body.data).to.not.have.property('password');
    });
  });

  describe('#Index', () => {
  });

  describe('#Show', () => {

  });

  describe('#Update', () => {

  });

  describe('#Delete', () => {

  });
});
