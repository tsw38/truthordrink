import React, { Component } from 'react';

export default class CardWrapper extends Component{
  render() {
    return(
      <div className="card-wrapper">
        {this.props.children}
      </div>
    );
  }
}
