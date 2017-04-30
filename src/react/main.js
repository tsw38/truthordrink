import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from './COMPONENTS/Home';
import Game from './COMPONENTS/Game';

const DOC_ROOT = document.getElementById('app');

class App extends Component{
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/game/:hash" component={Game} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App/>, DOC_ROOT);
