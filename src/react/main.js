import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
// import MainIcon from './COMPONENTS/MainIcon';
// import CardWrapper from './COMPONENTS/CardWrapper';
import Home from './COMPONENTS/Home';
import Game from './COMPONENTS/Game';

const DOC_ROOT = document.getElementById('app');

class App extends Component{
  render() {
    return(
      <Router>
        <div>
          <Route exact path="/" component={Home} handler={()=>{console.log("hello world")}} />
          <Route exact path="/game/:hash" component={Game} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App/>, DOC_ROOT);
