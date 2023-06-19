var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dotenv = require('dotenv');
const { route } = require('./routes/index');
dotenv.config({path:'./.env'});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
db.connect((error)=>{
  if(error){
    console.log(error)
  }else{
    console.log('MYSQL Connected...')
  }
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
