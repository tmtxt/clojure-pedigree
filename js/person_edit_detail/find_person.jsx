// Dynamic select list for find person
var React = require("react");
var jquery = require("jquery");

// Global Flux
var global = require("./global.js");
var FindPersonStore = global.stores.findPerson;

var PersonSelect = React.createClass({
  getInitialState: function() {
    if(FindPersonStore.isEnable) {
      return {
        personList: FindPersonStore.getPersonList()
      };
    } else {
      return {
        personList: []
      };
    }
  },

  render: function() {
    var personList = this.state.personList.map(function(person){
      return (
        <option key={person.id} value={person.id}>{person.full_name}</option>
      );
    });

    return (
      <select className="js-find-person-select" id="" name="">
        {personList}
      </select>
    );
  }
});
module.exports = PersonSelect;
