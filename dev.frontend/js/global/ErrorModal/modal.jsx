'use strict';

const React = require('react');
const {Component} = React;

module.exports = class ErrorModal extends Component {
  render() {
    const opts = this.props.opts;
    const title = opts.title || 'Có lỗi xảy ra';
    const message = opts.message || 'Có lỗi xảy ra';

    return (
      <div className="modal fade" tabindex="-1" role="dialog">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
