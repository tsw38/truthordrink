import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const DOC_ROOT = document.getElementById('app');

class App extends Component{
  render() {
    return <p>Hello Reaawdawdct!</p>;
  }
}

ReactDOM.render(<App/>, DOC_ROOT);
