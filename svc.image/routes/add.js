'use strict';

const router = require('koa-router')();
const uuid = require('node-uuid');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const types = ['person'];

function* validateMdw(next) {
  const logTrace = this.logTrace;
  const type = _.get(this, ['request', 'body', 'type']);
  const image = _.get(this, ['req', 'files', 'image']);

  if (_.isNil(type) || !_.includes(types, type)) {
    let message = 'Invalid image type';
    logTrace.add('error', 'Image type validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  if (_.isNil(image) || _.isNil(image.path)) {
    let message = 'No image uploaded';
    logTrace.add('error', 'Image file validation', message);
    this.body = {
      success: false,
      message
    };
    return;
  }

  yield next;
}

function detectExt(tmpPath) {
  const ext = path.extname(tmpPath);

  if (_.trim(ext) === '') {
    return '.jpg';
  }

  return ext;
}

function copyFile(tmpPath, type, logTrace) {
  const promise = new Promise(function(resolve, reject){
    // calculate new name
    const newName = uuid.v4();
    const ext = detectExt(tmpPath);
    const imageDir = config.imageDir;
    const newPath = `${imageDir}/${type}/original/${newName}${ext}`;

    logTrace.add('info', 'Start copying file', `${tmpPath} => ${newPath}`);

    const readStream = fs.createReadStream(tmpPath);
    readStream.on('error', (err) => reject(err));
    const writeStream = fs.createWriteStream(newPath);
    writeStream.on('error', (err) => reject(err));
    writeStream.on('finish', () => resolve(newPath));
    readStream.pipe(writeStream);
  });

  return promise;
}

// Koa handler function
function* addHandler() {
  const logTrace = this.logTrace;
  const tmpPath = this.req.files.image.path;
  const type = this.request.body.type;

  try {
    const imagePath = yield copyFile(tmpPath, type, logTrace);

    logTrace.add('info', 'Add image file success');
    this.body = {
      success: true,
      data: {
        imagePath
      }
    };
  } catch (err) {
    logTrace.add('error', 'Add image file fail', err);
    this.body = {
      success: false,
      message: err
    };
  }
}

router.post('/', validateMdw, addHandler);

module.exports = router;
