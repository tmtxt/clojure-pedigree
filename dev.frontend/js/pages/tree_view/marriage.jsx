'use strict';

const React = require('react');
const { Component } = React;
const { TransitionMotion, spring } = require('react-motion');
const _ = require('lodash');


module.exports = class Marriage extends Component {

  render() {
    const { person, order, pos } = this.props;

    const styles = [{
      key: person.id.toString(),
      style: { x: spring(45 * order + 45) },
      data: person
    }];
    const defaultStyles = [{
      key: person.id.toString(),
      style: { x: 0 },
      data: person
    }];

    return (
      <TransitionMotion defaultStyles={defaultStyles} styles={styles} >
        {
          styles => <image x="-20" y="-68" width="40px" height="40px"
                           transform={`translate(${styles[0].style.x}, 0)`}
                           className="marriage-image" href={person.picture} />
        }
      </TransitionMotion>
    );
  }

};
