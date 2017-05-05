import React, {Component} from 'react';
import { observer, action } from 'mobx-react';
import TruthStore from '../STORES/TruthStore.js';

@observer
export default class Question extends Component{
  constructor(props){
    super(props);
  }

  render(){
    // console.log("______________RENDER")
    // console.log(TruthStore.getUnansweredTruths.peek());
    // console.log("______________RENDER\n\n\n")
    return(
      <div className="question-wrapper">

        <div className="row question">
          <p>{TruthStore.currentTruth}</p>
        </div>
        <div className="row vote">
          <div className="drink"><div className="image"></div></div>
          <div className="truth"><div className="image"></div></div>
        </div>
      </div>
    )
  }
}
