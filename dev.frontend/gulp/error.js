var notifier = require('node-notifier');
var util = require('gulp-util');

function error(err) {
  notifier.notify({message: 'Error: ' + err.message});
  util.log(util.colors.red('Error: ' + err.message));
}
exports.error = error;

function browserifyError(err) {
  error(err);
  this.end();
}
exports.browserifyError = browserifyError;
