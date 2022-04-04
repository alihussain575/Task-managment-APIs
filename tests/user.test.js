const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const oneUser = require('./fixtures/db');

const { userOne, userOneId, setDatabase } = oneUser;

jest.setTimeout(30000);

beforeEach(setDatabase);
describe('when user is not authenticated', () => {
  it('should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'ali hussain',
        email: 'alihussian@gmail.com',
        password: 'passpass',
      })
      .expect(201);

    // fetch user form database
    const user = await User.findById(response.body.users._id);
    expect(user).not.toBeNull();
    // assertion about response
    expect(response.body).toMatchObject({
      users: {
        name: 'ali hussain',
        email: 'alihussian@gmail.com',
      },
      token: user.tokens[0].token,
    });
    expect(user.password).not.toBe('passpass');
  });

  it('should login existing user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);
  });

  it('should not login none existing user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'somthing@test.com',
        password: 'somthing',
      })
      .expect(400);
  });

  it('should get profile for user', async () => {
    await request(app)
      .get('/users/user-profile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  it('should not get profile for not authenticated user', async () => {
    await request(app)
    .get('/users/user-profile')
    .send()
    .expect(401);
  });

  it('should upload avatar image', async () => {
    await request(app)
      .post('/users/user-profile/upload')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/profile-pic.jpg')
      .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });

  it('should update valid user fields', async () => {
    await request(app)
      .patch('/users/user-profile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'ali hussain',
      })
      .expect(200);
  });

  it('should not update invalid user fields', async () => {
    await request(app)
      .patch('/users/user-profile')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'lahore',
      })
      .expect(400);
  });
});
