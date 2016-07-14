'use strict';

const React = require('react');
const { Component } = React;
const { TransitionMotion, spring } = require('react-motion');
const d3 = require('d3');
const _ = require('lodash');


module.exports = class LinksGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldLinksList: null
    };
  }


  render() {
    const { linksList } = this.props;
    const diagonal = d3.svg.diagonal().projection((d) => [d.x, d.y]);
    const linksConfig = linksList.map(link => ({
      key: `${link.source.id}-${link.target.id}`,
      style: {
        sourceX: spring(link.source.x),
        sourceY: spring(link.source.y),
        targetX: spring(link.target.x),
        targetY: spring(link.target.y)
      },
      data: link
    }));
    const defaultLinksConfig = linksList.map(link => ({
      key: `${link.source.id}-${link.target.id}`,
      style: {
        sourceX: link.source.x,
        sourceY: link.source.y,
        targetX: link.source.x,
        targetY: link.source.y
      },
      data: link
    }));

    const links = (
      <TransitionMotion
          willEnter={this.linkWillEnter.bind(this)}
          willLeave={this.linkWillLeave.bind(this)}
          defaultStyles={defaultLinksConfig}
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


  componentWillReceiveProps() {
    const oldLinksList = this.props.linksList;
    this.setState({oldLinksList});
  }


  linkWillEnter(link) {
    const linksList = this.state.oldLinksList || this.props.linksList;
    const { x, y } = this.findSource(link.data.source, linksList);

    return {
      sourceX: x,
      sourceY: y,
      targetX: x,
      targetY: y
    };
  }


  linkWillLeave(link) {
    const { x, y } = this.findSource(link.data.source, this.props.linksList);
    return {
      sourceX: spring(x),
      sourceY: spring(y),
      targetX: spring(x),
      targetY: spring(y)
    };
  }


  findSource(node, linksList) {
    let source = _.find(linksList, item => item.target.id == node.id);
    if (source) {
      return source.target;
    }
    if (!node.parent) {
      return node;
    }
    return this.findSource(node.parent, linksList);
  }
};
