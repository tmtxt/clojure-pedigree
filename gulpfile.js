var gulp = require('gulp');

// tasks
require('./gulp/bower.js');
require('./gulp/browserify.js');
require('./gulp/sass.js');
require('./gulp/version.js');

// combine
gulp.task('dev', ['bower', 'js-dev', 'sass-dev', 'update-version']);
gulp.task('prod', ['bower', 'js-prod', 'sass-dev', 'update-version']);
gulp.task('watch', ['js-watch', 'sass-watch']);
