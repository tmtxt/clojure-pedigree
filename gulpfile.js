var _ = require('lodash');
var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var shimify = require('browserify-shim');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var notifier = require('node-notifier');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var prefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
// var deasync = require('deasync');
var rev = require('git-rev');
var reactify = require('reactify');
var through2 = require('through2');

require('./gulp/bower.js');
require('./gulp/browserify.js');
require('./gulp/sass.js');

//////////////////////////////////////////////////////////////////////
// update version
gulp.task('update-version', function(){
  var revExec = deasync(rev.long);
  var hash;
  try {
    hash = revExec();
  } catch(err) {
    hash = err;                   // still don't know why hash come into error :LOL:
  }

  var fileContent = "";
  fileContent +=  ";;; GENERATED BY GULP, DO NOT EDIT\n";
  fileContent += "(ns app.views.version)\n";
  fileContent += "(def version \"" + hash + "\")\n";

  var configFile = 'src/app/views/version.clj';
  fs.writeFileSync(configFile, fileContent);
});

// combine
gulp.task('dev', ['bower', 'js-dev','symlink']);
gulp.task('prod', ['bower', 'js-prod', 'symlink']);
gulp.task('watch', ['js-watch']);
