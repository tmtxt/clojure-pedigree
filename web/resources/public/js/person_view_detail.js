(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// Libs
var jquery = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var markdown = (typeof window !== "undefined" ? window['markdown'] : typeof global !== "undefined" ? global['markdown'] : null);

// Elements
var personHistoryContainer = jquery('.js-persondetail-history');

// Convert markdown to html
var personHistory = window.personHistory;
var personHtml = markdown.toHTML(personHistory);
personHistoryContainer.html(personHtml);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy90bXR4dC9Qcm9qZWN0cy9jbG9qdXJlLXBlZGlncmVlL2pzL3BlcnNvbl92aWV3X2RldGFpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxPQUFPO0FBQ1AsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFbkMsV0FBVztBQUNYLElBQUksc0JBQXNCLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRWhFLDJCQUEyQjtBQUMzQixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBQ3pDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEQsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIExpYnNcbnZhciBqcXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBtYXJrZG93biA9IHJlcXVpcmUoJ21hcmtkb3duJyk7XG5cbi8vIEVsZW1lbnRzXG52YXIgcGVyc29uSGlzdG9yeUNvbnRhaW5lciA9IGpxdWVyeSgnLmpzLXBlcnNvbmRldGFpbC1oaXN0b3J5Jyk7XG5cbi8vIENvbnZlcnQgbWFya2Rvd24gdG8gaHRtbFxudmFyIHBlcnNvbkhpc3RvcnkgPSB3aW5kb3cucGVyc29uSGlzdG9yeTtcbnZhciBwZXJzb25IdG1sID0gbWFya2Rvd24udG9IVE1MKHBlcnNvbkhpc3RvcnkpO1xucGVyc29uSGlzdG9yeUNvbnRhaW5lci5odG1sKHBlcnNvbkh0bWwpO1xuIl19
