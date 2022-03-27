const chalk = require('chalk');

const errorLog = (log) => {
  console.log(chalk.redBright.bold(log));
};

const successLog = (log) => {
  console.log(chalk.greenBright.inverse.bold(log));
};

const serverLog = (log) => {
  console.log(chalk.blueBright.bold(log));
}

module.exports = {
  errorLog,
  successLog,
  serverLog
};
