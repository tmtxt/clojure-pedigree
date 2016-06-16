'use strict';

const React = require('react');
const {Component} = React;
const _ = require('lodash');

const Col1View = require('PersonViews/col1_view.jsx');
const Col2View = require('PersonViews/col2_view.jsx');
const Col3View = require('PersonViews/col3_view.jsx');


module.exports = class MainView extends Component {

  /**
   * Get the form destination url based on the fromRole
   * @return {string}
   */
  getFormAction() {
    const fromRole = this.props.fromRole;
    return '/person/editProcess';
  }


  /**
   * Handle cancel add button
   */
  handleCancel() {
    history.back();
  }


  render() {
    const action = this.getFormAction();

    return (
      <div className="page-editperson">
        <form method="post" encType="multipart/form-data" action={action}>
          <div className="editperson-header">
            <div className="editperson-title">
              Chỉnh sửa thông tin thành viên
            </div>
            <div className="editperson-buttons">
              <button className="btn btn-success">Submit</button>
              <button className="btn btn-danger" onClick={this.handleCancel.bind(this)}>Cancel</button>
            </div>
          </div>

          { this.props.initializing ?
            <div className="editperson-body">
              <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
            </div>
            :
            <div className="editperson-body">
              <Col1View tree={this.context.tree} person={this.props.person} />
              <Col2View tree={this.context.tree} person={this.props.person} />
            </div>
          }
        </form>
      </div>
    );
  }
};
