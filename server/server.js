require('./config/config')

const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const _ = require('lodash');


var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var{Todo} = require('./models/todo');
var {authenticate} =require ('./middleware/authenticate');

const port = process.env.PORT;

var app=express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text:req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    res.status(201);
    res.send(doc);
  }, (err) => {
    res.status(400);
    res.send(err);
  });
});

//To create new users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email','password']);
  var user=new User(body);

user.save().then(() => {
  return user.generateAuthToken();

}).then((token) => {
  res.header('x-auth', token).send(user);
}).catch((e) => {

  res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator:req.user._id}).then((todos) => {

    res.status(200).send({todos});

  }, (err) => {
    res.status(400).send(err)
  });
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  })
});

app.get('/todos/:id',authenticate, (req, res) => {
  var todo_id=req.params.id;
  if(!todo_id || !ObjectID.isValid(todo_id)){
    return res.status(400).send('Please enter valid id');

  }
  Todo.findOne({_id:todo_id, _creator: req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send(`No todo found with id ${todo_id}`);
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/todos/:id', authenticate, (req,res)=>{
  var todo_id=req.params.id;
  if(!todo_id || !ObjectID.isValid(todo_id)){
  return  res.status(404).send('Todo not found');
  }
  Todo.findOneAndRemove({_id:todo_id, _creator:req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send('Todo not found');
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id:id,
    _creator: req.user._id
  }, {
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
