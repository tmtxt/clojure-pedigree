var global = require("./global.js");
var PictureStore = global.stores.picture;
var PictureAction = global.actions.picture;

// Main view
var Col1View = React.createClass({
  getInitialState: function() {
    return {imageLink: PictureStore.getPictureLink()};
  },

  componentDidMount: function() {
    PictureStore.bindChanged(this.pictureChanged);
  },

  componentWillUnmount: function() {
    PictureStore.unbindChanged(this.pictureChanged);
  },

  pictureChanged: function() {
    this.setState({
      imageLink: PictureStore.getPictureLink()
    });
  },

  handleSelectImage: function(e) {
    e.preventDefault();
    PictureAction.selectPicture();
  },

  handleDeleteImage: function(e) {
    e.preventDefault();
    PictureAction.removePicture();
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
