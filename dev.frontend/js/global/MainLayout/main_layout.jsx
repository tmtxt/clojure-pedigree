'use strict';

const React = require('react');

const components = require('Components');
const Header = components.Header;
const Footer = components.Footer;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Header />

        <main className="site-content">
          <div className="container site-container">
            {this.props.children}
          </div>
        </main>

        <Footer />
      </div>
    );
  }
});
