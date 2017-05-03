import React, { Component } from 'react';
import cookie from 'react-cookie';
import UserStore from '../STORES/UserStore';

import { observer, action } from 'mobx-react';

@observer
export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: this.oldUser() || '',
      isset: (this.oldUser().length) ? true : false,
      uuid: '',
    }
    this.oldUser = this.oldUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
  }

  componentDidMount(){
    let _uuid     = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');
    let isPrivate = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');

    const activeUser = {
      UUID: _uuid.substring(0,36),
      name: this.state.name,
      error:false,
      private: (typeof isPrivate !== 'undefined') ? true : false
    };

    UserStore.setWhoIAm(_uuid.substring(0,36));

    UserStore.socket.on('connect',()=>{
      if(activeUser.UUID.length){
        UserStore.socket.emit('add me',activeUser);
        UserStore.socket.emit('room',[activeUser.UUID]);
      }
    });

    UserStore.socket.on('user left', (user) =>{
      if(typeof user === 'string'){
        UserStore.activeUsers.delete(user);
      }
    });
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.name.trim().length){
      let isPrivate = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');

      let encryptedName = btoa(this.state.name).replace(/\=/g,'');
      let currentCookie = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');

      cookie.save('dHJ1dGhvcmRyaW5rdXNlcg', `${currentCookie}-${encryptedName}`)

      this.setState({
        isset:true,
        uuid: currentCookie.substring(0,36),
        error:false
      });

      UserStore.socket.emit('add me',{
        name: this.state.name || '',
        UUID: currentCookie.substring(0,36),
        private: (typeof isPrivate !== 'undefined') ? true : false
      });
    } else {
      this.setState({
        error:true
      });
    }
  }

  oldUser(){
    let _cookie = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg') || '';
    let name = '';

    if(_cookie.length > 36){
      name = _cookie.substring(_cookie.indexOf('-',36)+1,_cookie.length);
      name = atob(name);
    }
    return (_cookie.length > 36) ? name : '';
  }

  handleNameUpdate(event){
    this.setState({
      name:event.target.value
    });
    if(this.state.error){
      this.setState({
        error:false
      });
    }
  }

  render(){
    let { isset } = this.state;
    if(isset){
      return(
        <div className="left logged-in">
          <h2>Welcome <span>{this.state.name}</span>,</h2>
          <p>Please choose a user to drink with.</p>
        </div>
      );
    } else {
      return(
        <div className="left sign-in">
          <h2 className={this.state.error ? "error" : ''}>Enter Username</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.name}
              className={this.state.error ? "error" : ''}
              onChange={this.handleNameUpdate}
            />
            <input
              type="submit"
              className={this.state.error ? "error" : ''}
              value="Submit"
            />
          </form>
        </div>
      );
    }

  }
}
