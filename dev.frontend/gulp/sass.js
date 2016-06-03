// modules
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');

// error handler
var error = require('./error.js').error;

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

gulp.task('sass-dev', function(){
  return sassDev();
});

gulp.task('sass-prod', function(){
  return sassProd();
});

gulp.task('sass-watch', function(){
  gulp.watch('./sass/**/*.scss', ['sass-dev']);
});
