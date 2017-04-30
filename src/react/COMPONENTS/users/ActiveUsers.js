import React, { Component } from 'react';
import cookie from 'react-cookie';
import { observer } from 'mobx-react';

import UserStore from './../../STORES/UserStore';
import User from './User';

@observer
export default class ActiveUsers extends Component{
  constructor(props){
    super(props);
    this.generateList = this.generateList.bind(this);
  }

  componentDidMount(){
    let hasGroup = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    let isLeader = '';
    let newRoom  = '';

    UserStore.socket.on('from server', (message)=>{
      if('leader' in message && !isLeader.length){
        isLeader = (message.leader) ? 'bGVhZGVy' : 'Zm9sbG93ZXI';
      }
      if('newRoom' in message && !newRoom.length){
        newRoom = message.newRoom;
      }
      if(newRoom.length && isLeader.length){
        const val = `${message.roomsArr[0]}-${message.roomsArr[1]}-${newRoom}`;
        cookie.save('DHJ1dGhvcmRyaW5rZ3JvdXA', `${val}`);
        window.location = `game/${val}`;
      }
    });

    UserStore.socket.on('user joined', (message)=>{
      for(var uuid in message.activeUsers){
        UserStore.activeUsers.set(uuid, {
          name:message.activeUsers[uuid].name,
          private:message.activeUsers[uuid].private
        });
      }
    });
  }

  generateList(){
    let _activeUsers = UserStore.activeUsers.toJS();
    let userList = [];
    for(let key in _activeUsers){
      if(!_activeUsers[key].private){
        userList.push(
          <User
            key={key}
            user={_activeUsers[key].name}
            uuid={key}
          />
        )
      }
    }
    return userList;
  }

  render(){
    return(
      <div className="right active-users">
        <strong>Active Users</strong>
        <ul>
          {this.generateList()}
        </ul>
      </div>
    );
  }
}
