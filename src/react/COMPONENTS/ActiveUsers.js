import React, { Component } from 'react';
import cookie from 'react-cookie';
import { observer } from 'mobx-react';
import ActiveUserList from './users/ActiveUserList';



@observer
export default class ActiveUsers extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="right active-users">
        <ActiveUserList />
      </div>
    );
  }
}
