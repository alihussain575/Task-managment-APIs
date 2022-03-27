const mongoose = require('mongoose');

const uri =
  'mongodb://ali:passpass@nodeprac-shard-00-00.wiljh.mongodb.net:27017,nodeprac-shard-00-01.wiljh.mongodb.net:27017,nodeprac-shard-00-02.wiljh.mongodb.net:27017/test?ssl=true&replicaSet=atlas-or5um9-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
