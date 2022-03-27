const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { successLog, errorLog } = require('../colors/colors');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const users = new User(req.body);

  try {
    await users.save();
    successLog(users);
    const token = await users.generateAuthToken();
    res.status(201).send({
      users,
      token,
    });
  } catch (err) {
    errorLog(err);
    res.status(400).send(err);
  }
});

router.get('/users/user-profile', auth, async (req, res) => {
  successLog(req.user);
  res.send(req.user);
});

router.patch('/users/user-profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ['name', 'email', 'password', 'age'];
  const isValidOperations = updates.every((update) => {
    return allowedUpdate.includes(update);
  });

  if (!isValidOperations) {
    errorLog('Invalid Updates!');
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    successLog(req.user);
    res.status(200).send(req.user);
  } catch (err) {
    errorLog(err);
    res.status(400).send(err);
  }
});

router.delete('/users/user-profile', auth, async (req, res) => {
  try {
    await req.user.remove();

    successLog(req.user);
    res.status(200).send(req.user);
  } catch (err) {
    errorLog(err);
    res.status(400).send(err);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    successLog(user);
    res.status(200).send({
      user,
      token,
    });
  } catch (err) {
    errorLog(err);
    res.status(400).send(err);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    successLog(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    errorLog(e);
    res.status(500).send(e);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    successLog(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    errorLog(e);
    res.status(500).send(e);
  }
});

module.exports = router;
