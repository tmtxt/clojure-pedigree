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
    return `/person/add/from/${fromRole}`;
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
          <input name="fromPersonId" type="hidden" value={_.get(this, ['props', 'fromPerson', 'id'], '')}/>

          <div className="editperson-header">
            <div className="editperson-title">
              Thêm thành viên mới
            </div>
            <div className="editperson-buttons">
              <button className="btn btn-success">Submit</button>
              <button className="btn btn-danger" onClick={this.handleCancel.bind(this)}>Cancel</button>
            </div>
          </div>

          <div className="editperson-body">
            <Col1View tree={this.context.tree} person={this.props.person} />
            <Col2View tree={this.context.tree} person={this.props.person} />
            <Col3View tree={this.context.tree} />
          </div>
        </form>
      </div>
    );
  }
};
