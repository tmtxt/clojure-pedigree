// Libs
var jquery = require('jquery');
var _ = require('lodash');

// Elements
var linksList = jquery('.js-admin-sidebar a.list-group-item');

// Update active
_.each(linksList, function(link){
  link = jquery(link);
  if (link.attr('href') === window.location.pathname) {
    link.addClass('active');
  }
});
