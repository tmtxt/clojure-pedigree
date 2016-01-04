var express = require('express');
var router = express.Router();

var add = require('./add.js');

router.use('/addChildForParent', add.validateAdd);
router.post('/addChildForParent', add.addChildForParentHandler);

module.exports = router;
