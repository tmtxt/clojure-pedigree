'use strict';

const React = require('react');
const {Component} = React;

module.exports = class ChildView extends Component {
  render() {
    const tree = this.props.tree;
    const child = tree.get('child');

    return (
      <div className="family-container">
        <input name="childId" type="hidden" value={child.id}/>
        <div className="family-title">
          Child
        </div>
        <div className="family-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </div>
        <div className="family-body">
          <div className="family-list">
            <ul className="partner-list">
              <li>
                <div className="partner-image people-image">
                  <img className="img-responsive img-rounded" alt="" src={child.picture}/>
                </div>
                <div className="partner-info people-info">
                  <div className="partner-name people-name">
                    {child.fullName}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
