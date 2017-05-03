import React, { Component } from 'react';
import { observer, action } from 'mobx-react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore';
import UserStore from '../STORES/UserStore';
import CardWrapper from './CardWrapper';
import cookie from 'react-cookie';
import Question from './Question';

@observer
export default class Game extends Component{
  constructor(props){
    super(props);
    this.incorrectURLQuery = this.incorrectURLQuery.bind(this);
  }

  componentWillMount(){
    this.incorrectURLQuery(()=>{
      let group = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
      let me    = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg').substring(0,36);
      let isLeader = group.substring(0,36);
      UserStore.setLeader(!(isLeader==me));
      UserStore.setWhoIAm(me);

      if(!(isLeader==me)){
        UserStore.setGamePlayers([isLeader,me]);
      } else {
        UserStore.setGamePlayers([me,group.substring(37,73)]);
      }
      //lastly start the game
      TruthStore.startGame(UserStore.getGamePlayers);
    });
  }

  componentDidMount(){
    if(UserStore.getLeader){ // only the leader will request the questions
      // TruthStore.setUnansweredTruths([group.substring(0,36),group.substring(37,73)])
    }
    // if(!(this.state.leader == me)){ // only the leader will request the questions
    //
    //   // TruthStore.getUnansweredTruths()
    // }
  }

  incorrectURLQuery(cb){
    let group = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    if(typeof group === 'undefined' && window.location.pathname !== "/"){
      window.location = "/";
      return;
    }
    cb();
  }

  render(){
    return(
      <div className="content-wrapper">
        <MainIcon />
        <CardWrapper store={TruthStore}>
          <Question />
        </CardWrapper>
      </div>
    )
  }
};
