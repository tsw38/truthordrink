import React, { Component } from 'react';
import Login from './Login';
import ActiveUsers from './ActiveUsers';

export default class CardWrapper extends Component{
  render() {
    return(
      <div className="card-wrapper">
        <Login />
        <ActiveUsers />
      </div>
    );
  }
}
