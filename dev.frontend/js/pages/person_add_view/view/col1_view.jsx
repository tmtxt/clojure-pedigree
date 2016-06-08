'use strict';

const $ = require('jquery');
const React = require('react');
const {Component} = React;

const personUtil = require('person_util.js');


module.exports = class Col1View extends Component {

  /**
   * Handle select picture button click
   */
  handleSelectPicture() {
    const pictureInput = $(this.pictureInput);
    pictureInput.trigger('click');
  }


  /**
   * Handle delete picture button click
   */
  handleDeletePicture() {
    const tree = this.props.tree;
    tree.set(['person', 'picture'], personUtil.getDefaultPictureLink());
  }


  /**
   * Handle picture input change
   */
  handleInputChange() {
    const tree = this.props.tree;
    const pictureInput = this.pictureInput;
    const file = pictureInput.files[0];

    if (file) {
      if (window.URL.createObjectURL) {
        const imageLink = window.URL.createObjectURL(file);
        tree.set(['person', 'picture'], imageLink);
      }
    }
  }


  render() {
    return (
      <div className="editperson-col-1">
        <div className="col-1-img">
          <img className="img-responsive img-thumbnail" alt="" src={this.props.person.picture}/>
          <input ref={(ref) => this.pictureInput = ref}
                 onChange={this.handleInputChange.bind(this)}
              name="picture" type="file" accept="image/*" className="hidden"/>
        </div>
        <div className="col-1-buttons">
          <a onClick={this.handleSelectPicture.bind(this)}
              className="btn btn-success">Select</a>
          <a onClick={this.handleDeletePicture.bind(this)}
              className="btn btn-danger">Delete</a>
        </div>
      </div>
    );
  }
};
