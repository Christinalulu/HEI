var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
var passport = require('passport');
var LocalStrategy = require('passport-local');

// Passport serialization and deserialization
passport.serializeUser(function(user, done) {
  process.nextTick(function() {
    done(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
});

// Passport local strategy for login
passport.use(new LocalStrategy(function verify(username, password, done) {
  console.log('Authenticating:', username); // Debugging log
  let usersArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/users.json")));
  let customedArray = usersArray.filter(x => x.Username === username);
  if (customedArray.length > 0) {
    let usersData = customedArray[0];
    if (usersData.Password === password) {
      return done(null, usersData);
    }
  } else {
    return done(null, false);
  }
}));


// Routes for login and logout
router.post('/password', passport.authenticate('local', {
  successRedirect: '/memes',
  failureRedirect: '/login'
}));



router.get('/', function(req, res, next) {
  if(!req.user) {
    res.render('login', {user: null});
  }
  else {
    res.render('login', {user: req.user});
  }
});



router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


module.exports = router;


