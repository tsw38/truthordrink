import { computed, observable, action } from 'mobx';
import cookie from 'react-cookie';
import axios from 'axios';

class TruthStore {
  @observable truths = [];
  @observable chatroom = '';
  @observable socket = io.connect(`//${window.location.hostname}:6357`);
  @observable currentTruth = null;
  @observable questionProgress = [false,false];



  @action getRandomNumber(min,max){ return Math.floor(Math.random()*(max-min+1)+min); };

  @action setChatroom(roomName){ this.chatroom = roomName; }
  @computed get getChatroom(){return this.chatroom; }

  @action setUnansweredTruths(playersArr){
    axios.get(`/api/get-unanswered-questions/?p1=${playersArr[0]}&p2=${playersArr[1]}`)
    .then((response)=> {
      if(response.status === 200){
        let tempArr = response.data.reduce((arr,elem)=>{
          arr[elem.id-1] = elem.message;
          return arr;
        },[]);
        this.truths = tempArr;
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
  }
  @computed get getUnansweredTruths(){ return this.truths; }





  @computed get generateQuestions(){
    //Step 1: Check URL to see if both players have answered
    //        If No variables || Yes: generate Question
    //            Emit to chatroom, the question ID and question
    //Step 2: If Not both responded, do nothing
    //Step 3: update both users URLs with game state,
    if(typeof this.truths !== 'undefined'){
      let randomIndex = this.getRandomNumber(0,this.truths.length-1);
      console.log(this.truths[randomIndex]);
      this.currentTruth = this.truths[randomIndex];
    }
  }





  constructor(){
    this.truths = this.truths;
    this.socket = this.socket;
    this.chatroom = this.chatroom;
    this.currentTruth = this.currentTruth;
    this.questionProgress = this.questionProgress;
    this.getRandomNumber = this.getRandomNumber.bind(this);
  }
}


let truthStore = window.truthStore = new TruthStore
export default truthStore;
