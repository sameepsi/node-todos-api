// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`Unable to connect to db server`);
  }
  console.log('Connected to db server');

  //deleteMany
    // db.collection('Todos').deleteMany({text: 'sameep'}).then((res)=>{
    //   console.log(`Status: ${res.result.ok}`);
    //   console.log(`Number of todos deleted: ${res.result.n}`)
    // },(err)=>{
    //   console.log('Unable to delete todos', err);
    // })
  //deleteOne

  //findOneAndDelete

// db.collection('Todos').findOneAndDelete({completed:false}).then((res)=>{
//   console.log(res);
// },(err)=>{
//   console.log('Unable to delete todo', err);
// })


// db.collection('Users').deleteMany({name:'Sameep Singhania'}).then((result)=>{
//   console.log(`Status: ${result.result.ok}`);
//   console.log(`Number of users deleted: ${result.result.n}`)
// },(err)=>{
//   console.log('Unable to delete user', err);
// });

db.collection('Users').findOneAndDelete({_id:new ObjectID('591483cc937a0a1817923efd')}).then((res)=>{
  console.log(res);
}, (err)=>{
  console.log('Unable to delete user ', err);
})

  // db.close();
});
