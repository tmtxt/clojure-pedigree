var express = require('express');
var router = express.Router();

var find = require('./find.js');
var add = require('./add.js');
var util = require('./util.js');

router.use('/findPerson', util.requirePersonId);
router.use('/findParents', util.requirePersonId);
router.use('/findPartners', util.requirePersonId);

router.get('/findRoot', find.findRootHandler);
router.get('/findPerson', find.findPersonHandler);
router.get('/findPartners', find.findPartnersHandler);
router.get('/findParents', find.findParentsHandler);

router.post('/addOrUpdate', add.addOrUpdateHandler);

module.exports = router;
