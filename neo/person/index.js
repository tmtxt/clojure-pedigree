var express = require('express');
var router = express.Router();

router.post('/get', function(req, res, next) {
  res.send('hello');
});

module.exports = router;
