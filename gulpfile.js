var _ = require('lodash');
var gulp = require('gulp');
var bower = require('bower');
var browserify = require('browserify');
var watchify = require('watchify');
var transform = require('vinyl-transform');
var shimify = require('browserify-shim');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var notifier = require('node-notifier');
var util = require('gulp-util');
var gulpif = require('gulp-if');

// bower
gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
});

// browserify config
var browserifyConfig = {
  basedir: '.',
  paths: './js'
};

// create browserify transform
function createBundler(mode) {
  var bundler = transform(function(filename){
    var b;
    if(mode === "dev") {
      b = browserify(filename, _.extend(browserifyConfig, {debug: true}));
    } else if(mode === 'prod') {
      b = browserify(filename, browserifyConfig);
    } else if(mode === 'watch') {
      b = watchify(browserify(filename, _.extend(browserifyConfig, watchify.args, {debug: true})));
    }

    // event
    b.on('error', browserifyError);
    if(mode === 'watch') {
      b.on('time', function(time){util.log(util.colors.green('Browserify'), filename + time + ' ms');});
    }

    // transform
    b.transform(shimify);

    return b.bundle();
  });

  return bundler;
}

function bundle(source, bundler, mode) {
  return gulp.src(source)
    .pipe(plumber({errorHandler: browserifyError}))
    .pipe(bundler)
    .pipe(gulpif(mode === "prod", uglify({mangle: false})))
    .pipe(gulp.dest('./resources/public/js'));
}

// browserify task
gulp.task('js-dev', function(){
  return bundle('./js/*.js', createBundler("dev"), "dev");
});

gulp.task('js-prod', function(){
  return bundle('./js/*.js', createBundler("prod"), "prod");
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
