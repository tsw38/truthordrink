import React, { Component } from 'react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore.js';
import CardWrapper from './CardWrapper';

export default class Home extends Component{
  render(){
    return(
      <div className="content-wrapper">
        <MainIcon />
        <CardWrapper store={TruthStore}/>
      </div>
    )
  }
};
