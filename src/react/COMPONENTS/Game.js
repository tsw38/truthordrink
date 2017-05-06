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
      let gameCookie = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
          gameCookie = gameCookie.split(/\-/g);
          gameCookie = gameCookie[gameCookie.length - 1];
      TruthStore.setChatroom(gameCookie);
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

    //if the user is not the leader, check for game question cookie and read it
    var gameQuestion = cookie.load('Z2FtZS1xdWVzdGlvbg');
    if(typeof gameQuestion !== 'undefined'){
      TruthStore.setCurrentTruth(atob(gameQuestion));
    }
  }

  componentDidMount(){
    if(UserStore.getLeader){ // only the leader will request the questions
      TruthStore.socket.on('from follower',(payload)=>{
        if("voting" in payload){
          TruthStore.setGameProgress(1,payload.response);

          if(TruthStore.getQuestionResponse[0] !== false && TruthStore.getQuestionResponse[1] !== false){
            TruthStore.finalizeResponses();
          }
        }
      });
    } else {
      TruthStore.socket.on('from leader',(payload)=>{
        if("question" in payload){
          TruthStore.setCurrentTruth(payload.question);
          cookie.save('Z2FtZS1xdWVzdGlvbg', btoa(payload.question).replace(/\=/g,''));
        }
      });
    }
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
