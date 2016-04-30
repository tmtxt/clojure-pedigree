'use strict';

const router = require('koa-router')();

function detectParentRole(gender) {
  switch (gender) {
    case 'male':
      return 'father';
    case 'female':
      return 'mother';
    case 'gay':
      return 'mother';
    case 'les':
      return 'father';
    default:
      return 'father';
  }
}

// Koa handler function
function* parentRoleSingleHandler() {
  const person = this.request.body;
  const gender = person.gender;
  const role = detectParentRole(gender);
  this.body = {
    success: true,
    data: role
  };
}

router.get('/parentRole/single', parentRoleSingleHandler);

module.exports = router;
