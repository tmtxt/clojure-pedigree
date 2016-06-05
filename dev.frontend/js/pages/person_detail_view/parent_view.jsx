'use strict';

const _ = require('lodash');
const React = require('react');

module.exports = React.createClass({
  render: function() {
    var hasParents = false;
    var hasFather = false;
    var hasMother = false;
    if (this.props.parents) {
      if (this.props.parents.father || this.props.parents.mother) {
        hasParents = true;
        if (this.props.parents.father) {
          hasFather = true;
        }
        if (this.props.parents.mother) {
          hasMother = true;
        }
      }
    }

    return (
      <div className="persondetail-parents">
        <div className="parent-title">
          Cha mẹ
        </div>
        {this.props.parents ?
         <div className="parent-help">
           {(() => {
              if (!hasParents) {
                return "Chưa có thông tin về cha mẹ của thành viên này";
              } else {
                if (!hasFather) {
                  return "Chưa có thông tin về cha của thành viên này";
                }
                if (!hasMother) {
                  return "Chưa có thông tin về mẹ của thành viên này";
                }
              }
            })()}
         </div> :
         <i className="fa fa-spinner fa-spin fa-4x fa-fw"></i>}

         {this.props.parents ?
          <div className="parent-body">
            <ul>
              {hasFather ?
               <li>
                 <div className="parent-image people-image">
                   <a href={'/person/detail/' + this.props.parents.father.id}>
                     <img className="img-responsive img-rounded" alt="" src={this.props.parents.father.picture} />
                   </a>
                 </div>
                 <div className="parent-info people-info">
                   <div className="parent-name people-name">
                     <span>Cha: </span>
                     <span>{this.props.parents.father.fullName}</span>
                   </div>
                   <div>
                     <a href={'/person/detail/' + this.props.parents.father.id}>Xem thông tin</a>
                   </div>
                 </div>
               </li> :
               ""}

               {hasMother ?
                <li>
                  <div className="parent-image people-image">
                    <a href={'/person/detail/' + this.props.parents.mother.id}>
                      <img className="img-responsive img-rounded" alt="" src={this.props.parents.mother.picture} />
                    </a>
                  </div>
                  <div className="parent-info people-info">
                    <div className="parent-name people-name">
                      <span>Mẹ: </span>
                      <span>{this.props.parents.father.fullName}</span>
                    </div>
                    <div>
                      <a href={'/person/detail/' + this.props.parents.mother.id}>Xem thông tin</a>
                    </div>
                  </div>
                </li> :
                ""}
            </ul>
          </div> : ""}
      </div>
    );
  }
});
