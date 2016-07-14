'use strict';

const React = require('react');
const {Component} = React;
const d3 = require('d3');
const Dimensions = require('react-dimensions');
const { TransitionMotion, spring } = require('react-motion');
const _ = require('lodash');


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

    /* render nodes and links */
    const nodes = this.renderNodes(treeLayout, nodesList);
    const links = this.renderLinks(treeLayout, nodesList);

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


  renderLinks(treeLayout, nodesList) {
    const diagonal = d3.svg.diagonal().projection((d) => [d.x, d.y]);
    const linksList = treeLayout.links(nodesList);
    const linksConfig = linksList.map(link => ({
      key: `${link.source.id}-${link.target.id}`,
      style: {
        sourceX: link.source.x,
        sourceY: link.source.y,
        targetX: spring(link.target.x),
        targetY: spring(link.target.y)
      },
      data: link
    }));
    const links = (
      <TransitionMotion
          willEnter={this.linkWillEnter.bind(this)}
          willLeave={this.linkWillLeave.bind(this)}
          styles={linksConfig}>
        {
          linksConfig => {
            return (
              <g transform="translate(0,0)">
                {
                  linksConfig.map(
                    config => {
                      return (
                        <path key={config.key} className="link"
                              d={diagonal({source: {x: config.style.sourceX, y: config.style.sourceY},
                                           target: {x: config.style.targetX, y: config.style.targetY}})} />
                      );
                    }
                  )
                }
              </g>
            );
          }
        }
      </TransitionMotion>
    );

    return links;
  }


  linkWillEnter(link) {
    return {
      sourceX: link.data.source.x,
      sourceY: link.data.source.y,
      targetX: link.data.source.x,
      targetY: link.data.source.y
    };
  }


  linkWillLeave(link) {
    return {
      sourceX: link.data.source.x,
      sourceY: link.data.source.y,
      targetX: spring(link.data.source.x),
      targetY: spring(link.data.source.y)
    };
  }


  renderNodes(treeLayout, nodesList) {
    const nodesConfig = nodesList.map(node => ({
      key: node.info.id,
      style: {x: spring(node.x), y: spring(node.y)},
      data: node
    }));
    const nodes = (
      <TransitionMotion
          willEnter={this.nodeWillEnter.bind(this)}
          willLeave={this.nodeWillLeave.bind(this)}
          styles={nodesConfig}>
        {
          nodesConfig => {
            return (
              <g transform="translate(0,0)">
                {
                  nodesConfig.map(
                    config => {
                      return (
                        <g key={config.key} className="node"
                           transform={`translate(${config.style.x}, ${config.style.y})`}>
                          <circle onClick={this.handleCircleClick.bind(this, config.data)}
                                  r="10" style={{'fill': config.data._children ? 'lightsteelblue' : '#fff'}} />
                          <text y="-19" dy=".35em" textAnchor="middle"
                                style={{'fillOpacity': 1}}>{config.data.info.fullName}</text>
                          <image href={config.data.info.picture} x="-20" y="-68"
                                 width="40px" height="40px"></image>
                        </g>
                      );
                    }
                  )
                }
              </g>
            );
          }
        }
      </TransitionMotion>
    );

    return nodes;
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


  nodeWillEnter() {
    const { containerWidth } = this.props;
    return {
      x: containerWidth / 2,
      y: 0
    };
  }


  nodeWillLeave() {
    const { containerWidth } = this.props;
    return {
      x: spring(containerWidth / 2),
      y: spring(0)
    };
  }

}


/* higher order component to set container width and height props */
module.exports = Dimensions()(TreeView);
