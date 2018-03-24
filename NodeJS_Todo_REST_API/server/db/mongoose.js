// var mongoose = require('mongoose');
//
// // Set up the mongoose to use promises (By default mongoose supports callbacks)
// mongoose.Promise = global.Promise;
// // Connection URL
// const url = 'mongodb://localhost:27017/TodoApp';
//
// // Connect to the database
// mongoose.connect(url);
//
// // Set module.exports to an object
// module.exports = {mongoose};


var mongoose = require('mongoose');

//copy the link from "To connect using a driver via the standard MongoDB URI" section
//insert db user name and password here
const REMOTE_MONGO = 'mongodb://todo-admin:rootadmin@ds153752.mlab.com:53752/todos';
const LOCAL_MONGO = 'mongodb://localhost:27017/TodoApp';
const MONGO_URI = process.env.PORT ? REMOTE_MONGO : LOCAL_MONGO;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to Mongo instance.')
}, (err) => {
    console.log('Error connecting to Mongo instance: ', err);
});

module.export = { mongoose };
