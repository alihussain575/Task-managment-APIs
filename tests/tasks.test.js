const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/tasks');
const oneUser = require('./fixtures/db');

const {
  userOne,
  userOneId,
  setDatabase,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
} = oneUser;

jest.setTimeout(30000);

beforeEach(setDatabase);


describe('when user is authenticated', () => {
  it('should create task', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'testing task',
      })
      .expect(201);
  
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
  });

  it('get all tasks for user', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
    expect(response.body.length).toEqual(3);
  });

  it('should not create task with invalid description', async () => {
    const response = await request(app)
    .post('/tasks')
    .send({})
    .expect(401);
  });

  it('should not delete other users task', async () => {
    const response = await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  });
  
})
