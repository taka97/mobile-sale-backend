import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';
import User from '../../src/models/user';

const sampleUserData = {
  email: 'vanhoang0609@gmail.com',
  password: 'Abc12345',
  name: 'Ho Van Hoang',
  phone: '0987654321'
}

describe('User Controller', () => {
  before('***Cleaning user collection', async () => {
    await User.deleteMany();
  });

  describe('#Create', () => {
    it('create a user', async () => {
      const response = await request(app).post('/api/users').send(sampleUserData);
      expect(response.status).equal(201);
      expect(response.body.data).to.have.property('email', sampleUserData.email);
      expect(response.body.data).to.have.property('name', sampleUserData.name);
      expect(response.body.data).to.have.property('phone', sampleUserData.phone);
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
