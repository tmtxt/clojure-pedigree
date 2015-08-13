var _ = require('lodash');
var fs = require('fs');
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
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var prefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var babelify = require("babelify");

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
var cached = {};
function createBundler(mode) {
  var bundler = transform(function(filename){
    var b;
    if(mode === "dev") {
      b = browserify(filename, _.extend(browserifyConfig, {debug: true}));
    } else if(mode === 'prod') {
      b = browserify(filename, browserifyConfig);
    } else if(mode === 'watch') {
      if(cached[filename]) return cached[filename].bundle();
      b = watchify(browserify(filename, _.extend(browserifyConfig, watchify.args, {debug: true})));
      cached[filename] = b;
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

    return b.bundle();
  });

  return bundler;
}

// bundle
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

gulp.task('js-watch', function(){
  return bundle('./js/*.js', createBundler("watch"), 'watch');
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

// sass
gulp.task('sass-dev', ['bower'], function(){
  return gulp.src('./sass/main.scss')
    .pipe(plumber({errorHandler: error}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./resources/public/css'));
});

gulp.task('sass-prod', ['bower'], function(){
  return gulp.src('./sass/main.scss')
    .pipe(plumber({errorHandler: error}))
    .pipe(sass())
    .pipe(prefixer())
    .pipe(minify())
    .pipe(gulp.dest('./resources/public/css'));
});

gulp.task('sass-watch', function(){
  gulp.watch('./sass/**/*.scss', ['sass-dev']);
});

gulp.task('symlink', ['bower'], function(){
  var source = path.normalize(process.cwd() + '/./resources/public/bower');
  var dest = path.normalize('./sass/bower');

  // check if the destination is already exist
  var stat;
  try{
    stat = fs.lstatSync(dest);
    // exist, remove it
    fs.unlinkSync(dest);
  } catch(e){
    // Not exist, just don't care
  }
  fs.symlinkSync(source, dest);
});

// combine
gulp.task('dev', ['bower', 'js-dev', 'sass-dev', 'symlink']);
gulp.task('prod', ['bower', 'js-prod', 'sass-prod', 'symlink']);
gulp.task('watch', ['js-watch', 'sass-watch']);
