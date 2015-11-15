// Libs
var React = require("react");

// Global Flux
var global = require("./global.js");
var FormStore = global.stores.form;

// Views components
var HeaderView = require("./header_view.jsx");
var Col1View = require("./col_1_view.jsx");
var Col2View = require("./col_2_view.jsx");
var Col3View = require("./col_3_view.jsx");

// Main View class
var MainView = React.createClass({
  getInitialState: function() {
    return {
      actionLink: FormStore.getActionLink(),
      fromPerson: FormStore.getFromPerson()
    };
  },

  renderCol3View: function() {
    if (FormStore.onEditPage()) {
      return null;
    } else {
      return <Col3View />;
    }
  },

  render: function() {
    var col3View = this.renderCol3View();

    return (
      <div>
        <form action={this.state.actionLink} method="post" encType="multipart/form-data">
          <input name="fromPerson" type="hidden" value={this.state.fromPerson}/>

          <HeaderView />

          <div className="editperson-body">
            <Col1View />
            <Col2View statuses={this.props.statuses}
                      genders={this.props.genders} />
            {col3View}
          </div>
        </form>
      </div>
    );
  }
});
module.exports = MainView;
