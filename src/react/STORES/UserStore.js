import { computed, observable, action } from 'mobx';
import cookie from 'react-cookie';


class UserStore {
  @observable activeUsers = observable.map();
  @observable me = '';
  @observable leader = '';
  @observable socket = io.connect(`//${window.location.hostname}:6357`);

  @action
  deleteUser(uuid){
    delete this.activeUsers[uuid];
  }
  @computed get allActiveUsers(){
    return this.activeUsers;
  }



  constructor(){
    this.activeUsers = this.activeUsers;
    this.socket = this.socket;
    this.me = this.me;
    this.leader = this.leader;

    this.deleteUser = this.deleteUser.bind(this);
  }
}


let userStore = window.userStore = new UserStore
export default userStore
