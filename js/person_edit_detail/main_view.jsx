// Libs
var React = require("react");

// Views components
var HeaderView = require("./header_view.jsx");
var ImageView = require("./image_view.jsx");
var ProfileView = require("./profile_view.jsx");

// Main View class
var MainView = React.createClass({
  render: function() {
    return (
      <div>
        <HeaderView />

        <div className="editperson-body">
          <ImageView />

          <ProfileView />
        </div>
      </div>
    );
  }
});
module.exports = MainView;
