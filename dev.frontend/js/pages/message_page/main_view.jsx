'use strict';

const React = require('react');
const {Component} = React;


module.exports = class MainView extends Component {
  render() {
    const params = window.params;

    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className={`panel panel-${params.class}`}>
            <div className="panel-heading">
              <h1 className="panel-title">{ params.title }</h1>
            </div>
            <div className="panel-body">
              <p>
                { params.message }
              </p>
              { params.redirect ?
                <p>
                  Tự động quay về { params.text } trong 5 giây
                </p>
                :
                ''
              }
            </div>
            <div className="panel-footer">
              <a className="btn btn-default" href="/" role="button">Về trang chủ</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
