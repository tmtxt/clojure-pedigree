var express = require('express');
var router = express.Router();

var find = require('./find.js');

router.post('/findRoot', find.findRootHandler);

module.exports = router;
