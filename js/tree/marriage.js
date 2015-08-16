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
      enableMarriage(page);
    } else {
      disableMarriage(page);
    }
  });
}
exports.init = init;

function createMarriageNode(node, data) {
  return d3.select(node).append("svg:image")
    .attr("xlink:href", data.picture)
    .attr("class", "marriage-image")
    .attr("x", -20)
    .attr("y", -68)
    .attr("height", "40px")
    .attr("width", "40px")
    .datum(data)
    .on('click', function(d){
      // Util.showInfoModal(d.id);
    });
}

function enableMarriage(page) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  config.setEnableMarriage(true);

  // get all visible nodes
  var nodes = d3.selectAll('g.node')[0];

  // loop
  nodes.forEach(function(node) {
    var order = 0;
    _.each(node.__data__.marriage, function(marriage) {
      var marriageNode = createMarriageNode(node, marriage);
      marriageNode
        .transition()
        .duration(duration)
        .attr('transform', 'translate (' + ((45 * order) + 45) + ',0)');
      order = order + 1;
    });
  });
}

function disableMarriage(page) {
  var config = page.config;
  var duration = config.getTransitionDuration();
  config.setEnableMarriage(false);

  // remove all marriage images
  d3.selectAll('image.marriage-image')
    .transition()
    .duration(duration)
    .attr("transform", "translate(0,0)")
    .remove();
}

function appendMarriages(page, nodeEnter) {
  var config = page.config;
  var enableMarriage = config.getEnableMarriage();

  if(enableMarriage) {
    _.each(nodeEnter[0], function(node){
      if(!!node) {
        var order = 0;
        _.each(node.__data__.marriage, function(marriage){
          var marriageNode = createMarriageNode(node, marriage);
          marriageNode
            .transition()
            .duration(0)
            .attr('transform', 'translate (' + ((45 * order) + 45) + ',0)');
          order = order + 1;
        });
      }
    });
  }
}
exports.appendMarriages = appendMarriages;
