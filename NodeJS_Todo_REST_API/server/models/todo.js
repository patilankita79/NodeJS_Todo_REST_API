var mongoose = require('mongoose');

// Create Todo model
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // validator required (Value must exist)
    minlength: 1,    // Custom validator for Strings
    trim: true //trims off any white space at the end or begining of the string
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null // completedAt will be present only when todo is been completed
  }
});

// Set module.exports equal to an object
module.exports = {Todo};
