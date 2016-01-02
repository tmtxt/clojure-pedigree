var express = require('express');
var router = express.Router();

var find = require('./find.js');

router.get('/findRoot', find.findRootHandler);
router.get('/findPerson', find.findPersonHandler);

module.exports = router;
