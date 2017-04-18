import React, { Component } from 'react';
import UserStore from '../../STORES/UserStore';
import { observer } from 'mobx-react';
import ActiveUser from './ActiveUser';

@observer
export default class ActiveUserList extends Component{
  constructor(props){
    super(props);
  }

  render(){
    let userList = [];
    for(var uuid in UserStore.activeUsers){
      userList.push(
        <ActiveUser
          key={uuid}
          user={UserStore.activeUsers[uuid]}
          uuid={uuid}
        />
      )
    }
    return(
      <div className="right active-users">
        <ul>
          {userList}
        </ul>
      </div>
    );
  }
}
