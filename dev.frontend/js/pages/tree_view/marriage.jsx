'use strict';

const React = require('react');
const { Component } = React;
const { TransitionMotion, spring } = require('react-motion');
const _ = require('lodash');


module.exports = class Marriage extends Component {

  render() {
    const { person, order } = this.props;

    return <image x="-20" y="-68" width="40px" height="40px"
              transform={`translate(${45 * order + 45}, 0)`}
              className="marriage-image" href={person.picture} />
  }

};
