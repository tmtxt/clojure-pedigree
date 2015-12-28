(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./tree_export/main.js');

},{"./tree_export/main.js":3}],2:[function(require,module,exports){
(function (global){
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var q = (typeof window !== "undefined" ? window['Q'] : typeof global !== "undefined" ? global['Q'] : null);

// Get tree data
// Returns a promise
function getTreeData(page) {
  var config = page.config;
  var rootId = config.getPersonId();
  var treeDepth = config.getTreeDepth();
  var url = "/tree/data";

  return q.Promise(function(resolve, reject){
    jquery.ajax({
      type: 'GET',
      data: {
        personId: rootId,
        depth: treeDepth
      },
      url: url,
      success: function(data) {
        page.root = data;
        resolve(data);
      }
    });
  });
}
exports.getTreeData = getTreeData;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var Request = require('tree/request.js');

var config = {};
config.getPersonId = function() {
  return 1;
};
config.getTreeDepth = function() {
  return 5;
};

var page = {};
page.config = config;

var exportButton = jquery('.js-export-tree');
exportButton.click(function(){
  Request.getTreeData(page).then(function(data){
    console.log(data);
  });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"tree/request.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL2V4cG9ydF90cmVlLmpzIiwiL1ZvbHVtZXMvdG10eHQvUHJvamVjdHMvY2xvanVyZS1wZWRpZ3JlZS9qcy90cmVlL3JlcXVlc3QuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3RyZWVfZXhwb3J0L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7OztBQ0FqQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVyQixnQkFBZ0I7QUFDaEIsb0JBQW9CO0FBQ3BCLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtFQUN6QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0VBQ3pCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztFQUNsQyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDeEMsRUFBRSxJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUM7O0VBRXZCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLENBQUM7SUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQztNQUNWLElBQUksRUFBRSxLQUFLO01BQ1gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLE1BQU07UUFDaEIsS0FBSyxFQUFFLFNBQVM7T0FDakI7TUFDRCxHQUFHLEVBQUUsR0FBRztNQUNSLE9BQU8sRUFBRSxTQUFTLElBQUksRUFBRTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDZjtLQUNGLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKO0FBQ0QsT0FBTyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Ozs7OztBQzFCbEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUV6QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXO0VBQzlCLE9BQU8sQ0FBQyxDQUFDO0NBQ1YsQ0FBQztBQUNGLE1BQU0sQ0FBQyxZQUFZLEdBQUcsV0FBVztFQUMvQixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQzs7QUFFRixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDN0MsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVO0VBQzNCLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDbkIsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vdHJlZV9leHBvcnQvbWFpbi5qcycpO1xuIiwidmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbi8vIEdldCB0cmVlIGRhdGFcbi8vIFJldHVybnMgYSBwcm9taXNlXG5mdW5jdGlvbiBnZXRUcmVlRGF0YShwYWdlKSB7XG4gIHZhciBjb25maWcgPSBwYWdlLmNvbmZpZztcbiAgdmFyIHJvb3RJZCA9IGNvbmZpZy5nZXRQZXJzb25JZCgpO1xuICB2YXIgdHJlZURlcHRoID0gY29uZmlnLmdldFRyZWVEZXB0aCgpO1xuICB2YXIgdXJsID0gXCIvdHJlZS9kYXRhXCI7XG5cbiAgcmV0dXJuIHEuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIGpxdWVyeS5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YToge1xuICAgICAgICBwZXJzb25JZDogcm9vdElkLFxuICAgICAgICBkZXB0aDogdHJlZURlcHRoXG4gICAgICB9LFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHBhZ2Uucm9vdCA9IGRhdGE7XG4gICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuZXhwb3J0cy5nZXRUcmVlRGF0YSA9IGdldFRyZWVEYXRhO1xuIiwidmFyIGpxdWVyeSA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIFJlcXVlc3QgPSByZXF1aXJlKCd0cmVlL3JlcXVlc3QuanMnKTtcblxudmFyIGNvbmZpZyA9IHt9O1xuY29uZmlnLmdldFBlcnNvbklkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxO1xufTtcbmNvbmZpZy5nZXRUcmVlRGVwdGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDU7XG59O1xuXG52YXIgcGFnZSA9IHt9O1xucGFnZS5jb25maWcgPSBjb25maWc7XG5cbnZhciBleHBvcnRCdXR0b24gPSBqcXVlcnkoJy5qcy1leHBvcnQtdHJlZScpO1xuZXhwb3J0QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCl7XG4gIFJlcXVlc3QuZ2V0VHJlZURhdGEocGFnZSkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgfSk7XG59KTtcbiJdfQ==
