// Library Imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local Imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.json());

// Configure POST route -> this route will let us create a new to-do
app.post('/todos', (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    // console.log('Unable to save to-do')
    res.status(400).send(e);
  });
});



// Configure GET route -> to get all todos
app.get('/todos', (req, res) => {
  // Get all todos in the collection
  Todo.find().then((todos) => {
    // res.send(todos);
    res.send({todos});
  }, (e) => {
      res.status(400).send(e);
  })
});

// Configure GET route -> to get a todo by an id
// GET /todos/123
app.get('/todos/:id', (req, res) => {
  // req.params is going to be an object which will have key value pairs
  // key -> URL parameter (id in this case)
  // value -> value that is put after /todos/

  //res.send(req.params);

    // get the id
    var id = req.params.id;

    // validate the id using isValid
    //if not valid, stop the execution of function and respond with 404, to let know user that id was not found
    if(!ObjectID.isValid(id)) {
      //return console.log('ID not valid');
      //return Error({ status: 404 })
      return res.status(404).send();
    }

    // start querying database with using findById
      // success case
        //if there is todo -> send it back
        // if there is no todo -> id was not found in collection -> send 404 with empty body
      // error case - 400 status code and send back empty body
      Todo.findById(id).then((todo) => {
        if(!todo) {
          return res.status(404).send();
        }
        //res.send(todo);
        res.status(200).send({todo});
      }).catch((e) => {
        res.status(400).send();
      });
});

// Configure DELETE route -> to delte a todo by an id
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // Validate the id , if not valid return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // remove todo by id
    // success case
      // Make sure todo was deleted by checking the document that came back, if no doc send 404
    // error case - return 400 with empty body
    Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      //res.send(todo);
      res.status(200).send({todo});
    }).catch((e) => {
      res.status(400).send();
    });


});

// Configure PATCH endpoint
app.patch('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id;

  // request body where updates are going to be stored
  // User will only be updating only two prperties -> text, completed
  var body = _.pick(req.body, ['text', 'completed']);

  // Validate the id , if not valid return 404
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // checking the completed value and using it to set completedAt value
  // If user sets completed value to true, set the timestamp as completedAt value
  // If user sets completed value to false, clear the timestamp value
  if(_.isBoolean(body.completed) && body.completed) {
    // set completedAt to current timestamp
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // Make a query to update a database
  Todo.findByIdAndUpdate(id,
    {
      $set: body
    }, {
      new: true  //returns the updated document
    }).then((todo) => {
      // Check if todo object exists
      if(!todo) {
        return res.status(404).send();
      }

      res.status(200).send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
});

module.exports = {app};

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
