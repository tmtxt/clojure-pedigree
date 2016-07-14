'use strict';

const React = require('react');
const { Component } = React;
const { TransitionMotion, spring } = require('react-motion');
const d3 = require('d3');


module.exports = class LinksGroup extends Component {

  render() {
    const { linksList } = this.props;
    const diagonal = d3.svg.diagonal().projection((d) => [d.x, d.y]);
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
};
