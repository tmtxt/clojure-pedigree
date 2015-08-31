var React = require("react");
var jquery = require("jquery");
var defaultLink = "/assets/img/userbasic.jpg";

var Col1View = React.createClass({
  getInitialState: function() {
    return {imageLink: defaultLink};
  },

  handleSelectImage: function(e) {
    e.preventDefault();
    var pictureInput = jquery(".js-picture-input");
    pictureInput.trigger("click");
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
          <button className="btn btn-danger">Delete</button>
        </div>
      </div>
    );
  }
});
module.exports = Col1View;
