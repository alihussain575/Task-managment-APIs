const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routers/user');
const taskRoutes = require('./routers/tasks');
const { serverLog } = require('./colors/colors');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if(req.method === 'GET') {
//       res.send('GET requests are disabled');
//     } else {
//       next();
//     }
// });


// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!');
// });

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  serverLog(`server running on port ${port}`);
});


const Task = require('./models/tasks');
const User = require('./models/user');

const main = async () => {
  // const task = await Task.findById('62402aa85bd6145a3e23749e');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  const user =  await User.findById('6240299360b3665699e0c192');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
}

main()
