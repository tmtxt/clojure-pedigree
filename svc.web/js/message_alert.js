// Libs
var jquery = require('jquery');

//
var typeMap = {
  "info": "warning",
  "success": "success",
  "warning": "danger",
  "danger": "danger",
  "error": "danger"
};
var messageType = window.messageType || "info";
var messageClass = typeMap[messageType];
messageClass = "alert-" + messageClass;

// Elements
var alert = jquery('.js-message-alert');
alert.addClass(messageClass);

window.setTimeout(function(){
  alert.alert('close');
}, 5000);
