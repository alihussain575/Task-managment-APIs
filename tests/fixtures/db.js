const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/tasks');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'test',
  email: 'test@gmail.com',
  password: 'test@12',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRETE),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'test',
  email: 'ali@gmail.com',
  password: 'alihussain@12',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRETE),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task one',
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task two',
  completed: true,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'task three',
  completed: false,
  owner: userOneId,
};

const setDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  return;
};

module.exports = {
  userOne,
  setDatabase,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
};
