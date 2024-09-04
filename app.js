require('dotenv').config({ path: './.env' });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userSchema = require('./models/userSchema');

var indexRouter = require('./routes/index');
var expenseRouter = require('./routes/expense.routes');
var userRouter = require('./routes/user.routes');

const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

var app = express();
// database
require('./config/db');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use(flash());

app.use('/', indexRouter);
app.use('/expense', expenseRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // flash msg
  res.locals.successMessages = req.flash('Success');
  res.locals.errorMessages = req.flash('Error');

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
