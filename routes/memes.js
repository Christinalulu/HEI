var express = require('express');
var router = express.Router();
const axios = require('axios');
const config = require('../config/config.json');

let cachedMemes = [];
let lastFetchTimestamp = null;

router.get('/', function (req, res, next) {
  const currentTime = new Date().getTime();

  // Check if cached data is available and not stale (e.g., less than 1 hour old)
  if (cachedMemes.length > 0 && lastFetchTimestamp && currentTime - lastFetchTimestamp < 3600000) {
    // Pass isLoggedIn status here
    res.render('memes', { memes: cachedMemes, isLoggedIn: req.session.isLoggedIn });
  } else {
    axios.get(config.memeApiUrl)
      .then(response => {
        cachedMemes = response.data.memes;
        lastFetchTimestamp = currentTime;
        // Pass isLoggedIn status here too
        res.render('memes', { memes: cachedMemes, isLoggedIn: req.session.isLoggedIn });
      })
      .catch(error => {
        console.error('Error fetching memes:', error);
        res.status(500).send('Error fetching memes');
      });
  }
});

module.exports = router;
