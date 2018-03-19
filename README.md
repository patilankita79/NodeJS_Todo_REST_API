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
  
 2. **Improving Mongoose models**
   - Adding validations, setting some properties as required, setting defaults values
   - For example, 
     we should not add a todo if the object doesn't have text or completed property (in the context of Todo application),because if we try to create an object without these properties then a document entry is still made in MongoDB with no entry for text and completed and **this should not happen**
     
     ```
     var todo = new Todo({ });
     ```
     <img src = "https://github.com/patilankita79/NodeJS_Todo_REST_API/blob/master/Screenshots/4_ImprovingMongooseModel_2.png">
     <img src = "https://github.com/patilankita79/NodeJS_Todo_REST_API/blob/master/Screenshots/3_ImprovingMongooseModel_2.jpg" >
     
   - Should provide smart default value to **Completed** property (Like nobody is going to create a todo if they have already completed it. Hence completed should be set to false by default)
   
  - <a href = "http://mongoosejs.com/docs/validation.html">Mongoose Validators</a>
  - <a href = "http://mongoosejs.com/docs/guide.html">Mongoose Schema</a>
   
   **Hence better todo mongoose model is**
   
   ```
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
   ```
   
 3. **Installing Postman** (Important tool to test REST API)
    
    - Installing a tool - Postman, to test HTTP requests 
    - https://www.getpostman.com/apps
    
 
 

