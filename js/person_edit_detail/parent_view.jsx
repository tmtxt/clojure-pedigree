var React = require("react");

function getPerson() {
  return {
    id: null,
    fullName: "Not selected",
    picture: "/assets/img/userbasic.jpg",
    selected: false
  };
}

function normalizePerson(person) {
  return {
    id: person.id,
    fullName: person.full_name,
    picture: person.picture,
    selected: true
  };
}

var ParentView = React.createClass({
  getInitialState: function() {
    var father = this.props.parent.father;
    if (!!father) {
      father = normalizePerson(father);
    } else {
      father = getPerson();
    }

    var mother = this.props.parent.mother;
    if (!!mother) {
      mother = normalizePerson(mother);
    } else {
      mother = getPerson();
    }

    return {
      father: father,
      mother: mother
    };
  },

  render: function() {
    return (
      <div className="parent-container">
        <div className="parent-title">
          Parents
        </div>
        <div className="parent-help">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
        </div>
        <div className="parent-body">
          <ul>
            <li>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.father.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Father: </span>
                  <span>{this.state.father.fullName}</span>
                </div>
                <div>
                  <a href="">Select</a>
                </div>
              </div>
            </li>
            <li>
              <div className="parent-image people-image">
                <img className="img-responsive img-rounded" alt="" src={this.state.mother.picture}/>
              </div>
              <div className="parent-info people-info">
                <div className="parent-name people-name">
                  <span>Mother: </span>
                  <span>{this.state.mother.fullName}</span>
                </div>
                <div>
                  <a href="">Select</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
module.exports = ParentView;
