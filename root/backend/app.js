var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Added by me (packages):
const cors = require("cors"); 
const mongoose = require('mongoose');
require('dotenv').config(); 
require('dotenv').config({ path: '.env.local' }); // adds variables in .env.local file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Added by me (routes):
const google = require('./routes/google'); // stores all related to google requests

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Added by me (middleware):
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Added by me (routes):
app.use('/google', google); 

// Added by me (development and production environment):
if (process.env.NODE_ENV === 'development') {
    var corsOptions = {
      origin: 'http://localhost:3000', // the frontend url
      optionsSuccessStatus: 200
    };
      app.use(cors(corsOptions));
} else if (process.env.NODE_ENV === 'production') {
    var corsOptions = {
      origin: 'https://my-website.com',
      optionsSuccessStatus: 200
    };
      app.use(cors(corsOptions));
}

// Added by me (MongoDB setup):
const mongoDB = process.env.MONGODB_URI;
//console.log('uri: ', process.env.MONGODB_URI);
mongoose.connect(mongoDB)
        .then(() => console.log("MongoDB is connected!"))
        .catch((error) => console.log(`Connection error: ${error}`)); // connection error
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error.")); // runtime error (after successfull connection)

module.exports = app;
