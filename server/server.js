const express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var{Todo} = require('./models/todo');

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

app.listen(3000,()=>{
  console.log('Started on port 3000');
})

module.exports={
  app
};
