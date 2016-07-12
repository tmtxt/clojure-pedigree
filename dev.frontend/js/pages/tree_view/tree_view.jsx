'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');
const { Motion, spring } = require('react-motion');
const _ = require('lodash');


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
        <g key={d.info.id} className="node" transform={`translate(${d.x}, ${d.y})`}>
          <circle onClick={this.handleCircleClick.bind(this, d)} r="10" style={{'fill': d._children ? 'lightsteelblue' : '#fff'}} />
          <text y="-19" dy=".35em" textAnchor="middle" style={{'fillOpacity': 1}}>{d.info.fullName}</text>
          <image href={d.info.picture} x="-20" y="-68" width="40px" height="40px"></image>
        </g>
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


  handleCircleClick(d) {
    /* has no children, do nothing */
    if (!d.children && !d._children) {
      return;
    }

    const { tree } = this.props;
    const path = this.findPathInTree(d);
    const cursor = tree.select(path);
    const data = cursor.get();

    if (data.children) {
      cursor.set('_children', cursor.select('children').get());
      cursor.unset('children');
    } else {
      cursor.set('children', cursor.select('_children').get());
      cursor.unset('_children');
    }
  }

  findPathInTree(d) {
    let path;

    /* root node */
    if (d.path.length == 1) {
      path = ['pedigreeTree'];
      return path;
    }

    /* create the path to query in the baobab tree */
    path = _.tail(d.path);
    path = _.reduce(path, (result, id) => {
      result.push((d) => d.id == id);
      return result;
    }, []);
    path = _.zip(_.fill(Array(path.length), 'children'), path);
    path = _.flatten(path);
    path = _.compact(path);
    path.unshift('pedigreeTree');

    return path;
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
