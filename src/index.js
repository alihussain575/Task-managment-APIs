const app = require('./app');
const { serverLog } = require('./colors/colors');

const port = process.env.PORT;

console.log({env : process.env.JWT_SECRETE})

app.listen(port, () => {
  serverLog(`server running on port ${port}`);
});
