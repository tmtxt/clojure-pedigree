var express = require('express');
var router = express.Router();

var add = require('./add.js');

router.post('/addMarriage', add.addMarriageHandler);

module.exports = router;
