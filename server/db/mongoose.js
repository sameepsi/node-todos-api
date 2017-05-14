var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(procee.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports={
  mongoose
};
