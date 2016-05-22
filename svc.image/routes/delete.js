'use strict';

const router = require('koa-router')();
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const thunkify = require('thunkify');

const config = require('../config');
const imageDir = config.imageDir;

const types = ['person'];

function* validateMdw(next) {
  const logTrace = this.logTrace;
  const type = _.get(this, ['request', 'body', 'type']);
  const name = _.get(this, ['request', 'body', 'name']);

  if (_.isNil(type) || !_.includes(types, type)) {
    let message = 'Invalid image type';
    logTrace.add('error', 'Image type validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  if (_.isNil(name)) {
    let message = 'Image name is requried';
    logTrace.add('error', 'Image name validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}


// Koa handler function
function* deleteHandler() {
  const logTrace = this.logTrace;
  const type = this.request.body.type;
  let name = this.request.body.name;

  if (!name) {
    logTrace.add('info', 'deleteHandler()', 'Image name empty, skip!');
    this.body = {
      success: true,
      data: true
    };
    return;
  }

  if (_.startsWith(name, '/assets/img/')) {
    logTrace.add('info', 'deleteHandler()', 'Sample image, skip!');
    this.body = {
      success: true,
      data: true
    };
    return;
  }

  name = path.basename(name);
  const imagePath = `${imageDir}/${type}/original/${name}`;
  logTrace.add('info', 'deleteHandler()', `Image path ${imagePath}`);

  const stat = thunkify(fs.stat);
  try {
    yield stat(imagePath);
  } catch (err) {
    logTrace.add('info', 'deleteHandler()', 'File not exist, skip!');
    this.body = {
      success: true,
      data: true
    };
    return;
  }

  const unlink = thunkify(fs.unlink);
  yield unlink(imagePath);
  logTrace.add('info', `${type} image ${name} deleted`);

  this.body = {
    success: true,
    data: true
  };
}

router.post('/', validateMdw, deleteHandler);

module.exports = router;
