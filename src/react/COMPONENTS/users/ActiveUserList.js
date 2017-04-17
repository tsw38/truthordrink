import React, { Component } from 'react';
import UserStore from '../../STORES/UserStore';
import { observer } from 'mobx-react';

@observer
export default class ActiveUserList extends Component{
  constructor(props){
    super(props);
  }

  render(){
    let userList = [];
    for(var uuid in UserStore.activeUsers){
      userList.push(
        <li key={uuid}>{UserStore.activeUsers[uuid]}</li>
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
