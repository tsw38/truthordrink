import React, { Component } from 'react';
import UserStore from '../../STORES/UserStore';
import { observer } from 'mobx-react';
import ActiveUser from './ActiveUser';

@observer export default class ActiveUserList extends Component{
  constructor(props){
    super(props);
  }

  render(){
    let userList = [];
    UserStore.activeUsers.forEach((val,key,obj)=>{
      userList.push(
        <ActiveUser
          key={key}
          user={val}
          uuid={key}
        />
      )
    })
    return(
      <div className="right active-users">
        <ul>
          {userList}
        </ul>
      </div>
    );
  }
}
