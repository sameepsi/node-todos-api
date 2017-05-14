const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id:new ObjectID(),
  text:'First test todo'
},
{
  _id:new ObjectID(),
  text:'Second test todo',
  completed: true
}];

//lifecycle method to run before each test runs

beforeEach((done)=>{
  Todo.remove({}).then((response)=>{
    return Todo.insertMany(todos);
  }).then(() => done());

});

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
