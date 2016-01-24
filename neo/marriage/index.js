var express = require('express');
var router = express.Router();

var add = require('./add.js');
var find = require('./find.js');

router.post('/addMarriage', add.addMarriageHandler);
router.get('/findPartners', find.findPartnersHandler);

module.exports = router;
