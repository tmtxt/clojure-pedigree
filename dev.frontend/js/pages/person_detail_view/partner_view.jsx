'use strict';

const _ = require('lodash');
const React = require('react');

module.exports = React.createClass({
  render: function() {
    const partners = this.props.partners;
    const hasPartners = (partners && partners.length) ? true : false;

    return (
      <div className="persondetail-parents">
        <div className="parent-title">
          Vợ chồng
        </div>
        {partners ?
         <div className="parent-help">
           {hasPartners ?
            "Chưa có thông tin về hôn nhân của thành viên này" :
            `Người này có ${partners.length} vợ/chồng`}
         </div> :
         <i className="fa fa-spinner fa-spin fa-4x fa-fw"></i>}

         {partners ?
          <div className="parent-body">
            <ul>
              {partners.map(function(partner){
                 return (
                   <li key={partner.id}>
                     <div className="parent-image people-image">
                       <a href={"/person/detail/" + partner.id}>
                         <img className="img-responsive img-rounded" alt="" src={partner.picture}/>
                       </a>
                     </div>
                     <div className="parent-info people-info">
                       <div className="parent-name people-name">
                         <span>{partner.fullName}</span>
                       </div>
                       <div>
                         <a href={"/person/detail/" + partner.id}>Xem thông tin</a>
                       </div>
                     </div>
                   </li>
                 );
               })}
            </ul>
          </div> :
         ""}
      </div>
    );
  }
});
