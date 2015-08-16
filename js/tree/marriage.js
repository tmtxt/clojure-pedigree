// Libs
var jquery = require('jquery');
var _ = require('_');
var d3 = require('d3');

// Components
var marriageCheckbox = jquery('.js-toggle-marriage');

// Init this module
function init(page) {
  marriageCheckbox.change(function(){
    if(marriageCheckbox.is(':checked')) {
      console.log('checked');
    } else {
      console.log('no checked');
    }
  });
}
exports.init = init;

function appendMarriages(page, nodeEnter) {
  var config = page.config;
  var enableMarriage = config.getEnableMarriage();

  if(enableMarriage) {
    _.each(nodeEnter[0], function(node){
      if(!!node) {
        var order = 0;
        _.each(node.__data__.marriage, function(marriage){
          d3.select(node).append("svg:image")
            .attr("xlink:href", '/assets/img/r.jpg')
            .attr("class", "marriage-image")
            .attr("x", ((45 * order) + 25))
            .attr("y", -68)
            .attr("height", "40px")
            .attr("width", "40px")
            .datum(marriage)
            .on('click', function(d){
              // Util.showInfoModal(d.id);
            });
          order = order + 1;
        });
      }
    });
  }
}
exports.appendMarriages = appendMarriages;
