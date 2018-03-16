# NodeJS_Todo_REST_API
Learning to build NodeJS RESTful API using Mongoose ORM
<br>

## Mongoose ORM
- npm library which helps to structure the data
- http://mongoosejs.com/

**Setting up mongoose** <br>

```
npm install mongoose@4.5.9 --save
```

<hr>

## Approach

1. **Setting up mongoose in NodeJs application**

- All the server-side logic will reside inside Server folder in Server.js
- Server.js is the root of the application
- In Server.js, 
  - Establish connection to MongoDB database using mongoose ORM.
  - Create model for everything you want to store to the database
  
  ```
  // Creating a Todo Model using mongoose
  var Todo = mongoose.model('Todo', {
      text: {
        type: String
      },
      completed: {
        type: Boolean
      },
      completedAt: {
        type: Number
      }
  });
  ```
  - Hence, Todo model has properties => **text** of type String, **completed** of type Boolean, **completedAt** of type Number 
  - Create an instance of model
    ```
    var newTodo = new Todo({
      text: 'Pay internet bill'
    });
    ```
  - Save that instance to MongoDB database
    ```
    newTodo.save().then((doc) => {
        console.log('Saved todo', doc);
      }, (e) => {
        console.log('Unable to save Todo');
    });
    ```
 
     <img src = "https://github.com/patilankita79/NodeJS_Todo_REST_API/blob/master/Screenshots/1_SavingInstanceToDB_1.png">
     <img src = "https://github.com/patilankita79/NodeJS_Todo_REST_API/blob/master/Screenshots/2_SavingInstanceToDB_2.png" >
  
  
 

