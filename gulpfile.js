var _ = require('lodash');
var gulp = require('gulp');
var bower = require('bower');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var shimify = require('browserify-shim');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

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

    b.on('error', function(err){
      console.log(err.message);
      this.end();
    });
    b.on('time', function(time){
      console.log('browserify ' + filename + ' ' + time);
    });

    b.transform(shimify);
    return b.bundle();
  });

  return bundler;
}

gulp.task('js-dev', function(){
  return gulp.src('./js/*.js')
    .pipe(plumber())
    .pipe(createBundler("dev"))
    .pipe(gulp.dest('./resources/public/js'));
});

gulp.task('js-prod', function(){
  return gulp.src('./js/*.js')
    .pipe(plumber())
    .pipe(createBundler("prod"))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./resources/public/js'));
});
