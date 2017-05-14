const {mongooes} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>console.log(result));


// Todo.findOneAndRemove({_id:}).then((result)=>{
// });

Todo.findByIdAndRemove('591829fd4c712e51503fd120').then((result) => {
console.log(result);
});
