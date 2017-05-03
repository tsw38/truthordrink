import { computed, observable, action } from 'mobx';
import cookie from 'react-cookie';


class UserStore {
  @observable activeUsers = observable.map();
  @observable isLeader = '';
  @observable players = []; // index 0: leader; index 1: player 2
  @observable me = '';
  @observable leader = '';
  @observable socket = io.connect(`//${window.location.hostname}:6357`);

  @action deleteUser(uuid){ delete this.activeUsers[uuid]; }
  @computed get allActiveUsers(){ return this.activeUsers; }

  @action setWhoIAm(me){this.me = me};
  @computed get whoAmI(){return this.me};

  @action setLeader(status){ this.isLeader = status; };
  @computed get getLeader(){return this.isLeader; };

  @action setGamePlayers(arr){ this.players = arr; }
  @computed get getGamePlayers(){ return this.players; }


  constructor(){
    this.activeUsers = this.activeUsers;
    this.socket = this.socket;
    this.me = this.me;
    this.leader = this.leader;
    this.players = this.players;
  }
}


let userStore = window.userStore = new UserStore
export default userStore
