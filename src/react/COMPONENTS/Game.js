import React, { Component } from 'react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore.js';
import CardWrapper from './CardWrapper';

export default class Game extends Component{
  render(){
    return(
      <div className="content-wrapper">
        <MainIcon />
        <CardWrapper store={TruthStore}>
        </CardWrapper>
      </div>
    )
  }
};
