var express = require('express');
var router = express.Router();

var get = require('./get.js');

router.get('/get', get.getTreeHandler);

module.exports = router;
