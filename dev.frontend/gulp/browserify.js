// modules
var _ = require('lodash');
var gulp = require('gulp');
var through2 = require('through2');
var browserify = require('browserify');
var watchify = require('watchify');
var util = require('gulp-util');
var reactify = require('reactify');
var shimify = require('browserify-shim');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var path = require('path');
const rename = require('gulp-rename');

// error handler
var browserifyError = require('./error.js').browserifyError;

// browserify config
var browserifyConfig = {
  basedir: '.',
  paths: './js'
};

// create browserify transform
var cached = {};
function createBundler(mode) {
  var bundler = through2.obj(function(file, env, next){
    var bundleFunc = function(err, res){
      file.contents = res;
      next(null, file);
    };
    var filename = file.path;

    var b;
    if(mode === "dev") {
      b = browserify(filename, _.extend(browserifyConfig, {debug: true}));
    } else if(mode === 'prod') {
      b = browserify(filename, browserifyConfig);
    } else if(mode === 'watch') {
      if(cached[file.path]) {
        cached[file.path].bundle(bundleFunc);
        return;
      }
      b = browserify(filename, _.extend(browserifyConfig, {cache: {}, packageCache: {}, debug: true}));
      b.plugin(watchify, {
        poll: true
      });
      cached[file.path] = b;
    }

    // event
    b.on('error', browserifyError);
    if(mode === 'watch') {
      b.on('time', function(time){util.log(util.colors.green('Browserify'), filename, util.colors.blue('in ' + time + ' ms'));});
      b.on('update', function(){
        bundle(filename, createBundler('watch'), 'watch');
      });
    }

    // transform
    // b.transform(babelify);
    b.transform(reactify);
    b.transform(shimify);

    b.bundle(bundleFunc);
  });

  return bundler;
}

// bundle
function bundle(source, bundler, mode) {
  return gulp.src(source)
    .pipe(plumber({errorHandler: browserifyError}))
    .pipe(bundler)
    .pipe(gulpif(mode === "prod", uglify({mangle: false})))
    .pipe(rename(function(p){
      if (p.dirname == '.') {
        p.basename = path.basename(path.dirname(source));
      } else {
        p.basename = p.dirname;
        p.dirname = '.';
      }
    }))
    .pipe(gulp.dest('/data/js/'));
}

// browserify task
gulp.task('js-dev', function(){
  return bundle('./js/pages/*/index.js', createBundler("dev"), "dev");
});

gulp.task('js-prod', function(){
  return bundle('./js/pages/*/index.js', createBundler("prod"), "prod");
});

gulp.task('js-watch', function(){
  return bundle('./js/pages/*/index.js', createBundler("watch"), 'watch');
});
