// Libs
var React = require("react");
var jquery = require("jquery");

// Modal object
var PersonModal = React.createClass({
  render: function() {
    return (
      <div className="modal fade person-info-modal js-person-info-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">
                {this.props["full-name"]}
              </h4>
            </div>
            <div className="modal-body">
              <div className="person-info-left">
                <img className="img-responsive" alt="" src={this.props.picture}/>
              </div>
              <div className="person-info-right">
                <div className="person-info-row">
                  <div className="person-info-field">
                    Họ tên
                  </div>
                  <div className="person-info-value">
                    {this.props.fullName}
                  </div>
                </div>
                <div className="person-info-row">
                  <div className="person-info-field">
                    Ngày Sinh
                  </div>
                  <div className="person-info-value">
                    {this.props["birth-date"]}
                  </div>
                </div>
                <div className="person-info-row">
                  <div className="person-info-field">
                    Tình trạng
                  </div>
                  <div className="person-info-value">
                    {this.props["alive-status"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a href={"/person/detail/" + this.props.id} className="btn btn-success">View Detail</a>
              <a href={"/person/add/childId/" + this.props.id} className="btn btn-primary">Add Parent</a>
              <a href={"/person/add/partnerId/" + this.props.id} className="btn btn-primary">Add Partner</a>
              <a href={"/person/add/parentId/" + this.props.id} className="btn btn-primary">Add child</a>
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

// Render function
function showPersonInfo(info) {
  // unmount first
  React.unmountComponentAtNode(
    document.getElementById("js-user-modal-container")
  );

  // render dom
  React.render(
    React.createElement(PersonModal, info),
    document.getElementById("js-user-modal-container")
  );

  // show modal
  jquery(".js-person-info-modal").modal();
}
exports.showPersonInfo = showPersonInfo;
