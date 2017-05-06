import React, {Component} from 'react';
import { observer, action } from 'mobx-react';
import TruthStore from '../STORES/TruthStore.js';
import UserStore from '../STORES/UserStore.js';

@observer
export default class Question extends Component{
  constructor(props){
    super(props);
    this.handleVoting = this.handleVoting.bind(this);
    this.state = {
      truth: false,
      drink: false
    }
  }

  handleVoting(score,category){
    if(!(this.state.drink || this.state.truth)){
      TruthStore.submitQuestionResponse(UserStore.isLeader, score);

      if(/drink/.test(category)){
        this.setState({
          drink:true
        });
      } else {
        this.setState({
          truth:true
        });
      }
    }
  }

  componentDidMount(){
    TruthStore.socket.on('from leader',(payload)=>{
      if("reset" in payload){
        this.setState({
          truth:false,
          drink:false
        });
      }
    });
  }

  render(){
    return(
      <div className="question-wrapper">
        <div className="row question">
          <p>{TruthStore.currentTruth}</p>
        </div>
        <div className="row vote">
          <div
            className={(this.state.drink) ? 'drink voted': 'drink'}
            onClick={()=>{this.handleVoting(0,"drink")}}>
            <div className="image"></div>
          </div>
          <div
            className={(this.state.truth) ? 'truth voted': 'truth'}
            onClick={()=>{this.handleVoting(1,"truth")}}>
            <div className="image"></div>
          </div>
        </div>
      </div>
    )
  }
}
