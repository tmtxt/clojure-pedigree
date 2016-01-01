// Libs
var jquery = require('jquery');
var markdown = require('markdown');

// Elements
var personHistoryContainer = jquery('.js-persondetail-history');

// Convert markdown to html
var personHistory = window.personHistory;
var personHtml = markdown.toHTML(personHistory);
personHistoryContainer.html(personHtml);
