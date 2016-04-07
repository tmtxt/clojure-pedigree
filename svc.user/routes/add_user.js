'use strict';

const router = require('koa-router')();

// Koa handler function
function* addHandler() {
  this.body = {
    success: true
  };
}

router.post('/add', addHandler);

module.exports = router;
