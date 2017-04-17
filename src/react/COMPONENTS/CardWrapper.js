import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TruthActions from '../Actions/TruthActions';
import Login from './Login';
import ActiveUsers from './ActiveUsers';

@observer
export default class CardWrapper extends Component{
  // constructor(props){
  //   super(props);
  //
  // }
  componentWillMount(){
    // TruthActions.getOneTruth();
  }



  render() {
    return(
      // <div className="card-wrapper">{this.props.store.truths[0]}</div>
      <div className="card-wrapper">
        <Login />
        <ActiveUsers />
      </div>
    );
  }
}
