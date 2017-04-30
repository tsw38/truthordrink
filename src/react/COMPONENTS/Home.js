import React, { Component } from 'react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore.js';
import CardWrapper from './CardWrapper';
import Login from './Login';
import ActiveUsers from './ActiveUsers';
import cookie from 'react-cookie';

export default class Home extends Component{
  render(){
    let gameCookie = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');

    if(gameCookie.length){
      window.location = `/game/${gameCookie}`
    }

    return(
      <div>
        {gameCookie.length ?
          <div></div> : (
          <div className="content-wrapper">
            <MainIcon />
            <CardWrapper store={TruthStore}>
              <Login />
              <ActiveUsers />
            </CardWrapper>
          </div>
        )}
      </div>
    )
  }
};
