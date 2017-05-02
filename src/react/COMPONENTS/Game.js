import React, { Component } from 'react';
import { observer, action } from 'mobx-react';
import MainIcon from './MainIcon';
import TruthStore from '../STORES/TruthStore';
import CardWrapper from './CardWrapper';
import cookie from 'react-cookie';
import Question from './Question';

@observer
export default class Game extends Component{
  constructor(props){
    super(props);

    this.state = {
      leader: '',
      chatroom:''
    }

  }

  componentWillMount(){
    let group = cookie.load('DHJ1dGhvcmRyaW5rZ3JvdXA');
    let me    = cookie.load('dHJ1dGhvcmRyaW5rdXNlcg').substring(0,36);
    let leader = group.substring(0,36);
    this.setState({
      leader:(leader == me) ? false : true
    })
    if(!(leader == me)){ // only the leader will request the questions
      TruthStore.getUnansweredTruths([group.substring(0,36),group.substring(37,73)])
    }
  }
  componentDidMount(){
    // console.log(TruthStore.unansweredTruths);
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
