// modules
const _ = require('lodash');
const gulp = require('gulp');
const through2 = require('through2');
const browserify = require('browserify');
const watchify = require('watchify');
const util = require('gulp-util');
const shimify = require('browserify-shim');
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const path = require('path');
const rename = require('gulp-rename');
const babelify = require('babelify');
const vinyl = require('vinyl-source-stream');

// error handler
const browserifyError = require('./error.js').browserifyError;

// browserify config
const browserifyConfig = {
  basedir: '.',
  paths: './js/global'
};

// create browserify transform
const cached = {};
function createBundler(mode) {
  const bundler = through2.obj(function(file, env, next){
    const bundleFunc = function(err, res){
      if (err) {
        console.log(err);
        file.contents = null;
      } else {
        file.contents = res;
      }
      next(null, file);
    };
    const filename = file.path;

    var b;
    if(mode === 'dev') {
      b = browserify(filename, _.assign(browserifyConfig, {debug: true}));
    } else if(mode === 'prod') {
      b = browserify(filename, browserifyConfig);
    } else if(mode === 'watch') {
      if(cached[file.path]) {
        cached[file.path].bundle(bundleFunc);
        return;
      }
      b = browserify(filename, _.assign(browserifyConfig, {cache: {}, packageCache: {}, debug: true}));
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
    b.transform(babelify);
    b.transform(shimify);

    // external
    b.external('baobab');
    b.external('baobab-react');
    b.external('react');
    b.external('react-dom');
    b.external('regenerator-runtime');
    b.external('react-motion');
    b.external('react-dimensions');
    b.external('react-bootstrap');

    // bundle
    b.bundle(bundleFunc);
  });

  return bundler;
}

// bundle
function bundle(source, bundler, mode) {
  return gulp.src(source)
    .pipe(plumber({errorHandler: browserifyError}))
    .pipe(bundler)
    .pipe(gulpif(mode === 'prod', uglify({mangle: false})))
  // rename to the right format
    .pipe(rename(function(p){
      if (p.dirname == '.') {
        p.basename = path.basename(path.dirname(source));
      } else {
        p.basename = p.dirname;
        p.dirname = '.';
      }
    }))
    .pipe(gulp.dest('/dist/frontend/js/'));
}

// browserify task
gulp.task('js-dev', function(){
  return bundle('./js/pages/*/index.js', createBundler('dev'), 'dev');
});

gulp.task('js-prod', function(){
  return bundle('./js/pages/*/index.js', createBundler('prod'), 'prod');
});

gulp.task('js-watch', function(){
  return bundle('./js/pages/*/index.js', createBundler('watch'), 'watch');
});

gulp.task('js-require', function(){
  const b = browserify();
  b.require('baobab', {expose: 'baobab'});
  b.require('baobab-react', {expose: 'baobab-react'});
  b.require('react', {expose: 'react'});
  b.require('react-dom', {expose: 'react-dom'});
  b.require('regenerator-runtime', {expose: 'regenerator-runtime'});
  b.require('react-motion', {expose: 'react-motion'});
  b.require('react-dimensions', {expose: 'react-dimensions'});
  b.require('react-bootstrap', {expose: 'react-bootstrap'});

  return b.bundle()
    .pipe(vinyl('requires.js'))
    .pipe(gulp.dest('/dist/frontend/js'));
});
