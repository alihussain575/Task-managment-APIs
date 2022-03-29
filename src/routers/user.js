const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { successLog, errorLog } = require('../colors/colors');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const users = new User(req.body);

  try {
    await users.save();
    successLog(users);
    const token = await users.generateAuthToken();

    // let transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'alihussainirfan575@gmail.com',
    //     pass: 'alihussainkhan',
    //   },
    // });

    // let mailOptions = {
    //   from: 'alihussainirfan575@gmail.com',
    //   to: `${req.users.email}`,
    //   subject: 'description',
    //   text: `details:`,
    //   html: `<>
    //   <h1>Welcome to Task Manager</h1>
    //   <p>Hello ${req.users.name} </br>
    //     Your Account was created
    //   </p>
    //   </>`,
    // };

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
    // let transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'alihussainirfan575@gmail.com',
    //     pass: 'alihussainkhan',
    //   },
    // });

    // let mailOptions = {
    //   from: 'alihussainirfan575@gmail.com',
    //   to: `${req.body.email}`,
    //   subject: 'description',
    //   text: `details:`,
    //   html: `<>
    //   <h1>Welcome to Task Manager</h1>
    //   <p>Hello ${req.body.name} </br>
    //     You have logged in successfully
    //   </p>
    //   </>`,
    // };

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

    // let transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'alihussainirfan575@gmail.com',
    //     pass: 'alihussainkhan',
    //   },
    // });

    // let mailOptions = {
    //   from: 'alihussainirfan575@gmail.com',
    //   to: `${req.user.email}`,
    //   subject: 'description',
    //   text: `details:`,
    //   html: `<>
    //   <h1>Welcome to Task Manager</h1>
    //   <p>Hello ${req.user.name} </br>
    //     you have logged out
    //   </p>
    //   </>`,
    // };

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

    // let transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'alihussainirfan575@gmail.com',
    //     pass: 'alihussainkhan',
    //   },
    // });

    // let mailOptions = {
    //   from: 'alihussainirfan575@gmail.com',
    //   to: `${req.user.email}`,
    //   subject: 'description',
    //   text: `details:`,
    //   html: `<>
    //   <h1>Welcome to Task Manager</h1>
    //   <p>Hello ${req.user.name} </br>
    //     you have logged out of all devices
    //   </p>
    //   </>`,
    // };

    successLog(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    errorLog(e);
    res.status(500).send(e);
  }
});

router.post(
  '/users/user-profile/upload',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save(req.user.avatar);

    res.send('uploaded');
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/users/user-profile/upload', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();

  res.send('Deleted');
});

router.get('/users/:id/upload', async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-type', 'image/png');

    res.send(user.avatar);
  } catch (e) {
    errorLog(e);
    res.status(500).send();
  }
});

module.exports = router;
