var React = require("react");
var jquery = require("jquery");
var q = require("q");

var defaultLink = "/assets/img/userbasic.jpg";

// open file input selection for user to select an image
// Returns a promise, resolve with the image link if selected
// reject otherwise
function selectFile() {
  return q.Promise(function(resolve, reject){
    // find the picture input
    var pictureInput = jquery(".js-picture-input");
    // remove all event listeners
    pictureInput.unbind();
    // new event handler
    pictureInput.change(function(){
      var file = pictureInput[0].files[0]
      if(!!file) {
        if(!!window.URL.createObjectURL) {
          var imageLink = window.URL.createObjectURL(file);
          resolve(imageLink);
        } else {
          reject();
        }
      } else {
        // not select
        reject();
      }
    });
    // trigger selection
    pictureInput.trigger("click");
  });
}

var Col1View = React.createClass({
  getInitialState: function() {
    return {imageLink: defaultLink};
  },

  handleSelectImage: function(e) {
    var This = this;
    e.preventDefault();
    selectFile().then(function(url){
      This.setState({imageLink: url});
    });
  },

  handleDeleteImage: function(e) {
    this.setState({imageLink: defaultLink});
  },

  render: function() {
    return (
      <div className="editperson-col-1">
        <div className="col-1-img">
          <img className="img-responsive img-thumbnail" alt="" src={this.state.imageLink}/>
          <input ref="pictureInput" name="picture"
                 type="file" accept="image/*" className="hidden js-picture-input"/>
        </div>
        <div className="col-1-buttons">
          <button onClick={this.handleSelectImage}
                  className="btn btn-success">Select</button>
          <button onClick={this.handleDeleteImage} className="btn btn-danger">Delete</button>
        </div>
      </div>
    );
  }
});
module.exports = Col1View;
