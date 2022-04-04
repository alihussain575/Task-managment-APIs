const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routers/user');
const taskRoutes = require('./routers/tasks');
const auth = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);


module.exports = app