'use strict';

const React = require('react');
const { Component } = React;
const _ = require('lodash');
const { Modal, Button } = require('react-bootstrap');
const PropTypes = require('baobab-react/prop-types');


class DetailModal extends Component {
  render() {
    const { tree } = this.context;
    const show = tree.get('showDetail');
    const person = tree.get('selectedPerson');
    const user = tree.get('user') || {};

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>
            { person && person.info.fullName }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { person &&
            <div className="row">
              <div className="col-md-4">
                <img className="img-responsive" src={person.info.picture} />
              </div>
              <div className="col-md-8">
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="person-info-label">
                        Họ tên
                      </td>
                      <td>
                        {person.info.fullName}
                      </td>
                    </tr>
                    <tr>
                      <td className="person-info-label">
                        Ngày Sinh
                      </td>
                      <td>
                        {person.info.birthDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          { person && <a href={`/person/detail/${person.id}`} className="btn btn-success">Chi tiết</a> }
          { person && <a href={`/tree/view/person/${person.id}`} className="btn btn-success">Xem cây gia phả</a> }
          { person && user.authenticated &&
            <a href={`/person/edit/${person.id}`} className="btn btn-primary">Chỉnh sửa</a> }
            <Button bsStyle="danger" onClick={this.handleClose.bind(this)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    );
  }


  handleClose() {
    const { tree } = this.context;
    tree.set('showDetail', false);
  }
}


DetailModal.contextTypes = {
  tree: PropTypes.baobab
};

module.exports = DetailModal;
