// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var user={name:'Sameep', age:26};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`Unable to connect to db server`);
  }
  console.log('Connected to db server');

  db.collection('Todos').insertOne({
    text:'Some dummy text',
    completed:false
  },(err, res)=>{
    if(err){
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(res.ops,undefined,2));
  })

  db.collection('Users').insertOne({
    name:'Sameep Singhania',
    age:26,
    location:'Gurgaon, IN'

  },(err, res)=>{
    if(err){
      return console.log('Unable to insert user into db', err);
    }
    console.log(JSON.stringify(res.ops[0]._id.getTimestamp(),undefined,2));
  })

  db.close();
});
