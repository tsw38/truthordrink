import React, { Component } from 'react';
import cookie from 'react-cookie';
import UserStore from '../../STORES/UserStore';

export default class User extends Component{
  constructor(props){
    super(props);
    this.state = {
      name:this.props.user || '',
      uuid:this.props.uuid || ''
    }
    this.handleOnActiveClick = this.handleOnActiveClick.bind(this);
  }

  handleOnActiveClick(ex){
    let me = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');
    let group = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    if(me.length > 36){
      let _me = me.substring(0,36)
      if(this.state.uuid !== _me){
        if(typeof group === 'undefined'){
          UserStore.socket.emit('room',[_me, this.state.uuid]);
        }
        else if(typeof group !== 'undefined'){
          // console.error("you are already in a group");
        }
      } else {
        // console.error('you clicked on yourself');
      }
    } else {
      // console.error('you need to sign in');
    }
  }

  render(){
    let me = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');
    return(
      <li
        key={this.props.uuid}
        onClick={this.handleOnActiveClick}>
        <span className="wrapper">
          {this.props.user}
          {me.match(this.props.uuid) &&
            <span>(you)</span>
          }
        </span>
      </li>
    );
  }
}
