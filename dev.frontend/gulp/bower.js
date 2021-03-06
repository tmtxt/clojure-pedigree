var gulp = require('gulp');
var bower = require('bower');

gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(){
      cb();
    });
});

gulp.task('copy', ['bower'], function(){
  return gulp.src('./bower/**/*')
    .pipe(gulp.dest('/dist/frontend/bower'));
});
