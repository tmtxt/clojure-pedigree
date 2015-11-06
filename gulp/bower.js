var gulp = require('gulp');
var bower = require('bower');
var path = require('path');
var fs = require('fs');

gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb();
    });
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
