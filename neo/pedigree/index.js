var express = require('express');
var router = express.Router();

var add = require('./add.js');
var find = require('./find.js');

router.use('/addChildForParent', add.validateAdd);
router.post('/addChildForParent', add.addChildForParentHandler);
router.get('/findParents', find.findParentsHandler);

module.exports = router;
