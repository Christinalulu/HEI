var express = require('express');
var router = express.Router();
// const fs = require("fs");
// const path = require("path");

// First GET route for the home page
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user }); // Pass 'user' to the view
});



module.exports = router;
