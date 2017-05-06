import { computed, observable, action } from 'mobx';
import UserStore from './UserStore';
import cookie from 'react-cookie';
import axios from 'axios';

class TruthStore {
  @observable tempStore = '';
  @observable truths = [];
  @observable chatroom = '';
  @observable gameStarted = false;
  @observable socket = io.connect(`//${window.location.hostname}:6357`);
  @observable currentTruth = null;
  @observable questionID = 0;
  @observable gameState = "";
  @observable questionProgress = [false,false];

  @computed get getGameState(){ return this.gameState; }
  @action setGameState(newState = ""){ this.gameState = newState; }

  @computed get getTempStore(){ return this.tempStore; }
  @action getRandomNumber(min,max){ return Math.floor(Math.random()*(max-min+1)+min); };

  @action setChatroom(roomName){ this.chatroom = roomName; }
  @computed get getChatroom(){return this.chatroom; }

  @computed get getQuestionID(){ return this.questionID; }

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

  @action setCurrentTruth(truth){this.currentTruth = truth; }
  @computed get getCurrentTruth(){ return this.currentTruth }

  @action generateQuestions(){
    if(typeof this.truths !== 'undefined'){
      let randomIndex = this.getRandomNumber(0,this.truths.length-1);
      this.currentTruth = this.truths[randomIndex];
      this.questionID = randomIndex;
      this.updateGameStateCookie('qid',randomIndex,()=>{
        this.updateGameStateCookie('p1','ZmFsc2U',()=>{
          this.updateGameStateCookie('p2','ZmFsc2U');
        });
      });
    }
  }


  @action startGame(players){
    this.gameStarted = true;
    //first everyone must join the game room
    this.socket.emit('gameroom-initialize',{ room: this.chatroom });
    if(UserStore.isLeader){
      this.setUnansweredTruths(players, ()=>{
        this.setGameState();
      });
    } else {
    }

  }

  // FUNC: Initialize the game,
  // sets the current question if necessary
  @action setGameState(){
    //value end up being qid-p1-p2
    let questionStateCookie = cookie.load('Z2FtZS1zdGF0ZQ');
    if(typeof questionStateCookie === 'undefined'){
      this.generateQuestions();
    } else {
      let progress = this.computeGameState();
      if(progress.p1.length === 1 && progress.p2.length === 1){}
      else {
        this.currentTruth = this.truths[parseInt(progress.qid,10)];
        this.questionID = parseInt(progress.qid,10);
        this.socket.emit('gameroom',{
          chatroom: this.chatroom,
          fromLeader:true,
          question: this.currentTruth
        });
      }
    }
  }

  @action setGameProgress(player,response){ this.questionProgress[player] = response; }

  @action updateGameStateCookie(key,value,cb = ''){
    this.gameState = `${this.gameState}.${key}-${value}`;
    if(typeof cb === 'function') cb();
    else {
      this.socket.emit('gameroom',{
        chatroom: this.chatroom,
        fromLeader:true,
        question: this.currentTruth,
        reset:true
      });
      this.gameState = this.gameState.substring(1,this.gameState.length);
      cookie.save('Z2FtZS1zdGF0ZQ',btoa(this.gameState).replace(/\=/g,''));
    }
  }

  @action computeGameState(){
    let questionStateCookie = cookie.load('Z2FtZS1zdGF0ZQ');
    if(typeof questionStateCookie !== 'undefined'){
      questionStateCookie = atob(questionStateCookie).split('.');
      questionStateCookie = questionStateCookie.reduce((obj, elem)=>{
        elem = elem.split("-");
        obj[elem[0]] = elem[1];
        return obj;
      },{});
      return questionStateCookie;
    } else {
      return false;
    }
  }

  @action submitQuestionResponse(isLeader, response){
    if(!isLeader){ // only do this if coming from someone else
      this.socket.emit('gameroom',{
        voting:true,
        isLeader,
        chatroom:this.chatroom,
        response
      });
    } else {
      this.questionProgress[0] = response;

      if(this.getQuestionResponse[0] !== false && this.getQuestionResponse[1] !== false){
        this.finalizeResponses();
      }
    }
  }
  @action setGameProgress(player,response){ this.questionProgress[player] = response; }
  @computed get getQuestionResponse(){ return this.questionProgress; }


  @action finalizeResponses(){
    let players = UserStore.getGamePlayers;
    axios.post(`/api/submit-truth-response/`,{
      players,
      qID: this.questionID,
      responses: this.questionProgress
    })
    .then((response)=> {
      if(response.status === 200){
        this.truths.splice(this.questionID,1);
        this.generateQuestions();
        this.questionProgress = [false,false];
      }
    })
    .catch((err) => {
      console.error(err.message);
      callback(false);
    });
  }


  constructor(){
    this.gameState = this.gameState;
    this.tempStore = this.tempStore;
    this.truths = this.truths;
    this.socket = this.socket;
    this.chatroom = this.chatroom;
    this.currentTruth = this.currentTruth;
    this.questionProgress = this.questionProgress;
    this.questionID = this.questionID;
    this.getRandomNumber = this.getRandomNumber.bind(this);
  }
}

let truthStore = window.truthStore = new TruthStore
export default truthStore;
