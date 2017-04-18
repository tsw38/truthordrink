import React, { Component } from 'react';
import cookie from 'react-cookie';
import { observer } from 'mobx-react';
import ActiveUserList from './users/ActiveUserList';
import UserStore from '../STORES/UserStore';
import UserActions from '../ACTIONS/UserActions';

@observer
export default class ActiveUsers extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    let hasGroup = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    let isLeader = '';
    UserStore.socket.on('from server', (message)=>{
      if('leader' in message && !isLeader.length){
        isLeader = (message.leader) ? 'bGVhZGVy' : 'Zm9sbG93ZXI';
      }
      else if(typeof hasGroup === 'undefined' && ('p1' in message)){
        const val = `${message.p1.uuid}=${message.p2.uuid}=${isLeader}`;
        cookie.save('DHJ1dGhvcmRyaW5rZ3JvdXA', `${val}`);
        UserStore.socket.emit('delete group',message);
      }
      console.log(message);
    });
    UserStore.socket.on('global delete',(payload)=>{
      console.log(")))))))))))))))))))))))))))))))))")
      console.log(payload.p1.uuid);
      console.log(payload.p2.uuid);
      UserActions.deleteUser(payload.p1.uuid);
      // UserActions.deleteUser(payload.p2.uuid);
      console.log(")))))))))))))))))))))))))))))))))")
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
