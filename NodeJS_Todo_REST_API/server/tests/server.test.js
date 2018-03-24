const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
// adding testing lifecycle method
// beforeEach will let us run some code before every single test

// Making an array of dummy todos
const todos = [{
  _id: new ObjectID(),
  text: 'First to-do'
}, {
  _id: new ObjectID(),
  text: 'Second to-do',
  completed: true,
  completedAt: 333
}];

// Make sure database is empty before every request
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)

  }).then(() => done());
});

// Using describe to group all of the routes
describe('POST /todos', () => {
  // Task 1: To verify, when we send an appropriate data, everything goes as expected.
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
          .post('/todos')
          .send({text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text);
          })
          .end((err, res) => {
            // Handle the errors that might have occurred above (if status != 200 or text was not proper)
            if(err){
              return done(err);
            }

            // Making the request to the database fetching all the to-dos and verifying that one to-do was indeed added
            Todo.find({text}).then((todos) => {
              // assert that the to-do we created does exist
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();
            }).catch((e) => done(e));
          });
  });

  // Task 2 - Todo does not get created when we send bad data
  it('should not create todo with invalid body data', (done) => {
      request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
              // Handle the errors that might have occurred above (if status != 200 or text was not proper)
              if(err){
                return done(err);
              }
              // Fetch the data from the database and make some assumptions related to the length of todos collection
              Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
              }).catch((e) => done(e));
            });
  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
            expect(res.body.todos.length).toBe(2);
          })
          .end(done);
  });
});


describe('GET /todos/:id', () => {
  // test case that verifies when we pass valid object id and that id matches a document, then that document actually comes back in the response body
  it('should return todo doc', (done) => {
    request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
  });

  // When we have invalid id, we get 404 back
  it('should return 404 if invalid id', (done) => {
    request(app)
          .get('/todos/123abc#')
          .expect(404)
          .end(done)
  });


});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
          .delete(`/todos/${hexId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
          })
          .end((err, res) => {
            if(err) {
              return done(err)
            }

            // Query database using findById
            // expect(null).toNotExist()

            // Making the request to the database fetching all the to-dos and verifying that one to-do was indeed added
            Todo.findById(hexId).then((todo) => {

              expect(todo).toBeNull();
              done();
            }).catch((e) => done(e));
            });

  });

  it('should return 404 if a todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
  });

  it('should return 404 if object ID is invalid', (done) => {
    request(app)
          .delete('/todos/123abc#')
          .expect(404)
          .end(done)
  });

});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first to-do item
    var hexId = todos[0]._id.toHexString();

    // update text, set completed true
    // creating dummy text -> assume it as a new updated text
    var text = 'This should be the new text';

    // Make assertion to expect 200 and verify text is changed, completed is true and completedAt is a number
    request(app)
          .patch(`/todos/${hexId}`)
          .send({
            completed: true,
            text: text
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof(res.body.todo.completedAt)).toBe('number');
          })
          .end(done);
  });

  it('should clear completedAt when todo is not completed', () => {
    // grab id of first to-do item
    var hexId = todos[1]._id.toHexString();

    // update text, set completed false
    var text = 'This should be another the new text';

    // Make assertion to expect 200
    // verify text is changed, completed is false and completedAt is a null

    request(app)
          .patch(`/todos/${hexId}`)
          .send({
            completed: false,
            text: text
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null);
          })
          .end(done);
  });
});
