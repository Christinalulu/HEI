const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const memesRouter = require('./routes/memes');
const loginRouter = require('./routes/login'); // This should be the correct path

const app = express();
const fs = require('fs');

var passport = require('passport');
var session = require('express-session');
var JsonStore = require('express-session-json')(session);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/bootstrap-icons'));

// Session middleware setup
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new JsonStore()
}));




app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));



// Routes
app.use('/', indexRouter);
app.use('/memes', memesRouter);
app.use('/login', loginRouter);


// Error handling
app.use(function(req, res, next) {
  next(createError(404));
});




app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
