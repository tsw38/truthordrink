import React, { Component } from 'react';
import cookie from 'react-cookie';
import { observer } from 'mobx-react';

import UserStore from './../../STORES/UserStore';
import TruthStore from './../../STORES/TruthStore';
import User from './User';

@observer
export default class ActiveUsers extends Component{
  constructor(props){
    super(props);
    this.generateList = this.generateList.bind(this);
    this.gameInProgress = this.gameInProgress.bind(this);
    this.isChatroomAndUserSet = this.isChatroomAndUserSet.bind(this);
  }

  componentDidMount(){
    let hasGroup = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');

    UserStore.socket.on('from server', (message)=>{
      if('leader' in message){
        console.log('leader is',message);
        const isLeader = (message.leader) ? 'bGVhZGVy' : 'Zm9sbG93ZXI';
        UserStore.setLeader(isLeader);
      }
      if('newRoom' in message){
        const newRoom = message.newRoom;
        TruthStore.setChatroom(newRoom);
      }

      if(this.isChatroomAndUserSet(message)){
        const val = `${message.roomsArr[0]}-${message.roomsArr[1]}-${TruthStore.getChatroom}`;
        cookie.save('DHJ1dGhvcmRyaW5rZ3JvdXA', `${val}`);
        window.location = `game/${TruthStore.getChatroom}`;
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

    this.gameInProgress();
  };

  isChatroomAndUserSet(message){
    return(
      typeof truthStore.getChatroom !== 'undefined' &&
      typeof userStore.getLeader !== 'undefined' &&
      typeof message.roomsArr !== 'undefined'
    );
  }

  gameInProgress(){
    if(UserStore.getLeader.length){
      console.log("THIS IS DEFINED");
    } else {
      return;
      console.log("THIS IS NOT DEFINED");
    }
  }

  generateList(){
    let _activeUsers = UserStore.allActiveUsers.toJS();
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
