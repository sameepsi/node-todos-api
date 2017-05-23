const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')
const {populateTodos, todos, users, populateUsers} = require('./seed/seed');

//lifecycle method to run before each test runs
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=>{
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    supertest(app)
    .post('/todos')
    .send({text})
    .expect(201)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
    });
  });

  it('Should not create todo with bad data', (done) => {
    var text='';

    supertest(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>{
          done(e)
        });
    });
  });

});

describe('GET /todos', ()=>{
  it('Should get all todos', (done) => {
    supertest(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {

it('Should get todo on the basis of id', (done) => {
  supertest(app)
  .get(`/todos/${todos[0]._id.toHexString()}`)
  .expect(200)
  .expect((res) => {
    expect(res.body.todo.text).toEqual(todos[0].text)
  })
  .end(done);
});

it('Should get 404 status for valid id but not found in db', (done) => {
      supertest(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
});

it('Should get 400 status for invalid ids', (done) => {
  supertest(app)
  .get(`/todos/123`)
  .expect(400)
  .end(done);
});

});

describe('DELETE /todos/:id', ()=>{

  it('Should delete todo correspoding to the id', (done) => {
    supertest(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toEqual(todos[0]._id);
    })
    .end((err, resp) => {
      if(err){
        return done(err);
      }
      Todo.findById(todos[0]._id).then((todo) => {
        expect(todo).toBe(null);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  });

  it('Should return status code 404 for invalid object id', (done) => {
    supertest(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });

it('Should return status code 404 for valid object id but not in db', (done) => {
  supertest(app)
  .delete(`/todos/${new ObjectID().toHexString()}`)
  .expect(404)
  .end(done);
});
});

describe("PATCH /todos/:id", () => {
  it('Should update todo as completed', (done) => {
    supertest(app)
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({completed:true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toEqual(true);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(res.body.todo._id).then((todo) => {
          expect(todo.completed).toEqual(true);
          expect(todo.completedAt).toBeA('number').toNotEqual(null);
          done();
      }).catch((e)=>{
        done(e);
      })
    })
  });

  it('Should change completed value of todo to false', (done) => {
    supertest(app)
    .patch(`/todos/${todos[1]._id.toHexString()}`)
    .send({completed: false})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toEqual(false);
      expect(res.body.todo.completedAt).toEqual(null);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.findById(res.body.todo._id).then((todo) => {
        expect(todo.completed).toEqual(false);
        expect(todo.completedAt).toEqual(null);
        done();
      }).catch((e)=>done(e));
    })
  } );
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    supertest(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toEqual(users[0]._id.toHexString());
      expect(res.body.email).toEqual(users[0].email);

    })
    .end(done);
  });

  it('Should return a 401 if not authenticated', (done) => {
    supertest(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email='example@example.com';
    var password='abcdefr';
    supertest(app)
    .post('/users')
    .send({
      email, password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toEqual(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotEqual(password);
        done();
      })
    });
  });

  it('Should return validation error, if request invalid', (done) => {
    var email = 'invalidemail';
    var password = 'pass';

    supertest(app)
    .post('/users')
    .send({
      email, password
    })
    .expect(400)
    .end(done);
  });

  it('Should not create user if email already in use', (done) => {
    var email='sameepsi@gmail.com';
    var password = 'password';
    supertest(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});
