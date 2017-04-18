import React, { Component } from 'react';
import cookie from 'react-cookie';
import UserActions from '../../ACTIONS/UserActions';

export default class ActiveUser extends Component{
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
      let _me = me.substring(0,36);
      if(_me !== this.state.uuid && typeof group === 'undefined'){
        UserActions.askToJoinRoom(_me,this.state.uuid);
      }
      if(typeof group !== 'undefined'){
        console.log("you are already in a group");
      }
    } else {
      console.log('you need to sign in');
    }

  }

  render(){
    return(
      <li
        key={this.props.uuid}
        onClick={this.handleOnActiveClick}>
        {this.props.user}
      </li>
    );
  }
}
