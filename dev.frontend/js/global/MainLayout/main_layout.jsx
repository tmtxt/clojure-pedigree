'use strict';

const React = require('react');
const baobabReact = require('baobab-react/higher-order');

const components = require('Components');
const Header = components.Header;
const Footer = components.Footer;

module.exports = React.createClass({
  render: function() {
    const BranchedHeader = baobabReact.branch({
      user: ['user']
    }, Header);
    const BranchedFooter = baobabReact.branch({
      user: ['user']
    }, Footer);

    return (
      <div>
        <BranchedHeader />

        <main className="site-content">
          <div className="container site-container">
            {this.props.children}
          </div>
        </main>

        <BranchedFooter />
      </div>
    );
  }
});
