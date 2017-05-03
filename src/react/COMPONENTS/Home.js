import React, { Component } from 'react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore.js';
import CardWrapper from './CardWrapper';
import Login from './Login';
import ActiveUsers from './users/ActiveUsers';
import cookie from 'react-cookie';

export default class Home extends Component{
  render(){
    let gameCookie = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');

    if(typeof gameCookie !== 'undefined'){
      gameCookie = gameCookie.split(/\-/g);
      gameCookie = gameCookie[gameCookie.length - 1];
      window.location = `/game/${gameCookie}`;
    } else {
      if(window.location.pathname !== "/"){
        window.location = `/`;
      }
    }

    return(
      <div>
        {typeof gameCookie !== 'undefined' ?
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
