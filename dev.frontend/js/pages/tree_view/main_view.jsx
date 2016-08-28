'use strict';

const React = require('react');
const {Component} = React;

const TreeView = require('./tree_view.jsx');
const DetailModal = require('./detail_modal.jsx');


class MainView extends Component {

  render() {
    const { showMarriage } = this.props;

    return (
      <div className="tree-page">
        <div className="container site-container">
          <div className="panel panel-default">
            <div className="panel-body form-inline">
              <button onClick={this.toggleMarriages.bind(this)}
                      className={showMarriage ? 'btn btn-danger' : 'btn btn-success'}>
                { showMarriage ? 'Tắt vợ chồng' : 'Hiện vợ chồng' }
              </button>
              &nbsp;
              <div className="form-group">
                <input type="text" className="form-control" id="exampleInputName2" placeholder="Jane Doe" />
              </div>
              &nbsp;
              <button className="btn btn-default">Send invitation</button>
            </div>
          </div>
        </div>

        { this.props.initializing ?
          <div className="tree-container">
            <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
          </div>
          :
          <TreeView />
        }

          <DetailModal />
      </div>
    );
  }


  toggleMarriages() {
    const { showMarriage } = this.props;
    const { tree } = this.context;

    tree.set('showMarriage', !showMarriage);
    this.toggleEachMarriage(tree.select('pedigreeTree'));
  }


  toggleEachMarriage(cursor) {
    const person = cursor.get();

    if (person.children) {
      for(let i = 0; i < person.children.length; i++) {
        this.toggleEachMarriage(cursor.select(['children', i]));
      }
    }

    if (person._children) {
      for(let i = 0; i < person._children.length; i++) {
        this.toggleEachMarriage(cursor.select(['_children', i]));
      }
    }

    if (person.marriage) {
      cursor.set('_marriage', cursor.select('marriage').get());
      cursor.unset('marriage');
    } else {
      cursor.set('marriage', cursor.select('_marriage').get());
      cursor.unset('_marriage');
    }
  }
}


MainView.childContextTypes = {
  tree: React.PropTypes.object
};



module.exports = MainView;
