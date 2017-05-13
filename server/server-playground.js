var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required:true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default:false
  },
  completedAt: {
    type: Number,
    default:null
  }
});

// var newTodo = new Todo({
//   text:'First model todo',
//   completed:true
// });
//
// newTodo.save().then((res)=>{
//   console.log('Saved todo', res);
// }, (err)=>{
//   console.log('Unable to save todo ', err);
// });

// var secondTodo= new Todo({
//   text:'Second todo  ',
//   completedAt:1234567
// });
// secondTodo.save().then((res)=>{
//   console.log('Saved todo', res);
// },(err)=>{
//   console.log('Unable to save todo', err);
// });

var User= mongoose.model('User',{
  email:{
  type:String,
  required: true,
  trim: true,
  minlength:1
}
});

var firstUser= new User({
  email:'sameepsi@gmail.com'
});
firstUser.save().then((res)=>{
  console.log('User saved',res);
}, (err)=>{
  console.log('Unable to save user', err);
})
//user model
//email- require, trim, type-string minlength- 1
//save a user in db
