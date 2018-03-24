var mongoose = require('mongoose');

// Create User model
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength:1
  }
});

// Set module.exports equal to an object
module.exports = {User};
