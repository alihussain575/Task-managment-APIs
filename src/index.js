const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routers/user');
const taskRoutes = require('./routers/tasks');
const { serverLog } = require('./colors/colors');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  serverLog(`server running on port ${port}`);
});
