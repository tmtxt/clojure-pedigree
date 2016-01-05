var gulp = require('gulp');

// tasks
require('./gulp/bower.js');
require('./gulp/browserify.js');
require('./gulp/sass.js');

// combine
gulp.task('dev', ['bower', 'js-dev', 'sass-dev']);
gulp.task('prod', ['bower', 'js-prod', 'sass-dev']);
gulp.task('watch', ['js-watch', 'sass-watch']);
