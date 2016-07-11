'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');


class TreeView extends Component {

  render() {
    const { tree, containerWidth, containerHeight } = this.props;
    const root = tree.select('pedigreeTree').serialize();
    const treeLayout = d3.layout.tree().size([containerWidth, containerHeight]);
    const nodesList = treeLayout.nodes(root).reverse();
    nodesList.forEach((d) => {
      d.y = d.depth * 200;
      d.y += 80;
    });

    const nodes = nodesList.map((d) => {
      return (
        <g key={d.info.id} className="node">
          </circle>
        </g>
      );
    });

    return (
      <div className="tree-container">
        <svg height="1000" width={containerWidth}>
          <g>
            {nodes}
          </g>
        </svg>
      </div>
    );
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
