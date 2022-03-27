const { MongoClient, ObjectID } = require('mongodb');

const uri =
  'mongodb+srv://ali:passpass@nodeprac.wiljh.mongodb.net/test?retryWrites=true&w=majority';

const databaseName = 'test';

const id = new ObjectID();

// console.log(id.getTimestamp());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
});

client.connect((err) => {
  if (err) {
    console.log('testing');
    return console.log(
      'Unable to connect to the mongoDB server. Error:',
      err.message
    );
  }
  const userCollection = client.db(databaseName).collection('users');
  const taskCollection = client.db(databaseName).collection('tasks');

  // userCollection.findOne(
  //   { _id: new ObjectID('623c193c0eb0ce3175b33bee') },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log(result, 'result');
  //   }
  // );

  // taskCollection.insertMany([
  //   {
  //     description: 'Clean the house',
  //     completed: false,
  //   },
  //   {
  //     description: 'go to the gym',
  //     completed: true,
  //   },
  //   {
  //     description: 'go shopping',
  //     completed: true,
  //   },
  //   {
  //     description: 'go to the movies',
  //     completed: false,
  //   },
  // ]);

  // userCollection.insertOne(
  //   { _id: id, name: 'test', age: 20 },
  //   (err, result) => {
  //     if (err) {
  //       return console.log(err);
  //     }

  //     console.log(result.ops);
  //   }
  // );

  // collection.insertMany(
  //   [
  //     {
  //       name: 'ali',
  //       age: '19',
  //     },
  //     {
  //       name: 'Andrew',
  //       age: '20',
  //     },
  //   ],
  //   (err, result) => {
  //     if (err) {
  //       return console.log(err);
  //     }

  //     console.log(result.ops);
  //   }
  // );

  userCollection
    .updateOne(
      {
        _id: new ObjectID('623c27f3b284d1443fe0cdde'),
      },
      {
        $inc: {
          age: 1,
        },
      }
    )
    .then((result) => {
      console.log('updated', result);
    })
    .catch((err) => {
      console.log(err);
    });

  client.close();
});
