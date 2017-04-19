import React, { Component } from 'react';
import cookie from 'react-cookie';
import { observer } from 'mobx-react';
import ActiveUserList from './users/ActiveUserList';
import UserStore from '../STORES/UserStore';

@observer
export default class ActiveUsers extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    let hasGroup = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    let isLeader = '';
    let newRoom  = '';
    UserStore.socket.on('user joined', (message)=>{
      for(var uuid in message.activeUsers){
        UserStore.activeUsers.set(uuid, {
          name:message.activeUsers[uuid].name,
          private:message.activeUsers[uuid].private
        });
      }
    });

    UserStore.socket.on('from server', (message)=>{
      if('leader' in message && !isLeader.length){
        isLeader = (message.leader) ? 'bGVhZGVy' : 'Zm9sbG93ZXI';
      }
      if('newRoom' in message && !newRoom.length){
        newRoom = message.newRoom;
      }
      if(newRoom.length && isLeader.length){
        const val = `${message.roomsArr[0]}=${message.roomsArr[1]}=${isLeader}`;
        cookie.save('DHJ1dGhvcmRyaW5rZ3JvdXA', `${val}`);
      }
    });
  }

  render(){
    return(
      <div className="right active-users">
        <ActiveUserList />
      </div>
    );
  }
}
