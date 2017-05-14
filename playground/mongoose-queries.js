const {mongooes} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

var user_id='591545843104141d700241a5';
// var id = '5918142c1333c7260a7bf2b022';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// }, (err)=>{
//   console.log(err);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo) => {
//   if(!todo){
//     return console.log('Id not found!!');
//   }
//   console.log('Todo', todo);
// });

// Todo.findById(id)
// .then((todo) => {
//   if(!todo){
//     return console.log('ID not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e)=>{
//   console.log(e);
// });

User.findById(user_id).then((user) => {
  if(!user){
    return console.log(`Unable to find user for the user id ${user_id}`);

  }
  console.log('User', user);
}).catch((err) => {
  console.log(err);
})
