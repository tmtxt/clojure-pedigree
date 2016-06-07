'use strict';

const React = require('react');

module.exports = React.createClass({
  render: function() {
    const tree = this.props.tree;
    const father = tree.get('father');
    const mother = tree.get('mother');
    const parentRole = tree.get('parentRole');

    console.log(parentRole);

    return (
      <div>
        <div className="parent-title">
          Parents
        </div>
        <div className="parent-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </div>
        <div className="parent-body">
          <ul>
            <li>
              <input name="fatherId" type="hidden" value={father.id} />
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={father.picture} />
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Father: </span>
                  <span>{father.fullName}</span>
                </div>
                <div className={parentRole != 'father' ? "" : "hidden"}>
                  <a href="#" onClick={this.handleSelectFather}>Select</a>&nbsp;
                  <a href="#" onClick={this.handleRemoveFather}>Remove</a>
                </div>
              </div>
            </li>
            <li>
              <input name="motherId" type="hidden" value={mother.id}/>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mother: </span>
                  <span>{mother.fullName}</span>
                </div>
                <div className={parentRole != 'mother' ? "" : "hidden"}>
                  <a href="#" onClick={this.handleSelectMother}>Select</a>&nbsp;
                  <a href="#" onClick={this.handleRemoveMother}>Remove</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
