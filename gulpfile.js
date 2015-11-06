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

////////////////////////////////////////////////////////////////////////////////
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
      b.plugin(watchify);
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

////////////////////////////////////////////////////////////////////////////////
// sass
function sassDev() {
  return gulp.src('./sass/main.scss')
    .pipe(plumber({errorHandler: error}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./resources/public/css'));
}

function sassProd() {
  return gulp.src('./sass/main.scss')
    .pipe(plumber({errorHandler: error}))
    .pipe(sass())
    .pipe(prefixer())
    .pipe(minify())
    .pipe(gulp.dest('./resources/public/css'));
}

gulp.task('sass-dev', ['bower'], function(){
  return sassDev();
});

gulp.task('sass-prod', ['bower'], function(){
  return sassProd();
});

gulp.task('sass-dev-watch', function(){
  return sassDev();
});

gulp.task('sass-watch', function(){
  gulp.watch('./sass/**/*.scss', ['sass-dev-watch']);
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

// error handler
function error(err) {
  notifier.notify({message: 'Error: ' + err.message});
  util.log(util.colors.red('Error: ' + err.message));
}

function browserifyError(err) {
  error(err);
  this.end();
}
