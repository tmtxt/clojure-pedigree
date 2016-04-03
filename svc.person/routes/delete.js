'use strict';

const router = require('koa-router')();
const util = require('./util.js');

function* deleteHandler() {

}

router.post('/', util.requireIdMdw, deleteHandler);

module.exports = router;
