// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log(`Unable to connect to db server`);
  }
  console.log('Connected to db server');

//  db.collection('Todos').findOneAndUpdate({text:'third'},{
  //   $set:{completed:true, text:'third'},
  //   $unset:{name:""}
  // },{
  //   returnOriginal:false
  // }).then((res)=>{
  //   console.log(res);
  // },(err)=>{
  //   console.log("Unable to update todo ", err);
  // });

db.collection('Users').findOneAndUpdate({_id:new ObjectID("591484fb7789db18e351df8f")},{
  $set:{name:'Sameep Singhania'},
  $inc:{age:-1}
},{
  returnOriginal: false
}).then((result)=>{
  console.log(result);
}, (err)=>{
  console.log(err);
});

  // db.close();
});
