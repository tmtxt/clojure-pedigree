// Libs
var jquery = require('jquery');

// Var
var redirectLink = window.redirectLink;

//
if (!!redirectLink) {
  if (redirectLink !== '/') {
    window.setTimeout(function(){
      window.location = redirectLink;
    }, 5000);
  }
}
