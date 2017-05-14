const express = require('express');
const {ObjectId} = require('mongodb');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var{Todo} = require('./models/todo');

const port = process.env.PORT || 3000;

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
  if(!todo_id || !ObjectId.isValid(todo_id)){
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

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
})

module.exports={
  app
};
