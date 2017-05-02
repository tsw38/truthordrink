import React, {Component} from 'react';
import { observer, action } from 'mobx-react';
import TruthStore from '../STORES/TruthStore.js';

@observer
export default class Question extends Component{
  constructor(props){
    super(props);
  }

  render(){
    // let currentQuestion = TruthStore.currentTruth;
    console.log("______________RENDER")
    console.log(TruthStore.unansweredTruths.peek());
    console.log("______________RENDER\n\n\n")
    return(
      <div className="question-wrapper">

        <div className="row">
          <p>{TruthStore.currentTruth}</p>
        </div>
        <div className="row">
          <div className="drink"></div>
          <div className="truth"></div>
        </div>
      </div>
    )
  }
}
