import { observable, action } from 'mobx';
import cookie from 'react-cookie';
import axios from 'axios';

class TruthStore {
  @observable truths = [];
  @observable socket = io.connect(`//${window.location.hostname}:6357`);
  @observable currentTruth = null;
  @observable questionProgress = [false,false];



  @action getUnansweredQuestions(playersArr){
    axios.get(`/api/get-unanswered-questions/?p1=${playersArr[0]}&p2=${playersArr[1]}`)
    .then((response)=> {
      if(response.status === 200){
        let tempArr = response.data.reduce((arr,elem)=>{
          arr[elem.id-1] = elem.message;
          return arr;
        },[]);
        TruthStore.truths = tempArr;
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
  };
  @action getRandomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  @action generateQuestions(){
    if(typeof TruthStore.truths !== 'undefined'){
      let randomIndex = this.getRandomNumber(0,TruthStore.truths.length-1);
      console.log(TruthStore.truths[randomIndex]);
      TruthStore.currentTruth = TruthStore.truths[randomIndex];
    }
  }







  constructor(){
    this.truths = this.truths;
    this.socket = this.socket;
    this.currentTruth = this.currentTruth;
    this.questionProgress = this.questionProgress;

    this.getRandomNumber = this.getRandomNumber.bind(this);
  }
}


let truthStore = window.truthStore = new TruthStore
export default truthStore;
