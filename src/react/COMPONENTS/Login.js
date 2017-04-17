import React, { Component } from 'react';
import cookie from 'react-cookie';
import UserActions from '../ACTIONS/UserActions';
import { observer } from 'mobx-react';

@observer
export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: this.oldUser() || '',
      isset: (this.oldUser().length) ? true : false,
      uuid: '',
      socket: io.connect(`//${window.location.hostname}:6357`)
    }
    this.oldUser = this.oldUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
  }

  componentDidMount(){
    const _uuid = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');
    let socket = this.state.socket;

    const activeUser = {
      UUID: _uuid.substring(0,36),
      username: this.state.username
    };



    socket.on('connect',()=>{
      if(activeUser.UUID.length){
        socket.emit('add me',activeUser);
      }
    });

    socket.on('user joined',(data) =>{
      UserActions.updateActiveUsers(data.activeUsers);
    });

    socket.on('user left', (user) =>{ UserActions.deleteUser(user); });
  }

  handleSubmit(event){
    let socket = this.state.socket;

    event.preventDefault();
    let encryptedName = btoa(this.state.username).replace(/\=/g,'');
    let currentCookie = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg');

    cookie.save('dHJ1dGhvcmRyaW5rdXNlcg', `${currentCookie}-${encryptedName}`)

    this.setState({
      isset:true,
      uuid: currentCookie.substring(0,36)
    });

    socket.emit('add me',{
      username: this.state.username,
      UUID: currentCookie.substring(0,36)
    });
  }

  oldUser(){
    let _cookie = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg') || '';
    let username = '';

    if(_cookie.length > 36){
      username = _cookie.substring(_cookie.indexOf('-',36)+1,_cookie.length);
      username = atob(username);
    }
    return (_cookie.length > 36) ? username : '';
  }

  handleNameUpdate(event){
    this.setState({username:event.target.value});
  }

  render(){
    let { isset } = this.state;
    if(isset){
      return(
        <div className="left logged-in">
          <h2>Welcome, {this.state.username}</h2>
          <p>Please choose a user to create a game with</p>
        </div>
      );
    } else {
      return(
        <div className="left sign-in">
          <h2>Enter Username</h2>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:<br />
              <input type="text" value={this.state.username} onChange={this.handleNameUpdate} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    }

  }
}
