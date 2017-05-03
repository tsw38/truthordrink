import { computed, observable, action } from 'mobx';
import UserStore from './UserStore';
import cookie from 'react-cookie';
import axios from 'axios';

class TruthStore {
  @observable truths = [];
  @observable chatroom = '';
  @observable gameStarted = false;
  @observable socket = io.connect(`//${window.location.hostname}:6357`);
  @observable currentTruth = null;
  @observable questionProgress = [false,false];



  @action getRandomNumber(min,max){ return Math.floor(Math.random()*(max-min+1)+min); };

  @action setChatroom(roomName){ this.chatroom = roomName; }
  @computed get getChatroom(){return this.chatroom; }

  @action setUnansweredTruths(playersArr,callback){
    axios.get(`/api/get-unanswered-questions/?p1=${playersArr[0]}&p2=${playersArr[1]}`)
    .then((response)=> {
      if(response.status === 200){
        let tempArr = response.data.reduce((arr,elem)=>{
          arr[elem.id-1] = elem.message;
          return arr;
        },[]);
        this.truths = tempArr;
        callback();
      }
    })
    .catch((err) => {
      console.error(err.message);
      callback(false);
    });
  }

  @computed get getUnansweredTruths(){ return this.truths; }





  @action generateQuestions(){
    if(typeof this.truths !== 'undefined'){
      let randomIndex = this.getRandomNumber(0,this.truths.length-1);
      this.currentTruth = this.truths[randomIndex];
      this.addToSearchQuery('qid',randomIndex);
      this.addToSearchQuery('p1','ZmFsc2U');
      this.addToSearchQuery('p2','ZmFsc2U');
    }
  }


  @action startGame(players){
    this.gameStarted = true;
    if(!this.searchSearchQuery("c3RhcnR1ZA","dHJ1ZQ")){
      console.log("starting game");
      this.addToSearchQuery("c3RhcnR1ZA","dHJ1ZQ");
    } else {
      console.log("Game has started");
    }
    if(UserStore.isLeader){
      this.setUnansweredTruths(players,()=>{
        console.log('pulled all questions!');
        this.setGameState();

      });
    }
  }

  @action setGameState(){

    if(this.searchSearchQuery('qid',"[0-9].+")){
      console.log("Question ID EXISTS IN QUERY");
      if(this.searchSearchQuery('p1',"(0|1)") && this.searchSearchQuery('p2',"(0|1)")){
        console.log("GO TO NEXT QUESTION");
        //submit answers to DB
        //go on to new QUESTION

      } else {
        console.log("DONE FOR NOW, WAITING FOR PLAYERS RESPONSE");
      }
    } else {
      console.log("NEED TO GENERATE QUESTION");
      this.generateQuestions();
      console.log("now looping back");
      this.setGameState();
    }
  }

  //TODO
  @action updateSearchQuery(key,newValue){

  }
  //TODO
  @action submitQuestionResponse(questionID,players,response){

  }

  @action addToSearchQuery(key,value){
    if(!window.location.search.length){
      console.log("THERE ARE NO QUERIES");
      window.history.pushState(
        { path:window.location.href }, '',
        window.location.href + `?${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    } else {
      console.log("THERE ARE QUERIES!!!");
      if(!this.searchSearchQuery(key,value)){
        window.history.pushState(
          { path:window.location.href }, '',
          window.location.href + `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        );
      }
    }
  }

  @action searchSearchQuery(key,value){
    let query = window.location.search;
    if(query.length){
      query = query.split("?")[1].split("&");
      query = query.reduce(function(obj,elem){
        elem = elem.split("=");
        obj[elem[0]] = elem[1];
        return obj;
      },{});
      if(key in query){
        if(typeof value === 'undefined'){ //general key search
          return true;
        } else {
          let valueRegex = new RegExp(""+value);
          if(valueRegex.test(query[key])){
            return true;
          } else {
            return false;
          }
        }

      }
    }
    return false;
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
