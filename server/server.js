var env=process.env.NODE_ENV || 'development';
console.log(`env ***** ${env}`);
if(env === 'development'){
  process.env.PORT=3000;
  process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
process.env.PORT=3000;
process.env.MONGODB_URI='mongodb://localhost:27017/TodoAppTest';

}

const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var{Todo} = require('./models/todo');

const port = process.env.PORT;

var app=express();

app.use(bodyParser.json());

app.post('/todos',(req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text:req.body.text
  });
  todo.save().then((doc) => {
    res.status(201);
    res.send(doc);
  }, (err) => {
    res.status(400);
    res.send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {

    res.status(200).send({todos});

  }, (err) => {
    res.status(400).send(err)
  });
});

app.get('/todos/:id',(req, res) => {
  var todo_id=req.params.id;
  if(!todo_id || !ObjectID.isValid(todo_id)){
    return res.status(400).send('Please enter valid id');

  }
  Todo.findById(todo_id).then((todo) => {
    if(!todo){
      return res.status(404).send(`No todo found with id ${todo_id}`);
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', (req,res)=>{
  var todo_id=req.params.id;
  if(!todo_id || !ObjectID.isValid(todo_id)){
  return  res.status(404).send('Todo not found');
  }
  Todo.findByIdAndRemove(todo_id).then((todo) => {
    if(!todo){
      return res.status(404).send('Todo not found');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);
  if(!id || !ObjectID.isValid(id)){
    return  res.status(404).send('Todo not found');
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();

  } else {
      body.completed = false;
      body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set:body
  }, {
    new: true
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
      res.status(200).send({todo});

  }).catch((e)=>{
    res.status(400).send();
  })
});

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
})

module.exports={
  app
};
