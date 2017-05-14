const expect = require('expect');
const supertest = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text:'First test todo'
},
{
  text:'Second test todo'
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
