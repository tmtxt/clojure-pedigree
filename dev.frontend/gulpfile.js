'use strict';

const gulp = require('gulp');

require('./gulp/bower.js');
require('./gulp/browserify.js');
require('./gulp/sass.js');

// combine
gulp.task('setup', ['bower', 'copy']);
gulp.task('dev', ['js-dev', 'sass-dev']);
gulp.task('prod', ['js-prod', 'sass-dev']);
gulp.task('watch', ['js-watch', 'sass-watch']);
