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
        <g key={d.info.id} className="node" transform={`translate(${d.x}, ${d.y})`}>
          <circle r="10" />
          <text y="-19" dy=".35em" textAnchor="middle" style={{'fillOpacity': 1}}>{d.info.fullName}</text>
          <image href={d.info.picture} x="-20" y="-68" width="40px" height="40px"></image>
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
