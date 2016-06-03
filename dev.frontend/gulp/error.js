var util = require('gulp-util');

function error(err) {
  util.log(util.colors.red('Error: ' + err.message));
}
exports.error = error;

function browserifyError(err) {
  error(err);
  this.end();
}
exports.browserifyError = browserifyError;
