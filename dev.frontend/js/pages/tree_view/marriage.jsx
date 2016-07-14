'use strict';

const React = require('react');
const { Component } = React;
const { TransitionMotion, spring } = require('react-motion');
const _ = require('lodash');


module.exports = class Marriage extends Component {

  render() {
    const { marriages } = this.props;

    const styles = marriages ? _.map(marriages, (marriage, order) => {
      return {
        key: marriage.id.toString(),
        style: { x: spring(45 * order + 45) },
        data: marriage
      };
    }) : [];
    const defaultStyles = marriages ? _.map(marriages, (marriage) => {
      return {
        key: marriage.id.toString(),
        style: { x: 0 },
        data: marriage
      };
    }) : [];

    return (
      <TransitionMotion willEnter={this.willEnter.bind(this)}
                        willLeave={this.willLeave.bind(this)}
                        defaultStyles={defaultStyles} styles={styles} >
        {
          styles => {
            return (
              <g transform="translate(0,0)">
                {
                  styles.map(
                    style => {
                      return <image key={style.key} x="-20" y="-68" width="40px" height="40px"
                                transform={`translate(${style.style.x}, 0)`}
                                className="marriage-image" href={style.data.picture} />;
                    }
                  )
                }
              </g>
            );
          }
        }
      </TransitionMotion>
    );
  }


  willEnter() {
    return {
      x: 0
    };
  }


  willLeave() {
    return {
      x: spring(0)
    };
  }

};
