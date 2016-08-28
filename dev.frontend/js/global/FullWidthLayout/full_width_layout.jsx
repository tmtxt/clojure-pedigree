'use strict';

const React = require('react');

const components = require('Components');
const Header = components.Header;
const Footer = components.Footer;

module.exports = React.createClass({
  render: function() {
    return (
      <div className="site">
        <Header />

        <main className="site-content">
          {this.props.children}
        </main>

        <Footer />
      </div>
    );
  }
});
