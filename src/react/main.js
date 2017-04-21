import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MainIcon from './COMPONENTS/MainIcon';
import CardWrapper from './COMPONENTS/CardWrapper';
import TruthStore from './STORES/TruthStore.js';

const DOC_ROOT = document.getElementById('app');

class App extends Component{
  render() {
    return(
      <div className="content-wrapper">
        <MainIcon />
        <CardWrapper store={TruthStore}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, DOC_ROOT);
