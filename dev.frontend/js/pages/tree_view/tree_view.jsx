'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');
const { Motion, spring } = require('react-motion');


class TreeView extends Component {

  render() {
    const { tree, containerWidth, containerHeight } = this.props;
    const root = tree.select('pedigreeTree').serialize();
    const treeLayout = d3.layout.tree().size([containerWidth, containerHeight]);
    const diagonal = d3.svg.diagonal().projection((d) => [d.x, d.y]);
    const rootPos = {x: containerWidth / 2, y: 0};

    const nodesList = treeLayout.nodes(root).reverse();
    nodesList.forEach((d) => {
      d.y = d.depth * 200;
      d.y += 80;
    });
    const nodes = nodesList.map((d) => {
      return (
        <Motion key={d.info.id} defaultStyle={rootPos} style={{x: spring(d.x), y: spring(d.y)}}>
          { value =>
            <g className="node" transform={`translate(${value.x}, ${value.y})`}>
              <circle r="10" />
              <text y="-19" dy=".35em" textAnchor="middle" style={{'fillOpacity': 1}}>{d.info.fullName}</text>
              <image href={d.info.picture} x="-20" y="-68" width="40px" height="40px"></image>
            </g>
          }
        </Motion>
      );
    });

    const linksList = treeLayout.links(nodesList);
    const links = linksList.map((d) => {
      return (
        <path key={`${d.source.id}-${d.target.id}`} className="link" d={diagonal(d)} />
      );
    });

    return (
      <div className="tree-container">
        <svg height="1000" width={containerWidth}>
          <g>
            {links}
            {nodes}
          </g>
        </svg>
      </div>
    );
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
