const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/auth');
const { successLog, errorLog } = require('../colors/colors');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const tasks = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await tasks.save();
    successLog(tasks);
    res.status(201).send(tasks);
  } catch (err) {
    errorLog(err);
    res.status(400).send(err);
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks').execPopulate();
    successLog(req.user.tasks);
    res.status(200).send(req.user.tasks);
  } catch (err) {
    errorLog(err);
    res.status(500).send(err);
  }
});

router.get('/tasks/:id', auth, async (request, response) => {
  try {
    const task = await Task.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!task) {
      errorLog('no task found');
      return response.status(404).send('no task found');
    }

    successLog(task);
    response.status(200).send(task);
  } catch (err) {
    errorLog(err);
    response.status(500).send(err);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ['description', 'completed', 'created'];
  const isValidOperations = updates.every((update) =>
    allowedUpdate.includes(update)
  );

  if (!isValidOperations) {
    errorLog('Invalid Update');
    return res.status(400).send({ error: 'Invalid Update' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      errorLog('task not found');
      return res.status(404).send('task not found');
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();

    successLog(task);
    res.status(200).send(task);
  } catch (err) {
    errorLog(err);
    res.status(500).send(err);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      errorLog('task not found');
      return res.status(404).send('task not found');
    }

    successLog(task);
    res.status(200).send(task);
  } catch (err) {
    errorLog(err);
    res.status(500).send(err);
  }
});

module.exports = router;
