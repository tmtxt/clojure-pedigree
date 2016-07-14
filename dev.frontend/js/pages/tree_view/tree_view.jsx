'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');

const NodesGroup = require('./nodes_group.jsx');
const LinksGroup = require('./links_group.jsx');


class TreeView extends Component {

  render() {
    /* get the pedigree tree data from baobab tree */
    const { tree, containerWidth, containerHeight } = this.props;
    const root = tree.select('pedigreeTree').serialize();

    /* use d3.js to calculate the tree layout and position of nodes, links */
    const treeLayout = d3.layout.tree().size([containerWidth, containerHeight]);
    const nodesList = treeLayout.nodes(root).reverse();
    /* translate all the nodes 80px down (for the header) with 200px height for each link */
    nodesList.forEach((d) => {
      d.y = d.depth * 200;
      d.y += 80;
    });
    const linksList = treeLayout.links(nodesList);

    return (
      <div className="tree-container">
        <svg height="1000" width={containerWidth}>
          <g>
            <LinksGroup linksList={linksList} />
            <NodesGroup nodesList={nodesList} containerWidth={containerWidth} tree={tree} />
          </g>
        </svg>
      </div>
    );
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
