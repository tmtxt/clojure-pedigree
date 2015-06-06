var _ = require('lodash');
var gulp = require('gulp');
var bower = require('bower');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var shimify = require('browserify-shim');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var notifier = require('node-notifier');
var util = require('gulp-util');

// bower
gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
});

// browserify
var browserifyConfig = {
  basedir: '.',
  paths: './js'
};

function createBundler(mode) {
  var bundler = transform(function(filename){
    var b;
    if(mode === "dev") {
      b = browserify(filename, _.extend(browserifyConfig, {debug: true}));
    } else if(mode === 'prod') {
      b = browserify(filename, browserifyConfig);
    }

    // event
    b.on('error', browserifyError);
    // b.on('time', function(time){util.log(util.colors.green('Browserify'), filename + time + ' ms');});

    // transform
    b.transform(shimify);

    return b.bundle();
  });

  return bundler;
}

gulp.task('js-dev', function(){
  return gulp.src('./js/*.js')
    .pipe(plumber({errorHandler: browserifyError}))
    .pipe(createBundler("dev"))
    .pipe(gulp.dest('./resources/public/js'));
});

gulp.task('js-prod', function(){
  return gulp.src('./js/*.js')
    .pipe(plumber({errorHandler: browserifyError}))
    .pipe(createBundler("prod"))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./resources/public/js'));
});

// error handler
function error(err) {
  notifier.notify({message: 'Error: ' + err.message});
  util.log(util.colors.red('Error: ' + err.message));
}

function browserifyError(err) {
  error(err);
  this.end();
}
