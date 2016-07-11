'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');


class TreeView extends Component {

  render() {
    const { tree } = this.props;
    const root = tree.get('pedigreeTree');

    return (
      <div className="tree-container">
        <svg width="100%">
          <g transform="translate(0, 0)">

          </g>
        </svg>
      </div>
    );
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
