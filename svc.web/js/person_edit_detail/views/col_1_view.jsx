// Libs
var React = require("react");

// Application Data
var global;
var config;
var PersonStore;
var PictureAction;

// View class
var Col1View = React.createClass({
  getInitialState: function() {
    return {
      imageLink: PersonStore.getPerson().picture,
      replacePicture: PersonStore.getPerson()['replace-picture']
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
      imageLink: PersonStore.getPerson().picture,
      replacePicture: PersonStore.getPerson()['replace-picture']
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
          <input name="replace-picture" type="hidden" value={this.state.replacePicture}/>
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
  config = global.config;
  PersonStore = global.stores.PersonStore;
  PictureAction = global.actions.PictureAction;

  return Col1View;
};
