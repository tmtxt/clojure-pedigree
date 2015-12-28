(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./add_child/main.js');

},{"./add_child/main.js":3}],2:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

// Components
var confirmModal = jquery('.js-confirm-modal');
var confirmButton = jquery('.js-confirm-continue');

// Unregister events
function unregisterEvents() {
  confirmModal.unbind();
  confirmButton.unbind();
}

// Prompt for user to confirm
// Returns a promise
// resolve when confirm
// reject when cancel
function confirm() {
  return q.Promise(function(resolve, reject){
    unregisterEvents();

    confirmModal.on('hidden.bs.modal', function(){
      reject();
    });

    confirmButton.click(function(){
      unregisterEvents();
      confirmModal.modal('hide');
      resolve();
    });

    confirmModal.modal('show');
  });
}
exports.confirm = confirm;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

// Modules
var Confirm = require('./confirm.js');

// Components
var submitButton = jquery('.js-submit-button');
var addChildForm = jquery('.js-add-child-form');
var childNameInput = jquery('.js-child-name-input');

//
submitButton.click(function(e){
  e.preventDefault();

  var childName = jquery.trim(childNameInput.val());
  if(childName === '') {
    Confirm.confirm().then(function(){
      addChildForm.trigger('submit');
    });
  } else {
    addChildForm.trigger('submit');
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./confirm.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL2FkZF9jaGlsZC5qcyIsIi9Wb2x1bWVzL3RtdHh0L1Byb2plY3RzL2Nsb2p1cmUtcGVkaWdyZWUvanMvYWRkX2NoaWxkL2NvbmZpcm0uanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL2FkZF9jaGlsZC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Ozs7QUNBL0IsT0FBTztBQUNQLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXJCLGFBQWE7QUFDYixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMvQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFbkQsb0JBQW9CO0FBQ3BCLFNBQVMsZ0JBQWdCLEdBQUc7RUFDMUIsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ3RCLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN6QixDQUFDOztBQUVELDZCQUE2QjtBQUM3QixvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCLHFCQUFxQjtBQUNyQixTQUFTLE9BQU8sR0FBRztFQUNqQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxDQUFDO0FBQzVDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQzs7SUFFbkIsWUFBWSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVO01BQzNDLE1BQU0sRUFBRSxDQUFDO0FBQ2YsS0FBSyxDQUFDLENBQUM7O0lBRUgsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVO01BQzVCLGdCQUFnQixFQUFFLENBQUM7TUFDbkIsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUMzQixPQUFPLEVBQUUsQ0FBQztBQUNoQixLQUFLLENBQUMsQ0FBQzs7SUFFSCxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzVCLENBQUMsQ0FBQztDQUNKO0FBQ0QsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7OztBQ25DMUIsT0FBTztBQUNQLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXJCLFVBQVU7QUFDVixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXRDLGFBQWE7QUFDYixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMvQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNoRCxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFcEQsRUFBRTtBQUNGLFlBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7O0VBRW5CLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7RUFDbEQsR0FBRyxTQUFTLEtBQUssRUFBRSxFQUFFO0lBQ25CLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtNQUMvQixZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztHQUNKLE1BQU07SUFDTCxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ2hDO0NBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vYWRkX2NoaWxkL21haW4uanMnKTtcbiIsIi8vIExpYnNcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBxID0gcmVxdWlyZSgncScpO1xuXG4vLyBDb21wb25lbnRzXG52YXIgY29uZmlybU1vZGFsID0ganF1ZXJ5KCcuanMtY29uZmlybS1tb2RhbCcpO1xudmFyIGNvbmZpcm1CdXR0b24gPSBqcXVlcnkoJy5qcy1jb25maXJtLWNvbnRpbnVlJyk7XG5cbi8vIFVucmVnaXN0ZXIgZXZlbnRzXG5mdW5jdGlvbiB1bnJlZ2lzdGVyRXZlbnRzKCkge1xuICBjb25maXJtTW9kYWwudW5iaW5kKCk7XG4gIGNvbmZpcm1CdXR0b24udW5iaW5kKCk7XG59XG5cbi8vIFByb21wdCBmb3IgdXNlciB0byBjb25maXJtXG4vLyBSZXR1cm5zIGEgcHJvbWlzZVxuLy8gcmVzb2x2ZSB3aGVuIGNvbmZpcm1cbi8vIHJlamVjdCB3aGVuIGNhbmNlbFxuZnVuY3Rpb24gY29uZmlybSgpIHtcbiAgcmV0dXJuIHEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHVucmVnaXN0ZXJFdmVudHMoKTtcblxuICAgIGNvbmZpcm1Nb2RhbC5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdCgpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybUJ1dHRvbi5jbGljayhmdW5jdGlvbigpe1xuICAgICAgdW5yZWdpc3RlckV2ZW50cygpO1xuICAgICAgY29uZmlybU1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG5cbiAgICBjb25maXJtTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgfSk7XG59XG5leHBvcnRzLmNvbmZpcm0gPSBjb25maXJtO1xuIiwiLy8gTGlic1xudmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbi8vIE1vZHVsZXNcbnZhciBDb25maXJtID0gcmVxdWlyZSgnLi9jb25maXJtLmpzJyk7XG5cbi8vIENvbXBvbmVudHNcbnZhciBzdWJtaXRCdXR0b24gPSBqcXVlcnkoJy5qcy1zdWJtaXQtYnV0dG9uJyk7XG52YXIgYWRkQ2hpbGRGb3JtID0ganF1ZXJ5KCcuanMtYWRkLWNoaWxkLWZvcm0nKTtcbnZhciBjaGlsZE5hbWVJbnB1dCA9IGpxdWVyeSgnLmpzLWNoaWxkLW5hbWUtaW5wdXQnKTtcblxuLy9cbnN1Ym1pdEJ1dHRvbi5jbGljayhmdW5jdGlvbihlKXtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIHZhciBjaGlsZE5hbWUgPSBqcXVlcnkudHJpbShjaGlsZE5hbWVJbnB1dC52YWwoKSk7XG4gIGlmKGNoaWxkTmFtZSA9PT0gJycpIHtcbiAgICBDb25maXJtLmNvbmZpcm0oKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICBhZGRDaGlsZEZvcm0udHJpZ2dlcignc3VibWl0Jyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYWRkQ2hpbGRGb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICB9XG59KTtcbiJdfQ==
