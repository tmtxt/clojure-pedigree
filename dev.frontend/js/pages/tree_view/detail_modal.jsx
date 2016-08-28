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

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Hello</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.close.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }


  close() {
    const { tree } = this.context;
    tree.set('showDetail', false);
  }
}


DetailModal.contextTypes = {
  tree: PropTypes.baobab
};

module.exports = DetailModal;
