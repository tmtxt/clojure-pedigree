// Libs
var React = require("react");

// Application Data
var global;
var stores;
var config;
var PersonStore;

// View class
var Col1View = React.createClass({
  getInitialState: function() {
    return {
      imageLink: PersonStore.getPerson().picture
    };
  },

  componentDidMount: function() {
    PersonStore.bind("change", this.pictureChanged);
  },

  componentWillUnmount: function() {
    PersonStore.unbind("change", this.pictureChanged);
  },

  pictureChanged: function() {
    this.setState({
      imageLink: PersonStore.getPerson().picture
    });
  },

  handleSelectImage: function(e) {
    e.preventDefault();
    // PictureAction.selectPicture();
  },

  handleDeleteImage: function(e) {
    e.preventDefault();
    // PictureAction.removePicture();
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

module.exports = function(gbl) {
  // Init application data
  global = gbl;
  stores = global.stores;
  config = global.config;
  PersonStore = stores.PersonStore;

  return Col1View;
};
